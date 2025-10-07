import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQ = () => {
  return (
    <section id="faq" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-hero">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about CF TechLab and our services
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="border border-border/50 rounded-lg px-6 bg-card hover:border-primary/30 transition-colors animate-fade-in">
              <AccordionTrigger className="text-left hover:text-primary transition-colors">
                What is CF TechLab?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                CF TechLab is the technology and innovation arm of Creativity Freaks. We specialize in creating 
                AI-driven design platforms, intelligent automation tools, interactive applications, and futuristic 
                digital experiences that merge creativity with cutting-edge technology.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border border-border/50 rounded-lg px-6 bg-card hover:border-primary/30 transition-colors animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <AccordionTrigger className="text-left hover:text-primary transition-colors">
                What services does CF TechLab offer?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                We offer five core services: AI Art & Design Tools, Web & Mobile App Development, AR/VR & Game Design, 
                Automation Systems, and Smart Creative Software. Each service is designed to push the boundaries of 
                technology and creativity.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border border-border/50 rounded-lg px-6 bg-card hover:border-primary/30 transition-colors animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <AccordionTrigger className="text-left hover:text-primary transition-colors">
                What is FreakFlow?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                FreakFlow is our flagship AI-powered design generator that transforms rough sketches into professional 
                art in seconds. It uses advanced AI models to understand your creative intent and generate stunning 
                designs instantly.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border border-border/50 rounded-lg px-6 bg-card hover:border-primary/30 transition-colors animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <AccordionTrigger className="text-left hover:text-primary transition-colors">
                How long does a typical project take?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Project timelines vary based on complexity and scope. A simple automation tool might take 2-4 weeks, 
                while a comprehensive web application could take 2-4 months. We'll provide a detailed timeline during 
                our initial consultation.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border border-border/50 rounded-lg px-6 bg-card hover:border-primary/30 transition-colors animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <AccordionTrigger className="text-left hover:text-primary transition-colors">
                Do you work with startups and small businesses?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Absolutely! We work with clients of all sizes, from startups to enterprise companies. We believe great 
                technology should be accessible to everyone, and we offer flexible solutions tailored to your budget 
                and needs.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border border-border/50 rounded-lg px-6 bg-card hover:border-primary/30 transition-colors animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <AccordionTrigger className="text-left hover:text-primary transition-colors">
                What technologies do you specialize in?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                We specialize in cutting-edge technologies including AI/ML, AR/VR, React, Node.js, Python, Unity, 
                and various automation frameworks. We stay current with the latest tech trends to provide the best 
                solutions for our clients.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
};
