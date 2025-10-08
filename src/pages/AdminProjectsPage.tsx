import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useCreateProject } from '@/hooks/useMutations';

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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20 px-4 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin: Add Project</h1>
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
      </main>
      <Footer />
    </div>
  );
}