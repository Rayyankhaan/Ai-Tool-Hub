import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useAuth, UserDB } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState('profile');
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [saved, setSaved] = useState(false);

  if (!user) {
    return (
      <Layout title="Profile">
        <div className="min-h-[70vh] flex flex-col items-center justify-center gap-5 text-center px-4">
          <div className="text-6xl">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800">You're not logged in</h2>
          <p className="text-gray-500">Please log in to view your profile and saved prompts.</p>
          <Link href="/login" className="btn-primary">🔑 Sign In</Link>
        </div>
      </Layout>
    );
  }

  const handleSaveName = () => {
    if (!name.trim()) return;
    const updated = UserDB.update(user.id, { name });
    updateUser({ name });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const savedPrompts = user.savedPrompts || [];

  const copyPrompt = (prompt) => {
    navigator.clipboard.writeText(prompt);
  };

  const deletePrompt = (id) => {
    const newPrompts = savedPrompts.filter(p => p.id !== id);
    updateUser({ savedPrompts: newPrompts });
  };

  const avatarColors = ['from-blue-500 to-indigo-600', 'from-purple-500 to-pink-600', 'from-emerald-500 to-teal-600', 'from-orange-500 to-red-500'];
  const avatarColor = avatarColors[user.id?.charCodeAt(0) % 4 || 0];

  return (
    <Layout title="My Profile">
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 100%)' }} className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-5">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white text-3xl font-bold shadow-xl flex-shrink-0`}>
              {user.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white mb-1">{user.name || 'User'}</h1>
              <p className="text-gray-400 text-sm">{user.email || user.phone || 'No contact info'}</p>
              <div className="flex gap-2 mt-2">
                {user.provider === 'google' && (
                  <span className="px-2.5 py-0.5 bg-white/10 rounded-full text-xs text-gray-300">🌐 Google</span>
                )}
                <span className="px-2.5 py-0.5 bg-white/10 rounded-full text-xs text-gray-300">
                  🔖 {savedPrompts.length} saved prompts
                </span>
              </div>
            </div>
            <div className="ml-auto">
              <button onClick={handleLogout} className="px-4 py-2 bg-white/10 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-all border border-white/20">
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-8 w-fit">
          {[
            { id: 'profile', label: '👤 Profile' },
            { id: 'prompts', label: `🔖 Saved Prompts (${savedPrompts.length})` },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === t.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {tab === 'profile' && (
          <div className="space-y-5">
            {saved && <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-green-700 text-sm">✅ Profile updated!</div>}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
              <h2 className="font-bold text-gray-900 text-lg">Account Details</h2>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1.5">Display Name</label>
                {editing ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      defaultValue={user.name}
                      onChange={e => setName(e.target.value)}
                      className="input-field flex-1"
                      placeholder="Your name"
                    />
                    <button onClick={handleSaveName} className="btn-primary px-4 py-2 text-sm">Save</button>
                    <button onClick={() => setEditing(false)} className="btn-secondary px-4 py-2 text-sm">Cancel</button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-800 font-medium">{user.name || '—'}</span>
                    {user.provider !== 'google' && (
                      <button onClick={() => setEditing(true)} className="text-brand-600 text-sm hover:underline">Edit</button>
                    )}
                  </div>
                )}
              </div>

              {user.email && (
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1.5">Email</label>
                  <div className="p-3 bg-gray-50 rounded-xl text-gray-800">{user.email}</div>
                </div>
              )}

              {user.phone && (
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1.5">Phone</label>
                  <div className="p-3 bg-gray-50 rounded-xl text-gray-800">{user.phone}</div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1.5">Member Since</label>
                <div className="p-3 bg-gray-50 rounded-xl text-gray-800 text-sm">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Today'}
                </div>
              </div>
            </div>

            {/* Quick links */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { href: '/ai-tools', icon: '🤖', label: 'Browse AI Tools', desc: '75+ tools' },
                { href: '/prompt-maker', icon: '✨', label: 'AI Prompt Maker', desc: '8 categories' },
                { href: '/free-tools', icon: '🛠️', label: 'Free Tools', desc: '6 utilities' },
              ].map(({ href, icon, label, desc }) => (
                <Link key={href} href={href} className="card p-5 flex items-center gap-3 group">
                  <div className="text-2xl group-hover:scale-110 transition-transform">{icon}</div>
                  <div>
                    <div className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors text-sm">{label}</div>
                    <div className="text-gray-400 text-xs">{desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Saved Prompts Tab */}
        {tab === 'prompts' && (
          <div>
            {savedPrompts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <div className="text-5xl mb-4">🔖</div>
                <h3 className="text-lg font-bold text-gray-700 mb-2">No saved prompts yet</h3>
                <p className="text-gray-400 text-sm mb-5">Generate prompts in the Prompt Maker and save them here.</p>
                <Link href="/prompt-maker" className="btn-primary">✨ Open Prompt Maker</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {savedPrompts.map(p => (
                  <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{p.icon}</span>
                        <span className="font-semibold text-gray-800 text-sm">{p.category}</span>
                        <span className="text-gray-400 text-xs">· {p.createdAt}</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => copyPrompt(p.prompt)} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-medium rounded-lg transition-colors">
                          📋 Copy
                        </button>
                        <button onClick={() => deletePrompt(p.id)} className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-medium rounded-lg transition-colors">
                          🗑️
                        </button>
                      </div>
                    </div>
                    <div className="bg-gray-950 rounded-xl p-3 font-mono text-xs text-green-300 leading-relaxed max-h-32 overflow-y-auto whitespace-pre-wrap">
                      {p.prompt}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
