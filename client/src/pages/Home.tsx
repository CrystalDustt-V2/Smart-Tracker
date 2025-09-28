import { HeroSection } from "@/components/HeroSection";
import { Navigation } from "@/components/Navigation";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
    </div>
  );
}