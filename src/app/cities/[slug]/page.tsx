'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MapPin, Package, FileText, Sparkles, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { apiService, City } from '@/lib/api';
import type { Package as PackageType } from '@/lib/api';

export default function CityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [city, setCity] = useState<City | null>(null);
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCityData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load all cities and find the one with matching slug
        const cities = await apiService.getCities();
        const foundCity = cities.find(c => c.slug === slug);

        if (!foundCity) {
          setError('City not found');
          return;
        }

        setCity(foundCity);

        // Load packages for this city
        try {
          const allPackages = await apiService.getPackages();
          // Filter packages by city name
          const cityPackages = allPackages.filter(pkg => 
            pkg.city_name.toLowerCase() === foundCity.name.toLowerCase()
          );
          setPackages(cityPackages);
        } catch (err) {
          console.error('Failed to load packages:', err);
          // Don't fail the whole page if packages fail
        }

      } catch (err) {
        console.error('Failed to load city:', err);
        setError('Failed to load city details');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadCityData();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-orange-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading city details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !city) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">City Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'The city you are looking for does not exist.'}</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
            >
              Go Back Home
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        {/* Background Image */}
        {city.hero_image ? (
          <div className="absolute inset-0">
            <Image
              src={city.hero_image}
              alt={city.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-amber-500 to-orange-400" />
        )}

        {/* Content */}
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white mb-4">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">Destination</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {city.name}
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              {city.description.substring(0, 150)}...
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* About Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">About {city.name}</h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p>{city.description}</p>
          </div>
        </motion.section>

        {/* Packages Section */}
        {packages.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Travel Packages
                </h2>
                <p className="text-gray-600">
                  Explore our curated packages for {city.name}
                </p>
              </div>
              <button
                onClick={() => router.push(`/packages?city=${city.id}`)}
                className="hidden md:flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
              >
                View All Packages
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.slice(0, 6).map((pkg) => (
                <motion.div
                  key={pkg.id}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-100 cursor-pointer"
                  onClick={() => router.push(`/packages/${pkg.slug}`)}
                >
                  {/* Package Image */}
                  <div className="relative h-48 bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                    <Package className="w-16 h-16 text-orange-300" />
                  </div>

                  {/* Package Info */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      {pkg.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {pkg.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Sparkles className="w-4 h-4" />
                        <span>{pkg.experiences.length} experiences</span>
                      </div>
                      <button className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center gap-1">
                        View Details
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mobile View All Button */}
            <div className="md:hidden mt-6 text-center">
              <button
                onClick={() => router.push(`/packages?city=${city.id}`)}
                className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                View All Packages
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.section>
        )}

        {/* No Packages Message */}
        {packages.length === 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16"
          >
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-8 text-center">
              <Package className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Packages Coming Soon
              </h3>
              <p className="text-gray-600">
                We&apos;re working on creating amazing travel packages for {city.name}. Check back soon!
              </p>
            </div>
          </motion.section>
        )}

        {/* Quick Actions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <button
            onClick={() => router.push(`/search?q=${city.name} packages`)}
            className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl hover:shadow-lg transition-all text-left group"
          >
            <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Search Packages
            </h3>
            <p className="text-sm text-gray-600">
              Find the perfect travel package for {city.name}
            </p>
          </button>

          <button
            onClick={() => router.push(`/search?q=things to do in ${city.name}`)}
            className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:shadow-lg transition-all text-left group"
          >
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Experiences
            </h3>
            <p className="text-sm text-gray-600">
              Discover activities and experiences in {city.name}
            </p>
          </button>

          <button
            onClick={() => router.push(`/search?q=${city.name} guide`)}
            className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:shadow-lg transition-all text-left group"
          >
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Travel Guides
            </h3>
            <p className="text-sm text-gray-600">
              Read articles and guides about {city.name}
            </p>
          </button>
        </motion.section>
      </div>

      <Footer />
    </div>
  );
}
