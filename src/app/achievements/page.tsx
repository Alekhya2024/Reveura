'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Trophy, Award, Star, Zap, Target, Crown, Medal, Gift,
  Flame, Gem, Shield, Sword, Heart, Brain, Moon, Sun,
  Sparkles, Lock, Unlock, ChevronRight, TrendingUp,
  Calendar, BookOpen, Dumbbell, Coffee, Music, Palette,
  Mountain, Rocket, Diamond, BadgeCheck, CircleDot,
  Hexagon, Pentagon, Octagon, Triangle, Square, Circle,
  X, Eye, Lightbulb, Wind, Leaf, Waves
} from 'lucide-react';
import confetti from 'canvas-confetti';
import toast, { Toaster } from 'react-hot-toast';

// Achievement Tiers
type AchievementTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  unlocked: boolean;
  claimed: boolean;
  progress: number;
  total: number;
  reward: number;
  tier: AchievementTier;
  category: string;
  rarity: number;
}

interface Badge {
  id: string;
  name: string;
  icon: any;
  color: string;
  unlocked: boolean;
  description: string;
}

const TIER_COLORS: Record<AchievementTier, { primary: string; secondary: string; glow: string; border: string }> = {
  bronze: { primary: 'from-amber-700 to-amber-900', secondary: 'text-amber-400', glow: 'shadow-amber-500/30', border: 'border-amber-500/50' },
  silver: { primary: 'from-slate-300 to-slate-500', secondary: 'text-slate-300', glow: 'shadow-slate-400/30', border: 'border-slate-400/50' },
  gold: { primary: 'from-yellow-400 to-amber-500', secondary: 'text-yellow-400', glow: 'shadow-yellow-500/50', border: 'border-yellow-500/50' },
  platinum: { primary: 'from-cyan-300 to-blue-400', secondary: 'text-cyan-300', glow: 'shadow-cyan-400/50', border: 'border-cyan-400/50' },
  diamond: { primary: 'from-purple-400 via-pink-400 to-cyan-400', secondary: 'text-purple-300', glow: 'shadow-purple-500/50', border: 'border-purple-500/50' },
};

const CATEGORIES = ['All', 'Wellness', 'Mindfulness', 'Habits', 'Sleep', 'Social', 'Mastery'];

export default function AchievementsPage() {
  const { playClickSound, playWaterDropSound } = require('@/hooks/useSoundEffects').useSoundEffects();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [showBadges, setShowBadges] = useState(false);
  
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first-steps',
      title: 'First Steps',
      description: 'Begin your wellness journey by completing your first activity',
      icon: Rocket,
      unlocked: true,
      claimed: true,
      progress: 1,
      total: 1,
      reward: 50,
      tier: 'bronze',
      category: 'Wellness',
      rarity: 1,
    },
    {
      id: 'week-warrior',
      title: 'Week Warrior',
      description: 'Track your mood for 7 consecutive days',
      icon: Flame,
      unlocked: true,
      claimed: false,
      progress: 7,
      total: 7,
      reward: 100,
      tier: 'silver',
      category: 'Wellness',
      rarity: 2,
    },
    {
      id: 'zen-master',
      title: 'Zen Master',
      description: 'Complete 25 breathing exercises',
      icon: Brain,
      unlocked: false,
      claimed: false,
      progress: 18,
      total: 25,
      reward: 200,
      tier: 'gold',
      category: 'Mindfulness',
      rarity: 3,
    },
    {
      id: 'habit-architect',
      title: 'Habit Architect',
      description: 'Create and maintain 5 habits for 30 days',
      icon: Target,
      unlocked: false,
      claimed: false,
      progress: 3,
      total: 5,
      reward: 300,
      tier: 'gold',
      category: 'Habits',
      rarity: 3,
    },
    {
      id: 'dream-catcher',
      title: 'Dream Catcher',
      description: 'Log 50 nights of quality sleep (7+ hours)',
      icon: Moon,
      unlocked: false,
      claimed: false,
      progress: 32,
      total: 50,
      reward: 400,
      tier: 'platinum',
      category: 'Sleep',
      rarity: 4,
    },
    {
      id: 'journal-sage',
      title: 'Journal Sage',
      description: 'Write 100 journal entries with deep reflection',
      icon: BookOpen,
      unlocked: false,
      claimed: false,
      progress: 67,
      total: 100,
      reward: 500,
      tier: 'platinum',
      category: 'Mindfulness',
      rarity: 4,
    },
    {
      id: 'wellness-legend',
      title: 'Wellness Legend',
      description: 'Achieve 100 day streak across all activities',
      icon: Crown,
      unlocked: false,
      claimed: false,
      progress: 45,
      total: 100,
      reward: 1000,
      tier: 'diamond',
      category: 'Mastery',
      rarity: 5,
    },
    {
      id: 'mind-olympian',
      title: 'Mind Olympian',
      description: 'Complete all mindfulness challenges',
      icon: Trophy,
      unlocked: false,
      claimed: false,
      progress: 8,
      total: 12,
      reward: 750,
      tier: 'diamond',
      category: 'Mastery',
      rarity: 5,
    },
    {
      id: 'early-bird',
      title: 'Early Bird',
      description: 'Wake up before 6 AM for 14 days',
      icon: Sun,
      unlocked: true,
      claimed: false,
      progress: 14,
      total: 14,
      reward: 150,
      tier: 'silver',
      category: 'Sleep',
      rarity: 2,
    },
    {
      id: 'consistency-king',
      title: 'Consistency King',
      description: 'Never miss a daily check-in for 30 days',
      icon: Shield,
      unlocked: false,
      claimed: false,
      progress: 22,
      total: 30,
      reward: 350,
      tier: 'gold',
      category: 'Habits',
      rarity: 3,
    },
    {
      id: 'mood-master',
      title: 'Mood Master',
      description: 'Track your mood 200 times',
      icon: Heart,
      unlocked: false,
      claimed: false,
      progress: 134,
      total: 200,
      reward: 450,
      tier: 'platinum',
      category: 'Wellness',
      rarity: 4,
    },
    {
      id: 'social-butterfly',
      title: 'Social Butterfly',
      description: 'Share your achievements with 10 friends',
      icon: Sparkles,
      unlocked: false,
      claimed: false,
      progress: 3,
      total: 10,
      reward: 200,
      tier: 'silver',
      category: 'Social',
      rarity: 2,
    },
  ]);

  const [badges, setBadges] = useState<Badge[]>([
    { id: 'pioneer', name: 'Pioneer', icon: Rocket, color: 'from-orange-500 to-red-500', unlocked: true, description: 'First to explore' },
    { id: 'champion', name: 'Champion', icon: Trophy, color: 'from-yellow-400 to-amber-500', unlocked: true, description: 'Victory achieved' },
    { id: 'guardian', name: 'Guardian', icon: Shield, color: 'from-blue-500 to-cyan-500', unlocked: false, description: 'Protector of habits' },
    { id: 'sage', name: 'Sage', icon: Brain, color: 'from-purple-500 to-pink-500', unlocked: false, description: 'Wisdom unlocked' },
    { id: 'legend', name: 'Legend', icon: Crown, color: 'from-yellow-300 via-pink-400 to-purple-500', unlocked: false, description: 'Ultimate mastery' },
    { id: 'diamond', name: 'Diamond', icon: Diamond, color: 'from-cyan-300 to-blue-400', unlocked: false, description: 'Rare excellence' },
  ]);

  // Calculate stats
  const totalXP = achievements.filter(a => a.claimed).reduce((sum, a) => sum + a.reward, 0);
  const unclaimedXP = achievements.filter(a => a.unlocked && !a.claimed).reduce((sum, a) => sum + a.reward, 0);
  const level = Math.floor(totalXP / 500) + 1;
  const xpForNextLevel = level * 500;
  const xpProgress = ((totalXP % 500) / 500) * 100;
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalAchievements = achievements.length;

  const filteredAchievements = selectedCategory === 'All' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const handleClaimReward = (achievement: Achievement) => {
    if (!achievement.unlocked || achievement.claimed) return;

    // Epic confetti burst
    const colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#a855f7'];
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 },
      colors,
    });
    
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });
    }, 200);

    // Update achievement
    setAchievements(prev => prev.map(a => 
      a.id === achievement.id ? { ...a, claimed: true } : a
    ));

    toast.custom((t) => (
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 border border-purple-500/50 rounded-2xl p-6 shadow-2xl shadow-purple-500/30 max-w-sm"
      >
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${TIER_COLORS[achievement.tier].primary} flex items-center justify-center`}>
            <achievement.icon className="w-8 h-8 text-white" />
          </div>
          <div>
            <p className="text-purple-300 text-sm font-medium">Achievement Unlocked!</p>
            <p className="text-white font-bold" style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-heading-sm)" }}>{achievement.title}</p>
            <p className="text-yellow-400 font-bold">+{achievement.reward} XP</p>
          </div>
        </div>
      </motion.div>
    ), { duration: 4000 });
  };

  // 3D Card tilt effect
  const TiltCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useTransform(y, [-100, 100], [8, -8]);
    const rotateY = useTransform(x, [-100, 100], [-8, 8]);

    const handleMouse = (event: React.MouseEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      x.set(event.clientX - centerX);
      y.set(event.clientY - centerY);
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };

    return (
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        onMouseMove={handleMouse}
        onMouseLeave={handleMouseLeave}
        className={className}
      >
        {children}
      </motion.div>
    );
  };

  const getRarityStars = (rarity: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < rarity ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
      />
    ));
  };

  return (
    <DashboardLayout>
      <Toaster position="top-center" />
      
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {/* Floating orbs */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full blur-3xl opacity-20"
              style={{
                width: Math.random() * 300 + 100,
                height: Math.random() * 300 + 100,
                background: `radial-gradient(circle, ${
                  ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#a855f7'][i % 5]
                }, transparent)`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 100 - 50, 0],
                y: [0, Math.random() * 100 - 50, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 15 + Math.random() * 10,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
          
          {/* Grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>

        <div className="relative z-10 p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
          {/* Epic Header */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 sm:mb-12"
          >
            {/* Floating Trophy */}
            <motion.div
              animate={{ 
                y: [0, -15, 0],
                rotateY: [0, 360],
              }}
              transition={{ 
                y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
                rotateY: { duration: 8, repeat: Infinity, ease: 'linear' },
              }}
              className="inline-block mb-4 sm:mb-6"
              style={{ perspective: 1000 }}
            >
              <div className="relative">
                <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl shadow-yellow-500/50 transform rotate-3">
                  <Trophy className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 text-white drop-shadow-lg" />
                </div>
                {/* Sparkle effects */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{
                      top: `${20 + Math.sin(i * 60 * Math.PI / 180) * 50}%`,
                      left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 60}%`,
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  >
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-3 sm:mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <span className="bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 bg-clip-text text-transparent">
                Hall of Achievements
              </span>
            </motion.h1>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mx-auto px-4">
              Your legendary journey awaits. Unlock achievements, earn rewards, and become a wellness master.
            </p>
          </motion.div>

          {/* Stats Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8"
          >
            {/* Level Card */}
            <TiltCard className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-xl border border-purple-500/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl shadow-purple-500/20">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <Hexagon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </div>
                <div>
                  <p className="text-purple-300 text-xs sm:text-sm font-medium">Current Level</p>
                  <p className="text-white font-black text-2xl sm:text-3xl md:text-4xl" style={{ fontFamily: "var(--font-heading)" }}>{level}</p>
                </div>
              </div>
              <div className="mt-3 sm:mt-4">
                <div className="flex justify-between text-xs sm:text-sm mb-2">
                  <span className="text-purple-300">Progress</span>
                  <span className="text-white font-bold">{totalXP % 500} / 500</span>
                </div>
                <div className="h-2 sm:h-3 bg-purple-950 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${xpProgress}%` }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full relative overflow-hidden"
                  >
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>
                </div>
              </div>
            </TiltCard>

            {/* Total XP Card */}
            <TiltCard className="bg-gradient-to-br from-yellow-900/50 to-amber-900/50 backdrop-blur-xl border border-yellow-500/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl shadow-yellow-500/20">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-yellow-500/30">
                  <Gem className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </div>
                <div>
                  <p className="text-yellow-300 text-xs sm:text-sm font-medium">Total XP</p>
                  <p className="text-white font-black text-2xl sm:text-3xl md:text-4xl" style={{ fontFamily: "var(--font-heading)" }}>{totalXP.toLocaleString()}</p>
                </div>
              </div>
              {unclaimedXP > 0 && (
                <motion.div 
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="mt-4 px-4 py-2 bg-yellow-500/20 border border-yellow-500/50 rounded-xl"
                >
                  <p className="text-yellow-300 text-sm text-center font-bold">
                    +{unclaimedXP} XP unclaimed!
                  </p>
                </motion.div>
              )}
            </TiltCard>

            {/* Achievements Card */}
            <TiltCard className="bg-gradient-to-br from-cyan-900/50 to-blue-900/50 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-6 shadow-xl shadow-cyan-500/20">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-cyan-300 text-sm font-medium">Unlocked</p>
                  <p className="text-white font-black" style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-display-md)" }}>{unlockedCount}/{totalAchievements}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-1">
                {achievements.slice(0, 8).map((a, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-2 rounded-full ${a.unlocked ? 'bg-cyan-400' : 'bg-cyan-950'}`}
                  />
                ))}
              </div>
            </TiltCard>

            {/* Badges Card */}
            <TiltCard className="bg-gradient-to-br from-pink-900/50 to-rose-900/50 backdrop-blur-xl border border-pink-500/30 rounded-3xl p-6 shadow-xl shadow-pink-500/20 cursor-pointer">
              <div className="flex items-center gap-4" onClick={() => setShowBadges(true)}>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/30">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-pink-300 text-sm font-medium">Badges</p>
                  <p className="text-white font-black" style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-display-md)" }}>{badges.filter(b => b.unlocked).length}/{badges.length}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                {badges.slice(0, 5).map((badge, i) => {
                  const Icon = badge.icon;
                  return (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        badge.unlocked 
                          ? `bg-gradient-to-br ${badge.color}` 
                          : 'bg-gray-800'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${badge.unlocked ? 'text-white' : 'text-gray-600'}`} />
                    </div>
                  );
                })}
              </div>
            </TiltCard>
          </motion.div>

          {/* Category Tabs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 mb-6 sm:mb-8 scrollbar-hide"
          >
            {CATEGORIES.map((category) => (
              <motion.button
                key={category}
                onClick={() => {
                  playClickSound();
                  setSelectedCategory(category);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold transition-all whitespace-nowrap flex-shrink-0 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10 hover:text-white'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>

          {/* Achievements Grid */}
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredAchievements.map((achievement, index) => {
                const Icon = achievement.icon;
                const tierColors = TIER_COLORS[achievement.tier];
                const progress = (achievement.progress / achievement.total) * 100;

                return (
                  <motion.div
                    key={achievement.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -8 }}
                    onClick={() => setSelectedAchievement(achievement)}
                    className="cursor-pointer group"
                  >
                    <TiltCard className={`relative bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-xl border rounded-3xl overflow-hidden transition-all duration-300 ${
                      achievement.unlocked 
                        ? `${tierColors.border} ${tierColors.glow} shadow-xl`
                        : 'border-gray-800'
                    }`}>
                      {/* Glow overlay for unlocked */}
                      {achievement.unlocked && (
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-br ${tierColors.primary} opacity-10`}
                          animate={{ opacity: [0.05, 0.15, 0.05] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        />
                      )}

                      {/* Locked overlay */}
                      {!achievement.unlocked && (
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center">
                          <Lock className="w-10 h-10 text-gray-600" />
                        </div>
                      )}

                      <div className="relative z-5 p-6">
                        {/* Tier Badge & Rarity */}
                        <div className="flex items-center justify-between mb-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase bg-gradient-to-r ${tierColors.primary} text-white`}>
                            {achievement.tier}
                          </span>
                          <div className="flex gap-0.5">
                            {getRarityStars(achievement.rarity)}
                          </div>
                        </div>

                        {/* Icon */}
                        <motion.div
                          animate={achievement.unlocked ? { 
                            rotateY: [0, 10, -10, 0],
                          } : {}}
                          transition={{ duration: 4, repeat: Infinity }}
                          className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-4 ${
                            achievement.unlocked 
                              ? `bg-gradient-to-br ${tierColors.primary} shadow-lg ${tierColors.glow}`
                              : 'bg-gray-800'
                          }`}
                        >
                          <Icon className={`w-10 h-10 ${achievement.unlocked ? 'text-white' : 'text-gray-600'}`} />
                        </motion.div>

                        {/* Title & Description */}
                        <h3 className={`text-xl font-bold mb-2 ${achievement.unlocked ? 'text-white' : 'text-gray-500'}`}>
                          {achievement.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                          {achievement.description}
                        </p>

                        {/* Progress */}
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-400">Progress</span>
                            <span className={achievement.unlocked ? tierColors.secondary : 'text-gray-400'}>
                              {achievement.progress}/{achievement.total}
                            </span>
                          </div>
                          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                              className={`h-full rounded-full ${
                                achievement.unlocked 
                                  ? `bg-gradient-to-r ${tierColors.primary}`
                                  : 'bg-gray-700'
                              }`}
                            />
                          </div>
                        </div>

                        {/* Reward & Claim */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Gem className="w-5 h-5 text-yellow-400" />
                            <span className="text-yellow-400 font-bold">{achievement.reward} XP</span>
                          </div>
                          {achievement.unlocked && !achievement.claimed && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleClaimReward(achievement);
                              }}
                              className={`px-4 py-2 rounded-xl bg-gradient-to-r ${tierColors.primary} text-white font-bold text-sm shadow-lg ${tierColors.glow}`}
                            >
                              Claim
                            </motion.button>
                          )}
                          {achievement.claimed && (
                            <div className="flex items-center gap-1 text-green-400">
                              <BadgeCheck className="w-5 h-5" />
                              <span className="text-sm font-bold">Claimed</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </TiltCard>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Badge Modal */}
      <AnimatePresence>
        {showBadges && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-8"
            onClick={() => setShowBadges(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-900 to-slate-950 border border-purple-500/30 rounded-3xl p-8 max-w-2xl w-full shadow-2xl shadow-purple-500/20"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white">Your Badges</h2>
                <button onClick={() => setShowBadges(false)} className="text-gray-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-6">
                {badges.map((badge) => {
                  const Icon = badge.icon;
                  return (
                    <motion.div
                      key={badge.id}
                      whileHover={{ scale: 1.05 }}
                      className={`relative p-6 rounded-2xl text-center ${
                        badge.unlocked 
                          ? 'bg-gradient-to-br from-white/10 to-white/5 border border-white/20'
                          : 'bg-gray-900/50 border border-gray-800'
                      }`}
                    >
                      {!badge.unlocked && (
                        <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                          <Lock className="w-8 h-8 text-gray-600" />
                        </div>
                      )}
                      <motion.div
                        animate={badge.unlocked ? { rotateY: [0, 360] } : {}}
                        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                        className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 ${
                          badge.unlocked ? `bg-gradient-to-br ${badge.color} shadow-lg` : 'bg-gray-800'
                        }`}
                      >
                        <Icon className={`w-8 h-8 ${badge.unlocked ? 'text-white' : 'text-gray-600'}`} />
                      </motion.div>
                      <h3 className={`font-bold mb-1 ${badge.unlocked ? 'text-white' : 'text-gray-600'}`}>
                        {badge.name}
                      </h3>
                      <p className={`text-sm ${badge.unlocked ? 'text-gray-300' : 'text-gray-600'}`}>{badge.description}</p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement Detail Modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-8"
            onClick={() => setSelectedAchievement(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotateY: -30 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotateY: 30 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative bg-gradient-to-br from-slate-900 to-slate-950 border rounded-3xl p-8 max-w-lg w-full shadow-2xl ${
                selectedAchievement.unlocked 
                  ? `${TIER_COLORS[selectedAchievement.tier].border} ${TIER_COLORS[selectedAchievement.tier].glow}`
                  : 'border-gray-800'
              }`}
              style={{ perspective: 1000 }}
            >
              {/* Close button */}
              <button 
                onClick={() => setSelectedAchievement(null)} 
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Icon */}
              <motion.div
                animate={{ rotateY: [0, 360] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                className={`w-24 h-24 mx-auto rounded-3xl flex items-center justify-center mb-6 ${
                  selectedAchievement.unlocked 
                    ? `bg-gradient-to-br ${TIER_COLORS[selectedAchievement.tier].primary} shadow-xl ${TIER_COLORS[selectedAchievement.tier].glow}`
                    : 'bg-gray-800'
                }`}
              >
                <selectedAchievement.icon className={`w-12 h-12 ${selectedAchievement.unlocked ? 'text-white' : 'text-gray-600'}`} />
              </motion.div>

              {/* Tier & Rarity */}
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className={`px-4 py-1 rounded-full text-sm font-bold uppercase bg-gradient-to-r ${TIER_COLORS[selectedAchievement.tier].primary} text-white`}>
                  {selectedAchievement.tier}
                </span>
                <div className="flex gap-1">
                  {getRarityStars(selectedAchievement.rarity)}
                </div>
              </div>

              {/* Title & Description */}
              <h2 className="text-3xl font-bold text-white text-center mb-2">
                {selectedAchievement.title}
              </h2>
              <p className="text-gray-400 text-center mb-6">
                {selectedAchievement.description}
              </p>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Progress</span>
                  <span className={TIER_COLORS[selectedAchievement.tier].secondary}>
                    {selectedAchievement.progress} / {selectedAchievement.total}
                  </span>
                </div>
                <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(selectedAchievement.progress / selectedAchievement.total) * 100}%` }}
                    className={`h-full rounded-full bg-gradient-to-r ${TIER_COLORS[selectedAchievement.tier].primary}`}
                  />
                </div>
              </div>

              {/* Reward */}
              <div className="flex items-center justify-center gap-3 mb-6 py-4 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl">
                <Gem className="w-8 h-8 text-yellow-400" />
                <span className="text-2xl font-bold text-yellow-400">{selectedAchievement.reward} XP</span>
              </div>

              {/* Action Button */}
              {selectedAchievement.unlocked && !selectedAchievement.claimed ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    handleClaimReward(selectedAchievement);
                    setSelectedAchievement(null);
                  }}
                  className={`w-full py-4 rounded-2xl bg-gradient-to-r ${TIER_COLORS[selectedAchievement.tier].primary} text-white font-bold text-lg shadow-xl ${TIER_COLORS[selectedAchievement.tier].glow}`}
                >
                  Claim Reward
                </motion.button>
              ) : selectedAchievement.claimed ? (
                <div className="w-full py-4 rounded-2xl bg-green-500/20 border border-green-500/50 text-green-400 font-bold text-lg text-center flex items-center justify-center gap-2">
                  <BadgeCheck className="w-6 h-6" />
                  Already Claimed
                </div>
              ) : (
                <div className="w-full py-4 rounded-2xl bg-gray-800 text-gray-500 font-bold text-lg text-center flex items-center justify-center gap-2">
                  <Lock className="w-6 h-6" />
                  Locked
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
