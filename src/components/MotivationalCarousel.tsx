'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { quotes as allQuotes } from '@/lib/quotes';
import { carouselImages, getTotalImages } from '@/lib/images';

export default function MotivationalCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      // Cycle through all 100 quotes
      setCurrentIndex((prev) => (prev + 1) % allQuotes.length);
    }, 15000); // 15 seconds per quote

    return () => clearInterval(interval);
  }, []);

  if (!isClient) return null;

  const currentQuote = allQuotes[currentIndex];
  const currentImage = carouselImages[currentIndex % carouselImages.length];
  const totalQuotes = allQuotes.length;

  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl w-full h-56 sm:h-64 md:h-72 shadow-2xl">
      {/* Background Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`image-${currentIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <Image
            src={`/${currentImage}`}
            alt={`Motivational image ${currentIndex + 1}`}
            fill
            className="object-cover"
            priority
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Quote at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={`quote-${currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="flex items-start gap-2 sm:gap-3"
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-2xl sm:text-3xl flex-shrink-0 mt-1"
            >
              ✨
            </motion.div>
            <div className="flex-1">
              <p className="text-white text-sm sm:text-base md:text-lg lg:text-xl font-light leading-snug line-clamp-2 sm:line-clamp-3">
                "{currentQuote}"
              </p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-amber-400 text-[10px] sm:text-xs md:text-sm mt-1 sm:mt-2 font-medium"
              >
                Quote #{currentIndex + 1} of {totalQuotes}
              </motion.p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress Bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-amber-400 via-red-500 to-pink-500"
        key={`progress-${currentIndex}`}
        initial={{ width: '0%' }}
        animate={{ width: '100%' }}
        transition={{ duration: 15, ease: 'linear' }}
      />

      {/* Counter Badge */}
      <div className="absolute top-4 right-4 z-20">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="px-4 py-2 rounded-full bg-white/15 backdrop-blur-md text-white text-sm font-semibold border border-white/20"
        >
          {currentIndex + 1} / {totalQuotes}
        </motion.div>
      </div>
    </div>
  );
}
