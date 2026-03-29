# 🎯 Reveura Guided Tour System

## Overview
Advanced, animated guided tour system using **Driver.js** - a modern, lightweight tour library with beautiful animations and transitions.

## ✨ Features Implemented

### 🎨 **Premium Design**
- Theme-aware styling (Dark & Light modes)
- Glassmorphism effects
- Smooth animations and transitions
- Custom branded colors (Red gradient theme)
- Responsive design for all devices

### 📍 **Five Complete Tours**

1. **Welcome Tour** (`welcome`)
   - Logo introduction
   - Dashboard overview
   - Journal features
   - Habits tracker
   - Sleep log
   - Settings customization

2. **Dashboard Tour** (`dashboard`)
   - Dashboard overview
   - Mood selector
   - Quick actions
   - Statistics overview

3. **Journal Tour** (`journal`)
   - Journal introduction
   - Create entry button
   - View toggles (Grid/Timeline/Calendar)
   - Mood filters
   - Analytics section

4. **Habits Tour** (`habits`)
   - Habit tracker overview
   - Add habit button
   - View modes (Week/Month/Streak)
   - Statistics dashboard
   - Completing habits

5. **Settings Tour** (`settings`)
   - Settings overview
   - Profile section
   - Theme toggle
   - Language selector (12 languages!)
   - Notifications preferences

### 🎯 **Smart Features**

- **First-time User Detection**: Tours automatically show for new users with pulsing "!" indicator
- **Tour Progress Tracking**: Shows "X of Y" steps
- **localStorage Persistence**: Remembers which tours user has seen
- **Manual Trigger**: Floating tour button on each page
- **Tour Reset**: Admin function to reset all tours
- **Dismissible**: Users can close tour button with X
- **Smooth Scrolling**: Auto-scrolls to highlighted elements
- **Keyboard Navigation**: Arrow keys and ESC support

## 📂 Files Created

### Core Files
- `/src/contexts/TourContext.tsx` - Tour provider and logic
- `/src/components/TourButton.tsx` - Floating tour button component
- `/src/app/tour.css` - Custom styling for tour popovers

### Updated Files
- `/src/app/layout.tsx` - Added TourProvider wrapper
- `/src/app/dashboard/page.tsx` - Added tour button
- `/src/app/settings/page.tsx` - Added tour button + class names
- `/src/components/Sidebar.tsx` - Added class names for tour targeting

## 🚀 How to Use

### For Users

#### Start a Tour
1. **Floating Button**: Click the floating "Start Tour" / "🚀 Take a Tour" button on any page
2. **Auto-Start**: First-time users see tours automatically
3. **Navigation**: Use "→ Next" and "← Back" buttons
4. **Complete**: Click "✓ Done" or ESC to finish

#### Tour Controls
- **Next Step**: Click "→ Next" or press →
- **Previous Step**: Click "← Back" or press ←
- **Close Tour**: Press ESC or click X button
- **Dismiss Button**: Click X on floating button to hide it

### For Developers

#### Add Tour to a Page

```tsx
import TourButton from '@/components/TourButton';

export default function MyPage() {
  return (
    <div>
      {/* Floating tour button (bottom-right) */}
      <TourButton tourName="mypage" label="🎯 Page Tour" />
      
      {/* OR inline button */}
      <TourButton 
        tourName="mypage" 
        label="Help" 
        position="inline"
        className="my-custom-class"
      />
      
      {/* Your page content */}
    </div>
  );
}
```

#### Use Tour Programmatically

```tsx
import { useTour } from '@/contexts/TourContext';

function MyComponent() {
  const { startTour, hasSeenTour, markTourAsSeen, resetAllTours } = useTour();
  
  // Start a specific tour
  const handleHelp = () => {
    startTour('dashboard');
  };
  
  // Check if user has seen a tour
  if (!hasSeenTour('welcome')) {
    // Show onboarding
  }
  
  // Manually mark tour as seen
  markTourAsSeen('mypage');
  
  // Reset all tours (admin function)
  const handleReset = () => {
    resetAllTours();
  };
  
  return <button onClick={handleHelp}>Show Tour</button>;
}
```

#### Create a New Tour

Edit `/src/contexts/TourContext.tsx`:

```tsx
const tours: Record<string, DriveStep[]> = {
  // ... existing tours
  
  mypage: [
    {
      popover: {
        title: '🎉 Welcome!',
        description: 'Let me show you around this page.',
      },
    },
    {
      element: '.my-element',
      popover: {
        title: '📝 Important Feature',
        description: 'This is how you use this feature.',
        side: 'bottom', // top, bottom, left, right
        align: 'start', // start, center, end
      },
    },
    {
      element: '#another-element',
      popover: {
        title: '⚡ Quick Tip',
        description: 'Pro tip: Use keyboard shortcuts!',
        side: 'right',
      },
    },
  ],
};
```

#### Add Class Names for Targeting

Add specific class names or IDs to elements you want to highlight:

```tsx
<div className="my-important-feature">
  {/* Tour will highlight this */}
</div>

<button id="create-button">
  {/* Tour will highlight this */}
</button>
```

## 🎨 Customization

### Theme Colors

The tour automatically adapts to your theme (dark/light). Colors are defined in `/src/app/tour.css`:

```css
/* Dark theme - edit these */
.reveura-tour-popover.dark-theme .driver-popover {
  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
  border: 2px solid rgba(239, 68, 68, 0.3);
}

/* Light theme - edit these */
.reveura-tour-popover.light-theme .driver-popover {
  background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
  border: 2px solid rgba(239, 68, 68, 0.2);
}
```

### Button Position

```tsx
{/* Bottom-right corner (default) */}
<TourButton tourName="mypage" />

{/* Inline with your content */}
<TourButton tourName="mypage" position="inline" />

{/* Custom styling */}
<TourButton 
  tourName="mypage" 
  position="inline"
  className="mt-4 w-full"
/>
```

### Tour Configuration

Edit Driver.js config in `/src/contexts/TourContext.tsx`:

```tsx
const config: Config = {
  showProgress: true,           // Show "1 of 5"
  animate: true,                // Smooth animations
  overlayOpacity: 0.75,         // Background darkness
  smoothScroll: true,           // Auto-scroll to elements
  allowClose: true,             // Can close with ESC
  stagePadding: 10,             // Space around highlighted element
  stageRadius: 10,              // Border radius of highlight
  // ... more options
};
```

## 📊 Tour Analytics

Tours are tracked in localStorage:

```javascript
// Get seen tours
const seenTours = JSON.parse(
  localStorage.getItem('reveura_seen_tours') || '[]'
);
// Example: ['welcome', 'dashboard', 'settings']

// Reset for testing
localStorage.removeItem('reveura_seen_tours');
```

## 🎯 Best Practices

### 1. Keep Tours Short
- 5-7 steps maximum
- Focus on key features only
- Don't overwhelm users

### 2. Use Clear Language
- Action-oriented titles
- Concise descriptions
- Emoji for visual interest 🎨

### 3. Logical Flow
- Start with overview
- Follow natural user flow
- End with call-to-action

### 4. Test Thoroughly
- Test in both themes
- Test on mobile devices
- Verify element targeting

### 5. Element Selection
- Use stable selectors (class/id)
- Avoid dynamic selectors
- Test after UI changes

## 🐛 Troubleshooting

### Tour Not Showing
```tsx
// Check if element exists
const element = document.querySelector('.my-element');
if (!element) {
  console.log('Element not found!');
}

// Check if tour is defined
import { useTour } from '@/contexts/TourContext';
const { startTour } = useTour();
console.log('Starting tour...');
startTour('mypage');
```

### Element Not Highlighted
- Ensure element has the exact class/id
- Check if element is visible (not `display: none`)
- Verify selector in browser DevTools
- Make sure element is rendered when tour starts

### Styling Issues
- Check theme class on popover
- Verify CSS is imported in layout.tsx
- Clear browser cache
- Check for CSS conflicts

### Reset Tours for Testing
```tsx
// In browser console
localStorage.removeItem('reveura_seen_tours');
location.reload();

// Or use the hook
const { resetAllTours } = useTour();
resetAllTours();
```

## 🌟 Examples

### Page-Specific Tour
```tsx
'use client';
import TourButton from '@/components/TourButton';
import { useEffect } from 'react';
import { useTour } from '@/contexts/TourContext';

export default function NewFeaturePage() {
  const { startTour, hasSeenTour } = useTour();
  
  // Auto-start for first-time visitors
  useEffect(() => {
    if (!hasSeenTour('new-feature')) {
      setTimeout(() => startTour('new-feature'), 1000);
    }
  }, []);
  
  return (
    <div>
      <TourButton tourName="new-feature" label="✨ Discover Features" />
      <div className="feature-highlight">New Feature Here!</div>
    </div>
  );
}
```

### Conditional Tour
```tsx
const { startTour } = useTour();

const handleCompleteOnboarding = () => {
  // User completed signup
  startTour('welcome');
};
```

### Multi-Page Tour Flow
```tsx
// Page 1
const { startTour } = useTour();

const goToNextPage = () => {
  router.push('/next-page');
  // Tour continues on next page
  setTimeout(() => startTour('next-page'), 500);
};
```

## 📱 Mobile Support

Tours are fully responsive:
- Adaptive popover sizing
- Touch-friendly buttons
- Optimized text sizes
- Smart positioning

## 🎓 Learning Resources

- **Driver.js Docs**: https://driverjs.com
- **Tour UX Best Practices**: Keep it simple, contextual, and optional
- **Accessibility**: All tours support keyboard navigation and screen readers

## 🔧 Advanced Features

### Custom Popover HTML
```tsx
{
  element: '.feature',
  popover: {
    title: '<strong>🎨 Custom Title</strong>',
    description: `
      <div class="custom-content">
        <p>Rich HTML content</p>
        <img src="/demo.gif" alt="Demo" />
      </div>
    `,
  },
}
```

### Callbacks
```tsx
const driverInstance = driver({
  onHighlightStarted: (element) => {
    console.log('Highlighting:', element);
  },
  onDeselected: (element) => {
    console.log('Deselected:', element);
  },
  onDestroyed: () => {
    console.log('Tour completed!');
    // Track analytics
  },
});
```

## 🎉 Summary

Your Reveura app now has:
✅ Professional guided tours on all major pages
✅ Beautiful animations and theme-aware styling
✅ Smart first-time user detection
✅ Floating tour buttons with dismiss option
✅ Progress tracking and localStorage persistence
✅ Mobile-responsive design
✅ Keyboard navigation support
✅ Easy customization and extension

**Test it out**: Navigate to Dashboard or Settings and click the floating tour button! 🚀
