// NOTE: BOOKING will be created in the next.js api route, that will act as webhook

// NOTE: And some booking procecures are in room router, that closely resembeles with room

import { z } from "zod";
import { adminProcedure, createTRPCRouter, userProcedure } from "../trpc";

export const bookingRouter = createTRPCRouter({
  getByUser: userProcedure
    .input(
      z.object({
        page: z.number().default(1),
        take: z.number().default(10),
        sort: z.enum(["asc", "desc"]).default("desc"),
        dontPaginate: z.boolean().default(false),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (input.dontPaginate) {
        const bookings = await ctx.db.booking.findMany({
          where: { user: { id: ctx.session.user.id } },
          orderBy: { createdAt: input.sort },
          select: {
            paymentInfo: true,
            id: true,
            amountPaid: true,
            paidOn: true,
            roomId: true,
            userId: true,
            checkInDate: true,
            checkOutDate: true,
            daysOfStay: true,
          },
        });

        return { bookings };
      }

      const skip = (input.page - 1) * input.take;

      const bookings = await ctx.db.booking.findMany({
        skip,
        take: input.take,
        where: { user: { id: ctx.session.user.id } },
        orderBy: { createdAt: input.sort },
        select: {
          paymentInfo: true,
          id: true,
          amountPaid: true,
          paidOn: true,
          roomId: true,
          userId: true,
          checkInDate: true,
          checkOutDate: true,
          daysOfStay: true,
        },
      });

      return { bookings };
    }),

  get: userProcedure
    .input(z.object({ bookingId: z.string().cuid("Invalid id") }))
    .query(async ({ ctx, input }) => {
      const booking = await ctx.db.booking.findFirst({
        where: { id: input.bookingId },
        select: {
          paymentInfo: true,
          id: true,
          amountPaid: true,
          paidOn: true,
          roomId: true,
          userId: true,
          checkInDate: true,
          checkOutDate: true,
          daysOfStay: true,
        },
      });

      return { booking };
    }),

  setIsReviewAdded: userProcedure
    .input(z.object({ bookingId: z.string().cuid("Id is not valid") }))
    .mutation(async ({ ctx, input }) => {
      const booking = await ctx.db.booking.update({
        where: { id: input.bookingId },
        data: { reviewAdded: true },
      });

      return { booking };
    }),

  getAll: adminProcedure
    .input(
      z.object({
        page: z.number().default(1),
        take: z.number().default(10),
        sort: z.enum(["asc", "desc"]).default("desc"),
        dontPaginate: z.boolean().default(false),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (input.dontPaginate) {
        const bookings = await ctx.db.booking.findMany({
          select: {
            paymentInfo: true,
            id: true,
            amountPaid: true,
            paidOn: true,
            roomId: true,
            userId: true,
            checkInDate: true,
            checkOutDate: true,
            daysOfStay: true,
          },
        });

        return { bookings };
      }

      const skip = (input.page - 1) * input.take;

      const bookings = await ctx.db.booking.findMany({
        skip,
        take: input.take,
        select: {
          paymentInfo: true,
          id: true,
          amountPaid: true,
          paidOn: true,
          roomId: true,
          userId: true,
          checkInDate: true,
          checkOutDate: true,
          daysOfStay: true,
        },
      });

      return { bookings };
    }),
});
