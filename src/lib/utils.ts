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
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Get the backend base URL
  const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 
    (typeof window !== 'undefined' && window.location.hostname.includes('railway.app') 
      ? 'https://shambit.up.railway.app' 
      : 'http://localhost:8000');
  
  // Ensure the path starts with /
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  const fullUrl = `${backendUrl}${cleanPath}`;
  
  // Debug logging
  if (typeof window !== 'undefined') {
    console.log('🖼️ Image URL:', { imagePath, backendUrl, fullUrl });
  }
  
  return fullUrl;
}

// Sacred design helper classes
export const sacredStyles = {
  container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  section: "py-16 lg:py-24",
  card: "bg-white rounded-2xl temple-shadow sacred-border p-6 lg:p-8",
  button: {
    primary: "bg-gradient-to-r from-orange-600 to-yellow-600 text-white font-medium px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105",
    secondary: "border-2 border-yellow-600 text-slate-900 font-medium px-8 py-3 rounded-xl hover:bg-yellow-600 hover:text-white transition-all duration-300",
    ghost: "text-slate-900 hover:text-orange-600 font-medium transition-colors duration-300"
  },
  heading: {
    h1: "font-playfair text-4xl lg:text-6xl font-semibold text-slate-900 leading-tight",
    h2: "font-playfair text-3xl lg:text-5xl font-semibold text-slate-900 leading-tight",
    h3: "font-playfair text-2xl lg:text-3xl font-semibold text-slate-900 leading-tight",
    h4: "font-playfair text-xl lg:text-2xl font-semibold text-slate-900 leading-tight"
  },
  text: {
    body: "font-inter text-base lg:text-lg text-gray-700 leading-relaxed",
    small: "font-inter text-sm text-gray-600",
    caption: "font-inter text-xs text-gray-500 uppercase tracking-wide"
  }
};