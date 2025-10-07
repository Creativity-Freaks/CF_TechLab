import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Sparkles, ArrowRight } from "lucide-react";

export const FreakFlow = () => {
  return (
    <section id="freakflow" className="py-16 sm:py-20 md:py-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <Card className="border-primary/30 bg-gradient-card backdrop-blur-sm overflow-hidden hover:border-primary/50 transition-all duration-500 hover:shadow-glow-primary animate-fade-in">
            <CardContent className="p-6 sm:p-8 md:p-10 lg:p-12">
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-hero flex items-center justify-center animate-glow hover:scale-110 transition-transform">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-accent uppercase tracking-wider">
                  Flagship Project
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 flex flex-wrap items-center gap-2 sm:gap-3">
                <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-primary animate-glow" />
                FreakFlow
              </h2>

              <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-4 sm:mb-6">
                AI-Powered Design Generator
              </p>

              <p className="text-base sm:text-lg text-muted-foreground/90 mb-6 sm:mb-8 max-w-3xl">
                Transform your sketches into professional artwork in seconds. FreakFlow leverages cutting-edge AI technology to understand your creative vision and generate stunning, production-ready designs instantly.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="p-4 sm:p-5 rounded-lg bg-primary/5 border border-primary/20 hover:border-primary/40 hover:bg-primary/10 transition-all duration-300 hover:scale-105 hover:shadow-glow-primary group">
                  <div className="text-3xl sm:text-4xl font-bold text-primary mb-1 group-hover:scale-110 transition-transform">⚡</div>
                  <div className="text-xs sm:text-sm text-muted-foreground group-hover:text-foreground transition-colors">Instant Generation</div>
                </div>
                <div className="p-4 sm:p-5 rounded-lg bg-accent/5 border border-accent/20 hover:border-accent/40 hover:bg-accent/10 transition-all duration-300 hover:scale-105 hover:shadow-glow-cyan group">
                  <div className="text-3xl sm:text-4xl font-bold text-accent mb-1 group-hover:scale-110 transition-transform">🎨</div>
                  <div className="text-xs sm:text-sm text-muted-foreground group-hover:text-foreground transition-colors">Professional Quality</div>
                </div>
                <div className="p-4 sm:p-5 rounded-lg bg-accent-magenta/5 border border-accent-magenta/20 hover:border-accent-magenta/40 hover:bg-accent-magenta/10 transition-all duration-300 hover:scale-105 hover:shadow-glow-primary group">
                  <div className="text-3xl sm:text-4xl font-bold text-accent-magenta mb-1 group-hover:scale-110 transition-transform">🚀</div>
                  <div className="text-xs sm:text-sm text-muted-foreground group-hover:text-foreground transition-colors">Sketch to Art</div>
                </div>
              </div>

              <Button variant="hero" size="lg" className="group w-full sm:w-auto hover:scale-105 transition-all">
                Try FreakFlow Now
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
