import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Contact } from "@/components/Contact";
import Footer from "@/components/Footer";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Contact – CF TechLab</title>
        <meta name="description" content="Get in touch with CF TechLab for collaborations, consultations, and support." />
        {import.meta.env.VITE_SITE_URL && (
          <link rel="canonical" href={`${import.meta.env.VITE_SITE_URL}/contact`} />
        )}
        <meta property="og:title" content="Contact – CF TechLab" />
        <meta property="og:description" content="Reach out to our team." />
        {import.meta.env.VITE_SITE_URL && (
          <meta property="og:url" content={`${import.meta.env.VITE_SITE_URL}/contact`} />
        )}
        <meta name="twitter:card" content="summary" />
      </Helmet>
      <Header />
      <main className="pt-20">
        <Contact />
      </main>
      <Footer />
    </div>
  );
}