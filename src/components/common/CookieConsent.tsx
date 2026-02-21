'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Settings, Shield, BarChart3, Megaphone } from 'lucide-react';
import Link from 'next/link';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
}

const COOKIE_CONSENT_KEY = 'shambit_cookie_consent';
const CONSENT_VERSION = '1.0';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Initialize preferences from localStorage on mount
  const [preferences, setPreferences] = useState<CookiePreferences>(() => {
    if (typeof window === 'undefined') {
      return {
        essential: true,
        analytics: false,
        marketing: false,
        timestamp: 0,
      };
    }

    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (savedConsent) {
      try {
        const parsed = JSON.parse(savedConsent);
        const oneYear = 365 * 24 * 60 * 60 * 1000;
        if (Date.now() - parsed.timestamp < oneYear && parsed.version === CONSENT_VERSION) {
          return parsed;
        }
      } catch (error) {
        console.error('Failed to parse cookie consent:', error);
      }
    }

    return {
      essential: true,
      analytics: false,
      marketing: false,
      timestamp: 0,
    };
  });

  const applyConsent = (prefs: CookiePreferences) => {
    // Apply analytics consent
    if (prefs.analytics) {
      // Enable Google Analytics or other analytics tools
      if (typeof window !== 'undefined' && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
        (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('consent', 'update', {
          analytics_storage: 'granted',
        });
      }
    }

    // Apply marketing consent
    if (prefs.marketing) {
      // Enable marketing cookies
      if (typeof window !== 'undefined' && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
        (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('consent', 'update', {
          ad_storage: 'granted',
          ad_user_data: 'granted',
          ad_personalization: 'granted',
        });
      }
    }
  };

  useEffect(() => {
    // Check if user has already given consent
    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    
    if (!savedConsent) {
      // Show banner after a short delay for better UX
      setTimeout(() => setShowBanner(true), 1000);
    } else {
      try {
        const parsed = JSON.parse(savedConsent);
        // Check if consent is still valid (e.g., within 1 year)
        const oneYear = 365 * 24 * 60 * 60 * 1000;
        if (Date.now() - parsed.timestamp < oneYear && parsed.version === CONSENT_VERSION) {
          applyConsent(parsed);
        } else {
          // Consent expired or version changed, show banner again
          setTimeout(() => setShowBanner(true), 1000);
        }
      } catch (error) {
        console.error('Failed to parse cookie consent:', error);
        setTimeout(() => setShowBanner(true), 1000);
      }
    }
  }, []);

  const saveConsent = (prefs: CookiePreferences) => {
    const consentData = {
      ...prefs,
      version: CONSENT_VERSION,
      timestamp: Date.now(),
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentData));
    applyConsent(prefs);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      essential: true,
      analytics: true,
      marketing: true,
      timestamp: Date.now(),
    };
    setPreferences(allAccepted);
    saveConsent(allAccepted);
  };

  const handleRejectAll = () => {
    const essentialOnly: CookiePreferences = {
      essential: true,
      analytics: false,
      marketing: false,
      timestamp: Date.now(),
    };
    setPreferences(essentialOnly);
    saveConsent(essentialOnly);
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'essential') return; // Essential cookies cannot be disabled
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <>
      {/* Cookie Banner */}
      <AnimatePresence>
        {showBanner && !showSettings && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-white border-t-2 border-orange-500 shadow-2xl"
            role="dialog"
            aria-labelledby="cookie-banner-title"
            aria-describedby="cookie-banner-description"
          >
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Cookie className="w-6 h-6 text-orange-600" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 id="cookie-banner-title" className="text-lg font-semibold text-gray-900 mb-2">
                    We value your privacy
                  </h3>
                  <p id="cookie-banner-description" className="text-sm text-gray-600 leading-relaxed">
                    We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                    By clicking &quot;Accept All&quot;, you consent to our use of cookies. You can customize your preferences or learn more in our{' '}
                    <Link href="/privacy-policy" className="text-orange-600 hover:text-orange-700 underline">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                  <button
                    onClick={() => setShowSettings(true)}
                    className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center justify-center gap-2"
                    aria-label="Customize cookie preferences"
                  >
                    <Settings className="w-4 h-4" />
                    Customize
                  </button>
                  <button
                    onClick={handleRejectAll}
                    className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Reject All
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:shadow-lg rounded-lg transition-all"
                  >
                    Accept All
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cookie Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowSettings(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl z-50 bg-white rounded-2xl shadow-2xl overflow-hidden"
              role="dialog"
              aria-labelledby="cookie-settings-title"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 id="cookie-settings-title" className="text-2xl font-playfair font-semibold text-gray-900">
                  Cookie Preferences
                </h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close cookie settings"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <p className="text-sm text-gray-600 mb-6">
                  We use different types of cookies to optimize your experience on our website. 
                  Click on the categories below to learn more and customize your preferences.
                </p>

                {/* Essential Cookies */}
                <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold text-gray-900">Essential Cookies</h3>
                    </div>
                    <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      Always Active
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 ml-8">
                    These cookies are necessary for the website to function and cannot be disabled. 
                    They are usually set in response to actions you take, such as setting your privacy preferences, 
                    logging in, or filling in forms.
                  </p>
                </div>

                {/* Analytics Cookies */}
                <div className="mb-6 p-4 bg-white border border-gray-200 rounded-xl">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-gray-900">Analytics Cookies</h3>
                    </div>
                    <button
                      onClick={() => togglePreference('analytics')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        preferences.analytics ? 'bg-orange-600' : 'bg-gray-300'
                      }`}
                      role="switch"
                      aria-checked={preferences.analytics}
                      aria-label="Toggle analytics cookies"
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences.analytics ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 ml-8">
                    These cookies help us understand how visitors interact with our website by collecting and 
                    reporting information anonymously. This helps us improve our website and services.
                  </p>
                </div>

                {/* Marketing Cookies */}
                <div className="mb-6 p-4 bg-white border border-gray-200 rounded-xl">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Megaphone className="w-5 h-5 text-purple-600" />
                      <h3 className="font-semibold text-gray-900">Marketing Cookies</h3>
                    </div>
                    <button
                      onClick={() => togglePreference('marketing')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        preferences.marketing ? 'bg-orange-600' : 'bg-gray-300'
                      }`}
                      role="switch"
                      aria-checked={preferences.marketing}
                      aria-label="Toggle marketing cookies"
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences.marketing ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 ml-8">
                    These cookies are used to track visitors across websites to display relevant and engaging 
                    advertisements. They may be set by us or by third-party advertising partners.
                  </p>
                </div>

                <div className="text-xs text-gray-500 mt-4">
                  <p>
                    For more information about how we use cookies, please read our{' '}
                    <Link href="/privacy-policy" className="text-orange-600 hover:text-orange-700 underline">
                      Privacy Policy
                    </Link>
                    {' '}and{' '}
                    <Link href="/terms-conditions" className="text-orange-600 hover:text-orange-700 underline">
                      Terms & Conditions
                    </Link>
                    .
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={handleRejectAll}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Reject All
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:shadow-lg rounded-lg transition-all"
                >
                  Save Preferences
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
