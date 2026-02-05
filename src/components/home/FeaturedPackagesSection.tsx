'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, MapPin, Star } from 'lucide-react';
import Link from 'next/link';
import { cn, sacredStyles, formatCurrency } from '@/lib/utils';
import { apiService, Package, City } from '@/lib/api';

interface FeaturedPackagesSectionProps {
  selectedCity?: City | null;
}

const FeaturedPackagesSection = ({ selectedCity }: FeaturedPackagesSectionProps) => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const packagesData = selectedCity
          ? await apiService.getPackagesByCity(selectedCity.id)
          : await apiService.getFeaturedPackages();
        setPackages(packagesData.slice(0, 6)); // Limit to 6 packages
      } catch (error) {
        console.error('Failed to fetch packages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [selectedCity]);

  if (loading) {
    return (
      <section className={cn(sacredStyles.section, "bg-white")}>
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
    <section className={cn(sacredStyles.section, "bg-white")}>
      <div className={sacredStyles.container}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className={cn(sacredStyles.heading.h2, "mb-6")}>
            {selectedCity ? `${selectedCity.name} ` : 'Featured '}{' '}
            <span className="sacred-gradient-text">Packages</span>
          </h2>
          <p className={cn(sacredStyles.text.body, "max-w-2xl mx-auto")}>
            {selectedCity
              ? `Curated travel packages for your journey to ${selectedCity.name}`
              : 'Handcrafted spiritual journeys designed for transformative experiences'
            }
          </p>
        </motion.div>

        {packages.length === 0 ? (
          <div className="text-center py-12">
            <p className={sacredStyles.text.body}>
              {selectedCity
                ? `No packages available for ${selectedCity.name} at the moment.`
                : 'No packages available at the moment.'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Link href={`/packages/${pkg.id}`}>
                  <div className={cn(sacredStyles.card, "overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:scale-105")}>
                    {/* Package Image - Packages don't have featured_image, using placeholder */}
                    <div className="relative h-48 mb-6 rounded-xl overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-orange-600/20 to-yellow-600/20 flex items-center justify-center">
                        <Star className="w-12 h-12 text-yellow-600" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                      {/* Price Badge */}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                        <span className="font-bold text-orange-600">
                          {pkg.experiences.length > 0
                            ? formatCurrency(Math.min(...pkg.experiences.map(e => e.base_price)))
                            : 'Custom'
                          }
                        </span>
                      </div>
                    </div>

                    {/* Package Info */}
                    <div>
                      <h3 className={cn(sacredStyles.heading.h4, "mb-2 group-hover:text-orange-600 transition-colors")}>
                        {pkg.name}
                      </h3>

                      {/* Location & Duration */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-1 text-yellow-600" />
                          <span className={sacredStyles.text.small}>{pkg.city_name}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-1 text-yellow-600" />
                          <span className={sacredStyles.text.small}>
                            {pkg.experiences.length} Experiences
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className={cn(sacredStyles.text.body, "mb-4 line-clamp-3")}>
                        {pkg.description}
                      </p>

                      {/* Explore Link */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-orange-600 font-medium group-hover:text-yellow-600 transition-colors">
                          <span>View Package</span>
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                        <span className={cn(sacredStyles.text.small, "text-gray-500")}>
                          Starting from
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* View All Packages Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href={selectedCity ? `/packages?city=${selectedCity.id}` : "/packages"}
            className={cn(sacredStyles.button.secondary, "inline-flex items-center")}
          >
            {selectedCity ? `View All ${selectedCity.name} Packages` : 'View All Packages'}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedPackagesSection;