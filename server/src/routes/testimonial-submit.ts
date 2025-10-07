import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { createTestimonial } from '../store.js';
import { queueEmail } from '../email.js';
import { z } from 'zod';

const uploadDir = path.resolve('uploads/testimonials');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req: Request, _file: { originalname: string }, cb: (error: Error | null, destination: string) => void) => cb(null, uploadDir),
  filename: (_req: Request, file: { originalname: string }, cb: (error: Error | null, filename: string) => void) => {
    const ext = path.extname(file.originalname) || '.png';
    cb(null, `${Date.now()}-${Math.random().toString(16).slice(2)}${ext}`);
  }
});

// Allow broad set of common image types; also accept any mimetype starting with image/.
const allowedExts = new Set([
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg', '.heic', '.heif', '.bmp', '.tiff', '.tif', '.jfif'
]);
const MAX_IMAGE_MB = Number(process.env.MAX_IMAGE_MB || 5); // can override via env
const upload = multer({
  storage,
  limits: { fileSize: MAX_IMAGE_MB * 1024 * 1024 },
  fileFilter: (_req: Request, file: { mimetype: string; originalname: string }, cb: (error: Error | null, acceptFile?: boolean) => void) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (file.mimetype.startsWith('image/') || allowedExts.has(ext)) {
      return cb(null, true);
    }
    cb(new Error('Unsupported image type'));
  }
});

const schema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  email: z.string().email().optional(),
  content: z.string().min(10),
  rating: z.coerce.number().min(1).max(5)
});

export const router = Router();

router.post('/', upload.single('image'), async (req: Request, res: Response) => {
  // Debug logging (can be swapped to conditional in production)
  // console.log('[testimonial-submit] body keys', Object.keys(req.body), 'file?', !!(req as any).file);
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
  const f = (req as unknown as { file?: { path: string } }).file;
    if (f) fs.unlinkSync(f.path); // cleanup
    return res.status(400).json({ error: 'invalid_payload', details: parsed.error.flatten() });
  }
  const file = (req as unknown as { file?: { path: string; mimetype: string } }).file;
  if (!file) {
    return res.status(400).json({ error: 'image_required' });
  }
  try {
    const relPath = `/uploads/testimonials/${path.basename(file.path)}`;
    const created = await createTestimonial({
      name: parsed.data.name,
      role: parsed.data.role,
      content: parsed.data.content,
      rating: parsed.data.rating,
      image: relPath
    });
    // Queue testimonial notification (internal + optional user receipt if email provided)
    queueEmail('testimonial', {
      id: created.id,
      name: parsed.data.name,
      role: parsed.data.role,
      rating: parsed.data.rating,
      createdAt: new Date().toISOString(),
      email: parsed.data.email
    });
    res.json({ id: created.id, emailQueued: true });
  } catch (e) {
    console.error('[testimonial-submit] failed', e);
    res.status(500).json({ error: 'persist_failed', message: (e as Error).message });
  }
});

// Multer error handler (file too large etc.)
router.use((err: unknown, _req: Request, res: Response, _next: (err?: unknown) => void) => {
  if (err) {
    const message = err instanceof Error ? err.message : 'Upload error';
    return res.status(400).json({ error: 'upload_error', message });
  }
});
