'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MapPin, ArrowRight, SearchX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { apiService, City } from '@/lib/api';

// New Optimized Hero Components
import Hero from './hero/Hero';


interface HeroSectionProps {
  onCitySelect: (city: City | null) => void;
}

const HeroSection = ({ onCitySelect }: HeroSectionProps) => {
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initial Data Fetch
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const citiesData = await apiService.getCities();
        setCities(citiesData || []);
      } catch (error) {
        console.error('❌ Failed to fetch cities:', error);
        setCities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  // Filter cities based on search - limit to 5 initially, show all when searching
  useEffect(() => {
    if (searchQuery.trim() === "") {
      // Show only first 5 cities when not searching
      setFilteredCities(cities.slice(0, 3));
    } else {
      // Show all matching cities when user is typing
      const filtered = cities.filter(city =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCities(filtered);
    }
  }, [searchQuery, cities]);

  // Set Default "Ayodhya" if available (only once on initial load)
  useEffect(() => {
    if (cities.length > 0 && !selectedCity) {
      const defaultCity = cities.find(c => c.name.toLowerCase() === "ayodhya");
      if (defaultCity) {
        setSelectedCity(defaultCity);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cities]); // Only run when cities are loaded

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setSearchQuery(""); // Clear search query when city is selected
    setIsDropdownOpen(false);
    onCitySelect(city);
  };

  return (
    <Hero>
      <div className="flex flex-col items-center justify-center text-center max-w-6xl mx-auto px-4 z-30 relative">

        {/* Content appearing AFTER typing (handled by Hero wrapper) */}
        {/* Content appearing AFTER typing (handled by Hero wrapper) */}
        <div className="flex flex-col items-center space-y-8 w-full mt-4">
          {/* Subtext - Premium Gray & 1 Line */}
          <p className="text-lg md:text-xl max-w-3xl font-bold tracking-wide bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 bg-clip-text text-transparent drop-shadow-sm">
            Your personalized journey to India&apos;s divine essence.
          </p>

          {/* City Search Combo Box - Premium Redesign */}
          <div className="relative w-full max-w-lg mx-auto font-sans">
            <div className="relative group z-50">
              {/* Input Wrapper with Gradient Halo Effect */}
              <div className="absolute -inset-[1px] bg-gradient-to-r from-orange-400 via-pink-500 to-blue-500 rounded-full opacity-30 group-hover:opacity-100 transition duration-500 blur-sm"></div>

              <div className="relative bg-white/90 backdrop-blur-2xl rounded-full shadow-2xl shadow-gray-200/50 flex items-center">
                <div className="pl-6 text-orange-500">
                  <MapPin className="w-5 h-5" />
                </div>

                <input
                  type="text"
                  value={searchQuery || (selectedCity ? selectedCity.name : "")}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchQuery(value);
                    if (value !== (selectedCity?.name || "")) {
                      setSelectedCity(null);
                    }
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  placeholder="Search destinations (e.g. Ayodhya)"
                  className="w-full bg-transparent border-none outline-none focus:outline-none ring-0 focus:ring-0 py-4 px-4 text-gray-800 placeholder:text-gray-400 text-base font-medium leading-relaxed tracking-wide"
                  disabled={!mounted || loading}
                />

                <div className="pr-6">
                  {!mounted || loading ? (
                    <div className="w-5 h-5 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
                  ) : (
                    <ChevronDown className={cn("w-5 h-5 text-gray-400 transition-transform duration-300", isDropdownOpen ? "rotate-180" : "rotate-0")} />
                  )}
                </div>
              </div>

              {/* Search Results Dropdown - Professional Card Style */}
              <AnimatePresence>
                {mounted && isDropdownOpen && !loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 mt-3 p-2 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden z-50"
                  >
                    <div className="max-h-72 overflow-y-auto pr-1 custom-scrollbar">
                      {filteredCities.length > 0 ? (
                        <>
                          <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            {searchQuery ? 'SearchResults' : 'Suggested Destinations'}
                          </div>
                          {filteredCities.map((city) => (
                            <button
                              key={city.id}
                              onClick={() => handleCitySelect(city)}
                              className="w-full p-2.5 rounded-xl hover:bg-orange-50/50 transition-all flex items-center justify-between group text-left"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                  <MapPin className="w-4 h-4" />
                                </div>
                                <span className="text-gray-700 font-medium group-hover:text-gray-900">
                                  {city.name}
                                </span>
                              </div>
                              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-orange-500 -translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all" />
                            </button>
                          ))}
                        </>
                      ) : (
                        <div className="py-8 text-center">
                          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 mb-3">
                            <SearchX className="w-6 h-6 text-gray-400" />
                          </div>
                          <p className="text-gray-900 font-medium">No destinations found</p>
                          <p className="text-sm text-gray-500 mt-1">We couldn&apos;t find &quot;{searchQuery}&quot;</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Background Overlay to close dropdown */}
            {mounted && isDropdownOpen && (
              <div
                className="fixed inset-0 z-40 bg-transparent"
                onClick={() => setIsDropdownOpen(false)}
              />
            )}
          </div>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "group relative overflow-hidden rounded-full px-10 py-4 font-bold text-lg transition-all duration-500",
              "bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40"
            )}
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
            <span className="relative flex items-center space-x-2">
              <span className="tracking-wide">Begin The Journey</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.button>
        </div>
      </div>
    </Hero>
  );
};

export default HeroSection;