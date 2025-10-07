import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Projects } from "@/components/Projects";
import { FreakFlow } from "@/components/FreakFlow";
import { About } from "@/components/About";
import { Testimonials } from "@/components/Testimonials";
import { Partners } from "@/components/Partners";
import { FAQ } from "@/components/FAQ";
import { Contact } from "@/components/Contact";
import { CTA } from "@/components/CTA";
import Footer from "@/components/Footer";
// Home (landing) page aggregates overview sections only; no hash scrolling needed now.

const Index = () => {

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <About />
      <Services />
    <Projects />
    <FreakFlow />
    <Testimonials />
    <Partners />
    <FAQ />
    <Contact />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
