import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { createContactMessage, listContactMessages } from '../store.js';

export const router = Router();

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(5)
});

router.post('/', async (req: Request, res: Response) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'invalid_payload', details: parsed.error.flatten() });
  }
  try {
    const result = await createContactMessage(parsed.data);
    res.json(result);
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
