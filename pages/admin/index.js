import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { useAuth, UserDB } from '../../context/AuthContext';
import { aiTools } from '../../data/aiTools';

const ADMIN_EMAIL = 'phatanrayyankhan9@gmail.com';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!loading) {
      if (!user) { router.push('/login'); return; }
      if (user.email !== ADMIN_EMAIL && user.role !== 'admin') {
        router.push('/dashboard');
        return;
      }
      setUsers(UserDB.getAll());
    }
  }, [user, loading]);

  if (loading || !user) return (
    <Layout title="Admin"><div className="min-h-screen flex items-center justify-center"><div className="text-5xl animate-bounce">⏳</div></div></Layout>
  );

  if (user.email !== ADMIN_EMAIL && user.role !== 'admin') return null;

  const totalUsers = users.length;
  const totalPrompts = users.reduce((acc, u) => acc + (u.savedPrompts?.length || 0), 0);
  const proUsers = users.filter(u => u.plan === 'pro' || u.plan === 'enterprise').length;
  const revenue = proUsers * 9;

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.phone?.includes(search)
  );

  const deleteUser = (id) => {
    if (!confirm('Delete this user permanently?')) return;
    const updated = users.filter(u => u.id !== id);
    UserDB.save(updated);
    setUsers(updated);
  };

  return (
    <Layout title="Admin Dashboard">
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-xl font-black shadow-lg">⚡</div>
              <div>
                <h1 className="text-2xl font-black text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-500 text-sm">AIToolsHub Control Panel · {user.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/dashboard" className="btn-ghost text-sm">User View</Link>
              <Link href="/" className="btn-secondary text-sm py-2">← Site</Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { icon: '👥', label: 'Total Users', value: totalUsers, color: '#6366f1' },
              { icon: '💎', label: 'Pro Users', value: proUsers, color: '#8b5cf6' },
              { icon: '💰', label: 'Est. MRR', value: `$${revenue}`, color: '#10b981' },
              { icon: '✨', label: 'Total Prompts Saved', value: totalPrompts, color: '#f59e0b' },
            ].map(({ icon, label, value, color }) => (
              <div key={label} className="card p-6">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl mb-4" style={{ background: color + '18' }}>{icon}</div>
                <div className="text-3xl font-black text-gray-900">{value}</div>
                <div className="text-gray-500 text-sm mt-1">{label}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-white rounded-2xl p-1 border border-gray-100 shadow-sm w-fit mb-8">
            {[
              { id: 'overview', label: '📊 Overview' },
              { id: 'users', label: `👥 Users (${totalUsers})` },
              { id: 'tools', label: `🤖 Tools (${aiTools.length})` },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${tab === t.id ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Overview */}
          {tab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card p-6">
                <h3 className="font-black text-gray-900 mb-5">📈 Quick Metrics</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Conversion Rate (Free→Pro)', value: totalUsers > 0 ? ((proUsers / totalUsers) * 100).toFixed(1) + '%' : '0%' },
                    { label: 'Avg Prompts per User', value: totalUsers > 0 ? (totalPrompts / totalUsers).toFixed(1) : '0' },
                    { label: 'AI Tools Listed', value: aiTools.length + '+' },
                    { label: 'Monthly Revenue (est)', value: '$' + revenue },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
                      <span className="text-gray-500 text-sm">{label}</span>
                      <span className="font-black text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-6">
                <h3 className="font-black text-gray-900 mb-5">🔧 Quick Actions</h3>
                <div className="space-y-3">
                  {[
                    { icon: '👤', label: 'Manage Users', desc: 'View, edit, delete accounts', tab: 'users' },
                    { icon: '🤖', label: 'Manage Tools', desc: 'View all 75+ AI tools', tab: 'tools' },
                    { icon: '✉️', label: 'Contact Email', desc: 'phatanrayyankhan9@gmail.com', href: 'mailto:phatanrayyankhan9@gmail.com' },
                    { icon: '📊', label: 'User Dashboard', desc: 'See the user experience', href: '/dashboard' },
                  ].map(item => (
                    item.tab ? (
                      <button key={item.label} onClick={() => setTab(item.tab)}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all text-left">
                        <div className="text-2xl">{item.icon}</div>
                        <div>
                          <div className="font-bold text-gray-800 text-sm">{item.label}</div>
                          <div className="text-gray-400 text-xs">{item.desc}</div>
                        </div>
                      </button>
                    ) : (
                      <a key={item.label} href={item.href || '#'}
                        className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all">
                        <div className="text-2xl">{item.icon}</div>
                        <div>
                          <div className="font-bold text-gray-800 text-sm">{item.label}</div>
                          <div className="text-gray-400 text-xs">{item.desc}</div>
                        </div>
                      </a>
                    )
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Users */}
          {tab === 'users' && (
            <div>
              <div className="flex gap-3 mb-5">
                <input
                  type="text" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search users by name, email, or phone..."
                  className="input-field flex-1 max-w-md"
                />
                <button onClick={() => setUsers(UserDB.getAll())}
                  className="btn-secondary text-sm py-2.5">↻ Refresh</button>
              </div>

              {filteredUsers.length === 0 ? (
                <div className="card p-16 text-center">
                  <div className="text-5xl mb-4">👤</div>
                  <p className="text-gray-500">{search ? 'No users match your search.' : 'No users registered yet.'}</p>
                </div>
              ) : (
                <div className="card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          {['User', 'Contact', 'Plan', 'Prompts', 'Joined', 'Actions'].map(h => (
                            <th key={h} className="px-5 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {filteredUsers.map(u => {
                          const avatarColors = ['from-blue-500 to-indigo-600', 'from-purple-500 to-pink-600', 'from-emerald-500 to-teal-600', 'from-orange-500 to-red-500'];
                          const ac = avatarColors[u.id?.charCodeAt(0) % 4 || 0];
                          return (
                            <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${ac} flex items-center justify-center text-white text-xs font-black flex-shrink-0`}>
                                    {u.name?.[0]?.toUpperCase() || '?'}
                                  </div>
                                  <span className="font-bold text-gray-900">{u.name || 'Unknown'}</span>
                                </div>
                              </td>
                              <td className="px-5 py-4 text-gray-500">{u.email || u.phone || '—'}</td>
                              <td className="px-5 py-4">
                                <span className={`badge text-xs ${u.plan === 'pro' || u.plan === 'enterprise' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>
                                  {u.plan || 'free'}
                                </span>
                              </td>
                              <td className="px-5 py-4 text-gray-600 font-mono">{u.savedPrompts?.length || 0}</td>
                              <td className="px-5 py-4 text-gray-400 text-xs">
                                {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                              </td>
                              <td className="px-5 py-4">
                                <button onClick={() => deleteUser(u.id)}
                                  className="text-red-400 hover:text-red-600 text-xs font-bold transition-colors">
                                  Delete
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tools */}
          {tab === 'tools' && (
            <div>
              <p className="text-gray-500 text-sm mb-5">{aiTools.length} AI tools currently listed across {[...new Set(aiTools.map(t => t.category))].length} categories.</p>
              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        {['Tool', 'Category', 'Rating', 'Users', 'Free', 'URL'].map(h => (
                          <th key={h} className="px-5 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {aiTools.slice(0, 30).map(tool => (
                        <tr key={tool.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{tool.logo}</span>
                              <span className="font-bold text-gray-900">{tool.name}</span>
                              {tool.featured && <span className="badge bg-amber-100 text-amber-700 text-xs">⭐</span>}
                            </div>
                          </td>
                          <td className="px-5 py-3"><span className="badge bg-gray-100 text-gray-600 text-xs">{tool.category}</span></td>
                          <td className="px-5 py-3 text-amber-500 font-bold">★ {tool.rating}</td>
                          <td className="px-5 py-3 text-gray-500 text-xs">{tool.users}</td>
                          <td className="px-5 py-3">{tool.free ? <span className="text-green-600 font-bold text-xs">✓ Free</span> : <span className="text-gray-400 text-xs">Paid</span>}</td>
                          <td className="px-5 py-3">
                            <a href={tool.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 text-xs hover:underline font-semibold">Visit →</a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {aiTools.length > 30 && <div className="px-5 py-3 text-center text-gray-400 text-sm bg-gray-50">+ {aiTools.length - 30} more tools</div>}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
// Monetization tab will be added via admin panel revenue tab
