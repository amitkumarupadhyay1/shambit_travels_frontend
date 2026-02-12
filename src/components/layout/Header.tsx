'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, User, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, sacredStyles } from '@/lib/utils';
import TopBar from './TopBar';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Destinations', href: '/destinations' },
    { name: 'Packages', href: '/packages' },
    { name: 'Experiences', href: '/experiences' },
    { name: 'Articles', href: '/articles' },
    { name: 'About', href: '/about' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 font-sans">
      <TopBar />
      <div className={cn(sacredStyles.container, "py-4")}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl lg:text-3xl font-playfair font-bold tracking-tight">
              <span className="midnight-blue-gradient-text">Sham</span>
              <span className="sacred-gradient-text">Bit</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(sacredStyles.button.ghost, "px-0 py-0")}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button className="p-2 text-gray-600 hover:text-orange-600 transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {/* Login */}
            <Link
              href="/login"
              className="hidden lg:flex items-center space-x-2 text-slate-900 hover:text-orange-600 transition-colors"
            >
              <User className="w-5 h-5" />
              <span className="font-medium">Login</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-orange-600 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden mt-4 pt-4 border-t border-gray-100 overflow-hidden"
            >
              <nav className="flex flex-col space-y-4 pb-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-700 hover:text-orange-600 transition-colors py-2 block"
                    onClick={() => {
                      // Allow navigation to complete before closing menu
                      setTimeout(() => setIsMenuOpen(false), 100);
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
                <Link
                  href="/login"
                  className="flex items-center space-x-2 text-slate-900 hover:text-orange-600 transition-colors py-2"
                  onClick={() => {
                    // Allow navigation to complete before closing menu
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