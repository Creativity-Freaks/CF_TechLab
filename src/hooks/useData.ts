import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface ServiceRec { id: string; title: string; description: string; iconKey: string; gradient: string; }
export function useServices(): UseQueryResult<ServiceRec[]> {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      if (!supabase) throw new Error('supabase_not_configured');
      const { data, error } = await supabase
        .from('services')
        .select('id,title,description,icon_key,gradient')
        .order('created_at', { ascending: true });
      if (error) throw error;
      return (data || []).map(r => ({
        id: r.id,
        title: r.title,
        description: r.description,
        iconKey: r.icon_key,
        gradient: r.gradient || 'from-primary to-primary-glow'
      }));
    },
    staleTime: 1000 * 60 * 5,
  });
}

export interface ProjectRec { id: string; title: string; category: string; description: string; image: string; iconKey: string; tags: string[]; year: string; projectUrl?: string | null; }
export function useFeaturedProjects(limit = 6): UseQueryResult<ProjectRec[]> {
  return useQuery({
    queryKey: ['projects','featured',limit],
    queryFn: async () => {
      if (!supabase) throw new Error('supabase_not_configured');
      const { data, error } = await supabase
        .from('projects')
        .select('id,title,category,description,image,icon_key,tags,year,project_url')
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return (data || []).map(r => ({
        id: r.id,
        title: r.title,
        category: r.category,
        description: r.description,
        image: r.image,
        iconKey: r.icon_key,
        tags: Array.isArray(r.tags) ? r.tags : [],
        year: r.year,
        projectUrl: r.project_url
      }));
    },
    staleTime: 1000 * 60 * 2,
  });
}

export interface PaginatedProjectsParams { page: number; pageSize: number; search: string; category: string; }
export interface PaginatedProjectsResult { items: ProjectRec[]; totalPages: number; total: number; }
export function usePaginatedProjects(params: PaginatedProjectsParams): UseQueryResult<PaginatedProjectsResult> {
  return useQuery<PaginatedProjectsResult>({
    queryKey: ['projects','paginated', params],
    queryFn: async (): Promise<PaginatedProjectsResult> => {
      if (!supabase) throw new Error('supabase_not_configured');
      const { page, pageSize, search, category } = params;
      let query = supabase
        .from('projects')
        .select('id,title,category,description,image,icon_key,tags,year,project_url', { count: 'exact' })
        .order('created_at', { ascending: false });
      if (search.trim()) {
        const term = `%${search.trim()}%`;
        query = query.or(`title.ilike.${term},description.ilike.${term}`);
      }
      if (category.trim()) query = query.eq('category', category.trim());
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      const { data, error, count } = await query.range(from, to);
      if (error) throw error;
      const mapped: ProjectRec[] = (data || []).map(r => ({
        id: r.id,
        title: r.title,
        category: r.category,
        description: r.description,
        image: r.image,
        iconKey: r.icon_key,
        tags: Array.isArray(r.tags) ? r.tags : [],
        year: r.year,
        projectUrl: r.project_url
      }));
      const total = count || 0;
      return { items: mapped, total, totalPages: total ? Math.max(1, Math.ceil(total / pageSize)) : 1 };
    },
  });
}

export interface TestimonialRec { id: string; name: string; role: string; image: string; content: string; rating: number; }
export function useTestimonials(): UseQueryResult<TestimonialRec[]> {
  return useQuery({
    queryKey: ['testimonials','approved'],
    queryFn: async () => {
      if (!supabase) throw new Error('supabase_not_configured');
      const { data, error } = await supabase
        .from('testimonials')
        .select('id,name,role,image,content,rating')
        .eq('approved', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as TestimonialRec[];
    },
    staleTime: 1000 * 60 * 1,
  });
}

export function useProjectCount(): UseQueryResult<number> {
  return useQuery({
    queryKey: ['projects','count'],
    queryFn: async () => {
      if (!supabase) throw new Error('supabase_not_configured');
      const { count, error } = await supabase.from('projects').select('id', { count: 'exact', head: true });
      if (error) throw error;
      return count || 0;
    },
    staleTime: 1000 * 60 * 5,
  });
}
