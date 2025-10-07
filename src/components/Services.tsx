import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Smartphone, Glasses, Cpu, Wand2, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState, useCallback, useMemo } from "react";

type Service = {
  id: string;
  title: string;
  description: string;
  iconKey: string;
  gradient: string;
};

import type { LucideIcon } from "lucide-react";
const iconMap: Record<string, LucideIcon> = { Brain, Smartphone, Glasses, Cpu, Wand2 };

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const Icon = iconMap[service.iconKey] || Brain;
  return (
    <Card
      className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-glow-primary hover:scale-105 animate-fade-in"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <CardContent className="p-5 sm:p-6">
        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-gradient-to-br ${service.gradient} p-3 mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
          <Icon className="w-full h-full text-primary-foreground" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
          {service.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {service.description}
        </p>
      </CardContent>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </Card>
  );
}

export const Services = () => {
  const [services, setServices] = useState<Service[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [offlineFallback, setOfflineFallback] = useState(false);

  // Local fallback (mirrors server seed so UI still works if API down)
  const fallbackServices: Service[] = useMemo(() => [
    { id: 'fallback-ai-art', title: 'AI Art & Design Tools', description: 'Cutting-edge artificial intelligence solutions for creative design and artistic generation.', iconKey: 'Brain', gradient: 'from-primary to-primary-glow' },
    { id: 'fallback-web-mobile', title: 'Web & Mobile App Development', description: 'Full-stack development of responsive web platforms and native mobile experiences.', iconKey: 'Smartphone', gradient: 'from-accent-cyan to-accent' },
    { id: 'fallback-ar-vr', title: 'AR/VR & Game Design', description: 'Immersive augmented, virtual and interactive 3D experiences.', iconKey: 'Glasses', gradient: 'from-accent-magenta to-primary' },
    { id: 'fallback-automation', title: 'Automation Systems', description: 'Intelligent automation solutions that streamline workflows and boost productivity.', iconKey: 'Cpu', gradient: 'from-accent to-accent-cyan' },
    { id: 'fallback-creative', title: 'Smart Creative Software', description: 'Innovative software tools that empower creators with intelligent features.', iconKey: 'Wand2', gradient: 'from-primary-glow to-accent-magenta' }
  ], []);

  const fetchServices = useCallback(async () => {
    setError(null);
    setOfflineFallback(false);
    setServices(null);
    try {
      const res = await fetch(`/api/content/services`, { signal: AbortSignal.timeout ? AbortSignal.timeout(7000) : undefined });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      setServices(data.items as Service[]);
    } catch (e) {
      // Use fallback so page doesn\'t look broken
      setServices(fallbackServices);
      setOfflineFallback(true);
      setError('Live services API unavailable. Showing fallback.');
    }
  }, [fallbackServices]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const retry = () => fetchServices();

  return (
    <section id="services" className="py-16 sm:py-20 md:py-24 relative overflow-hidden">
      {/* Darker panel base with subtle vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--background))/0.85,transparent_80%),linear-gradient(to_bottom,hsl(var(--background))_0%,hsl(var(--background))/0.95_60%,hsl(var(--background))_100%)]" />
      {/* Fine grid (lighter + smaller) */}
      <div className="absolute inset-0 opacity-[0.15] bg-[linear-gradient(to_right,hsl(var(--border))/0.4_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))/0.4_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(circle_at_50%_55%,#000_68%,transparent_100%)]" />
      {/* Soft restrained accent glows */}
      <div className="absolute inset-0 mix-blend-screen pointer-events-none bg-[radial-gradient(circle_at_15%_30%,hsl(var(--accent-cyan))/0.22,transparent_55%),radial-gradient(circle_at_85%_70%,hsl(var(--accent-magenta))/0.20,transparent_58%),radial-gradient(circle_at_50%_60%,hsl(var(--primary))/0.18,transparent_62%)]" />
      {/* Inner shadow / depth */}
      <div className="absolute inset-0 pointer-events-none [box-shadow:0_0_0_1px_hsl(var(--border))/0.25_inset,0_0_35px_15px_hsl(var(--background))_inset]" />
      
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 sm:mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-hero">
            Core Services
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Comprehensive technology solutions that push the boundaries of innovation
          </p>
          <div className="mt-8">
            <Link to="/services">
              <Button variant="outline" size="lg" className="gap-2 hover:scale-105 transition-transform">
                View All Services <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {error && (
          <div className="text-center text-xs sm:text-sm mb-6 flex flex-col items-center gap-3">
            <span className={offlineFallback ? 'text-amber-500' : 'text-destructive'}>{error}</span>
            <Button variant="outline" size="sm" onClick={retry} className="gap-1">
              <RefreshCw className="w-4 h-4" /> Retry
            </Button>
          </div>
        )}
        {!services && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-48 rounded-lg animate-pulse bg-muted/30" />
            ))}
          </div>
        )}
        {services && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {services.map((s, i) => (
              <ServiceCard key={s.id} service={s} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
