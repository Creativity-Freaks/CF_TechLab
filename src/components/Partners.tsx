import { Sparkles } from "lucide-react";

const partners = [
  { name: "TechCorp", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=100&fit=crop" },
  { name: "InnovateLab", logo: "https://images.unsplash.com/photo-1599305446868-59e861c82f18?w=200&h=100&fit=crop" },
  { name: "DigitalWave", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=100&fit=crop" },
  { name: "CreativeHub", logo: "https://images.unsplash.com/photo-1599305446868-59e861c82f18?w=200&h=100&fit=crop" },
  { name: "FutureTech", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=100&fit=crop" },
  { name: "SmartSolutions", logo: "https://images.unsplash.com/photo-1599305446868-59e861c82f18?w=200&h=100&fit=crop" },
];

export const Partners = () => {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent" />
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-10 sm:mb-12 animate-fade-in">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary animate-glow" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-hero">
              Trusted By Industry Leaders
            </h2>
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary animate-glow" />
          </div>
          <p className="text-muted-foreground text-sm sm:text-base px-4">
            Partnering with innovative companies worldwide
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8 items-center">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="flex items-center justify-center p-3 sm:p-4 rounded-lg bg-card/30 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-glow-primary animate-fade-in grayscale hover:grayscale-0 hover:scale-110 hover:-translate-y-1 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-full h-12 sm:h-16 flex items-center justify-center">
                <span className="text-sm sm:text-base lg:text-lg font-semibold text-muted-foreground group-hover:text-foreground transition-colors text-center">
                  {partner.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
