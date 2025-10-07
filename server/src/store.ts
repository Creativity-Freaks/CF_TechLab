import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();

export async function saveRequest(data: { name: string; email: string; company?: string; meetingDate?: string; meetingTime?: string; message?: string; requested?: string[]; submittedAt: string; }) {
  const rec = await prisma.serviceRequest.create({
    data: {
      name: data.name,
      email: data.email,
      company: data.company,
      meetingDate: data.meetingDate,
      meetingTime: data.meetingTime,
      message: data.message,
      requested: (data.requested || []).join(','),
      submittedAt: new Date(data.submittedAt)
    }
  });
  return rec.id;
}

interface SRRow {
  id: string;
  name: string;
  email: string;
  company: string | null;
  meetingDate: string | null;
  meetingTime: string | null;
  message: string | null;
  requested: string;
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

function mapRow(r: SRRow) {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    company: r.company || undefined,
    meetingDate: r.meetingDate || undefined,
    meetingTime: r.meetingTime || undefined,
    message: r.message || undefined,
  requested: r.requested.split(',').map((s: string) => s.trim()).filter(Boolean),
    submittedAt: r.submittedAt.toISOString(),
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString()
  };
}

export async function listRequests(limit = 20, offset = 0) {
  const rows = await prisma.serviceRequest.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset
  });
  const total = await prisma.serviceRequest.count();
  return { items: rows.map(mapRow), total };
}

export async function getRequest(id: string) {
  const r = await prisma.serviceRequest.findUnique({ where: { id } });
  return r ? mapRow(r) : null;
}

// ---------------- Dynamic Marketing Content ----------------

// We seed once at startup if tables are empty to replicate previous static content.

const seedServices = [
  {
    title: 'AI Art & Design Tools',
    description: 'Cutting-edge artificial intelligence solutions for creative design and artistic generation.',
    iconKey: 'Brain',
    gradient: 'from-primary to-primary-glow',
    sortOrder: 1
  },
  {
    title: 'Web & Mobile App Development',
    description: 'Full-stack development of responsive web applications and native mobile experiences.',
    iconKey: 'Smartphone',
    gradient: 'from-accent-cyan to-accent',
    sortOrder: 2
  },
  {
    title: 'AR/VR & Game Design',
    description: 'Immersive augmented and virtual reality experiences with engaging game mechanics.',
    iconKey: 'Glasses',
    gradient: 'from-accent-magenta to-primary',
    sortOrder: 3
  },
  {
    title: 'Automation Systems',
    description: 'Intelligent automation solutions that streamline workflows and boost productivity.',
    iconKey: 'Cpu',
    gradient: 'from-accent to-accent-cyan',
    sortOrder: 4
  },
  {
    title: 'Smart Creative Software',
    description: 'Innovative software tools that empower creators with intelligent features.',
    iconKey: 'Wand2',
    gradient: 'from-primary-glow to-accent-magenta',
    sortOrder: 5
  }
];

const seedProjects = [
  {
    title: 'AI Art Generator',
    category: 'AI & Design',
    description: 'Revolutionary AI-powered platform that transforms sketches into professional artwork in seconds.',
    image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&h=400&fit=crop',
    iconKey: 'Brain',
    tags: 'AI,Design,Automation',
    year: '2024',
    projectUrl: 'https://example.com/ai-art-generator'
  },
  {
    title: 'SmartCommerce App',
    category: 'Mobile Development',
    description: 'Full-stack e-commerce solution with AI recommendations and seamless payment integration.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
    iconKey: 'Smartphone',
    tags: 'React Native,AI,Payments',
    year: '2024',
    projectUrl: 'https://example.com/smartcommerce'
  },
  {
    title: 'VR Training Platform',
    category: 'AR/VR',
    description: 'Immersive VR training environment for enterprise clients with real-time analytics.',
    image: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=600&h=400&fit=crop',
    iconKey: 'Gamepad2',
    tags: 'VR,Unity,Enterprise',
    year: '2024',
    projectUrl: 'https://example.com/vr-training'
  },
  {
    title: 'Automation Suite',
    category: 'Automation',
    description: 'Intelligent workflow automation system reducing manual tasks by 80%.',
    image: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=600&h=400&fit=crop',
    iconKey: 'Code',
    tags: 'Automation,AI,Integration',
    year: '2024',
    projectUrl: 'https://example.com/automation-suite'
  },
  {
    title: 'Creative Dashboard',
    category: 'Web Development',
    description: 'Modern analytics dashboard with real-time data visualization and AI insights.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
    iconKey: 'Code',
    tags: 'React,Analytics,AI',
    year: '2024',
    projectUrl: 'https://example.com/creative-dashboard'
  },
  {
    title: 'MetaVerse Experience',
    category: 'AR/VR',
    description: 'Next-gen metaverse platform connecting users in immersive 3D environments.',
    image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=600&h=400&fit=crop',
    iconKey: 'Gamepad2',
    tags: 'Metaverse,3D,Blockchain',
    year: '2024',
    projectUrl: 'https://example.com/metaverse-experience'
  }
];

const seedTestimonials = [
  {
    name: 'Sarah Johnson',
    role: 'CEO, DesignCo',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    content: 'CF TechLab transformed our vision into reality. Their AI-powered solutions increased our productivity by 300%. Absolutely phenomenal work!',
    rating: 5
  },
  {
    name: 'Michael Chen',
    role: 'CTO, StartupHub',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    content: 'The FreakFlow platform revolutionized our design process. What used to take days now takes minutes. Game-changing technology!',
    rating: 5
  },
  {
    name: 'Emily Rodriguez',
    role: 'Creative Director, MediaWorks',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    content: 'Outstanding creativity meets cutting-edge tech. CF TechLab delivered beyond our expectations. Highly recommend!',
    rating: 5
  }
];

export async function ensureSeededContent() {
  // Services
  const serviceCount = await prisma.service.count();
  if (serviceCount === 0) {
    await prisma.service.createMany({ data: seedServices });
  }
  const projectCount = await prisma.project.count();
  if (projectCount === 0) {
    await prisma.project.createMany({ data: seedProjects });
  }
  const testimonialCount = await prisma.testimonial.count();
  if (testimonialCount === 0) {
    await prisma.testimonial.createMany({ data: seedTestimonials });
  }
}

export async function listServices() {
  const rows = await prisma.service.findMany({ orderBy: { sortOrder: 'asc' } });
  return rows;
}

export async function listProjects(limit?: number) {
  const rows = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
    ...(limit ? { take: limit } : {})
  });
  return rows.map((r: { tags: string }) => ({
    ...r,
    tags: r.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
  }));
}

export async function listProjectsPaginated(params: { page: number; pageSize: number; category?: string; search?: string; }) {
  const { page, pageSize, category, search } = params;
  // Fetch superset then filter manually for SQLite simplicity (small dataset assumption)
  const all = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
  const norm = (v: string) => v.toLowerCase();
  let filtered = all;
  if (category) {
    const c = norm(category);
    filtered = filtered.filter(p => norm(p.category).includes(c));
  }
  if (search) {
    const s = norm(search);
    filtered = filtered.filter(p => [p.title, p.description, p.tags].some(f => norm(f).includes(s)));
  }
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const slice = filtered.slice(start, start + pageSize);
  const items = slice.map((r: { tags: string }) => ({
    ...r,
    tags: r.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
  }));
  return { items, total, page, pageSize, totalPages };
}

export async function createProject(data: { title: string; category: string; description: string; image: string; iconKey: string; tags: string[]; year: string; projectUrl?: string | null; }) {
  const rec = await prisma.project.create({
    data: {
      title: data.title,
      category: data.category,
      description: data.description,
      image: data.image,
      iconKey: data.iconKey,
      tags: data.tags.join(','),
      year: data.year,
      projectUrl: data.projectUrl || null
    }
  });
  return { id: rec.id };
}

export async function listTestimonials() {
  // Only approved testimonials for public display
  const rows = await prisma.testimonial.findMany({ where: { approved: true }, orderBy: { createdAt: 'desc' } });
  return rows;
}

export async function createTestimonial(data: { name: string; role: string; image: string; content: string; rating: number; }) {
  // New submissions default to approved = false per schema; we don't override here
  const rec = await prisma.testimonial.create({ data });
  return { id: rec.id };
}

// Admin utilities
export async function listPendingTestimonials() {
  return prisma.testimonial.findMany({ where: { approved: false }, orderBy: { createdAt: 'asc' } });
}

export async function approveTestimonial(id: string) {
  return prisma.testimonial.update({ where: { id }, data: { approved: true } });
}

export async function deleteTestimonial(id: string) {
  return prisma.testimonial.delete({ where: { id } });
}

// ---------------- Contact Messages ----------------
export async function createContactMessage(data: { name: string; email: string; subject: string; message: string; }) {
  const rec = await prisma.contactMessage.create({ data });
  return { id: rec.id, createdAt: rec.createdAt.toISOString() };
}

export async function listContactMessages(limit = 50, offset = 0) {
  const rows = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset
  });
  const total = await prisma.contactMessage.count();
  return {
    items: rows.map((r: { id: string; name: string; email: string; subject: string; message: string; createdAt: Date; }) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      subject: r.subject,
      message: r.message,
      createdAt: r.createdAt.toISOString()
    })),
    total
  };
}
