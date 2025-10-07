import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code2, Lightbulb, Rocket, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const About = () => {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* About: soft horizontal gradient + faint dot pattern */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-0 bg-[linear-gradient(90deg,hsl(var(--background))_0%,hsl(var(--background))/0.97_35%,hsl(var(--background))/0.94_65%,hsl(var(--background))_100%)]" />
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-0 opacity-[0.12] bg-[radial-gradient(circle_at_8%_15%,hsl(var(--primary))/0.35,transparent_55%),radial-gradient(circle_at_92%_85%,hsl(var(--accent-cyan))/0.30,transparent_55%),radial-gradient(circle_at_50%_50%,hsl(var(--accent-magenta))/0.18,transparent_60%)] mix-blend-lighten" />
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-0 opacity-[0.18] bg-[radial-gradient(circle,#fff_1px,transparent_1.5px)] bg-[size:22px_22px] [mask-image:radial-gradient(circle_at_50%_50%,#000_65%,transparent_100%)]" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-hero">
            About CF TechLab
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            As the technology and innovation arm of <span className="text-primary font-semibold">Creativity Freaks</span>, 
            CF TechLab focuses on pushing the boundaries of what's possible when creativity meets cutting-edge technology. 
            We create AI-driven platforms, intelligent automation tools, interactive applications, and futuristic digital 
            experiences that transform ideas into reality.
          </p>
          <Link to="/about">
            <Button variant="outline" size="lg" className="gap-2 hover:scale-105 transition-transform">
              Explore More <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto relative z-10">
          <Card className="group border-border/50 bg-card hover:border-accent/50 transition-all duration-300 hover:shadow-glow-primary hover:scale-105 animate-fade-in">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Code2 className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Tech Excellence</h3>
              <p className="text-muted-foreground text-sm">
                Leveraging the latest in AI, AR/VR, and automation to deliver cutting-edge solutions
              </p>
            </CardContent>
          </Card>

          <Card className="group border-border/50 bg-card hover:border-accent/50 transition-all duration-300 hover:shadow-glow-cyan hover:scale-105 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-accent-cyan to-accent flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Lightbulb className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors">Creative Innovation</h3>
              <p className="text-muted-foreground text-sm">
                Merging artistic vision with technological prowess to create unique experiences
              </p>
            </CardContent>
          </Card>

          <Card className="group border-border/50 bg-card hover:border-accent/50 transition-all duration-300 hover:shadow-glow-primary hover:scale-105 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-accent-magenta to-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Rocket className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Future-Forward</h3>
              <p className="text-muted-foreground text-sm">
                Building tomorrow's digital experiences with today's most advanced technologies
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
