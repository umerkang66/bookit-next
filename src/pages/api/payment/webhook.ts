import { type NextApiHandler } from "next";
import getRawBody from "raw-body";

import { env } from "~/env.mjs";
import { db } from "~/server/db";
import { stripe } from "~/utils/stripe";

type StripeSession = {
  client_reference_id: string;
  customer_email: string;
  amount_total: number;
  payment_intent: string;
  payment_status: string;
  metadata: {
    checkInDate: string;
    checkOutDate: string;
    daysOfStay: string;
  };
};

export const config = { api: { bodyParser: false } };

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") {
    return res.send(new Error("Endpoint doesn't found"));
  }

  const signatureHeader = req.headers["stripe-signature"];
  const body = await getRawBody(req);

  const event = stripe.webhooks.constructEvent(
    body,
    signatureHeader as string,
    env.STRIPE_WEBHOOK_SECRET,
  );

  if (event.type === "checkout.session.completed") {
    // see the session values from
    const stripeSession = event.data.object as StripeSession;

    const roomId = stripeSession.client_reference_id;

    const userId = (
      await db.user.findFirst({
        where: { email: stripeSession.customer_email },
      })
    )?.id;

    if (!userId) {
      return res.status(200).send({ success: true });
    }

    const amountPaid = Math.round(stripeSession.amount_total / 100); // in usd;
    const paymentInfo = {
      id: stripeSession.payment_intent,
      status: stripeSession.payment_status,
    };

    const checkInDate = new Date(stripeSession.metadata.checkInDate);

    const checkOutDate = new Date(stripeSession.metadata.checkOutDate);

    const daysOfStay = stripeSession.metadata.daysOfStay;

    const paymentInfoId = (
      await db.bookingPaymentInfo.create({
        data: { ...paymentInfo },
        select: { id: true },
      })
    ).id;

    await db.booking.create({
      data: {
        roomId,
        userId,
        checkInDate,
        checkOutDate,
        daysOfStay: parseInt(daysOfStay),
        amountPaid,
        paymentInfoId,
        paidOn: new Date(),
      },
    });

    res.status(200).send({ success: true });
  }
};

export default handler;
