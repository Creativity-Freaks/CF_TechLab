import { Helmet } from "react-helmet-async";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Lightbulb, Users, Rocket, Award, Target, Zap } from "lucide-react";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { supabase } from '@/lib/supabase';

const values = [
  {
    icon: Lightbulb,
    title: "Tech Excellence",
    description: "We leverage cutting-edge technologies to build robust, scalable solutions that stand the test of time.",
  },
  {
    icon: Users,
    title: "Creative Innovation",
    description: "Innovation is at our core. We blend creativity with technology to deliver unique solutions.",
  },
  {
    icon: Rocket,
    title: "Future-Forward",
    description: "We don't just adapt to the future, we build it. Our solutions are designed for tomorrow's challenges.",
  },
];

// Static baseline numbers for non-dynamic metrics; project count fetched from API.
const baseAchievements = [
  { icon: Award, label: "Projects Completed", number: "?" },
  { icon: Users, label: "Happy Clients", number: "30+" },
  { icon: Target, label: "Success Rate", number: "95%" },
  { icon: Zap, label: "Years Experience", number: "5+" },
];

export default function AboutPage() {
  const [projectCount, setProjectCount] = useState<number | null>(null);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [projectError, setProjectError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchProjectCount() {
      try {
        setLoadingProjects(true);
        setProjectError(null);
        if (!supabase) throw new Error('not_configured');
        const { count, error } = await supabase
          .from('projects')
          .select('id', { count: 'exact', head: true });
        if (error) throw error;
        if (!cancelled && typeof count === 'number') setProjectCount(count);
      } catch (e) {
        if (!cancelled) setProjectError('Could not load');
      } finally {
        if (!cancelled) setLoadingProjects(false);
      }
    }
    fetchProjectCount();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>About CF TechLab</title>
        <meta name="description" content="Learn about CF TechLab's mission, values, and achievements in AI, AR/VR, automation, and future-forward digital solutions." />
        {import.meta.env.VITE_SITE_URL && (
          <link rel="canonical" href={`${import.meta.env.VITE_SITE_URL}/about`} />
        )}
        <meta property="og:title" content="About CF TechLab" />
        <meta property="og:description" content="Our mission is to empower creativity with cutting-edge technology." />
        {import.meta.env.VITE_SITE_URL && (
          <meta property="og:url" content={`${import.meta.env.VITE_SITE_URL}/about`} />
        )}
        <meta name="twitter:card" content="summary" />
      </Helmet>
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 blur-3xl" />
          
          <div className="container mx-auto relative z-10">
            <div className="text-center max-w-4xl mx-auto mb-16 animate-fade-in">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-hero">
                About CF TechLab
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8">
                CF TechLab is the technology and innovation arm of Creativity Freaks, 
                where we transform visionary ideas into cutting-edge digital solutions. 
                We specialize in AI-powered tools, immersive AR/VR experiences, intelligent 
                automation, and next-generation web and mobile applications.
              </p>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Our mission is to empower businesses and creators with technology that doesn't 
                just solve problems—it inspires possibilities. We're not just building software; 
                we're engineering the future of creativity.
              </p>
            </div>

            {/* Core Values */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-20">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Card
                    key={index}
                    className="group p-6 sm:p-8 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-glow-primary hover:scale-105 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary to-primary-glow p-3 mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <Icon className="w-full h-full text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </Card>
                );
              })}
            </div>

            {/* Achievements */}
            <div className="bg-card/30 backdrop-blur-sm border border-primary/20 rounded-2xl p-8 sm:p-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-hero">
                Our Journey
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {baseAchievements.map((ach, index) => {
                  const Icon = ach.icon;
                  let displayNumber = ach.number;
                  if (ach.label === 'Projects Completed') {
                    if (loadingProjects && projectCount === null) displayNumber = '...';
                    else if (projectCount !== null) displayNumber = projectCount.toString();
                    else if (projectError) displayNumber = '—';
                  }
                  return (
                    <div
                      key={ach.label}
                      className="text-center group animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary to-accent-cyan p-4 mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-full h-full text-primary-foreground" />
                      </div>
                      <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                        {displayNumber}
                      </div>
                      <div className="text-sm sm:text-base text-muted-foreground">
                        {ach.label}
                      </div>
                      {ach.label === 'Projects Completed' && projectError && (
                        <div className="mt-1 text-xs text-destructive">{projectError}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
