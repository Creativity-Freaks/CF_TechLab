import { Router, Request, Response } from 'express';
import { z } from 'zod';
// Import with explicit .js for ESM after compilation
import { saveRequest, listRequests } from '../store.js';
import { queueEmail } from '../email.js';

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
    // Fire-and-forget email (don't block response on failure)
    queueEmail('service-request', {
      id,
      name: data.name,
      email: data.email,
      requested: data.requested,
      company: data.company,
      meetingDate: data.meetingDate,
      meetingTime: data.meetingTime,
      message: data.message,
      submittedAt: data.submittedAt
    });
    res.json({ id, emailQueued: true });
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
