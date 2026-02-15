'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn, sacredStyles, getImageUrl } from '@/lib/utils';
import { apiService, City } from '@/lib/api';
import { getMediaForObject } from '@/lib/media';

interface FeaturedCitiesSectionProps {
  selectedCity?: City | null;
}

interface CityWithMedia extends City {
  mediaLibraryImage?: string;
}

const FeaturedCitiesSection = ({ selectedCity }: FeaturedCitiesSectionProps) => {
  const [cities, setCities] = useState<CityWithMedia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true);
      try {
        const citiesData = selectedCity
          ? [selectedCity]
          : await apiService.getCities();
        
        const citiesWithLimit = citiesData.slice(0, 6); // Limit to 6 cities
        
        // Fetch Media Library images for cities without hero_image
        const citiesWithMedia = await Promise.all(
          citiesWithLimit.map(async (city) => {
            if (!city.hero_image) {
              // Fetch from Media Library
              try {
                const media = await getMediaForObject('cities.city', city.id);
                if (media && media.length > 0) {
                  return {
                    ...city,
                    mediaLibraryImage: media[0].file_url, // Use first image
                  };
                }
              } catch (error) {
                console.error(`Failed to fetch media for city ${city.id}:`, error);
              }
            }
            return city;
          })
        );
        
        setCities(citiesWithMedia);
      } catch (error) {
        console.error('Failed to fetch cities:', error);
        setCities([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, [selectedCity]);

  if (loading) {
    return (
      <section className={cn(sacredStyles.section, "sacred-gradient")}>
        <div className={sacredStyles.container}>
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded-lg w-64 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 rounded-lg w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={cn(sacredStyles.section, "sacred-gradient")}>
      <div className={sacredStyles.container}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className={cn(sacredStyles.heading.h2, "mb-6")}>
            {selectedCity ? `Explore ${selectedCity.name}` : 'Featured'}{' '}
            <span className="sacred-gradient-text">Destinations</span>
          </h2>
          <p className={cn(sacredStyles.text.body, "max-w-2xl mx-auto")}>
            {selectedCity
              ? `Discover the spiritual essence and cultural treasures of ${selectedCity.name}`
              : 'Discover India\'s most sacred and culturally rich destinations'
            }
          </p>
        </motion.div>

        {cities.length === 0 ? (
          <div className="text-center py-12">
            <p className={sacredStyles.text.body}>No cities available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cities.map((city, index) => {
              // Determine which image to use: hero_image or Media Library
              const imageUrl = city.hero_image 
                ? getImageUrl(city.hero_image) 
                : city.mediaLibraryImage;
              
              return (
                <motion.div
                  key={city.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <Link href={`/destinations/${city.id}`}>
                    <div className={cn(sacredStyles.card, "overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:scale-105")}>
                      {/* City Image */}
                      <div className="relative h-48 mb-6 rounded-xl overflow-hidden">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={city.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              // Fallback to placeholder if image fails to load
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          // Fallback: Show placeholder icon when no image available
                          <div className="w-full h-full bg-gradient-to-br from-orange-600/20 to-yellow-600/20 flex items-center justify-center">
                            <MapPin className="w-12 h-12 text-yellow-600" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      </div>

                      {/* City Info */}
                      <div>
                        <h3 className={cn(sacredStyles.heading.h4, "mb-2 group-hover:text-primary-saffron transition-colors")}>
                          {city.name}
                        </h3>
                        <p className={cn(sacredStyles.text.small, "mb-4 flex items-center")}>
                          <MapPin className="w-4 h-4 mr-1 text-yellow-600" />
                          {city.slug}
                        </p>
                        {city.description && (
                          <p className={cn(sacredStyles.text.body, "mb-4 line-clamp-3")}>
                            {city.description}
                          </p>
                        )}

                        {/* Explore Link */}
                        <div className="flex items-center text-primary-saffron font-medium group-hover:text-primary-gold transition-colors">
                          <span>Explore {city.name}</span>
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* View All Cities Button */}
        {!selectedCity && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/destinations" className={cn(sacredStyles.button.secondary, "inline-flex items-center")}>
              View All Destinations
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCitiesSection;