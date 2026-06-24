import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export const PLANS = {
  monthly: {
    priceId: process.env.STRIPE_PRICE_MONTHLY!,
    name: "Mensuel",
    price: 59,
    interval: "month" as const,
  },
  yearly: {
    priceId: process.env.STRIPE_PRICE_YEARLY!,
    name: "Annuel",
    price: 699,
    interval: "year" as const,
  },
};
