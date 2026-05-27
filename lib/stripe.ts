import Stripe from 'stripe';

/**
 * Stripe server client. Use only in server components / route handlers.
 * Set STRIPE_SECRET_KEY in Railway → Variables (test key starts with sk_test_,
 * live with sk_live_).
 */
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' })
  : null;

export const isStripeConfigured = !!process.env.STRIPE_SECRET_KEY;
