import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency for Indian market
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format date for Indian context
export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

// Generate slug from text
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Get full image URL for backend media
export function getImageUrl(imagePath?: string): string | undefined {
  if (!imagePath) return undefined;
  
  // If it's already a full URL (from Media API), return as is
  // This handles both Cloudinary URLs and Django media URLs with cache-busting
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Smart backend URL detection for mobile compatibility
  const getBackendUrl = (): string => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl) {
      return apiUrl.replace('/api', '');
    }
    
    if (typeof window === 'undefined') {
      return 'http://localhost:8000';
    }
    
    const hostname = window.location.hostname;
    
    if (hostname.includes('railway.app') || hostname.includes('vercel.app')) {
      return 'https://shambit.up.railway.app';
    }
    
    if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
      return `http://${hostname}:8000`;
    }
    
    return 'http://localhost:8000';
  };
  
  const backendUrl = getBackendUrl();
  
  // Ensure the path starts with /
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  return `${backendUrl}${cleanPath}`;
}

// Sacred design helper classes
export const sacredStyles = {
  container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  section: "py-12 md:py-16 lg:py-20",
  card: "bg-white rounded-2xl temple-shadow sacred-border p-6 lg:p-8",
  spacing: {
    page: {
      top: "pt-20 md:pt-24 lg:pt-28",
      bottom: "pb-16 md:pb-20 lg:pb-24",
      both: "pt-20 pb-16 md:pt-24 md:pb-20 lg:pt-28 lg:pb-24"
    },
    section: {
      default: "py-12 md:py-16 lg:py-20",
      compact: "py-8 md:py-12 lg:py-16",
      spacious: "py-16 md:py-20 lg:py-24"
    },
    card: {
      compact: "p-4 md:p-6",
      default: "p-6 md:p-8",
      spacious: "p-8 md:p-10"
    }
  },
  button: {
    primary: "bg-gradient-to-r from-orange-600 to-yellow-600 text-white font-medium px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 motion-reduce:transition-none motion-reduce:hover:scale-100",
    secondary: "border-2 border-yellow-600 text-slate-900 font-medium px-8 py-3 rounded-xl hover:bg-yellow-600 hover:text-white transition-all duration-300 active:scale-95 motion-reduce:transition-none motion-reduce:hover:scale-100",
    ghost: "text-slate-900 hover:text-orange-600 font-medium transition-colors duration-300 motion-reduce:transition-none",
    cta: "bg-gradient-to-r from-orange-600 to-yellow-600 text-white font-semibold px-6 py-4 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 text-lg motion-reduce:transition-none motion-reduce:hover:scale-100"
  },
  heading: {
    h1: "font-playfair text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-semibold text-slate-900 leading-tight",
    h2: "font-playfair text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold text-slate-900 leading-tight",
    h3: "font-playfair text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-900 leading-tight",
    h4: "font-playfair text-lg sm:text-xl lg:text-2xl font-semibold text-slate-900 leading-tight"
  },
  text: {
    body: "font-inter text-base lg:text-lg text-gray-700 leading-relaxed",
    small: "font-inter text-sm text-gray-600 leading-normal",
    caption: "font-inter text-xs text-gray-500 uppercase tracking-wide"
  }
};

// Check if user prefers reduced motion
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}