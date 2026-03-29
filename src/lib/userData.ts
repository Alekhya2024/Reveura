'use client';

import { mockHabits, mockJournalEntries, mockMoodData, mockSleepData } from '@/lib/mockData';

export interface StoredMoodEntry {
  date: string;
  mood: string;
  reasons?: string[];
  note?: string;
}

export interface StoredHabit {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  streak: number;
  bestStreak?: number;
  completed: string[];
  target: number;
  time?: string;
  isFavorite?: boolean;
  createdAt?: string;
}

export interface StoredJournalEntry {
  id: string;
  date: string;
  mood: string;
  weather: string;
  title: string;
  content: string;
  tags: string[];
  isPrivate: boolean;
  sentiment?: number;
  energy?: number;
  isFavorite?: boolean;
}

export interface StoredSleepEntry {
  date: string;
  hours: number;
  quality: 'excellent' | 'good' | 'poor';
  bedtime: string;
  wakeup: string;
}

export interface MoodGameStats {
  bubbleBestScore: number;
  bubbleSessions: number;
  memoryBestScore: number;
  memoryBestLevel: number;
  memorySessions: number;
  zenBestTime: number | null;
  zenBestMoves: number | null;
  zenSessions: number;
  reflexBestScore: number;
  reflexBestReaction: number | null;
  reflexSessions: number;
}

export interface ReveuraDataSnapshot {
  moods: StoredMoodEntry[];
  habits: StoredHabit[];
  journalEntries: StoredJournalEntry[];
  sleepEntries: StoredSleepEntry[];
  moodGameStats: MoodGameStats;
}

export const STORAGE_KEYS = {
  moods: 'reveura_mood_entries',
  habits: 'reveura_habits',
  journalEntries: 'reveura_journal_entries',
  sleepEntries: 'reveura_sleep_entries',
  sleepGoal: 'reveura_sleep_goal',
  userProfile: 'reveura_user_profile',
  achievementsClaimed: 'reveura_achievements_claimed',
  moodGameStats: 'reveura_mood_game_stats',
} as const;

export const defaultMoodGameStats: MoodGameStats = {
  bubbleBestScore: 0,
  bubbleSessions: 0,
  memoryBestScore: 0,
  memoryBestLevel: 0,
  memorySessions: 0,
  zenBestTime: null,
  zenBestMoves: null,
  zenSessions: 0,
  reflexBestScore: 0,
  reflexBestReaction: null,
  reflexSessions: 0,
};

const isBrowser = () => typeof window !== 'undefined';

const sortByDateAsc = <T extends { date: string }>(entries: T[]) =>
  entries.slice().sort((left, right) => new Date(left.date).getTime() - new Date(right.date).getTime());

function loadJSON<T>(key: string, fallback: T): T {
  if (!isBrowser()) {
    return fallback;
  }

  try {
    const rawValue = window.localStorage.getItem(key);
    if (!rawValue) {
      return fallback;
    }

    return JSON.parse(rawValue) as T;
  } catch (error) {
    console.error(`Error loading ${key}:`, error);
    return fallback;
  }
}

export function saveJSON<T>(key: string, value: T) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getStoredMoodEntries() {
  return sortByDateAsc(loadJSON<StoredMoodEntry[]>(STORAGE_KEYS.moods, mockMoodData));
}

export function saveStoredMoodEntries(entries: StoredMoodEntry[]) {
  saveJSON(STORAGE_KEYS.moods, sortByDateAsc(entries));
}

export function upsertMoodEntry(entry: StoredMoodEntry) {
  const nextEntries = getStoredMoodEntries().filter((currentEntry) => currentEntry.date !== entry.date);
  nextEntries.push(entry);
  saveStoredMoodEntries(nextEntries);
  return sortByDateAsc(nextEntries);
}

export function getStoredHabits() {
  return loadJSON<StoredHabit[]>(STORAGE_KEYS.habits, mockHabits);
}

export function saveStoredHabits(habits: StoredHabit[]) {
  saveJSON(STORAGE_KEYS.habits, habits);
}

export function getStoredJournalEntries() {
  return sortByDateAsc(loadJSON<StoredJournalEntry[]>(STORAGE_KEYS.journalEntries, mockJournalEntries));
}

export function getStoredSleepEntries() {
  return sortByDateAsc(loadJSON<StoredSleepEntry[]>(STORAGE_KEYS.sleepEntries, mockSleepData));
}

export function getStoredMoodGameStats() {
  return loadJSON<MoodGameStats>(STORAGE_KEYS.moodGameStats, defaultMoodGameStats);
}

export function saveStoredMoodGameStats(stats: MoodGameStats) {
  saveJSON(STORAGE_KEYS.moodGameStats, stats);
}

export function getClaimedAchievementIds() {
  return loadJSON<string[]>(STORAGE_KEYS.achievementsClaimed, []);
}

export function saveClaimedAchievementIds(ids: string[]) {
  saveJSON(STORAGE_KEYS.achievementsClaimed, ids);
}

export function getReveuraDataSnapshot(): ReveuraDataSnapshot {
  return {
    moods: getStoredMoodEntries(),
    habits: getStoredHabits(),
    journalEntries: getStoredJournalEntries(),
    sleepEntries: getStoredSleepEntries(),
    moodGameStats: getStoredMoodGameStats(),
  };
}

export function calculateHabitStreak(completedDates: string[]) {
  if (completedDates.length === 0) {
    return 0;
  }

  const completedSet = new Set(completedDates);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let streak = 0;

  for (let index = 0; index < 365; index += 1) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() - index);
    const dateKey = currentDate.toISOString().split('T')[0];

    if (completedSet.has(dateKey)) {
      streak += 1;
      continue;
    }

    if (index > 0) {
      break;
    }
  }

  return streak;
}