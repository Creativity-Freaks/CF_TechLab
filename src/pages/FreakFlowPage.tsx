import { Header } from "@/components/Header";
import { FreakFlow } from "@/components/FreakFlow";
import Footer from "@/components/Footer";

export default function FreakFlowPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <FreakFlow />
      </main>
      <Footer />
    </div>
  );
}