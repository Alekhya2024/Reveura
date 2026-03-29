'use client';

import { useOnboarding } from '@/contexts/OnboardingContext';
import { HelpCircle, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface TourButtonProps {
  variant?: 'floating' | 'inline';
  label?: string;
}

export function TourButton({ variant = 'floating', label = 'Start Tour' }: TourButtonProps) {
  const { startTour } = useOnboarding();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tourCompleted = localStorage.getItem('reveura_tour_completed');
      const badgeDismissed = localStorage.getItem('reveura_tour_badge_dismissed');
      
      if (!tourCompleted && !badgeDismissed) {
        setShowBadge(true);
      }
    }
  }, []);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDismissed(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('reveura_tour_badge_dismissed', 'true');
    }
  };

  const handleStartTour = () => {
    setShowBadge(false);
    startTour();
  };

  if (isDismissed) return null;

  if (variant === 'inline') {
    return (
      <button
        onClick={handleStartTour}
        className="group relative px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-500 
                   hover:from-red-500 hover:to-red-600 text-white rounded-xl 
                   font-semibold shadow-lg hover:shadow-xl transition-all duration-300 
                   hover:scale-105 active:scale-95 flex items-center gap-2"
      >
        <HelpCircle className="w-5 h-5" />
        <span>{label}</span>
      </button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-6 right-6 z-50"
      >
        {/* New user badge with dismiss button */}
        {showBadge && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 z-20"
          >
            <div className="relative">
              <div className="bg-yellow-400 text-yellow-900 rounded-full px-2.5 py-1 
                              text-xs font-bold shadow-lg flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>NEW</span>
              </div>
              
              {/* Dismiss button - separate from main button */}
              <div
                onClick={handleDismiss}
                className="absolute -top-1 -right-1 bg-gray-800 hover:bg-gray-700 
                           text-white rounded-full w-5 h-5 flex items-center justify-center 
                           text-xs transition-colors cursor-pointer"
                aria-label="Dismiss badge"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleDismiss(e as any);
                  }
                }}
              >
                <X className="w-3 h-3" />
              </div>
            </div>
          </motion.div>
        )}
        
        <motion.button
          onHoverStart={() => setIsExpanded(true)}
          onHoverEnd={() => setIsExpanded(false)}
          onClick={handleStartTour}
          className="group relative bg-gradient-to-br from-red-600 to-red-700 
                     text-white rounded-full shadow-2xl hover:shadow-red-500/50 
                     transition-all duration-300 hover:scale-105 active:scale-95 
                     flex items-center gap-3 overflow-hidden"
          style={{
            padding: isExpanded ? '1rem 1.5rem' : '1rem',
          }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                          translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          
          {/* Icon */}
          <HelpCircle className="w-6 h-6 relative z-10" />
          
          {/* Label */}
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 'auto', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="font-semibold whitespace-nowrap relative z-10"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
          
          {/* Pulsing ring for new users */}
          {showBadge && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-red-400"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}
