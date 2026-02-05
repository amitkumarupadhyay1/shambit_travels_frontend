'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Search, MapPin } from 'lucide-react';
import { cn, sacredStyles } from '@/lib/utils';
import { apiService, City } from '@/lib/api';

interface HeroSectionProps {
  onCitySelect: (city: City | null) => void;
}

const HeroSection = ({ onCitySelect }: HeroSectionProps) => {
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        console.log('🏙️ Fetching cities...');
        const citiesData = await apiService.getCities();
        console.log('🏙️ Cities fetched:', citiesData);
        setCities(citiesData);
      } catch (error) {
        console.error('❌ Failed to fetch cities:', error);
        // Set empty array to show "no cities" state instead of loading forever
        setCities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setIsDropdownOpen(false);
    onCitySelect(city);
  };

  const clearSelection = () => {
    setSelectedCity(null);
    setIsDropdownOpen(false);
    onCitySelect(null);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center sacred-gradient overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-64 h-64 bg-yellow-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl"></div>
      </div>
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-64 h-64 bg-primary-gold/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary-saffron/10 rounded-full blur-3xl"></div>
      </div>

      <div className={cn(sacredStyles.container, "relative z-10 text-center")}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Main Heading */}
          <h1 className={cn(sacredStyles.heading.h1, "mb-6 max-w-4xl mx-auto")}>
            Discover India's{' '}
            <span className="gold-gradient bg-clip-text text-transparent">Sacred Heritage</span>
            {' '}Beyond the Journey
          </h1>

          <p className={cn(sacredStyles.text.body, "mb-12 max-w-2xl mx-auto text-gray-600")}>
            From ancient temples to spiritual experiences, we craft personalized journeys 
            that connect you with India's divine essence and cultural treasures.
          </p>

          {/* City Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-md mx-auto mb-8"
          >
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full bg-white rounded-2xl temple-shadow p-4 flex items-center justify-between text-left hover:shadow-lg transition-all duration-300"
                disabled={loading}
              >
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-gray-700">
                    {loading ? 'Loading cities...' : selectedCity ? selectedCity.name : 'Choose your destination'}
                  </span>
                </div>
                <ChevronDown className={cn(
                  "w-5 h-5 text-gray-400 transition-transform duration-200",
                  isDropdownOpen && "rotate-180"
                )} />
              </button>

              {/* Dropdown */}
              {isDropdownOpen && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl temple-shadow border border-gray-100 max-h-64 overflow-y-auto z-50"
                >
                  {selectedCity && (
                    <button
                      onClick={clearSelection}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 text-gray-500"
                    >
                      Clear selection
                    </button>
                  )}
                  {cities.length === 0 ? (
                    <div className="px-4 py-6 text-center text-gray-500">
                      <p className="mb-2">No cities available</p>
                      <p className="text-sm">Please make sure the backend is running</p>
                    </div>
                  ) : (
                    cities.map((city) => (
                      <button
                        key={city.id}
                        onClick={() => handleCitySelect(city)}
                        className={cn(
                          "w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors",
                          selectedCity?.id === city.id && "bg-orange-50 text-orange-600 font-medium"
                        )}
                      >
                        <div>
                          <div className="font-medium">{city.name}</div>
                          <div className="text-sm text-gray-500">{city.slug}</div>
                        </div>
                      </button>
                    ))
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <button className={cn(sacredStyles.button.primary, "text-lg px-12 py-4")}>
              Start Planning Your Journey
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;