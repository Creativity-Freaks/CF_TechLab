import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { ExternalLink, Code, Smartphone, Brain, Gamepad2, Search, Filter } from "lucide-react";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
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

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const qs = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
        if (search.trim()) qs.set('search', search.trim());
        if (category.trim()) qs.set('category', category.trim());
        const res = await fetch(`/api/content/projects?${qs.toString()}`, { signal: controller.signal });
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setProjects(data.items as Project[]);
          setTotalPages(data.totalPages || 1);
        }
      } catch (e) {
        if (!cancelled) {
          setError('Failed to load projects');
          setProjects(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; controller.abort(); };
  }, [page, pageSize, search, category]);
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 blur-3xl" />
          
          <div className="container mx-auto relative z-10">
            <div className="text-center mb-16 animate-fade-in">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-hero">
                Our Projects
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
                Explore our portfolio of innovative solutions and success stories
              </p>
            </div>

            <div className="max-w-3xl mx-auto mb-10 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <input
                    value={search}
                    onChange={e => { setPage(1); setSearch(e.target.value); }}
                    placeholder="Search projects..."
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                </div>
                <div className="relative w-full sm:w-56">
                  <input
                    value={category}
                    onChange={e => { setPage(1); setCategory(e.target.value); }}
                    placeholder="Filter by category"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  <Filter className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
              {error && <div className="text-center text-sm text-destructive">{error}</div>}
            </div>
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="h-72 rounded-lg animate-pulse bg-muted/30" />
                ))}
              </div>
            )}
            {projects && !loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {projects.map((project, index) => {
                  const IconComponent = project.iconKey ? iconMap[project.iconKey] || Code : Code;
                  return (
                    <Card
                      key={project.id}
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
                        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-primary">
                          {project.year}
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
                })}
              </div>
            )}
            {projects && !loading && totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-4">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="px-4 py-2 text-sm rounded-md border border-border disabled:opacity-40 hover:bg-primary/10 transition"
                >Prev</button>
                <span className="text-sm text-muted-foreground">Page {page} / {totalPages}</span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className="px-4 py-2 text-sm rounded-md border border-border disabled:opacity-40 hover:bg-primary/10 transition"
                >Next</button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
