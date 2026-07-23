import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export const PLANS = {
  // Standard
  standard_monthly: {
    priceId: process.env.STRIPE_PRICE_MONTHLY!,
    name: "Standard Mensuel",
    price: 69,
    interval: "month" as const,
  },
  standard_yearly: {
    priceId: process.env.STRIPE_PRICE_YEARLY!,
    name: "Standard Annuel",
    price: 745,
    interval: "year" as const,
  },
  // Pro
  pro_monthly: {
    priceId: process.env.STRIPE_PRICE_PRO_MONTHLY!,
    name: "Pro Mensuel",
    price: 129,
    interval: "month" as const,
  },
  pro_yearly: {
    priceId: process.env.STRIPE_PRICE_PRO_YEARLY!,
    name: "Pro Annuel",
    price: 1392,
    interval: "year" as const,
  },
  // Cabinet
  cabinet_monthly: {
    priceId: process.env.STRIPE_PRICE_CABINET_MONTHLY!,
    name: "Cabinet Mensuel",
    price: 249,
    interval: "month" as const,
  },
  cabinet_yearly: {
    priceId: process.env.STRIPE_PRICE_CABINET_YEARLY!,
    name: "Cabinet Annuel",
    price: 2688,
    interval: "year" as const,
  },
  // Legacy aliases (backward compat)
  monthly: {
    priceId: process.env.STRIPE_PRICE_MONTHLY!,
    name: "Standard Mensuel",
    price: 69,
    interval: "month" as const,
  },
  yearly: {
    priceId: process.env.STRIPE_PRICE_YEARLY!,
    name: "Standard Annuel",
    price: 745,
    interval: "year" as const,
  },
};
