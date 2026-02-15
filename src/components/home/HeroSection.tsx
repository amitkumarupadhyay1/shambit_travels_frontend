'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MapPin, ArrowRight, SearchX, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { City } from '@/lib/api';
import { useCitySearch } from '@/hooks/useCitySearch';

// New Optimized Hero Components
import Hero from './hero/Hero';


interface HeroSectionProps {
  onCitySelect: (city: City | null) => void;
  initialCity: City | null;
  isLoadingDefaultCity: boolean;
  onExploreClick?: () => void;
  isExploreLoading?: boolean;
}

const HeroSection = ({ 
  onCitySelect, 
  initialCity, 
  isLoadingDefaultCity, 
  onExploreClick,
  isExploreLoading = false 
}: HeroSectionProps) => {
  const {
    filteredCities,
    searchQuery,
    selectedCity,
    isDropdownOpen,
    loading,
    error,
    highlightedIndex,
    setSearchQuery,
    setSelectedCity,
    setIsDropdownOpen,
    handleCitySelect,
    handleKeyDown,
    clearSearch,
  } = useCitySearch({
    debounceMs: 300,
    maxResults: 10,
    onCitySelect: (city) => {
      onCitySelect(city);
    },
  });

  // Sync with parent's initial city
  useEffect(() => {
    if (initialCity && !selectedCity) {
      setSelectedCity(initialCity);
      setSearchQuery(initialCity.name);
    }
  }, [initialCity, selectedCity, setSelectedCity, setSearchQuery]);

  // Handle input change
  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    if (!isDropdownOpen) {
      setIsDropdownOpen(true);
    }
  };

  // Handle input focus
  const handleInputFocus = () => {
    setIsDropdownOpen(true);
  };

  // Handle clear button
  const handleClear = () => {
    clearSearch();
    onCitySelect(null);
  };

  // Loading state
  if (isLoadingDefaultCity) {
    return (
      <Hero>
        <div className="flex flex-col items-center justify-center text-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-30 relative">
          <div className="flex flex-col items-center space-y-6 sm:space-y-8 w-full mt-4">
            <p className="text-base sm:text-lg md:text-xl max-w-3xl font-bold tracking-wide bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 bg-clip-text text-transparent drop-shadow-sm px-4">
              Your personalized journey to India&apos;s divine essence.
            </p>
            <div className="relative w-full max-w-lg mx-auto font-sans px-4 sm:px-0">
              <div className="relative group z-50">
                <div className="absolute -inset-[1px] bg-gradient-to-r from-orange-400 via-pink-500 to-blue-500 rounded-full opacity-30 blur-sm"></div>
                <div className="relative bg-white/90 backdrop-blur-2xl rounded-full shadow-2xl shadow-gray-200/50 flex items-center">
                  <div className="pl-4 sm:pl-6 text-orange-500">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <input
                    type="text"
                    value={initialCity?.name || ""}
                    placeholder="Search destinations (e.g. Ayodhya)"
                    className="w-full bg-transparent border-none outline-none focus:outline-none ring-0 focus:ring-0 py-3 sm:py-4 px-3 sm:px-4 text-gray-800 placeholder:text-gray-400 text-sm sm:text-base font-medium leading-relaxed tracking-wide"
                    readOnly
                  />
                  <div className="pr-4 sm:pr-6">
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 animate-spin" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Hero>
    );
  }

  return (
    <Hero>
      <div className="flex flex-col items-center justify-center text-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-30 relative">
        <div className="flex flex-col items-center space-y-6 sm:space-y-8 w-full mt-4">
          {/* Subtext */}
          <p className="text-base sm:text-lg md:text-xl max-w-3xl font-bold tracking-wide bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 bg-clip-text text-transparent drop-shadow-sm px-4">
            Your personalized journey to India&apos;s divine essence.
          </p>

          {/* City Search Combo Box */}
          <div className="relative w-full max-w-lg mx-auto font-sans px-4 sm:px-0">
            <div className="relative group z-50">
              {/* Gradient Halo Effect */}
              <div className="absolute -inset-[1px] bg-gradient-to-r from-orange-400 via-pink-500 to-blue-500 rounded-full opacity-30 group-hover:opacity-100 transition duration-500 blur-sm"></div>

              <div className="relative bg-white/90 backdrop-blur-2xl rounded-full shadow-2xl shadow-gray-200/50 flex items-center">
                <div className="pl-4 sm:pl-6 text-orange-500">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onFocus={handleInputFocus}
                  onKeyDown={handleKeyDown}
                  placeholder="Search destinations (e.g. Ayodhya)"
                  className="w-full bg-transparent border-none outline-none focus:outline-none ring-0 focus:ring-0 py-3 sm:py-4 px-3 sm:px-4 text-gray-800 placeholder:text-gray-400 text-sm sm:text-base font-medium leading-relaxed tracking-wide"
                  disabled={loading}
                  aria-label="Search cities"
                  aria-autocomplete="list"
                  aria-controls="city-dropdown"
                  aria-expanded={isDropdownOpen}
                  role="combobox"
                />

                <div className="pr-4 sm:pr-6 flex items-center space-x-2">
                  {/* Clear Button */}
                  {searchQuery && (
                    <button
                      onClick={handleClear}
                      className="text-gray-400 hover:text-gray-600 transition-colors touch-manipulation p-1"
                      aria-label="Clear search"
                      type="button"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}

                  {/* Loading or Dropdown Icon */}
                  {loading ? (
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 animate-spin" />
                  ) : (
                    <ChevronDown 
                      className={cn(
                        "w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-transform duration-300",
                        isDropdownOpen ? "rotate-180" : "rotate-0"
                      )} 
                    />
                  )}
                </div>
              </div>

              {/* Search Results Dropdown */}
              <AnimatePresence>
                {isDropdownOpen && !loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 mt-3 p-2 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden z-50"
                    id="city-dropdown"
                    role="listbox"
                  >
                    <div className="max-h-72 overflow-y-auto pr-1 custom-scrollbar">
                      {error ? (
                        <div className="py-8 text-center">
                          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mb-3">
                            <SearchX className="w-6 h-6 text-red-400" />
                          </div>
                          <p className="text-gray-900 font-medium">Error loading cities</p>
                          <p className="text-sm text-gray-500 mt-1">{error}</p>
                        </div>
                      ) : filteredCities.length > 0 ? (
                        <>
                          <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            {searchQuery ? 'Search Results' : 'Suggested Destinations'}
                          </div>
                          {filteredCities.map((city, index) => (
                            <button
                              key={city.id}
                              onClick={() => handleCitySelect(city)}
                              className={cn(
                                "w-full p-2.5 rounded-xl transition-all flex items-center justify-between group text-left",
                                highlightedIndex === index
                                  ? "bg-orange-50 ring-2 ring-orange-200"
                                  : "hover:bg-orange-50/50"
                              )}
                              role="option"
                              aria-selected={highlightedIndex === index}
                              type="button"
                            >
                              <div className="flex items-center space-x-3">
                                <div className={cn(
                                  "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                                  highlightedIndex === index
                                    ? "bg-orange-500 text-white"
                                    : "bg-orange-100 text-orange-600 group-hover:bg-orange-500 group-hover:text-white"
                                )}>
                                  <MapPin className="w-4 h-4" />
                                </div>
                                <div>
                                  <span className="text-gray-700 font-medium group-hover:text-gray-900 block">
                                    {city.name}
                                  </span>
                                  {city.description && (
                                    <span className="text-xs text-gray-500 line-clamp-1">
                                      {city.description.substring(0, 50)}...
                                    </span>
                                  )}
                                </div>
                              </div>
                              <ArrowRight className={cn(
                                "w-4 h-4 text-gray-300 transition-all",
                                highlightedIndex === index
                                  ? "text-orange-500 translate-x-0 opacity-100"
                                  : "group-hover:text-orange-500 -translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100"
                              )} />
                            </button>
                          ))}
                        </>
                      ) : (
                        <div className="py-8 text-center">
                          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 mb-3">
                            <SearchX className="w-6 h-6 text-gray-400" />
                          </div>
                          <p className="text-gray-900 font-medium">No destinations found</p>
                          <p className="text-sm text-gray-500 mt-1">
                            We couldn&apos;t find &quot;{searchQuery}&quot;
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            Try searching for popular destinations like Ayodhya, Varanasi, or Rishikesh
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Background Overlay to close dropdown */}
            {isDropdownOpen && (
              <div
                className="fixed inset-0 z-40 bg-transparent"
                onClick={() => setIsDropdownOpen(false)}
                aria-hidden="true"
              />
            )}
          </div>

          {/* CTA Button */}
          <motion.button
            onClick={onExploreClick}
            disabled={isExploreLoading || !selectedCity}
            whileHover={{ scale: isExploreLoading ? 1 : 1.05 }}
            whileTap={{ scale: isExploreLoading ? 1 : 0.95 }}
            className={cn(
              "group relative overflow-hidden rounded-full px-6 sm:px-8 md:px-10 py-3 sm:py-4 font-bold text-base sm:text-lg transition-all duration-500 touch-manipulation",
              "bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-orange-500/20",
              "min-h-[44px] will-change-transform"
            )}
            aria-label={selectedCity ? `Explore ${selectedCity.name}` : 'Select a city to explore'}
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
            
            {/* Ripple Effect */}
            {isExploreLoading && (
              <motion.div
                className="absolute inset-0 bg-white/30 rounded-full"
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", repeat: Infinity }}
              />
            )}
            
            <span className="relative flex items-center space-x-2">
              {isExploreLoading ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  <span className="tracking-wide">Loading {selectedCity?.name}...</span>
                </>
              ) : (
                <>
                  <span className="tracking-wide">
                    {selectedCity ? `Explore ${selectedCity.name}` : 'Select a City'}
                  </span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </span>
          </motion.button>
        </div>
      </div>
    </Hero>
  );
};

export default HeroSection;