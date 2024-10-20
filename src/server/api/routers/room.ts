import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  userProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const roomRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        page: z.number().default(1),
        take: z.number().default(10),
        sort: z.enum(["asc", "desc"]).default("desc"),
        dontPaginate: z.boolean().default(false),
      }),
    )
    .query(async ({ ctx, input }) => {
      const select = {
        id: true,
        createdAt: true,
        updatedAt: true,
        category: true,
        images: true,
        name: true,
        price: true,
        ratings: true,
        reviews: true,
        user: { select: { id: true, name: true, email: true, image: true } },
      };

      if (input.dontPaginate) {
        const rooms = await ctx.db.room.findMany({
          orderBy: { updatedAt: input.sort },
          select,
        });

        return { rooms };
      }

      const skip = (input.page - 1) * input.take;
      const rooms = await ctx.db.room.findMany({
        skip,
        take: input.take,
        orderBy: { updatedAt: input.sort },
        select,
      });

      return { rooms };
    }),

  getOne: publicProcedure
    .input(z.object({ roomId: z.string().cuid("Id is not valid") }))
    .query(async ({ ctx, input }) => {
      const room = await ctx.db.room.findFirst({
        where: { id: input.roomId },
        include: {
          reviews: { include: { user: true } },
          bookings: {
            select: {
              id: true,
              userId: true,
              roomId: true,
              reviewAdded: true,
            },
          },
          images: true,
        },
      });

      return { room };
    }),

  create: adminProcedure
    .input(
      z.object({
        images: z.array(z.string()),
        name: z.string(),
        address: z.string(),
        airConditioned: z.boolean(),
        breakfast: z.boolean(),
        category: z.enum(["KING", "SINGLE", "TWINS"]),
        description: z.string(),
        guestCapacity: z.number(),
        internet: z.boolean(),
        numOfBeds: z.number(),
        petsAllowed: z.boolean(),
        price: z.number(),
        roomCleaning: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const images = (
        await Promise.all(
          input.images.map((image) =>
            ctx.cd.uploader.upload(image, { folder: "bookit/rooms" }),
          ),
        )
      ).map((img) => ({ url: img.secure_url, public_id: img.public_id }));

      const adminUser = ctx.session.user;

      // this will also create the roomImages on the fly
      const room = await ctx.db.room.create({
        data: {
          ...input,
          images: { create: images  },
          user: { connect: { id: adminUser.id } },
        },
      });

      return { room };
    }),

  deleteAll: adminProcedure.mutation(async ({ ctx }) => {
    const rooms = await ctx.db.room.findMany({ select: { images: true } });
    const promises: Promise<unknown>[] = [];

    rooms.forEach((room) =>
      room.images.forEach((image) => {
        promises.push(ctx.cd.uploader.destroy(image.public_id));
      }),
    );

    const [deletedRooms] = await Promise.all([
      ctx.db.room.deleteMany(),
      ...promises,
    ]);

    return { roomsDeletedCount: deletedRooms.count };
  }),

  delete: adminProcedure
    .input(z.object({ roomId: z.string().cuid("Id is not valid") }))
    .mutation(async ({ ctx, input }) => {
      const room = await ctx.db.room.findFirst({
        where: { id: input.roomId },
        include: { images: true },
      });

      if (!room) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Room not found",
        });
      }

      await Promise.all(
        room.images.map((image) => ctx.cd.uploader.destroy(image.public_id)),
      );

      const deletedRoom = await ctx.db.room.delete({
        where: { id: input.roomId },
      });

      return { deletedRoom };
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string().cuid("Id is not valid"),
        data: z.object({
          images: z.array(z.string()).optional(),
          name: z.string().optional(),
          address: z.string().optional(),
          airConditioned: z.boolean().optional(),
          breakfast: z.boolean().optional(),
          category: z.enum(["KING", "SINGLE", "TWINS"]).optional(),
          description: z.string().optional(),
          guestCapacity: z.number().optional(),
          internet: z.boolean().optional(),
          numOfBeds: z.number().optional(),
          petsAllowed: z.boolean().optional(),
          price: z.number().optional(),
          roomCleaning: z.boolean().optional(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const room = await ctx.db.room.findFirst({
        where: { id: input.id },
        include: { images: true },
      });

      if (!room) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Room not found",
        });
      }

      if (input.data.images && input.data.images.length >= 1) {
        // delete the previous images
        await Promise.all([
          // from cloudinary
          ...room.images.map((image) =>
            ctx.cd.uploader.destroy(image.public_id),
          ),
          // from db
          ctx.db.roomImage.deleteMany({
            where: {
              // just like mongo $in operator
              public_id: { in: room.images.map(({ public_id }) => public_id) },
            },
          }),
        ]);

        // add new images in the cloudinary
        const images = (
          await Promise.all(
            input.data.images.map((img) =>
              ctx.cd.uploader.upload(img, { folder: "bookit/rooms" }),
            ),
          )
        ).map((img) => ({ url: img.secure_url, public_id: img.public_id }));

        // update the user with new images
        const updatedRoom = await ctx.db.room.update({
          where: { id: input.id },
          data: {
            ...input.data,
            images: { create: images },
          },
          include: { images: true },
        })!;

        return { updatedRoom };
      }
    }),

  addReview: userProcedure
    .input(
      z.object({
        bookingId: z.string().cuid("Id not valid"),
        roomId: z.string().cuid("Id not valid"),
        review: z.object({
          comment: z.string(),
          rating: z
            .number()
            .min(1, "Minimum rating should be 1")
            .max(5, "Min rating should be 5"),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // find out if user can create the review,
      // means if user have booked the view
      const bookings = await ctx.db.booking.findMany({
        where: {
          room: { id: input.roomId },
          user: { id: ctx.session.user.id },
        },
        select: { id: true },
      });

      if (!bookings.length) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have book the room before adding the review",
        });
      }

      // if user already have created the review, update the review
      const existingReview = await ctx.db.review.findFirst({
        where: {
          bookingId: input.bookingId,
          room: { id: input.roomId },
          user: { id: ctx.session.user.id },
        },
        select: { id: true },
      });

      if (existingReview) {
        // updating the review
        const updatedRoomWithUpdatedReview = await ctx.db.room.update({
          where: { id: input.roomId },
          data: {
            reviews: {
              update: {
                where: { id: existingReview.id },
                data: {
                  reviewComment: input.review.comment,
                  rating: input.review.rating,
                },
              },
            },
          },
          select: { reviews: true },
        });

        // also update the overall average ratings
        await ctx.db.room.update({
          where: { id: input.roomId },
          data: {
            ratings: updatedRoomWithUpdatedReview.reviews.reduce(
              (prev, { rating }) => prev + rating,
              0,
            ),
          },
          // don't fetch anything from the db
          select: { id: true },
        });

        if (!updatedRoomWithUpdatedReview) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Room not found",
          });
        }

        return { reviews: updatedRoomWithUpdatedReview.reviews };
      }

      // if existing review not found, create the review
      const updatedRoomWithCreatedReview = await ctx.db.room.update({
        where: { id: input.roomId },
        data: {
          reviews: {
            create: {
              bookingId: input.bookingId,
              reviewComment: input.review.comment,
              rating: input.review.rating,
              user: { connect: { id: ctx.session.user.id } },
            },
          },
        },
        select: { reviews: true },
      });

      // also update the overall average ratings
      await ctx.db.room.update({
        where: { id: input.roomId },
        data: {
          ratings: updatedRoomWithCreatedReview.reviews.reduce(
            (prev, { rating }) => prev + rating,
            0,
          ),
        },
        // don't fetch anything from the db
        select: { id: true },
      });

      return { reviews: updatedRoomWithCreatedReview.reviews };
    }),

  // if user has created the booking, it means he can create review
  canCreateReview: userProcedure
    .input(z.object({ roomId: z.string().cuid("Id is not valid") }))
    .query(async ({ ctx, input }) => {
      const bookings = await ctx.db.booking.findMany({
        where: {
          room: { id: input.roomId },
          user: { id: ctx.session.user.id },
        },
        select: { id: true },
      });

      if (bookings.length > 0) {
        return { canCreateReview: true };
      }

      return { canCreateReview: false };
    }),

  isRoomAvailableForBooking: userProcedure
    .input(
      z.object({
        roomId: z.string().cuid("Id is not valid"),
        // checkInDate, should not be less (previous) than today
        // because request coming can take time, so check for 10 seconds in the past
        checkInDate: z.date(),
        // this also shouldn't be in the past
        checkOutDate: z.date(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const bookings = await ctx.db.booking.findMany({
        where: {
          room: { id: input.roomId },
          AND: [
            // both conditions should be true
            { checkInDate: { lte: input.checkOutDate } },
            { checkOutDate: { gte: input.checkInDate } },
          ],
        },
      });

      return { isRoomAvailableForBooking: bookings.length === 0 };
    }),

  alreadyBookedDates: userProcedure
    .input(z.object({ roomId: z.string().cuid("Id not valid") }))
    .query(async ({ ctx, input }) => {
      const bookings = await ctx.db.booking.findMany({
        where: { room: { id: input.roomId } },
      });

      // these booked dates are ranges,
      // one range is represented by an array
      const bookedDates = bookings.map((booking) => [
        booking.checkInDate,
        booking.checkOutDate,
      ]);

      return { bookedDates };
    }),
});
