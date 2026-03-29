'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import MotivationalCarousel from '@/components/MotivationalCarousel';
import {
  Smile,
  TrendingUp,
  Award,
  Moon,
  Calendar,
  Plus,
  ArrowRight,
  Heart,
  Zap,
  Star,
  Target,
  Sparkles,
  Hand,
  BarChart3,
  Trophy,
  Bed,
  Meh,
  Check,
  Circle,
} from 'lucide-react';
import { mockMoodData, mockHabits, mockSleepData, mockJournalEntries, moods } from '@/lib/mockData';
import { format } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';
import FloatingImages from '@/components/FloatingImages';
import { TourButton } from '@/components/NewTourButton';
import { OnboardaTour } from '@/components/OnboardaTour';
import { useTheme } from '@/contexts/ThemeContext';
import { useSoundEffects } from '@/hooks/useSoundEffects';

const getMoodIcon = (iconName: string) => {
  const icons: Record<string, any> = {
    Sparkles,
    Smile,
    Meh,
    Star,
  };
  return icons[iconName] || Sparkles;
};

export default function Dashboard() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const { theme } = useTheme();
  const { playClickSound, playWaterDropSound } = useSoundEffects();
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayMood = mockMoodData.find(m => m.date === today);

  // Calculate stats
  const totalHabitsToday = mockHabits.length;
  const completedHabitsToday = mockHabits.filter(h => 
    h.completed.includes(today)
  ).length;
  
  const avgSleep = (mockSleepData.reduce((sum, s) => sum + s.hours, 0) / mockSleepData.length).toFixed(1);
  const currentStreak = Math.max(...mockHabits.map(h => h.streak));

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <DashboardLayout>
      <FloatingImages images={['1.5.jpg', '2.5.jpg', '3.5.jpg']} />
      <OnboardaTour />
      <TourButton variant="floating" label="Start Tour" />
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6 relative z-10"
      >
        {/* Motivational Carousel - Auto-rotating with quotes and images */}
        <motion.div variants={item} className="dashboard-header">
          <MotivationalCarousel />
        </motion.div>

        {/* Quick Stats */}
        <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            className="mood-selector bg-gradient-to-br from-neutral-900 to-black border border-red-900/30 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-sm relative overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/5 to-red-500/0"
              animate={{
                x: ['-100%', '100%']
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Smile className="w-6 h-6 text-red-500" />
              </div>
              <motion.div 
                className="w-8 h-8 bg-red-500/30 rounded-lg flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
              >
                {todayMood ? <Smile className="w-5 h-5 text-red-400" /> : <Meh className="w-5 h-5 text-gray-400" />}
              </motion.div>
            </div>
            <h3 className="text-black dark:text-white mb-2" style={{ fontFamily: "var(--font-body)", fontSize: "var(--font-body-sm)" }}>Today's Mood</h3>
            <p className="text-white font-bold capitalize" style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-heading-sm)" }}>
              {todayMood ? todayMood.mood : 'Not tracked'}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-gradient-to-br from-neutral-900 to-black border border-red-900/30 rounded-2xl p-4 sm:p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
              </div>
              <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7 text-red-400" />
              </motion.div>
            </div>
            <h3 className="text-black dark:text-white mb-2 text-xs sm:text-sm" style={{ fontFamily: "var(--font-body)" }}>Habits Today</h3>
            <p className="text-white font-bold text-base sm:text-lg" style={{ fontFamily: "var(--font-heading)" }}>
              {completedHabitsToday}/{totalHabitsToday}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-gradient-to-br from-neutral-900 to-black border border-red-900/30 rounded-2xl p-4 sm:p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                <Award className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
              </div>
              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <Trophy className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-400" />
              </motion.div>
            </div>
            <h3 className="text-black dark:text-white mb-2 text-xs sm:text-sm" style={{ fontFamily: "var(--font-body)" }}>Current Streak</h3>
            <p className="text-white font-bold text-base sm:text-lg" style={{ fontFamily: "var(--font-heading)" }}>{currentStreak} days</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-gradient-to-br from-neutral-900 to-black border border-red-900/30 rounded-2xl p-4 sm:p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                <Moon className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
              </div>
              <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
                <Bed className="w-6 h-6 sm:w-7 sm:h-7 text-purple-400" />
              </motion.div>
            </div>
            <h3 className="text-black dark:text-white mb-2 text-xs sm:text-sm" style={{ fontFamily: "var(--font-body)" }}>Avg Sleep</h3>
            <p className="text-white font-bold text-base sm:text-lg" style={{ fontFamily: "var(--font-heading)" }}>{avgSleep}h</p>
          </motion.div>
        </motion.div>

        {/* Mood Tracker */}
        <motion.div variants={item} className="bg-gradient-to-br from-neutral-900 to-black border border-red-900/30 rounded-2xl p-4 sm:p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="font-bold text-white text-base sm:text-lg" style={{ fontFamily: "var(--font-heading)" }}>
              How are you feeling today?
            </h2>
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-black dark:text-white" />
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
            {moods.map((mood) => {
              const MoodIcon = getMoodIcon(mood.icon);
              return (
                <motion.button
                  key={mood.value}
                  whileHover={{ scale: 1.1, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    playClickSound();
                    setSelectedMood(mood.value);
                  }}
                  className={`flex flex-col items-center gap-1 sm:gap-2 p-3 sm:p-4 rounded-xl transition-all duration-300 ${
                    selectedMood === mood.value || (todayMood?.mood === mood.value && !selectedMood)
                      ? `bg-gradient-to-br ${mood.gradient} shadow-lg shadow-red-900/50 border-2 border-white/30`
                      : theme === 'dark'
                      ? 'bg-neutral-800/50 border-2 border-neutral-700 hover:border-red-500/50'
                      : 'bg-white/80 border-2 border-gray-200 hover:border-red-500/50'
                  }`}
                >
                  <MoodIcon size={20} className="text-white sm:w-6 sm:h-6" />
                  <span className="text-[10px] sm:text-xs font-medium text-white">{mood.label}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Recent Journal Entries */}
          <motion.div variants={item} className="bg-gradient-to-br from-neutral-900 to-black border border-red-900/30 rounded-2xl p-4 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
                Recent Journals
              </h2>
              <Link href="/journal" onClick={() => playClickSound()}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 text-red-500 hover:text-red-400 transition"
                >
                  <span className="text-sm font-medium">View All</span>
                  <ArrowRight size={16} />
                </motion.button>
              </Link>
            </div>

            <div className="space-y-3">
              {mockJournalEntries.slice(0, 3).map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 4 }}
                  onClick={() => playClickSound()}
                  className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-4 hover:border-red-500/50 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-semibold text-sm">{entry.title}</h3>
                    <span className="text-xs text-gray-400">{format(new Date(entry.date), 'MMM d')}</span>
                  </div>
                  <p className="text-gray-300 text-xs line-clamp-2">{entry.content}</p>
                  <div className="flex gap-2 mt-2">
                    {entry.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-[10px] bg-red-500/20 text-red-400 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            <Link href="/journal" onClick={() => playClickSound()}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-neutral-800/50 border border-neutral-700 rounded-xl text-gray-300 hover:text-white hover:border-red-500/50 transition-all"
              >
                <Plus size={16} />
                <span className="text-sm font-medium">New Journal Entry</span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Today's Habits */}
          <motion.div variants={item} className="bg-gradient-to-br from-neutral-900 to-black border border-red-900/30 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
                Today's Habits
              </h2>
              <Link href="/habits" onClick={() => playClickSound()}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 text-red-500 hover:text-red-400 transition"
                >
                  <span className="text-sm font-medium">View All</span>
                  <ArrowRight size={16} />
                </motion.button>
              </Link>
            </div>

            <div className="space-y-3">
              {mockHabits.map((habit, index) => {
                const isCompleted = habit.completed.includes(today);
                
                return (
                  <motion.div
                    key={habit.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 4 }}
                    onClick={() => playClickSound()}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                      isCompleted
                        ? 'bg-red-500/10 border-red-500/50'
                        : 'bg-neutral-800/50 border-neutral-700 hover:border-red-500/50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isCompleted ? 'bg-red-500 shadow-lg shadow-red-900/50' : 'bg-neutral-700'
                    }`}>
                      {isCompleted ? <Check className="w-5 h-5 text-white" /> : <Circle className="w-5 h-5 text-neutral-400" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-sm">{habit.name}</h3>
                      <p className="text-gray-400 text-xs">{habit.description}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award size={14} className="text-red-500" />
                      <span className="text-xs text-gray-300">{habit.streak}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
