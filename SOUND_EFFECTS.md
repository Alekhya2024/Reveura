# Sound Effects System

## Overview
The wellness app now features immersive nature-themed sound effects that play on user interactions, creating a more engaging and calming experience.

## Sound Files
Located in `/public/sounds/`:
- **water-drop.mp3** - Gentle water drop sound for mood selections and important actions
- **button-click.mp3** - Subtle click for general button interactions
- **soft-click.mp3** - Soft navigation sound for menu items

## Implementation

### SoundContext
- Global sound management system
- Enable/disable sounds via settings
- Preloads all sounds for instant playback
- Stores user preference in localStorage

### useSoundEffects Hook
Located in `/src/hooks/useSoundEffects.ts`:
- `playClickSound()` - For general button clicks
- `playWaterDropSound()` - For special interactions (moods, saves, completions)
- `playSoftClickSound()` - For subtle interactions
- `playNavigationSound()` - For menu navigation
- `withSound()` - HOC to add sound to any click handler

### Usage Example
```tsx
import { useSoundEffects } from '@/hooks/useSoundEffects';

function MyComponent() {
  const { playWaterDropSound, withSound } = useSoundEffects();
  
  // Direct usage
  const handleClick = () => {
    playWaterDropSound();
    // ... your logic
  };
  
  // Or with HOC
  return (
    <button onClick={withSound(handleClick, 'water-drop')}>
      Click me
    </button>
  );
}
```

## Settings Control
Users can toggle sound effects on/off in:
**Settings → Preferences → Sound Effects**

## Where Sounds Are Used
- ✅ Sidebar navigation - soft click
- ✅ Logout button - water drop
- ✅ Mood selection - water drop
- ✅ Habit completion - water drop
- ✅ Journal save - water drop
- ✅ Settings toggles - click

## Volume
All sounds are set to 30% volume (0.3) to be pleasant and not intrusive.

## Performance
- Sounds are preloaded on app initialization
- Audio elements are reused (not recreated on each play)
- Errors are silently handled (autoplay restrictions, rapid clicks)
