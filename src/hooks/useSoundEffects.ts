import { useSound } from '@/contexts/SoundContext';
import { MouseEvent } from 'react';

export function useSoundEffects() {
  const { playSound } = useSound();

  const playClickSound = () => {
    playSound('click');
  };

  const playWaterDropSound = () => {
    playSound('water-drop');
  };

  const playSoftClickSound = () => {
    playSound('soft-click');
  };

  const playNavigationSound = () => {
    playSound('navigation');
  };

  // Enhanced click handler that plays sound
  const withSound = (
    handler?: (e: MouseEvent<HTMLElement>) => void,
    soundType: 'click' | 'water-drop' | 'soft-click' | 'navigation' = 'click'
  ) => {
    return (e: MouseEvent<HTMLElement>) => {
      playSound(soundType);
      handler?.(e);
    };
  };

  return {
    playClickSound,
    playWaterDropSound,
    playSoftClickSound,
    playNavigationSound,
    withSound,
  };
}
