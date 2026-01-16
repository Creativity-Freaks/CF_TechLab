import { Helmet } from 'react-helmet-async';
import React, { useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import { useCreateProject, useUpdateProject, useDeleteProject } from '@/hooks/useMutations';
import { usePaginatedProjects } from '@/hooks/useData';

export default function AdminProjectsPage() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [useUpload, setUseUpload] = useState(false);
  const [iconKey, setIconKey] = useState('Code');
  const [tags, setTags] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [projectUrl, setProjectUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  // Listing state
  const [page, setPage] = useState(1);
  const [pageSize] = useState(6);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const { data: listData, isLoading: listLoading, refetch } = usePaginatedProjects({ page, pageSize, search, category: categoryFilter });
  const items = listData?.items || [];
  const totalPages = listData?.totalPages || 1;

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const editingItem = useMemo(() => items.find(i => i.id === editingId) || null, [items, editingId]);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editIconKey, setEditIconKey] = useState('');
  const [editTags, setEditTags] = useState('');
  const [editYear, setEditYear] = useState('');
  const [editProjectUrl, setEditProjectUrl] = useState<string>('');
  const [editImageUrl, setEditImageUrl] = useState<string>('');
  const [editImageFile, setEditImageFile] = useState<File | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !category || !description || (!useUpload && !image) && !imageFile || !tags || !year) {
      toast({ title: 'Missing fields', description: 'Fill all required fields.' });
      return;
    }
    if (!supabase) {
      toast({ title: 'Error', description: 'Supabase not configured' });
      return;
    }
    setSubmitting(true);
    try {
      const tagArr = tags.split(',').map(t => t.trim()).filter(Boolean);
      const id = await createProject.mutateAsync({
        title,
        category,
        description,
        iconKey,
        tags: tagArr,
        year,
        projectUrl: projectUrl || null,
        imageFile: useUpload ? imageFile : null,
        imageUrl: !useUpload ? image : null,
      });
      toast({ title: 'Project added', description: `ID: ${id}` });
      setTitle(''); setCategory(''); setDescription(''); setImage(''); setImageFile(null); setTags(''); setProjectUrl('');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unexpected error';
      toast({ title: 'Error', description: msg });
    } finally {
      setSubmitting(false);
    }
  }

  function beginEdit(id: string) {
    setEditingId(id);
    const it = items.find(p => p.id === id);
    if (!it) return;
    setEditTitle(it.title);
    setEditCategory(it.category);
    setEditDescription(it.description);
    setEditIconKey(it.iconKey);
    setEditTags((it.tags || []).join(','));
    setEditYear(it.year);
    setEditProjectUrl(it.projectUrl || '');
    setEditImageUrl(it.image);
    setEditImageFile(null);
  }

  async function saveEdit() {
    if (!editingId) return;
    try {
      const tagArr = editTags.split(',').map(t => t.trim()).filter(Boolean);
      await updateProject.mutateAsync({
        id: editingId,
        title: editTitle,
        category: editCategory,
        description: editDescription,
        iconKey: editIconKey,
        tags: tagArr,
        year: editYear,
        projectUrl: editProjectUrl || null,
        imageFile: editImageFile,
        imageUrl: editImageFile ? null : (editImageUrl || null),
      });
      toast({ title: 'Project updated', description: 'Changes saved successfully.' });
      setEditingId(null);
      await refetch();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Update failed';
      toast({ title: 'Error', description: msg });
    }
  }

  async function removeProject(id: string) {
    if (!confirm('Delete this project?')) return;
    try {
      await deleteProject.mutateAsync(id);
      toast({ title: 'Deleted', description: 'Project removed' });
      if (editingId === id) setEditingId(null);
      await refetch();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Delete failed';
      toast({ title: 'Error', description: msg });
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Admin – Add Project</title>
        <meta name="robots" content="noindex,nofollow" />
        {import.meta.env.VITE_SITE_URL && (
          <link rel="canonical" href={`${import.meta.env.VITE_SITE_URL}/admin/projects`} />
        )}
      </Helmet>
      <Header />
      <main className="pt-24 pb-20 px-4 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin: Projects</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <section>
            <h2 className="text-xl font-semibold mb-4">Add Project</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <Input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Project title" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category *</label>
              <Input value={category} onChange={e=>setCategory(e.target.value)} placeholder="AI & Design" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Year *</label>
              <Input value={year} onChange={e=>setYear(e.target.value)} placeholder="2025" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description *</label>
            <Textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Short description" rows={4} />
          </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm">
                <label className="font-medium">Image Source *</label>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={()=>setUseUpload(false)} className={`px-2 py-1 rounded-md border text-xs ${!useUpload ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>URL</button>
                  <button type="button" onClick={()=>setUseUpload(true)} className={`px-2 py-1 rounded-md border text-xs ${useUpload ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>Upload</button>
                </div>
              </div>
              {!useUpload && (
                <div>
                  <Input value={image} onChange={e=>setImage(e.target.value)} placeholder="https://..." />
                  <p className="text-xs text-muted-foreground mt-1">Provide a publicly accessible image URL.</p>
                </div>
              )}
              {useUpload && (
                <div>
                  <Input type="file" accept="image/*" onChange={e=>setImageFile(e.target.files?.[0] || null)} />
                  <p className="text-xs text-muted-foreground mt-1">Upload an image file (max ~5MB).</p>
                </div>
              )}
            </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Icon Key *</label>
              <Input value={iconKey} onChange={e=>setIconKey(e.target.value)} placeholder="Code" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tags (comma separated) *</label>
              <Input value={tags} onChange={e=>setTags(e.target.value)} placeholder="AI,Design,Automation" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Project URL (optional)</label>
            <Input value={projectUrl} onChange={e=>setProjectUrl(e.target.value)} placeholder="https://example.com/project" />
          </div>
          <Button type="submit" disabled={submitting || createProject.isPending} className="gap-2">{(submitting || createProject.isPending) ? 'Submitting...' : 'Add Project'}</Button>
        </form>
          </section>
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Existing Projects</h2>
              <div className="flex items-center gap-2">
                <Input value={search} onChange={e=>{ setSearch(e.target.value); setPage(1); }} placeholder="Search..." className="w-40" />
                <Input value={categoryFilter} onChange={e=>{ setCategoryFilter(e.target.value); setPage(1); }} placeholder="Category" className="w-40" />
                <Button variant="outline" onClick={()=>refetch()} disabled={listLoading}>Refresh</Button>
              </div>
            </div>
            {listLoading && <div className="text-sm text-muted-foreground mb-3">Loading...</div>}
            <div className="grid gap-4">
              {items.map(p => (
                <Card key={p.id} className="p-4 space-y-3">
                  {editingId === p.id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input value={editTitle} onChange={e=>setEditTitle(e.target.value)} placeholder="Title" />
                        <Input value={editCategory} onChange={e=>setEditCategory(e.target.value)} placeholder="Category" />
                        <Input value={editYear} onChange={e=>setEditYear(e.target.value)} placeholder="Year" />
                        <Input value={editIconKey} onChange={e=>setEditIconKey(e.target.value)} placeholder="Icon Key" />
                      </div>
                      <Textarea value={editDescription} onChange={e=>setEditDescription(e.target.value)} placeholder="Description" rows={3} />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input value={editTags} onChange={e=>setEditTags(e.target.value)} placeholder="Tags (comma)" />
                        <Input value={editProjectUrl} onChange={e=>setEditProjectUrl(e.target.value)} placeholder="Project URL" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Image</label>
                        <Input value={editImageUrl} onChange={e=>setEditImageUrl(e.target.value)} placeholder="https://..." />
                        <Input type="file" accept="image/*" onChange={e=>setEditImageFile(e.target.files?.[0] || null)} />
                        <p className="text-xs text-muted-foreground">Provide URL or upload new file. Upload overrides URL.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button onClick={saveEdit} disabled={updateProject.isPending}>{updateProject.isPending ? 'Saving...' : 'Save'}</Button>
                        <Button variant="outline" onClick={()=>setEditingId(null)}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">{p.title}</h3>
                        <p className="text-xs text-muted-foreground">{p.category} • {p.year}</p>
                        <p className="text-sm mt-2 line-clamp-2">{p.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">Tags: {(p.tags||[]).join(', ')}</p>
                      </div>
                      <img src={p.image} alt={p.title} className="w-20 h-20 rounded-md object-cover border" />
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    {editingId === p.id ? null : (
                      <Button size="sm" onClick={()=>beginEdit(p.id)}>Edit</Button>
                    )}
                    <Button size="sm" variant="destructive" onClick={()=>removeProject(p.id)} disabled={deleteProject.isPending}>{deleteProject.isPending && editingId !== p.id ? 'Working...' : 'Delete'}</Button>
                  </div>
                </Card>
              ))}
            </div>
            <div className="flex items-center justify-between mt-4">
              <Button variant="outline" onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page<=1}>Prev</Button>
              <span className="text-sm">Page {page} / {totalPages}</span>
              <Button variant="outline" onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page>=totalPages}>Next</Button>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}