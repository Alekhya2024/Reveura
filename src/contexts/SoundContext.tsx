'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SoundContextType {
  soundEnabled: boolean;
  toggleSound: () => void;
  playSound: (soundType: 'click' | 'water-drop' | 'soft-click' | 'navigation') => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [audioElements, setAudioElements] = useState<{ [key: string]: HTMLAudioElement }>({});

  useEffect(() => {
    // Load sound preference from localStorage
    const savedPreference = localStorage.getItem('soundEnabled');
    if (savedPreference !== null) {
      setSoundEnabled(savedPreference === 'true');
    }

    // Preload all sounds
    const sounds = {
      'click': new Audio('/sounds/button-click.mp3'),
      'water-drop': new Audio('/sounds/water-drop.mp3'),
      'soft-click': new Audio('/sounds/soft-click.mp3'),
      'navigation': new Audio('/sounds/soft-click.mp3'),
    };

    // Set volume for each sound
    Object.values(sounds).forEach(audio => {
      audio.volume = 0.3;
      audio.preload = 'auto';
    });

    setAudioElements(sounds);
  }, []);

  const toggleSound = () => {
    setSoundEnabled(prev => {
      const newValue = !prev;
      localStorage.setItem('soundEnabled', String(newValue));
      return newValue;
    });
  };

  const playSound = (soundType: 'click' | 'water-drop' | 'soft-click' | 'navigation') => {
    if (!soundEnabled || !audioElements[soundType]) return;

    const audio = audioElements[soundType];
    audio.currentTime = 0; // Reset to start for rapid clicks
    audio.play().catch(error => {
      // Ignore errors from rapid clicking or autoplay restrictions
      console.debug('Sound play prevented:', error);
    });
  };

  return (
    <SoundContext.Provider value={{ soundEnabled, toggleSound, playSound }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
}
