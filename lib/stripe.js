import Stripe from 'stripe';

// ─── Server-side Stripe (API routes only) ─────────────────────────────────────
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-04-10',
});

// ─── Price ID map ──────────────────────────────────────────────────────────────
export const PRICES = {
  pro_monthly:  process.env.STRIPE_PRICE_PRO_MONTHLY,
  pro_yearly:   process.env.STRIPE_PRICE_PRO_YEARLY,
  team_monthly: process.env.STRIPE_PRICE_TEAM_MONTHLY,
  team_yearly:  process.env.STRIPE_PRICE_TEAM_YEARLY,
};

// ─── Get plan name from price ID ──────────────────────────────────────────────
export function getPlanFromPriceId(priceId) {
  if (priceId === PRICES.pro_monthly || priceId === PRICES.pro_yearly) return 'pro';
  if (priceId === PRICES.team_monthly || priceId === PRICES.team_yearly) return 'team';
  return 'free';
}

// ─── Create or retrieve Stripe customer for a user ────────────────────────────
export async function getOrCreateStripeCustomer(userId, email, name) {
  const { getSupabaseAdmin } = await import('./supabase');
  const admin = getSupabaseAdmin();

  // Check if customer ID already stored
  const { data: profile } = await admin
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', userId)
    .single();

  if (profile?.stripe_customer_id) {
    return profile.stripe_customer_id;
  }

  // Create new Stripe customer
  const customer = await stripe.customers.create({
    email,
    name,
    metadata: { supabase_user_id: userId },
  });

  // Store customer ID in Supabase
  await admin
    .from('profiles')
    .update({ stripe_customer_id: customer.id })
    .eq('id', userId);

  return customer.id;
}
