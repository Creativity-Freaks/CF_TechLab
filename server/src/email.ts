import nodemailer, { Transporter } from 'nodemailer';

let cachedTransporter: Transporter | null = null;

function buildTransporter(): Transporter {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env;
  if (!SMTP_HOST) {
    throw new Error('SMTP_HOST not configured');
  }
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT ? parseInt(SMTP_PORT, 10) : 587,
    secure: SMTP_SECURE === 'true',
    auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined
  });
}

export function getTransporter(): Transporter | null {
  if (cachedTransporter) return cachedTransporter;
  try {
    cachedTransporter = buildTransporter();
    return cachedTransporter;
  } catch (e) {
    // Fail silently if not configured; caller can decide behavior
    return null;
  }
}

export interface ServiceRequestEmailData {
  id: string;
  name: string;
  email: string;
  requested: string[];
  company?: string;
  meetingDate?: string;
  meetingTime?: string;
  message?: string;
  submittedAt: string;
}

export interface ContactMessageEmailData {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface TestimonialSubmissionEmailData {
  id: string;
  name: string;
  role: string;
  rating: number;
  createdAt: string;
  email?: string; // optional user email for receipt
}


const fromAddress = () => process.env.MAIL_FROM || `CF TechLab <no-reply@${process.env.DOMAIN || 'example.com'}>`;
const internalTo = () => process.env.NOTIFY_TO || process.env.MAIL_FROM || 'ops@example.com';

const emailEnabled = () => process.env.ENABLE_EMAIL === 'true';

// Simple in-memory queue to avoid hammering transporter if many submissions happen rapidly
type Job = () => Promise<void>;
const queue: Job[] = [];
let running = false;
const MAX_CONCURRENT = 1; // keep serial to simplify & avoid provider limits

async function runQueue() {
  if (running) return;
  running = true;
  while (queue.length) {
    const job = queue.shift();
    if (!job) break;
    try { await job(); } catch (e) { console.error('[email][job] failed', e); }
  }
  running = false;
}

function enqueue(job: Job) {
  queue.push(job);
  // fire and forget
  setImmediate(runQueue);
}

export async function sendServiceRequestEmails(data: ServiceRequestEmailData) {
  if (!emailEnabled()) return { skipped: true };
  const transporter = getTransporter();
  if (!transporter) return { skipped: true };

  const shortId = data.id.slice(0, 8);
  const requestedList = data.requested.length ? data.requested.map(r => `<li>${r}</li>`).join('') : '<li>(none specified)</li>';
  const meta: string[] = [];
  if (data.company) meta.push(`<li><strong>Company:</strong> ${data.company}</li>`);
  if (data.meetingDate) meta.push(`<li><strong>Date:</strong> ${data.meetingDate}</li>`);
  if (data.meetingTime) meta.push(`<li><strong>Time:</strong> ${data.meetingTime}</li>`);

  const userHtml = `<p>Hi ${data.name},</p>
<p>Thanks for your interest in CF TechLab. We've received your service request (<strong>#${shortId}</strong>).</p>
<p><strong>Requested Services:</strong></p>
<ul>${requestedList}</ul>
${data.message ? `<p><strong>Your Message:</strong><br/>${escapeHtml(data.message)}</p>` : ''}
<p>We'll review and get back to you shortly.</p>
<p>— CF TechLab Team</p>`;

  const internalHtml = `<p><strong>New Service Request #${shortId}</strong></p>
<ul>
  <li><strong>Name:</strong> ${escapeHtml(data.name)}</li>
  <li><strong>Email:</strong> ${escapeHtml(data.email)}</li>
  ${meta.join('\n  ')}
</ul>
<p><strong>Requested:</strong></p>
<ul>${requestedList}</ul>
${data.message ? `<p><strong>Message:</strong><br/>${escapeHtml(data.message)}</p>` : ''}
<p><em>Submitted at ${data.submittedAt}</em></p>`;

  await Promise.all([
    transporter.sendMail({
      from: fromAddress(),
      to: data.email,
      subject: `We received your request (#${shortId})`,
      html: userHtml,
      text: stripHtml(userHtml)
    }),
    transporter.sendMail({
      from: fromAddress(),
      to: internalTo(),
      subject: `[Service Request] #${shortId} from ${data.name}`,
      html: internalHtml,
      text: stripHtml(internalHtml)
    })
  ]);
  return { sent: true };
}

export async function sendContactMessageEmails(data: ContactMessageEmailData) {
  if (!emailEnabled()) return { skipped: true };
  const transporter = getTransporter();
  if (!transporter) return { skipped: true };
  const shortId = data.id.slice(0, 8);
  const userHtml = `<p>Hi ${data.name},</p><p>Thanks for reaching out regarding <strong>${escapeHtml(data.subject)}</strong>. We've received your message.</p><p>We'll respond soon.</p><p>— CF TechLab Team</p>`;
  const internalHtml = `<p><strong>New Contact Message #${shortId}</strong></p><ul><li><strong>Name:</strong> ${escapeHtml(data.name)}</li><li><strong>Email:</strong> ${escapeHtml(data.email)}</li><li><strong>Subject:</strong> ${escapeHtml(data.subject)}</li></ul><p><strong>Message:</strong><br/>${escapeHtml(data.message)}</p><p><em>${data.createdAt}</em></p>`;
  await Promise.all([
    transporter.sendMail({ from: fromAddress(), to: data.email, subject: `We received your message (#${shortId})`, html: userHtml, text: stripHtml(userHtml) }),
    transporter.sendMail({ from: fromAddress(), to: internalTo(), subject: `[Contact] #${shortId} ${data.subject}`, html: internalHtml, text: stripHtml(internalHtml) })
  ]);
  return { sent: true };
}

export async function sendTestimonialSubmissionEmails(data: TestimonialSubmissionEmailData) {
  if (!emailEnabled()) return { skipped: true };
  const transporter = getTransporter();
  if (!transporter) return { skipped: true };
  const shortId = data.id.slice(0, 8);
  const internalHtml = `<p><strong>New Testimonial Submitted #${shortId}</strong></p>
<ul>
  <li><strong>Name:</strong> ${escapeHtml(data.name)}</li>
  <li><strong>Role:</strong> ${escapeHtml(data.role)}</li>
  <li><strong>Rating:</strong> ${data.rating}</li>
</ul>
<p>Awaiting moderation in admin panel.</p>
<p><em>${data.createdAt}</em></p>`;
  const tasks: Promise<unknown>[] = [
    transporter.sendMail({
      from: fromAddress(),
      to: internalTo(),
      subject: `[Testimonial] #${shortId} from ${data.name}`,
      html: internalHtml,
      text: stripHtml(internalHtml)
    })
  ];
  if (data.email) {
    const userHtml = `<p>Hi ${escapeHtml(data.name)},</p><p>Thanks for submitting your testimonial (#${shortId}). It will appear publicly once approved.</p><p>— CF TechLab Team</p>`;
    tasks.push(transporter.sendMail({
      from: fromAddress(),
      to: data.email,
      subject: `We received your testimonial (#${shortId})`,
      html: userHtml,
      text: stripHtml(userHtml)
    }));
  }
  await Promise.all(tasks);
  return { sent: true };
}

// Public helper to safely enqueue without awaiting inside request lifecycle
type QueuePayload = ServiceRequestEmailData | ContactMessageEmailData | TestimonialSubmissionEmailData;
export function queueEmail(kind: 'service-request' | 'contact' | 'testimonial', payload: QueuePayload) {
  enqueue(async () => {
    try {
      if (kind === 'service-request') await sendServiceRequestEmails(payload as ServiceRequestEmailData);
      else if (kind === 'contact') await sendContactMessageEmails(payload as ContactMessageEmailData);
      else if (kind === 'testimonial') await sendTestimonialSubmissionEmails(payload as TestimonialSubmissionEmailData);
    } catch (e) {
      console.error(`[email][queue][${kind}] failed`, e);
    }
  });
}

// (Note: we only notify internal address; user address not collected in current testimonial form)

function escapeHtml(str: string) {
  return str.replace(/[&<>"]+/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string));
}

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, '').replace(/\n+/g, '\n');
}
