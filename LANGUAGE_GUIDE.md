# How to Use the Multi-Language System

## Overview
Your Reveura app now supports 12 major world languages:
- 🇬🇧 English
- 🇪🇸 Spanish (Español)
- 🇨🇳 Chinese (中文)
- 🇮🇳 Hindi (हिन्दी)
- 🇸🇦 Arabic (العربية) - with RTL support
- 🇫🇷 French (Français)
- 🇩🇪 German (Deutsch)
- 🇯🇵 Japanese (日本語)
- 🇵🇹 Portuguese (Português)
- 🇷🇺 Russian (Русский)
- 🇰🇷 Korean (한국어)
- 🇮🇹 Italian (Italiano)

## How It Works

### 1. Language Context
The `LanguageContext` provides:
- `language`: Current selected language code
- `setLanguage(code)`: Change the language
- `t(key)`: Translate a text key

### 2. Using Translations in Components

```tsx
'use client';
import { useLanguage } from '@/contexts/LanguageContext';

export default function MyComponent() {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1>{t('nav.dashboard')}</h1>
      <p>{t('dashboard.welcome')}</p>
      <button>{t('common.save')}</button>
    </div>
  );
}
```

### 3. Available Translation Keys

#### Common
- `app.name` - Application name
- `app.tagline` - Tagline
- `common.save`, `common.cancel`, `common.delete`, `common.edit`, `common.add`
- `common.close`, `common.back`, `common.next`, `common.previous`
- `common.confirm`, `common.loading`

#### Authentication
- `auth.signin`, `auth.signup`, `auth.email`, `auth.password`
- `auth.welcome`, `auth.welcomeBack`, `auth.description`
- `auth.terms`, `auth.privacy`

#### Navigation
- `nav.dashboard`, `nav.journal`, `nav.habits`, `nav.sleep`
- `nav.games`, `nav.inspiration`, `nav.achievements`
- `nav.insights`, `nav.settings`, `nav.logout`

#### Dashboard
- `dashboard.welcome`, `dashboard.moodToday`, `dashboard.quickActions`
- `dashboard.stats`, `dashboard.streak`, `dashboard.entries`

#### Journal
- `journal.title`, `journal.subtitle`, `journal.newEntry`
- `journal.mood`, `journal.weather`, `journal.tags`
- `journal.gridView`, `journal.timelineView`, `journal.calendarView`
- `journal.analytics`, `journal.moodDistribution`

#### Habits
- `habits.title`, `habits.subtitle`, `habits.addHabit`
- `habits.name`, `habits.description`, `habits.category`
- `habits.weekView`, `habits.monthView`, `habits.streakView`
- `habits.currentStreak`, `habits.bestStreak`

#### Moods
- `mood.amazing`, `mood.happy`, `mood.calm`
- `mood.neutral`, `mood.anxious`, `mood.sad`

#### Settings
- `settings.title`, `settings.subtitle`, `settings.theme`
- `settings.language`, `settings.weekStarts`
- `settings.saveChanges`, `settings.unsavedChanges`

#### Days of Week
- `day.sun`, `day.mon`, `day.tue`, `day.wed`, `day.thu`, `day.fri`, `day.sat`
- `day.sunday`, `day.monday`, etc. (full names)

### 4. Changing Language

Users can change language in Settings > Preferences > Language.
The selection is saved to localStorage and persists across sessions.

```tsx
const { setLanguage } = useLanguage();

// Change to Spanish
setLanguage('es');

// Change to Chinese
setLanguage('zh');
```

### 5. RTL Support

Arabic automatically enables RTL (right-to-left) layout when selected.

### 6. Adding New Translations

Edit `/src/contexts/LanguageContext.tsx`:

```tsx
const translations: Record<Language, Record<string, string>> = {
  en: {
    'myapp.newkey': 'My New Text',
    // ... more keys
  },
  es: {
    'myapp.newkey': 'Mi Nuevo Texto',
    // ... more keys
  },
  // ... other languages
};
```

### 7. Example: Update a Component

**Before:**
```tsx
<h1>Welcome to Reveura</h1>
<button>Save Changes</button>
```

**After:**
```tsx
import { useLanguage } from '@/contexts/LanguageContext';

function MyComponent() {
  const { t } = useLanguage();
  
  return (
    <>
      <h1>{t('auth.welcome')}</h1>
      <button>{t('settings.saveChanges')}</button>
    </>
  );
}
```

### 8. Current Implementation Status

✅ **Fully Translated:**
- Settings page (Language selector with 12 languages)
- Translation infrastructure

🔄 **Ready to Translate:**
- Dashboard
- Journal
- Habits
- Sleep Log
- All other pages

### 9. Next Steps

To fully translate a page:
1. Import `useLanguage` hook
2. Get the `t` function
3. Replace hardcoded text with `t('translation.key')`
4. Test with different languages

Example for Dashboard:
```tsx
'use client';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Dashboard() {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1>{t('dashboard.welcome')}</h1>
      <p>{t('dashboard.moodToday')}</p>
      {/* ... rest of component */}
    </div>
  );
}
```

## Benefits

✨ **12 Languages** - Supports major world languages
💾 **Persistent** - Language choice saved in localStorage
🔄 **Instant** - Changes apply immediately across the entire app
🌍 **RTL Support** - Automatic right-to-left for Arabic
📱 **Responsive** - Works on all devices
🎨 **Integrated** - Works with theme system

## Testing

1. Go to Settings → Preferences
2. Change Language dropdown
3. See instant UI updates
4. Navigate to other pages (once translated)
5. Refresh page - language persists
