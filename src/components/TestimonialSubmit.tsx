import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Star, Upload } from 'lucide-react';

interface FormState {
  name: string;
  role: string;
  content: string;
  rating: number;
  imageFile: File | null;
}

const initial: FormState = { name: '', role: '', content: '', rating: 5, imageFile: null };

export function TestimonialSubmit() {
  const [form, setForm] = useState<FormState>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(f => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setSuccess(null);
    if (!form.name.trim()) return setError('Name required');
    if (!form.role.trim()) return setError('Role required');
    if (form.content.trim().length < 10) return setError('Content must be at least 10 chars');
    if (!form.imageFile) return setError('Image required');
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('role', form.role);
    fd.append('content', form.content);
    fd.append('rating', String(form.rating));
    fd.append('image', form.imageFile);
    setSubmitting(true);
    try {
      const res = await fetch('/api/testimonial-submit', { method: 'POST', body: fd });
      let data: unknown = null;
      try { data = await res.json(); } catch (_) { /* ignore parse errors */ }
      const obj = (data && typeof data === 'object') ? data as Record<string, unknown> : null;
      if (!res.ok) {
        // Prefer specific server provided error/message
        const serverMsg = obj && (typeof obj.message === 'string' ? obj.message : (typeof obj.error === 'string' ? obj.error : undefined));
        setError(serverMsg ? `Submission failed: ${serverMsg}` : 'Submission failed.');
        return;
      }
      if (obj && typeof obj.id === 'string') {
        setSuccess(obj.id);
        setForm(initial);
        // Dispatch global event so testimonial list can refresh immediately
        window.dispatchEvent(new CustomEvent('testimonial-submitted', { detail: { id: obj.id } }));
      } else {
        setError('Unexpected response from server.');
      }
    } catch (e) {
      setError((e as Error).message || 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="submit-testimonial" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      <div className="container mx-auto relative z-10 max-w-3xl">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-hero">Share Your Experience</h2>
        <p className="text-muted-foreground mb-8">Have we helped your project? Leave a testimonial and appear on our site!</p>
        <Card className="p-6 space-y-6 bg-card/70 backdrop-blur">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="text-sm p-3 rounded border border-destructive/40 bg-destructive/10 text-destructive">{error}</div>}
            {success && <div className="text-sm p-3 rounded border border-green-600/40 bg-green-600/10 text-green-500">Thanks! Your testimonial was submitted. Ref: {success}</div>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Name</label>
                <Input value={form.name} onChange={e => update('name', e.target.value)} placeholder="Your name" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Role / Company</label>
                <Input value={form.role} onChange={e => update('role', e.target.value)} placeholder="CTO, Startup" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Testimonial</label>
              <Textarea value={form.content} onChange={e => update('content', e.target.value)} rows={5} placeholder="Describe your experience..." />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Rating</label>
              <div className="flex gap-2">
                {Array.from({ length: 5 }).map((_, i) => {
                  const value = i + 1;
                  return (
                    <button
                      type="button"
                      key={value}
                      onClick={() => update('rating', value)}
                      className={`p-2 rounded-md border transition-colors ${form.rating >= value ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary/50'}`}
                      aria-label={`Set rating ${value}`}
                    >
                      <Star className={`w-5 h-5 ${form.rating >= value ? 'fill-primary text-primary-foreground' : ''}`} />
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Profile Image</label>
              <Input type="file" accept="image/*,.jpg,.jpeg,.png,.gif,.webp,.avif,.svg,.heic,.heif,.bmp,.tiff,.jfif" onChange={e => {
                const file = e.target.files?.[0] || null;
                update('imageFile', file);
                if (file) {
                  const url = URL.createObjectURL(file);
                  setPreview(old => { if (old) URL.revokeObjectURL(old); return url; });
                } else {
                  setPreview(old => { if (old) URL.revokeObjectURL(old); return null; });
                }
              }} />
              {form.imageFile && <p className="text-xs text-muted-foreground mt-1">{form.imageFile.name} ({Math.round(form.imageFile.size/1024)} KB)</p>}
              {preview && (
                <div className="mt-3 flex items-center gap-4">
                  <img src={preview} alt="Preview" className="w-16 h-16 rounded-full object-cover border border-border" />
                  <button type="button" onClick={() => { update('imageFile', null); setPreview(old => { if (old) URL.revokeObjectURL(old); return null; }); }} className="text-xs text-destructive hover:underline">Remove</button>
                </div>
              )}
            </div>
            <Button disabled={submitting} type="submit" className="gap-2">{submitting ? 'Submitting...' : 'Submit Testimonial'}<Upload className="w-4 h-4" /></Button>
          </form>
        </Card>
      </div>
    </section>
  );
}

export default TestimonialSubmit;