import React, { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Brain, Smartphone, Glasses, Cpu, Wand2, Circle, CircleCheckBig, Calendar, PhoneCall, Loader2 } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Calendar as DayCalendar } from "@/components/ui/calendar";
import { submitServiceRequest } from "@/lib/service-request";

interface ServiceCategory {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  gradient: string;
  subServices: string[];
}

const serviceCategories: ServiceCategory[] = [
  {
    id: 'ai-art',
    icon: Brain,
    title: 'AI Art & Design Tools',
    description: 'Cutting-edge artificial intelligence solutions for creative design and artistic generation.',
    gradient: 'from-primary to-primary-glow',
    subServices: [
      'Custom AI Model Training',
      'Image Generation & Enhancement',
      'Style Transfer Systems',
      'Automated Design Pipelines',
      'AI Brand Asset Creation'
    ]
  },
  {
    id: 'web-mobile',
    icon: Smartphone,
    title: 'Web & Mobile App Development',
    description: 'Full-stack development of responsive web platforms and native mobile experiences.',
    gradient: 'from-accent-cyan to-accent',
    subServices: [
      'Custom Web Applications',
      'iOS & Android Apps',
      'Progressive Web Apps (PWA)',
      'API & Backend Engineering',
      'Design System & Component Library'
    ]
  },
  {
    id: 'ar-vr',
    icon: Glasses,
    title: 'AR/VR & Game Design',
    description: 'Immersive augmented, virtual and interactive 3D experiences.',
    gradient: 'from-accent-magenta to-primary',
    subServices: [
      'VR Training Simulations',
      'AR Product Visualization',
      'Interactive 3D Prototypes',
      'Unity & Unreal Development',
      'Gamification Systems'
    ]
  },
  {
    id: 'automation',
    icon: Cpu,
    title: 'Automation Systems',
    description: 'Intelligent automation and workflow optimization solutions.',
    gradient: 'from-accent to-accent-cyan',
    subServices: [
      'Workflow Automation',
      'Data Processing Pipelines',
      'Integration Middleware',
      'Custom Scripts & Bots',
      'Monitoring & Alerting'
    ]
  },
  {
    id: 'creative-software',
    icon: Wand2,
    title: 'Smart Creative Software',
    description: 'Intelligent tools & software that empower creators.',
    gradient: 'from-primary-glow to-accent-magenta',
    subServices: [
      'Custom Creative Tools',
      'Plugin & Extension Development',
      'Creative Automation',
      'UI/UX Design Systems',
      'Generative Content Pipelines'
    ]
  }
];

export default function ServicesPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  // Removed localStorage persistence so form always resets on refresh.

  // (Persistence removed)

  const toggle = (key: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const validate = useCallback(() => {
    const next: Record<string,string> = {};
    if (!name.trim()) next.name = 'Name is required';
    if (!email.trim()) next.email = 'Email is required';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) next.email = 'Invalid email format';
    if (meetingDate && meetingDate < new Date().toISOString().split('T')[0]) next.meetingDate = 'Date can\'t be in the past';
    return next;
  }, [name, email, meetingDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) {
      toast({ title: 'Please fix the highlighted fields', description: 'Some required info is missing.' });
      return;
    }
    const payload = {
      name,
      email,
      company: company || undefined,
      meetingDate: meetingDate || undefined,
      meetingTime: meetingTime || undefined,
      message: message || undefined,
      requested: Array.from(selected),
      submittedAt: new Date().toISOString()
    };
    try {
      setSubmitting(true);
      const res = await submitServiceRequest(payload);
      console.log('Service Consultation Request', payload);
      toast({ title: 'Request submitted', description: `Reference ID: ${res.id.slice(0,8)} · ETA reply next business day.` });
      console.log('analytics:event', { type: 'services_request_submitted', count: selected.size });
   // Mark as submitted and fully clear the form + persisted draft so it doesn't stick on refresh
   setSubmitted(true);
   setSelected(new Set());
   setName("");
   setEmail("");
   setCompany("");
   setMeetingDate("");
   setMeetingTime("");
   setMessage("");
  // (Persistence removed so no need to clear localStorage)
      const el = document.getElementById('consultation-form');
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
    } catch (err) {
      toast({ title: 'Submission failed', description: 'Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
          <div className="container mx-auto relative z-10">
            <div className="text-center mb-16 animate-fade-in">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-hero">Our Services</h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">Select the specific solutions you need. We'll review and reach out with next steps & meeting options.</p>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto mb-20">
              {serviceCategories.map((cat, i) => {
                const Icon = cat.icon;
                return (
                  <Card key={cat.id} className="group overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-500 hover:shadow-glow-primary animate-fade-in" style={{ animationDelay: `${i * 0.07}s` }}>
                    <CardHeader>
                      <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${cat.gradient} p-4 mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                        <Icon className="w-full h-full text-primary-foreground" />
                      </div>
                      <CardTitle className="text-2xl text-foreground group-hover:text-primary transition-colors">{cat.title}</CardTitle>
                      <CardDescription className="text-base">{cat.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-3">
                        {cat.subServices.map((sub, idx) => {
                          const key = `${cat.id}::${sub}`;
                          const active = selected.has(key);
                          return (
                            <li key={idx}>
                              <button type="button" onClick={() => toggle(key)} className={`w-full flex items-start gap-3 rounded-md border px-3 py-2 text-left transition-all ${active ? 'border-primary/70 bg-primary/10 shadow-glow-primary' : 'border-border/50 hover:border-primary/40 hover:bg-primary/5'}`}>
                                {active ? <CircleCheckBig className="w-5 h-5 text-primary shrink-0 mt-0.5" /> : <Circle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />}
                                <span className={`text-sm leading-relaxed ${active ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{sub}</span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                      <p className="text-xs text-muted-foreground/70">Tap to select one or more specifics you need.</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            {/* CTA Section */}
            <div className="max-w-4xl mx-auto mb-24 animate-fade-in" style={{ animationDelay: '0.05s' }}>
              <Card className="p-8 sm:p-12 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.4),transparent_70%)]" />
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-hero">Need a Custom Solution?</h2>
                <p className="text-lg text-muted-foreground mb-0 max-w-2xl">
                  Have a unique challenge or an idea that doesn’t fit neatly into a service category? Tell us what you’re building and we’ll respond within one business day.
                </p>
              </Card>
            </div>

            <div className="max-w-5xl mx-auto" id="consultation-form">
              <Card className="p-8 sm:p-10 bg-card/60 backdrop-blur-sm border-primary/20">
                <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-hero">Request a Consultation</h2>
                {submitted && (
                  <div className="mb-6 rounded-md border border-primary/30 bg-primary/5 p-4 text-sm text-muted-foreground">
                    <span className="text-primary font-medium">Thank you!</span> We received your request. You can adjust and submit again if you need to add more details.
                  </div>
                )}
                <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                  {selected.size > 0 ? (
                    <>Select services above then share some details so we can prepare before we speak. (<span className="text-primary font-semibold">{selected.size}</span> selected)</>
                  ) : (
                    <>You can optionally pick specific services above, or just describe your custom solution needs below.</>
                  )}
                </p>
                <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Name <span className="text-destructive">*</span></label>
                      <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" aria-invalid={!!errors.name} />
                      {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email <span className="text-destructive">*</span></label>
                      <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" aria-invalid={!!errors.email} />
                      {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Company / Organization</label>
                      <Input value={company} onChange={e => setCompany(e.target.value)} placeholder="Optional" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">Preferred Meeting Date <Calendar className="w-4 h-4" /></label>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button type="button" variant="outline" className="w-full justify-between">
                            {meetingDate || 'Pick a date'}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Select Date</DialogTitle>
                            <DialogDescription>Choose your preferred meeting date (optional)</DialogDescription>
                          </DialogHeader>
                          <DayCalendar
                            mode="single"
                            selected={meetingDate ? new Date(meetingDate) : undefined}
                            onSelect={(d) => { if (d) { const iso = d.toISOString().split('T')[0]; setMeetingDate(iso); }}}
                            disabled={(d) => d < new Date(new Date().toDateString())}
                          />
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button type="button">Done</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      {errors.meetingDate && <p className="text-xs text-destructive">{errors.meetingDate}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">Preferred Time (Optional)</label>
                      <Input type="time" value={meetingTime} onChange={e => setMeetingTime(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message / Additional Details</label>
                    <Textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Describe your goals, current challenges, tech stack, deadlines..." rows={5} />
                  </div>
                  {selected.size > 0 && (
                    <div className="border border-border/50 rounded-lg p-4 bg-background/50">
                      <div className="text-sm font-medium mb-2">Selected Services</div>
                      <ul className="flex flex-wrap gap-2">
                        {Array.from(selected).map(k => (
                          <li key={k} className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                            {k.split('::')[1]}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between mt-4">
                    <div className="flex flex-col sm:flex-row gap-4 w-full flex-wrap">
                      <Button type="submit" size="lg" disabled={submitting} className="min-w-[180px]">
                        {submitting && <Loader2 className="w-4 h-4 animate-spin" />} Submit Request
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button type="button" variant="outline" size="lg" className="min-w-[180px]" onClick={() => console.log('analytics:event', { type: 'open_schedule_modal' })}>
                            <PhoneCall className="w-4 h-4" /> Schedule Call
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Schedule a Call</DialogTitle>
                            <DialogDescription>Select a tentative slot. We'll confirm via email.</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                              {['09:00','10:30','13:00','15:00','17:30','19:00'].map(t => (
                                <button
                                  key={t}
                                  type="button"
                                  onClick={() => { setMeetingTime(t); toast({ title: 'Time selected', description: `Preferred time: ${t}` }); console.log('analytics:event',{ type:'select_time_slot', value:t}); }}
                                  className={`text-sm rounded-md border px-3 py-2 transition-colors ${meetingTime===t ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/50 hover:bg-primary/5'}`}
                                >
                                  {t}
                                </button>
                              ))}
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Or enter a custom preferred time</label>
                              <Input type="time" value={meetingTime} onChange={e => setMeetingTime(e.target.value)} />
                            </div>
                          </div>
                          <DialogFooter className="mt-4">
                            <DialogClose asChild>
                              <Button type="button" onClick={() => console.log('analytics:event',{ type:'close_schedule_modal'})}>Done</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button type="button" variant="ghost" onClick={() => { setSelected(new Set()); setSubmitted(false); console.log('analytics:event',{ type:'clear_selections'}); }} disabled={selected.size === 0}>Clear Selections</Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground/60">We respond within 1 business day. Pricing & proposal shared after scoping your exact needs.</p>
                </form>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
// Removed export/print utilities as per simplified design request
