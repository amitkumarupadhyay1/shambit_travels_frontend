'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, User, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, sacredStyles } from '@/lib/utils';
import TopBar from './TopBar';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const navigation = [
    { name: 'Destinations', href: '/destinations' },
    { name: 'Packages', href: '/packages' },
    { name: 'Experiences', href: '/experiences' },
    { name: 'Booking', href: '/booking' },
    { name: 'Articles', href: '/articles' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 font-sans shadow-sm">
      <TopBar />
      <div className={cn(sacredStyles.container, "py-3 md:py-4")}>
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="text-xl sm:text-2xl lg:text-3xl font-playfair font-bold tracking-tight">
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
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors touch-manipulation group"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
              <span className="hidden md:inline text-sm">Search</span>
              <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-1 text-xs font-mono bg-gray-100 text-gray-600 rounded border border-gray-200 group-hover:border-orange-300">
                <span>⌘</span>K
              </kbd>
            </button>
            
            {/* Mobile Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="sm:hidden p-2 text-gray-600 hover:text-orange-600 transition-colors touch-manipulation"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Login */}
            <Link
              href="/login"
              className="hidden lg:flex items-center space-x-2 text-slate-900 hover:text-orange-600 transition-colors whitespace-nowrap"
            >
              <User className="w-5 h-5" />
              <span className="font-medium">Login</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-orange-600 transition-colors touch-manipulation"
              aria-label="Toggle menu"
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
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;