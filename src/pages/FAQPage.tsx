import { Header } from "@/components/Header";
import { FAQ } from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}