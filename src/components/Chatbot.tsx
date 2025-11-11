import { useEffect, useMemo, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MessageSquare, Send, X, Bot, Loader2 } from 'lucide-react';
import { submitServiceRequest, type ServiceRequestPayload } from '@/lib/service-request';

interface ChatMessage { role: 'user' | 'assistant' | 'system'; content: string }
interface ActionMeta { requested?: string[]; message?: string }
interface ChatServerResponse { reply: string; action?: 'create_service_request' | 'none'; actionMeta?: ActionMeta; sessionId?: string }

const CATEGORIES = ['Web Development', 'App Development', 'UI/UX', 'Consulting', 'Automation', 'Tech Support'];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'হ্যালো! আমি CF TechLab এর এআই সহকারী। কিভাবে সহযোগিতা করতে পারি?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestAction, setSuggestAction] = useState<ChatServerResponse | null>(null);

  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const next = [...messages, { role: 'user', content: input.trim() } as ChatMessage];
    setMessages(next);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next, sessionId })
      });
      const data = (await res.json()) as ChatServerResponse;
      const reply = data?.reply || 'দুঃখিত, উত্তর আনতে সমস্যা হয়েছে।';
      setMessages(m => [...m, { role: 'assistant', content: reply }]);
      setSuggestAction(data || null);
      if (data.sessionId && !sessionId) setSessionId(data.sessionId);
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'দুঃখিত, সার্ভারের সাথে সমস্যা হচ্ছে। পরে চেষ্টা করুন।' }]);
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  }

  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  return (
    <>
      {/* Floating Toggle Button */}
      <Button
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-4 right-4 z-40 rounded-full h-12 w-12 p-0 shadow-lg"
      >
        {open ? <X className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
      </Button>

      {/* Chat Panel */}
      {open && (
        <Card className="fixed bottom-20 right-4 z-40 w-[90vw] max-w-sm shadow-xl p-3 flex flex-col gap-2">
          <div className="flex items-center gap-2 border-b pb-2">
            <Bot className="h-5 w-5" />
            <div className="font-semibold">CF TechLab Assistant</div>
          </div>
          <div ref={listRef} className="max-h-80 overflow-y-auto pr-1 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                <div className={`inline-block rounded px-3 py-2 text-sm ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>{m.content}</div>
              </div>
            ))}
            {loading && (
              <div className="text-left inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> টাইপ করা হচ্ছে…
              </div>
            )}
          </div>

          {/* Suggested action */}
          {suggestAction?.action === 'create_service_request' && (
            <ServiceRequestQuickAction actionMeta={suggestAction.actionMeta} />
          )}

          {/* Input */}
          <div className="flex items-center gap-2">
            <Input
              placeholder="আপনার বার্তা লিখুন…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKeyDown}
            />
            <Button onClick={() => void sendMessage()} disabled={loading || !input.trim()} size="icon">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </Card>
      )}
    </>
  );
}

function ServiceRequestQuickAction({ actionMeta }: { actionMeta?: ActionMeta }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState(actionMeta?.message || '');
  const [requested, setRequested] = useState<string[]>(() => Array.isArray(actionMeta?.requested) ? actionMeta!.requested as string[] : []);
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (requested.length === 0) setRequested([CATEGORIES[0]]); }, [requested.length]);

  async function submit() {
    if (!name || !email) return;
    setBusy(true);
    const payload: ServiceRequestPayload = {
      name, email, company: company || undefined,
      message: message || undefined,
      meetingDate: undefined, meetingTime: undefined,
      requested, submittedAt: new Date().toISOString()
    };
    try {
      await submitServiceRequest(payload);
      setOpen(false);
      alert('ধন্যবাদ! আপনার অনুরোধ গ্রহণ করা হয়েছে।');
    } catch (e) {
      alert('দুঃখিত, অনুরোধ পাঠাতে ব্যর্থ। পরে আবার চেষ্টা করুন।');
    } finally {
      setBusy(false);
    }
  }

  function toggleRequested(cat: string) {
    setRequested(arr => arr.includes(cat) ? arr.filter(c => c !== cat) : [...arr, cat]);
  }

  return (
    <div className="flex items-center justify-between gap-2 border rounded-md p-2 text-sm">
      <div>আপনি চাইলে এখনই একটি সার্ভিস রিকোয়েস্ট করতে পারেন।</div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="default">রিকোয়েস্ট করুন</Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Service Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Input placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
            <Input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
            <Input placeholder="Company (optional)" value={company} onChange={e => setCompany(e.target.value)} />
            <div>
              <div className="mb-1 text-sm font-medium">Service types</div>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => toggleRequested(cat)}
                    className={`px-2 py-1 rounded border text-xs ${requested.includes(cat) ? 'bg-primary text-primary-foreground' : ''}`}
                  >{cat}</button>
                ))}
              </div>
            </div>
            <Textarea placeholder="Message (optional)" value={message} onChange={e => setMessage(e.target.value)} />
            <div className="flex justify-end">
              <Button onClick={() => void submit()} disabled={busy || !name || !email}>
                {busy ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
