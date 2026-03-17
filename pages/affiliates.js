import Layout from '../components/Layout';
import { affiliatePrograms } from '../data/monetization';

export default function AffiliatePage() {
  return (
    <Layout title="Affiliate Programs" description="Earn money by referring users to AI tools">
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="relative py-14" style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63)' }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm text-purple-200 mb-4">💰 Revenue Streams</div>
            <h1 className="text-4xl font-black text-white mb-3">Affiliate Programs</h1>
            <p className="text-purple-200 text-lg max-w-xl mx-auto">Sign up for these programs to earn recurring commissions on every tool you refer. Top programs pay 20–45% monthly.</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Programs Listed', value: affiliatePrograms.length },
              { label: 'Best Rate', value: '45%' },
              { label: 'Highest Per Sale', value: '$200' },
              { label: 'Est. Monthly (100 referrals)', value: '$800+' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 text-center shadow-sm">
                <div className="text-2xl font-black text-indigo-600 mb-1">{s.value}</div>
                <div className="text-gray-500 text-xs">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Action steps */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <h2 className="font-black text-amber-900 text-lg mb-3">⚡ Get started in 3 steps</h2>
            <div className="space-y-2">
              {[
                '1. Sign up for the top 3–5 programs below (takes 5 minutes each)',
                '2. Replace YOUR_ID in data/monetization.js with your affiliate IDs',
                '3. Every tool card click now earns you a commission automatically',
              ].map(s => <div key={s} className="text-amber-800 text-sm font-medium">{s}</div>)}
            </div>
          </div>

          {/* Programs table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-black text-gray-900">Top Affiliate Programs — Priority Order</h2>
              <p className="text-gray-500 text-sm">Sorted by earning potential. Sign up for rank 1–5 first.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['#','Program','Commission','Note','Sign Up'].map(h => (
                      <th key={h} className="px-5 py-3.5 text-left text-xs font-black text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {affiliatePrograms.map(p => (
                    <tr key={p.name} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${p.rank <= 3 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                          {p.rank}
                        </div>
                      </td>
                      <td className="px-5 py-4 font-bold text-gray-900">{p.name}</td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-green-50 text-green-700">{p.commission}</span>
                      </td>
                      <td className="px-5 py-4 text-gray-500 text-xs">{p.note}</td>
                      <td className="px-5 py-4">
                        <a href={p.url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors">
                          Join →
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sponsorship box */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-black text-gray-900 text-lg mb-2">🏢 Sell Sponsored Listings</h2>
            <p className="text-gray-500 text-sm mb-4">Charge AI companies $99–$299/month to appear at the top of their category with a "Sponsored" badge. Here's a template email to send them:</p>
            <div className="bg-gray-50 rounded-xl p-5 font-mono text-xs text-gray-700 leading-relaxed border border-gray-200">
              <p>Subject: Feature [CompanyName] on AIToolsHub — 50K monthly visitors</p>
              <br/>
              <p>Hi [Name],</p>
              <br/>
              <p>I run AIToolsHub.com — a directory of 75+ AI tools with 50,000+ monthly visitors, mostly developers, creators, and marketers looking for AI tools to use.</p>
              <br/>
              <p>I'd love to offer [CompanyName] a sponsored featured listing in the [Category] section — you'd appear at the top of the page with a "Sponsored" badge for $99/month.</p>
              <br/>
              <p>Would you be interested? Happy to send traffic stats.</p>
              <br/>
              <p>Best,<br/>[Your name]<br/>phatanrayyankhan9@gmail.com</p>
            </div>
            <p className="text-gray-400 text-xs mt-3">To activate a sponsor: add their tool ID to sponsoredTools[] in data/monetization.js</p>
          </div>

          {/* AdSense guide */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-black text-gray-900 text-lg mb-2">📢 Google AdSense Setup</h2>
            <div className="space-y-3">
              {[
                { step: '1', text: 'Go to adsense.google.com and create an account' },
                { step: '2', text: 'Add your domain (you need a real deployed domain, not localhost)' },
                { step: '3', text: 'Wait 2–4 weeks for approval (need 20+ pages of original content)' },
                { step: '4', text: 'Once approved: copy your Publisher ID (ca-pub-XXXXXXXX) into adConfig.publisherId in data/monetization.js' },
                { step: '5', text: 'Create 4 ad units (banner, rectangle, sidebar, prompt) and paste their slot IDs' },
                { step: '6', text: 'Set adConfig.enabled = true — ads will appear automatically on all pages' },
                { step: '7', text: 'Pro users automatically see no ads (handled in Ads.js)' },
              ].map(({ step, text }) => (
                <div key={step} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">{step}</div>
                  <p className="text-gray-600 text-sm">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
