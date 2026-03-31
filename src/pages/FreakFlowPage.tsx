import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { FreakFlow } from "@/components/FreakFlow";
import Footer from "@/components/Footer";

export default function FreakFlowPage() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>FreakFlow – CF TechLab</title>
        <meta name="description" content="Discover FreakFlow: our advanced creative flow and automation system." />
        {import.meta.env.VITE_SITE_URL && (
          <link rel="canonical" href={`${import.meta.env.VITE_SITE_URL}/freakflow`} />
        )}
        <meta property="og:title" content="FreakFlow – CF TechLab" />
        <meta property="og:description" content="A system for creative automation and flow." />
        {import.meta.env.VITE_SITE_URL && (
          <meta property="og:url" content={`${import.meta.env.VITE_SITE_URL}/freakflow`} />
        )}
        <meta name="twitter:card" content="summary" />
      </Helmet>
      <Header />
      <main className="pt-20">
        <FreakFlow />
      </main>
      <Footer />
    </div>
  );
}