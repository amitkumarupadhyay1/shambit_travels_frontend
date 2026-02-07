'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import ServicesSection from '@/components/home/ServicesSection';
import FeaturedCitiesSection from '@/components/home/FeaturedCitiesSection';
import FeaturedPackagesSection from '@/components/home/FeaturedPackagesSection';
import LatestArticlesSection from '@/components/home/LatestArticlesSection';
import BackendStatus from '@/components/common/BackendStatus';
import { City, apiService } from '@/lib/api';

export default function Home() {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [isLoadingDefaultCity, setIsLoadingDefaultCity] = useState(true);

  // Load default city on mount
  useEffect(() => {
    const loadDefaultCity = async () => {
      try {
        const cities = await apiService.getCities();
        if (cities.length > 0) {
          // Try to find Ayodhya as default, otherwise use first city
          const defaultCity = cities.find(c => c.name.toLowerCase() === "ayodhya") || cities[0];
          setSelectedCity(defaultCity);
        }
      } catch (error) {
        console.error('Failed to load default city:', error);
      } finally {
        setIsLoadingDefaultCity(false);
      }
    };

    loadDefaultCity();
  }, []);

  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section with City Selector */}
      <HeroSection 
        onCitySelect={setSelectedCity} 
        initialCity={selectedCity}
        isLoadingDefaultCity={isLoadingDefaultCity}
      />
      
      {/* How It Works */}
      <HowItWorksSection />
      
      {/* Services */}
      <ServicesSection />
      
      {/* Featured Cities (context-aware) - Only render after default city is loaded */}
      {!isLoadingDefaultCity && (
        <>
          <FeaturedCitiesSection selectedCity={selectedCity} />
          
          {/* Featured Packages (context-aware) */}
          <FeaturedPackagesSection selectedCity={selectedCity} />
          
          {/* Latest Articles (context-aware) */}
          <LatestArticlesSection selectedCity={selectedCity} />
        </>
      )}
      
      <Footer />
      
      {/* Backend Status Indicator (development only) */}
      <BackendStatus />
    </main>
  );
}
