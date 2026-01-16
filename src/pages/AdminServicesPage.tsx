import { Helmet } from 'react-helmet-async';
import React, { useMemo, useState } from 'react';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { useServices } from '@/hooks/useData';
import { useCreateService, useUpdateService, useDeleteService } from '@/hooks/useMutations';

export default function AdminServicesPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [iconKey, setIconKey] = useState('Code');
  const [gradient, setGradient] = useState('from-primary to-primary-glow');
  const createService = useCreateService();

  const { data: services, isLoading, refetch } = useServices();
  const items = React.useMemo(() => services || [], [services]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const editing = useMemo(() => items.find(i => i.id === editingId) || null, [items, editingId]);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editIconKey, setEditIconKey] = useState('');
  const [editGradient, setEditGradient] = useState('');
  const updateService = useUpdateService();
  const deleteService = useDeleteService();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !description || !iconKey) {
      toast({ title: 'Missing fields', description: 'Fill all required fields.' });
      return;
    }
    try {
      const id = await createService.mutateAsync({ title, description, iconKey, gradient });
      toast({ title: 'Service added', description: `ID: ${id}` });
      setTitle(''); setDescription(''); setIconKey('Code'); setGradient('from-primary to-primary-glow');
      await refetch();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Create failed';
      toast({ title: 'Error', description: msg });
    }
  }

  function beginEdit(id: string) {
    setEditingId(id);
    const it = items.find(s => s.id === id);
    if (!it) return;
    setEditTitle(it.title);
    setEditDescription(it.description);
    setEditIconKey(it.iconKey);
    setEditGradient(it.gradient);
  }

  async function saveEdit() {
    if (!editingId) return;
    try {
      await updateService.mutateAsync({ id: editingId, title: editTitle, description: editDescription, iconKey: editIconKey, gradient: editGradient });
      toast({ title: 'Service updated', description: 'Changes saved.' });
      setEditingId(null);
      await refetch();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Update failed';
      toast({ title: 'Error', description: msg });
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this service?')) return;
    try {
      await deleteService.mutateAsync(id);
      toast({ title: 'Deleted', description: 'Service removed' });
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
        <title>Admin – Services</title>
        <meta name="robots" content="noindex,nofollow" />
        {import.meta.env.VITE_SITE_URL && (
          <link rel="canonical" href={`${import.meta.env.VITE_SITE_URL}/admin/services`} />
        )}
      </Helmet>
      <Header />
      <main className="pt-24 pb-20 px-4 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin: Services</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <section>
            <h2 className="text-xl font-semibold mb-4">Add Service</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" />
              <Textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description" rows={3} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input value={iconKey} onChange={e=>setIconKey(e.target.value)} placeholder="Icon Key" />
                <Input value={gradient} onChange={e=>setGradient(e.target.value)} placeholder="Gradient" />
              </div>
              <Button type="submit" disabled={createService.isPending}>{createService.isPending ? 'Submitting...' : 'Add Service'}</Button>
            </form>
          </section>
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Existing Services</h2>
              <Button variant="outline" onClick={()=>refetch()} disabled={isLoading}>Refresh</Button>
            </div>
            {isLoading && <div className="text-sm text-muted-foreground mb-3">Loading...</div>}
            <div className="grid gap-4">
              {items.map(s => (
                <Card key={s.id} className="p-4 space-y-3">
                  {editingId === s.id ? (
                    <div className="space-y-3">
                      <Input value={editTitle} onChange={e=>setEditTitle(e.target.value)} placeholder="Title" />
                      <Textarea value={editDescription} onChange={e=>setEditDescription(e.target.value)} placeholder="Description" rows={3} />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input value={editIconKey} onChange={e=>setEditIconKey(e.target.value)} placeholder="Icon Key" />
                        <Input value={editGradient} onChange={e=>setEditGradient(e.target.value)} placeholder="Gradient" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Button onClick={saveEdit} disabled={updateService.isPending}>{updateService.isPending ? 'Saving...' : 'Save'}</Button>
                        <Button variant="outline" onClick={()=>setEditingId(null)}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="font-semibold">{s.title}</h3>
                      <p className="text-xs text-muted-foreground">{s.iconKey} • {s.gradient}</p>
                      <p className="text-sm mt-2 leading-relaxed">{s.description}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    {editingId === s.id ? null : (
                      <Button size="sm" onClick={()=>{ setEditingId(s.id); beginEdit(s.id); }}>Edit</Button>
                    )}
                    <Button size="sm" variant="destructive" onClick={()=>remove(s.id)} disabled={deleteService.isPending}>{deleteService.isPending && editingId !== s.id ? 'Working...' : 'Delete'}</Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
