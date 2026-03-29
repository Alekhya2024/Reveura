'use client';

import React from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import {
  TrendingUp,
  Sparkles,
  Activity,
  BarChart3,
  Brain,
  Zap,
  PieChart as PieChartIcon
} from 'lucide-react';
import { mockMoodData, mockSleepData, mockHabits, moods } from '@/lib/mockData';
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
  ResponsiveContainer
} from 'recharts';
import Image from 'next/image';

export default function Insights() {
  // Mood Trend Data
  const moodTrendData = mockMoodData.map(entry => {
    const moodScore = moods.findIndex(m => m.value === entry.mood);
    return {
      date: format(new Date(entry.date), 'MMM d'),
      score: 5 - moodScore,
      mood: entry.mood
    };
  });

  // Mood Distribution
  const moodDistribution = moods.map(mood => ({
    name: mood.label,
    value: mockMoodData.filter(m => m.mood === mood.value).length,
    color: mood.color
  })).filter(m => m.value > 0);

  // Sleep vs Mood Correlation
  const sleepMoodData = mockMoodData.map(moodEntry => {
    const sleepEntry = mockSleepData.find(s => s.date === moodEntry.date);
    const moodScore = 5 - moods.findIndex(m => m.value === moodEntry.mood);
    return {
      date: format(new Date(moodEntry.date), 'MMM d'),
      sleep: sleepEntry?.hours || 0,
      mood: moodScore
    };
  });

  // Habit Completion Data
  const habitCompletionData = mockHabits.map(habit => ({
    name: habit.name,
    completed: habit.completed.length,
    target: habit.target
  }));

  const COLORS = ['#10b981', '#22c55e', '#eab308', '#f97316', '#ef4444'];

  return (
    <DashboardLayout>
      <FloatingImages images={['8.jpg', '9.jpg', '2.9.jpg']} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6 relative z-10"
      >
        {/* Hero Banner with Image */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative overflow-hidden rounded-3xl h-52 mb-6"
        >
          <Image
            src="/7.jpg"
            alt="Data Insights"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 via-red-900/80 to-transparent" />
          <div className="absolute inset-0 flex items-center px-10">
            <div>
              <h1 className="text-5xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Insights
              </h1>
              <p className="text-purple-100 text-lg">Understand your emotional patterns and see how sleep, habits, and moods connect over time</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <p className="text-white text-xl font-bold">Improving</p>
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
            <p className="text-white text-xl font-bold">Strong</p>
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
            <p className="text-white text-xl font-bold">High</p>
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
            <p className="text-white text-xl font-bold">8.5/10</p>
          </motion.div>
        </div>

        {/* Mood Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-neutral-900 to-black border border-red-900/30 rounded-2xl p-6 shadow-xl"
        >
          <h2 className="text-xl font-bold text-white mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Mood Trend Over Time
          </h2>
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
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Mood Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-neutral-900 to-black border border-red-900/30 rounded-2xl p-6 shadow-xl"
          >
            <h2 className="text-xl font-bold text-white mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Mood Distribution
            </h2>
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
          </motion.div>

          {/* Habit Completion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-neutral-900 to-black border border-red-900/30 rounded-2xl p-6 shadow-xl"
          >
            <h2 className="text-xl font-bold text-white mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Habit Performance
            </h2>
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
          </motion.div>
        </div>

        {/* Sleep vs Mood Correlation */}
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
        </motion.div>

        {/* Key Insights */}
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
                    Your mood has improved by 23% over the past week. Keep up the great work!
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
                    Getting 7.5+ hours of sleep strongly correlates with better mood scores.
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
                    Meditation and exercise habits show the strongest positive impact on your mood.
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
                  <h3 className="text-white font-semibold mb-1">Consistency Wins</h3>
                  <p className="text-neutral-400 text-sm">
                    Your 7-day meditation streak is contributing to sustained positive mood.
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
