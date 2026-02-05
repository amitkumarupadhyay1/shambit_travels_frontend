'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, User, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn, sacredStyles, formatDate, truncateText, getImageUrl } from '@/lib/utils';
import { apiService, Article, City } from '@/lib/api';

interface LatestArticlesSectionProps {
  selectedCity?: City | null;
}

const LatestArticlesSection = ({ selectedCity }: LatestArticlesSectionProps) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const articlesData = selectedCity 
          ? await apiService.getArticlesByCity(selectedCity.id)
          : await apiService.getFeaturedArticles();
        setArticles(articlesData.slice(0, 6)); // Limit to 6 articles
      } catch (error) {
        console.error('Failed to fetch articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
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
            {selectedCity ? `${selectedCity.name} ` : 'Latest '}{' '}
            <span className="gold-gradient bg-clip-text text-transparent">Stories</span>
          </h2>
          <p className={cn(sacredStyles.text.body, "max-w-2xl mx-auto")}>
            {selectedCity 
              ? `Discover insights, guides, and stories about ${selectedCity.name}`
              : 'Discover insights, travel guides, and inspiring stories from our spiritual journeys'
            }
          </p>
        </motion.div>

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className={sacredStyles.text.body}>
              {selectedCity 
                ? `No articles available for ${selectedCity.name} at the moment.`
                : 'No articles available at the moment.'
              }
            </p>
          </div>
        ) : (
          <>
            {/* Featured Article (First Article) */}
            {articles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <Link href={`/articles/${articles[0].slug}`}>
                  <div className={cn(sacredStyles.card, "overflow-hidden hover:shadow-xl transition-all duration-300 group")}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Featured Image */}
                      <div className="relative h-64 lg:h-80 rounded-xl overflow-hidden">
                        {articles[0].featured_image ? (
                          <Image
                            src={getImageUrl(articles[0].featured_image) || ''}
                            alt={articles[0].title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-orange-600/20 to-yellow-600/20 flex items-center justify-center">
                            <Calendar className="w-12 h-12 text-yellow-600" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      </div>

                      {/* Content */}
                      <div className="flex flex-col justify-center">
                        <div className="flex items-center space-x-4 mb-4">
                          <span className={cn(sacredStyles.text.caption, "bg-yellow-600/10 text-orange-600 px-3 py-1 rounded-full")}>
                            Featured
                          </span>
                          <span className={cn(sacredStyles.text.small, "text-gray-500")}>
                            {formatDate(articles[0].created_at)}
                          </span>
                        </div>

                        <h3 className={cn(sacredStyles.heading.h3, "mb-4 group-hover:text-orange-600 transition-colors")}>
                          {articles[0].title}
                        </h3>

                        {articles[0].excerpt && (
                          <p className={cn(sacredStyles.text.body, "mb-6")}>
                            {truncateText(articles[0].excerpt, 200)}
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center text-gray-600">
                              <User className="w-4 h-4 mr-1 text-yellow-600" />
                              <span className={sacredStyles.text.small}>{articles[0].author}</span>
                            </div>
                            {articles[0].city_name && (
                              <div className="flex items-center text-gray-600">
                                <MapPin className="w-4 h-4 mr-1 text-yellow-600" />
                                <span className={sacredStyles.text.small}>{articles[0].city_name}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center text-orange-600 font-medium group-hover:text-yellow-600 transition-colors">
                            <span>Read More</span>
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Other Articles Grid */}
            {articles.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.slice(1).map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group"
                  >
                    <Link href={`/articles/${article.slug}`}>
                      <div className={cn(sacredStyles.card, "overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:scale-105")}>
                        {/* Article Image */}
                        <div className="relative h-48 mb-6 rounded-xl overflow-hidden">
                          {article.featured_image ? (
                            <Image
                              src={getImageUrl(article.featured_image) || ''}
                              alt={article.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-orange-600/20 to-yellow-600/20 flex items-center justify-center">
                              <Calendar className="w-12 h-12 text-yellow-600" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>

                        {/* Article Info */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className={cn(sacredStyles.text.small, "text-gray-500")}>
                              {formatDate(article.created_at)}
                            </span>
                            {article.city_name && (
                              <div className="flex items-center text-gray-600">
                                <MapPin className="w-3 h-3 mr-1 text-yellow-600" />
                                <span className={cn(sacredStyles.text.small, "text-xs")}>
                                  {article.city_name}
                                </span>
                              </div>
                            )}
                          </div>

                          <h3 className={cn(sacredStyles.heading.h4, "mb-3 group-hover:text-orange-600 transition-colors line-clamp-2")}>
                            {article.title}
                          </h3>

                          {article.excerpt && (
                            <p className={cn(sacredStyles.text.body, "mb-4 line-clamp-3")}>
                              {article.excerpt}
                            </p>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-gray-600">
                              <User className="w-4 h-4 mr-1 text-yellow-600" />
                              <span className={sacredStyles.text.small}>{article.author}</span>
                            </div>
                            <div className="flex items-center text-orange-600 font-medium group-hover:text-yellow-600 transition-colors">
                              <span className="text-sm">Read</span>
                              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {/* View All Articles Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link 
            href={selectedCity ? `/articles?city=${selectedCity.id}` : "/articles"} 
            className={cn(sacredStyles.button.secondary, "inline-flex items-center")}
          >
            {selectedCity ? `View All ${selectedCity.name} Articles` : 'View All Articles'}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default LatestArticlesSection;