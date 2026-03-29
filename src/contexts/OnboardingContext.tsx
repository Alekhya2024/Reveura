'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface OnboardingContextType {
  showTour: boolean;
  startTour: () => void;
  closeTour: () => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showTour, setShowTour] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Auto-start tour for first-time users - check on every mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const tourCompleted = localStorage.getItem('reveura_tour_completed');
    const userProfile = localStorage.getItem('reveura_user_profile');
    
    // Only auto-start if:
    // 1. User profile exists (user is logged in)
    // 2. Tour hasn't been completed
    // 3. User profile was recently created (within last 10 seconds)
    if (userProfile && !tourCompleted) {
      try {
        const profile = JSON.parse(userProfile);
        const loginTime = new Date(profile.loginTime).getTime();
        const now = new Date().getTime();
        const timeSinceLogin = now - loginTime;
        
        // Auto-start if login was recent (within 10 seconds)
        if (timeSinceLogin < 10000) {
          console.log('🎯 Auto-starting tour for new user...');
          const timer = setTimeout(() => {
            setShowTour(true);
          }, 2500); // 2.5 second delay to let the page load
          
          return () => clearTimeout(timer);
        } else {
          console.log('ℹ️ Login not recent, skipping auto-start');
        }
      } catch (error) {
        console.error('Error parsing user profile:', error);
      }
    } else if (tourCompleted) {
      console.log('✅ User has already completed the tour');
    } else {
      console.log('ℹ️ No user profile found, skipping auto-start');
    }
  }, []); // Empty dependency array - runs once on mount
  
  // Listen for storage changes (e.g., when user logs in)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleStorageChange = (e: StorageEvent) => {
      // Detect new login (user profile added)
      if (e.key === 'reveura_user_profile' && e.newValue && !e.oldValue) {
        console.log('🔔 Login detected via storage event');
        const tourCompleted = localStorage.getItem('reveura_tour_completed');
        if (!tourCompleted) {
          console.log('🎯 Starting tour after login...');
          setTimeout(() => setShowTour(true), 2500);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const startTour = () => {
    setShowTour(true);
    setCurrentStep(0);
  };

  const closeTour = () => {
    setShowTour(false);
    setCurrentStep(0);
    if (typeof window !== 'undefined') {
      localStorage.setItem('reveura_tour_completed', 'true');
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        showTour,
        startTour,
        closeTour,
        currentStep,
        setCurrentStep,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
};
