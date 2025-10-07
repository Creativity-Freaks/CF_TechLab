import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import { TestimonialSubmit } from '@/components/TestimonialSubmit';

export default function TestimonialSubmitPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <TestimonialSubmit />
      </main>
      <Footer />
    </div>
  );
}
