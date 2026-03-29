'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Moon,
  Clock,
  TrendingUp,
  Calendar,
  Star,
  Zap,
  Award,
  Activity,
  CloudMoon,
  Sunrise,
  Sunset,
  BedDouble,
  Target,
  Heart,
  Plus,
  ChevronRight,
  BarChart3,
  Timer,
  X,
  type LucideIcon
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { mockSleepData } from '@/lib/mockData';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { format } from 'date-fns';
import { Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import Image from 'next/image';

interface SleepEntry {
  date: string;
  hours: number;
  quality: 'excellent' | 'good' | 'poor';
  bedtime: string;
  wakeup: string;
}

interface SleepGoal {
  targetHours: number;
  bedtime: string;
  wakeup: string;
}

const SLEEP_STORAGE_KEY = 'reveura_sleep_entries';
const SLEEP_GOAL_STORAGE_KEY = 'reveura_sleep_goal';

const defaultSleepGoal: SleepGoal = {
  targetHours: 8,
  bedtime: '22:30',
  wakeup: '06:30',
};

const viewModes: { id: 'overview' | 'analytics' | 'history'; label: string; icon: LucideIcon }[] = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'history', label: 'History', icon: Calendar },
];

const parseSleepDate = (date: string) => new Date(`${date}T12:00:00`);

const sortSleepEntries = (entries: SleepEntry[]) =>
  entries
    .slice()
    .sort((left, right) => parseSleepDate(left.date).getTime() - parseSleepDate(right.date).getTime());

const getSleepWindowHours = (bedtime: string, wakeup: string) => {
  const [bedtimeHours, bedtimeMinutes] = bedtime.split(':').map(Number);
  const [wakeupHours, wakeupMinutes] = wakeup.split(':').map(Number);

  const bedtimeTotal = bedtimeHours * 60 + bedtimeMinutes;
  let wakeupTotal = wakeupHours * 60 + wakeupMinutes;

  if (wakeupTotal <= bedtimeTotal) {
    wakeupTotal += 24 * 60;
  }

  return ((wakeupTotal - bedtimeTotal) / 60).toFixed(1);
};

const loadStoredSleepEntries = () => {
  try {
    if (typeof window === 'undefined') {
      return sortSleepEntries(mockSleepData);
    }

    const storedEntries = localStorage.getItem(SLEEP_STORAGE_KEY);
    if (!storedEntries) {
      return sortSleepEntries(mockSleepData);
    }

    const parsedEntries = JSON.parse(storedEntries) as SleepEntry[];
    return Array.isArray(parsedEntries) && parsedEntries.length > 0
      ? sortSleepEntries(parsedEntries)
      : sortSleepEntries(mockSleepData);
  } catch (error) {
    console.error('Error loading sleep entries:', error);
    return sortSleepEntries(mockSleepData);
  }
};

const loadStoredSleepGoal = () => {
  try {
    if (typeof window === 'undefined') {
      return defaultSleepGoal;
    }

    const storedGoal = localStorage.getItem(SLEEP_GOAL_STORAGE_KEY);
    if (!storedGoal) {
      return defaultSleepGoal;
    }

    const parsedGoal = JSON.parse(storedGoal) as SleepGoal;
    return parsedGoal.targetHours && parsedGoal.bedtime && parsedGoal.wakeup
      ? parsedGoal
      : defaultSleepGoal;
  } catch (error) {
    console.error('Error loading sleep goal:', error);
    return defaultSleepGoal;
  }
};

export default function Sleep() {
  const { theme } = useTheme();
  const { playClickSound, playWaterDropSound } = useSoundEffects();
  const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>(() => sortSleepEntries(mockSleepData));
  const [sleepGoal, setSleepGoal] = useState<SleepGoal>(defaultSleepGoal);
  const [didHydrateStorage, setDidHydrateStorage] = useState(false);
  const [viewMode, setViewMode] = useState<'overview' | 'analytics' | 'history'>('overview');
  const [selectedEntry, setSelectedEntry] = useState<SleepEntry | null>(null);
  const [isLogSleepOpen, setIsLogSleepOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [currentSleepEntry, setCurrentSleepEntry] = useState<SleepEntry>({
    date: format(new Date(), 'yyyy-MM-dd'),
    hours: defaultSleepGoal.targetHours,
    quality: 'good',
    bedtime: defaultSleepGoal.bedtime,
    wakeup: defaultSleepGoal.wakeup,
  });
  const [goalDraft, setGoalDraft] = useState<SleepGoal>(defaultSleepGoal);

  useEffect(() => {
    queueMicrotask(() => {
      const storedEntries = loadStoredSleepEntries();
      const storedGoal = loadStoredSleepGoal();

      setSleepEntries(storedEntries);
      setSleepGoal(storedGoal);
      setGoalDraft(storedGoal);
      setDidHydrateStorage(true);
    });
  }, []);

  useEffect(() => {
    if (!didHydrateStorage) {
      return;
    }

    localStorage.setItem(SLEEP_STORAGE_KEY, JSON.stringify(sleepEntries));
  }, [didHydrateStorage, sleepEntries]);

  useEffect(() => {
    if (!didHydrateStorage) {
      return;
    }

    localStorage.setItem(SLEEP_GOAL_STORAGE_KEY, JSON.stringify(sleepGoal));
  }, [didHydrateStorage, sleepGoal]);

  const avgSleep = sleepEntries.length
    ? (sleepEntries.reduce((sum, sleep) => sum + sleep.hours, 0) / sleepEntries.length).toFixed(1)
    : '0.0';
  const goodSleepDays = sleepEntries.filter((sleep) => sleep.quality === 'excellent' || sleep.quality === 'good').length;
  const sleepScore = sleepEntries.length ? Math.round((goodSleepDays / sleepEntries.length) * 100) : 0;
  const bestSleep = sleepEntries.length ? Math.max(...sleepEntries.map((sleep) => sleep.hours)) : 0;
  const consistency = sleepEntries.filter((sleep) => sleep.hours >= 7 && sleep.hours <= 9).length;

  const chartData = sleepEntries.map((sleep) => ({
    date: format(parseSleepDate(sleep.date), 'MMM d'),
    hours: sleep.hours,
    quality: sleep.quality === 'excellent' ? 5 : sleep.quality === 'good' ? 4 : 2,
    target: sleepGoal.targetHours
  }));

  const radarData = [
    { metric: 'Duration', value: (parseFloat(avgSleep) / 10) * 100 },
    { metric: 'Quality', value: sleepScore },
    { metric: 'Consistency', value: sleepEntries.length ? (consistency / sleepEntries.length) * 100 : 0 },
    { metric: 'Timing', value: 85 },
    { metric: 'Recovery', value: Math.min(100, Math.round((parseFloat(avgSleep) / sleepGoal.targetHours) * 100)) },
  ];

  const weekData = sleepEntries.slice(-7).map((sleep) => ({
    day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][parseSleepDate(sleep.date).getDay()],
    hours: sleep.hours,
    quality: sleep.quality
  }));

  const latestEntry = sleepEntries[sleepEntries.length - 1] ?? null;

  const openLogSleepModal = () => {
    playClickSound();
    setCurrentSleepEntry({
      date: format(new Date(), 'yyyy-MM-dd'),
      hours: sleepGoal.targetHours,
      quality: 'good',
      bedtime: sleepGoal.bedtime,
      wakeup: sleepGoal.wakeup,
    });
    setIsLogSleepOpen(true);
  };

  const openGoalModal = () => {
    playClickSound();
    setGoalDraft(sleepGoal);
    setIsGoalModalOpen(true);
  };

  const saveSleepEntry = () => {
    if (!currentSleepEntry.date || !currentSleepEntry.bedtime || !currentSleepEntry.wakeup || currentSleepEntry.hours <= 0) {
      return;
    }

    playWaterDropSound();

    setSleepEntries((entries) => {
      const nextEntries = entries.filter((entry) => entry.date !== currentSleepEntry.date);
      nextEntries.push(currentSleepEntry);
      return sortSleepEntries(nextEntries);
    });
    setIsLogSleepOpen(false);
  };

  const saveSleepGoal = () => {
    if (goalDraft.targetHours < 4 || goalDraft.targetHours > 12) {
      return;
    }

    playWaterDropSound();
    setSleepGoal(goalDraft);
    setIsGoalModalOpen(false);
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'from-emerald-500 to-green-600';
      case 'good': return 'from-blue-500 to-cyan-600';
      case 'poor': return 'from-orange-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getQualityIcon = (quality: string) => {
    switch (quality) {
      case 'excellent': return Star;
      case 'good': return Moon;
      case 'poor': return CloudMoon;
      default: return Moon;
    }
  };

  return (
    <DashboardLayout>
      <div className="relative min-h-screen">
        {/* Premium Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 180, 360],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className={`absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full blur-3xl ${
              theme === 'dark' ? 'bg-blue-600/40' : 'bg-blue-400/30'
            }`}
          />
          <motion.div
            animate={{
              scale: [1.3, 1, 1.3],
              rotate: [360, 180, 0],
              opacity: [0.4, 0.2, 0.4],
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className={`absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full blur-3xl ${
              theme === 'dark' ? 'bg-purple-600/40' : 'bg-purple-400/30'
            }`}
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8 lg:space-y-10 relative z-10"
        >
          {/* Premium Hero Section with Parallax */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative overflow-hidden rounded-2xl sm:rounded-3xl h-48 sm:h-56 md:h-64 group"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6 }}
              className="relative w-full h-full"
            >
              <Image
                src="/3.jpg"
                alt="Sleep Wellness"
                fill
                className="object-cover"
                priority
              />
              <div className={`absolute inset-0 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-black/90 via-blue-900/70 to-purple-900/50'
                  : 'bg-gradient-to-r from-gray-900/90 via-blue-900/70 to-purple-900/50'
              }`} />
              
              {/* Floating Moon Animation */}
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{ duration: 6, repeat: Infinity }}
                className="absolute top-4 right-4 sm:top-8 sm:right-12"
              >
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-400 shadow-2xl shadow-yellow-500/50">
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent"
                  />
                  <Moon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
                </div>
              </motion.div>

              <div className="absolute inset-0 flex items-center px-4 sm:px-8 md:px-12">
                <div className="space-y-3 sm:space-y-4">
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4"
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-blue-500/50">
                      <BedDouble className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                        Sleep Analytics
                      </h1>
                      <p className="text-blue-100 text-xs sm:text-sm mt-1">Powered by advanced sleep science</p>
                    </div>
                  </motion.div>
                  <motion.p
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-white/90 text-sm sm:text-base md:text-lg max-w-2xl hidden sm:block leading-relaxed"
                  >
                    Track, analyze, and optimize your sleep patterns for peak performance
                  </motion.p>
                  
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-5 sm:mt-7"
                  >
                    <button
                      onClick={openLogSleepModal}
                      className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm sm:text-base font-medium shadow-lg hover:shadow-xl transition-all"
                    >
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                      Log Sleep
                    </button>
                    <button
                      onClick={openGoalModal}
                      className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white/10 backdrop-blur-xl text-white border border-white/20 rounded-xl text-sm sm:text-base font-medium hover:bg-white/20 transition-all"
                    >
                      <Target className="w-4 h-4 sm:w-5 sm:h-5" />
                      Set Goals
                    </button>
                  </motion.div>

                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-4 sm:mt-5 flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-white/80"
                  >
                    <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur-md">
                      Target: {sleepGoal.targetHours}h nightly
                    </span>
                    <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur-md">
                      Window: {sleepGoal.bedtime} - {sleepGoal.wakeup}
                    </span>
                    {latestEntry && (
                      <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 backdrop-blur-md">
                        Latest log: {format(parseSleepDate(latestEntry.date), 'MMM d')} ({latestEntry.hours}h)
                      </span>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Premium Stats Grid with Micro-interactions */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05, y: -8 }}
              className={`rounded-xl sm:rounded-2xl p-5 sm:p-7 relative overflow-hidden ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-neutral-900/90 to-black/90 border border-blue-500/20'
                  : 'bg-white/90 border border-blue-200'
              } backdrop-blur-xl shadow-2xl`}
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-600"
              />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Timer className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                  </motion.div>
                </div>
                <p className={`text-xs font-medium mb-1 ${theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'}`}>
                  Avg Sleep
                </p>
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {avgSleep}
                  </span>
                  <span className={`text-sm ${theme === 'dark' ? 'text-neutral-500' : 'text-gray-500'}`}>hours</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.05, y: -8 }}
              className={`rounded-2xl p-5 sm:p-7 relative overflow-hidden ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-neutral-900/90 to-black/90 border border-purple-500/20'
                  : 'bg-white/90 border border-purple-200'
              } backdrop-blur-xl shadow-2xl`}
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600"
              />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Star className={`w-6 h-6 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                  </motion.div>
                </div>
                <p className={`text-xs font-medium mb-1 ${theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'}`}>
                  Sleep Score
                </p>
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {sleepScore}
                  </span>
                  <span className={`text-sm ${theme === 'dark' ? 'text-neutral-500' : 'text-gray-500'}`}>/ 100</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05, y: -8 }}
              className={`rounded-2xl p-5 sm:p-7 relative overflow-hidden ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-neutral-900/90 to-black/90 border border-emerald-500/20'
                  : 'bg-white/90 border border-emerald-200'
              } backdrop-blur-xl shadow-2xl`}
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-green-600"
              />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <TrendingUp className={`w-6 h-6 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  </motion.div>
                </div>
                <p className={`text-xs font-medium mb-1 ${theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'}`}>
                  Quality Days
                </p>
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {goodSleepDays}
                  </span>
                  <span className={`text-sm ${theme === 'dark' ? 'text-neutral-500' : 'text-gray-500'}`}>/ {mockSleepData.length}</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05, y: -8 }}
              className={`rounded-2xl p-5 sm:p-7 relative overflow-hidden ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-neutral-900/90 to-black/90 border border-orange-500/20'
                  : 'bg-white/90 border border-orange-200'
              } backdrop-blur-xl shadow-2xl`}
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{ duration: 4, repeat: Infinity, delay: 1.5 }}
                className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600"
              />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <motion.div
                    animate={{ 
                      scale: [1, 1.3, 1],
                      opacity: [1, 0.5, 1]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Zap className={`w-6 h-6 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`} />
                  </motion.div>
                </div>
                <p className={`text-xs font-medium mb-1 ${theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'}`}>
                  Best Sleep
                </p>
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {bestSleep}
                  </span>
                  <span className={`text-sm ${theme === 'dark' ? 'text-neutral-500' : 'text-gray-500'}`}>hours</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05, y: -8 }}
              className={`rounded-2xl p-5 sm:p-7 relative overflow-hidden ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-neutral-900/90 to-black/90 border border-yellow-500/20'
                  : 'bg-white/90 border border-yellow-200'
              } backdrop-blur-xl shadow-2xl`}
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{ duration: 4, repeat: Infinity, delay: 2 }}
                className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-amber-600"
              />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center shadow-lg">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <motion.div
                    animate={{ 
                      rotate: [0, 15, -15, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Award className={`w-6 h-6 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`} />
                  </motion.div>
                </div>
                <p className={`text-xs font-medium mb-1 ${theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'}`}>
                  Consistency
                </p>
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {Math.round((consistency / mockSleepData.length) * 100)}
                  </span>
                  <span className={`text-sm ${theme === 'dark' ? 'text-neutral-500' : 'text-gray-500'}`}>%</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* View Mode Tabs */}
          <div className="flex gap-4 flex-wrap">
            {viewModes.map((mode) => {
              const Icon = mode.icon;
              return (
                <motion.button
                  key={mode.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    playClickSound();
                    setViewMode(mode.id);
                  }}
                  className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium transition-all ${
                    viewMode === mode.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                      : theme === 'dark'
                        ? 'bg-neutral-900/50 text-white hover:bg-neutral-800 border border-neutral-800'
                        : 'bg-white/50 text-black hover:bg-white border border-gray-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {mode.label}
                </motion.button>
              );
            })}
          </div>

          {/* Content Views */}
          <AnimatePresence mode="wait">
            {viewMode === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 xl:grid-cols-3 gap-6 xl:gap-8"
              >
                {/* Sleep Trend Chart */}
                <div className="xl:col-span-2">
                  <motion.div
                    className={`rounded-2xl p-5 sm:p-7 ${
                      theme === 'dark'
                        ? 'bg-gradient-to-br from-neutral-900/90 to-black/90 border border-neutral-800'
                        : 'bg-white/90 border border-gray-200'
                    } backdrop-blur-xl shadow-2xl`}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Sleep Duration Trend
                      </h2>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className={`text-xs font-medium ${theme === 'dark' ? 'text-neutral-300' : 'text-gray-700'}`}>
                          Live Tracking
                        </span>
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#333' : '#e5e7eb'} />
                        <XAxis dataKey="date" stroke={theme === 'dark' ? '#999' : '#6b7280'} />
                        <YAxis stroke={theme === 'dark' ? '#999' : '#6b7280'} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: theme === 'dark' ? '#171717' : '#ffffff',
                            border: `1px solid ${theme === 'dark' ? '#404040' : '#e5e7eb'}`,
                            borderRadius: '12px',
                            color: theme === 'dark' ? '#fff' : '#000'
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="hours"
                          stroke="#3b82f6"
                          strokeWidth={3}
                          fill="url(#sleepGradient)"
                          dot={{ fill: '#3b82f6', r: 5 }}
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="target"
                          stroke="#10b981"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </motion.div>
                </div>

                {/* Weekly Performance */}
                <motion.div
                  className={`rounded-2xl p-5 sm:p-7 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-br from-neutral-900/90 to-black/90 border border-neutral-800'
                      : 'bg-white/90 border border-gray-200'
                  } backdrop-blur-xl shadow-2xl`}
                >
                  <h3 className={`text-lg font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    This Week
                  </h3>
                  <div className="space-y-3">
                    {weekData.map((day, index) => {
                      const QualityIcon = getQualityIcon(day.quality);
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`flex items-center gap-3 p-3 rounded-xl ${
                            theme === 'dark'
                              ? 'bg-neutral-800/50 hover:bg-neutral-800'
                              : 'bg-gray-50 hover:bg-gray-100'
                          } transition-all cursor-pointer`}
                        >
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getQualityColor(day.quality)} flex items-center justify-center`}>
                            <QualityIcon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              {day.day}
                            </p>
                            <p className={`text-xs ${theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'}`}>
                              {day.hours}h sleep
                            </p>
                          </div>
                          <div className={`h-12 w-1 rounded-full bg-gradient-to-b ${getQualityColor(day.quality)}`} />
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {viewMode === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-8"
              >
                {/* Radar Chart */}
                <motion.div
                  className={`rounded-2xl p-5 sm:p-7 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-br from-neutral-900/90 to-black/90 border border-neutral-800'
                      : 'bg-white/90 border border-gray-200'
                  } backdrop-blur-xl shadow-2xl`}
                >
                  <h3 className={`text-lg font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Sleep Health Metrics
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke={theme === 'dark' ? '#404040' : '#e5e7eb'} />
                      <PolarAngleAxis dataKey="metric" stroke={theme === 'dark' ? '#999' : '#6b7280'} />
                      <PolarRadiusAxis stroke={theme === 'dark' ? '#999' : '#6b7280'} />
                      <Radar
                        name="Your Score"
                        dataKey="value"
                        stroke="#8b5cf6"
                        fill="#8b5cf6"
                        fillOpacity={0.6}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Quality Distribution */}
                <motion.div
                  className={`rounded-2xl p-5 sm:p-7 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-br from-neutral-900/90 to-black/90 border border-neutral-800'
                      : 'bg-white/90 border border-gray-200'
                  } backdrop-blur-xl shadow-2xl`}
                >
                  <h3 className={`text-lg font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Quality Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#333' : '#e5e7eb'} />
                      <XAxis dataKey="date" stroke={theme === 'dark' ? '#999' : '#6b7280'} />
                      <YAxis stroke={theme === 'dark' ? '#999' : '#6b7280'} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: theme === 'dark' ? '#171717' : '#ffffff',
                          border: `1px solid ${theme === 'dark' ? '#404040' : '#e5e7eb'}`,
                          borderRadius: '12px',
                          color: theme === 'dark' ? '#fff' : '#000'
                        }}
                      />
                      <Bar dataKey="quality" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
              </motion.div>
            )}

            {viewMode === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {sleepEntries.slice().reverse().map((sleep, index) => {
                  const QualityIcon = getQualityIcon(sleep.quality);
                  return (
                    <motion.div
                      key={sleep.date}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.01, x: 4 }}
                      onClick={() => setSelectedEntry(sleep)}
                      className={`rounded-2xl p-6 cursor-pointer ${
                        theme === 'dark'
                          ? 'bg-gradient-to-br from-neutral-900/90 to-black/90 border border-neutral-800 hover:border-blue-500/50'
                          : 'bg-white/90 border border-gray-200 hover:border-blue-400'
                      } backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          {/* Date Badge */}
                          <div className={`text-center px-4 py-3 rounded-xl ${
                            theme === 'dark'
                              ? 'bg-neutral-800'
                              : 'bg-gray-100'
                          }`}>
                            <Calendar className={`w-6 h-6 mx-auto mb-1 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                            <p className={`text-xs font-medium ${theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'}`}>
                              {format(parseSleepDate(sleep.date), 'MMM d')}
                            </p>
                          </div>

                          <div className={`h-16 w-px ${theme === 'dark' ? 'bg-neutral-800' : 'bg-gray-200'}`} />

                          {/* Sleep Info */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getQualityColor(sleep.quality)} flex items-center justify-center`}>
                                <Clock className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                  {sleep.hours}h
                                </p>
                                <p className={`text-xs ${theme === 'dark' ? 'text-neutral-500' : 'text-gray-500'}`}>
                                  Total Sleep
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1.5">
                                <Sunset className={`w-4 h-4 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`} />
                                <span className={theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'}>
                                  {sleep.bedtime}
                                </span>
                              </div>
                              <ChevronRight className={`w-4 h-4 ${theme === 'dark' ? 'text-neutral-600' : 'text-gray-400'}`} />
                              <div className="flex items-center gap-1.5">
                                <Sunrise className={`w-4 h-4 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`} />
                                <span className={theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'}>
                                  {sleep.wakeup}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Quality Badge */}
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="flex items-center gap-2 justify-end mb-1">
                              <QualityIcon className={`w-5 h-5 ${
                                sleep.quality === 'excellent' ? 'text-emerald-400' :
                                sleep.quality === 'good' ? 'text-blue-400' : 'text-orange-400'
                              }`} />
                              <p className={`font-bold capitalize ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                {sleep.quality}
                              </p>
                            </div>
                            <p className={`text-xs ${theme === 'dark' ? 'text-neutral-500' : 'text-gray-500'}`}>
                              Sleep Quality
                            </p>
                          </div>
                          <div className={`w-2 h-20 rounded-full bg-gradient-to-b ${getQualityColor(sleep.quality)}`} />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isLogSleepOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50"
                onClick={() => setIsLogSleepOpen(false)}
              >
                <motion.div
                  initial={{ scale: 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.92, opacity: 0 }}
                  onClick={(event) => event.stopPropagation()}
                  className={`w-full max-w-2xl rounded-3xl border p-6 sm:p-8 shadow-2xl ${
                    theme === 'dark'
                      ? 'bg-neutral-950/95 border-neutral-800'
                      : 'bg-white/95 border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>Sleep Log</p>
                      <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Add a sleep session
                      </h2>
                      <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'}`}>
                        Save a sleep entry and the charts, stats, and history will update immediately.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsLogSleepOpen(false)}
                      className={`rounded-full p-2 transition-colors ${
                        theme === 'dark' ? 'bg-neutral-800 text-white hover:bg-neutral-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="space-y-2">
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-neutral-300' : 'text-gray-700'}`}>Date</span>
                      <input
                        type="date"
                        value={currentSleepEntry.date}
                        onChange={(event) => setCurrentSleepEntry((entry) => ({ ...entry, date: event.target.value }))}
                        className={`w-full rounded-2xl border px-4 py-3 outline-none transition-colors ${
                          theme === 'dark'
                            ? 'bg-neutral-900 border-neutral-700 text-white focus:border-blue-500'
                            : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                        }`}
                      />
                    </label>

                    <label className="space-y-2">
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-neutral-300' : 'text-gray-700'}`}>Hours Slept</span>
                      <input
                        type="number"
                        min="1"
                        max="14"
                        step="0.5"
                        value={currentSleepEntry.hours}
                        onChange={(event) => setCurrentSleepEntry((entry) => ({ ...entry, hours: Number(event.target.value) }))}
                        className={`w-full rounded-2xl border px-4 py-3 outline-none transition-colors ${
                          theme === 'dark'
                            ? 'bg-neutral-900 border-neutral-700 text-white focus:border-blue-500'
                            : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                        }`}
                      />
                    </label>

                    <label className="space-y-2">
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-neutral-300' : 'text-gray-700'}`}>Bedtime</span>
                      <input
                        type="time"
                        value={currentSleepEntry.bedtime}
                        onChange={(event) => setCurrentSleepEntry((entry) => ({ ...entry, bedtime: event.target.value }))}
                        className={`w-full rounded-2xl border px-4 py-3 outline-none transition-colors ${
                          theme === 'dark'
                            ? 'bg-neutral-900 border-neutral-700 text-white focus:border-blue-500'
                            : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                        }`}
                      />
                    </label>

                    <label className="space-y-2">
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-neutral-300' : 'text-gray-700'}`}>Wake Up</span>
                      <input
                        type="time"
                        value={currentSleepEntry.wakeup}
                        onChange={(event) => setCurrentSleepEntry((entry) => ({ ...entry, wakeup: event.target.value }))}
                        className={`w-full rounded-2xl border px-4 py-3 outline-none transition-colors ${
                          theme === 'dark'
                            ? 'bg-neutral-900 border-neutral-700 text-white focus:border-blue-500'
                            : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                        }`}
                      />
                    </label>
                  </div>

                  <div className="mt-5">
                    <p className={`text-sm font-medium ${theme === 'dark' ? 'text-neutral-300' : 'text-gray-700'}`}>Sleep Quality</p>
                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {(['excellent', 'good', 'poor'] as const).map((quality) => (
                        <button
                          key={quality}
                          onClick={() => setCurrentSleepEntry((entry) => ({ ...entry, quality }))}
                          className={`rounded-2xl border px-4 py-3 text-left capitalize transition-all ${
                            currentSleepEntry.quality === quality
                              ? 'border-blue-500 bg-blue-500/15 text-white shadow-lg shadow-blue-500/10'
                              : theme === 'dark'
                                ? 'border-neutral-700 bg-neutral-900 text-neutral-300 hover:border-neutral-500'
                                : 'border-gray-300 bg-gray-50 text-gray-700 hover:border-gray-400'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`h-3 w-3 rounded-full ${
                              quality === 'excellent' ? 'bg-emerald-400' : quality === 'good' ? 'bg-blue-400' : 'bg-orange-400'
                            }`} />
                            {quality}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={`mt-5 rounded-2xl border p-4 ${
                    theme === 'dark' ? 'border-neutral-800 bg-neutral-900/70' : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Planned sleep window</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'}`}>
                          {getSleepWindowHours(currentSleepEntry.bedtime, currentSleepEntry.wakeup)} hours between bedtime and wake-up.
                        </p>
                      </div>
                      <div className={`rounded-full px-3 py-1 text-sm ${theme === 'dark' ? 'bg-blue-500/15 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>
                        Goal {sleepGoal.targetHours}h
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                      onClick={() => setIsLogSleepOpen(false)}
                      className={`rounded-2xl px-5 py-3 font-medium transition-colors ${
                        theme === 'dark' ? 'bg-neutral-800 text-white hover:bg-neutral-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveSleepEntry}
                      className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-3 font-medium text-white shadow-lg shadow-blue-500/20 transition-transform hover:scale-[1.01]"
                    >
                      Save Sleep Log
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isGoalModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50"
                onClick={() => setIsGoalModalOpen(false)}
              >
                <motion.div
                  initial={{ scale: 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.92, opacity: 0 }}
                  onClick={(event) => event.stopPropagation()}
                  className={`w-full max-w-xl rounded-3xl border p-6 sm:p-8 shadow-2xl ${
                    theme === 'dark'
                      ? 'bg-neutral-950/95 border-neutral-800'
                      : 'bg-white/95 border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>Sleep Goals</p>
                      <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Set your target sleep routine
                      </h2>
                      <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'}`}>
                        Your target hours power the analytics target line and nightly recommendations.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsGoalModalOpen(false)}
                      className={`rounded-full p-2 transition-colors ${
                        theme === 'dark' ? 'bg-neutral-800 text-white hover:bg-neutral-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="space-y-2 sm:col-span-2">
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-neutral-300' : 'text-gray-700'}`}>Target Sleep Hours</span>
                      <input
                        type="number"
                        min="4"
                        max="12"
                        step="0.5"
                        value={goalDraft.targetHours}
                        onChange={(event) => setGoalDraft((goal) => ({ ...goal, targetHours: Number(event.target.value) }))}
                        className={`w-full rounded-2xl border px-4 py-3 outline-none transition-colors ${
                          theme === 'dark'
                            ? 'bg-neutral-900 border-neutral-700 text-white focus:border-purple-500'
                            : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                        }`}
                      />
                    </label>

                    <label className="space-y-2">
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-neutral-300' : 'text-gray-700'}`}>Ideal Bedtime</span>
                      <input
                        type="time"
                        value={goalDraft.bedtime}
                        onChange={(event) => setGoalDraft((goal) => ({ ...goal, bedtime: event.target.value }))}
                        className={`w-full rounded-2xl border px-4 py-3 outline-none transition-colors ${
                          theme === 'dark'
                            ? 'bg-neutral-900 border-neutral-700 text-white focus:border-purple-500'
                            : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                        }`}
                      />
                    </label>

                    <label className="space-y-2">
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-neutral-300' : 'text-gray-700'}`}>Ideal Wake Time</span>
                      <input
                        type="time"
                        value={goalDraft.wakeup}
                        onChange={(event) => setGoalDraft((goal) => ({ ...goal, wakeup: event.target.value }))}
                        className={`w-full rounded-2xl border px-4 py-3 outline-none transition-colors ${
                          theme === 'dark'
                            ? 'bg-neutral-900 border-neutral-700 text-white focus:border-purple-500'
                            : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                        }`}
                      />
                    </label>
                  </div>

                  <div className={`mt-5 rounded-2xl border p-4 ${
                    theme === 'dark' ? 'border-neutral-800 bg-neutral-900/70' : 'border-gray-200 bg-gray-50'
                  }`}>
                    <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Goal preview
                    </p>
                    <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'}`}>
                      Planned sleep window: {getSleepWindowHours(goalDraft.bedtime, goalDraft.wakeup)} hours.
                    </p>
                    <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'}`}>
                      Recommended target: keep the planned window at or above your {goalDraft.targetHours}h goal.
                    </p>
                  </div>

                  <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                      onClick={() => setIsGoalModalOpen(false)}
                      className={`rounded-2xl px-5 py-3 font-medium transition-colors ${
                        theme === 'dark' ? 'bg-neutral-800 text-white hover:bg-neutral-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveSleepGoal}
                      className="rounded-2xl bg-white/10 px-5 py-3 font-medium text-white border border-white/20 backdrop-blur-xl transition-transform hover:scale-[1.01]"
                    >
                      Save Goals
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sleep Entry Modal */}
          <AnimatePresence>
            {selectedEntry && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50"
                onClick={() => setSelectedEntry(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className={`max-w-2xl w-full rounded-3xl overflow-hidden ${
                    theme === 'dark'
                      ? 'bg-neutral-900 border border-neutral-800'
                      : 'bg-white border border-gray-200'
                  } shadow-2xl`}
                >
                  <div className="relative h-48">
                    <Image
                      src="/3.7.jpg"
                      alt="Sleep"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-between p-6">
                      <div>
                        <p className="text-white/80 text-sm mb-1">Sleep Entry</p>
                        <h3 className="text-3xl font-bold text-white">
                          {format(parseSleepDate(selectedEntry.date), 'MMMM d, yyyy')}
                        </h3>
                      </div>
                      <button
                        onClick={() => setSelectedEntry(null)}
                        className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-neutral-800' : 'bg-gray-100'}`}>
                        <Clock className={`w-6 h-6 mb-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                        <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {selectedEntry.hours}h
                        </p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'}`}>
                          Duration
                        </p>
                      </div>
                      <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-neutral-800' : 'bg-gray-100'}`}>
                        <Sunset className={`w-6 h-6 mb-2 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`} />
                        <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {selectedEntry.bedtime}
                        </p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'}`}>
                          Bedtime
                        </p>
                      </div>
                      <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-neutral-800' : 'bg-gray-100'}`}>
                        <Sunrise className={`w-6 h-6 mb-2 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`} />
                        <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {selectedEntry.wakeup}
                        </p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'}`}>
                          Wake Time
                        </p>
                      </div>
                    </div>

                    <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-neutral-800' : 'bg-gray-100'}`}>
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getQualityColor(selectedEntry.quality)} flex items-center justify-center`}>
                          <Heart className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className={`font-bold capitalize ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {selectedEntry.quality} Sleep Quality
                          </p>
                          <p className={`text-xs ${theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'}`}>
                            Based on duration and consistency
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
