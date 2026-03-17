import Link from 'next/link';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(''); }
  };

  return (
    <footer style={{ background: '#0a0a0f' }} className="text-white pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                <span className="text-white font-black text-sm">AI</span>
              </div>
              <span className="font-black text-xl">AITools<span className="text-indigo-400">Hub</span></span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">The #1 directory for AI tools, prompt generation, and free utilities. Trusted by 50,000+ creators.</p>
            <div className="flex gap-2">
              {[['𝕏', 'https://x.com'], ['📘', '#'], ['💼', '#'], ['📧', 'mailto:phatanrayyankhan9@gmail.com']].map(([icon, href], i) => (
                <a key={i} href={href} className="w-9 h-9 rounded-xl bg-white/5 hover:bg-indigo-500/20 border border-white/5 hover:border-indigo-500/30 flex items-center justify-center text-sm transition-all">
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-black text-white text-sm mb-5 uppercase tracking-wider">Product</h4>
            <ul className="space-y-3">
              {[['AI Tools Directory', '/ai-tools'], ['✨ Prompt Maker', '/prompt-maker'], ['Free Utilities', '/free-tools'], ['Tutorials', '/tutorials'], ['Blog', '/blog'], ['Pricing', '/#pricing']].map(([label, href]) => (
                <li key={href}><Link href={href} className="text-gray-500 hover:text-white text-sm transition-colors duration-200">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-black text-white text-sm mb-5 uppercase tracking-wider">Company</h4>
            <ul className="space-y-3">
              {[['About', '#'], ['Contact', '/contact'], ['Privacy Policy', '/privacy'], ['Terms of Service', '/terms'], ['Admin', '/admin']].map(([label, href]) => (
                <li key={href}><Link href={href} className="text-gray-500 hover:text-white text-sm transition-colors duration-200">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-black text-white text-sm mb-5 uppercase tracking-wider">Newsletter</h4>
            <p className="text-gray-500 text-sm mb-4">Weekly AI tool discoveries & prompt tips. No spam.</p>
            {subscribed ? (
              <div className="p-4 rounded-2xl border border-green-500/20 bg-green-500/10 text-green-400 text-sm text-center">
                🎉 You're subscribed!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2.5">
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com" required
                  className="w-full px-4 py-3 rounded-2xl text-sm font-medium text-white placeholder:text-gray-600 outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
                <button type="submit" className="w-full py-3 rounded-2xl font-black text-white text-sm transition-all hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 4px 20px rgba(99,102,241,0.3)' }}>
                  Subscribe Free →
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">© 2026 AIToolsHub · Made by Rayyan khan. </p>
          <div className="flex gap-5 text-sm text-gray-600">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
