/* eslint-disable @typescript-eslint/no-explicit-any */
// Vercel Serverless Function: /api/chat
// Accepts POST { messages: { role: 'user'|'assistant'|'system', content: string }[] }
// Returns { reply: string, action?: 'create_service_request', actionMeta?: Record<string, any> }

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing OPENAI_API_KEY' });
  }
  let body: any = {};
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }
  const userMessages = Array.isArray(body.messages) ? body.messages : [];
  const lang = body.lang || 'bn'; // default Bangla

  const systemPrompt = (
    lang === 'bn'
      ? `আপনি CF TechLab এর সহায়ক এআই চ্যাটবট।
- সংক্ষেপে, বন্ধুসুলভ ভঙ্গিতে উত্তর দিন।
- যদি ব্যবহারকারী সেবা/কোট/মিটিং সম্পর্কে আগ্রহ দেখায়, তাহলে JSON-এ action: "create_service_request" সাজেশন দিন এবং actionMeta.requested-এ সম্ভাব্য সার্ভিস ক্যাটাগরিগুলোর একটি ছোট লিস্ট যোগ করুন।
- নিরাপত্তা: ব্যক্তিগত বা সংবেদনশীল তথ্য চাইবেন না (যেমন কার্ড/পাসওয়ার্ড)।
আউটপুট JSON আকারে দিন: { "reply": string, "action"?: "create_service_request" | "none", "actionMeta"?: object }`
      : `You are CF TechLab's helpful AI assistant. Be concise and friendly. If the user seems to request services/quote/meeting, suggest action: "create_service_request" with actionMeta.requested categories. Output valid JSON.`
  );

  const messages = [
    { role: 'system', content: systemPrompt },
    ...userMessages.map((m: any) => ({ role: m.role || 'user', content: String(m.content || '') }))
  ];

  try {
    // Optional: Log chat into Supabase (create session if not provided)
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const sessionId = typeof body.sessionId === 'string' ? body.sessionId : undefined;
    let activeSessionId = sessionId;
    try {
      if (supabaseUrl && serviceKey) {
        if (!activeSessionId) {
          const resp = await fetch(`${supabaseUrl}/rest/v1/chat_sessions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
            body: JSON.stringify({})
          });
          const arr = await resp.json().catch(() => []);
          activeSessionId = arr?.[0]?.id;
        }
        // Insert last user message (if any)
        const lastUser = userMessages[userMessages.length - 1];
        if (activeSessionId && lastUser?.content) {
          await fetch(`${supabaseUrl}/rest/v1/chat_messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
            body: JSON.stringify([{ session_id: activeSessionId, role: 'user', content: String(lastUser.content) }])
          }).catch(() => {});
        }
      }
    } catch { /* ignore logging errors */ }

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.7,
        response_format: { type: 'json_object' },
        messages,
      })
    });
    if (!r.ok) {
      const txt = await r.text().catch(() => '');
      return res.status(500).json({ error: 'LLM upstream failed', details: txt });
    }
    const data = await r.json();
    const content = data?.choices?.[0]?.message?.content || '';
    let json: any;
    try {
      json = JSON.parse(content);
    } catch {
      json = { reply: content, action: 'none' };
    }
    if (!json || typeof json.reply !== 'string') {
      json = { reply: String(content || 'দুঃখিত, কিছু ভুল হয়েছে। পরে আবার চেষ্টা করুন.'), action: 'none' };
    }
    // Log assistant reply and update session summary/last_message_at
    try {
      const supabaseUrl = process.env.SUPABASE_URL;
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (supabaseUrl && serviceKey) {
        const sid = body.sessionId || activeSessionId;
        if (sid) {
          await fetch(`${supabaseUrl}/rest/v1/chat_messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
            body: JSON.stringify([{ session_id: sid, role: 'assistant', content: String(json.reply) }])
          }).catch(() => {});
          await fetch(`${supabaseUrl}/rest/v1/chat_sessions?id=eq.${sid}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
            body: JSON.stringify({ last_message_at: new Date().toISOString(), summary: (json.action === 'create_service_request' ? 'Lead intent detected' : null) })
          }).catch(() => {});

          // Send owner notification with a compact summary (optional)
          try {
            const fnDirect = supabaseUrl.replace('https://', '').replace('.supabase.co', '.functions.supabase.co');
            const fnUrl = `https://${fnDirect}/notify`;
            const meta = {
              sessionId: sid,
              lastUser: userMessages[userMessages.length - 1]?.content || '',
              reply: json.reply,
              summary: (json.action === 'create_service_request' ? 'Lead intent detected' : (json.action || 'none'))
            };
            await fetch(fnUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${serviceKey}`, apikey: serviceKey },
              body: JSON.stringify({ type: 'chat', id: sid, meta })
            }).catch(() => {});
          } catch { /* ignore notify errors */ }
        }
      }
    } catch { /* ignore logging errors */ }
    // Include sessionId in response if we created one
    if (typeof body.sessionId !== 'string' && typeof activeSessionId === 'string' && activeSessionId) {
      json.sessionId = activeSessionId;
    }
    return res.status(200).json(json);
  } catch (e: any) {
    return res.status(500).json({ error: 'Unexpected server error', message: e?.message });
  }
}
