import { useEffect, useState } from 'react';
import { supabase, supabasePing } from '@/lib/supabase';

export function SupabaseStatus() {
  const [state, setState] = useState<'checking'|'ok'|'fail'|'missing'>('checking');
  const [detail, setDetail] = useState<string>('');
  useEffect(() => {
    (async () => {
      if (!supabase) { setState('missing'); return; }
      const res = await supabasePing();
      if (res.ok) setState('ok'); else { setState('fail'); setDetail(res.error || res.reason); }
    })();
  }, []);
  let label: string;
  if (state === 'checking') label = 'Supabase: Checking...';
  else if (state === 'ok') label = 'Supabase: Connected';
  else if (state === 'missing') label = 'Supabase: Not configured';
  else label = 'Supabase: Failed (' + detail + ')';
  const color = state === 'ok' ? 'text-green-500' : state === 'fail' ? 'text-destructive' : 'text-muted-foreground';
  return <div className={`text-xs font-medium ${color}`}>{label}</div>;
}
