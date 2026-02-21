import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, MessageCircle, Mail, Phone, MapPin, Heart, Lock, Shield } from 'lucide-react';
import { cn, sacredStyles } from '@/lib/utils';

const Footer = () => {
  const quickLinks = [
    { name: 'Destinations', href: '/destinations' },
    { name: 'Packages', href: '/packages' },
    { name: 'Experiences', href: '/experiences' },
    { name: 'Articles', href: '/articles' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const bookingServices = [
    { name: 'Hotels', href: '/hotels-booking' },
    { name: 'Railway Tickets', href: '/railway-tickets' },
    { name: 'Air Tickets', href: '/air-tickets' },
    { name: 'Bus Tickets', href: '/bus-tickets' },
    { name: 'Book Taxi', href: '/book-taxi' },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms & Conditions', href: '/terms-conditions' },
    { name: 'Refund Policy', href: '/refund-policy' },
    { name: 'GST Details', href: '/gst-details' },
  ];

  const socialLinks = [
    { name: 'Facebook', href: 'https://fb.com/shambitofficial', icon: Facebook },
    { name: 'Instagram', href: 'https://instagram.com/shambitofficial', icon: Instagram },
    { name: 'WhatsApp', href: 'https://wa.me/919005457111', icon: MessageCircle },
  ];

  return (
    <footer className="bg-gradient-to-br from-[#0F2027] via-[#203A43] to-[#2C5364] text-white">
      <div className={cn(sacredStyles.container, "py-16")}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-3 mb-6">
              <Image
                src="/logo.png"
                alt="ShamBit Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <div className="text-2xl lg:text-3xl font-playfair font-bold tracking-tight">
                <span className="text-white">Sham</span>
                <span className="sacred-gradient-text">Bit</span>
              </div>
            </Link>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Discover India&apos;s spiritual heritage through curated travel experiences.
              From sacred temples to cultural immersion, we craft journeys that touch the soul.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/10 rounded-lg hover:bg-primary-gold transition-colors duration-300"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-playfair text-xl font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-primary-gold transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Booking Services */}
          <div>
            <h3 className="font-playfair text-xl font-semibold mb-6">Booking Services</h3>
            <ul className="space-y-3">
              {bookingServices.map((service) => (
                <li key={service.name}>
                  <Link
                    href={service.href}
                    className="text-gray-300 hover:text-primary-gold transition-colors duration-300"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-playfair text-xl font-semibold mb-6">Contact</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary-gold" />
                <a
                  href="mailto:support@shambit.com"
                  className="text-gray-300 hover:text-primary-gold transition-colors duration-300"
                >
                  support@shambit.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary-gold" />
                <a
                  href="tel:+919005457111"
                  className="text-gray-300 hover:text-primary-gold transition-colors duration-300"
                >
                  +91 9005457111
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary-gold mt-1" />
                <span className="text-gray-300">
                  India
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Trust & Security Badges Section */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
            {/* SSL Badge */}
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg border border-green-500/30">
              <Lock className="w-5 h-5 text-green-400" aria-hidden="true" />
              <div className="text-left">
                <p className="text-xs font-semibold text-green-400">SSL Secured</p>
                <p className="text-xs text-gray-400">HTTPS Encrypted</p>
              </div>
            </div>

            {/* Secure Payment Badge */}
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg border border-blue-500/30">
              <Shield className="w-5 h-5 text-blue-400" aria-hidden="true" />
              <div className="text-left">
                <p className="text-xs font-semibold text-blue-400">Secure Payment</p>
                <p className="text-xs text-gray-400">PCI DSS Compliant</p>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg border border-orange-500/30">
              <div className="flex gap-1">
                <span className="text-lg">💳</span>
                <span className="text-lg">📱</span>
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-orange-400">All Payment Methods</p>
                <p className="text-xs text-gray-400">Visa, UPI, NetBanking</p>
              </div>
            </div>

            {/* Trusted Badge */}
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg border border-yellow-500/30">
              <span className="text-2xl">⭐</span>
              <div className="text-left">
                <p className="text-xs font-semibold text-yellow-400">Trusted by 10,000+</p>
                <p className="text-xs text-gray-400">Happy Travelers</p>
              </div>
            </div>
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            {legalLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-400 hover:text-primary-gold text-sm transition-colors duration-300"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-gray-700">
            <p className="text-gray-400 text-sm">
              © 2026 ShamBit. All rights reserved.
            </p>

            <div className="flex items-center space-x-1 text-sm text-gray-400 mt-2 md:mt-0">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span>in Ayodhya</span>
            </div>

            <Link
              href="/admin"
              className="text-gray-400 hover:text-primary-gold text-sm transition-colors duration-300 mt-4 md:mt-0"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;