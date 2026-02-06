import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import SecurityOverlaySection from "./components/SecurityOverlaySection";
import SplitScrollSection from "./components/SplitScrollSection";
import ProblemSolutionSection from "./components/ProblemSolutionSection";
import WorkflowJourneySection from "./components/WorkflowJourneySection";
import TestimonialsSection from "./components/TestimonialsSection";
import StatsSection from "./components/StatsSection";
import CTASection from "./components/CTASection";
import NextPageArrow from "./components/NextPageArrow";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="relative">
      <Navbar />
      <div className="sticky top-0 h-screen z-0">
        <HeroSection />
      </div>
      <SecurityOverlaySection />
      <SplitScrollSection />
      <WorkflowJourneySection />
      <ProblemSolutionSection />
      <StatsSection />
      <TestimonialsSection />
      <CTASection />
      <NextPageArrow />
      <Footer />
    </div>
  );
}
