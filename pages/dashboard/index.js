import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { useAuth, UserDB } from '../../context/AuthContext';
import { plans, getUsageStats } from '../../data/startup';
import { aiTools } from '../../data/aiTools';

function StatCard({ icon, label, value, sub, color = '#6366f1' }) {
  return (
    <div className="card p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: color + '18' }}>{icon}</div>
        {sub && <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{sub}</span>}
      </div>
      <div className="text-3xl font-black text-gray-900 mb-1">{value}</div>
      <div className="text-gray-500 text-sm">{label}</div>
    </div>
  );
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState('overview');
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading]);

  if (loading || !user) {
    return (
      <Layout title="Dashboard">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl mb-4 animate-bounce">⏳</div>
            <p className="text-gray-500 font-semibold">Loading your dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const stats = getUsageStats(user);
  const plan = plans.find(p => p.id === (user.plan || 'free'));
  const savedPrompts = user.savedPrompts || [];
  const avatarColors = ['from-blue-500 to-indigo-600', 'from-purple-500 to-pink-600', 'from-emerald-500 to-teal-600', 'from-orange-500 to-red-500'];
  const avatarColor = avatarColors[user.id?.charCodeAt(0) % 4 || 0];

  const copyPrompt = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const deletePrompt = (id) => {
    const updated = savedPrompts.filter(p => p.id !== id);
    const users = UserDB.getAll();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx > -1) { users[idx].savedPrompts = updated; UserDB.save(users); }
    // Trigger re-render via updateUser from context if needed
    window.location.reload();
  };

  return (
    <Layout title="Dashboard">
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white text-2xl font-black shadow-lg`}>
                {user.name?.[0]?.toUpperCase() || '?'}
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-900">Welcome back, {user.name?.split(' ')[0]}! 👋</h1>
                <p className="text-gray-500 text-sm">{user.email || user.phone} · <span className="font-semibold capitalize text-indigo-600">{plan?.name} Plan</span></p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/prompt-maker" className="btn-primary py-2.5 text-sm">✨ New Prompt</Link>
              <Link href="/ai-tools" className="btn-secondary py-2.5 text-sm">🤖 Browse Tools</Link>
            </div>
          </div>

          {/* Plan Banner */}
          {user.plan !== 'pro' && user.plan !== 'enterprise' && (
            <div className="relative rounded-3xl p-6 mb-8 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #1a0a2e 100%)' }}>
              <div className="absolute right-0 top-0 bottom-0 w-64 opacity-10" style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
              <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="text-white font-black text-lg mb-1">🚀 Upgrade to Pro</div>
                  <p className="text-gray-400 text-sm">Unlock unlimited prompts, all utilities, and save to your library — just $9/month.</p>
                </div>
                <Link href="/#pricing" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-2xl transition-all hover:-translate-y-0.5 whitespace-nowrap text-sm">
                  Upgrade Now →
                </Link>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-1 bg-white rounded-2xl p-1 mb-8 border border-gray-100 w-fit shadow-sm">
            {[
              { id: 'overview', label: '📊 Overview' },
              { id: 'prompts', label: `🔖 Prompts (${savedPrompts.length})` },
              { id: 'tools', label: '🤖 Saved Tools' },
              { id: 'settings', label: '⚙️ Settings' },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  tab === t.id ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* ── OVERVIEW TAB ──────────────────────────────────── */}
          {tab === 'overview' && (
            <div className="space-y-8">
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon="✨" label="Prompts Generated Today" value={stats.promptsUsed} sub={stats.promptsLimit === -1 ? 'Unlimited' : `${stats.promptsLimit - stats.promptsUsed} left`} color="#6366f1" />
                <StatCard icon="🔖" label="Saved Prompts" value={savedPrompts.length} color="#8b5cf6" />
                <StatCard icon="🔥" label="Day Streak" value={`${stats.streak} days`} sub="+1 today" color="#f59e0b" />
                <StatCard icon="🤖" label="Tools Explored" value={stats.toolsViewed || 12} color="#10b981" />
              </div>

              {/* Usage Bar */}
              {stats.promptsLimit !== -1 && (
                <div className="card p-6">
                  <div className="flex justify-between items-center mb-3">
                    <div className="font-bold text-gray-900">Daily Prompt Usage</div>
                    <span className="text-sm text-gray-500">{stats.promptsUsed} / {stats.promptsLimit}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${stats.promptsPercent}%` }} />
                  </div>
                  <div className="flex justify-between mt-3 text-xs text-gray-400">
                    <span>Resets at midnight</span>
                    <Link href="/#pricing" className="text-indigo-600 font-bold hover:underline">Upgrade for unlimited →</Link>
                  </div>
                </div>
              )}

              {/* Recent Prompts */}
              {savedPrompts.length > 0 && (
                <div className="card p-6">
                  <div className="flex justify-between items-center mb-5">
                    <h3 className="font-black text-gray-900">Recent Prompts</h3>
                    <button onClick={() => setTab('prompts')} className="text-indigo-600 text-sm font-semibold hover:underline">View all →</button>
                  </div>
                  <div className="space-y-3">
                    {savedPrompts.slice(0, 3).map(p => (
                      <div key={p.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                        <span className="text-2xl flex-shrink-0">{p.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-gray-800 text-sm">{p.category}</span>
                            <span className="text-gray-400 text-xs">{p.createdAt}</span>
                          </div>
                          <p className="text-gray-500 text-xs line-clamp-2 font-mono">{p.prompt}</p>
                        </div>
                        <button onClick={() => copyPrompt(p.prompt, p.id)} className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${copied === p.id ? 'bg-green-100 text-green-700' : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300'}`}>
                          {copied === p.id ? '✅' : '📋'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { href: '/prompt-maker', icon: '✨', label: 'Prompt Maker', color: '#6366f1' },
                  { href: '/ai-tools', icon: '🤖', label: 'AI Tools', color: '#8b5cf6' },
                  { href: '/free-tools', icon: '🛠️', label: 'Free Tools', color: '#10b981' },
                  { href: '/tutorials', icon: '📺', label: 'Tutorials', color: '#ef4444' },
                ].map(({ href, icon, label, color }) => (
                  <Link key={href} href={href} className="card p-5 text-center group hover:!shadow-xl">
                    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform" style={{ filter: 'drop-shadow(0 4px 8px ' + color + '40)' }}>{icon}</div>
                    <div className="font-bold text-gray-800 text-sm">{label}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ── PROMPTS TAB ──────────────────────────────────── */}
          {tab === 'prompts' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black text-gray-900">Saved Prompts</h2>
                <Link href="/prompt-maker" className="btn-primary text-sm py-2.5">✨ New Prompt</Link>
              </div>
              {savedPrompts.length === 0 ? (
                <div className="card p-16 text-center">
                  <div className="text-5xl mb-4">🔖</div>
                  <h3 className="font-black text-gray-800 text-lg mb-2">No saved prompts yet</h3>
                  <p className="text-gray-400 text-sm mb-6">Generate prompts in the Prompt Maker and save them here for easy access.</p>
                  <Link href="/prompt-maker" className="btn-primary">✨ Open Prompt Maker</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedPrompts.map(p => (
                    <div key={p.id} className="card p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{p.icon}</span>
                          <span className="font-bold text-gray-800 text-sm">{p.category}</span>
                        </div>
                        <span className="text-gray-400 text-xs">{p.createdAt}</span>
                      </div>
                      <div className="bg-gray-950 rounded-2xl p-4 font-mono text-xs text-green-300 leading-relaxed max-h-28 overflow-y-auto whitespace-pre-wrap mb-4">
                        {p.prompt}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => copyPrompt(p.prompt, p.id)}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${copied === p.id ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                          {copied === p.id ? '✅ Copied!' : '📋 Copy'}
                        </button>
                        <button onClick={() => deletePrompt(p.id)}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-red-50 text-red-500 hover:bg-red-100 transition-all">
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── TOOLS TAB ────────────────────────────────────── */}
          {tab === 'tools' && (
            <div>
              <h2 className="text-xl font-black text-gray-900 mb-6">Explore AI Tools</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {aiTools.filter(t => t.featured).map(tool => (
                  <div key={tool.id} className="card p-5 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: tool.color + '18' }}>
                      {tool.logo}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-900 text-sm mb-1">{tool.name}</div>
                      <div className="text-gray-400 text-xs mb-2 line-clamp-2">{tool.description}</div>
                      <a href={tool.url} target="_blank" rel="noopener noreferrer"
                        className="text-indigo-600 text-xs font-bold hover:underline">Visit →</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SETTINGS TAB ─────────────────────────────────── */}
          {tab === 'settings' && (
            <div className="max-w-xl space-y-5">
              <div className="card p-6">
                <h3 className="font-black text-gray-900 mb-5">Account Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1.5">Display Name</label>
                    <div className="input-field bg-gray-50 text-gray-600">{user.name}</div>
                  </div>
                  {user.email && (
                    <div>
                      <label className="block text-sm font-bold text-gray-600 mb-1.5">Email</label>
                      <div className="input-field bg-gray-50 text-gray-600">{user.email}</div>
                    </div>
                  )}
                  {user.phone && (
                    <div>
                      <label className="block text-sm font-bold text-gray-600 mb-1.5">Phone</label>
                      <div className="input-field bg-gray-50 text-gray-600">{user.phone}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="card p-6">
                <h3 className="font-black text-gray-900 mb-2">Current Plan</h3>
                <p className="text-gray-500 text-sm mb-4">You are on the <strong className="text-gray-900 capitalize">{plan?.name}</strong> plan.</p>
                {user.plan !== 'pro' && (
                  <Link href="/#pricing" className="btn-primary w-full justify-center">🚀 Upgrade to Pro — $9/mo</Link>
                )}
              </div>

              <div className="card p-6 border-red-100">
                <h3 className="font-black text-red-600 mb-2">Danger Zone</h3>
                <p className="text-gray-500 text-sm mb-4">These actions are irreversible. Please be careful.</p>
                <button
                  onClick={() => { if (confirm('Delete all your saved prompts?')) { const u = UserDB.getAll(); const idx = u.findIndex(x => x.id === user.id); if (idx > -1) { u[idx].savedPrompts = []; UserDB.save(u); window.location.reload(); } } }}
                  className="px-5 py-2.5 rounded-xl bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 transition-all">
                  🗑️ Clear All Saved Prompts
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
