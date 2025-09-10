// Navigation Header Component - 野百灵·贵州酸汤
// Global navigation header with bilingual support

'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const navLinksEn = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/ingredients', label: 'Ingredients' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/our-team', label: 'Our Team' },
  { href: '/locations', label: 'Locations' },
];

const navLinksCn = [
  { href: '/', label: '首页' },
  { href: '/menu', label: '菜单' },
  { href: '/ingredients', label: '食材' },
  { href: '/gallery', label: '相册' },
  { href: '/our-team', label: '团队' },
  { href: '/locations', label: '门店' },
];

export default function NavigationHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'cn'>('cn');
  const pathname = usePathname();

  const navLinks = language === 'cn' ? navLinksCn : navLinksEn;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-lg' : 
      isMobileMenuOpen ? 'bg-black/60 backdrop-blur-3xl backdrop-saturate-150' : 'bg-transparent'
    }`}>
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className={`text-xl md:text-2xl font-light transition-colors ${
            isScrolled ? 'text-gray-900 dark:text-white' : 'text-white'
          }`}>
            野百灵·贵州酸汤
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-light transition-colors hover:opacity-70 ${
                  pathname === link.href
                    ? isScrolled ? 'text-gray-900 dark:text-white font-medium' : 'text-white font-medium'
                    : isScrolled ? 'text-gray-600 dark:text-gray-400' : 'text-white/90'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/#reservation"
              className={`px-4 py-2 text-sm rounded transition-all ${
                isScrolled
                  ? 'bg-gray-800 text-white hover:bg-gray-900 border border-gray-700'
                  : 'bg-white/20 text-white backdrop-blur hover:bg-white/30'
              }`}
            >
              {language === 'cn' ? '预订' : 'Reserve'}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 transition-colors ${
              isScrolled ? 'text-gray-900 dark:text-white' : 'text-white'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="lg:hidden overflow-hidden absolute left-0 right-0 top-full w-full z-50"
              style={{ backdropFilter: 'blur(40px) saturate(180%)', WebkitBackdropFilter: 'blur(40px) saturate(180%)' }}
            >
              <div className="py-8 px-6 bg-black/80 border-t border-white/20">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block py-4 text-lg font-light tracking-wide transition-all hover:pl-4 ${
                        pathname === link.href
                          ? 'text-white font-normal border-l-4 border-white/80 pl-3'
                          : 'text-white/90 hover:text-white'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                  className="mt-8 pt-6 border-t border-white/10"
                >
                  <Link
                    href="/#reservation"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-3 px-6 bg-white/20 backdrop-blur text-white rounded-lg text-center font-light tracking-wide hover:bg-white/30 transition-all"
                  >
                    {language === 'cn' ? '预订座位' : 'Make a Reservation'}
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}