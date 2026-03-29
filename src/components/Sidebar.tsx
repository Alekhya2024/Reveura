'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  LayoutDashboard,
  BookOpen,
  ListChecks,
  Moon,
  TrendingUp,
  Settings,
  LogOut,
  Sparkles,
  Gamepad2,
  Image as ImageIcon,
  Trophy,
  Menu,
  X
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { quotes as allQuotes, getRandomQuote } from '@/lib/quotes';
import StressFreeAnimation from './StressFreeAnimation';
import { useSoundEffects } from '@/hooks/useSoundEffects';

const menuItems = [
  { icon: LayoutDashboard, labelKey: 'nav.dashboard', href: '/dashboard' },
  { icon: BookOpen, labelKey: 'nav.journal', href: '/journal' },
  { icon: ListChecks, labelKey: 'nav.habits', href: '/habits' },
  { icon: Moon, labelKey: 'nav.sleep', href: '/sleep' },
  { icon: Gamepad2, labelKey: 'nav.games', href: '/breathe' },
  { icon: ImageIcon, labelKey: 'nav.inspiration', href: '/inspiration' },
  { icon: Trophy, labelKey: 'nav.achievements', href: '/achievements' },
  { icon: TrendingUp, labelKey: 'nav.insights', href: '/insights' },
  { icon: Settings, labelKey: 'nav.settings', href: '/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { playNavigationSound, playWaterDropSound, playClickSound } = useSoundEffects();
  const [dailyQuote, setDailyQuote] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Get a quote based on the day to ensure consistency throughout the day
    const today = new Date().toDateString();
    const storedQuoteDate = localStorage.getItem('quoteDate');
    const storedQuote = localStorage.getItem('dailyQuote');

    if (storedQuoteDate === today && storedQuote) {
      setDailyQuote(storedQuote);
    } else {
      const newQuote = getRandomQuote();
      setDailyQuote(newQuote);
      localStorage.setItem('dailyQuote', newQuote);
      localStorage.setItem('quoteDate', today);
    }
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(!isOpen);
          playClickSound();
        }}
        className={`fixed top-4 left-4 z-[60] lg:hidden p-3 rounded-xl transition-all duration-300 ${
          theme === 'dark'
            ? 'bg-neutral-900/90 border border-red-900/30 text-white'
            : 'bg-white/90 border border-red-200 text-gray-900'
        } backdrop-blur-sm shadow-lg`}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </motion.button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: 0, opacity: 1 }}
        animate={{ 
          x: 0, 
          opacity: 1 
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`fixed left-0 top-0 h-screen w-64 border-r flex flex-col z-50 overflow-hidden transition-colors duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${theme === 'dark'
            ? 'bg-gradient-to-b from-black via-neutral-900 to-black border-red-900/30'
            : 'bg-gradient-to-b from-white via-gray-50 to-gray-100 border-red-200'
        }`}
      >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <Image
          src="/1.7.jpg"
          alt="Background"
          fill
          className="object-cover"
        />
      </div>
      {/* Logo */}
      <div className={`px-3 py-6 border-b relative z-10 ${theme === 'dark' ? 'border-neutral-800' : 'border-gray-200'}`}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center gap-1 reveura-logo"
        >
          <div className="text-center w-full">
            <h1 className="font-black bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent leading-none"
                style={{ fontFamily: "var(--font-display)", fontSize: "2rem", letterSpacing: "-0.06em" }}>
              REVEURA
            </h1>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto relative z-10">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href} onClick={() => playNavigationSound()}>
              <motion.div
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-900/50'
                    : theme === 'dark'
                    ? 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                }`}
              >
                <Icon size={20} />
                <span className="font-semibold text-sm" style={{ fontFamily: "var(--font-body)" }}>
                  {t(item.labelKey)}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Inspiration Card - Animated Stress Relief */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mx-4 mb-3 relative z-10"
      >
        <StressFreeAnimation />
      </motion.div>

      {/* Logout */}
      <div className={`p-4 border-t relative z-10 ${theme === 'dark' ? 'border-neutral-800' : 'border-gray-200'}`}>
        <motion.button
          onClick={() => {
            playWaterDropSound();
            // Clear user profile on logout
            localStorage.removeItem('reveura_user_profile');
            console.log('🚪 User logged out - profile cleared');
            // Redirect to homepage
            window.location.href = '/';
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer ${
            theme === 'dark'
              ? 'text-neutral-400 hover:text-red-500 hover:bg-neutral-800/50'
              : 'text-gray-600 hover:text-red-500 hover:bg-gray-200/50'
          }`}
        >
          <LogOut size={20} />
          <span className="font-medium text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
            {t('nav.logout')}
          </span>
        </motion.button>
      </div>
    </motion.aside>
    </>
  );
}
