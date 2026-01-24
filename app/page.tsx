import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import SecurityOverlaySection from "./components/SecurityOverlaySection";
import SplitScrollSection from "./components/SplitScrollSection";
import ProblemSolutionSection from "./components/ProblemSolutionSection";

export default function Home() {
  return (
    <div className="relative">
      <Navbar />
      <div className="sticky top-0 h-screen z-0">
        <HeroSection />
      </div>
      <SecurityOverlaySection />
      <SplitScrollSection />
      <ProblemSolutionSection />
    </div>
  );
}
