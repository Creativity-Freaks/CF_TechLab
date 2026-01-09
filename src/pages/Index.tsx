import { Suspense, lazy } from "react";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { About } from "@/components/About";
import { CTA } from "@/components/CTA";
import Footer from "@/components/Footer";

// Lazy-load below-the-fold sections to reduce initial bundle/TTI
const Projects = lazy(() => import("@/components/Projects"));
const FreakFlow = lazy(() => import("@/components/FreakFlow"));
const Testimonials = lazy(() => import("@/components/Testimonials"));
const Partners = lazy(() => import("@/components/Partners"));
const FAQ = lazy(() => import("@/components/FAQ"));
const Contact = lazy(() => import("@/components/Contact"));
// Home (landing) page aggregates overview sections only; no hash scrolling needed now.

const Index = () => {
  const siteUrl = import.meta.env.VITE_SITE_URL || "";
  const title = "CF TechLab - Technology & Innovation";
  const description = "CF TechLab is the technology and innovation arm of Creativity Freaks, creating AI-driven design platforms, intelligent automation tools, and futuristic digital experiences.";

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        {siteUrl && <link rel="canonical" href={siteUrl} />}
        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        {siteUrl && <meta property="og:url" content={siteUrl} />}
        <meta property="og:type" content="website" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
      </Helmet>

      <Header />
      <Hero />
      <About />
      <Services />

      <Suspense fallback={<div className="container py-12">Loading…</div>}>
        <Projects />
        <FreakFlow />
        <Testimonials />
        <Partners />
        <FAQ />
        <Contact />
      </Suspense>

      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
