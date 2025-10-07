import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { saveRequest, listRequests } from '../store.js';

export const router = Router();

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional(),
  meetingDate: z.string().optional(),
  meetingTime: z.string().optional(),
  message: z.string().optional(),
  // Make requested services optional; store empty array if not provided
  requested: z.array(z.string()).optional().default([]),
  submittedAt: z.string()
});

router.post('/', async (req: Request, res: Response) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'invalid_payload', details: parsed.error.flatten() });
  }
  try {
    const data = { ...parsed.data, requested: parsed.data.requested || [] };
    const id = await saveRequest(data);
    res.json({ id });
  } catch (e) {
    res.status(500).json({ error: 'persist_failed' });
  }
});

router.get('/', async (_req: Request, res: Response) => {
  try {
    const items = await listRequests();
    res.json({ items });
  } catch {
    res.status(500).json({ error: 'fetch_failed' });
  }
});
