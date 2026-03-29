'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Plus,
  Award,
  Target,
  TrendingUp,
  CheckCircle2,
  Circle,
  Flame,
  Brain,
  Dumbbell,
  Heart,
  BookOpen,
  X,
  Calendar,
  Clock,
  Zap,
  Star,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { mockHabits } from '@/lib/mockData';
import { format, subDays, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';
import Image from 'next/image';

interface Habit {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  streak: number;
  completed: string[];
  target: number;
  time?: string;
  category: string;
}

const getHabitIcon = (iconName: string) => {
  const icons: Record<string, any> = {
    brain: Brain,
    dumbbell: Dumbbell,
    heart: Heart,
    book: BookOpen,
  };
  return icons[iconName] || Target;
};

const categoryColors: Record<string, string> = {
  health: 'from-green-500 to-emerald-600',
  mindfulness: 'from-purple-500 to-violet-600',
  fitness: 'from-orange-500 to-red-600',
  learning: 'from-blue-500 to-cyan-600',
};

export default function Habits() {
  const { theme } = useTheme();
  const [habits, setHabits] = useState<Habit[]>(mockHabits);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month' | 'streak'>('week');
  const today = format(new Date(), 'yyyy-MM-dd');

  // Generate last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    return {
      date: format(date, 'yyyy-MM-dd'),
      label: format(date, 'EEE'),
      day: format(date, 'd')
    };
  });

  // Generate calendar days
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const toggleHabitCompletion = (habitId: string, date: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const completed = habit.completed.includes(date)
          ? habit.completed.filter(d => d !== date)
          : [...habit.completed, date];
        return { ...habit, completed };
      }
      return habit;
    }));
  };

  const getCompletionRate = () => {
    const totalTasks = habits.length * 7;
    const completedTasks = habits.reduce((sum, h) => 
      sum + h.completed.filter(d => last7Days.some(day => day.date === d)).length, 0
    );
    return Math.round((completedTasks / totalTasks) * 100);
  };

  return (
    <DashboardLayout>
      <div className="relative">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className={`absolute -top-20 -right-20 w-96 h-96 rounded-full blur-3xl ${
              theme === 'dark' ? 'bg-purple-600/30' : 'bg-purple-400/20'
            }`}
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className={`absolute -bottom-20 -left-20 w-96 h-96 rounded-full blur-3xl ${
              theme === 'dark' ? 'bg-orange-600/30' : 'bg-orange-400/20'
            }`}
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6 relative z-10"
        >
          {/* Compact Animated Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative overflow-hidden rounded-2xl h-40"
          >
            <div className="relative w-full h-full">
              <Image
                src="/2.jpg"
                alt="Habits"
                fill
                className="object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${
                theme === 'dark' 
                  ? 'from-black/90 via-black/70 to-transparent' 
                  : 'from-gray-900/90 via-gray-900/70 to-transparent'
              }`} />
              <div className="absolute inset-0 flex items-center justify-between px-8">
                <div>
                  <motion.h1 
                    initial={{ x: -20 }}
                    animate={{ x: 0 }}
                    className="text-4xl font-bold text-white mb-1"
                  >
                    Habit Tracker
                  </motion.h1>
                  <p className="text-white/80 text-sm">Build lasting routines, one day at a time</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-lg font-medium"
                >
                  <Plus size={18} />
                  Add Habit
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Compact Stats Cards */}
          <div className="grid grid-cols-4 gap-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -4 }}
              className={`rounded-xl p-4 ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-neutral-900/80 to-black/80 border border-purple-500/20'
                  : 'bg-white/80 border border-purple-200'
              } backdrop-blur-xl`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className={`text-xs ${theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'}`}>Active</p>
                  <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{habits.length}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -4 }}
              className={`rounded-xl p-4 ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-neutral-900/80 to-black/80 border border-orange-500/20'
                  : 'bg-white/80 border border-orange-200'
              } backdrop-blur-xl`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className={`text-xs ${theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'}`}>Best Streak</p>
                  <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {Math.max(...habits.map(h => h.streak))}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -4 }}
              className={`rounded-xl p-4 ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-neutral-900/80 to-black/80 border border-green-500/20'
                  : 'bg-white/80 border border-green-200'
              } backdrop-blur-xl`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className={`text-xs ${theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'}`}>Completion</p>
                  <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {getCompletionRate()}%
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -4 }}
              className={`rounded-xl p-4 ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-neutral-900/80 to-black/80 border border-blue-500/20'
                  : 'bg-white/80 border border-blue-200'
              } backdrop-blur-xl`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className={`text-xs ${theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'}`}>Points</p>
                  <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {habits.reduce((sum, h) => sum + h.completed.length * 10, 0)}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* View Mode Tabs */}
          <div className="flex gap-2">
            {[
              { id: 'week', label: 'Week View', icon: Calendar },
              { id: 'month', label: 'Month View', icon: Calendar },
              { id: 'streak', label: 'Streak View', icon: Flame }
            ].map((mode) => {
              const Icon = mode.icon;
              return (
                <motion.button
                  key={mode.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode(mode.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    viewMode === mode.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : theme === 'dark'
                        ? 'bg-neutral-900/50 text-white hover:bg-neutral-800'
                        : 'bg-white/50 text-black hover:bg-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {mode.label}
                </motion.button>
              );
            })}
          </div>

          {/* Habits Grid - Compact & Animated */}
          <AnimatePresence mode="wait">
            {viewMode === 'week' && (
              <motion.div
                key="week"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid gap-3"
              >
                {habits.map((habit, index) => {
                  const Icon = getHabitIcon(habit.icon);
                  const completedThisWeek = habit.completed.filter(d => 
                    last7Days.some(day => day.date === d)
                  ).length;

                  return (
                    <motion.div
                      key={habit.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.01 }}
                      className={`rounded-2xl p-4 ${
                        theme === 'dark'
                          ? 'bg-gradient-to-br from-neutral-900/80 to-black/80 border border-neutral-800'
                          : 'bg-white/80 border border-gray-200'
                      } backdrop-blur-xl`}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${categoryColors[habit.category] || 'from-gray-500 to-gray-600'} flex items-center justify-center shadow-lg`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </motion.div>

                        <div className="flex-1">
                          <h3 className={`font-bold text-base ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {habit.name}
                          </h3>
                          <p className={`text-xs ${theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'}`}>
                            {habit.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          {/* Streak Badge */}
                          <motion.div
                            animate={{
                              scale: habit.streak > 0 ? [1, 1.1, 1] : 1,
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
                              habit.streak > 7
                                ? 'bg-gradient-to-r from-orange-500 to-red-600'
                                : habit.streak > 3
                                  ? 'bg-gradient-to-r from-purple-500 to-pink-600'
                                  : theme === 'dark'
                                    ? 'bg-neutral-800'
                                    : 'bg-gray-200'
                            }`}
                          >
                            <Flame className={`w-4 h-4 ${habit.streak > 0 ? 'text-white' : theme === 'dark' ? 'text-neutral-600' : 'text-gray-400'}`} />
                            <span className={`text-sm font-bold ${habit.streak > 0 ? 'text-white' : theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'}`}>
                              {habit.streak}
                            </span>
                          </motion.div>

                          {/* Circular Progress */}
                          <div className="relative w-14 h-14">
                            <svg className="w-14 h-14 -rotate-90">
                              <circle
                                cx="28"
                                cy="28"
                                r="24"
                                stroke={theme === 'dark' ? '#374151' : '#e5e7eb'}
                                strokeWidth="4"
                                fill="none"
                              />
                              <motion.circle
                                cx="28"
                                cy="28"
                                r="24"
                                stroke="url(#gradient)"
                                strokeWidth="4"
                                fill="none"
                                strokeLinecap="round"
                                initial={{ strokeDasharray: '0 150' }}
                                animate={{ 
                                  strokeDasharray: `${(completedThisWeek / 7) * 150} 150` 
                                }}
                                transition={{ duration: 1, ease: "easeOut" }}
                              />
                              <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="#a855f7" />
                                  <stop offset="100%" stopColor="#ec4899" />
                                </linearGradient>
                              </defs>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                {completedThisWeek}/7
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Compact Week Grid */}
                      <div className="flex gap-1.5">
                        {last7Days.map((day) => {
                          const isCompleted = habit.completed.includes(day.date);
                          const isDayToday = day.date === today;

                          return (
                            <motion.button
                              key={day.date}
                              whileHover={{ scale: 1.1, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => toggleHabitCompletion(habit.id, day.date)}
                              className="flex-1 relative group"
                            >
                              <motion.div
                                animate={{
                                  boxShadow: isCompleted 
                                    ? '0 4px 20px rgba(168, 85, 247, 0.4)' 
                                    : '0 0 0 rgba(0, 0, 0, 0)',
                                }}
                                className={`rounded-lg p-2 transition-all ${
                                  isCompleted
                                    ? 'bg-gradient-to-br from-purple-500 to-pink-600'
                                    : isDayToday
                                      ? theme === 'dark'
                                        ? 'bg-neutral-800 border-2 border-purple-500/50'
                                        : 'bg-gray-100 border-2 border-purple-400'
                                      : theme === 'dark'
                                        ? 'bg-neutral-800/50 hover:bg-neutral-700'
                                        : 'bg-gray-50 hover:bg-gray-100'
                                }`}
                              >
                                <div className={`text-[10px] mb-1 ${
                                  isCompleted ? 'text-white/80' : theme === 'dark' ? 'text-neutral-500' : 'text-gray-500'
                                }`}>
                                  {day.label}
                                </div>
                                <div className={`text-xs font-bold mb-1 ${
                                  isCompleted ? 'text-white' : theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>
                                  {day.day}
                                </div>
                                <div className="flex items-center justify-center">
                                  {isCompleted ? (
                                    <motion.div
                                      initial={{ scale: 0, rotate: -180 }}
                                      animate={{ scale: 1, rotate: 0 }}
                                      transition={{ type: "spring", stiffness: 200 }}
                                    >
                                      <CheckCircle2 className="w-4 h-4 text-white" />
                                    </motion.div>
                                  ) : (
                                    <Circle className={`w-4 h-4 ${theme === 'dark' ? 'text-neutral-600' : 'text-gray-400'}`} />
                                  )}
                                </div>
                              </motion.div>

                              {/* Hover Tooltip */}
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                {isCompleted ? 'Completed' : 'Mark Complete'}
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {/* Month View */}
            {viewMode === 'month' && selectedHabit && (
              <motion.div
                key="month"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`rounded-2xl p-6 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-br from-neutral-900/80 to-black/80 border border-neutral-800'
                    : 'bg-white/80 border border-gray-200'
                } backdrop-blur-xl`}
              >
                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {format(currentMonth, 'MMMM yyyy')}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentMonth(subDays(currentMonth, 30))}
                      className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-neutral-800 hover:bg-neutral-700' : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setCurrentMonth(addDays(currentMonth, 30))}
                      className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-neutral-800 hover:bg-neutral-700' : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className={`text-center text-xs font-medium ${theme === 'dark' ? 'text-neutral-500' : 'text-gray-500'} pb-2`}>
                      {day}
                    </div>
                  ))}
                  {calendarDays.map((day) => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const isCompleted = selectedHabit.completed.includes(dateStr);
                    const isDayToday = isToday(day);

                    return (
                      <motion.button
                        key={dateStr}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleHabitCompletion(selectedHabit.id, dateStr)}
                        className={`aspect-square rounded-lg p-2 text-sm font-medium transition-all ${
                          isCompleted
                            ? 'bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg'
                            : isDayToday
                              ? theme === 'dark'
                                ? 'bg-neutral-800 text-white border-2 border-purple-500'
                                : 'bg-white text-gray-900 border-2 border-purple-400'
                              : theme === 'dark'
                                ? 'bg-neutral-800/50 text-white hover:bg-neutral-700'
                                : 'bg-gray-50 text-black hover:bg-gray-100'
                        }`}
                      >
                        {format(day, 'd')}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Streak View */}
            {viewMode === 'streak' && (
              <motion.div
                key="streak"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-2 gap-4"
              >
                {habits
                  .sort((a, b) => b.streak - a.streak)
                  .map((habit, index) => {
                    const Icon = getHabitIcon(habit.icon);
                    return (
                      <motion.div
                        key={habit.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -4 }}
                        className={`rounded-2xl p-6 ${
                          theme === 'dark'
                            ? 'bg-gradient-to-br from-neutral-900/80 to-black/80 border border-neutral-800'
                            : 'bg-white/80 border border-gray-200'
                        } backdrop-blur-xl relative overflow-hidden`}
                      >
                        {/* Animated Background */}
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.1, 0.2, 0.1],
                          }}
                          transition={{ duration: 3, repeat: Infinity }}
                          className={`absolute inset-0 bg-gradient-to-br ${categoryColors[habit.category]}`}
                        />

                        <div className="relative z-10">
                          <div className="flex items-center gap-3 mb-4">
                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${categoryColors[habit.category]} flex items-center justify-center shadow-lg`}>
                              <Icon className="w-7 h-7 text-white" />
                            </div>
                            <div>
                              <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                {habit.name}
                              </h3>
                              <p className={`text-xs ${theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'}`}>
                                {habit.category}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-end gap-4">
                            <div>
                              <p className={`text-xs mb-1 ${theme === 'dark' ? 'text-neutral-500' : 'text-gray-500'}`}>
                                Current Streak
                              </p>
                              <div className="flex items-baseline gap-2">
                                <motion.span
                                  animate={{
                                    scale: habit.streak > 7 ? [1, 1.1, 1] : 1,
                                  }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                  className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                                >
                                  {habit.streak}
                                </motion.span>
                                <span className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'}`}>
                                  days
                                </span>
                              </div>
                            </div>

                            <motion.div
                              animate={{
                                rotate: [0, 10, -10, 0],
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <Flame className="w-16 h-16 text-orange-500" />
                            </motion.div>
                          </div>

                          {/* Mini Progress Bar */}
                          <div className="mt-4">
                            <div className={`h-2 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-neutral-800' : 'bg-gray-200'}`}>
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min((habit.streak / 30) * 100, 100)}%` }}
                                className={`h-full bg-gradient-to-r ${categoryColors[habit.category]}`}
                              />
                            </div>
                            <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-neutral-500' : 'text-gray-500'}`}>
                              Goal: 30 days
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Habit Selector for Month View */}
          {viewMode === 'month' && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {habits.map((habit) => {
                const Icon = getHabitIcon(habit.icon);
                return (
                  <motion.button
                    key={habit.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedHabit(habit)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap ${
                      selectedHabit?.id === habit.id
                        ? `bg-gradient-to-r ${categoryColors[habit.category]} text-white shadow-lg`
                        : theme === 'dark'
                          ? 'bg-neutral-900/50 text-white hover:bg-neutral-800'
                          : 'bg-white/50 text-black hover:bg-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {habit.name}
                  </motion.button>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
