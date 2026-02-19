'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, User, Search, LogOut, Calendar, LayoutDashboard, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, sacredStyles } from '@/lib/utils';
import TopBar from './TopBar';
import { useSession } from 'next-auth/react';
import { performLogout } from '@/lib/auth-utils';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const navigation = [
    { name: 'Destinations', href: '/destinations' },
    { name: 'Packages', href: '/packages' },
    { name: 'Experiences', href: '/experiences' },
    { name: 'Booking', href: '/booking' },
    { name: 'Articles', href: '/articles' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  // Scroll detection for compact header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut: Cmd/Ctrl + K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 2) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    setIsUserMenuOpen(false);
    
    try {
      await performLogout('/');
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
  };

  // Get user display name (full name)
  const getUserDisplayName = () => {
    if (!session?.user) return 'User';
    
    const firstName = session.user.firstName || '';
    const lastName = session.user.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim();
    
    // Return full name if available
    if (fullName) return fullName;
    
    // Fallback to name from session
    if (session.user.name) return session.user.name;
    
    // Fallback to email prefix
    if (session.user.email) return session.user.email.split('@')[0];
    
    return 'User';
  };

  // Get username - prioritize username field, fallback to email prefix
  const getUserName = () => {
    if (!session?.user) return '';
    
    // First priority: username field from backend
    if (session.user.username && session.user.username !== session.user.email) {
      return session.user.username;
    }
    
    // Second priority: email prefix
    if (session.user.email) {
      return session.user.email.split('@')[0];
    }
    
    return '';
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!session?.user) return 'U';
    
    const firstName = session.user.firstName || '';
    const lastName = session.user.lastName || '';
    
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    
    if (firstName) {
      return firstName.charAt(0).toUpperCase();
    }
    
    const name = getUserDisplayName();
    return name.charAt(0).toUpperCase();
  };

  // Get user email
  const getUserEmail = () => {
    return session?.user?.email || '';
  };

  // Get user phone
  const getUserPhone = () => {
    return session?.user?.phone || '';
  };

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-orange-600 focus:text-white focus:rounded-lg focus:shadow-lg"
      >
        Skip to main content
      </a>
      
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 font-sans shadow-sm transition-all duration-300",
        scrolled ? "pb-2" : "pb-3 md:pb-4"
      )}>
        <TopBar />
        <div className={cn(sacredStyles.container, scrolled ? "py-2" : "py-2 md:py-3")}>
          <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className={cn(
              "font-playfair font-bold tracking-tight transition-all duration-300",
              scrolled ? "text-xl sm:text-2xl" : "text-xl sm:text-2xl lg:text-3xl"
            )}>
              <span className="midnight-blue-gradient-text">Sham</span>
              <span className="sacred-gradient-text">Bit</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(sacredStyles.button.ghost, "px-0 py-0 text-sm xl:text-base whitespace-nowrap")}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search Button */}
            <div
              onClick={() => setIsSearchOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors touch-manipulation group cursor-pointer"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsSearchOpen(true);
                }
              }}
              aria-label="Search"
              suppressHydrationWarning
            >
              <Search className="w-5 h-5" />
              <span className="hidden md:inline text-sm">Search</span>
              <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-1 text-xs font-mono bg-gray-100 text-gray-600 rounded border border-gray-200 group-hover:border-orange-300">
                <span>⌘</span>K
              </kbd>
            </div>

            {/* Mobile Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="sm:hidden p-2 text-gray-600 hover:text-orange-600 transition-colors touch-manipulation"
              aria-label="Search"
              suppressHydrationWarning
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Login / User Menu */}
            {status === 'loading' ? (
              <div className="hidden lg:flex items-center space-x-2 px-4 py-2">
                <div className="w-5 h-5 border-2 border-gray-300 border-t-orange-600 rounded-full animate-spin"></div>
              </div>
            ) : session?.user ? (
              <div className="hidden lg:block relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 px-4 py-2 text-slate-900 hover:bg-orange-50 rounded-lg transition-colors"
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-semibold text-sm">
                    {getUserInitials()}
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-sm max-w-[120px] truncate">{getUserDisplayName()}</span>
                    {getUserName() && (
                      <span className="text-xs text-gray-500 max-w-[120px] truncate">@{getUserName()}</span>
                    )}
                  </div>
                  <ChevronDown className={cn("w-4 h-4 transition-transform", isUserMenuOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-semibold text-lg">
                            {getUserInitials()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-base font-bold text-gray-900 truncate">{getUserDisplayName()}</p>
                            {getUserName() && (
                              <p className="text-sm text-gray-500 truncate">@{getUserName()}</p>
                            )}
                          </div>
                        </div>
                        <div className="space-y-1.5 text-xs text-gray-600">
                          {getUserEmail() && (
                            <div className="flex items-center space-x-2">
                              <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <span className="truncate">{getUserEmail()}</span>
                            </div>
                          )}
                          {getUserPhone() && (
                            <div className="flex items-center space-x-2">
                              <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              <span className="truncate">{getUserPhone()}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <Link
                        href="/dashboard"
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>

                      <Link
                        href="/profile"
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        href="/bookings"
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Calendar className="w-4 h-4" />
                        <span>My Bookings</span>
                      </Link>

                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoggingOut ? (
                            <>
                              <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin"></div>
                              <span>Signing out...</span>
                            </>
                          ) : (
                            <>
                              <LogOut className="w-4 h-4" />
                              <span>Sign Out</span>
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden lg:flex items-center space-x-2 px-4 py-2 text-slate-900 hover:bg-orange-50 rounded-lg transition-colors whitespace-nowrap"
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Login</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-orange-600 transition-colors touch-manipulation"
              aria-label="Toggle menu"
              suppressHydrationWarning
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Search Modal */}
        <AnimatePresence>
          {isSearchOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/50 z-50"
                onClick={() => setIsSearchOpen(false)}
              />

              {/* Search Box */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-50"
              >
                <div className="bg-white rounded-2xl shadow-2xl p-4">
                  <form onSubmit={handleSearch} className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search packages, cities, articles, experiences..."
                      className="w-full px-12 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                      autoFocus
                      suppressHydrationWarning
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <X className="w-5 h-5 text-gray-400" />
                      </button>
                    )}
                  </form>
                  <div className="mt-3 text-sm text-gray-500 px-2">
                    <p>Try: &quot;packages in ayodhya&quot;, &quot;hotels in mumbai&quot;, &quot;things to do in delhi&quot;</p>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="lg:hidden mt-4 pt-4 border-t border-gray-100 overflow-hidden"
            >
              <nav className="flex flex-col space-y-3 pb-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-700 hover:text-orange-600 transition-colors py-3 px-2 block text-base font-medium touch-manipulation active:bg-orange-50 rounded-lg"
                    onClick={() => {
                      setTimeout(() => setIsMenuOpen(false), 100);
                    }}
                  >
                    {item.name}
                  </Link>
                ))}

                {status === 'loading' ? (
                  <div className="flex items-center space-x-2 py-3 px-2">
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-orange-600 rounded-full animate-spin"></div>
                    <span className="text-gray-600">Loading...</span>
                  </div>
                ) : session?.user ? (
                  <>
                    <div className="border-t border-gray-100 pt-3 mt-2">
                      <div className="flex items-center space-x-3 py-3 px-3 bg-orange-50 rounded-lg">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                          {getUserInitials()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-bold text-gray-900 truncate">{getUserDisplayName()}</p>
                          {getUserName() && (
                            <p className="text-sm text-gray-600 truncate">@{getUserName()}</p>
                          )}
                          <div className="mt-1.5 space-y-0.5">
                            {getUserEmail() && (
                              <p className="text-xs text-gray-500 truncate flex items-center">
                                <svg className="w-3 h-3 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                {getUserEmail()}
                              </p>
                            )}
                            {getUserPhone() && (
                              <p className="text-xs text-gray-500 truncate flex items-center">
                                <svg className="w-3 h-3 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                {getUserPhone()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <Link
                      href="/dashboard"
                      className="flex items-center space-x-3 text-gray-700 hover:text-orange-600 transition-colors py-3 px-2 font-medium touch-manipulation active:bg-orange-50 rounded-lg"
                      onClick={() => {
                        setTimeout(() => setIsMenuOpen(false), 100);
                      }}
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      <span>Dashboard</span>
                    </Link>

                    <Link
                      href="/profile"
                      className="flex items-center space-x-3 text-gray-700 hover:text-orange-600 transition-colors py-3 px-2 font-medium touch-manipulation active:bg-orange-50 rounded-lg"
                      onClick={() => {
                        setTimeout(() => setIsMenuOpen(false), 100);
                      }}
                    >
                      <User className="w-5 h-5" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      href="/bookings"
                      className="flex items-center space-x-3 text-gray-700 hover:text-orange-600 transition-colors py-3 px-2 font-medium touch-manipulation active:bg-orange-50 rounded-lg"
                      onClick={() => {
                        setTimeout(() => setIsMenuOpen(false), 100);
                      }}
                    >
                      <Calendar className="w-5 h-5" />
                      <span>My Bookings</span>
                    </Link>

                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleLogout();
                      }}
                      disabled={isLoggingOut}
                      className="flex items-center space-x-3 text-red-600 hover:bg-red-50 transition-colors py-3 px-2 font-medium touch-manipulation rounded-lg disabled:opacity-50 disabled:cursor-not-allowed w-full text-left"
                    >
                      {isLoggingOut ? (
                        <>
                          <div className="w-5 h-5 border-2 border-red-300 border-t-red-600 rounded-full animate-spin"></div>
                          <span>Signing out...</span>
                        </>
                      ) : (
                        <>
                          <LogOut className="w-5 h-5" />
                          <span>Sign Out</span>
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center space-x-2 text-slate-900 hover:text-orange-600 transition-colors py-3 px-2 font-medium touch-manipulation active:bg-orange-50 rounded-lg"
                    onClick={() => {
                      setTimeout(() => setIsMenuOpen(false), 100);
                    }}
                  >
                    <User className="w-5 h-5" />
                    <span>Login</span>
                  </Link>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
    </>
  );
};

export default Header;