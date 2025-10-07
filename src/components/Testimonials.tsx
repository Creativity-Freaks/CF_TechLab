import { Star, Quote } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useEffect, useState, useCallback } from "react";

type Testimonial = {
  id: string;
  name: string;
  role: string;
  image: string;
  content: string;
  rating: number;
};

export const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [error, setError] = useState<string | null>(null);
  const groupSize = 3; // number shown per slide
  const [autoIndex, setAutoIndex] = useState(0); // rotates through groups of 3
  // Fetch all testimonials by iterating batches sequentially.
  const fetchAll = useCallback(async () => {
    setError(null);
    let batch = 1;
    const collected: Testimonial[] = [];
    const safetyMax = 100; // prevent infinite loop
    try {
      while (batch <= safetyMax) {
        const res = await fetch(`/api/content/testimonials?batch=${batch}&size=${groupSize}`);
        if (!res.ok) throw new Error('status_' + res.status);
        const data = await res.json();
        collected.push(...(data.items as Testimonial[]));
        // Update incrementally so UI shows as soon as first batch arrives
        setTestimonials([...collected]);
        if (!data.hasMore) break;
        batch++;
      }
      setAutoIndex(0);
    } catch {
      setError('Failed to load testimonials');
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Listen for new submissions and refresh first batch (replace existing) then reset rotation
  useEffect(() => {
    const handler = () => {
      fetchAll();
      setAutoIndex(0);
    };
    window.addEventListener('testimonial-submitted', handler);
    return () => window.removeEventListener('testimonial-submitted', handler);
  }, [fetchAll]);

  // Auto rotate every 5s if more than one group has been loaded
  useEffect(() => {
    if (testimonials.length <= groupSize) return; // no need to rotate
    const groups = Math.ceil(testimonials.length / groupSize);
    const id = setInterval(() => {
      setAutoIndex(prev => (prev + 1) % groups);
    }, 5000);
    return () => clearInterval(id);
  }, [testimonials]);

  // No manual load more; all batches fetched automatically.
  return (
    <section id="testimonials" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-accent/5" />
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-12 sm:mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-hero">
            Happy Clients
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-4">
            Don't just take our word for it. Here's what our clients say about working with us.
          </p>
        </div>

        {error && <div className="text-center text-sm text-destructive mb-4">{error}</div>}
        {testimonials.length === 0 && !error && (
          <div className="text-center text-sm text-muted-foreground">
            {"No testimonials are published yet. Submitted testimonials appear here once approved."}
          </div>
        )}
        {testimonials.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 transition-opacity">
            {testimonials
              .slice(autoIndex * groupSize, autoIndex * groupSize + groupSize)
              .map((testimonial, index) => (
              <Card
                key={testimonial.id}
                className="p-5 sm:p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-500 hover:shadow-glow-primary animate-fade-in hover:scale-105 hover:-translate-y-2 group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Quote className="w-10 h-10 sm:w-12 sm:h-12 text-primary/30 mb-4 group-hover:text-primary/50 group-hover:scale-110 transition-all" />
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 sm:w-5 sm:h-5 fill-primary text-primary group-hover:scale-110 transition-transform"
                      style={{ transitionDelay: `${i * 50}ms` }}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed text-sm sm:text-base">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3 sm:gap-4">
                  <img
                    src={testimonial.image.startsWith('/uploads') ? `${window.location.origin}${testimonial.image}` : testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-primary/30 group-hover:border-primary/60 transition-all group-hover:scale-110"
                  />
                  <div>
                    <h4 className="font-semibold text-sm sm:text-base group-hover:text-primary transition-colors">{testimonial.name}</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
        {testimonials.length > groupSize && !error && (
          <div className="mt-10 flex items-center justify-center gap-4">
            <div className="flex gap-2">
              {Array.from({ length: Math.ceil(testimonials.length / groupSize) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setAutoIndex(i)}
                  className={`w-3 h-3 rounded-full border border-primary/40 transition ${i === autoIndex ? 'bg-primary' : 'bg-transparent hover:bg-primary/30'}`}
                  aria-label={`Show testimonials group ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
