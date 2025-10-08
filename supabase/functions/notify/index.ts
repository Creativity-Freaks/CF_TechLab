// @ts-nocheck
// Edge Function: notify (with explicit CORS handling)
// Sends email notifications for contact, testimonial, project events via Resend API
// Deploy: supabase functions deploy notify
// Set secrets: supabase secrets set RESEND_API_KEY=xxx NOTIFY_FROM=from@example.com NOTIFY_TO=owner@example.com

interface EventBody { type: 'contact' | 'testimonial' | 'project' | 'service-request'; id: string; meta?: Record<string, unknown>; }

// Basic CORS headers so browser (localhost dev) can call this function directly
const corsHeaders: Record<string,string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400'
};

function jsonResponse(body: unknown, init: ResponseInit = {}) {
  return new Response(typeof body === 'string' ? body : JSON.stringify(body), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
      ...(init.headers || {})
    }
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
  let body: EventBody;
  try { body = await req.json(); } catch { return new Response('Bad JSON', { status: 400, headers: corsHeaders }); }
  if (!body?.type || !body?.id) return new Response('Missing fields', { status: 400, headers: corsHeaders });
  try { console.log('[notify] incoming', { type: body.type, id: body.id }); } catch {}

  const apiKey = Deno.env.get('RESEND_API_KEY');
  const from = Deno.env.get('NOTIFY_FROM') || 'no-reply@example.com';
  const toRaw = Deno.env.get('NOTIFY_TO') || '';
  const sendUserAck = (Deno.env.get('SEND_USER_ACK') || 'false') === 'true';
  const brand = Deno.env.get('BRAND_NAME') || 'CF TechLab';
  const ackPrefix = Deno.env.get('ACK_SUBJECT_PREFIX') || `Thanks for contacting ${brand}`;
  if (!apiKey || !toRaw) return new Response('Not configured', { status: 501, headers: corsHeaders });
  const toList = toRaw.split(',').map(s => s.trim()).filter(Boolean);

  const subjectMap: Record<string,string> = {
    contact: `New contact message (${body.id})`,
    testimonial: `New testimonial submitted (${body.id})`,
    project: `New project created (${body.id})`,
    'service-request': `New service request (${body.id})`
  };

  const ownerHtml = `<h2>${subjectMap[body.type] || 'New Event'}</h2><pre>${JSON.stringify(body.meta || {}, null, 2)}</pre>`;
  const ownerPayload = { from, to: toList, subject: subjectMap[body.type] || 'New Event', html: ownerHtml };

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(ownerPayload)
  });
  if (!res.ok) {
    const txt = await res.text();
    return new Response('Send failed: '+txt, { status: 500, headers: corsHeaders });
  }
  // User acknowledgement (debug aware)
  let ackStatus = 'skipped';
  let ackError: string | null = null;
  const userEmail = typeof body.meta?.email === 'string' ? body.meta.email : null;
  if (sendUserAck && userEmail) {
    const userHtml = `<p>Hi ${body.meta?.name || ''},</p><p>We received your ${body.type.replace('-', ' ')}. Our team will review and get back soon.</p><hr/><pre>${JSON.stringify(body.meta || {}, null, 2)}</pre><p>- ${brand} Team</p>`;
    try {
      const ackRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ from, to: [userEmail], subject: `${ackPrefix}`, html: userHtml })
      });
      if (!ackRes.ok) {
        ackStatus = 'failed';
        ackError = await ackRes.text().catch(() => `status_${ackRes.status}`);
      } else {
        ackStatus = 'sent';
      }
    } catch (e) {
      ackStatus = 'failed';
      ackError = (e as Error).message;
    }
  }
  return new Response(JSON.stringify({ ok: true, ackStatus, ackError }), { status: 200, headers: { 'Content-Type':'application/json', ...corsHeaders } });
});
