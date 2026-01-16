import { Star, Quote } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from '@/lib/supabase';
import { useTestimonials } from '@/hooks/useData';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';

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
  const testimonialsQuery = useTestimonials();
  const groupSize = 3; // number shown per slide
  const [api, setApi] = useState<CarouselApi | null>(null);
  // Fetch all testimonials
  const fetchAll = useCallback(() => { testimonialsQuery.refetch(); }, [testimonialsQuery]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  useEffect(() => {
    if (testimonialsQuery.isSuccess) {
      setTestimonials(testimonialsQuery.data);
      setError(null);
      // reset carousel to first slide
      api?.scrollTo(0);
    } else if (testimonialsQuery.isError) {
      setError('Failed to load testimonials');
    }
  }, [testimonialsQuery.isSuccess, testimonialsQuery.isError, testimonialsQuery.data, api]);

  // Listen for new submissions and refresh
  useEffect(() => {
    const handler = () => {
      fetchAll();
      api?.scrollTo(0);
    };
    window.addEventListener('testimonial-submitted', handler);
    return () => window.removeEventListener('testimonial-submitted', handler);
  }, [fetchAll, api]);

  // Build slide groups to keep height stable and avoid layout shift
  const groups = useMemo(() => {
    const arr: Testimonial[][] = [];
    for (let i = 0; i < testimonials.length; i += groupSize) {
      arr.push(testimonials.slice(i, i + groupSize));
    }
    return arr;
  }, [testimonials]);

  // Autoplay: advance carousel every 6s without re-rendering the whole section
  useEffect(() => {
    if (!api || groups.length <= 1) return;
    const id = setInterval(() => {
      api.scrollNext();
    }, 6000);
    return () => clearInterval(id);
  }, [api, groups.length]);

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
        {groups.length > 0 && (
          <Carousel setApi={setApi} opts={{ loop: true }} className="relative">
            <CarouselContent className="gap-6 sm:gap-8">
              {groups.map((group, gi) => (
                <CarouselItem key={gi} className="basis-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {group.map((testimonial) => (
                      <Card
                        key={testimonial.id}
                        className="p-5 sm:p-6 bg-gradient-to-br from-background to-card/70 backdrop-blur border border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
                      >
                        <Quote className="w-10 h-10 sm:w-12 sm:h-12 text-primary/40 mb-4 group-hover:text-primary/60 transition-all" />
                        <div className="flex gap-1 mb-4">
                          {Array.from({ length: testimonial.rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-primary text-primary" />
                          ))}
                        </div>
                        <p className="text-muted-foreground mb-6 leading-relaxed text-sm sm:text-base">
                          "{testimonial.content}"
                        </p>
                        <div className="flex items-center gap-3 sm:gap-4">
                          <img
                            src={testimonial.image.startsWith('/uploads') ? `${window.location.origin}${testimonial.image}` : testimonial.image}
                            alt={testimonial.name}
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-primary/30"
                          />
                          <div>
                            <h4 className="font-semibold text-sm sm:text-base">{testimonial.name}</h4>
                            <p className="text-xs sm:text-sm text-muted-foreground">{testimonial.role}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {groups.length > 1 && (
              <>
                <CarouselPrevious className="hidden sm:flex" />
                <CarouselNext className="hidden sm:flex" />
              </>
            )}
          </Carousel>
        )}
      </div>
    </section>
  );
};
