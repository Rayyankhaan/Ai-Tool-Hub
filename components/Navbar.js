import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);
  useEffect(() => {
    const h = (e) => { if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const navLinks = [
    { href: '/ai-tools', label: 'AI Tools' },
    { href: '/ai-models', label: '🧬 Models', highlight: false },
    { href: '/prompt-maker', label: '✨ Prompts', highlight: true },
    { href: '/free-tools', label: 'Free Tools' },
    { href: '/blog', label: 'Blog' },
    { href: '/tutorials', label: 'Tutorials' },
    { href: '/#pricing', label: 'Pricing' },
  ];
  const isActive = (href) => router.pathname === href;
  const avatarColors = ['from-blue-500 to-indigo-600','from-purple-500 to-pink-600','from-emerald-500 to-teal-600','from-orange-500 to-red-500'];
  const ac = user ? avatarColors[user.id?.charCodeAt(0) % 4 || 0] : avatarColors[0];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              <span className="text-white font-black text-sm">AI</span>
            </div>
            <span className="font-black text-lg text-gray-900">AITools<span className="gradient-text">Hub</span></span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(({ href, label, highlight }) => (
              <Link key={href} href={href}
                className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all duration-200 whitespace-nowrap ${
                  highlight ? 'text-indigo-600 hover:bg-indigo-50' : isActive(href) ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}>
                {label}
              </Link>
            ))}
          </div>

          {/* Right */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-2xl hover:bg-gray-100 transition-colors">
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${ac} flex items-center justify-center text-white text-sm font-black`}>
                    {user.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <span className="text-sm font-bold text-gray-700 max-w-[90px] truncate">{user.name?.split(' ')[0]}</span>
                  <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-12 w-56 bg-white rounded-3xl shadow-2xl border border-gray-100 py-2 z-50" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }}>
                    <div className="px-4 py-3 border-b border-gray-50">
                      <p className="text-xs text-gray-400 mb-0.5">Signed in as</p>
                      <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email || user.phone}</p>
                    </div>
                    {[
                      { href: '/dashboard', icon: '📊', label: 'Dashboard' },
                      { href: '/prompt-maker', icon: '✨', label: 'Prompt Maker' },
                      { href: '/profile', icon: '👤', label: 'Profile' },
                      ...(user.email === 'phatanrayyankhan9@gmail.com' || user.role === 'admin' ? [{ href: '/admin', icon: '⚡', label: 'Admin Panel' }] : []),
                    ].map(({ href, icon, label }) => (
                      <Link key={href} href={href} onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                        <span className="text-base">{icon}</span>{label}
                      </Link>
                    ))}
                    <div className="border-t border-gray-50 mt-1 pt-1">
                      <button onClick={() => { logout(); setUserMenuOpen(false); router.push('/'); }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors">
                        <span>🚪</span> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm font-bold text-gray-600 hover:text-gray-900 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all">Sign In</Link>
                <Link href="/login" className="btn-primary text-sm py-2.5 px-5">Get Started Free →</Link>
              </>
            )}
          </div>

          {/* Mobile */}
          <div className="lg:hidden flex items-center gap-2">
            {user && (
              <Link href="/dashboard" className={`w-8 h-8 rounded-xl bg-gradient-to-br ${ac} flex items-center justify-center text-white text-sm font-black`}>
                {user.name?.[0]?.toUpperCase() || '?'}
              </Link>
            )}
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors">
              <div className={`w-5 h-0.5 bg-current mb-1.5 transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <div className={`w-5 h-0.5 bg-current mb-1.5 transition-all ${isOpen ? 'opacity-0' : ''}`} />
              <div className={`w-5 h-0.5 bg-current transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-[600px]' : 'max-h-0'}`}>
        <div className="bg-white/95 backdrop-blur-xl border-t border-gray-100 px-4 py-4 space-y-1">
          {navLinks.map(({ href, label, highlight }) => (
            <Link key={href} href={href} onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 rounded-2xl text-sm font-bold transition-colors ${highlight ? 'text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}>
              {label}
            </Link>
          ))}
          <div className="border-t border-gray-100 pt-3 mt-3 space-y-2">
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-50">📊 Dashboard</Link>
                <button onClick={() => { logout(); setIsOpen(false); router.push('/'); }} className="block w-full px-4 py-3 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 text-left">🚪 Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-50">Sign In</Link>
                <Link href="/login" onClick={() => setIsOpen(false)} className="btn-primary w-full justify-center py-3">🚀 Get Started Free</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
