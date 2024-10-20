import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, userProcedure } from "../trpc";

export const paymentRouter = createTRPCRouter({
  createCheckoutSession: userProcedure
    .input(
      z.object({
        roomId: z.string().cuid("Invalid Id"),
        // because request coming can take time, so check for 5 seconds in the past
        checkInDate: z.date().min(new Date(Date.now() - 5000)),
        // this also shouldn't be in the past
        checkOutDate: z.date().min(new Date(Date.now() - 5000)),
      }),
    )
    .mutation(async ({ ctx, input: { roomId, checkInDate, checkOutDate } }) => {
      const room = await ctx.db.room.findFirst({
        where: { id: roomId },
        include: { images: true },
      });
      const user = ctx.session.user;

      if (!room) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Room not found" });
      }

      const daysInMilliseconds = checkOutDate.getTime() - checkInDate.getTime();
      const millisecondsInOneDay = 1000 * 60 * 60 * 24;

      const daysOfStay = Math.round(daysInMilliseconds / millisecondsInOneDay);
      const priceInCents = room.price * daysOfStay * 100;

      const session = await ctx.stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        success_url: 'http://localhost:3000/me/bookings', //`${ctx.url}/me/bookings`,
        cancel_url: `http://localhost:3000/rooms/${room?.id}`, // ${ctx.url}/rooms/${room?.id},
        customer_email: user.email!,
        client_reference_id: room.id,
        metadata: {
          checkInDate: checkInDate.toISOString(),
          checkOutDate: checkOutDate.toISOString(),
          daysOfStay,
        },
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "usd",
              unit_amount: priceInCents,
              product_data: {
                name: room.name,
                images: room.images.map((img) => img.url).slice(8),
              },
            },
          },
        ],
      });

      return { session };
    }),
});

// stripe listen --events checkout.session.completed --forward-to localhost:3000/api/payment/webhook
