'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Sparkles, TrendingUp, 
  Calendar, Heart, Smile, Meh, Sun, Cloud, 
  Zap, Wind, Droplet, Star, Lock, Unlock, Save,
  Plus, Edit3, Eye, BarChart3, Activity, Brain, 
  CloudRain, Headphones, Trash2, Edit, X
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useSoundEffects } from '@/hooks/useSoundEffects';

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
  date: string;
  mood: string;
  weather: string;
  title: string;
  content: string;
  tags: string[];
  isPrivate: boolean;
  sentiment: number;
  energy: number;
  isFavorite: boolean;
}

const STORAGE_KEY = 'reveura_journal_entries';

export default function JournalPage() {
  const { playClickSound, playWaterDropSound } = useSoundEffects();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [currentEntry, setCurrentEntry] = useState<Partial<JournalEntry>>({
    mood: 'neutral',
    weather: 'sunny',
    title: '',
    content: '',
    tags: [],
    isPrivate: false,
    isFavorite: false,
  });
  const [viewMode, setViewMode] = useState<'grid' | 'timeline' | 'calendar'>('grid');
  const [filterMood, setFilterMood] = useState<string | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewingEntry, setViewingEntry] = useState<JournalEntry | null>(null);
  const [currentTag, setCurrentTag] = useState('');

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setEntries(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading entries:', error);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (entries.length >= 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }
  }, [entries]);

  const startNewEntry = () => {
    setIsWriting(true);
    setEditingEntry(null);
    setCurrentEntry({
      mood: 'neutral',
      weather: 'sunny',
      title: '',
      content: '',
      tags: [],
      isPrivate: false,
      isFavorite: false,
    });
  };

  const calculateSentiment = (content: string): number => {
    const positive = ['happy', 'great', 'amazing', 'wonderful', 'love', 'joy', 'blessed', 'grateful'];
    const negative = ['sad', 'angry', 'worried', 'anxious', 'stressed', 'depressed'];
    const lower = content.toLowerCase();
    const pos = positive.filter(w => lower.includes(w)).length;
    const neg = negative.filter(w => lower.includes(w)).length;
    return pos + neg === 0 ? 0 : (pos - neg) / (pos + neg);
  };

  const calculateEnergy = (mood: string): number => {
    const map: { [key: string]: number } = {
      amazing: 95, happy: 85, calm: 70, neutral: 60, anxious: 35, sad: 40
    };
    return map[mood] || 60;
  };

  const saveEntry = () => {
    if (!currentEntry.title || !currentEntry.content) return;
    
    playWaterDropSound();
    if (editingEntry) {
      setEntries(entries.map(e => 
        e.id === editingEntry.id 
          ? {
              ...editingEntry,
              ...currentEntry,
              date: editingEntry.date,
              sentiment: calculateSentiment(currentEntry.content || ''),
              energy: calculateEnergy(currentEntry.mood || 'neutral'),
            } as JournalEntry
          : e
      ));
    } else {
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        mood: currentEntry.mood || 'neutral',
        weather: currentEntry.weather || 'sunny',
        title: currentEntry.title,
        content: currentEntry.content,
        tags: currentEntry.tags || [],
        isPrivate: currentEntry.isPrivate || false,
        sentiment: calculateSentiment(currentEntry.content),
        energy: calculateEnergy(currentEntry.mood || 'neutral'),
        isFavorite: currentEntry.isFavorite || false,
      };
      setEntries([newEntry, ...entries]);
    }
    
    setIsWriting(false);
    setCurrentEntry({});
    setEditingEntry(null);
  };

  const deleteEntry = (id: string) => {
    if (confirm('Delete this entry?')) {
      setEntries(entries.filter(e => e.id !== id));
      setViewingEntry(null);
    }
  };

  const toggleFavorite = (id: string) => {
    setEntries(entries.map(e => 
      e.id === id ? { ...e, isFavorite: !e.isFavorite } : e
    ));
  };

  const editEntry = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setCurrentEntry({
      mood: entry.mood,
      weather: entry.weather,
      title: entry.title,
      content: entry.content,
      tags: entry.tags,
      isPrivate: entry.isPrivate,
      isFavorite: entry.isFavorite,
    });
    setIsWriting(true);
  };

  const addTag = () => {
    if (currentTag.trim() && !currentEntry.tags?.includes(currentTag.trim())) {
      setCurrentEntry({
        ...currentEntry,
        tags: [...(currentEntry.tags || []), currentTag.trim()],
      });
      setCurrentTag('');
    }
  };

  const removeTag = (tag: string) => {
    setCurrentEntry({
      ...currentEntry,
      tags: currentEntry.tags?.filter(t => t !== tag) || [],
    });
  };

  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const filteredEntries = entries.filter(e => !filterMood || e.mood === filterMood);

  const getEntriesForDate = (day: number) => {
    return entries.filter(e => {
      const d = new Date(e.date);
      return d.getDate() === day && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
  };

  const changeMonth = (delta: number) => {
    setSelectedDate(new Date(currentYear, currentMonth + delta, 1));
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full"
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
          <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent mb-2">
                  My Journey
                </h1>
                <p className="text-gray-400 text-xs sm:text-sm">
                  {entries.length} entries · {entries.filter(e => e.isFavorite).length} favorites
                </p>
              </div>

              <div className="flex gap-2 sm:gap-4 w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    playClickSound();
                    setShowAnalytics(!showAnalytics);
                  }}
                  className={`flex-1 sm:flex-none px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm font-semibold ${
                    showAnalytics ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-cyan-500/50' : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                  }`}
                >
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Analytics</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    playClickSound();
                    startNewEntry();
                  }}
                  className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white rounded-xl flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm font-semibold"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  New Entry
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>
              </div>
            </div>

            <div className="flex gap-2 sm:gap-3 mb-6 overflow-x-auto pb-2">
              {[
                { mode: 'grid', label: 'Grid', icon: BarChart3 },
                { mode: 'timeline', label: 'Timeline', icon: Activity },
                { mode: 'calendar', label: 'Calendar', icon: Calendar },
              ].map(({ mode, label, icon: Icon }) => (
                <motion.button
                  key={mode}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    playClickSound();
                    setViewMode(mode as any);
                  }}
                  className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl flex items-center gap-2 cursor-pointer text-xs sm:text-sm whitespace-nowrap ${
                    viewMode === mode
                      ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-xl'
                      : 'bg-gray-800/50 text-white'
                  }`}
                >
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                  {label}
                </motion.button>
              ))}
            </div>

            <div className="mb-6">
              <h2 className="text-xs font-semibold text-gray-500 mb-3 flex items-center gap-2">
                <Heart className="w-3.5 h-3.5" />
                FILTER BY MOOD
              </h2>
              <div className="flex gap-2 overflow-x-auto pb-2">
                <motion.button
                  onClick={() => {
                    playClickSound();
                    setFilterMood(null);
                  }}
                  whileHover={{ scale: 1.05 }}
                  className={`px-5 py-2 rounded-full font-semibold cursor-pointer text-sm ${
                    !filterMood ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white' : 'bg-gray-700/70 text-white'
                  }`}
                >
                  All Moods
                </motion.button>

                {MOODS.map((mood) => {
                  const MoodIcon = mood.icon;
                  return (
                    <motion.button
                      key={mood.id}
                      onClick={() => {
                        playClickSound();
                        setFilterMood(mood.id);
                      }}
                      whileHover={{ scale: 1.05 }}
                      className={`px-4 py-2 rounded-full flex items-center gap-2 font-medium cursor-pointer text-sm ${
                        filterMood === mood.id ? `bg-gradient-to-r ${mood.gradient} text-white shadow-xl` : 'bg-gray-700/70 text-white'
                      }`}
                    >
                      <MoodIcon className="w-5 h-5" />
                      {mood.label}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Analytics */}
          <AnimatePresence>
            {showAnalytics && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8"
              >
                <div className="grid grid-cols-4 gap-6">
                  <div className="col-span-2 bg-purple-500/10 backdrop-blur-xl rounded-3xl p-6 border border-purple-200/20">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
                      <Brain className="w-5 h-5 text-purple-400" />
                      Mood Distribution
                    </h3>
                    <div className="space-y-3">
                      {MOODS.map((mood) => {
                        const count = entries.filter(e => e.mood === mood.id).length;
                        const percentage = entries.length > 0 ? (count / entries.length) * 100 : 0;
                        return (
                          <div key={mood.id}>
                            <div className="flex justify-between text-sm text-white">
                              <span>{mood.label}</span>
                              <span className="font-bold">{count}</span>
                            </div>
                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                className={`h-full bg-gradient-to-r ${mood.gradient}`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-blue-500/10 backdrop-blur-xl rounded-3xl p-6 border border-blue-200/20">
                    <h3 className="text-lg font-bold mb-4 text-white">Sentiment</h3>
                    <div className="flex items-center justify-center h-32">
                      <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                        {entries.length > 0 ? Math.round((entries.reduce((a, e) => a + e.sentiment, 0) / entries.length) * 100) : 0}
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-500/10 backdrop-blur-xl rounded-3xl p-6 border border-orange-200/20">
                    <h3 className="text-lg font-bold mb-4 text-white">Energy</h3>
                    <div className="flex items-center justify-center h-32">
                      <div className="text-6xl font-bold bg-gradient-to-r from-orange-600 to-yellow-500 bg-clip-text text-transparent">
                        {entries.length > 0 ? Math.round(entries.reduce((a, e) => a + e.energy, 0) / entries.length) : 0}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Write/Edit Modal */}
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
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                  className="bg-gray-900 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                >
                  <div className={`bg-gradient-to-r ${MOODS.find(m => m.id === currentEntry.mood)?.gradient || 'from-purple-600 to-pink-500'} p-6`}>
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-8 h-8" />
                        <h2 className="text-2xl font-bold">{editingEntry ? 'Edit Entry' : 'New Entry'}</h2>
                      </div>
                      <button onClick={() => {
                        playClickSound();
                        setIsWriting(false);
                      }} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center cursor-pointer">
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  </div>

                  <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
                    <div className="mb-6">
                      <label className="text-sm font-semibold mb-3 flex items-center gap-2 text-white">Mood</label>
                      <div className="grid grid-cols-6 gap-3">
                        {MOODS.map((mood) => {
                          const MoodIcon = mood.icon;
                          return (
                            <button
                              key={mood.id}
                              onClick={() => {
                                playClickSound();
                                setCurrentEntry({ ...currentEntry, mood: mood.id });
                              }}
                              className={`p-4 rounded-2xl cursor-pointer ${
                                currentEntry.mood === mood.id ? `bg-gradient-to-br ${mood.gradient} text-white` : 'bg-gray-800'
                              }`}
                            >
                              <MoodIcon className="w-8 h-8 mx-auto mb-2" />
                              <div className="text-xs">{mood.label}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="text-sm font-semibold mb-3 text-white">Weather</label>
                      <div className="flex gap-3">
                        {WEATHER_ICONS.map(({ id, icon: Icon }) => (
                          <button
                            key={id}
                            onClick={() => {
                              playClickSound();
                              setCurrentEntry({ ...currentEntry, weather: id });
                            }}
                            className={`p-4 rounded-xl cursor-pointer ${
                              currentEntry.weather === id ? 'bg-gradient-to-br from-blue-500 to-cyan-400' : 'bg-gray-800'
                            }`}
                          >
                            <Icon className="w-6 h-6" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="text-sm font-semibold mb-3 text-white">Title</label>
                      <input
                        type="text"
                        value={currentEntry.title || ''}
                        onChange={(e) => setCurrentEntry({ ...currentEntry, title: e.target.value })}
                        placeholder="Entry title..."
                        className="w-full px-6 py-4 bg-gray-800 rounded-2xl focus:ring-2 focus:ring-purple-500 text-white"
                      />
                    </div>

                    <div className="mb-6">
                      <label className="text-sm font-semibold mb-3 text-white">Content</label>
                      <textarea
                        value={currentEntry.content || ''}
                        onChange={(e) => setCurrentEntry({ ...currentEntry, content: e.target.value })}
                        placeholder="Your thoughts..."
                        rows={12}
                        className="w-full px-6 py-4 bg-gray-800 rounded-2xl focus:ring-2 focus:ring-purple-500 text-white resize-none"
                      />
                    </div>

                    <div className="mb-6">
                      <label className="text-sm font-semibold mb-3 text-white">Tags</label>
                      <div className="flex gap-2 mb-3 flex-wrap">
                        {currentEntry.tags?.map((tag, i) => (
                          <div key={i} className="px-3 py-1.5 bg-purple-900/30 text-purple-200 rounded-full text-sm flex items-center gap-2">
                            #{tag}
                            <button onClick={() => {
                              playClickSound();
                              removeTag(tag);
                            }}>
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={currentTag}
                          onChange={(e) => setCurrentTag(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addTag()}
                          placeholder="Add tag..."
                          className="flex-1 px-4 py-2 bg-gray-800 rounded-xl text-white"
                        />
                        <button onClick={() => {
                          playClickSound();
                          addTag();
                        }} className="px-4 py-2 bg-purple-600 text-white rounded-xl cursor-pointer">Add</button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-8 p-4 bg-gray-800 rounded-2xl">
                      <div className="flex items-center gap-3 text-white">
                        {currentEntry.isPrivate ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                        <span>{currentEntry.isPrivate ? 'Private' : 'Public'}</span>
                      </div>
                      <button
                        onClick={() => {
                          playClickSound();
                          setCurrentEntry({ ...currentEntry, isPrivate: !currentEntry.isPrivate });
                        }}
                        className={`w-16 h-8 rounded-full cursor-pointer relative ${currentEntry.isPrivate ? 'bg-purple-600' : 'bg-gray-600'}`}
                      >
                        <div
                          className="absolute top-1 w-6 h-6 bg-white rounded-full transition-transform"
                          style={{ transform: currentEntry.isPrivate ? 'translateX(32px)' : 'translateX(4px)' }}
                        />
                      </button>
                    </div>

                    <button
                      onClick={saveEntry}
                      disabled={!currentEntry.title || !currentEntry.content}
                      className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-2xl font-bold cursor-pointer disabled:opacity-50"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Save className="w-5 h-5" />
                        {editingEntry ? 'Update' : 'Save'} Entry
                      </span>
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* View Entry Modal */}
          <AnimatePresence>
            {viewingEntry && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-8"
                onClick={(e) => e.target === e.currentTarget && setViewingEntry(null)}
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                  className="bg-gray-900 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
                >
                  {(() => {
                    const mood = MOODS.find(m => m.id === viewingEntry.mood);
                    const MoodIcon = mood?.icon || Star;
                    return (
                      <>
                        <div className={`bg-gradient-to-r ${mood?.gradient} p-6`}>
                          <div className="flex items-center justify-between text-white">
                            <div className="flex items-center gap-3">
                              <MoodIcon className="w-8 h-8" />
                              <div>
                                <h2 className="text-2xl font-bold">{viewingEntry.title}</h2>
                                <p className="text-sm">{new Date(viewingEntry.date).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => { playClickSound(); toggleFavorite(viewingEntry.id); }} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center cursor-pointer">
                                <Heart className={`w-5 h-5 ${viewingEntry.isFavorite ? 'fill-white' : ''}`} />
                              </button>
                              <button onClick={() => { playClickSound(); setViewingEntry(null); }} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center cursor-pointer">
                                <X className="w-6 h-6" />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="p-8 overflow-y-auto max-h-[calc(90vh-300px)]">
                          <p className="text-gray-200 text-lg leading-relaxed mb-6 whitespace-pre-wrap">{viewingEntry.content}</p>

                          {viewingEntry.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                              {viewingEntry.tags.map((tag, i) => (
                                <span key={i} className="px-3 py-1.5 bg-purple-900/30 text-purple-200 rounded-full text-sm">#{tag}</span>
                              ))}
                            </div>
                          )}

                          <div className="flex gap-3">
                            <button
                              onClick={() => { playClickSound(); editEntry(viewingEntry); setViewingEntry(null); }}
                              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <Edit className="w-5 h-5" />
                              Edit
                            </button>
                            <button
                              onClick={() => { playClickSound(); deleteEntry(viewingEntry.id); }}
                              className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold flex items-center gap-2 cursor-pointer"
                            >
                              <Trash2 className="w-5 h-5" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </>
                    );
                  })()}
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
                      className="group cursor-pointer"
                      onClick={() => {
                        playClickSound();
                        setViewingEntry(entry);
                      }}
                    >
                      <div className={`bg-gradient-to-br ${mood?.gradient} p-1 rounded-3xl`}>
                        <div className="bg-gray-900 rounded-3xl p-5">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${mood?.gradient} flex items-center justify-center`}>
                                <MoodIcon className="w-5 h-5 text-white" />
                              </div>
                              <div className="text-xs text-gray-400">{new Date(entry.date).toLocaleDateString()}</div>
                            </div>
                            <div className="flex gap-2">
                              {entry.isPrivate && <Lock className="w-4 h-4 text-purple-400" />}
                              <button onClick={(e) => { e.stopPropagation(); playClickSound(); toggleFavorite(entry.id); }}>
                                <Heart className={`w-5 h-5 ${entry.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                              </button>
                            </div>
                          </div>

                          <h3 className="text-lg font-bold mb-2 line-clamp-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            {entry.title}
                          </h3>

                          <p className="text-gray-300 mb-3 line-clamp-3 text-sm">{entry.content}</p>

                          {entry.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {entry.tags.slice(0, 3).map((tag, i) => (
                                <span key={i} className="px-2.5 py-1 bg-purple-900/30 text-purple-200 rounded-full text-xs">#{tag}</span>
                              ))}
                            </div>
                          )}

                          <div className="flex gap-2 opacity-0 group-hover:opacity-100">
                            <button onClick={(e) => { e.stopPropagation(); playClickSound(); setViewingEntry(entry); }} className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg text-xs cursor-pointer">
                              <Eye className="w-3.5 h-3.5 inline" /> Read
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); playClickSound(); editEntry(entry); }} className="px-3 py-2 bg-blue-500 text-white rounded-lg cursor-pointer">
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); playClickSound(); deleteEntry(entry.id); }} className="px-3 py-2 bg-red-500 text-white rounded-lg cursor-pointer">
                              <Trash2 className="w-3.5 h-3.5" />
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
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-600 via-pink-500 to-orange-500" />
                {filteredEntries.map((entry, index) => {
                  const mood = MOODS.find(m => m.id === entry.mood);
                  const MoodIcon = mood?.icon || Star;
                  return (
                    <motion.div key={entry.id} initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="relative pl-20 pb-12 cursor-pointer" onClick={() => { playClickSound(); setViewingEntry(entry); }}>
                      <div className={`absolute left-5 top-6 w-10 h-10 rounded-full bg-gradient-to-r ${mood?.gradient} flex items-center justify-center z-10`}>
                        <MoodIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="bg-gray-900 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-gray-400">{new Date(entry.date).toLocaleDateString()}</div>
                          <button onClick={(e) => { e.stopPropagation(); playClickSound(); toggleFavorite(entry.id); }}>
                            <Heart className={`w-5 h-5 ${entry.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                          </button>
                        </div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">{entry.title}</h3>
                        <p className="text-gray-300">{entry.content}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {viewMode === 'calendar' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-gray-900 rounded-3xl p-8">
                <div className="flex items-center justify-between mb-8">
                  <button onClick={() => { playClickSound(); changeMonth(-1); }} className="p-2 rounded-lg bg-gray-800 cursor-pointer">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h3>
                  <button onClick={() => { playClickSound(); changeMonth(1); }} className="p-2 rounded-lg bg-gray-800 cursor-pointer">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-4 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center font-semibold text-white">{day}</div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-4">
                  {[...Array(firstDayOfMonth)].map((_, i) => <div key={`empty-${i}`} />)}
                  {[...Array(daysInMonth)].map((_, i) => {
                    const day = i + 1;
                    const dayEntries = getEntriesForDate(day);
                    const hasMood = dayEntries.length > 0;
                    const mood = hasMood ? MOODS.find(m => m.id === dayEntries[0].mood) : null;
                    const MoodIcon = mood?.icon || Star;
                    
                    return (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.1 }}
                        onClick={() => {
                          if (hasMood) {
                            playClickSound();
                            setViewingEntry(dayEntries[0]);
                          }
                        }}
                        className={`aspect-square rounded-2xl flex flex-col items-center justify-center cursor-pointer ${
                          hasMood ? `bg-gradient-to-br ${mood?.gradient} text-white` : 'bg-gray-800 text-gray-400'
                        }`}
                      >
                        <div className="text-lg font-bold">{day}</div>
                        {hasMood && (
                          <>
                            <MoodIcon className="w-5 h-5" />
                            {dayEntries[0].isFavorite && <Heart className="w-3 h-3 fill-white absolute bottom-1 right-1" />}
                          </>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {filteredEntries.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <BookOpen className="w-24 h-24 text-purple-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-2">No entries yet</h3>
              <p className="text-gray-400 mb-6">Start journaling today</p>
              <button onClick={() => {
                playClickSound();
                startNewEntry();
              }} className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-2xl font-semibold cursor-pointer">
                Create First Entry
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
