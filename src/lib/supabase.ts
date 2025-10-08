import { createClient } from '@supabase/supabase-js';

// Expect these to be defined in a root .env.{mode} file prefixed with VITE_
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!url || !anonKey) {
  // Non-fatal: we allow components to detect missing client and show fallback data.
  console.warn('[supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not set – falling back to static data.');
}

export const supabase = (url && anonKey) ? createClient(url, anonKey, {
  auth: { persistSession: false }
}) : null;

const bucket = (import.meta.env.VITE_SUPABASE_BUCKET as string | undefined) || 'uploads';

export type Tables = {
  services: {
    id: string;
    title: string;
    description: string;
    icon_key: string;
    gradient: string | null;
    created_at: string;
  };
  projects: {
    id: string;
    title: string;
    category: string;
    description: string;
    image: string;
    icon_key: string;
    tags: string[] | null;
    year: string;
    project_url: string | null;
    created_at: string;
  };
  testimonials: {
    id: string;
    name: string;
    role: string;
    image: string;
    content: string;
    rating: number;
    approved: boolean;
    created_at: string;
  };
};

export function publicUrlFor(path: string) {
  if (!supabase) return path;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function supabasePing() {
  if (!supabase) return { ok: false, reason: 'not_configured' as const };
  try {
    const { error } = await supabase.from('services').select('id', { count: 'exact', head: true }).limit(1);
    if (error) return { ok: false, reason: 'query_failed' as const, error: error.message };
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, reason: 'exception', error: (e as Error).message };
  }
}
