// NOTE: BOOKING will be created in the next.js api route, that will act as webhook

// NOTE: And some booking procecures are in room router, that closely resembeles with room

import { z } from "zod";
import { adminProcedure, createTRPCRouter, userProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const reviewRouter = createTRPCRouter({
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
        const reviews = await ctx.db.review.findMany({
          orderBy: { createdAt: input.sort },
          select: {
            id: true,
            bookingId: true,
            rating: true,
            reviewComment: true,
            roomId: true,
            userId: true,
          },
        });

        return { reviews };
      }

      const skip = (input.page - 1) * input.take;

      const reviews = await ctx.db.review.findMany({
        skip,
        take: input.take,
        orderBy: { createdAt: input.sort },
        select: {
          id: true,
          bookingId: true,
          rating: true,
          reviewComment: true,
          roomId: true,
          userId: true,
        },
      });

      return { reviews };
    }),

  delete: adminProcedure
    .input(z.object({ reviewId: z.string().cuid("Id is not valid") }))
    .mutation(async ({ ctx, input }) => {
      const deletedReview = await ctx.db.review.delete({
        where: { id: input.reviewId },
      });

      if (!deletedReview) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return { deletedReview };
    }),

  reviewsByUser: userProcedure
    .input(
      z.object({
        page: z.number().default(1),
        take: z.number().default(10),
        sort: z.enum(["asc", "desc"]).default("desc"),
        dontPaginate: z.boolean().default(false),
      }),
    )
    .query(async ({ ctx, input }) => {
      const skip = (input.page - 1) * input.take;

      const reviews = await ctx.db.review.findMany({
        where: { user: { id: ctx.session.user.id } },
        skip,
        take: input.take,
        orderBy: { createdAt: input.sort },
        select: {
          id: true,
          bookingId: true,
          rating: true,
          reviewComment: true,
          roomId: true,
          userId: true,
        },
      });

      return { reviews };
    }),
});
