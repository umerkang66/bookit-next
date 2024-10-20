import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { env } from "~/env.mjs";

let stripePromise: Promise<Stripe | null> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUB);
  }

  return stripePromise;
};
