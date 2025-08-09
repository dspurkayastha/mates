"use client";

import { Navigation } from "../components/landing/Navigation.jsx";
import { HeroSection } from "../components/landing/HeroSection.jsx";
import { StatsSection } from "../components/landing/StatsSection.jsx";
import { ChaosToClarity } from "../components/landing/ChaosToClarity.jsx";
import { FeatureHighlights } from "../components/landing/FeatureHighlights.jsx";
import { BeforeAfterSection } from "../components/landing/BeforeAfterSection.jsx";
import { FeaturesSection } from "../components/landing/FeaturesSection.jsx";
import { LifestyleConnection } from "../components/landing/LifestyleConnection.jsx";
import { HowItWorksSection } from "../components/landing/HowItWorksSection.jsx";
import { TestimonialsSection } from "../components/landing/TestimonialsSection.jsx";
import { CallToActionSection } from "../components/landing/CallToActionSection.jsx";
import { FaqSection } from "../components/landing/FaqSection.jsx";
import { Footer } from "../components/landing/Footer.jsx";
import { GlobalStyles } from "../components/landing/GlobalStyles.jsx";

export default function MatesLanding() {
  return (
    <div className="min-h-screen bg-white font-inter overflow-x-hidden">
      <Navigation />
      <main>
        <HeroSection />
        <StatsSection />
        <ChaosToClarity />
        <FeatureHighlights />
        <BeforeAfterSection />
        <FeaturesSection />
        <LifestyleConnection />
        <HowItWorksSection />
        <TestimonialsSection />
        <CallToActionSection />
        <FaqSection />
      </main>
      <Footer />
      <GlobalStyles />
    </div>
  );
}