// pages/api/stripe/create-checkout.js
// Called when user clicks "Upgrade" → creates Stripe payment page
import { stripe, PRICES, getOrCreateStripeCustomer } from '../../../lib/stripe';
import { getSupabaseAdmin } from '../../../lib/supabase';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // Get authenticated user from Supabase session cookie
    const supabaseServer = createServerSupabaseClient({ req, res });
    const { data: { session } } = await supabaseServer.auth.getSession();

    if (!session) return res.status(401).json({ error: 'Not authenticated. Please log in first.' });

    const { plan, billing } = req.body; // e.g. plan='pro', billing='monthly'
    const priceKey = `${plan}_${billing || 'monthly'}`;
    const priceId = PRICES[priceKey];

    if (!priceId) return res.status(400).json({ error: `Invalid plan: ${priceKey}` });

    const user = session.user;
    const profile = await getSupabaseAdmin()
      .from('profiles').select('name, stripe_customer_id').eq('id', user.id).single();

    // Get or create Stripe customer
    const customerId = await getOrCreateStripeCustomer(
      user.id,
      user.email,
      profile.data?.name || user.email
    );

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Create Stripe Checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: `${appUrl}/dashboard?upgraded=true&plan=${plan}`,
      cancel_url: `${appUrl}/#pricing?cancelled=true`,
      metadata: {
        supabase_user_id: user.id,
        plan,
        billing: billing || 'monthly',
      },
      subscription_data: {
        metadata: { supabase_user_id: user.id, plan },
      },
    });

    return res.status(200).json({ url: checkoutSession.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return res.status(500).json({ error: err.message });
  }
}
