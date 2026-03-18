import { stripe, PRICES, getOrCreateStripeCustomer } from '../../../lib/stripe';
import { getSupabaseAdmin, supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // Get auth token from Authorization header OR cookie
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Not authenticated. Please log in first.' });
    }

    // Verify the token with Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: 'Session expired. Please log in again.' });
    }

    const { plan, billing } = req.body;
    const priceKey = `${plan}_${billing || 'monthly'}`;
    const priceId = PRICES[priceKey];

    if (!priceId || priceId === 'price_placeholder') {
      return res.status(400).json({ error: 'Stripe not configured yet. Add real price IDs to environment variables.' });
    }

    const admin = getSupabaseAdmin();
    const { data: profile } = await admin
      .from('profiles')
      .select('name, stripe_customer_id')
      .eq('id', user.id)
      .single();

    const customerId = await getOrCreateStripeCustomer(
      user.id,
      user.email,
      profile?.name || user.email
    );

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: `${appUrl}/dashboard?upgraded=true&plan=${plan}`,
      cancel_url: `${appUrl}/#pricing`,
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
