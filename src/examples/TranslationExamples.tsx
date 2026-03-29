/* 
 * TRANSLATION INTEGRATION EXAMPLE
 * 
 * This file demonstrates how to properly integrate the translation system
 * into your components. Use this as a reference when translating pages.
 */

'use client';

import { useLanguage } from '@/contexts/LanguageContext';

// Example 1: Basic Page Component
export function ExampleDashboard() {
  const { t, language } = useLanguage();
  
  return (
    <div>
      {/* Translated header */}
      <h1>{t('dashboard.welcome')}</h1>
      
      {/* Translated paragraph */}
      <p>{t('dashboard.moodToday')}</p>
      
      {/* Translated button */}
      <button>{t('common.save')}</button>
      
      {/* Current language display */}
      <p>Current language: {language}</p>
    </div>
  );
}

// Example 2: Form with Translations
export function ExampleForm() {
  const { t } = useLanguage();
  
  return (
    <form>
      <label>{t('auth.email')}</label>
      <input type="email" placeholder={t('auth.email')} />
      
      <label>{t('auth.password')}</label>
      <input type="password" placeholder={t('auth.password')} />
      
      <button type="submit">{t('auth.signin')}</button>
      <button type="button">{t('common.cancel')}</button>
    </form>
  );
}

// Example 3: Navigation Menu
export function ExampleNav() {
  const { t } = useLanguage();
  
  const navItems = [
    { key: 'nav.dashboard', href: '/dashboard' },
    { key: 'nav.journal', href: '/journal' },
    { key: 'nav.habits', href: '/habits' },
    { key: 'nav.settings', href: '/settings' },
  ];
  
  return (
    <nav>
      {navItems.map(item => (
        <a key={item.href} href={item.href}>
          {t(item.key)}
        </a>
      ))}
    </nav>
  );
}

// Example 4: Dynamic Content with Translation
export function ExampleJournal() {
  const { t } = useLanguage();
  
  const moods = ['amazing', 'happy', 'calm', 'neutral', 'anxious', 'sad'];
  
  return (
    <div>
      <h2>{t('journal.mood')}</h2>
      <div>
        {moods.map(mood => (
          <button key={mood}>
            {t(`mood.${mood}`)}
          </button>
        ))}
      </div>
      
      <h3>{t('journal.analytics')}</h3>
      <div>
        <div>{t('journal.moodDistribution')}</div>
        <div>{t('journal.sentiment')}</div>
        <div>{t('journal.energy')}</div>
      </div>
    </div>
  );
}

// Example 5: Settings with Language Selector
export function ExampleSettings() {
  const { t, language, setLanguage } = useLanguage();
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'zh', name: '中文' },
    { code: 'hi', name: 'हिन्दी' },
  ];
  
  return (
    <div>
      <h2>{t('settings.preferences')}</h2>
      
      <label>{t('settings.language')}</label>
      <select 
        value={language} 
        onChange={(e) => setLanguage(e.target.value as any)}
      >
        {languages.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
      
      <label>{t('settings.theme')}</label>
      <button>{t('settings.dark')}</button>
      <button>{t('settings.light')}</button>
    </div>
  );
}

// Example 6: Habits Page
export function ExampleHabits() {
  const { t } = useLanguage();
  
  const categories = ['health', 'mindfulness', 'fitness', 'learning', 'productivity', 'creative'];
  
  return (
    <div>
      <h1>{t('habits.title')}</h1>
      <p>{t('habits.subtitle')}</p>
      
      <button>{t('habits.addHabit')}</button>
      
      <div>
        <h3>{t('habits.category')}</h3>
        {categories.map(cat => (
          <span key={cat}>{t(`category.${cat}`)}</span>
        ))}
      </div>
      
      <div>
        <button>{t('habits.weekView')}</button>
        <button>{t('habits.monthView')}</button>
        <button>{t('habits.streakView')}</button>
      </div>
      
      <div>
        <div>{t('habits.activeHabits')}: 5</div>
        <div>{t('habits.bestStreak')}: 15 days</div>
        <div>{t('habits.completion')}: 85%</div>
      </div>
    </div>
  );
}

// Example 7: Days of Week
export function ExampleCalendar() {
  const { t } = useLanguage();
  
  const weekDays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const fullDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  
  return (
    <div>
      {/* Short day names */}
      <div>
        {weekDays.map(day => (
          <span key={day}>{t(`day.${day}`)}</span>
        ))}
      </div>
      
      {/* Full day names */}
      <div>
        {fullDays.map(day => (
          <div key={day}>{t(`day.${day}`)}</div>
        ))}
      </div>
    </div>
  );
}

/* 
 * QUICK REFERENCE - COMMON TRANSLATION KEYS
 * 
 * Common Actions:
 * - common.save
 * - common.cancel
 * - common.delete
 * - common.edit
 * - common.add
 * - common.close
 * - common.confirm
 * - common.loading
 * 
 * Authentication:
 * - auth.signin
 * - auth.signup
 * - auth.email
 * - auth.password
 * - auth.welcome
 * 
 * Navigation:
 * - nav.dashboard
 * - nav.journal
 * - nav.habits
 * - nav.settings
 * - nav.logout
 * 
 * Dashboard:
 * - dashboard.welcome
 * - dashboard.moodToday
 * - dashboard.stats
 * 
 * Journal:
 * - journal.title
 * - journal.newEntry
 * - journal.mood
 * - journal.analytics
 * 
 * Habits:
 * - habits.title
 * - habits.addHabit
 * - habits.currentStreak
 * - habits.bestStreak
 * 
 * Settings:
 * - settings.title
 * - settings.language
 * - settings.theme
 * - settings.saveChanges
 * 
 * Moods:
 * - mood.amazing
 * - mood.happy
 * - mood.calm
 * - mood.neutral
 * - mood.anxious
 * - mood.sad
 */
