/**
 * Hook for managing search history in localStorage
 */
import { useState, useCallback } from 'react';

const STORAGE_KEY = 'shambit_search_history';
const MAX_HISTORY_ITEMS = 10;

export interface SearchHistoryItem {
  query: string;
  timestamp: number;
  resultCount?: number;
}

export function useSearchHistory() {
  // Use lazy initializer to load from localStorage only once
  const [history, setHistory] = useState<SearchHistoryItem[]>(() => {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as SearchHistoryItem[];
      }
    } catch (error) {
      console.error('Failed to load search history:', error);
    }
    return [];
  });

  // Add search to history
  const addToHistory = useCallback((query: string, resultCount?: number) => {
    if (!query || query.trim().length < 2) return;

    setHistory((prev) => {
      // Remove duplicate if exists
      const filtered = prev.filter(
        (item) => item.query.toLowerCase() !== query.toLowerCase()
      );

      // Add new item at the beginning
      const newHistory = [
        {
          query: query.trim(),
          timestamp: Date.now(),
          resultCount,
        },
        ...filtered,
      ].slice(0, MAX_HISTORY_ITEMS); // Keep only last N items

      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      } catch (error) {
        console.error('Failed to save search history:', error);
      }

      return newHistory;
    });
  }, []);

  // Clear all history
  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear search history:', error);
    }
  }, []);

  // Remove specific item
  const removeFromHistory = useCallback((query: string) => {
    setHistory((prev) => {
      const filtered = prev.filter(
        (item) => item.query.toLowerCase() !== query.toLowerCase()
      );

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      } catch (error) {
        console.error('Failed to update search history:', error);
      }

      return filtered;
    });
  }, []);

  // Get recent searches (last N items)
  const getRecentSearches = useCallback((limit: number = 5) => {
    return history.slice(0, limit);
  }, [history]);

  return {
    history,
    addToHistory,
    clearHistory,
    removeFromHistory,
    getRecentSearches,
  };
}
