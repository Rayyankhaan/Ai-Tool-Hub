// pages/auth/reset-password.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

export default function ResetPassword() {
  const { updatePassword } = useAuth();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [done, setDone]         = useState(false);
  const [validLink, setValidLink] = useState(false);

  useEffect(() => {
    // Supabase puts the access token in the URL hash after reset link click
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') setValidLink(true);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return setError('Passwords do not match');
    if (password.length < 8) return setError('Password must be at least 8 characters');
    setLoading(true);
    setError('');
    try {
      await updatePassword(password);
      setDone(true);
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Reset Password">
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-2xl font-black text-gray-900 mb-2">Set new password</h1>
          <p className="text-gray-500 text-sm mb-6">Choose a strong password for your account.</p>

          {done ? (
            <div className="text-center py-6">
              <div className="text-4xl mb-3">✅</div>
              <p className="font-bold text-gray-900">Password updated!</p>
              <p className="text-gray-500 text-sm">Redirecting to dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm">{error}</div>
              )}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">New password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 8 characters" className="input-field" required minLength={8} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Confirm password</label>
                <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                  placeholder="Same as above" className="input-field" required />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-indigo-600 text-white font-black hover:bg-indigo-700 disabled:opacity-50 transition-all">
                {loading ? 'Updating...' : 'Update password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}
