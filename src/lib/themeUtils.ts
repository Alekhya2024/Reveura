export const getThemeClasses = (theme: 'light' | 'dark') => ({
  // Card backgrounds
  card: theme === 'dark'
    ? 'bg-gradient-to-br from-neutral-900 to-black border-red-900/30'
    : 'bg-gradient-to-br from-white to-gray-50 border-red-200',
  
  cardAlt: theme === 'dark'
    ? 'bg-neutral-800/50 border-neutral-700'
    : 'bg-white/80 border-gray-200',
  
  // Text colors
  text: theme === 'dark' ? 'text-white' : 'text-gray-900',
  textMuted: theme === 'dark' ? 'text-neutral-400' : 'text-gray-600',
  textSubtle: theme === 'dark' ? 'text-neutral-500' : 'text-gray-500',
  
  // Input fields
  input: theme === 'dark'
    ? 'bg-black/50 border-neutral-800 text-white focus:border-red-500'
    : 'bg-white border-gray-300 text-gray-900 focus:border-red-500',
  
  // Hover states
  hoverCard: theme === 'dark'
    ? 'hover:bg-neutral-800/50'
    : 'hover:bg-gray-200/50',
});
