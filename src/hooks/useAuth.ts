import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface AuthState {
  loading: boolean;
  email: string | null;
}

export function useSession() {
  const [state, setState] = useState<AuthState>({ loading: true, email: null });
  const [directory, setDirectory] = useState<string[] | null>(null);

  useEffect(() => {
    let mounted = true;
    async function init() {
      if (!supabase) {
        setState({ loading: false, email: null });
        return;
      }
      const { data: { session } } = await supabase.auth.getSession();
      if (mounted) setState({ loading: false, email: session?.user?.email || null });
      // Load admin directory emails for role check
      try {
        const { data, error } = await supabase.from('admins').select('email');
        if (!error && Array.isArray(data)) {
          setDirectory((data as { email: string }[]).map(r => r.email?.toLowerCase()).filter(Boolean));
        }
      } catch (e) {
        // ignore directory fetch errors; will fall back to env allowlist
      }
      const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => {
        setState({ loading: false, email: sess?.user?.email || null });
      });
      return () => { listener.subscription.unsubscribe(); };
    }
    init();
    return () => { mounted = false; };
  }, []);

  const adminEmails = useMemo(() => {
    if (directory && directory.length) return directory;
    const raw = (import.meta.env.VITE_ADMIN_EMAILS as string | undefined) || '';
    return raw.split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
  }, [directory]);

  const isAdmin = useMemo(() => {
    if (!state.email) return false;
    if (adminEmails.length === 0) return false;
    return adminEmails.includes(state.email.toLowerCase());
  }, [state.email, adminEmails]);

  return { ...state, isAdmin };
}

export async function signIn(email: string, password: string) {
  if (!supabase) throw new Error('supabase_not_configured');
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
}

export async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
}
