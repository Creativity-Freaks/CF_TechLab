import { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Session { id: string; user_name?: string | null; user_email?: string | null; summary?: string | null; created_at: string; last_message_at?: string | null }
interface Message { id: string; session_id: string; role: 'user'|'assistant'|'system'; content: string; created_at: string }

export default function AdminChatsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selected, setSelected] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => { void loadSessions(); }, []);
  async function loadSessions() {
    try {
      const r = await fetch('/api/chats');
      const data = await r.json();
      setSessions(data.sessions || []);
    } catch (_e) {
      // no-op
    }
  }
  async function openSession(s: Session) {
    setSelected(s);
    try {
      const r = await fetch(`/api/chats?session=${s.id}`);
      const data = await r.json();
      setMessages(data.messages || []);
    } catch (_e) {
      // no-op
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sessions;
    return sessions.filter(s => (s.summary || '').toLowerCase().includes(q) || (s.user_email || '').toLowerCase().includes(q));
  }, [sessions, search]);

  return (
    <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-3 md:col-span-1 space-y-3">
        <div className="flex items-center gap-2">
          <Input placeholder="Search summary/email" value={search} onChange={e => setSearch(e.target.value)} />
          <Button variant="secondary" onClick={() => void loadSessions()}>Refresh</Button>
        </div>
        <div className="max-h-[70vh] overflow-auto divide-y">
          {filtered.map(s => (
            <div key={s.id} className="py-2 cursor-pointer hover:bg-muted rounded px-2" onClick={() => void openSession(s)}>
              <div className="text-sm font-medium">{s.summary || '—'}</div>
              <div className="text-xs text-muted-foreground">{s.user_email || ''}</div>
              <div className="text-xs text-muted-foreground">{new Date(s.last_message_at || s.created_at).toLocaleString()}</div>
            </div>
          ))}
          {filtered.length === 0 && <div className="text-sm text-muted-foreground p-2">No sessions found</div>}
        </div>
      </Card>
      <Card className="p-3 md:col-span-2">
        {!selected ? (
          <div className="text-sm text-muted-foreground">Select a session</div>
        ) : (
          <div className="space-y-2">
            <div className="font-semibold">Session: {selected.id}</div>
            <div className="text-xs text-muted-foreground">{selected.user_email || ''}</div>
            <div className="border rounded p-2 max-h-[70vh] overflow-auto space-y-2">
              {messages.map(m => (
                <div key={m.id} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                  <div className={`inline-block px-2 py-1 rounded text-sm ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>{m.content}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
