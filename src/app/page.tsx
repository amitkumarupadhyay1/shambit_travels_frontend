'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import ServicesSection from '@/components/home/ServicesSection';
import FeaturedCitiesSection from '@/components/home/FeaturedCitiesSection';
import FeaturedPackagesSection from '@/components/home/FeaturedPackagesSection';
import LatestArticlesSection from '@/components/home/LatestArticlesSection';
import BackendStatus from '@/components/common/BackendStatus';
import { City } from '@/lib/api';

export default function Home() {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section with City Selector */}
      <HeroSection onCitySelect={setSelectedCity} />
      
      {/* How It Works */}
      <HowItWorksSection />
      
      {/* Services */}
      <ServicesSection />
      
      {/* Featured Cities (context-aware) */}
      <FeaturedCitiesSection selectedCity={selectedCity} />
      
      {/* Featured Packages (context-aware) */}
      <FeaturedPackagesSection selectedCity={selectedCity} />
      
      {/* Latest Articles (context-aware) */}
      <LatestArticlesSection selectedCity={selectedCity} />
      
      <Footer />
      
      {/* Backend Status Indicator (development only) */}
      <BackendStatus />
    </main>
  );
}
