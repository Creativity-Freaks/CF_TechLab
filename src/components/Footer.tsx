import { Facebook, Instagram, Linkedin } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

export const Footer: React.FC = () => {
  return (
    <footer className="py-12 border-t border-border/50 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-4 bg-clip-text text-transparent bg-gradient-hero">
              CF TechLab
            </h3>
            <p className="text-sm text-muted-foreground">
              Engineering the Future of Creativity. <br />Powered by Creativity Freaks.
            </p>
          </div>

            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">AI Art & Design</Link></li>
                <li><Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">Web & Mobile Apps</Link></li>
                <li><Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">AR/VR & Games</Link></li>
                <li><Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">Automation</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
                <li><Link to="/projects" className="text-muted-foreground hover:text-primary transition-colors">Our Work</Link></li>
                <li><Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
                <li><Link to="/products" className="text-muted-foreground hover:text-primary transition-colors">Products</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="space-y-3 text-sm">
                <Link to="/contact" className="block text-muted-foreground hover:text-primary transition-colors">Contact</Link>
                <Link to="/submit-testimonial" className="block text-muted-foreground hover:text-primary transition-colors">Submit Testimonial</Link>
                <div className="flex items-center gap-4 pt-2" aria-label="Social media links">
                  <a href="https://instagram.com/creativity.freaks" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors"><Instagram className="h-5 w-5" /></a>
                  <a href="https://www.linkedin.com/company/creativity-freaks/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary transition-colors"><Linkedin className="h-5 w-5" /></a>
                  <a href="https://web.facebook.com/youth.creativityfreaks" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-colors"><Facebook className="h-5 w-5" /></a>
                  <a href="https://github.com/Creativity-Freaks" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-muted-foreground hover:text-primary transition-colors">
                    <svg viewBox="0 0 24 24" role="img" aria-hidden="true" className="h-5 w-5 fill-current"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.1-1.2-1.4-1.2-1.4-1-.7.1-.7.1-.7 1.1.1 1.6 1.1 1.6 1.1 1 .1.7 1.8 2.9 1.3.1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.4 1.2-3.3-.1-.3-.5-1.5.1-3 0 0 1-.3 3.4 1.2 1-.3 2-.4 3-.4s2 .1 3 .4c2.3-1.5 3.3-1.2 3.3-1.2.6 1.5.2 2.7.1 3 .8.9 1.2 2 1.2 3.3 0 4.5-2.7 5.5-5.3 5.8.4.3.8 1 .8 2v3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5Z"/></svg>
                  </a>
                </div>
              </div>
            </div>
        </div>
        <div className="pt-8 border-t border-border/50 text-center">
          <p className="text-sm text-muted-foreground">© 2025 CF TechLab. Part of Creativity Freaks. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;