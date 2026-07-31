import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { CtaSection } from "@/components/CtaSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#09090B] text-zinc-100 selection:bg-purple-500/30 selection:text-purple-200">
      {/* Navigation Header */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section with interactive UI mockup */}
        <HeroSection />

        {/* 6 Feature Cards */}
        <FeaturesSection />

        {/* 4-Step Timeline */}
        <HowItWorksSection />

        {/* 3 Business Testimonial Cards */}
        <TestimonialsSection />

        {/* Final CTA Card */}
        <CtaSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
