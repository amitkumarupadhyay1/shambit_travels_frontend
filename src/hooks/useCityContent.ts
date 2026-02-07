import { useState, useEffect, useCallback, useRef } from 'react';
import { City, Article, Package, apiService } from '@/lib/api';

interface UseCityContentOptions {
  city: City | null;
  autoLoad?: boolean;
}

interface UseCityContentReturn {
  articles: Article[];
  packages: Package[];
  isLoading: boolean;
  error: string | null;
  loadContent: () => Promise<void>;
  hasLoaded: boolean;
}

export function useCityContent(options: UseCityContentOptions): UseCityContentReturn {
  const { city, autoLoad = false } = options;

  const [articles, setArticles] = useState<Article[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const loadingRef = useRef(false);
  const currentCityIdRef = useRef<number | null>(null);

  const loadContent = useCallback(async () => {
    if (!city) {
      setArticles([]);
      setPackages([]);
      setHasLoaded(false);
      return;
    }

    // Prevent duplicate loading
    if (loadingRef.current && currentCityIdRef.current === city.id) {
      console.log('⏭️ Skipping duplicate load for city:', city.name);
      return;
    }

    // Cancel previous requests if city changed
    if (currentCityIdRef.current !== city.id) {
      apiService.cancelAllRequests();
    }

    loadingRef.current = true;
    currentCityIdRef.current = city.id;
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔄 Loading content for city:', city.name);

      // Load articles and packages in parallel
      const [articlesData, packagesData] = await Promise.all([
        apiService.getArticlesByCity(city.id).catch(err => {
          console.error('Failed to load articles:', err);
          return [];
        }),
        apiService.getPackagesByCity(city.id).catch(err => {
          console.error('Failed to load packages:', err);
          return [];
        }),
      ]);

      // Only update state if this is still the current city
      if (currentCityIdRef.current === city.id) {
        setArticles(articlesData);
        setPackages(packagesData);
        setHasLoaded(true);
        console.log('✅ Content loaded for city:', city.name);
      }
    } catch (err) {
      console.error('Failed to load city content:', err);
      if (currentCityIdRef.current === city.id) {
        setError('Failed to load content. Please try again.');
      }
    } finally {
      if (currentCityIdRef.current === city.id) {
        setIsLoading(false);
        loadingRef.current = false;
      }
    }
  }, [city]);

  // Auto-load content when city changes (if autoLoad is true)
  useEffect(() => {
    if (autoLoad && city) {
      loadContent();
    }
  }, [city, autoLoad, loadContent]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      apiService.cancelAllRequests();
    };
  }, []);

  return {
    articles,
    packages,
    isLoading,
    error,
    loadContent,
    hasLoaded,
  };
}
