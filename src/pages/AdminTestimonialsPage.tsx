import { Helmet } from 'react-helmet-async';
import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useApproveTestimonial, useDeleteTestimonial, useCreateTestimonial, useUpdateTestimonial } from '@/hooks/useMutations';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { useTestimonials } from '@/hooks/useData';

interface PendingTestimonial {
  id: string;
  name: string;
  role: string;
  image: string;
  content: string;
  rating: number;
  createdAt: string;
}

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<PendingTestimonial[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actingId, setActingId] = useState<string | null>(null);
  const { data: approvedItems, isLoading: approvedLoading, refetch: refetchApproved } = useTestimonials();

  // Create form state
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [useUpload, setUseUpload] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const createMutation = useCreateTestimonial();
  const [creating, setCreating] = useState(false);

  // Edit state for approved list
  const [editingId, setEditingId] = useState<string | null>(null);
  const editing = useMemo(() => (approvedItems || []).find(i => i.id === editingId) || null, [approvedItems, editingId]);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editRating, setEditRating] = useState(5);
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const updateMutation = useUpdateTestimonial();

  async function load() {
    setLoading(true); setError(null);
    try {
      if (!supabase) throw new Error('Supabase not configured');
      const { data, error } = await supabase
        .from('testimonials')
        .select('id,name,role,image,content,rating,created_at')
        .eq('approved', false)
        .order('created_at', { ascending: true });
      if (error) throw error;
      const mapped: PendingTestimonial[] = (data || []).map(r => ({
        id: r.id,
        name: r.name,
        role: r.role,
        image: r.image,
        content: r.content,
        rating: r.rating,
        createdAt: r.created_at
      }));
      setItems(mapped);
    } catch (e) {
      setError('Failed to load pending testimonials');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const approveMutation = useApproveTestimonial();
  const deleteMutation = useDeleteTestimonial();

  async function approve(id: string) {
    setActingId(id);
    try {
      await approveMutation.mutateAsync(id);
      toast({ title: 'Approved', description: 'Testimonial approved' });
      setItems(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      toast({ title: 'Error', description: 'Approve failed' });
    } finally { setActingId(null); }
  }

  async function remove(id: string) {
    if (!confirm('Delete this testimonial?')) return;
    setActingId(id);
    try {
      await deleteMutation.mutateAsync(id);
      toast({ title: 'Deleted', description: 'Testimonial removed' });
      setItems(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      toast({ title: 'Error', description: 'Delete failed' });
    } finally { setActingId(null); }
  }

  async function submitCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !role || !content || (!useUpload && !imageUrl) && !imageFile) {
      toast({ title: 'Missing fields', description: 'Fill all required fields.' });
      return;
    }
    setCreating(true);
    try {
      await createMutation.mutateAsync({
        name,
        role,
        content,
        rating,
        imageFile: useUpload ? imageFile : null,
        imageUrl: !useUpload ? imageUrl : null,
        approved: true
      });
      toast({ title: 'Added', description: 'Testimonial created' });
      setName(''); setRole(''); setContent(''); setImageUrl(''); setImageFile(null); setUseUpload(false); setRating(5);
      await refetchApproved();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Create failed';
      toast({ title: 'Error', description: msg });
    } finally { setCreating(false); }
  }

  function beginEdit(id: string) {
    setEditingId(id);
    const it = (approvedItems || []).find(i => i.id === id);
    if (!it) return;
    setEditName(it.name);
    setEditRole(it.role);
    setEditContent(it.content);
    setEditRating(it.rating);
    setEditImageUrl(it.image);
    setEditImageFile(null);
  }

  async function saveEdit() {
    if (!editingId) return;
    try {
      await updateMutation.mutateAsync({
        id: editingId,
        name: editName,
        role: editRole,
        content: editContent,
        rating: editRating,
        imageFile: editImageFile,
        imageUrl: editImageFile ? null : (editImageUrl || null)
      });
      toast({ title: 'Updated', description: 'Changes saved' });
      setEditingId(null);
      await refetchApproved();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Update failed';
      toast({ title: 'Error', description: msg });
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Admin – Pending Testimonials</title>
        <meta name="robots" content="noindex,nofollow" />
        {import.meta.env.VITE_SITE_URL && (
          <link rel="canonical" href={`${import.meta.env.VITE_SITE_URL}/admin/testimonials`} />
        )}
      </Helmet>
      <Header />
      <main className="pt-24 pb-20 px-4 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin: Testimonials</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Pending Moderation</h2>
              <Button variant="outline" onClick={load} disabled={loading}>Refresh</Button>
            </div>
        {error && <div className="text-sm text-destructive mb-4">{error}</div>}
        {loading && <div className="text-sm text-muted-foreground mb-4">Loading...</div>}
        {(!loading && items.length === 0) && <div className="text-sm text-muted-foreground">No pending testimonials.</div>}
        <div className="grid gap-6 md:grid-cols-2">
          {items.map(t => (
            <Card key={t.id} className="p-5 space-y-3 border-primary/30 hover:border-primary transition">
              <div className="flex items-center gap-4">
                <img src={t.image.startsWith('/uploads') ? `${window.location.origin}${t.image}` : t.image} alt={t.name} className="w-16 h-16 rounded-full object-cover border" />
                <div>
                  <h3 className="font-semibold">{t.name}</h3>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{t.content}</p>
              <div className="flex items-center gap-3 pt-2">
                <Button size="sm" disabled={actingId === t.id || approveMutation.isPending} onClick={() => approve(t.id)} className="bg-green-600 hover:bg-green-700">{actingId === t.id && approveMutation.isPending ? 'Working...' : 'Approve'}</Button>
                <Button size="sm" variant="destructive" disabled={actingId === t.id || deleteMutation.isPending} onClick={() => remove(t.id)}>{actingId === t.id && deleteMutation.isPending ? 'Working...' : 'Delete'}</Button>
              </div>
            </Card>
          ))}
        </div>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-4">Create Testimonial</h2>
            <form onSubmit={submitCreate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" />
                <Input value={role} onChange={e=>setRole(e.target.value)} placeholder="Role" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input type="number" value={rating} onChange={e=>setRating(parseInt(e.target.value || '0'))} placeholder="Rating (1-5)" />
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">Image</span>
                  <button type="button" onClick={()=>setUseUpload(false)} className={`px-2 py-1 rounded-md border text-xs ${!useUpload ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>URL</button>
                  <button type="button" onClick={()=>setUseUpload(true)} className={`px-2 py-1 rounded-md border text-xs ${useUpload ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>Upload</button>
                </div>
              </div>
              <Textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="Content" rows={4} />
              {!useUpload ? (
                <Input value={imageUrl} onChange={e=>setImageUrl(e.target.value)} placeholder="https://..." />
              ) : (
                <Input type="file" accept="image/*" onChange={e=>setImageFile(e.target.files?.[0] || null)} />
              )}
              <Button type="submit" disabled={creating || createMutation.isPending}>{creating || createMutation.isPending ? 'Adding...' : 'Add'}</Button>
            </form>
          </section>
        </div>

        <section className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Approved Testimonials</h2>
            <Button variant="outline" onClick={()=>refetchApproved()} disabled={approvedLoading}>Refresh</Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {(approvedItems || []).map(t => (
              <Card key={t.id} className="p-5 space-y-3">
                {editingId === t.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input value={editName} onChange={e=>setEditName(e.target.value)} placeholder="Name" />
                      <Input value={editRole} onChange={e=>setEditRole(e.target.value)} placeholder="Role" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input type="number" value={editRating} onChange={e=>setEditRating(parseInt(e.target.value || '0'))} placeholder="Rating (1-5)" />
                      <Input value={editImageUrl} onChange={e=>setEditImageUrl(e.target.value)} placeholder="Image URL" />
                    </div>
                    <Textarea value={editContent} onChange={e=>setEditContent(e.target.value)} placeholder="Content" rows={4} />
                    <Input type="file" accept="image/*" onChange={e=>setEditImageFile(e.target.files?.[0] || null)} />
                    <div className="flex items-center gap-2">
                      <Button onClick={saveEdit} disabled={updateMutation.isPending}>{updateMutation.isPending ? 'Saving...' : 'Save'}</Button>
                      <Button variant="outline" onClick={()=>setEditingId(null)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <img src={t.image} alt={t.name} className="w-16 h-16 rounded-full object-cover border" />
                    <div>
                      <h3 className="font-semibold">{t.name}</h3>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                      <p className="text-sm mt-2 leading-relaxed">{t.content}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  {editingId === t.id ? null : (
                    <Button size="sm" onClick={()=>{ setEditingId(t.id); beginEdit(t.id); }}>Edit</Button>
                  )}
                  <Button size="sm" variant="destructive" onClick={() => remove(t.id)} disabled={deleteMutation.isPending}>{deleteMutation.isPending && editingId !== t.id ? 'Working...' : 'Delete'}</Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
