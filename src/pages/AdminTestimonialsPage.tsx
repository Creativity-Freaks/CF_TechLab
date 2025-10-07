import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

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

  async function load() {
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/content/testimonials/pending');
      if (!res.ok) throw new Error('status_' + res.status);
      const data = await res.json();
      setItems(data.items || []);
    } catch (e) {
      setError('Failed to load pending testimonials');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function approve(id: string) {
    setActingId(id);
    try {
      const res = await fetch(`/api/content/testimonials/${id}/approve`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed');
      toast({ title: 'Approved', description: 'Testimonial approved' });
      setItems(prev => prev.filter(p => p.id !== id));
      // Notify public components (e.g., Testimonials) to refresh
      window.dispatchEvent(new CustomEvent('testimonial-submitted'));
    } catch {
      toast({ title: 'Error', description: 'Approve failed' });
    } finally {
      setActingId(null);
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this testimonial?')) return;
    setActingId(id);
    try {
      const res = await fetch(`/api/content/testimonials/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      toast({ title: 'Deleted', description: 'Testimonial removed' });
      setItems(prev => prev.filter(p => p.id !== id));
    } catch {
      toast({ title: 'Error', description: 'Delete failed' });
    } finally {
      setActingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20 px-4 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Admin: Pending Testimonials</h1>
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
                <Button size="sm" disabled={actingId === t.id} onClick={() => approve(t.id)} className="bg-green-600 hover:bg-green-700">{actingId === t.id ? 'Working...' : 'Approve'}</Button>
                <Button size="sm" variant="destructive" disabled={actingId === t.id} onClick={() => remove(t.id)}>Delete</Button>
              </div>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
