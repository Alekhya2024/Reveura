'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Copy, BookOpen, X } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import toast, { Toaster } from 'react-hot-toast'
import DashboardLayout from '@/components/DashboardLayout'
import { quotes as allQuotes } from '@/lib/quotes'

interface Quote {
  text: string
  number: number
}

interface QuoteSection {
  theme: string
  emoji: string
  gradient: string
  accentColor: string
  textColor: string
  quotes: Quote[]
}

const quoteSections: QuoteSection[] = [
  {
    theme: "Growth & Mindfulness",
    emoji: "🌱",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    accentColor: "text-emerald-400",
    textColor: "text-emerald-50",
    quotes: allQuotes.slice(0, 25).map((text, i) => ({ text, number: i + 1 }))
  },
  {
    theme: "Love & Connection",
    emoji: "💕",
    gradient: "from-rose-500 via-pink-500 to-red-500",
    accentColor: "text-rose-400",
    textColor: "text-rose-50",
    quotes: allQuotes.slice(25, 50).map((text, i) => ({ text, number: i + 26 }))
  },
  {
    theme: "Self-Care & Healing",
    emoji: "🧘",
    gradient: "from-purple-500 via-violet-500 to-indigo-600",
    accentColor: "text-purple-400",
    textColor: "text-purple-50",
    quotes: allQuotes.slice(50, 75).map((text, i) => ({ text, number: i + 51 }))
  },
  {
    theme: "Inner Strength",
    emoji: "💪",
    gradient: "from-blue-500 via-cyan-500 to-teal-500",
    accentColor: "text-blue-400",
    textColor: "text-blue-50",
    quotes: allQuotes.slice(75, 100).map((text, i) => ({ text, number: i + 76 }))
  }
]

export default function InspirationPage() {
  const { theme } = useTheme()
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])
  const [activeSection, setActiveSection] = useState(0)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('favoriteQuotes')
    if (saved) setFavorites(JSON.parse(saved))
  }, [])

  const toggleFavorite = (text: string) => {
    const updated = favorites.includes(text)
      ? favorites.filter(f => f !== text)
      : [...favorites, text]
    setFavorites(updated)
    localStorage.setItem('favoriteQuotes', JSON.stringify(updated))
    toast.success(favorites.includes(text) ? 'Removed from favorites' : 'Added to favorites!', { duration: 2000 })
  }

  const copyQuote = (text: string) => {
    navigator.clipboard.writeText(`"${text}"`)
    toast.success('Copied to clipboard!', { duration: 2000 })
  }

  const currentSection = quoteSections[activeSection]

  return (
    <DashboardLayout>
      <Toaster position="top-center" />

      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl ${
            theme === 'dark' ? 'bg-purple-600/30' : 'bg-purple-400/20'
          }`}
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 100, 0],
            scale: [1.5, 1, 1.5],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-3xl ${
            theme === 'dark' ? 'bg-blue-600/30' : 'bg-blue-400/20'
          }`}
        />
        <motion.div
          animate={{
            rotate: [0, 360],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl ${
            theme === 'dark' ? 'bg-emerald-600/20' : 'bg-emerald-400/15'
          }`}
        />
      </div>

      <div className="relative z-10 min-h-screen px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              className="inline-block mb-4 sm:mb-6"
            >
              <div className={`text-5xl sm:text-6xl md:text-7xl filter drop-shadow-xl`}>
                ✨
              </div>
            </motion.div>
            <h1 className={`font-black mb-3 sm:mb-4 tracking-tight text-3xl sm:text-4xl md:text-5xl ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent'
                : 'bg-gradient-to-r from-gray-900 via-purple-700 to-blue-700 bg-clip-text text-transparent'
            }`} style={{ fontFamily: "var(--font-display)" }}>
              Inspiration
            </h1>
            <p className={`font-light mb-2 text-sm sm:text-base md:text-lg ${theme === 'dark' ? 'text-neutral-300' : 'text-gray-700'}`} style={{ fontFamily: "var(--font-body)" }}>
              100 mindful quotes to elevate your consciousness
            </p>
            <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-4 text-xs sm:text-sm font-medium mt-4 sm:mt-6 overflow-x-auto pb-2 scrollbar-hide">
              {quoteSections.map((section, i) => (
                <motion.button
                  key={i}
                  onClick={() => setActiveSection(i)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`group px-3 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl transition-all backdrop-blur-xl flex items-center gap-2 sm:gap-3 whitespace-nowrap flex-shrink-0 ${
                    activeSection === i
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-xl shadow-purple-500/30'
                      : theme === 'dark'
                        ? 'bg-neutral-800/50 text-white hover:bg-neutral-700/50'
                        : 'bg-white/30 text-black hover:bg-white/50'
                  }`}
                  title={section.theme}
                >
                  <span className="text-xl">{section.emoji}</span>
                  <span className="font-semibold">{section.theme}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    activeSection === i
                      ? 'bg-white/30'
                      : theme === 'dark'
                        ? 'bg-neutral-700'
                        : 'bg-white/20'
                  }`}>
                    {section.quotes.length}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Section Header */}
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-16"
          >
            <div className={`relative px-8 py-8 rounded-3xl overflow-hidden backdrop-blur-xl`}>
              {/* Animated background gradient */}
              <motion.div
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 8, repeat: Infinity }}
                className={`absolute inset-0 bg-gradient-to-r ${currentSection.gradient} opacity-80`}
                style={{ backgroundSize: "200% 200%" }}
              />
              
              {/* Shine effect */}
              <motion.div
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-5xl">{currentSection.emoji}</span>
                      <h2 className={`text-4xl md:text-5xl font-black ${currentSection.textColor}`}>
                        {currentSection.theme}
                      </h2>
                    </div>
                    <p className={`text-sm font-semibold opacity-90 ${currentSection.textColor}`}>
                      {currentSection.quotes.length} transformative quotes
                    </p>
                  </div>
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`text-5xl`}
                  >
                    💫
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quotes Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20"
          >
            <AnimatePresence mode="wait">
              {currentSection.quotes.map((quote, idx) => (
                <motion.div
                  key={quote.number}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ delay: idx * 0.05, duration: 0.4 }}
                  onHoverStart={() => setHoveredCard(quote.number)}
                  onHoverEnd={() => setHoveredCard(null)}
                  onClick={() => setSelectedQuote(quote)}
                  className="group cursor-pointer"
                >
                  <motion.div
                    className={`relative h-full p-8 rounded-3xl backdrop-blur-xl transition-all overflow-hidden ${
                      theme === 'dark'
                        ? 'bg-neutral-900/40 border border-neutral-700/50 hover:border-neutral-600/80'
                        : 'bg-white/40 border border-white/50 hover:border-white/80'
                    }`}
                    whileHover={{ y: -5 }}
                  >
                    {/* Gradient overlay on hover */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${currentSection.gradient} opacity-0 group-hover:opacity-10 transition-opacity rounded-3xl`}
                    />

                    {/* Card content */}
                    <div className="relative space-y-4">
                      {/* Quote number badge */}
                      <div className="flex items-center justify-between mb-2">
                        <motion.div
                          animate={{ rotate: hoveredCard === quote.number ? 360 : 0 }}
                          transition={{ duration: 0.6 }}
                          className={`inline-block px-3 py-1.5 rounded-full flex items-center gap-2 font-bold text-white text-xs backdrop-blur-xl bg-gradient-to-br ${currentSection.gradient}`}
                        >
                          <span>#</span>
                          <span>{quote.number}</span>
                          <span>Quote</span>
                        </motion.div>
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: hoveredCard === quote.number ? 1 : 0 }}
                          className="text-xs font-semibold text-purple-500"
                        >
                          Click to expand
                        </motion.span>
                      </div>

                      {/* Quote text */}
                      <p className={`text-lg leading-relaxed font-medium ${
                        theme === 'dark' ? 'text-neutral-100' : 'text-gray-900'
                      }`}>
                        "{quote.text}"
                      </p>

                      {/* Action buttons with labels */}
                      <div className="flex items-center gap-2 pt-6 border-t border-current border-opacity-10">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation()
                            copyQuote(quote.text)
                          }}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                            theme === 'dark'
                              ? 'bg-neutral-800 hover:bg-neutral-700 text-white hover:text-white'
                              : 'bg-gray-200 hover:bg-gray-300 text-black'
                          }`}
                          title="Copy this quote to clipboard"
                        >
                          <Copy className="w-4 h-4" />
                          <span>Copy</span>
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(quote.text)
                          }}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                            favorites.includes(quote.text)
                              ? 'bg-red-500/90 text-white'
                              : theme === 'dark'
                                ? 'bg-neutral-800 hover:bg-neutral-700 text-white hover:text-red-400'
                                : 'bg-gray-200 hover:bg-gray-300 text-black hover:text-red-500'
                          }`}
                          title={favorites.includes(quote.text) ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          <Heart className={`w-4 h-4 ${favorites.includes(quote.text) ? 'fill-current' : ''}`} />
                          <span>{favorites.includes(quote.text) ? 'Saved' : 'Save'}</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Favorites Section */}
          <AnimatePresence>
            {favorites.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`relative px-8 py-10 rounded-3xl backdrop-blur-xl overflow-hidden ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-red-950/40 to-pink-950/40 border border-red-900/50'
                    : 'bg-gradient-to-r from-red-100/40 to-pink-100/40 border border-red-200/50'
                }`}
              >
                <motion.div
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 8, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-pink-600/20 opacity-50"
                  style={{ backgroundSize: "200% 200%" }}
                />
                
                <div className="relative">
                  <div className="flex items-center justify-between flex-wrap gap-6">
                    <div className="flex items-center gap-6">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-6xl"
                      >
                        ❤️
                      </motion.div>
                      <div>
                        <h3 className={`text-3xl font-black ${
                          theme === 'dark' ? 'text-red-300' : 'text-red-700'
                        }`}>
                          {favorites.length}
                        </h3>
                        <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-red-200/70' : 'text-red-600/70'}`}>
                          Quote{favorites.length !== 1 ? 's' : ''} Saved
                        </p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-red-200/50' : 'text-red-600/50'}`}>
                          Your daily inspiration collection
                        </p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity }}
                      className="text-4xl opacity-50"
                    >
                      ✨
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Quote Detail Modal */}
      <AnimatePresence>
        {selectedQuote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedQuote(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 40 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative w-full max-w-2xl rounded-4xl backdrop-blur-2xl overflow-hidden shadow-2xl ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-neutral-900/95 via-neutral-900/90 to-neutral-800/95'
                  : 'bg-gradient-to-br from-white/95 via-white/92 to-gray-50/95'
              }`}
            >
              {/* Animated background gradient */}
              <motion.div
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 8, repeat: Infinity }}
                className={`absolute inset-0 bg-gradient-to-r ${quoteSections[activeSection].gradient} opacity-5`}
                style={{ backgroundSize: "200% 200%" }}
              />

              {/* Top accent line */}
              <motion.div
                animate={{
                  scaleX: [0, 1, 1],
                }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${quoteSections[activeSection].gradient}`}
              />

              {/* Close button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedQuote(null)}
                className={`absolute top-6 right-6 z-10 p-3 rounded-full transition-all ${
                  theme === 'dark'
                    ? 'bg-neutral-800/80 hover:bg-neutral-700 text-white'
                    : 'bg-gray-100/80 hover:bg-gray-200 text-black'
                }`}
              >
                <X className="w-6 h-6" />
              </motion.button>

              {/* Content */}
              <div className="relative px-8 md:px-12 py-12 md:py-16">
                {/* Quote badge */}
                <motion.div
                  initial={{ scale: 0, y: -20 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ delay: 0.15, type: "spring", stiffness: 150 }}
                  className={`inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r ${quoteSections[activeSection].gradient} shadow-lg`}
                >
                  <span>✨</span>
                  <span>Quote #{selectedQuote.number}</span>
                </motion.div>

                {/* Decorative line */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className={`absolute left-8 md:left-12 h-1 w-12 bg-gradient-to-r ${quoteSections[activeSection].gradient} rounded-full mb-6`}
                />

                {/* Quote section with spacing */}
                <div className="space-y-8">
                  {/* Opening quote mark */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.25 }}
                    className={`text-6xl md:text-7xl font-black opacity-10 ${quoteSections[activeSection].accentColor}`}
                  >
                    "
                  </motion.div>

                  {/* Quote text */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="space-y-4"
                  >
                    <p className={`text-2xl md:text-4xl font-black leading-relaxed ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {selectedQuote.text}
                    </p>
                  </motion.div>

                  {/* Decorative dots */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 }}
                    className={`flex gap-2 ${quoteSections[activeSection].accentColor}`}
                  >
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                      className="text-2xl"
                    >
                      •
                    </motion.span>
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                      className="text-2xl"
                    >
                      •
                    </motion.span>
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                      className="text-2xl"
                    >
                      •
                    </motion.span>
                  </motion.div>
                </div>

                {/* Divider */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className={`my-10 h-px bg-gradient-to-r ${theme === 'dark' ? 'from-transparent via-neutral-700 to-transparent' : 'from-transparent via-gray-300 to-transparent'}`}
                />

                {/* Action buttons section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.6 }}
                  className="space-y-4"
                >
                  <p className={`text-sm font-semibold text-center mb-4 ${
                    theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'
                  }`}>
                    What would you like to do?
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Copy button */}
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => copyQuote(selectedQuote.text)}
                      className="group relative overflow-hidden px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                    >
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-5 h-5"
                      >
                        <Copy className="w-5 h-5" />
                      </motion.div>
                      <span>Copy Quote</span>
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 rounded-2xl"
                      />
                    </motion.button>

                    {/* Favorite button */}
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleFavorite(selectedQuote.text)}
                      className={`group relative overflow-hidden px-6 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 ${
                        favorites.includes(selectedQuote.text)
                          ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white'
                          : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      }`}
                    >
                      <motion.div
                        animate={favorites.includes(selectedQuote.text) ? { scale: [1, 1.3, 1] } : {}}
                        transition={{ duration: 0.6, repeat: Infinity }}
                        className="w-5 h-5"
                      >
                        <Heart className={`w-5 h-5 ${favorites.includes(selectedQuote.text) ? 'fill-current' : ''}`} />
                      </motion.div>
                      <span>{favorites.includes(selectedQuote.text) ? 'Favorited ✓' : 'Add to Favorites'}</span>
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 rounded-2xl"
                      />
                    </motion.button>
                  </div>
                </motion.div>

                {/* Bottom accent */}
                <motion.div
                  animate={{
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${quoteSections[activeSection].gradient} opacity-50`}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  )
}
