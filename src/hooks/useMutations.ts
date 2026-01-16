import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, publicUrlFor } from '@/lib/supabase';
import { sendNotification } from '@/lib/notify';

// Utility to ensure supabase exists
function ensureClient() {
  if (!supabase) throw new Error('supabase_not_configured');
  return supabase;
}

// ---------- Testimonial Submission ----------
export interface SubmitTestimonialInput {
  name: string;
  role: string;
  content: string;
  rating: number;
  imageFile: File;
  email?: string;
}

export function useSubmitTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: SubmitTestimonialInput) => {
      const client = ensureClient();
      const ext = input.imageFile.name.split('.').pop() || 'png';
      const objectPath = `testimonials/${crypto.randomUUID()}.${ext}`;
      const { error: uploadErr } = await client.storage
        .from((import.meta.env.VITE_SUPABASE_BUCKET as string) || 'uploads')
        .upload(objectPath, input.imageFile, { cacheControl: '3600', upsert: false });
      if (uploadErr) throw new Error('upload_failed:' + uploadErr.message);
      const imageUrl = publicUrlFor(objectPath);
      const { data, error } = await client
        .from('testimonials')
        .insert({
          name: input.name,
          role: input.role,
          image: imageUrl,
          content: input.content,
          rating: input.rating,
          approved: false
        })
        .select('id')
        .single();
      if (error) throw new Error('insert_failed:' + error.message);
      // Do not refetch approved list immediately (await moderation), but emit an event
      window.dispatchEvent(new CustomEvent('testimonial-submitted', { detail: { id: data.id } }));
  const id = data.id as string;
  sendNotification({ type: 'testimonial', id, meta: { name: input.name, role: input.role, rating: input.rating, email: input.email } });
  return id;
    },
  });
}

// ---------- Project Create ----------
export interface CreateProjectInput {
  title: string;
  category: string;
  description: string;
  iconKey: string;
  tags: string[];
  year: string;
  projectUrl?: string | null;
  imageFile?: File | null;
  imageUrl?: string | null;
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateProjectInput) => {
      const client = ensureClient();
      let finalImage = input.imageUrl?.trim() || '';
      if (!finalImage && input.imageFile) {
        const ext = input.imageFile.name.split('.').pop() || 'png';
        const objectPath = `projects/${crypto.randomUUID()}.${ext}`;
        const { error: uploadErr } = await client.storage
          .from((import.meta.env.VITE_SUPABASE_BUCKET as string) || 'uploads')
          .upload(objectPath, input.imageFile, { cacheControl: '3600', upsert: false });
        if (uploadErr) throw new Error('upload_failed:' + uploadErr.message);
        finalImage = publicUrlFor(objectPath);
      }
      if (!finalImage) throw new Error('image_required');
      const { data, error } = await client
        .from('projects')
        .insert({
          title: input.title,
            category: input.category,
            description: input.description,
            image: finalImage,
            icon_key: input.iconKey,
            tags: input.tags,
            year: input.year,
            project_url: input.projectUrl || null
        })
        .select('id')
        .single();
      if (error) throw new Error('insert_failed:' + error.message);
      // Invalidate relevant project queries (featured + paginated + count)
      await Promise.all([
        qc.invalidateQueries({ queryKey: ['projects','featured'] }),
        qc.invalidateQueries({ queryKey: ['projects','paginated'] }),
        qc.invalidateQueries({ queryKey: ['projects','count'] })
      ]);
  const id = data.id as string;
  sendNotification({ type: 'project', id, meta: { title: input.title, category: input.category, tags: input.tags } });
  return id;
    },
  });
}

// ---------- Project Update ----------
export interface UpdateProjectInput {
  id: string;
  title?: string;
  category?: string;
  description?: string;
  iconKey?: string;
  tags?: string[];
  year?: string;
  projectUrl?: string | null;
  imageFile?: File | null;
  imageUrl?: string | null;
}

export function useUpdateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateProjectInput) => {
      const client = ensureClient();
      const updatePayload: Record<string, unknown> = {};
      if (typeof input.title === 'string') updatePayload.title = input.title;
      if (typeof input.category === 'string') updatePayload.category = input.category;
      if (typeof input.description === 'string') updatePayload.description = input.description;
      if (typeof input.iconKey === 'string') updatePayload.icon_key = input.iconKey;
      if (Array.isArray(input.tags)) updatePayload.tags = input.tags;
      if (typeof input.year === 'string') updatePayload.year = input.year;
      if (typeof input.projectUrl !== 'undefined') updatePayload.project_url = input.projectUrl;
      let finalImage = input.imageUrl?.trim() || '';
      if (!finalImage && input.imageFile) {
        const ext = input.imageFile.name.split('.').pop() || 'png';
        const objectPath = `projects/${crypto.randomUUID()}.${ext}`;
        const { error: uploadErr } = await client.storage
          .from((import.meta.env.VITE_SUPABASE_BUCKET as string) || 'uploads')
          .upload(objectPath, input.imageFile, { cacheControl: '3600', upsert: false });
        if (uploadErr) throw new Error('upload_failed:' + uploadErr.message);
        finalImage = publicUrlFor(objectPath);
      }
      if (finalImage) updatePayload.image = finalImage;
      const { error } = await client
        .from('projects')
        .update(updatePayload)
        .eq('id', input.id);
      if (error) throw new Error('update_failed:' + error.message);
      await Promise.all([
        qc.invalidateQueries({ queryKey: ['projects','featured'] }),
        qc.invalidateQueries({ queryKey: ['projects','paginated'] }),
        qc.invalidateQueries({ queryKey: ['projects','count'] })
      ]);
      return input.id;
    },
  });
}

// ---------- Project Delete ----------
export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const client = ensureClient();
      const { error } = await client
        .from('projects')
        .delete()
        .eq('id', id);
      if (error) throw new Error('delete_failed:' + error.message);
      await Promise.all([
        qc.invalidateQueries({ queryKey: ['projects','featured'] }),
        qc.invalidateQueries({ queryKey: ['projects','paginated'] }),
        qc.invalidateQueries({ queryKey: ['projects','count'] })
      ]);
      return id;
    },
  });
}

// ---------- Testimonial Moderation (Approve/Delete) ----------
export function useApproveTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const client = ensureClient();
      const { error } = await client
        .from('testimonials')
        .update({ approved: true })
        .eq('id', id);
      if (error) throw new Error('update_failed:' + error.message);
      // After approval refresh approved list
      await qc.invalidateQueries({ queryKey: ['testimonials','approved'] });
      window.dispatchEvent(new CustomEvent('testimonial-submitted'));
      return id;
    },
  });
}

export function useDeleteTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const client = ensureClient();
      const { error } = await client
        .from('testimonials')
        .delete()
        .eq('id', id);
      if (error) throw new Error('delete_failed:' + error.message);
      await qc.invalidateQueries({ queryKey: ['testimonials','approved'] });
      return id;
    },
  });
}

// ---------- Testimonial Admin Create/Update ----------
export interface CreateTestimonialInput {
  name: string;
  role: string;
  content: string;
  rating: number;
  imageFile?: File | null;
  imageUrl?: string | null;
  approved?: boolean;
}

export function useCreateTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateTestimonialInput) => {
      const client = ensureClient();
      let finalImage = input.imageUrl?.trim() || '';
      if (!finalImage && input.imageFile) {
        const ext = input.imageFile.name.split('.').pop() || 'png';
        const objectPath = `testimonials/${crypto.randomUUID()}.${ext}`;
        const { error: uploadErr } = await client.storage
          .from((import.meta.env.VITE_SUPABASE_BUCKET as string) || 'uploads')
          .upload(objectPath, input.imageFile, { cacheControl: '3600', upsert: false });
        if (uploadErr) throw new Error('upload_failed:' + uploadErr.message);
        finalImage = publicUrlFor(objectPath);
      }
      if (!finalImage) throw new Error('image_required');
      const { data, error } = await client
        .from('testimonials')
        .insert({
          name: input.name,
          role: input.role,
          image: finalImage,
          content: input.content,
          rating: input.rating,
          approved: input.approved ?? true
        })
        .select('id')
        .single();
      if (error) throw new Error('insert_failed:' + error.message);
      await qc.invalidateQueries({ queryKey: ['testimonials','approved'] });
      return data.id as string;
    },
  });
}

export interface UpdateTestimonialInput {
  id: string;
  name?: string;
  role?: string;
  content?: string;
  rating?: number;
  approved?: boolean;
  imageFile?: File | null;
  imageUrl?: string | null;
}

export function useUpdateTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateTestimonialInput) => {
      const client = ensureClient();
      const payload: Record<string, unknown> = {};
      if (typeof input.name === 'string') payload.name = input.name;
      if (typeof input.role === 'string') payload.role = input.role;
      if (typeof input.content === 'string') payload.content = input.content;
      if (typeof input.rating === 'number') payload.rating = input.rating;
      if (typeof input.approved !== 'undefined') payload.approved = input.approved;
      let finalImage = input.imageUrl?.trim() || '';
      if (!finalImage && input.imageFile) {
        const ext = input.imageFile.name.split('.').pop() || 'png';
        const objectPath = `testimonials/${crypto.randomUUID()}.${ext}`;
        const { error: uploadErr } = await client.storage
          .from((import.meta.env.VITE_SUPABASE_BUCKET as string) || 'uploads')
          .upload(objectPath, input.imageFile, { cacheControl: '3600', upsert: false });
        if (uploadErr) throw new Error('upload_failed:' + uploadErr.message);
        finalImage = publicUrlFor(objectPath);
      }
      if (finalImage) payload.image = finalImage;
      const { error } = await client
        .from('testimonials')
        .update(payload)
        .eq('id', input.id);
      if (error) throw new Error('update_failed:' + error.message);
      await qc.invalidateQueries({ queryKey: ['testimonials','approved'] });
      return input.id;
    },
  });
}

// ---------- Service CRUD ----------
export interface CreateServiceInput { title: string; description: string; iconKey: string; gradient?: string | null; }
export interface UpdateServiceInput { id: string; title?: string; description?: string; iconKey?: string; gradient?: string | null; }

export function useCreateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateServiceInput) => {
      const client = ensureClient();
      const { data, error } = await client
        .from('services')
        .insert({
          title: input.title,
          description: input.description,
          icon_key: input.iconKey,
          gradient: input.gradient ?? null
        })
        .select('id')
        .single();
      if (error) throw new Error('insert_failed:' + error.message);
      await qc.invalidateQueries({ queryKey: ['services'] });
      return data.id as string;
    },
  });
}

export function useUpdateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateServiceInput) => {
      const client = ensureClient();
      const payload: Record<string, unknown> = {};
      if (typeof input.title === 'string') payload.title = input.title;
      if (typeof input.description === 'string') payload.description = input.description;
      if (typeof input.iconKey === 'string') payload.icon_key = input.iconKey;
      if (typeof input.gradient !== 'undefined') payload.gradient = input.gradient;
      const { error } = await client
        .from('services')
        .update(payload)
        .eq('id', input.id);
      if (error) throw new Error('update_failed:' + error.message);
      await qc.invalidateQueries({ queryKey: ['services'] });
      return input.id;
    },
  });
}

export function useDeleteService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const client = ensureClient();
      const { error } = await client
        .from('services')
        .delete()
        .eq('id', id);
      if (error) throw new Error('delete_failed:' + error.message);
      await qc.invalidateQueries({ queryKey: ['services'] });
      return id;
    },
  });
}

// ---------- Admin directory management ----------
export interface CreateAdminInput { email: string; role: 'admin' | 'subadmin'; }
export interface UpdateAdminRoleInput { id: string; role: 'admin' | 'subadmin'; }

export function useCreateAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateAdminInput) => {
      const client = ensureClient();
      const { data, error } = await client
        .from('admins')
        .insert({ email: input.email, role: input.role })
        .select('id')
        .single();
      if (error) throw new Error('insert_failed:' + error.message);
      await qc.invalidateQueries({ queryKey: ['admins'] });
      return data.id as string;
    },
  });
}

export function useUpdateAdminRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateAdminRoleInput) => {
      const client = ensureClient();
      const { error } = await client
        .from('admins')
        .update({ role: input.role })
        .eq('id', input.id);
      if (error) throw new Error('update_failed:' + error.message);
      await qc.invalidateQueries({ queryKey: ['admins'] });
      return input.id;
    },
  });
}

export function useDeleteAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const client = ensureClient();
      const { error } = await client
        .from('admins')
        .delete()
        .eq('id', id);
      if (error) throw new Error('delete_failed:' + error.message);
      await qc.invalidateQueries({ queryKey: ['admins'] });
      return id;
    },
  });
}

// ---------- Contact Message Submit ----------
export interface SubmitContactInput { name: string; email: string; subject: string; message: string; }
export function useSubmitContactMessage() {
  return useMutation({
    mutationFn: async (input: SubmitContactInput) => {
      const client = ensureClient();
      const { data, error } = await client
        .from('contact_messages')
        .insert({
          name: input.name,
          email: input.email,
          subject: input.subject,
          message: input.message
        })
        .select('id')
        .single();
      if (error) throw new Error('insert_failed:' + error.message);
  const id = data.id as string;
  sendNotification({ type: 'contact', id, meta: { name: input.name, email: input.email, subject: input.subject } });
  return id;
    },
  });
}
