// /api/chats - list chat sessions (basic) & messages
// GET /api/chats -> { sessions: [...] }
// GET /api/chats?session=<id> -> { messages: [...] }
// Requires SUPABASE_SERVICE_ROLE_KEY (server env) and SUPABASE_URL

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IncomingMessage, ServerResponse } from 'http';

interface ChatSessionRow { id: string; user_name: string | null; user_email: string | null; summary: string | null; created_at: string; last_message_at: string | null; }
interface ChatMessageRow { id: string; session_id: string; role: string; content: string; created_at: string; }

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const url = new URL(req.url, 'http://localhost');
  const sessionId = url.searchParams.get('session');
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return res.status(500).json({ error: 'Missing Supabase service env' });

  try {
    if (sessionId) {
      const messagesRes = await fetch(`${supabaseUrl}/rest/v1/chat_messages?session_id=eq.${sessionId}&order=created_at.asc`, {
        headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` }
      });
      const messages: ChatMessageRow[] = await messagesRes.json();
      return res.status(200).json({ messages });
    }
    const sessionsRes = await fetch(`${supabaseUrl}/rest/v1/chat_sessions?select=*&order=last_message_at.desc&limit=200`, {
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` }
    });
    const sessions: ChatSessionRow[] = await sessionsRes.json();
    return res.status(200).json({ sessions });
  } catch (e: any) {
    return res.status(500).json({ error: 'Supabase fetch failed', message: e.message });
  }
}
