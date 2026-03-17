import { useEffect, useRef } from 'react';
import { adConfig } from '../data/monetization';
import { useAuth } from '../context/AuthContext';

// ─── Ad Unit Component ────────────────────────────────────────────────────────
export function AdUnit({ slot, format = 'auto', style = {}, className = '', label = true }) {
  const { user } = useAuth();
  const adRef = useRef(null);
  const isPro = user?.plan === 'pro' || user?.plan === 'team';

  // Don't show ads to Pro users
  if (isPro && !adConfig.showForPro) return null;
  // Don't show if AdSense not yet enabled
  if (!adConfig.enabled) return <AdPlaceholder format={format} style={style} className={className} label={label} />;

  useEffect(() => {
    try {
      if (window.adsbygoogle && adRef.current) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch {}
  }, []);

  return (
    <div className={`text-center ${className}`} style={style}>
      {label && <div className="text-xs text-gray-300 mb-1 uppercase tracking-wider font-medium">Advertisement</div>}
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adConfig.publisherId}
        data-ad-slot={adConfig.slots[slot]}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

// ─── Placeholder (shown before AdSense is approved) ──────────────────────────
function AdPlaceholder({ format, style, className, label }) {
  const { user } = useAuth();
  const isPro = user?.plan === 'pro' || user?.plan === 'team';
  if (isPro) return null;

  const dims = {
    banner: { w: '100%', h: 90, text: '728×90 Banner Ad · Google AdSense will go here' },
    rectangle: { w: 300, h: 250, text: '300×250 Ad · AdSense Rectangle' },
    auto: { w: '100%', h: 100, text: 'Ad · Google AdSense (pending approval)' },
  };
  const d = dims[format] || dims.auto;

  return (
    <div className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed text-center ${className}`}
      style={{ width: d.w, height: d.h, borderColor: '#e2e8f0', background: '#f8fafc', ...style }}>
      {label && <div className="text-xs text-gray-300 mb-1 uppercase tracking-wider">Advertisement</div>}
      <div className="text-gray-300 text-xs">📢 {d.text}</div>
      <a href="https://adsense.google.com" target="_blank" rel="noopener noreferrer"
        className="text-indigo-400 text-xs mt-1 hover:underline">Apply for AdSense →</a>
    </div>
  );
}

// ─── Banner Ad (top of pages) ─────────────────────────────────────────────────
export function BannerAd({ className = '' }) {
  return (
    <div className={`max-w-4xl mx-auto px-4 py-3 ${className}`}>
      <AdUnit slot="banner_top" format="banner" style={{ minHeight: 90 }} />
    </div>
  );
}

// ─── In-Feed Ad (between tool cards) ─────────────────────────────────────────
export function InFeedAd() {
  return (
    <div className="flex justify-center my-2">
      <AdUnit slot="in_feed" format="rectangle" style={{ width: 300, minHeight: 250 }} />
    </div>
  );
}

// ─── Sidebar Ad ───────────────────────────────────────────────────────────────
export function SidebarAd() {
  return (
    <AdUnit slot="sidebar" format="rectangle" style={{ width: '100%', minHeight: 250 }} className="sticky top-24" />
  );
}

// ─── Prompt Page Ad (below generated prompt) ─────────────────────────────────
export function PromptAd() {
  const { user } = useAuth();
  if (user?.plan === 'pro' || user?.plan === 'team') return null;
  return (
    <div className="mt-5">
      <div className="text-xs text-center text-gray-400 mb-2">
        ✨ <span className="font-semibold">Remove ads forever</span> — upgrade to Pro for $9/mo
        <a href="/#pricing" className="text-indigo-600 ml-1 font-bold hover:underline">Upgrade →</a>
      </div>
      <AdUnit slot="prompt_bottom" format="banner" style={{ minHeight: 90 }} />
    </div>
  );
}

// ─── Sponsored Listing Badge ──────────────────────────────────────────────────
export function SponsoredBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
      style={{ background: '#fef3c7', color: '#92400e' }}>
      ⭐ Sponsored
    </span>
  );
}

// ─── Upgrade Prompt (inline) ─────────────────────────────────────────────────
export function UpgradePrompt({ message = 'Upgrade to Pro to unlock this feature', compact = false }) {
  if (compact) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200">
        🔒 Pro feature — <a href="/#pricing" className="underline">Upgrade $9/mo</a>
      </span>
    );
  }
  return (
    <div className="rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 p-6 text-center">
      <div className="text-3xl mb-3">🔒</div>
      <p className="font-bold text-gray-800 mb-1">{message}</p>
      <p className="text-gray-500 text-sm mb-4">Unlock unlimited prompts, all 8 categories, save & export — just $9/month.</p>
      <a href="/#pricing" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition-all text-sm">
        🚀 Upgrade to Pro →
      </a>
    </div>
  );
}
