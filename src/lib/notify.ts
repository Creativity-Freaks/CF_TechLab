// Notification helper: calls Edge Function if enabled
import { supabase } from './supabase';

export interface NotifyPayloadMeta { [k: string]: string | number | boolean | null | undefined | string[] | number[] | boolean[]; }
export interface NotifyPayload {
  type: 'contact' | 'testimonial' | 'project' | 'service-request';
  id: string;
  meta?: NotifyPayloadMeta;
}

export async function sendNotification(payload: NotifyPayload) {
  if (import.meta.env.VITE_NOTIFICATIONS_ENABLED !== 'true') return;
  // Prefer official client invoke (adds auth headers automatically)
  // Try official client first
  if (supabase) {
    try {
      const { error } = await supabase.functions.invoke('notify', { body: payload });
      if (!error) return;
      console.warn('[notify] invoke error, will fallback', error.message);
    } catch (e) {
      console.warn('[notify] invoke exception – fallback', (e as Error).message);
    }
  }

  // Direct functions subdomain endpoint (usually has fewer proxy CORS quirks)
  const supaUrl = import.meta.env.VITE_SUPABASE_URL;
  const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!supaUrl || !anon) {
    console.warn('[notify] missing supabase env');
    return;
  }
  const fnSubdomain = supaUrl.replace('https://', '').replace('.supabase.co', '.functions.supabase.co');
  const fnUrlDirect = `https://${fnSubdomain}/notify`;
  const fnUrlProxy = `${supaUrl}/functions/v1/notify`;
  for (const url of [fnUrlDirect, fnUrlProxy]) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': anon,
          'Authorization': `Bearer ${anon}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) return; // success on one path
      const txt = await res.text().catch(() => '');
      console.warn('[notify] path failed', url, res.status, txt);
    } catch (e) {
      console.warn('[notify] path exception', url, (e as Error).message);
    }
  }
}
