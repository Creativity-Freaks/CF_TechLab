import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { router as serviceRequestRouter } from './routes/service-request.js';
import { router as notifyRouter } from './routes/notify.js';
import { router as contentRouter } from './routes/content.js';
import { router as contactRouter } from './routes/contact.js';
import { router as testimonialSubmitRouter } from './routes/testimonial-submit.js';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.use('/api/service-request', serviceRequestRouter);
app.use('/api/notify-service-request', notifyRouter);
app.use('/uploads', express.static(path.resolve('uploads')));
app.use('/api/content', contentRouter);
app.use('/api/contact', contactRouter);
app.use('/api/testimonial-submit', testimonialSubmitRouter);

const port = Number(process.env.PORT) || 4000;
const host = '0.0.0.0';
app.listen(port, host, () => {
  console.log(`[backend] listening on http://${host}:${port}`);
});
