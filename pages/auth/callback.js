// pages/auth/callback.js
// Supabase redirects here after Google OAuth or magic link login
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabase';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // Supabase automatically handles the token exchange from URL hash
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Redirect to dashboard after successful login
        router.replace('/dashboard');
      }
    });

    // Also handle the case where session is already set
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/dashboard');
    });
  }, []);

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0a0a0f', flexDirection: 'column', gap: '16px'
    }}>
      <div style={{
        width: 48, height: 48, border: '3px solid #6366f1', borderTopColor: 'transparent',
        borderRadius: '50%', animation: 'spin 0.8s linear infinite'
      }}/>
      <p style={{ color: '#a78bfa', fontFamily: 'sans-serif', fontSize: 16 }}>Signing you in...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
