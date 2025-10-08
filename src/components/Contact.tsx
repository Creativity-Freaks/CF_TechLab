import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { supabase } from '@/lib/supabase';
import { useSubmitContactMessage } from '@/hooks/useMutations';

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const initialState: FormState = { name: "", email: "", subject: "", message: "" };

export const Contact = () => {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { id, value } = e.target;
    setForm(f => ({ ...f, [id]: value }));
  }

  function validate(f: FormState) {
    if (!f.name.trim()) return "Name is required";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) return "Valid email required";
    if (!f.subject.trim()) return "Subject is required";
    if (f.message.trim().length < 5) return "Message must be at least 5 characters";
    return null;
  }

  const submitContact = useSubmitContactMessage();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessId(null);
    const v = validate(form);
    if (v) { setError(v); return; }
    if (!supabase) { setError('Supabase not configured'); return; }
    setSubmitting(true);
    try {
      const id = await submitContact.mutateAsync({
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message
      });
      setSuccessId(id);
      setForm(initialState);
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-hero">
              Get in Touch
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ready to transform your creative vision with cutting-edge technology? Let's discuss your project.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
              {successId && (
                <div className="p-3 rounded-md border border-green-600/40 bg-green-600/10 text-sm text-green-500">
                  Message sent! Reference ID: <span className="font-mono">{successId}</span>
                </div>
              )}
              {error && (
                <div className="p-3 rounded-md border border-destructive/40 bg-destructive/10 text-sm text-destructive">
                  {error}
                </div>
              )}
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                <Input id="name" value={form.name} onChange={handleChange} placeholder="Your name" className="transition-all focus:border-primary" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                <Input id="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" className="transition-all focus:border-primary" />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">Subject</label>
                <Input id="subject" value={form.subject} onChange={handleChange} placeholder="Project inquiry" className="transition-all focus:border-primary" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                <Textarea id="message" value={form.message} onChange={handleChange} placeholder="Tell us about your project..." rows={5} className="transition-all focus:border-primary" />
              </div>
              <Button type="submit" disabled={submitting || submitContact.isPending} variant="hero" size="lg" className="w-full group disabled:opacity-70">
                {(submitting || submitContact.isPending) ? 'Sending...' : 'Send Message'}
                <Mail className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
              </Button>
            </form>

            {/* Contact Info */}
            <div className="space-y-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-start gap-4 group hover:scale-105 transition-transform duration-300">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center flex-shrink-0 group-hover:shadow-glow-primary transition-shadow">
                  <Mail className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <a href="mailto:tech@creativityfreaks.com" className="text-muted-foreground hover:text-primary transition-colors">
                    hcsarker2002@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 group hover:scale-105 transition-transform duration-300">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-cyan to-accent flex items-center justify-center flex-shrink-0 group-hover:shadow-glow-cyan transition-shadow">
                  <Phone className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Phone</h3>
                  <a href="tel:+8801642948324" className="text-muted-foreground hover:text-accent transition-colors">
                    +8801642948324 (WhatsApp Available)
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 group hover:scale-105 transition-transform duration-300">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-magenta to-primary flex items-center justify-center flex-shrink-0 group-hover:shadow-glow-primary transition-shadow">
                  <MapPin className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Location</h3>
                  <p className="text-muted-foreground">
                    Dhaka Division<br />
                    Banani, Dhaka, Bangladesh
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-lg border border-border/50 bg-card hover:border-primary/30 transition-colors">
                <h3 className="font-semibold mb-2">Business Hours</h3>
                <p className="text-sm text-muted-foreground">
                  Monday - Friday: 9:00 AM - 6:00 PM<br />
                  Saturday: 10:00 AM - 4:00 PM<br />
                  Sunday: Closed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
