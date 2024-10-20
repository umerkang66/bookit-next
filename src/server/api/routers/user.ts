// NOTE: BOOKING will be created in the next.js api route, that will act as webhook

// NOTE: And some booking procecures are in room router, that closely resembeles with room

import { z } from "zod";
import { adminProcedure, createTRPCRouter, userProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
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
        const users = await ctx.db.user.findMany({
          orderBy: { createdAt: input.sort },
          select: {
            id: true,
            email: true,
            image: true,
            name: true,
            role: true,
            bookings: { select: { id: true } },
            reviews: { select: { id: true } },
            rooms: { select: { id: true } },
          },
        });

        return { users };
      }

      const skip = (input.page - 1) * input.take;

      const users = await ctx.db.user.findMany({
        skip,
        take: input.take,
        orderBy: { createdAt: input.sort },
        select: {
          id: true,
          email: true,
          image: true,
          name: true,
          role: true,
          bookings: { select: { id: true } },
          reviews: { select: { id: true } },
          rooms: { select: { id: true } },
        },
      });

      return { users };
    }),

  delete: adminProcedure
    .input(z.object({ userId: z.string().cuid("Id is not valid") }))
    .mutation(async ({ ctx, input }) => {
      const deletedUser = await ctx.db.user.delete({
        where: { id: input.userId },
        select: { rooms: { select: { images: true } } },
      });

      const images = [] as string[];
      deletedUser.rooms.forEach((room) =>
        room.images.forEach((img) => images.push(img.public_id)),
      );

      await ctx.cd.api.delete_resources(images);

      if (!deletedUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return { deletedUser };
    }),

  me: userProcedure.query(({ ctx }) => {
    return { user: ctx.session.user };
  }),
});
