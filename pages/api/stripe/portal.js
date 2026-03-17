// pages/api/stripe/portal.js
// Redirects user to Stripe's self-serve portal to manage/cancel subscription
import { stripe } from '../../../lib/stripe';
import { getSupabaseAdmin } from '../../../lib/supabase';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const supabaseServer = createServerSupabaseClient({ req, res });
    const { data: { session } } = await supabaseServer.auth.getSession();
    if (!session) return res.status(401).json({ error: 'Not authenticated' });

    const { data: profile } = await getSupabaseAdmin()
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', session.user.id)
      .single();

    if (!profile?.stripe_customer_id) {
      return res.status(400).json({ error: 'No subscription found' });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${appUrl}/dashboard`,
    });

    return res.status(200).json({ url: portalSession.url });
  } catch (err) {
    console.error('Stripe portal error:', err);
    return res.status(500).json({ error: err.message });
  }
}
