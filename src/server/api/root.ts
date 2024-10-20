import { roomRouter } from "~/server/api/routers/room";
import { createTRPCRouter } from "~/server/api/trpc";
import { bookingRouter } from "./routers/booking";
import { paymentRouter } from "./routers/payment";
import { userRouter } from "./routers/user";
import { reviewRouter } from "./routers/review";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  room: roomRouter,
  booking: bookingRouter,
  payment: paymentRouter,
  user: userRouter,
  review: reviewRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
