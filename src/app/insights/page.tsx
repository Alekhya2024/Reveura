'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import {
  TrendingUp,
  Sparkles,
  Activity,
  BarChart3,
  Brain,
  Zap,
  PieChart as PieChartIcon,
} from 'lucide-react';
import { moods } from '@/lib/mockData';
import { format } from 'date-fns';
import FloatingImages from '@/components/FloatingImages';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Image from 'next/image';
import {
  getStoredHabits,
  getStoredMoodEntries,
  getStoredSleepEntries,
  type StoredHabit,
  type StoredMoodEntry,
  type StoredSleepEntry,
} from '@/lib/userData';

export default function Insights() {
  const [moodEntries] = useState<StoredMoodEntry[]>(() => getStoredMoodEntries());
  const [sleepEntries] = useState<StoredSleepEntry[]>(() => getStoredSleepEntries());
  const [habits] = useState<StoredHabit[]>(() => getStoredHabits());

  const moodTrendData = moodEntries.map((entry) => {
    const moodIndex = moods.findIndex((mood) => mood.value === entry.mood);

    return {
      date: format(new Date(entry.date), 'MMM d'),
      score: moodIndex >= 0 ? 5 - moodIndex : 0,
      mood: entry.mood,
    };
  });

  const moodDistribution = moods
    .map((mood) => ({
      name: mood.label,
      value: moodEntries.filter((entry) => entry.mood === mood.value).length,
      color: mood.color,
    }))
    .filter((entry) => entry.value > 0);

  const sleepMoodData = moodEntries.map((moodEntry) => {
    const sleepEntry = sleepEntries.find((entry) => entry.date === moodEntry.date);
    const moodIndex = moods.findIndex((mood) => mood.value === moodEntry.mood);

    return {
      date: format(new Date(moodEntry.date), 'MMM d'),
      sleep: sleepEntry?.hours ?? 0,
      mood: moodIndex >= 0 ? 5 - moodIndex : 0,
    };
  });

  const habitCompletionData = habits.map((habit) => ({
    name: habit.name,
    completed: habit.completed.length,
    target: habit.target,
  }));

  const averageMoodScore = moodTrendData.length
    ? moodTrendData.reduce((sum, entry) => sum + entry.score, 0) / moodTrendData.length
    : 0;
  const averageSleepHours = sleepEntries.length
    ? sleepEntries.reduce((sum, entry) => sum + entry.hours, 0) / sleepEntries.length
    : 0;
  const averageHabitCompletion = habits.length
    ? habits.reduce((sum, habit) => sum + (habit.completed.length / Math.max(habit.target, 1)) * 100, 0) / habits.length
    : 0;

  const moodTrendLabel = averageMoodScore >= 4 ? 'Excellent' : averageMoodScore >= 3 ? 'Stable' : averageMoodScore > 0 ? 'Needs care' : 'No data';
  const wellnessLabel = averageSleepHours >= 7 && averageHabitCompletion >= 70 ? 'Strong' : averageSleepHours >= 6 ? 'Balanced' : averageSleepHours > 0 ? 'Growing' : 'No data';
  const activityLabel = averageHabitCompletion >= 80 ? 'High' : averageHabitCompletion >= 50 ? 'Moderate' : averageHabitCompletion > 0 ? 'Building' : 'No data';
  const overallScore = Math.round(((averageMoodScore / 5) * 40) + (Math.min(averageSleepHours, 9) / 9) * 30 + (Math.min(averageHabitCompletion, 100) / 100) * 30);

  return (
    <DashboardLayout>
      <FloatingImages images={['8.jpg', '9.jpg', '2.9.jpg']} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-8 lg:space-y-10 relative z-10"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative overflow-hidden rounded-3xl h-48 sm:h-52 mb-8"
        >
          <Image
            src="/7.jpg"
            alt="Data Insights"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 via-red-900/80 to-transparent" />
          <div className="absolute inset-0 flex items-center px-6 sm:px-10">
            <div className="space-y-2 sm:space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Insights
              </h1>
              <p className="text-purple-100 text-sm sm:text-base md:text-lg">Understand your emotional patterns and see how sleep, habits, and moods connect over time</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 sm:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-gradient-to-br from-neutral-900 to-black border border-red-900/30 rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-neutral-400 text-sm mb-1">Mood Trend</h3>
            <p className="text-white text-xl font-bold">{moodTrendLabel}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-gradient-to-br from-neutral-900 to-black border border-red-900/30 rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-yellow-400" />
              </div>
              <Sparkles className="w-8 h-8 text-yellow-400" />
            </div>
            <h3 className="text-neutral-400 text-sm mb-1">Mental Wellness</h3>
            <p className="text-white text-xl font-bold">{wellnessLabel}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-gradient-to-br from-neutral-900 to-black border border-red-900/30 rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-orange-400" />
              </div>
              <Zap className="w-8 h-8 text-orange-400" />
            </div>
            <h3 className="text-neutral-400 text-sm mb-1">Activity Level</h3>
            <p className="text-white text-xl font-bold">{activityLabel}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-gradient-to-br from-neutral-900 to-black border border-red-900/30 rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
                <PieChartIcon className="w-6 h-6 text-purple-400" />
              </div>
              <PieChartIcon className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-neutral-400 text-sm mb-1">Overall Score</h3>
            <p className="text-white text-xl font-bold">{(overallScore / 10).toFixed(1)}/10</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-neutral-900 to-black border border-red-900/30 rounded-2xl p-7 shadow-xl"
        >
          <h2 className="text-xl font-bold text-white mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Mood Trend Over Time
          </h2>
          {moodTrendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={moodTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#999" />
                <YAxis stroke="#999" domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#171717',
                    border: '1px solid #404040',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#dc2626"
                  strokeWidth={3}
                  dot={{ fill: '#dc2626', r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[300px] items-center justify-center rounded-2xl border border-neutral-800 text-neutral-400">
              Log moods on the dashboard to generate trend insights.
            </div>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-7">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-neutral-900 to-black border border-red-900/30 rounded-2xl p-7 shadow-xl"
          >
            <h2 className="text-xl font-bold text-white mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Mood Distribution
            </h2>
            {moodDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={moodDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {moodDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0a0a0a',
                      border: '2px solid #dc2626',
                      borderRadius: '12px',
                      color: '#fff',
                      padding: '12px',
                      boxShadow: '0 10px 40px rgba(220, 38, 38, 0.3)'
                    }}
                    itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[300px] items-center justify-center rounded-2xl border border-neutral-800 text-neutral-400">
                No mood distribution yet.
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-neutral-900 to-black border border-red-900/30 rounded-2xl p-7 shadow-xl"
          >
            <h2 className="text-xl font-bold text-white mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Habit Performance
            </h2>
            {habitCompletionData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={habitCompletionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#999" angle={-45} textAnchor="end" height={100} />
                  <YAxis stroke="#999" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0a0a0a',
                      border: '2px solid #dc2626',
                      borderRadius: '12px',
                      color: '#fff',
                      padding: '12px',
                      boxShadow: '0 10px 40px rgba(220, 38, 38, 0.3)'
                    }}
                    labelStyle={{ color: '#fff', fontWeight: 'bold', marginBottom: '4px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="completed" fill="#dc2626" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[300px] items-center justify-center rounded-2xl border border-neutral-800 text-neutral-400">
                No habits created yet.
              </div>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-neutral-900 to-black border border-red-900/30 rounded-2xl p-6 shadow-xl"
        >
          <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Sleep & Mood Correlation
          </h2>
          <p className="text-neutral-400 text-sm mb-6">
            See how your sleep patterns affect your mood
          </p>
          {sleepMoodData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sleepMoodData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#999" />
                <YAxis yAxisId="left" stroke="#999" />
                <YAxis yAxisId="right" orientation="right" stroke="#999" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0a0a0a',
                    border: '2px solid #dc2626',
                    borderRadius: '12px',
                    color: '#fff',
                    padding: '12px',
                    boxShadow: '0 10px 40px rgba(220, 38, 38, 0.3)'
                  }}
                  labelStyle={{ color: '#fff', fontWeight: 'bold', marginBottom: '4px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend wrapperStyle={{ color: '#fff' }} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="sleep"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Sleep Hours"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="mood"
                  stroke="#dc2626"
                  strokeWidth={2}
                  name="Mood Score"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[300px] items-center justify-center rounded-2xl border border-neutral-800 text-neutral-400">
              Add mood and sleep entries to see correlation insights.
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-br from-neutral-900 to-black border border-red-900/30 rounded-2xl p-6 shadow-xl"
        >
          <h2 className="text-xl font-bold text-white mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Key Insights
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Positive Trend</h3>
                  <p className="text-neutral-400 text-sm">
                    {moodTrendData.length > 1
                      ? `Your average mood score is ${averageMoodScore.toFixed(1)} out of 5 across ${moodTrendData.length} tracked days.`
                      : 'Track more moods to unlock a stronger trend summary.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Activity className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Sleep Correlation</h3>
                  <p className="text-neutral-400 text-sm">
                    {sleepEntries.length > 0
                      ? `You average ${averageSleepHours.toFixed(1)} hours of sleep, and ${sleepEntries.filter((entry) => entry.hours >= 7).length} nights met the healthy 7h mark.`
                      : 'Start logging sleep to understand how rest affects your mood.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Brain className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Habit Impact</h3>
                  <p className="text-neutral-400 text-sm">
                    {habits.length > 0
                      ? `Your habits are averaging ${Math.round(averageHabitCompletion)}% of their targets. Consistency is building momentum.`
                      : 'Create a few habits to start measuring consistency.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Recommended Focus</h3>
                  <p className="text-neutral-400 text-sm">
                    {averageSleepHours < 7 && averageSleepHours > 0
                      ? 'Try prioritizing bedtime consistency first, then use journaling to capture how sleep changes your mood.'
                      : 'Keep pairing healthy sleep with regular habit check-ins to strengthen your wellness trend.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
