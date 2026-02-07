'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Package } from '@/lib/api';

interface ComparisonContextType {
  packages: Package[];
  addPackage: (pkg: Package) => void;
  removePackage: (packageId: number) => void;
  clearAll: () => void;
  isInComparison: (packageId: number) => boolean;
  maxPackages: number;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [packages, setPackages] = useState<Package[]>([]);
  const maxPackages = 3;

  const addPackage = (pkg: Package) => {
    setPackages(prev => {
      // Don't add if already in comparison
      if (prev.some(p => p.id === pkg.id)) {
        return prev;
      }
      // Don't add if at max capacity
      if (prev.length >= maxPackages) {
        alert(`You can only compare up to ${maxPackages} packages at a time.`);
        return prev;
      }
      return [...prev, pkg];
    });
  };

  const removePackage = (packageId: number) => {
    setPackages(prev => prev.filter(p => p.id !== packageId));
  };

  const clearAll = () => {
    setPackages([]);
  };

  const isInComparison = (packageId: number) => {
    return packages.some(p => p.id === packageId);
  };

  return (
    <ComparisonContext.Provider
      value={{
        packages,
        addPackage,
        removePackage,
        clearAll,
        isInComparison,
        maxPackages,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
}
