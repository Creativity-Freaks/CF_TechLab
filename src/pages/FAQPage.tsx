import { Helmet } from "react-helmet-async";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { FAQ } from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>FAQ – CF TechLab</title>
        <meta name="description" content="Frequently asked questions about CF TechLab services and processes." />
        {import.meta.env.VITE_SITE_URL && (
          <link rel="canonical" href={`${import.meta.env.VITE_SITE_URL}/faq`} />
        )}
        <meta property="og:title" content="FAQ – CF TechLab" />
        <meta property="og:description" content="Answers to common questions about our work." />
        {import.meta.env.VITE_SITE_URL && (
          <meta property="og:url" content={`${import.meta.env.VITE_SITE_URL}/faq`} />
        )}
        <meta name="twitter:card" content="summary" />
      </Helmet>
      <Helmet>
        <title>FAQ – CF TechLab</title>
        <meta name="description" content="Frequently asked questions about CF TechLab services and process." />
        {import.meta.env.VITE_SITE_URL && (
          <link rel="canonical" href={`${import.meta.env.VITE_SITE_URL}/faq`} />
        )}
        <meta property="og:title" content="FAQ – CF TechLab" />
        <meta property="og:description" content="Answers to common questions." />
      </Helmet>
      <Header />
      <main className="pt-20">
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}