'use client';

import { useEffect } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

export function OnboardaTour() {
  const { showTour, closeTour } = useOnboarding();
  const { theme } = useTheme();
  const { t } = useLanguage();

  useEffect(() => {
    if (!showTour) return;

    const steps = [
      {
        element: '.reveura-logo',
        title: '👋 ' + (t('tour.welcome.title') || 'Welcome to Reveura!'),
        description: t('tour.welcome.description') || 'Your premium mental wellness companion. Let me show you around!',
      },
      {
        element: '.dashboard-header',
        title: '📊 ' + (t('tour.dashboard.title') || 'Your Dashboard'),
        description: t('tour.dashboard.description') || 'Track your mood, habits, and progress all in one place. Your wellness journey starts here!',
      },
      {
        element: 'a[href="/journal"]',
        title: '📝 ' + (t('tour.journal.title') || 'Journal'),
        description: t('tour.journal.description') || 'Express your thoughts and track your emotional journey. Your personal space for reflection.',
      },
      {
        element: 'a[href="/habits"]',
        title: '✅ ' + (t('tour.habits.title') || 'Habits'),
        description: t('tour.habits.description') || 'Build positive habits and track your daily routines. Small steps lead to big changes!',
      },
      {
        element: '.mood-selector',
        title: '😊 ' + (t('tour.mood.title') || 'Mood Tracking'),
        description: t('tour.mood.description') || 'Log your daily mood and understand your emotional patterns over time.',
      },
      {
        element: 'a[href="/settings"]',
        title: '⚙️ ' + (t('tour.settings.title') || 'Settings'),
        description: t('tour.settings.description') || 'Customize your experience, change languages, themes, and manage your profile.',
      },
      {
        element: '.dashboard-header',
        title: '🎉 ' + (t('tour.complete.title') || 'You\'re All Set!'),
        description: t('tour.complete.description') || 'Start your wellness journey today. Remember, progress is more important than perfection!',
      },
    ];

    let currentStepIndex = 0;
    let popover: HTMLElement | null = null;
    let spotlight: HTMLElement | null = null;
    let overlay: HTMLElement | null = null;

    const createPopover = (step: typeof steps[0], index: number) => {
      const element = document.querySelector(step.element);
      if (!element) {
        // If element not found, try next step
        if (index < steps.length - 1) {
          setTimeout(() => showStep(index + 1), 100);
        } else {
          cleanup();
        }
        return;
      }

      // Create spotlight
      const rect = element.getBoundingClientRect();
      spotlight = document.createElement('div');
      spotlight.style.cssText = `
        position: fixed;
        top: ${rect.top - 10}px;
        left: ${rect.left - 10}px;
        width: ${rect.width + 20}px;
        height: ${rect.height + 20}px;
        border-radius: 12px;
        box-shadow: 0 0 0 4px ${theme === 'dark' ? 'rgba(239, 68, 68, 0.5)' : 'rgba(220, 38, 38, 0.5)'}, 0 0 0 9999px ${theme === 'dark' ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0.6)'};
        z-index: 9999;
        pointer-events: none;
        transition: all 0.3s ease;
      `;
      document.body.appendChild(spotlight);

      // Scroll element into view
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Create popover
      popover = document.createElement('div');
      popover.style.cssText = `
        position: fixed;
        background: ${theme === 'dark' ? '#1a1a1a' : '#ffffff'};
        border: 2px solid ${theme === 'dark' ? '#ef4444' : '#dc2626'};
        border-radius: 16px;
        padding: 1.5rem;
        box-shadow: ${theme === 'dark' 
          ? '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(239, 68, 68, 0.3)'
          : '0 20px 60px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(220, 38, 38, 0.2)'};
        min-width: 340px;
        max-width: 420px;
        z-index: 10000;
      `;

      // Position popover below element
      let top = rect.bottom + 20;
      let left = Math.max(20, Math.min(window.innerWidth - 440, rect.left));
      
      // If popover would go below viewport, position above
      if (top + 300 > window.innerHeight) {
        top = rect.top - 320;
      }
      
      popover.style.top = `${top}px`;
      popover.style.left = `${left}px`;

      popover.innerHTML = `
        <button id="tour-close" style="
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'};
          color: ${theme === 'dark' ? '#ffffff' : '#0a0a0a'};
          border: none;
          border-radius: 8px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1.25rem;
          font-weight: 600;
          transition: all 0.2s ease;
        ">✕</button>
        
        <h3 style="
          font-size: 1.5rem;
          font-weight: 800;
          color: ${theme === 'dark' ? '#ffffff' : '#0a0a0a'};
          margin: 0 0 0.75rem 0;
          line-height: 1.3;
        ">${step.title}</h3>
        
        <p style="
          font-size: 1rem;
          line-height: 1.7;
          color: ${theme === 'dark' ? '#e5e5e5' : '#1a1a1a'};
          margin-bottom: 1.5rem;
        ">${step.description}</p>
        
        <div style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.75rem;
          margin-top: 1.5rem;
        ">
          <span style="
            font-size: 0.875rem;
            font-weight: 600;
            color: ${theme === 'dark' ? '#fca5a5' : '#b91c1c'};
          ">${index + 1} / ${steps.length}</span>
          
          <div style="display: flex; gap: 0.5rem;">
            ${index > 0 ? `
              <button id="tour-prev" style="
                padding: 0.75rem 1.5rem;
                border-radius: 10px;
                font-weight: 600;
                font-size: 0.95rem;
                cursor: pointer;
                transition: all 0.2s ease;
                background: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'};
                color: ${theme === 'dark' ? '#ffffff' : '#0a0a0a'};
                border: 1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)'};
              ">← Back</button>
            ` : ''}
            
            <button id="tour-next" style="
              padding: 0.75rem 1.5rem;
              border-radius: 10px;
              font-weight: 600;
              font-size: 0.95rem;
              cursor: pointer;
              transition: all 0.2s ease;
              border: none;
              background: #ef4444;
              color: #ffffff;
              box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
            ">${index < steps.length - 1 ? 'Next →' : '✓ Finish'}</button>
          </div>
        </div>
      `;

      document.body.appendChild(popover);

      // Add event listeners
      document.getElementById('tour-close')?.addEventListener('click', cleanup);
      document.getElementById('tour-prev')?.addEventListener('click', () => showStep(currentStepIndex - 1));
      document.getElementById('tour-next')?.addEventListener('click', () => {
        if (currentStepIndex < steps.length - 1) {
          showStep(currentStepIndex + 1);
        } else {
          cleanup();
        }
      });
    };

    const showStep = (index: number) => {
      if (popover) popover.remove();
      if (spotlight) spotlight.remove();
      currentStepIndex = index;
      setTimeout(() => createPopover(steps[index], index), 100);
    };

    const cleanup = () => {
      if (popover) popover.remove();
      if (spotlight) spotlight.remove();
      if (overlay) overlay.remove();
      closeTour();
    };

    // Create overlay
    overlay = document.createElement('div');
    overlay.id = 'tour-overlay';
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 9998;
      pointer-events: none;
    `;
    document.body.appendChild(overlay);

    // Start tour
    setTimeout(() => showStep(0), 300);

    // Handle escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cleanup();
    };
    document.addEventListener('keydown', handleEscape);

    // Cleanup on unmount
    return () => {
      cleanup();
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showTour, theme, t, closeTour]);

  return null;
}
