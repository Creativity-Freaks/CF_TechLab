import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const routeTo = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const goHome = () => {
    if (location.pathname !== '/') {
      navigate('/');
      // Ensure scroll after route change
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 30);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo (acts as Home) */}
          <button
            onClick={goHome}
            className="flex items-center gap-2 flex-shrink-0 group"
            aria-label="Go to top / Home"
          >
            <img
              src="/cftech.png"
              alt="CF TechLab logo"
              className="h-8 w-8 rounded-md object-contain ring-1 ring-border/40 group-hover:ring-primary/60 transition-colors"
              loading="lazy"
            />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-hero">
              CF TechLab
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={goHome} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Home</button>
            <button onClick={() => routeTo('/about')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</button>
            <button onClick={() => routeTo('/services')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Services</button>
            <button onClick={() => routeTo('/projects')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Projects</button>
            <Button onClick={() => navigate('/contact')} variant="hero" size="sm">Contact Us</Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50">
            <div className="flex flex-col gap-4">
              <button onClick={goHome} className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left">Home</button>
              <button onClick={() => routeTo('/about')} className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left">About</button>
              <button onClick={() => routeTo('/services')} className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left">Services</button>
              <button onClick={() => routeTo('/projects')} className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left">Projects</button>
              <Button onClick={() => navigate('/contact')} variant="hero" size="sm" className="w-full">Contact Us</Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
