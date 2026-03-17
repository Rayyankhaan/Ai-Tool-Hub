import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signUp, signInWithGoogle, signInWithMagicLink, resetPassword } = useAuth();

  const [mode, setMode]         = useState('login');   // login | signup | magic | reset
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [name, setName]         = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [message, setMessage]   = useState('');

  const redirect = router.query.redirect || '/dashboard';

  const handle = async (e) => {
    e.preventDefault();
    setError(''); setMessage(''); setLoading(true);
    try {
      if (mode === 'login') {
        await signIn(email, password);
        router.push(redirect);
      } else if (mode === 'signup') {
        await signUp(email, password, name);
        setMessage('Check your email to confirm your account, then log in.');
        setMode('login');
      } else if (mode === 'magic') {
        await signInWithMagicLink(email);
        setMessage('Magic link sent! Check your email and click the link.');
      } else if (mode === 'reset') {
        await resetPassword(email);
        setMessage('Password reset email sent! Check your inbox.');
        setMode('login');
      }
    } catch (err) {
      setError(err.message?.replace('AuthApiError: ', '') || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(''); setLoading(true);
    try { await signInWithGoogle(); }
    catch (err) { setError(err.message); setLoading(false); }
  };

  const titles = {
    login: { h: 'Welcome back', sub: 'Sign in to your AIToolsHub account' },
    signup: { h: 'Create account', sub: 'Join 50,000+ AI tool enthusiasts' },
    magic: { h: 'Magic link', sub: 'We\'ll email you a sign-in link — no password needed' },
    reset: { h: 'Reset password', sub: 'We\'ll send a reset link to your email' },
  };

  return (
    <Layout title={titles[mode].h}>
      <div className="min-h-screen flex" style={{ background: '#0a0a0f' }}>

        {/* Left — features panel */}
        <div className="hidden lg:flex flex-col justify-center px-16 w-2/5"
          style={{ background: 'linear-gradient(135deg,#1a1040,#0f0c29)' }}>
          <div className="mb-10">
            <Link href="/" className="text-2xl font-black text-white flex items-center gap-2">
              <span className="text-3xl">🤖</span> AIToolsHub
            </Link>
          </div>
          <h2 className="text-3xl font-black text-white mb-8 leading-tight">
            The ultimate AI tools directory for builders
          </h2>
          {[
            { icon: '🎨', title: '75+ AI Tools', desc: 'Curated directory across 17 categories' },
            { icon: '✨', title: 'AI Prompt Maker', desc: '8 specialized builders for any AI tool' },
            { icon: '💰', title: 'Save money', desc: 'Find the best free alternatives to paid tools' },
            { icon: '🚀', title: 'Stay updated', desc: 'New tools added every week' },
          ].map(f => (
            <div key={f.title} className="flex items-start gap-4 mb-5">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl flex-shrink-0">{f.icon}</div>
              <div>
                <div className="text-white font-bold text-sm">{f.title}</div>
                <div className="text-purple-300 text-sm">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Right — form */}
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-3xl p-8 shadow-2xl">

              {/* Logo (mobile) */}
              <div className="lg:hidden mb-6 text-center">
                <Link href="/" className="text-xl font-black text-gray-900 flex items-center justify-center gap-2">
                  <span className="text-2xl">🤖</span> AIToolsHub
                </Link>
              </div>

              <h1 className="text-2xl font-black text-gray-900 mb-1">{titles[mode].h}</h1>
              <p className="text-gray-500 text-sm mb-6">{titles[mode].sub}</p>

              {/* Messages */}
              {error   && <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm">{error}</div>}
              {message && <div className="mb-4 bg-green-50 border border-green-200 rounded-xl p-3 text-green-700 text-sm">{message}</div>}

              {/* Google button */}
              {(mode === 'login' || mode === 'signup') && (
                <>
                  <button onClick={handleGoogle} disabled={loading}
                    className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-sm transition-all mb-5">
                    <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.25-.164-1.84H9v3.48h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/></svg>
                    Continue with Google
                  </button>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex-1 h-px bg-gray-200"/>
                    <span className="text-gray-400 text-xs">or with email</span>
                    <div className="flex-1 h-px bg-gray-200"/>
                  </div>
                </>
              )}

              {/* Form */}
              <form onSubmit={handle} className="space-y-4">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Full name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)}
                      placeholder="Patan Rayyan Khan" className="input-field" required />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Email address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com" className="input-field" required />
                </div>
                {(mode === 'login' || mode === 'signup') && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-sm font-bold text-gray-700">Password</label>
                      {mode === 'login' && (
                        <button type="button" onClick={() => setMode('reset')}
                          className="text-xs text-indigo-600 hover:underline font-semibold">
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                      placeholder={mode === 'signup' ? 'Min. 8 characters' : '••••••••'}
                      className="input-field" required minLength={mode === 'signup' ? 8 : 1} />
                  </div>
                )}
                <button type="submit" disabled={loading}
                  className="w-full py-3.5 rounded-2xl bg-indigo-600 text-white font-black hover:bg-indigo-700 disabled:opacity-50 transition-all text-sm mt-2">
                  {loading ? 'Please wait...' : {
                    login: 'Sign in',
                    signup: 'Create free account',
                    magic: 'Send magic link',
                    reset: 'Send reset email',
                  }[mode]}
                </button>
              </form>

              {/* Mode toggles */}
              <div className="mt-5 text-center text-sm text-gray-500 space-y-2">
                {mode === 'login' && (
                  <>
                    <p>No account? <button onClick={() => setMode('signup')} className="text-indigo-600 font-bold hover:underline">Sign up free</button></p>
                    <p><button onClick={() => setMode('magic')} className="text-gray-400 hover:text-indigo-600 text-xs hover:underline">Sign in with magic link instead</button></p>
                  </>
                )}
                {(mode === 'signup' || mode === 'magic' || mode === 'reset') && (
                  <p>Already have an account? <button onClick={() => setMode('login')} className="text-indigo-600 font-bold hover:underline">Sign in</button></p>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
