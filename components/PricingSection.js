// components/PricingSection.js
// Drop this into any page: <PricingSection />
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

const plans = [
  {
    id: 'free',
    name: 'Starter',
    monthlyPrice: 0,
    yearlyPrice: 0,
    color: '#6b7280',
    description: 'Perfect for exploring AI tools',
    features: [
      '5 AI prompts per day',
      '3 prompt categories',
      'Full AI tools directory',
      'Free tools access',
      'Ad-supported',
    ],
    limits: ['No prompt saving', 'No video/coding/audio prompts'],
    cta: 'Get started free',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 9,
    yearlyPrice: 7,
    color: '#6366f1',
    description: 'For AI power users and creators',
    features: [
      'Unlimited prompts daily',
      'All 8 prompt categories',
      'Save & export prompts',
      'Prompt history (30 days)',
      'No ads ever',
      'Priority support',
    ],
    limits: [],
    cta: 'Start Pro',
    popular: true,
  },
  {
    id: 'team',
    name: 'Team',
    monthlyPrice: 29,
    yearlyPrice: 23,
    color: '#7c3aed',
    description: 'For teams building with AI',
    features: [
      'Everything in Pro',
      'Up to 10 team members',
      'Shared prompt library',
      'Prompt history (1 year)',
      'Team analytics',
      'Dedicated support',
    ],
    limits: [],
    cta: 'Start Team',
    popular: false,
  },
];

export default function PricingSection({ id = 'pricing' }) {
  const { user, profile, isPro } = useAuth();
  const router = useRouter();
  const [billing, setBilling] = useState('monthly');
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [error, setError] = useState('');

  const handleUpgrade = async (planId) => {
    if (planId === 'free') return;

    // Not logged in → go to login first
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent('/#pricing')}`);
      return;
    }

    // Already on this plan
    if (profile?.plan === planId) return;

    setError('');
    setLoadingPlan(planId);

    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId, billing }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create checkout');

      // Redirect to Stripe checkout
      window.location.href = data.url;
    } catch (err) {
      setError(err.message);
      setLoadingPlan(null);
    }
  };

  const handleManage = async () => {
    setLoadingPlan('manage');
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      window.location.href = data.url;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingPlan(null);
    }
  };

  const getButtonState = (plan) => {
    if (plan.id === 'free') {
      if (!user) return { label: plan.cta, disabled: false, variant: 'outline' };
      return { label: 'Your current plan', disabled: true, variant: 'outline' };
    }
    if (profile?.plan === plan.id) return { label: '✓ Current Plan', disabled: true, variant: 'current' };
    if (loadingPlan === plan.id) return { label: 'Loading...', disabled: true, variant: 'primary' };
    return { label: plan.cta, disabled: false, variant: 'primary' };
  };

  return (
    <section id={id} className="py-20 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-indigo-50 rounded-full px-4 py-1.5 text-sm text-indigo-700 font-semibold mb-4">
            💎 Simple pricing
          </div>
          <h2 className="text-4xl font-bold text-white mb-3">Start free. Upgrade when ready.</h2>
          <p className="text-gray-500 text-lg">Cancel anytime. No hidden fees.</p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <button onClick={() => setBilling('monthly')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${billing==='monthly' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-700'}`}>
              Monthly
            </button>
            <button onClick={() => setBilling('yearly')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${billing==='yearly' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-700'}`}>
              Yearly
              <span className={`text-xs px-2 py-0.5 rounded-full font-black ${billing==='yearly' ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700'}`}>
                Save 22%
              </span>
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm text-center">
            {error}
          </div>
        )}

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map(plan => {
            const price = billing === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
            const btn = getButtonState(plan);
            const isCurrentPlan = profile?.plan === plan.id;

            return (
              <div key={plan.id}
                className={`relative rounded-3xl p-7 flex flex-col transition-all ${
                  plan.popular
                    ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-200 scale-105'
                    : 'bg-white border border-gray-200'
                }`}>

                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-black px-4 py-1 rounded-full whitespace-nowrap">
                    ⭐ Most Popular
                  </div>
                )}

                {/* Plan name + price */}
                <div className="mb-6">
                  <div className={`text-sm font-bold mb-2 ${plan.popular ? 'text-indigo-200' : 'text-gray-500'}`}>
                    {plan.name}
                  </div>
                  <div className="flex items-end gap-1 mb-1">
                    <span className={`text-4xl font-black ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                      {price === 0 ? 'Free' : `$${price}`}
                    </span>
                    {price > 0 && (
                      <span className={`text-sm mb-1.5 ${plan.popular ? 'text-indigo-300' : 'text-gray-400'}`}>
                        /mo
                      </span>
                    )}
                  </div>
                  {billing === 'yearly' && price > 0 && (
                    <div className={`text-xs font-semibold ${plan.popular ? 'text-indigo-200' : 'text-green-600'}`}>
                      Billed ${price * 12}/year
                    </div>
                  )}
                  <p className={`text-sm mt-2 ${plan.popular ? 'text-indigo-200' : 'text-gray-500'}`}>
                    {plan.description}
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <span className={`mt-0.5 ${plan.popular ? 'text-indigo-200' : 'text-green-500'}`}>✓</span>
                      <span className={plan.popular ? 'text-indigo-100' : 'text-gray-700'}>{f}</span>
                    </li>
                  ))}
                  {plan.limits.map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <span className={`mt-0.5 ${plan.popular ? 'text-indigo-400' : 'text-gray-300'}`}>✕</span>
                      <span className={plan.popular ? 'text-indigo-300' : 'text-gray-400'}>{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA button */}
                <button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={btn.disabled}
                  className={`w-full py-3.5 rounded-2xl font-black text-sm transition-all ${
                    plan.popular
                      ? 'bg-white text-indigo-700 hover:bg-indigo-50 disabled:opacity-60'
                      : isCurrentPlan
                        ? 'bg-green-50 text-green-700 border-2 border-green-200 cursor-default'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60'
                  }`}>
                  {btn.label}
                </button>
              </div>
            );
          })}
        </div>

        {/* Manage subscription (for paid users) */}
        {isPro && (
          <div className="mt-8 text-center">
            <button onClick={handleManage} disabled={loadingPlan === 'manage'}
              className="text-sm text-gray-500 hover:text-indigo-600 underline transition-colors">
              {loadingPlan === 'manage' ? 'Loading...' : 'Manage or cancel subscription →'}
            </button>
          </div>
        )}

        {/* Trust signals */}
        <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-gray-400">
          <span>🔒 Secured by Stripe</span>
          <span>↩️ Cancel anytime</span>
          <span>💳 Credit card required for Pro</span>
          <span>📧 phatanrayyankhan9@gmail.com</span>
        </div>
      </div>
    </section>
  );
}
