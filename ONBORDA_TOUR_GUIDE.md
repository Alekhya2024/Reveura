# Reveura Guided Tour System

## Overview

The Reveura app uses **Onborda** library for a modern, elegant guided tour experience. The tour automatically starts for first-time users and can be triggered manually anytime.

## Features

✅ **Auto-start for new users** - Automatically launches 2 seconds after login
✅ **Theme-aware styling** - Adapts to dark/light mode seamlessly
✅ **Multi-language support** - Integrated with LanguageContext
✅ **Persistent state** - Remembers if user has completed the tour
✅ **Dismissible badge** - New user indicator can be hidden
✅ **Floating button** - Non-intrusive expandable tour trigger
✅ **Smooth animations** - Premium transitions and effects
✅ **Custom styling** - Fully branded with Reveura design system

## Components

### 1. OnboardingContext (`/src/contexts/OnboardingContext.tsx`)

Manages tour state and provides tour controls.

```typescript
const { showTour, startTour, closeTour, currentStep, setCurrentStep } = useOnboarding();
```

**Methods:**
- `startTour()` - Opens the guided tour
- `closeTour()` - Closes tour and marks as completed
- `showTour` - Boolean indicating if tour is active
- `currentStep` - Current step index
- `setCurrentStep(index)` - Jump to specific step

### 2. OnboardaTour (`/src/components/OnboardaTour.tsx`)

The main tour component with step definitions and custom UI.

**Tour Steps:**
1. **Welcome** - Intro to Reveura (targets `.reveura-logo`)
2. **Dashboard** - Overview of dashboard (targets `.dashboard-header`)
3. **Journal** - Journal navigation (targets `a[href="/journal"]`)
4. **Habits** - Habits navigation (targets `a[href="/habits"]`)
5. **Mood Tracking** - Mood selector (targets `.mood-selector`)
6. **Settings** - Settings navigation (targets `a[href="/settings"]`)
7. **Complete** - Completion message (targets `.dashboard-header`)

**Customization:**
```typescript
const customStyles = {
  card: { /* Popover card styling */ },
  title: { /* Step title styling */ },
  content: { /* Step description styling */ },
  button: { /* Navigation button styling */ },
  // ... more options
};
```

### 3. TourButton (`/src/components/NewTourButton.tsx`)

Provides two button variants for triggering the tour.

**Variants:**

**Floating** (default) - Bottom-right expandable button
```tsx
<TourButton variant="floating" label="Start Tour" />
```

**Inline** - Regular button for embedding in UI
```tsx
<TourButton variant="inline" label="Help & Tour" />
```

**Features:**
- Expands on hover to show label
- Shows "NEW" badge for first-time users
- Badge is dismissible (saves to localStorage)
- Pulsing ring animation for new users
- Shimmer effect on hover

## Usage Examples

### Basic Setup (Already configured)

```tsx
// In layout.tsx
import { OnboardingProvider } from '@/contexts/OnboardingContext';

<OnboardingProvider>
  {children}
</OnboardingProvider>
```

```tsx
// In dashboard/page.tsx
import { OnboardaTour } from '@/components/OnboardaTour';
import { TourButton } from '@/components/NewTourButton';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <OnboardaTour />
      <TourButton variant="floating" label="Start Tour" />
      {/* Your content */}
    </DashboardLayout>
  );
}
```

### Manually Trigger Tour

```tsx
'use client';

import { useOnboarding } from '@/contexts/OnboardingContext';

export function MyComponent() {
  const { startTour } = useOnboarding();
  
  return (
    <button onClick={startTour}>
      Start Guided Tour
    </button>
  );
}
```

### Add Tour to Other Pages

```tsx
import { OnboardaTour } from '@/components/OnboardaTour';
import { TourButton } from '@/components/NewTourButton';

export default function MyPage() {
  return (
    <div>
      <OnboardaTour />
      <TourButton variant="inline" label="Need Help?" />
      {/* Page content */}
    </div>
  );
}
```

## Adding New Tour Steps

Edit `/src/components/OnboardaTour.tsx`:

```typescript
const steps: Step[] = [
  // ... existing steps
  {
    icon: '🎯',
    title: t('tour.newfeature.title') || 'New Feature',
    content: t('tour.newfeature.description') || 'Description of the new feature',
    selector: '.new-feature-class', // CSS selector for element to highlight
    side: 'bottom', // 'top' | 'bottom' | 'left' | 'right'
    showControls: true,
    pointerPadding: 10,
    pointerRadius: 8,
  },
];
```

Then add translations in `/src/contexts/LanguageContext.tsx`:

```typescript
'tour.newfeature.title': 'New Feature',
'tour.newfeature.description': 'This is how you use the new feature...',
```

## Target Elements

Make sure elements have the correct classes/selectors:

```tsx
// Logo
<div className="reveura-logo">...</div>

// Dashboard header
<div className="dashboard-header">...</div>

// Mood selector
<div className="mood-selector">...</div>

// Navigation links (automatic)
<a href="/journal">Journal</a>
<a href="/habits">Habits</a>
<a href="/settings">Settings</a>
```

## Styling Customization

The tour inherits your theme automatically. To customize further:

```typescript
// In OnboardaTour.tsx
const customStyles = {
  card: {
    background: theme === 'dark' ? '#1a1a1a' : '#ffffff',
    border: `2px solid ${theme === 'dark' ? '#ef4444' : '#dc2626'}`,
    borderRadius: '16px',
    // ... custom properties
  },
  // Modify other elements
};
```

## LocalStorage Keys

- `reveura_tour_completed` - Boolean indicating tour completion
- `reveura_tour_badge_dismissed` - Boolean indicating if "NEW" badge was dismissed
- `reveura_user_profile` - User profile (checked for auto-start)

## Auto-start Behavior

The tour automatically starts when:
1. User has a profile (`reveura_user_profile` exists)
2. User hasn't completed the tour (`reveura_tour_completed` doesn't exist)
3. 2 seconds after page load

To disable auto-start, remove the useEffect in `OnboardingContext.tsx`.

## Best Practices

1. **Keep steps concise** - 3-7 steps is ideal
2. **Use clear icons** - Emoji work great for quick recognition
3. **Test on mobile** - Ensure popovers don't overflow on small screens
4. **Update selectors** - If you change class names, update tour selectors
5. **Translate everything** - Add tour text to all supported languages
6. **Test both themes** - Verify visibility in dark and light modes

## Troubleshooting

**Tour doesn't start:**
- Check that element selectors exist in DOM
- Verify OnboardingProvider wraps your app
- Check browser console for errors

**Elements not highlighting:**
- Ensure selector is correct (check DevTools)
- Element might be hidden or not rendered
- Try using ID instead of class

**Styling issues:**
- Check theme context is available
- Verify customStyles object structure
- Test in both dark and light themes

**Auto-start not working:**
- Clear localStorage and test with fresh state
- Check that user profile exists
- Verify 2-second delay hasn't been modified

## API Reference

### useOnboarding Hook

```typescript
interface OnboardingContextType {
  showTour: boolean;        // Is tour currently active
  startTour: () => void;    // Start/restart the tour
  closeTour: () => void;    // Close tour and mark completed
  currentStep: number;      // Current step index (0-based)
  setCurrentStep: (step: number) => void; // Jump to specific step
}
```

### Step Interface

```typescript
interface Step {
  icon?: string;           // Emoji or icon character
  title: string;          // Step title
  content: string;        // Step description
  selector: string;       // CSS selector for element
  side?: 'top' | 'bottom' | 'left' | 'right'; // Popover position
  showControls?: boolean; // Show next/prev buttons
  pointerPadding?: number; // Padding around highlighted element
  pointerRadius?: number;  // Border radius of highlight
}
```

## Migration from Driver.js

The old tour system using Driver.js has been completely removed. Onborda provides:
- Better React 19 compatibility
- More modern design
- Easier customization
- Smaller bundle size
- Better mobile support

No manual migration needed - the new system is ready to use!

## Support

For issues or questions:
1. Check that all tour dependencies are installed: `npm install onborda`
2. Verify component imports match documentation
3. Test with localStorage cleared
4. Check browser console for errors

## License

This tour system uses the Onborda library under MIT license.
