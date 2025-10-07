import { Router, Request, Response } from 'express';
import { ensureSeededContent, listServices, listProjects, listTestimonials, listProjectsPaginated, createProject, listPendingTestimonials, approveTestimonial, deleteTestimonial } from '../store.js';

// Local type replicate (subset) to include approved flag; keeps route layer decoupled if store typings narrow
interface TestimonialRecord {
  id: string;
  name: string;
  role: string;
  image: string;
  content: string;
  rating: number;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';

export const router = Router();

// Ensure seed before serving first request (in-memory flag)
let seeded = false;
async function ensure() {
  if (!seeded) {
    await ensureSeededContent();
    seeded = true;
  }
}

router.get('/services', async (_req: Request, res: Response) => {
  try {
    await ensure();
    const services = await listServices();
    res.json({ items: services });
  } catch (e) {
    res.status(500).json({ error: 'fetch_services_failed' });
  }
});

router.get('/projects', async (req: Request, res: Response) => {
  try {
    await ensure();
    const limit = req.query.limit ? Math.max(1, Math.min(Number(req.query.limit), 50)) : undefined;
    if (limit) {
      const projects = await listProjects(limit);
      return res.json({ items: projects, limited: true });
    }
    const page = Math.max(Number(req.query.page) || 1, 1);
    const pageSize = Math.min(Math.max(Number(req.query.pageSize) || 9, 1), 60);
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const data = await listProjectsPaginated({ page, pageSize, category, search });
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: 'fetch_projects_failed' });
  }
});

// Basic admin create project endpoint (could be protected by an API key header in real scenario)
// Shared schema when image is provided as a URL string
const projectSchema = z.object({
  title: z.string().min(2),
  category: z.string().min(2),
  description: z.string().min(5),
  image: z.string().url().optional(), // optional if using file upload
  iconKey: z.string().min(2),
  tags: z.array(z.string()).min(1),
  year: z.string().min(4).max(4),
  projectUrl: z.string().url().optional().nullable()
});

// Multer setup for project images
const projectUploadDir = path.resolve('uploads/projects');
if (!fs.existsSync(projectUploadDir)) fs.mkdirSync(projectUploadDir, { recursive: true });

const projectStorage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => cb(null, projectUploadDir),
  filename: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const ext = path.extname(file.originalname) || '.png';
    cb(null, `${Date.now()}-${Math.random().toString(16).slice(2)}${ext}`);
  }
});
const projectImageUpload = multer({
  storage: projectStorage,
  limits: { fileSize: (Number(process.env.MAX_IMAGE_MB || 5)) * 1024 * 1024 },
  fileFilter: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, acceptFile?: boolean) => void) => {
    if (file.mimetype.startsWith('image/')) return cb(null, true);
    cb(new Error('Unsupported image type'));
  }
});

// Accept multipart (file) OR JSON (URL). Field name for file: imageFile
router.post('/projects', projectImageUpload.single('imageFile'), async (req: Request, res: Response) => {
  try {
    await ensure();
    const body = req.body;
    // tags could come as JSON string or multiple fields; normalize
    let tags: string[] = [];
    if (Array.isArray(body.tags)) tags = body.tags as string[];
    else if (typeof body.tags === 'string') {
      try {
        if (body.tags.trim().startsWith('[')) tags = JSON.parse(body.tags);
        else tags = body.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
      } catch {
        tags = body.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
      }
    }
    const candidate = { ...body, tags };
    const parsed = projectSchema.safeParse(candidate);
    if (!parsed.success) {
      // If file uploaded but payload invalid -> cleanup file
      const f = (req as unknown as { file?: Express.Multer.File }).file; if (f) fs.unlink(f.path, ()=>{});
      return res.status(400).json({ error: 'invalid_payload', details: parsed.error.flatten() });
    }
    let imageUrl = parsed.data.image;
    const file = (req as unknown as { file?: Express.Multer.File }).file;
    if (file) {
      imageUrl = `/uploads/projects/${path.basename(file.path)}`;
    }
    if (!imageUrl) {
      return res.status(400).json({ error: 'image_required', message: 'Provide image URL or upload imageFile.' });
    }
    const created = await createProject({
      ...parsed.data,
      image: imageUrl,
      tags,
      projectUrl: parsed.data.projectUrl || undefined
    });
    res.status(201).json({ id: created.id, image: imageUrl });
  } catch (e) {
    console.error('[create project] error', e);
    res.status(500).json({ error: 'create_project_failed' });
  }
});

// Multer error handler (project uploads)
router.use((err: unknown, _req: Request, res: Response, next: (err?: unknown) => void) => {
  if (!err) return next();
  const msg = err instanceof Error ? err.message : 'Upload error';
  res.status(400).json({ error: 'upload_error', message: msg });
});

router.get('/testimonials', async (req: Request, res: Response) => {
  try {
    await ensure();
    const batch = Math.max(Number(req.query.batch) || 1, 1); // 1-based batch
    const size = Math.min(Number(req.query.size) || 3, 12); // default 3, cap 12
    const offset = (batch - 1) * size;
    const all = await listTestimonials();
    const slice = all.slice(offset, offset + size);
    const hasMore = offset + size < all.length;
    res.json({ items: slice, total: all.length, batch, size, hasMore });
  } catch (e) {
    res.status(500).json({ error: 'fetch_testimonials_failed' });
  }
});

// ---- Testimonial Moderation (simple, unprotected) ----
router.get('/testimonials/pending', async (_req: Request, res: Response) => {
  try {
    await ensure();
    const items = await listPendingTestimonials();
    res.json({ items });
  } catch (e) {
    res.status(500).json({ error: 'fetch_pending_testimonials_failed' });
  }
});

router.post('/testimonials/:id/approve', async (req: Request, res: Response) => {
  try {
    await ensure();
    const id = req.params.id;
    try {
      const updated = await approveTestimonial(id) as TestimonialRecord;
      res.json({ id: updated.id, approved: updated.approved });
    } catch (err) {
      return res.status(404).json({ error: 'testimonial_not_found' });
    }
  } catch (e) {
    res.status(500).json({ error: 'approve_testimonial_failed' });
  }
});

router.delete('/testimonials/:id', async (req: Request, res: Response) => {
  try {
    await ensure();
    const id = req.params.id;
    try {
      await deleteTestimonial(id);
      res.json({ id, deleted: true });
    } catch (err) {
      return res.status(404).json({ error: 'testimonial_not_found' });
    }
  } catch (e) {
    res.status(500).json({ error: 'delete_testimonial_failed' });
  }
});
