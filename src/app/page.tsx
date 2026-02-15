'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import ServicesSection from '@/components/home/ServicesSection';
// Hidden sections - kept for future use
// import FeaturedCitiesSection from '@/components/home/FeaturedCitiesSection';
// import FeaturedPackagesSection from '@/components/home/FeaturedPackagesSection';
// import LatestArticlesSection from '@/components/home/LatestArticlesSection';
import BackendStatus from '@/components/common/BackendStatus';
import { City, apiService } from '@/lib/api';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [isLoadingDefaultCity, setIsLoadingDefaultCity] = useState(true);
  const [isLoadingCityContent, setIsLoadingCityContent] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Handle city selection with loading animation
  const handleCitySelect = (city: City | null) => {
    if (city?.id === selectedCity?.id) return; // Don't reload if same city
    
    // Cancel previous loading timeout
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }

    // Cancel any pending API requests
    apiService.cancelAllRequests();
    
    setIsLoadingCityContent(true);
    setSelectedCity(city);
    
    // Set minimum loading time for smooth UX (but will wait for actual API calls)
    loadingTimeoutRef.current = setTimeout(() => {
      setIsLoadingCityContent(false);
    }, 1500);
  };

  // Scroll to content sections and trigger loading
  const scrollToContent = () => {
    if (!selectedCity) return;

    // Show loading state
    setIsLoadingCityContent(true);

    // Scroll to content
    contentRef.current?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });

    // Hide loading after scroll completes
    setTimeout(() => {
      setIsLoadingCityContent(false);
    }, 1000);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      apiService.cancelAllRequests();
    };
  }, []);

  return (
    <main className="min-h-screen relative bg-white">
      <Header />
      
      {/* Hero Section with City Selector */}
      <HeroSection 
        onCitySelect={handleCitySelect} 
        initialCity={selectedCity}
        isLoadingDefaultCity={isLoadingDefaultCity}
        onExploreClick={scrollToContent}
        isExploreLoading={isLoadingCityContent}
      />
      
      {/* How It Works - Optimized spacing and responsive design */}
      <div className="w-full">
        <HowItWorksSection />
      </div>
      
      {/* Services - Optimized spacing and responsive design */}
      <div className="w-full">
        <ServicesSection />
      </div>
      
      {/* Content Sections with Loading Overlay */}
      <div ref={contentRef} className="relative">
        {/* Loading Overlay */}
        <AnimatePresence>
          {isLoadingCityContent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm"
            >
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
                <p className="text-lg font-semibold text-gray-800">
                  Loading {selectedCity?.name} content...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Featured Cities, Packages, and Articles - HIDDEN PER REQUIREMENTS */}
        {/* Keep components for future use - DO NOT DELETE */}
        {/* These sections are commented out to create a cleaner, more focused homepage */}
        {/* that drives users to take action through the hero section */}
        {/* 
        {!isLoadingDefaultCity && (
          <>
            <FeaturedCitiesSection selectedCity={selectedCity} key={`cities-${selectedCity?.id}`} />
            <FeaturedPackagesSection selectedCity={selectedCity} key={`packages-${selectedCity?.id}`} />
            <LatestArticlesSection selectedCity={selectedCity} key={`articles-${selectedCity?.id}`} />
          </>
        )}
        */}
      </div>
      
      <Footer />
      
      {/* Backend Status Indicator (development only) */}
      <BackendStatus />
    </main>
  );
}
