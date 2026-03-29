'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Target, TrendingUp, CheckCircle2, Circle, Flame, Brain,
  Dumbbell, Heart, BookOpen, X, Calendar, Star, Edit, Trash2,
  Save, Award, Zap, Sun, Moon, Coffee, Utensils, Book, Music,
  Droplets, Wind, Eye, Palette, Code, Sparkles
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useSoundEffects } from '@/hooks/useSoundEffects';

const HABIT_ICONS = [
  { id: 'brain', icon: Brain, label: 'Brain' },
  { id: 'dumbbell', icon: Dumbbell, label: 'Fitness' },
  { id: 'heart', icon: Heart, label: 'Health' },
  { id: 'book', icon: BookOpen, label: 'Reading' },
  { id: 'coffee', icon: Coffee, label: 'Morning' },
  { id: 'utensils', icon: Utensils, label: 'Nutrition' },
  { id: 'music', icon: Music, label: 'Music' },
  { id: 'droplets', icon: Droplets, label: 'Hydration' },
  { id: 'sun', icon: Sun, label: 'Energy' },
  { id: 'moon', icon: Moon, label: 'Sleep' },
  { id: 'code', icon: Code, label: 'Learning' },
  { id: 'palette', icon: Palette, label: 'Creative' },
];

const CATEGORY_COLORS: { [key: string]: string } = {
  health: 'from-green-500 to-emerald-600',
  mindfulness: 'from-purple-500 to-violet-600',
  fitness: 'from-orange-500 to-red-600',
  learning: 'from-blue-500 to-cyan-600',
  productivity: 'from-pink-500 to-rose-600',
  creative: 'from-yellow-500 to-amber-600',
};

const CATEGORIES = [
  { id: 'health', label: 'Health', gradient: 'from-green-500 to-emerald-600' },
  { id: 'mindfulness', label: 'Mindfulness', gradient: 'from-purple-500 to-violet-600' },
  { id: 'fitness', label: 'Fitness', gradient: 'from-orange-500 to-red-600' },
  { id: 'learning', label: 'Learning', gradient: 'from-blue-500 to-cyan-600' },
  { id: 'productivity', label: 'Productivity', gradient: 'from-pink-500 to-rose-600' },
  { id: 'creative', label: 'Creative', gradient: 'from-yellow-500 to-amber-600' },
];

interface Habit {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  streak: number;
  bestStreak: number;
  completed: string[];
  target: number;
  time?: string;
  isFavorite: boolean;
  createdAt: string;
}

const STORAGE_KEY = 'reveura_habits';

export default function HabitsPage() {
  const { playClickSound, playWaterDropSound } = useSoundEffects();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [currentHabit, setCurrentHabit] = useState<Partial<Habit>>({
    name: '',
    description: '',
    icon: 'brain',
    category: 'health',
    target: 7,
    time: '',
    isFavorite: false,
  });
  const [viewMode, setViewMode] = useState<'week' | 'month' | 'streak'>('week');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const loadedHabits = JSON.parse(stored);
        // Calculate streaks on load
        const habitsWithStreaks = loadedHabits.map((h: Habit) => ({
          ...h,
          streak: calculateStreak(h.completed),
        }));
        setHabits(habitsWithStreaks);
      } catch (error) {
        console.error('Error loading habits:', error);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (habits.length >= 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
    }
  }, [habits]);

  const calculateStreak = (completed: string[]): number => {
    if (completed.length === 0) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 0;
    
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      if (completed.includes(dateStr)) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    
    return streak;
  };

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push({
        date: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', { weekday: 'short' }),
        day: date.getDate(),
      });
    }
    return days;
  };

  const getMonthDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const toggleCompletion = (habitId: string, dateStr: string) => {
    playWaterDropSound();
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const completed = habit.completed.includes(dateStr)
          ? habit.completed.filter(d => d !== dateStr)
          : [...habit.completed, dateStr];
        
        const newStreak = calculateStreak(completed);
        const bestStreak = Math.max(habit.bestStreak, newStreak);
        
        return { ...habit, completed, streak: newStreak, bestStreak };
      }
      return habit;
    }));
  };

  const saveHabit = () => {
    if (!currentHabit.name) return;

    if (editingHabit) {
      setHabits(habits.map(h =>
        h.id === editingHabit.id
          ? { ...editingHabit, ...currentHabit } as Habit
          : h
      ));
    } else {
      const newHabit: Habit = {
        id: Date.now().toString(),
        name: currentHabit.name,
        description: currentHabit.description || '',
        icon: currentHabit.icon || 'brain',
        color: CATEGORY_COLORS[currentHabit.category || 'health'],
        category: currentHabit.category || 'health',
        streak: 0,
        bestStreak: 0,
        completed: [],
        target: currentHabit.target || 7,
        time: currentHabit.time,
        isFavorite: currentHabit.isFavorite || false,
        createdAt: new Date().toISOString(),
      };
      setHabits([...habits, newHabit]);
    }

    setIsCreating(false);
    setEditingHabit(null);
    setCurrentHabit({
      name: '',
      description: '',
      icon: 'brain',
      category: 'health',
      target: 7,
      time: '',
      isFavorite: false,
    });
  };

  const deleteHabit = (id: string) => {
    if (confirm('Delete this habit?')) {
      setHabits(habits.filter(h => h.id !== id));
    }
  };

  const toggleFavorite = (id: string) => {
    setHabits(habits.map(h =>
      h.id === id ? { ...h, isFavorite: !h.isFavorite } : h
    ));
  };

  const editHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setCurrentHabit({
      name: habit.name,
      description: habit.description,
      icon: habit.icon,
      category: habit.category,
      target: habit.target,
      time: habit.time,
      isFavorite: habit.isFavorite,
    });
    setIsCreating(true);
  };

  const startNewHabit = () => {
    setIsCreating(true);
    setEditingHabit(null);
    setCurrentHabit({
      name: '',
      description: '',
      icon: 'brain',
      category: 'health',
      target: 7,
      time: '',
      isFavorite: false,
    });
  };

  const getCompletionRate = () => {
    const last7Days = getLast7Days();
    const totalTasks = habits.length * 7;
    if (totalTasks === 0) return 0;
    
    const completedTasks = habits.reduce((sum, h) =>
      sum + h.completed.filter(d => last7Days.some(day => day.date === d)).length, 0
    );
    return Math.round((completedTasks / totalTasks) * 100);
  };

  const last7Days = getLast7Days();
  const { firstDay, daysInMonth } = getMonthDays();

  return (
    <DashboardLayout>
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full"
              animate={{
                x: [Math.random() * 1000, Math.random() * 1000],
                y: [Math.random() * 1000, Math.random() * 1000],
                opacity: [0, 0.5, 0],
              }}
              transition={{ duration: 10 + Math.random() * 20, repeat: Infinity }}
            />
          ))}
        </div>

        <div className="relative z-10 p-4 sm:p-6 md:p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-8"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent mb-2">
                  Habit Tracker
                </h1>
                <p className="text-gray-400 text-xs sm:text-sm">
                  {habits.length} habits · {habits.filter(h => h.isFavorite).length} favorites
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  playClickSound();
                  startNewHabit();
                }}
                className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl flex items-center justify-center gap-2 cursor-pointer font-semibold text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                Add Habit
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-purple-200/20"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                    <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-400">Active Habits</p>
                    <p className="text-2xl sm:text-3xl font-bold text-white">{habits.length}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-xl rounded-2xl p-6 border border-orange-200/20"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                    <Flame className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Best Streak</p>
                    <p className="text-3xl font-bold text-white">
                      {habits.length > 0 ? Math.max(...habits.map(h => h.bestStreak)) : 0}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl rounded-2xl p-6 border border-green-200/20"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Completion</p>
                    <p className="text-3xl font-bold text-white">{getCompletionRate()}%</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/20"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Total Points</p>
                    <p className="text-3xl font-bold text-white">
                      {habits.reduce((sum, h) => sum + h.completed.length * 10, 0)}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* View Mode Tabs */}
            <div className="flex gap-3 mb-6">
              {[
                { id: 'week', label: 'Week View', icon: Calendar },
                { id: 'month', label: 'Month View', icon: Calendar },
                { id: 'streak', label: 'Streak View', icon: Flame },
              ].map((mode) => {
                const Icon = mode.icon;
                return (
                  <motion.button
                    key={mode.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      playClickSound();
                      setViewMode(mode.id as any);
                    }}
                    className={`px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer text-sm font-semibold ${
                      viewMode === mode.id
                        ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-xl'
                        : 'bg-gray-800/50 text-white hover:bg-gray-700/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {mode.label}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Create/Edit Modal */}
          <AnimatePresence>
            {isCreating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-8"
                onClick={(e) => e.target === e.currentTarget && setIsCreating(false)}
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                  className="bg-gray-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
                >
                  <div className={`bg-gradient-to-r ${CATEGORY_COLORS[currentHabit.category || 'health']} p-6`}>
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-3">
                        <Target className="w-8 h-8" />
                        <h2 className="text-2xl font-bold">
                          {editingHabit ? 'Edit Habit' : 'Create New Habit'}
                        </h2>
                      </div>
                      <button
                        onClick={() => {
                          playClickSound();
                          setIsCreating(false);
                        }}
                        className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center cursor-pointer"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  </div>

                  <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
                    <div className="mb-6">
                      <label className="text-sm font-semibold mb-3 text-white block">Habit Name</label>
                      <input
                        type="text"
                        value={currentHabit.name || ''}
                        onChange={(e) => setCurrentHabit({ ...currentHabit, name: e.target.value })}
                        placeholder="E.g., Morning Meditation"
                        className="w-full px-6 py-4 bg-gray-800 rounded-2xl focus:ring-2 focus:ring-purple-500 text-white text-lg"
                      />
                    </div>

                    <div className="mb-6">
                      <label className="text-sm font-semibold mb-3 text-white block">Description</label>
                      <textarea
                        value={currentHabit.description || ''}
                        onChange={(e) => setCurrentHabit({ ...currentHabit, description: e.target.value })}
                        placeholder="What does this habit involve?"
                        rows={3}
                        className="w-full px-6 py-4 bg-gray-800 rounded-2xl focus:ring-2 focus:ring-purple-500 text-white resize-none"
                      />
                    </div>

                    <div className="mb-6">
                      <label className="text-sm font-semibold mb-3 text-white block">Category</label>
                      <div className="grid grid-cols-3 gap-3">
                        {CATEGORIES.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => {
                              playClickSound();
                              setCurrentHabit({ ...currentHabit, category: cat.id });
                            }}
                            className={`p-4 rounded-xl cursor-pointer text-center font-semibold ${
                              currentHabit.category === cat.id
                                ? `bg-gradient-to-br ${cat.gradient} text-white shadow-xl`
                                : 'bg-gray-800 text-gray-400'
                            }`}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="text-sm font-semibold mb-3 text-white block">Icon</label>
                      <div className="grid grid-cols-6 gap-3">
                        {HABIT_ICONS.map((iconData) => {
                          const Icon = iconData.icon;
                          return (
                            <button
                              key={iconData.id}
                              onClick={() => {
                                playClickSound();
                                setCurrentHabit({ ...currentHabit, icon: iconData.id });
                              }}
                              className={`p-4 rounded-xl cursor-pointer flex flex-col items-center gap-1 ${
                                currentHabit.icon === iconData.id
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-gray-800 text-gray-400'
                              }`}
                            >
                              <Icon className="w-6 h-6" />
                              <span className="text-xs">{iconData.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="text-sm font-semibold mb-3 text-white block">Weekly Target</label>
                      <input
                        type="number"
                        min="1"
                        max="7"
                        value={currentHabit.target || 7}
                        onChange={(e) => setCurrentHabit({ ...currentHabit, target: parseInt(e.target.value) })}
                        className="w-full px-6 py-4 bg-gray-800 rounded-2xl focus:ring-2 focus:ring-purple-500 text-white"
                      />
                    </div>

                    <div className="mb-6">
                      <label className="text-sm font-semibold mb-3 text-white block">Reminder Time (Optional)</label>
                      <input
                        type="time"
                        value={currentHabit.time || ''}
                        onChange={(e) => setCurrentHabit({ ...currentHabit, time: e.target.value })}
                        className="w-full px-6 py-4 bg-gray-800 rounded-2xl focus:ring-2 focus:ring-purple-500 text-white"
                      />
                    </div>

                    <button
                      onClick={() => {
                        playWaterDropSound();
                        saveHabit();
                      }}
                      disabled={!currentHabit.name}
                      className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-2xl font-bold cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      {editingHabit ? 'Update Habit' : 'Create Habit'}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Habits Display */}
          <AnimatePresence mode="wait">
            {viewMode === 'week' && (
              <motion.div
                key="week"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {habits.map((habit, index) => {
                  const IconComponent = HABIT_ICONS.find(i => i.id === habit.icon)?.icon || Brain;
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
                      className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-800"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${CATEGORY_COLORS[habit.category]} flex items-center justify-center`}>
                          <IconComponent className="w-7 h-7 text-white" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg text-white">{habit.name}</h3>
                            <button
                              onClick={() => {
                                playClickSound();
                                toggleFavorite(habit.id);
                              }}
                              className="cursor-pointer"
                            >
                              <Star className={`w-4 h-4 ${habit.isFavorite ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'}`} />
                            </button>
                          </div>
                          <p className="text-sm text-gray-400">{habit.description}</p>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                            habit.streak > 7 ? 'bg-gradient-to-r from-orange-500 to-red-600' :
                            habit.streak > 3 ? 'bg-gradient-to-r from-purple-500 to-pink-600' :
                            'bg-gray-800'
                          }`}>
                            <Flame className={`w-5 h-5 ${habit.streak > 0 ? 'text-white' : 'text-gray-500'}`} />
                            <span className={`text-lg font-bold ${habit.streak > 0 ? 'text-white' : 'text-gray-500'}`}>
                              {habit.streak}
                            </span>
                          </div>

                          <div className="relative w-16 h-16">
                            <svg className="w-16 h-16 -rotate-90">
                              <circle cx="32" cy="32" r="28" stroke="#374151" strokeWidth="4" fill="none" />
                              <circle
                                cx="32"
                                cy="32"
                                r="28"
                                stroke="url(#gradient)"
                                strokeWidth="4"
                                fill="none"
                                strokeLinecap="round"
                                strokeDasharray={`${(completedThisWeek / 7) * 176} 176`}
                              />
                              <defs>
                                <linearGradient id="gradient">
                                  <stop offset="0%" stopColor="#a855f7" />
                                  <stop offset="100%" stopColor="#ec4899" />
                                </linearGradient>
                              </defs>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-sm font-bold text-white">{completedThisWeek}/7</span>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              playClickSound();
                              editHabit(habit);
                            }}
                            className="p-2 bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700"
                          >
                            <Edit className="w-4 h-4 text-white" />
                          </button>

                          <button
                            onClick={() => {
                              playClickSound();
                              deleteHabit(habit.id);
                            }}
                            className="p-2 bg-red-600 rounded-lg cursor-pointer hover:bg-red-700"
                          >
                            <Trash2 className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {last7Days.map((day) => {
                          const isCompleted = habit.completed.includes(day.date);
                          const isToday = day.date === new Date().toISOString().split('T')[0];

                          return (
                            <motion.button
                              key={day.date}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => toggleCompletion(habit.id, day.date)}
                              className={`flex-1 p-3 rounded-xl cursor-pointer transition-all ${
                                isCompleted
                                  ? `bg-gradient-to-br ${CATEGORY_COLORS[habit.category]} text-white shadow-lg`
                                  : isToday
                                    ? 'bg-gray-700 text-white border-2 border-purple-500'
                                    : 'bg-gray-800 text-gray-400'
                              }`}
                            >
                              <div className="text-xs font-medium mb-1">{day.label}</div>
                              <div className="flex items-center justify-center">
                                {isCompleted ? (
                                  <CheckCircle2 className="w-6 h-6" />
                                ) : (
                                  <Circle className="w-6 h-6" />
                                )}
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

            {viewMode === 'month' && (
              <motion.div
                key="month"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => {
                      const newDate = new Date(selectedDate);
                      newDate.setMonth(newDate.getMonth() - 1);
                      setSelectedDate(newDate);
                    }}
                    className="p-2 bg-gray-800 rounded-lg cursor-pointer"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <h3 className="text-2xl font-bold text-white">
                    {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h3>

                  <button
                    onClick={() => {
                      const newDate = new Date(selectedDate);
                      newDate.setMonth(newDate.getMonth() + 1);
                      setSelectedDate(newDate);
                    }}
                    className="p-2 bg-gray-800 rounded-lg cursor-pointer"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center font-semibold text-gray-400 text-sm py-2">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {[...Array(firstDay)].map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                  ))}

                  {[...Array(daysInMonth)].map((_, i) => {
                    const day = i + 1;
                    const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
                    const dateStr = date.toISOString().split('T')[0];
                    const completedCount = habits.filter(h => h.completed.includes(dateStr)).length;
                    const isToday = dateStr === new Date().toISOString().split('T')[0];

                    return (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.1 }}
                        className={`aspect-square rounded-xl flex flex-col items-center justify-center p-2 cursor-pointer ${
                          completedCount > 0
                            ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white'
                            : isToday
                              ? 'bg-gray-700 border-2 border-purple-500 text-white'
                              : 'bg-gray-800 text-gray-400'
                        }`}
                      >
                        <div className="text-lg font-bold">{day}</div>
                        {completedCount > 0 && (
                          <div className="text-xs mt-1">{completedCount} done</div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {viewMode === 'streak' && (
              <motion.div
                key="streak"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 gap-6"
              >
                {habits.sort((a, b) => b.streak - a.streak).map((habit, index) => {
                  const IconComponent = HABIT_ICONS.find(i => i.id === habit.icon)?.icon || Brain;

                  return (
                    <motion.div
                      key={habit.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className={`bg-gradient-to-br ${CATEGORY_COLORS[habit.category]}/10 backdrop-blur-xl rounded-3xl p-8 border border-gray-800`}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${CATEGORY_COLORS[habit.category]} flex items-center justify-center`}>
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        <button onClick={() => toggleFavorite(habit.id)}>
                          <Star className={`w-6 h-6 ${habit.isFavorite ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'}`} />
                        </button>
                      </div>

                      <h3 className="text-2xl font-bold text-white mb-2">{habit.name}</h3>
                      <p className="text-gray-400 text-sm mb-6">{habit.description}</p>

                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm text-gray-400">Current Streak</p>
                          <div className="flex items-center gap-2">
                            <Flame className={`w-8 h-8 ${habit.streak > 0 ? 'text-orange-500' : 'text-gray-500'}`} />
                            <span className="text-4xl font-bold text-white">{habit.streak}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-gray-400">Best Streak</p>
                          <div className="flex items-center gap-2 justify-end">
                            <Award className="w-6 h-6 text-yellow-500" />
                            <span className="text-2xl font-bold text-white">{habit.bestStreak}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => editHabit(habit)}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl cursor-pointer flex items-center justify-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => deleteHabit(habit.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-xl cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {habits.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Target className="w-24 h-24 text-purple-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-2">No habits yet</h3>
              <p className="text-gray-400 mb-6">Start building better habits today</p>
              <button
                onClick={startNewHabit}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-2xl font-semibold cursor-pointer"
              >
                Create Your First Habit
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
