import React from 'react';

// Inline SVG illustrations inspired by undraw.co style
// These are minimal, clean illustrations that work well for empty states

export const NoBookingsIllustration = () => (
  <svg
    viewBox="0 0 200 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
  >
    {/* Calendar */}
    <rect x="40" y="30" width="120" height="100" rx="8" fill="#FFF7ED" stroke="#FB923C" strokeWidth="2" />
    <rect x="40" y="30" width="120" height="20" rx="8" fill="#FB923C" />
    <circle cx="60" cy="40" r="3" fill="white" />
    <circle cx="140" cy="40" r="3" fill="white" />
    
    {/* Calendar grid */}
    <line x1="60" y1="70" x2="80" y2="70" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" />
    <line x1="90" y1="70" x2="110" y2="70" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" />
    <line x1="120" y1="70" x2="140" y2="70" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" />
    
    <line x1="60" y1="90" x2="80" y2="90" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" />
    <line x1="90" y1="90" x2="110" y2="90" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" />
    <line x1="120" y1="90" x2="140" y2="90" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" />
    
    <line x1="60" y1="110" x2="80" y2="110" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" />
    <line x1="90" y1="110" x2="110" y2="110" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" />
    
    {/* Question mark */}
    <circle cx="100" cy="140" r="15" fill="#FEF3C7" />
    <text x="100" y="148" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#F59E0B">?</text>
  </svg>
);

export const NoSearchResultsIllustration = () => (
  <svg
    viewBox="0 0 200 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
  >
    {/* Magnifying glass */}
    <circle cx="70" cy="70" r="35" fill="#FFF7ED" stroke="#FB923C" strokeWidth="3" />
    <circle cx="70" cy="70" r="25" fill="white" stroke="#FB923C" strokeWidth="2" />
    <line x1="95" y1="95" x2="130" y2="130" stroke="#FB923C" strokeWidth="6" strokeLinecap="round" />
    
    {/* X mark inside */}
    <line x1="60" y1="60" x2="80" y2="80" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
    <line x1="80" y1="60" x2="60" y2="80" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
    
    {/* Floating dots */}
    <circle cx="140" cy="40" r="4" fill="#FED7AA" />
    <circle cx="160" cy="60" r="3" fill="#FDBA74" />
    <circle cx="30" cy="50" r="3" fill="#FED7AA" />
  </svg>
);

export const NoTravelersIllustration = () => (
  <svg
    viewBox="0 0 200 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
  >
    {/* Person silhouette */}
    <circle cx="100" cy="50" r="20" fill="#FFF7ED" stroke="#FB923C" strokeWidth="2" />
    <path
      d="M 70 110 Q 70 80 100 80 Q 130 80 130 110 L 130 130 L 70 130 Z"
      fill="#FFF7ED"
      stroke="#FB923C"
      strokeWidth="2"
    />
    
    {/* Plus sign */}
    <circle cx="140" cy="100" r="18" fill="#FB923C" />
    <line x1="140" y1="90" x2="140" y2="110" stroke="white" strokeWidth="3" strokeLinecap="round" />
    <line x1="130" y1="100" x2="150" y2="100" stroke="white" strokeWidth="3" strokeLinecap="round" />
    
    {/* Decorative elements */}
    <circle cx="50" cy="90" r="3" fill="#FED7AA" />
    <circle cx="160" cy="50" r="4" fill="#FDBA74" />
  </svg>
);

export const NotFoundIllustration = () => (
  <svg
    viewBox="0 0 200 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
  >
    {/* Map with location pin */}
    <rect x="30" y="40" width="140" height="90" rx="8" fill="#FFF7ED" stroke="#FB923C" strokeWidth="2" />
    
    {/* Map lines */}
    <path d="M 50 60 Q 80 70 110 60 T 150 60" stroke="#FED7AA" strokeWidth="2" fill="none" />
    <path d="M 50 80 Q 80 90 110 80 T 150 80" stroke="#FED7AA" strokeWidth="2" fill="none" />
    <path d="M 50 100 Q 80 110 110 100 T 150 100" stroke="#FED7AA" strokeWidth="2" fill="none" />
    
    {/* Location pin with X */}
    <path
      d="M 100 50 C 100 50 85 50 85 65 C 85 75 100 90 100 90 C 100 90 115 75 115 65 C 115 50 100 50 100 50 Z"
      fill="#EF4444"
      stroke="#DC2626"
      strokeWidth="2"
    />
    <circle cx="100" cy="65" r="8" fill="white" />
    <line x1="96" y1="61" x2="104" y2="69" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
    <line x1="104" y1="61" x2="96" y2="69" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const ErrorStateIllustration = () => (
  <svg
    viewBox="0 0 200 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
  >
    {/* Warning triangle */}
    <path
      d="M 100 30 L 160 130 L 40 130 Z"
      fill="#FEF3C7"
      stroke="#F59E0B"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    
    {/* Exclamation mark */}
    <line x1="100" y1="60" x2="100" y2="95" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
    <circle cx="100" cy="110" r="4" fill="#F59E0B" />
    
    {/* Decorative elements */}
    <circle cx="50" cy="50" r="3" fill="#FED7AA" />
    <circle cx="150" cy="50" r="4" fill="#FDBA74" />
  </svg>
);

export const NoDataIllustration = () => (
  <svg
    viewBox="0 0 200 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
  >
    {/* Empty folder */}
    <path
      d="M 40 60 L 40 130 L 160 130 L 160 70 L 110 70 L 100 60 Z"
      fill="#FFF7ED"
      stroke="#FB923C"
      strokeWidth="2"
    />
    <path
      d="M 40 60 L 100 60 L 110 70 L 160 70 L 160 65 L 110 65 L 100 55 L 40 55 Z"
      fill="#FB923C"
    />
    
    {/* Empty indicator */}
    <circle cx="100" cy="100" r="15" fill="white" stroke="#D1D5DB" strokeWidth="2" strokeDasharray="3 3" />
    <line x1="90" y1="100" x2="110" y2="100" stroke="#D1D5DB" strokeWidth="2" />
  </svg>
);

export const LoadingIllustration = () => (
  <svg
    viewBox="0 0 200 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
  >
    {/* Hourglass */}
    <path
      d="M 70 30 L 130 30 L 130 40 L 100 80 L 130 120 L 130 130 L 70 130 L 70 120 L 100 80 L 70 40 Z"
      fill="#FFF7ED"
      stroke="#FB923C"
      strokeWidth="2"
    />
    
    {/* Sand */}
    <path
      d="M 75 35 L 125 35 L 100 70 Z"
      fill="#FB923C"
      opacity="0.6"
    />
    <path
      d="M 75 125 L 125 125 L 125 115 L 75 115 Z"
      fill="#FB923C"
    />
    
    {/* Top and bottom caps */}
    <rect x="65" y="25" width="70" height="8" rx="2" fill="#FB923C" />
    <rect x="65" y="127" width="70" height="8" rx="2" fill="#FB923C" />
  </svg>
);
