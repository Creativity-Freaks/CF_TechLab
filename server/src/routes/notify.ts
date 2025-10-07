import { Router, Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { z } from 'zod';

export const router = Router();

const schema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  requested: z.array(z.string())
});

// Setup transporter from env
function createTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env;
  if (!SMTP_HOST) throw new Error('SMTP_HOST missing');
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT ? parseInt(SMTP_PORT, 10) : 587,
    secure: SMTP_SECURE === 'true',
    auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined
  });
}

router.post('/', async (req: Request, res: Response) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid_payload', details: parsed.error.flatten() });
  try {
    const transporter = createTransport();
    const { id, email, name, requested } = parsed.data;
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM || SMTP_FROM_FALLBACK(),
      to: email,
      subject: `We received your request (#${id.slice(0,8)})`,
      text: `Hi ${name},\n\nThanks for reaching out. You selected:\n${requested.join('\n')}\n\nWe will follow up shortly.\n\n— Team`,
      html: `<p>Hi ${name},</p><p>Thanks for reaching out. You selected:</p><ul>${requested.map(r=>`<li>${r}</li>`).join('')}</ul><p>We will follow up shortly.</p><p>&mdash; Team</p>`
    });
    res.json({ status: 'sent', messageId: info.messageId });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown_error';
    res.status(500).json({ error: 'email_failed', message: msg });
  }
});

function SMTP_FROM_FALLBACK() {
  return `no-reply@${(process.env.DOMAIN || 'example.com')}`;
}
