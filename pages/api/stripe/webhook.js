// pages/api/stripe/webhook.js
// Stripe sends events here after payment, cancellation, renewal
// Must be raw body (not parsed JSON) for signature verification

import { stripe, getPlanFromPriceId } from '../../../lib/stripe';
import { getSupabaseAdmin } from '../../../lib/supabase';

export const config = { api: { bodyParser: false } };

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const rawBody = await getRawBody(req);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  const admin = getSupabaseAdmin();

  try {
    switch (event.type) {

      // ── Payment succeeded → upgrade user plan ──────────────────────────────
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.supabase_user_id;
        const plan   = session.metadata?.plan || 'pro';
        if (!userId) break;

        // Get subscription details
        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        const priceId = subscription.items.data[0].price.id;

        await admin.from('profiles').update({
          plan,
          stripe_subscription_id: subscription.id,
          subscription_status: 'active',
          subscription_end: new Date(subscription.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        }).eq('id', userId);

        console.log(`✅ Upgraded user ${userId} to ${plan}`);
        break;
      }

      // ── Subscription renewed ───────────────────────────────────────────────
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        if (invoice.billing_reason !== 'subscription_cycle') break;

        const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
        const userId = subscription.metadata?.supabase_user_id;
        if (!userId) break;

        const priceId = subscription.items.data[0].price.id;
        const plan = getPlanFromPriceId(priceId);

        await admin.from('profiles').update({
          plan,
          subscription_status: 'active',
          subscription_end: new Date(subscription.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        }).eq('id', userId);

        console.log(`🔄 Renewed ${plan} for user ${userId}`);
        break;
      }

      // ── Payment failed ─────────────────────────────────────────────────────
      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
        const userId = subscription.metadata?.supabase_user_id;
        if (!userId) break;

        await admin.from('profiles').update({
          subscription_status: 'past_due',
          updated_at: new Date().toISOString(),
        }).eq('id', userId);

        console.log(`⚠️ Payment failed for user ${userId}`);
        break;
      }

      // ── Subscription cancelled or expired ─────────────────────────────────
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const userId = subscription.metadata?.supabase_user_id;
        if (!userId) break;

        await admin.from('profiles').update({
          plan: 'free',
          stripe_subscription_id: null,
          subscription_status: 'cancelled',
          subscription_end: null,
          updated_at: new Date().toISOString(),
        }).eq('id', userId);

        console.log(`❌ Downgraded user ${userId} to free`);
        break;
      }

      // ── Subscription updated (plan change) ────────────────────────────────
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const userId = subscription.metadata?.supabase_user_id;
        if (!userId) break;

        const priceId = subscription.items.data[0].price.id;
        const plan = getPlanFromPriceId(priceId);

        await admin.from('profiles').update({
          plan,
          subscription_status: subscription.status,
          subscription_end: new Date(subscription.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        }).eq('id', userId);

        console.log(`🔀 Updated user ${userId} to ${plan}`);
        break;
      }
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('Webhook handler error:', err);
    return res.status(500).json({ error: err.message });
  }
}
