import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import { TestimonialSubmit } from '@/components/TestimonialSubmit';

export default function TestimonialSubmitPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Submit Testimonial – CF TechLab</title>
        <meta name="description" content="Share your experience with CF TechLab. Submit a testimonial." />
        {import.meta.env.VITE_SITE_URL && (
          <link rel="canonical" href={`${import.meta.env.VITE_SITE_URL}/submit-testimonial`} />
        )}
        <meta property="og:title" content="Submit Testimonial – CF TechLab" />
        <meta property="og:description" content="Share your experience with our team." />
        {import.meta.env.VITE_SITE_URL && (
          <meta property="og:url" content={`${import.meta.env.VITE_SITE_URL}/submit-testimonial`} />
        )}
        <meta name="twitter:card" content="summary" />
      </Helmet>
      <Header />
      <main className="flex-1">
        <TestimonialSubmit />
      </main>
      <Footer />
    </div>
  );
}
