import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { createContactMessage, listContactMessages } from '../store.js';
import { queueEmail } from '../email.js';

export const router = Router();

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(5)
});

// Creates a contact message and queues both user receipt + internal notification email (if ENABLE_EMAIL=true)
router.post('/', async (req: Request, res: Response) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'invalid_payload', details: parsed.error.flatten() });
  }
  try {
    const result = await createContactMessage(parsed.data);
    queueEmail('contact', {
      id: result.id,
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject,
      message: parsed.data.message,
      createdAt: result.createdAt
    });
    res.json({ ...result, emailQueued: true });
  } catch (e) {
    res.status(500).json({ error: 'persist_failed' });
  }
});

router.get('/', async (req: Request, res: Response) => {
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const offset = Number(req.query.offset) || 0;
  try {
    const messages = await listContactMessages(limit, offset);
    res.json(messages);
  } catch (e) {
    res.status(500).json({ error: 'fetch_failed' });
  }
});
