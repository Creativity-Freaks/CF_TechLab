import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-tech.jpg";

export const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="AI Technology Background" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/95 to-background" />
        {/* Aurora gradient overlay unique to hero */}
        <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-70 animate-pulse-slow bg-[radial-gradient(circle_at_20%_30%,hsl(var(--primary))/0.35,transparent_60%),radial-gradient(circle_at_80%_70%,hsl(var(--accent-cyan))/0.30,transparent_65%),radial-gradient(circle_at_50%_55%,hsl(var(--accent-magenta))/0.25,transparent_60%)]" />
      </div>

  {/* Distinct hero mesh/grid overlay */}
  <div className="absolute inset-0 bg-[linear-gradient(115deg,hsl(var(--primary))/0.07,transparent),linear-gradient(to_right,hsl(var(--border))/0.5_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))/0.5_1px,transparent_1px)] bg-[size:100%_100%,4rem_4rem,4rem_4rem] [mask-image:radial-gradient(ellipse_65%_55%_at_50%_50%,#000_72%,transparent_100%)] opacity-40" />

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-8 animate-float">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-sm text-muted-foreground">Innovation Meets Creativity</span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-hero animate-in fade-in slide-in-from-bottom-4 duration-1000">
          CF TechLab
        </h1>

        <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-4 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-150">
          <span className="text-primary font-semibold">Engineering the Future of Creativity</span>
        </p>

        <p className="text-lg md:text-xl text-muted-foreground/80 mb-2 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
          The Technology & Innovation Arm of Creativity Freaks
        </p>

        <p className="text-base md:text-lg text-muted-foreground/60 mb-12 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-7 duration-1000 delay-450">
          Where Ideas Turn Into Innovation — Blending Art, Code, and Imagination
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-600">
          <Button
            variant="hero"
            size="lg"
            className="group"
            onClick={() => navigate('/services')}
          >
            Explore Our Tech
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/projects')}
          >
            View Projects
          </Button>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
