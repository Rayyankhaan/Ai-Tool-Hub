import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, getUserProfile, updateUserProfile } from '../lib/supabase';

const AuthContext = createContext({});

const hasSupabase = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co'
);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasSupabase) { setLoading(false); return; }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) { setUser(session.user); loadProfile(session.user.id); }
      else setLoading(false);
    }).catch(() => setLoading(false));

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) { setUser(session.user); await loadProfile(session.user.id); }
      else { setUser(null); setProfile(null); setLoading(false); }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function loadProfile(userId) {
    setLoading(true);
    try {
      const p = await getUserProfile(userId);
      const today = new Date().toISOString().split('T')[0];
      if (p && p.prompts_date !== today) {
        const reset = await updateUserProfile(userId, { prompts_used_today: 0, prompts_date: today });
        setProfile(reset);
      } else { setProfile(p); }
    } catch(err) { console.error('Profile load failed:', err); }
    finally { setLoading(false); }
  }

  async function signUp(email, password, name) {
    if (!hasSupabase) throw new Error('Supabase not configured. Add keys to .env.local');
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });
    if (error) throw error;
    return data;
  }

  async function signIn(email, password) {
    if (!hasSupabase) throw new Error('Supabase not configured. Add keys to .env.local');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async function signInWithGoogle() {
    if (!hasSupabase) throw new Error('Supabase not configured. Add keys to .env.local');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) throw error;
  }

  async function signInWithMagicLink(email) {
    if (!hasSupabase) throw new Error('Supabase not configured. Add keys to .env.local');
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) throw error;
  }

  async function resetPassword(email) {
    if (!hasSupabase) throw new Error('Supabase not configured. Add keys to .env.local');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) throw error;
  }

  async function updatePassword(newPassword) {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  }

  async function logout() {
    await supabase.auth.signOut();
  }

  async function updateProfile(updates) {
    if (!user) return;
    const updated = await updateUserProfile(user.id, updates);
    setProfile(updated);
    return updated;
  }

  async function trackPromptUsed() {
    if (!user) return false;
    const today = new Date().toISOString().split('T')[0];
    const isPro = profile?.plan === 'pro' || profile?.plan === 'team';
    const currentUsed = profile?.prompts_date === today ? (profile?.prompts_used_today || 0) : 0;
    if (!isPro && currentUsed >= 5) return false;
    try {
      const updated = await updateUserProfile(user.id, { prompts_used_today: currentUsed + 1, prompts_date: today });
      setProfile(updated);
    } catch {}
    return true;
  }

  async function savePrompt(prompt) {
    if (!user || profile?.plan === 'free') return false;
    const existing = profile?.saved_prompts || [];
    const updated = await updateUserProfile(user.id, { saved_prompts: [prompt, ...existing].slice(0, 100) });
    setProfile(updated);
    return true;
  }

  async function deletePrompt(promptId) {
    if (!user) return;
    const updated = await updateUserProfile(user.id, {
      saved_prompts: (profile?.saved_prompts || []).filter(p => p.id !== promptId),
    });
    setProfile(updated);
  }

  const isPro = profile?.plan === 'pro' || profile?.plan === 'team';
  const isTeam = profile?.plan === 'team';
  const remainingPrompts = isPro ? Infinity : Math.max(0, 5 - (profile?.prompts_used_today || 0));

  return (
    <AuthContext.Provider value={{
      user, profile, loading, hasSupabase,
      signUp, signIn, signInWithGoogle, signInWithMagicLink, resetPassword, updatePassword, logout,
      updateProfile, trackPromptUsed, savePrompt, deletePrompt,
      isPro, isTeam, remainingPrompts,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
