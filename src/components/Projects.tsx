import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Code, Smartphone, Brain, Gamepad2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from '@/lib/supabase';
import { useFeaturedProjects } from '@/hooks/useData';
import type { LucideIcon } from "lucide-react";

type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  iconKey: string;
  tags: string[];
  year: string;
  projectUrl?: string | null;
};

const iconMap: Record<string, LucideIcon> = { Brain, Smartphone, Gamepad2, Code };

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const IconComponent = iconMap[project.iconKey] || Code;
  return (
    <Card
      className="group overflow-hidden bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-500 hover:shadow-glow-primary hover:-translate-y-2 animate-fade-in"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="relative overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-48 sm:h-56 object-cover transition-all duration-700 group-hover:scale-125 group-hover:rotate-2"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-4">
          {project.projectUrl ? (
            <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="hero" size="sm" className="gap-2 hover:scale-110 transition-transform">
                View Project <ExternalLink className="w-4 h-4" />
              </Button>
            </a>
          ) : (
            <Button variant="hero" size="sm" className="gap-2 hover:scale-110 transition-transform" disabled>
              View Project <ExternalLink className="w-4 h-4" />
            </Button>
          )}
        </div>
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-primary/90 backdrop-blur-sm p-2 rounded-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-glow-primary">
          <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
        </div>
      </div>
      <div className="p-5 sm:p-6">
        <div className="text-xs sm:text-sm text-primary font-semibold mb-2 uppercase tracking-wider">
          {project.category}
        </div>
        <h3 className="text-lg sm:text-xl font-bold mb-3 group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag, tagIndex) => (
            <span
              key={tagIndex}
              className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 hover:scale-105 transition-all cursor-default"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}

export const Projects = () => {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const featuredQuery = useFeaturedProjects(6);

  useEffect(() => {
    if (featuredQuery.isSuccess) {
      setProjects(featuredQuery.data);
      setError(null);
    }
    if (featuredQuery.isError) {
      setError('Failed to load projects');
    }
  }, [featuredQuery.isSuccess, featuredQuery.isError, featuredQuery.data]);
  return (
    <section id="projects" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 blur-3xl" />
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-12 sm:mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-hero">
            Featured Projects
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-4">
            Explore our latest innovations and success stories
          </p>
          <div className="mt-8">
            <Link to="/projects">
              <Button variant="outline" size="lg" className="gap-2 hover:scale-105 transition-transform">
                View All Projects <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {error && <div className="text-center text-sm text-destructive mb-4">{error}</div>}
        {!projects && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 rounded-lg animate-pulse bg-muted/30" />
            ))}
          </div>
        )}
        {projects && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {projects.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
