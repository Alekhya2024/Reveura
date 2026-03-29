'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { 
  BookOpen, Mic, Sparkles, TrendingUp, 
  Calendar, Heart, Smile, Meh, Sun, Cloud, 
  Zap, Wind, Droplet, Star, Lock, Unlock, Save,
  Plus, Edit3, Eye, Share2, BarChart3, Activity, Brain, 
  CloudRain, Headphones
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

// Mood configurations with premium Lucide icons
const MOODS = [
  { id: 'amazing', label: 'Amazing', icon: Star, gradient: 'from-amber-400 via-pink-400 to-purple-500', iconColor: 'text-amber-300', color: '#FCD34D' },
  { id: 'happy', label: 'Happy', icon: Smile, gradient: 'from-yellow-300 via-orange-400 to-pink-400', iconColor: 'text-yellow-300', color: '#FDE047' },
  { id: 'calm', label: 'Calm', icon: Headphones, gradient: 'from-blue-300 via-cyan-300 to-teal-400', iconColor: 'text-cyan-300', color: '#93E5FC' },
  { id: 'neutral', label: 'Neutral', icon: Meh, gradient: 'from-gray-300 via-gray-400 to-gray-500', iconColor: 'text-gray-300', color: '#D1D5DB' },
  { id: 'anxious', label: 'Anxious', icon: Wind, gradient: 'from-purple-400 via-indigo-400 to-blue-500', iconColor: 'text-indigo-300', color: '#C084FC' },
  { id: 'sad', label: 'Sad', icon: CloudRain, gradient: 'from-blue-400 via-blue-500 to-indigo-600', iconColor: 'text-blue-300', color: '#60A5FA' },
];

const WEATHER_ICONS = [
  { id: 'sunny', icon: Sun, color: 'text-yellow-500' },
  { id: 'cloudy', icon: Cloud, color: 'text-gray-400' },
  { id: 'rainy', icon: Droplet, color: 'text-blue-400' },
  { id: 'stormy', icon: Zap, color: 'text-purple-500' },
];

interface JournalEntry {
  id: string;
  date: Date;
  mood: string;
  weather: string;
  title: string;
  content: string;
  tags: string[];
  isPrivate: boolean;
  sentiment: number;
  energy: number;
}

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      date: new Date(2026, 0, 18),
      mood: 'happy',
      weather: 'sunny',
      title: 'A Beautiful Morning',
      content: 'Today started with such positive energy. I practiced meditation and felt incredibly grateful for all the blessings in my life.',
      tags: ['gratitude', 'meditation', 'morning'],
      isPrivate: false,
      sentiment: 0.8,
      energy: 85,
    },
    {
      id: '2',
      date: new Date(2026, 0, 17),
      mood: 'calm',
      weather: 'cloudy',
      title: 'Reflection Time',
      content: 'Spent the afternoon reading and reflecting on my goals. Sometimes quiet moments are the most productive.',
      tags: ['reflection', 'goals', 'reading'],
      isPrivate: true,
      sentiment: 0.6,
      energy: 65,
    },
    {
      id: '3',
      date: new Date(2026, 0, 16),
      mood: 'amazing',
      weather: 'sunny',
      title: 'Best Day Ever',
      content: 'Everything went perfectly today! Got promoted at work and celebrated with friends. Feeling absolutely amazing!',
      tags: ['celebration', 'achievement', 'work'],
      isPrivate: false,
      sentiment: 0.95,
      energy: 95,
    },
    {
      id: '4',
      date: new Date(2026, 0, 15),
      mood: 'anxious',
      weather: 'rainy',
      title: 'Worried About the Future',
      content: 'Had some anxiety today about upcoming deadlines. Need to work on my stress management techniques.',
      tags: ['anxiety', 'work', 'stress'],
      isPrivate: true,
      sentiment: -0.4,
      energy: 35,
    },
    {
      id: '5',
      date: new Date(2026, 0, 14),
      mood: 'sad',
      weather: 'cloudy',
      title: 'Missing Someone',
      content: 'Feeling a bit down today. Missing a close friend who moved away. But I know we will reconnect soon.',
      tags: ['friendship', 'emotions'],
      isPrivate: true,
      sentiment: -0.3,
      energy: 40,
    },
    {
      id: '6',
      date: new Date(2026, 0, 13),
      mood: 'neutral',
      weather: 'sunny',
      title: 'Just Another Day',
      content: 'Nothing particularly exciting or bad happened today. It was just an ordinary, uneventful day.',
      tags: ['ordinary', 'routine'],
      isPrivate: false,
      sentiment: 0.0,
      energy: 60,
    },
    {
      id: '7',
      date: new Date(2026, 0, 12),
      mood: 'calm',
      weather: 'cloudy',
      title: 'Yoga and Relaxation',
      content: 'Did a morning yoga session and spent time meditating. Feeling very peaceful and centered.',
      tags: ['yoga', 'meditation', 'wellness'],
      isPrivate: false,
      sentiment: 0.7,
      energy: 70,
    },
    {
      id: '8',
      date: new Date(2026, 0, 11),
      mood: 'happy',
      weather: 'sunny',
      title: 'Time with Family',
      content: 'Spent a wonderful day with my family. Laughed a lot and made some great memories together.',
      tags: ['family', 'love', 'happiness'],
      isPrivate: false,
      sentiment: 0.85,
      energy: 88,
    },
  ]);
  
  const [isWriting, setIsWriting] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<Partial<JournalEntry>>({
    mood: 'neutral',
    weather: 'sunny',
    title: '',
    content: '',
    tags: [],
    isPrivate: false,
  });
  const [isRecording, setIsRecording] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'timeline' | 'calendar'>('grid');
  const [filterMood, setFilterMood] = useState<string | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cursorSize = useSpring(0, { stiffness: 300, damping: 30 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const startNewEntry = () => {
    setIsWriting(true);
    setCurrentEntry({
      mood: 'neutral',
      weather: 'sunny',
      title: '',
      content: '',
      tags: [],
      isPrivate: false,
    });
  };

  const saveEntry = () => {
    if (!currentEntry.title || !currentEntry.content) return;
    
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date(),
      mood: currentEntry.mood || 'neutral',
      weather: currentEntry.weather || 'sunny',
      title: currentEntry.title,
      content: currentEntry.content,
      tags: currentEntry.tags || [],
      isPrivate: currentEntry.isPrivate || false,
      sentiment: Math.random() * 2 - 1,
      energy: Math.floor(Math.random() * 100),
    };
    
    setEntries([newEntry, ...entries]);
    setIsWriting(false);
    setCurrentEntry({});
  };

  const filteredEntries = filterMood 
    ? entries.filter(e => e.mood === filterMood)
    : entries;

  return (
    <DashboardLayout>
      <div className="min-h-screen relative overflow-hidden">
        {/* Dynamic Mood-Based Background */}
        <motion.div 
          className="absolute inset-0 opacity-5"
          animate={{
            background: currentEntry.mood 
              ? `radial-gradient(circle at 50% 50%, ${MOODS.find(m => m.id === currentEntry.mood)?.gradient.replace('from-', '').split(' ')[0]}, transparent)`
              : 'transparent'
          }}
        />

        {/* Particle Effect Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full"
              animate={{
                x: [Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000)],
                y: [Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000), Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000)],
                scale: [0, 1, 0],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 10 + Math.random() * 20,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 p-8">
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <motion.h1 
                  className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent mb-2"
                  animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  My Journey
                </motion.h1>
                <p className="text-gray-400 dark:text-gray-400 text-sm">
                  Capture your thoughts, feelings, and memories
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAnalytics(!showAnalytics)}
                  className={`px-5 py-2.5 rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-all duration-300 text-sm font-semibold ${
                    showAnalytics
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-cyan-500/50 ring-2 ring-cyan-400/50'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-cyan-500/50'
                  }`}
                >
                  <Activity className="w-5 h-5" />
                  <span>Analytics</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05, rotate: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startNewEntry}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white rounded-xl shadow-xl flex items-center gap-2 relative overflow-hidden group cursor-pointer text-sm font-semibold"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-400 opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.3 }}
                  />
                  <Plus className="w-5 h-5 relative z-10" />
                  <span className="relative z-10 font-semibold">New Entry</span>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="relative z-10"
                  >
                    <Sparkles className="w-5 h-5" />
                  </motion.div>
                </motion.button>
              </div>
            </div>

            {/* View Mode Selector */}
            <div className="flex gap-3 mb-6">
              {[
                { mode: 'grid', label: 'Grid View', icon: BarChart3 },
                { mode: 'timeline', label: 'Timeline', icon: Activity },
                { mode: 'calendar', label: 'Calendar', icon: Calendar },
              ].map(({ mode, label, icon: Icon }) => (
                <motion.button
                  key={mode}
                  whileHover={{ 
                    scale: 1.1,
                    filter: 'brightness(1.1)',
                    boxShadow: '0 8px 30px rgba(168, 85, 247, 0.5), inset 0 0 20px rgba(255,255,255,0.1)',
                    marginLeft: '4px',
                    marginRight: '4px'
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 15 }}
                  onClick={() => setViewMode(mode as any)}
                  className={`px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-300 cursor-pointer text-sm ${
                    viewMode === mode
                      ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-xl shadow-purple-500/50'
                      : 'bg-white/50 dark:bg-gray-800/50 backdrop-blur-md text-black dark:text-white hover:shadow-md hover:bg-white dark:hover:bg-gray-700/50'
                  }`}
                >
                  <motion.div
                    animate={viewMode === mode ? { rotate: 360, scale: 1.3 } : { rotate: 0, scale: 1 }}
                    transition={{ duration: 0.6, type: 'spring', stiffness: 400 }}
                  >
                    <Icon className="w-4 h-4" />
                  </motion.div>
                  <motion.span
                    animate={viewMode === mode ? { fontWeight: 700, letterSpacing: '0.05em' } : { fontWeight: 500, letterSpacing: '0em' }}
                    transition={{ duration: 0.3 }}
                  >
                    {label}
                  </motion.span>
                </motion.button>
              ))}
            </div>

            {/* Premium Animated Mood Filters - Horizontal Layout */}
            <motion.div className="mb-6">
              <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-3 flex items-center gap-2 uppercase tracking-widest" style={{ fontFamily: "var(--font-heading)" }}>
                <Heart className="w-3.5 h-3.5" />
                Filter by mood
              </h2>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {/* All Moods Button */}
                <motion.button
                  onClick={() => setFilterMood(null)}
                  whileHover={{
                    boxShadow: '0 0 30px rgba(168, 85, 247, 0.8), inset 0 0 20px rgba(255,255,255,0.2)'
                  }}
                  whileTap={{ scale: 0.93 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 12 }}
                  className={`relative px-5 py-2 rounded-full flex-shrink-0 font-semibold transition-all duration-300 cursor-pointer text-sm ${
                    !filterMood
                      ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/50 ring-4 ring-purple-400/30 scale-105'
                      : 'bg-gray-200/70 dark:bg-gray-700/70 text-black dark:text-white backdrop-blur-sm border border-gray-300/50 dark:border-gray-600/50 hover:bg-gray-300/70 dark:hover:bg-gray-600/70'
                  }`}
                >
                  {/* Animated Background Particles */}
                  {!filterMood && (
                    <>
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        animate={{
                          boxShadow: [
                            '0 0 20px rgba(168, 85, 247, 0.4)',
                            '0 0 40px rgba(168, 85, 247, 0.8)',
                            '0 0 20px rgba(168, 85, 247, 0.4)',
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <motion.div
                        className="absolute inset-0 rounded-full border border-white/30"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </>
                  )}
                  <span className="relative z-10">All Moods</span>
                </motion.button>

                {/* Individual Mood Buttons */}
                {MOODS.map((mood) => {
                  const MoodIcon = mood.icon;
                  return (
                    <motion.button
                      key={mood.id}
                      onClick={() => setFilterMood(mood.id)}
                      whileHover={{
                        boxShadow: `0 0 30px ${mood.color}cc, inset 0 0 20px rgba(255,255,255,0.15)`
                      }}
                      whileTap={{ scale: 0.91 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                      className={`relative px-4 py-2 rounded-full flex items-center gap-2 flex-shrink-0 font-medium transition-all duration-300 overflow-hidden cursor-pointer text-sm ${
                        filterMood === mood.id
                          ? `bg-gradient-to-r ${mood.gradient} text-white shadow-xl ring-4 ring-white/20 scale-105`
                          : 'bg-gray-200/70 dark:bg-gray-700/70 text-black dark:text-white backdrop-blur-sm border border-gray-300/50 dark:border-gray-600/50 hover:border-gray-400/70 dark:hover:border-gray-500/70 hover:bg-gray-300/70 dark:hover:bg-gray-600/70 hover:scale-105'
                      }`}
                      style={filterMood === mood.id ? { 
                        boxShadow: `0 10px 40px ${mood.color}66, inset 0 0 30px ${mood.color}33` 
                      } : {}}
                    >
                      {/* Animated Glow Ring */}
                      {filterMood === mood.id && (
                        <motion.div
                          className="absolute inset-0 rounded-full border border-white/40"
                          animate={{ scale: [1, 1.08, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      )}

                      {/* Particle Burst on Active */}
                      {filterMood === mood.id && (
                        <>
                          {[...Array(3)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-1 h-1 rounded-full bg-white/60"
                              animate={{
                                x: [0, Math.cos((i * Math.PI * 2) / 3) * 40],
                                y: [0, Math.sin((i * Math.PI * 2) / 3) * 40],
                                opacity: [1, 0],
                              }}
                              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                            />
                          ))}
                        </>
                      )}

                      {/* Icon with Advanced Animation */}
                      <motion.div
                        animate={filterMood === mood.id ? {
                          rotate: [0, 180, 360],
                          scale: [1, 1.2, 1],
                        } : {
                          rotate: 0,
                          scale: 1,
                        }}
                        whileHover={{ scale: 1.15, rotate: 15 }}
                        transition={{ duration: 0.8, ease: 'easeInOut' }}
                        className="relative z-10"
                      >
                        <MoodIcon className={`w-5 h-5 ${filterMood === mood.id ? 'text-white' : mood.iconColor}`} />
                      </motion.div>

                      {/* Text with Smooth Animation */}
                      <motion.span
                        animate={filterMood === mood.id ? {
                          fontWeight: 700,
                          letterSpacing: '0.02em',
                        } : {
                          fontWeight: 600,
                          letterSpacing: '0em',
                        }}
                        transition={{ duration: 0.3 }}
                        className="relative z-10"
                      >
                        {mood.label}
                      </motion.span>

                      {/* Active checkmark indicator */}
                      {filterMood === mood.id && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className="relative z-10 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center"
                        >
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </motion.div>
                      )}

                      {/* Flowing Gradient Border Animation */}
                      {filterMood === mood.id && (
                        <motion.div
                          className="absolute inset-0 rounded-full p-[2px]"
                          animate={{
                            backgroundImage: [
                              `linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)`,
                              `linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)`,
                              `linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)`,
                            ]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>

          {/* Analytics Dashboard */}
          <AnimatePresence>
            {showAnalytics && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 overflow-hidden"
              >
                <div className="grid grid-cols-4 gap-6">
                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="col-span-2 bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-3xl p-6 border border-purple-200/20"
                  >
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
                      <Brain className="w-5 h-5 text-purple-400" />
                      Mood Distribution
                    </h3>
                    <div className="space-y-3">
                      {MOODS.map((mood) => {
                        const MoodIcon = mood.icon;
                        const count = entries.filter(e => e.mood === mood.id).length;
                        const percentage = entries.length > 0 ? (count / entries.length) * 100 : 0;
                        return (
                          <div key={mood.id} className="space-y-1">
                            <div className="flex justify-between text-sm text-white font-medium">
                              <span className="flex items-center gap-2">
                                <MoodIcon className={`w-4 h-4 ${mood.iconColor}`} />
                                <span>{mood.label}</span>
                              </span>
                              <span className="font-bold">{count}</span>
                            </div>
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className={`h-full bg-gradient-to-r ${mood.gradient}`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl rounded-3xl p-6 border border-blue-200/20"
                  >
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
                      <TrendingUp className="w-5 h-5 text-blue-400" />
                      Average Sentiment
                    </h3>
                    <div className="flex items-center justify-center h-32">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', duration: 1 }}
                      >
                        <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                          {entries.length > 0 
                            ? Math.round((entries.reduce((acc, e) => acc + e.sentiment, 0) / entries.length) * 100)
                            : 0}
                        </div>
                        <div className="text-center text-sm text-white font-semibold mt-2">
                          Positivity Score
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 backdrop-blur-xl rounded-3xl p-6 border border-orange-200/20"
                  >
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
                      <Zap className="w-5 h-5 text-orange-400" />
                      Average Energy
                    </h3>
                    <div className="flex items-center justify-center h-32">
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', duration: 1 }}
                      >
                        <div className="text-6xl font-bold bg-gradient-to-r from-orange-600 to-yellow-500 bg-clip-text text-transparent">
                          {entries.length > 0 
                            ? Math.round(entries.reduce((acc, e) => acc + e.energy, 0) / entries.length)
                            : 0}
                        </div>
                        <div className="text-center text-sm text-white font-semibold mt-2">
                          Energy Level
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Writing Interface */}
          <AnimatePresence>
            {isWriting && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-8"
                onClick={(e) => e.target === e.currentTarget && setIsWriting(false)}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0, rotateY: -30 }}
                  animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                  exit={{ scale: 0.8, opacity: 0, rotateY: 30 }}
                  transition={{ type: 'spring', duration: 0.5 }}
                  className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                >
                  <div className={`bg-gradient-to-r ${MOODS.find(m => m.id === currentEntry.mood)?.gradient || 'from-purple-600 to-pink-500'} p-6 relative overflow-hidden`}>
                    <div className="relative z-10 flex items-center justify-between text-white">
                      <div className="flex items-center gap-3">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        >
                          <BookOpen className="w-8 h-8" />
                        </motion.div>
                        <div>
                          <h2 className="text-2xl font-bold">Create New Entry</h2>
                          <p className="text-white/80 text-sm" suppressHydrationWarning>
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsWriting(false)}
                        className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center cursor-pointer"
                      >
                        <Plus className="w-6 h-6 rotate-45" />
                      </motion.button>
                    </div>
                  </div>

                  <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
                    <div className="mb-6">
                      <label className="text-sm font-semibold mb-3 flex items-center gap-2 text-black dark:text-white">
                        <Heart className="w-4 h-4" />
                        How are you feeling?
                      </label>
                      <div className="grid grid-cols-6 gap-3">
                        {MOODS.map((mood) => {
                          const MoodIcon = mood.icon;
                          return (
                            <motion.button
                              key={mood.id}
                              whileHover={{ scale: 1.1, y: -5 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setCurrentEntry({ ...currentEntry, mood: mood.id })}
                              className={`relative p-4 rounded-2xl transition-all cursor-pointer ${
                                currentEntry.mood === mood.id
                                  ? `bg-gradient-to-br ${mood.gradient} text-white shadow-xl`
                                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                              }`}
                            >
                              <motion.div
                                animate={currentEntry.mood === mood.id ? { 
                                  scale: [1, 1.2, 1],
                                  rotate: [0, 360]
                                } : {}}
                                transition={{ duration: 0.8 }}
                                className="mb-2"
                              >
                                <MoodIcon className={`w-8 h-8 mx-auto ${
                                  currentEntry.mood === mood.id ? 'text-white' : mood.iconColor
                                }`} />
                              </motion.div>
                              <div className={`text-xs font-medium ${
                                currentEntry.mood === mood.id ? 'text-white' : 'text-black dark:text-white'
                              }`}>{mood.label}</div>
                              {currentEntry.mood === mood.id && (
                                <motion.div
                                  layoutId="mood-indicator"
                                  className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg"
                                >
                                  <Sparkles className="w-4 h-4 text-purple-600" />
                                </motion.div>
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="text-sm font-semibold mb-3 flex items-center gap-2 text-black dark:text-white">
                        <Cloud className="w-4 h-4" />
                        Weather Today
                      </label>
                      <div className="flex gap-3">
                        {WEATHER_ICONS.map(({ id, icon: Icon, color }) => (
                          <motion.button
                            key={id}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setCurrentEntry({ ...currentEntry, weather: id })}
                            className={`p-4 rounded-xl transition-all cursor-pointer ${
                              currentEntry.weather === id
                                ? 'bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-lg'
                                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                          >
                            <Icon className={`w-6 h-6 ${currentEntry.weather === id ? 'text-white' : color}`} />
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6 relative">
                      <label className="block text-sm font-semibold mb-3 text-black dark:text-white">Title</label>
                      <input
                        type="text"
                        value={currentEntry.title || ''}
                        onChange={(e) => setCurrentEntry({ ...currentEntry, title: e.target.value })}
                        placeholder="Give your entry a title..."
                        className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-lg font-medium text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      />
                    </div>

                    <div className="mb-6 relative">
                      <label className="text-sm font-semibold mb-3 flex items-center justify-between text-black dark:text-white">
                        <span className="flex items-center gap-2">
                          <Edit3 className="w-4 h-4" />
                          Your Thoughts
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-400">
                          {currentEntry.content?.length || 0} characters
                        </span>
                      </label>
                      <textarea
                        value={currentEntry.content || ''}
                        onChange={(e) => setCurrentEntry({ ...currentEntry, content: e.target.value })}
                        placeholder="What's on your mind? Let your thoughts flow..."
                        rows={12}
                        className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none leading-relaxed text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsRecording(!isRecording)}
                      className={`w-full mb-6 px-6 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all cursor-pointer ${
                        isRecording
                          ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                          : 'bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-black dark:text-white'
                      }`}
                    >
                      <Mic className="w-5 h-5" />
                      <span className="font-semibold">
                        {isRecording ? 'Recording...' : 'Voice to Text'}
                      </span>
                    </motion.button>

                    <div className="flex items-center justify-between mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                      <div className="flex items-center gap-3">
                        {currentEntry.isPrivate ? (
                          <Lock className="w-5 h-5 text-purple-600" />
                        ) : (
                          <Unlock className="w-5 h-5 text-gray-400" />
                        )}
                        <div>
                          <div className="font-semibold text-black dark:text-white">
                            {currentEntry.isPrivate ? 'Private Entry' : 'Public Entry'}
                          </div>
                        </div>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setCurrentEntry({ ...currentEntry, isPrivate: !currentEntry.isPrivate })}
                        className={`relative w-16 h-8 rounded-full transition-colors cursor-pointer ${
                          currentEntry.isPrivate ? 'bg-purple-600' : 'bg-gray-300'
                        }`}
                      >
                        <motion.div
                          className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                          animate={{ x: currentEntry.isPrivate ? 32 : 4 }}
                        />
                      </motion.button>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={saveEntry}
                      disabled={!currentEntry.title || !currentEntry.content}
                      className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white rounded-2xl font-bold text-lg shadow-xl disabled:opacity-50 cursor-pointer"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Save className="w-5 h-5" />
                        Save Entry
                        <Sparkles className="w-5 h-5" />
                      </span>
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Entries Display */}
          <AnimatePresence mode="wait">
            {viewMode === 'grid' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredEntries.map((entry, index) => {
                  const mood = MOODS.find(m => m.id === entry.mood);
                  const MoodIcon = mood?.icon || Star;
                  return (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -10 }}
                      className="group relative"
                    >
                      <div className={`relative bg-gradient-to-br ${mood?.gradient} p-1 rounded-3xl shadow-lg`}>
                        <div className="relative bg-white dark:bg-gray-900 rounded-3xl p-5">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${mood?.gradient} flex items-center justify-center shadow-lg`}>
                                <MoodIcon className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <div className="text-xs text-gray-600 dark:text-gray-400 font-medium" suppressHydrationWarning>
                                  {entry.date.toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            {entry.isPrivate && <Lock className="w-4 h-4 text-purple-600" />}
                          </div>

                          <h3 className="text-lg font-bold mb-2 line-clamp-2 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                            {entry.title}
                          </h3>

                          <p className="text-gray-800 dark:text-gray-300 mb-3 line-clamp-3 text-sm leading-relaxed">
                            {entry.content}
                          </p>

                          {entry.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {entry.tags.map((tag, i) => (
                                <span key={i} className="px-2.5 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-200 rounded-full text-xs font-medium">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer hover:from-purple-700 hover:to-pink-600 transition-all">
                              <Eye className="w-3.5 h-3.5" />
                              Read
                            </button>
                            <button className="px-3 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-all">
                              <Share2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {viewMode === 'timeline' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative"
              >
                <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-600 via-pink-500 to-orange-500" />
                {filteredEntries.map((entry, index) => {
                  const mood = MOODS.find(m => m.id === entry.mood);
                  const MoodIcon = mood?.icon || Star;
                  return (
                    <motion.div key={entry.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative pl-20 pb-12">
                      <div className={`absolute left-5 top-6 w-10 h-10 rounded-full bg-gradient-to-r ${mood?.gradient} shadow-lg flex items-center justify-center z-10`}>
                        <MoodIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg">
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-2">
                          {entry.title}
                        </h3>
                        <p className="text-gray-800 dark:text-gray-300 leading-relaxed">{entry.content}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {viewMode === 'calendar' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl"
              >
                <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-8 text-center">
                  January 2026
                </h3>
                <div className="grid grid-cols-7 gap-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center font-semibold text-black dark:text-white">
                      {day}
                    </div>
                  ))}
                  {[...Array(31)].map((_, i) => {
                    const dayEntries = entries.filter(e => e.date.getDate() === i + 1);
                    const hasMood = dayEntries.length > 0;
                    const mood = hasMood ? MOODS.find(m => m.id === dayEntries[0].mood) : null;
                    const MoodIcon = mood?.icon || Star;
                    
                    return (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.1 }}
                        className={`aspect-square rounded-2xl flex flex-col items-center justify-center cursor-pointer ${
                          hasMood ? `bg-gradient-to-br ${mood?.gradient} text-white shadow-lg` : 'bg-gray-100 dark:bg-gray-800'
                        }`}
                      >
                        <div className="text-lg font-bold mb-1">{i + 1}</div>
                        {hasMood && <MoodIcon className="w-5 h-5" />}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {filteredEntries.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <BookOpen className="w-24 h-24 text-purple-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-black dark:text-white mb-2">No entries yet</h3>
              <p className="text-gray-900 dark:text-gray-200 mb-6">Start your journaling journey</p>
              <motion.button
                onClick={startNewEntry}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-2xl font-semibold cursor-pointer hover:from-purple-700 hover:to-pink-600 transition-all shadow-lg hover:shadow-purple-500/50"
              >
                Create First Entry
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
