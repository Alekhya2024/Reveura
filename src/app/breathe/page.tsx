'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import {
  Gamepad2, Sparkles, Heart, Zap, Play, Pause, RotateCcw,
  Volume2, VolumeX, Trophy, TrendingUp, Clock, Star,
  Target, Flame, Circle, Wind, Smile, Frown, Meh,
  Sun, Cloud, CloudRain, Lightbulb, Brain, Timer,
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight, CheckCircle2,
  XCircle, Award, Gem, Crown, Rocket, Music, Palette,
  MousePointer2, Hand, Zap as Lightning, Waves, Leaf,
  Mountain, Droplets, Focus, RefreshCw, Eye, Crosshair,
  SquareStack, Grid3X3, Shuffle, Puzzle
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

// ==================== GAME 1: BUBBLE POP MOOD THERAPY ====================
interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  mood: string;
  points: number;
  speed: number;
}

const BUBBLE_MOODS = [
  { mood: 'joy', color: 'from-yellow-400 to-orange-400', icon: Sun, points: 10 },
  { mood: 'calm', color: 'from-blue-400 to-cyan-400', icon: Cloud, points: 15 },
  { mood: 'love', color: 'from-pink-400 to-rose-400', icon: Heart, points: 20 },
  { mood: 'energy', color: 'from-green-400 to-emerald-400', icon: Zap, points: 25 },
  { mood: 'wisdom', color: 'from-purple-400 to-indigo-400', icon: Brain, points: 30 },
  { mood: 'stress', color: 'from-red-500 to-red-600', icon: CloudRain, points: -10 },
];

// ==================== GAME 2: PATTERN MEMORY SEQUENCE ====================
interface PatternStep {
  direction: 'up' | 'down' | 'left' | 'right';
  color: string;
}

const DIRECTIONS = [
  { direction: 'up', icon: ArrowUp, color: 'from-blue-500 to-cyan-500', key: 'ArrowUp' },
  { direction: 'down', icon: ArrowDown, color: 'from-green-500 to-emerald-500', key: 'ArrowDown' },
  { direction: 'left', icon: ArrowLeft, color: 'from-purple-500 to-pink-500', key: 'ArrowLeft' },
  { direction: 'right', icon: ArrowRight, color: 'from-orange-500 to-yellow-500', key: 'ArrowRight' },
];

type GameType = 'bubbles' | 'memory' | 'zen' | 'reflex' | null;

// ==================== GAME 3: ZEN GARDEN COLORS ====================
const ZEN_COLORS = [
  { name: 'Serenity', color: 'from-blue-400 to-cyan-300', hex: '#60a5fa' },
  { name: 'Nature', color: 'from-green-400 to-emerald-300', hex: '#4ade80' },
  { name: 'Sunset', color: 'from-orange-400 to-yellow-300', hex: '#fb923c' },
  { name: 'Blossom', color: 'from-pink-400 to-rose-300', hex: '#f472b6' },
  { name: 'Twilight', color: 'from-purple-400 to-indigo-300', hex: '#a78bfa' },
  { name: 'Ocean', color: 'from-teal-400 to-cyan-300', hex: '#2dd4bf' },
];

// ==================== GAME 4: REFLEX REACTION ====================
interface ReflexTarget {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  isGood: boolean;
  lifetime: number;
}

export default function MoodGamesPage() {
  const [selectedGame, setSelectedGame] = useState<GameType>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  
  // Bubble Pop Game State
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [bubbleScore, setBubbleScore] = useState(0);
  const [bubbleTimeLeft, setBubbleTimeLeft] = useState(60);
  const [bubbleGameActive, setBubbleGameActive] = useState(false);
  const [bubbleCombo, setBubbleCombo] = useState(0);
  const [poppedEffects, setPoppedEffects] = useState<{id: number; x: number; y: number; points: number}[]>([]);
  const [moodMeter, setMoodMeter] = useState(50);
  
  // Memory Pattern Game State
  const [memoryPattern, setMemoryPattern] = useState<PatternStep[]>([]);
  const [playerPattern, setPlayerPattern] = useState<PatternStep[]>([]);
  const [memoryLevel, setMemoryLevel] = useState(1);
  const [memoryScore, setMemoryScore] = useState(0);
  const [isShowingPattern, setIsShowingPattern] = useState(false);
  const [currentShowIndex, setCurrentShowIndex] = useState(-1);
  const [memoryGameActive, setMemoryGameActive] = useState(false);
  const [memoryMessage, setMemoryMessage] = useState('');
  const [activeDirection, setActiveDirection] = useState<string | null>(null);
  
  // Zen Garden Game State
  const [zenTiles, setZenTiles] = useState<{id: number; name: string; color: string; revealed: boolean; matched: boolean}[]>([]);
  const [zenFirstPick, setZenFirstPick] = useState<number | null>(null);
  const [zenMoves, setZenMoves] = useState(0);
  const [zenMatches, setZenMatches] = useState(0);
  const [zenGameActive, setZenGameActive] = useState(false);
  const [zenTime, setZenTime] = useState(0);
  const [zenLocked, setZenLocked] = useState(false);
  
  // Reflex Reaction Game State
  const [reflexTargets, setReflexTargets] = useState<ReflexTarget[]>([]);
  const [reflexScore, setReflexScore] = useState(0);
  const [reflexTimeLeft, setReflexTimeLeft] = useState(30);
  const [reflexGameActive, setReflexGameActive] = useState(false);
  const [reflexHits, setReflexHits] = useState(0);
  const [reflexMisses, setReflexMisses] = useState(0);
  const [reflexBestReaction, setReflexBestReaction] = useState<number | null>(null);
  const [lastSpawnTime, setLastSpawnTime] = useState(Date.now());
  
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // ==================== BUBBLE POP GAME LOGIC ====================
  const spawnBubble = useCallback(() => {
    const moodType = BUBBLE_MOODS[Math.floor(Math.random() * BUBBLE_MOODS.length)];
    const newBubble: Bubble = {
      id: Date.now() + Math.random(),
      x: Math.random() * 80 + 10,
      y: 110,
      size: Math.random() * 40 + 50,
      color: moodType.color,
      mood: moodType.mood,
      points: moodType.points,
      speed: Math.random() * 1.5 + 0.8,
    };
    setBubbles(prev => [...prev, newBubble]);
  }, []);

  const popBubble = (bubble: Bubble, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Add popped effect
    setPoppedEffects(prev => [...prev, {
      id: bubble.id,
      x: bubble.x,
      y: bubble.y,
      points: bubble.points
    }]);
    
    // Remove bubble
    setBubbles(prev => prev.filter(b => b.id !== bubble.id));
    
    // Update score and combo
    if (bubble.points > 0) {
      setBubbleCombo(prev => prev + 1);
      const comboMultiplier = Math.floor(bubbleCombo / 5) + 1;
      setBubbleScore(prev => prev + bubble.points * comboMultiplier);
      setMoodMeter(prev => Math.min(100, prev + 5));
    } else {
      setBubbleCombo(0);
      setBubbleScore(prev => Math.max(0, prev + bubble.points));
      setMoodMeter(prev => Math.max(0, prev - 10));
    }
    
    // Remove effect after animation
    setTimeout(() => {
      setPoppedEffects(prev => prev.filter(p => p.id !== bubble.id));
    }, 1000);
  };

  // Bubble game timer and spawning
  useEffect(() => {
    if (!bubbleGameActive) return;
    
    const spawnInterval = setInterval(() => {
      spawnBubble();
    }, 800);
    
    const moveInterval = setInterval(() => {
      setBubbles(prev => prev
        .map(b => ({ ...b, y: b.y - b.speed }))
        .filter(b => b.y > -20)
      );
    }, 50);
    
    const timerInterval = setInterval(() => {
      setBubbleTimeLeft(prev => {
        if (prev <= 1) {
          setBubbleGameActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => {
      clearInterval(spawnInterval);
      clearInterval(moveInterval);
      clearInterval(timerInterval);
    };
  }, [bubbleGameActive, spawnBubble]);

  const startBubbleGame = () => {
    setBubbles([]);
    setBubbleScore(0);
    setBubbleTimeLeft(60);
    setBubbleCombo(0);
    setMoodMeter(50);
    setBubbleGameActive(true);
  };

  // ==================== MEMORY PATTERN GAME LOGIC ====================
  const generatePattern = useCallback((level: number) => {
    const newPattern: PatternStep[] = [];
    for (let i = 0; i < level + 2; i++) {
      const dir = DIRECTIONS[Math.floor(Math.random() * 4)];
      newPattern.push({ direction: dir.direction as 'up' | 'down' | 'left' | 'right', color: dir.color });
    }
    return newPattern;
  }, []);

  const showPattern = async (pattern: PatternStep[]) => {
    setIsShowingPattern(true);
    setMemoryMessage('Watch the pattern...');
    
    for (let i = 0; i < pattern.length; i++) {
      setCurrentShowIndex(i);
      await new Promise(resolve => setTimeout(resolve, 600));
      setCurrentShowIndex(-1);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    setIsShowingPattern(false);
    setMemoryMessage('Your turn! Repeat the pattern');
  };

  const startMemoryGame = () => {
    setMemoryLevel(1);
    setMemoryScore(0);
    setPlayerPattern([]);
    setMemoryGameActive(true);
    const pattern = generatePattern(1);
    setMemoryPattern(pattern);
    setTimeout(() => showPattern(pattern), 500);
  };

  const handleDirectionClick = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (isShowingPattern || !memoryGameActive) return;
    
    setActiveDirection(direction);
    setTimeout(() => setActiveDirection(null), 200);
    
    const newPlayerPattern = [...playerPattern, { direction, color: '' }];
    setPlayerPattern(newPlayerPattern);
    
    // Check if correct
    const currentIndex = newPlayerPattern.length - 1;
    if (memoryPattern[currentIndex].direction !== direction) {
      // Wrong!
      setMemoryMessage('Oops! Game Over');
      setMemoryGameActive(false);
      return;
    }
    
    // Check if completed pattern
    if (newPlayerPattern.length === memoryPattern.length) {
      const pointsEarned = memoryLevel * 100;
      setMemoryScore(prev => prev + pointsEarned);
      setMemoryMessage(`Perfect! +${pointsEarned} points`);
      
      // Next level
      setTimeout(() => {
        const nextLevel = memoryLevel + 1;
        setMemoryLevel(nextLevel);
        setPlayerPattern([]);
        const pattern = generatePattern(nextLevel);
        setMemoryPattern(pattern);
        showPattern(pattern);
      }, 1500);
    }
  };

  // Keyboard controls for memory game
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!memoryGameActive || isShowingPattern) return;
      
      const dirMap: Record<string, 'up' | 'down' | 'left' | 'right'> = {
        'ArrowUp': 'up',
        'ArrowDown': 'down',
        'ArrowLeft': 'left',
        'ArrowRight': 'right',
      };
      
      if (dirMap[e.key]) {
        handleDirectionClick(dirMap[e.key]);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [memoryGameActive, isShowingPattern, playerPattern, memoryPattern, memoryLevel]);

  const getMoodEmoji = () => {
    if (moodMeter >= 80) return { icon: Sun, label: 'Radiant', color: 'text-yellow-400' };
    if (moodMeter >= 60) return { icon: Smile, label: 'Happy', color: 'text-green-400' };
    if (moodMeter >= 40) return { icon: Meh, label: 'Neutral', color: 'text-gray-400' };
    if (moodMeter >= 20) return { icon: Frown, label: 'Low', color: 'text-orange-400' };
    return { icon: CloudRain, label: 'Stressed', color: 'text-red-400' };
  };

  // ==================== ZEN GARDEN GAME LOGIC ====================
  const initZenGame = useCallback(() => {
    const colors = [...ZEN_COLORS, ...ZEN_COLORS];
    const shuffled = colors
      .map((c, i) => ({ ...c, id: i, revealed: false, matched: false }))
      .sort(() => Math.random() - 0.5);
    setZenTiles(shuffled);
    setZenFirstPick(null);
    setZenMoves(0);
    setZenMatches(0);
    setZenTime(0);
    setZenLocked(false);
    setZenGameActive(true);
  }, []);

  const handleZenTileClick = (index: number) => {
    if (zenLocked || zenTiles[index].revealed || zenTiles[index].matched) return;
    
    const newTiles = zenTiles.map((tile, i) => 
      i === index ? { ...tile, revealed: true } : tile
    );
    setZenTiles(newTiles);
    
    if (zenFirstPick === null) {
      setZenFirstPick(index);
    } else {
      setZenMoves(prev => prev + 1);
      setZenLocked(true);
      
      const firstTile = zenTiles[zenFirstPick];
      const secondTile = zenTiles[index];
      
      if (firstTile.name === secondTile.name) {
        // Match found!
        setTimeout(() => {
          setZenTiles(prev => prev.map((tile, i) => 
            i === zenFirstPick || i === index ? { ...tile, matched: true } : tile
          ));
          setZenMatches(prev => {
            const newMatches = prev + 1;
            if (newMatches === ZEN_COLORS.length) {
              setZenGameActive(false);
            }
            return newMatches;
          });
          setZenFirstPick(null);
          setZenLocked(false);
        }, 600);
      } else {
        // No match
        setTimeout(() => {
          setZenTiles(prev => prev.map((tile, i) => 
            i === zenFirstPick || i === index ? { ...tile, revealed: false } : tile
          ));
          setZenFirstPick(null);
          setZenLocked(false);
        }, 1200);
      }
    }
  };

  // Zen game timer
  useEffect(() => {
    if (!zenGameActive) return;
    const timer = setInterval(() => setZenTime(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, [zenGameActive]);

  // ==================== REFLEX REACTION GAME LOGIC ====================
  const spawnReflexTarget = useCallback(() => {
    const isGood = Math.random() > 0.25;
    const newTarget: ReflexTarget = {
      id: Date.now() + Math.random(),
      x: Math.random() * 80 + 10,
      y: Math.random() * 70 + 15,
      size: Math.random() * 30 + 40,
      color: isGood ? 'from-green-400 to-emerald-500' : 'from-red-500 to-red-600',
      isGood,
      lifetime: Date.now(),
    };
    setReflexTargets(prev => [...prev, newTarget]);
    setLastSpawnTime(Date.now());
  }, []);

  const hitReflexTarget = (target: ReflexTarget, e: React.MouseEvent) => {
    e.stopPropagation();
    const reactionTime = Date.now() - target.lifetime;
    
    setReflexTargets(prev => prev.filter(t => t.id !== target.id));
    
    if (target.isGood) {
      const points = Math.max(100, 500 - reactionTime);
      setReflexScore(prev => prev + points);
      setReflexHits(prev => prev + 1);
      if (!reflexBestReaction || reactionTime < reflexBestReaction) {
        setReflexBestReaction(reactionTime);
      }
    } else {
      setReflexScore(prev => Math.max(0, prev - 200));
      setReflexMisses(prev => prev + 1);
    }
  };

  // Reflex game loop
  useEffect(() => {
    if (!reflexGameActive) return;
    
    const spawnInterval = setInterval(() => {
      if (reflexTargets.length < 5) {
        spawnReflexTarget();
      }
    }, 600);
    
    const cleanupInterval = setInterval(() => {
      setReflexTargets(prev => prev.filter(t => Date.now() - t.lifetime < 2000));
    }, 100);
    
    const timerInterval = setInterval(() => {
      setReflexTimeLeft(prev => {
        if (prev <= 1) {
          setReflexGameActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => {
      clearInterval(spawnInterval);
      clearInterval(cleanupInterval);
      clearInterval(timerInterval);
    };
  }, [reflexGameActive, reflexTargets.length, spawnReflexTarget]);

  const startReflexGame = () => {
    setReflexTargets([]);
    setReflexScore(0);
    setReflexTimeLeft(30);
    setReflexHits(0);
    setReflexMisses(0);
    setReflexBestReaction(null);
    setReflexGameActive(true);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(40)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 6 + 2,
                height: Math.random() * 6 + 2,
                background: `rgba(${Math.random() * 100 + 100}, ${Math.random() * 100 + 100}, 255, 0.3)`,
              }}
              animate={{
                x: [Math.random() * 1200, Math.random() * 1200],
                y: [Math.random() * 800, Math.random() * 800],
                scale: [0, 1, 0],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <motion.h1 
                  className="text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2"
                  animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  style={{ backgroundSize: '200% 200%' }}
                >
                  Mood Games Arena
                </motion.h1>
                <p className="text-gray-300 text-lg flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5 text-purple-400" />
                  Play games to boost your mood and reduce stress
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 text-white"
              >
                {soundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
              </motion.button>
            </div>
          </motion.div>

          {/* Game Selection */}
          <AnimatePresence mode="wait">
            {!selectedGame && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="grid grid-cols-2 gap-6 max-w-6xl mx-auto"
              >
                {/* Bubble Pop Game Card */}
                <motion.button
                  whileHover={{ scale: 1.03, y: -10 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedGame('bubbles')}
                  className="relative p-8 rounded-3xl overflow-hidden group bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20 backdrop-blur-xl border border-white/20 text-left"
                >
                  {/* Animated gradient overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-cyan-500/30 opacity-0 group-hover:opacity-100 transition-opacity"
                    animate={{
                      background: [
                        'linear-gradient(45deg, rgba(236,72,153,0.3), rgba(168,85,247,0.3), rgba(6,182,212,0.3))',
                        'linear-gradient(45deg, rgba(6,182,212,0.3), rgba(236,72,153,0.3), rgba(168,85,247,0.3))',
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  
                  {/* Floating bubbles preview */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(10)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-8 h-8 rounded-full bg-gradient-to-br from-white/30 to-white/10"
                        animate={{
                          y: [100 + i * 20, -50],
                          x: [20 + i * 30, 40 + i * 25],
                          scale: [0.5, 1, 0.5],
                          opacity: [0, 0.7, 0],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          delay: i * 0.3,
                        }}
                      />
                    ))}
                  </div>

                  <div className="relative z-10">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center mb-6 shadow-xl shadow-pink-500/30">
                      <MousePointer2 className="w-10 h-10 text-white" />
                    </div>
                    
                    <h2 className="text-3xl font-bold text-white mb-3">Bubble Pop Therapy</h2>
                    <p className="text-gray-300 mb-4">Pop mood bubbles to boost happiness! Avoid stress bubbles and build combos for bonus points.</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1"><Timer className="w-4 h-4" /> 60 seconds</span>
                      <span className="flex items-center gap-1"><Target className="w-4 h-4" /> Click to pop</span>
                      <span className="flex items-center gap-1"><Flame className="w-4 h-4" /> Build combos</span>
                    </div>
                    
                    <motion.div
                      className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Play className="w-5 h-5" /> Play Now
                    </motion.div>
                  </div>
                </motion.button>

                {/* Memory Pattern Game Card */}
                <motion.button
                  whileHover={{ scale: 1.03, y: -10 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedGame('memory')}
                  className="relative p-8 rounded-3xl overflow-hidden group bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-green-500/20 backdrop-blur-xl border border-white/20 text-left"
                >
                  {/* Animated gradient overlay */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    animate={{
                      background: [
                        'linear-gradient(45deg, rgba(59,130,246,0.3), rgba(6,182,212,0.3), rgba(16,185,129,0.3))',
                        'linear-gradient(45deg, rgba(16,185,129,0.3), rgba(59,130,246,0.3), rgba(6,182,212,0.3))',
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  
                  {/* Arrow previews */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {DIRECTIONS.map((dir, i) => (
                      <motion.div
                        key={i}
                        className={`absolute w-12 h-12 rounded-xl bg-gradient-to-br ${dir.color} flex items-center justify-center`}
                        animate={{
                          scale: [0.8, 1.2, 0.8],
                          opacity: [0.2, 0.5, 0.2],
                          rotate: [0, 10, -10, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: i * 0.5,
                        }}
                        style={{
                          top: `${20 + i * 15}%`,
                          right: `${10 + i * 8}%`,
                        }}
                      >
                        <dir.icon className="w-6 h-6 text-white" />
                      </motion.div>
                    ))}
                  </div>

                  <div className="relative z-10">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-6 shadow-xl shadow-blue-500/30">
                      <Brain className="w-10 h-10 text-white" />
                    </div>
                    
                    <h2 className="text-3xl font-bold text-white mb-3">Mind Pattern Match</h2>
                    <p className="text-gray-300 mb-4">Train your brain with pattern sequences! Watch, memorize, and repeat the arrows to level up.</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1"><Brain className="w-4 h-4" /> Memory training</span>
                      <span className="flex items-center gap-1"><TrendingUp className="w-4 h-4" /> Endless levels</span>
                      <span className="flex items-center gap-1"><Lightning className="w-4 h-4" /> Use keyboard</span>
                    </div>
                    
                    <motion.div
                      className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Play className="w-5 h-5" /> Play Now
                    </motion.div>
                  </div>
                </motion.button>

                {/* Zen Garden Game Card */}
                <motion.button
                  whileHover={{ scale: 1.03, y: -10 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedGame('zen')}
                  className="relative p-8 rounded-3xl overflow-hidden group bg-gradient-to-br from-teal-500/20 via-emerald-500/20 to-green-500/20 backdrop-blur-xl border border-white/20 text-left"
                >
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    animate={{
                      background: [
                        'linear-gradient(45deg, rgba(20,184,166,0.3), rgba(16,185,129,0.3), rgba(34,197,94,0.3))',
                        'linear-gradient(45deg, rgba(34,197,94,0.3), rgba(20,184,166,0.3), rgba(16,185,129,0.3))',
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {ZEN_COLORS.map((c, i) => (
                      <motion.div
                        key={i}
                        className={`absolute w-10 h-10 rounded-lg bg-gradient-to-br ${c.color}`}
                        animate={{
                          rotateY: [0, 180, 0],
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.3,
                        }}
                        style={{
                          top: `${15 + (i % 3) * 25}%`,
                          right: `${5 + (i % 2) * 15}%`,
                        }}
                      />
                    ))}
                  </div>

                  <div className="relative z-10">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center mb-6 shadow-xl shadow-teal-500/30">
                      <Grid3X3 className="w-10 h-10 text-white" />
                    </div>
                    
                    <h2 className="text-3xl font-bold text-white mb-3">Zen Color Match</h2>
                    <p className="text-gray-300 mb-4">Find matching color pairs in this calming memory game. Clear the board with minimal moves!</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1"><Leaf className="w-4 h-4" /> Relaxing</span>
                      <span className="flex items-center gap-1"><Puzzle className="w-4 h-4" /> 12 tiles</span>
                      <span className="flex items-center gap-1"><Target className="w-4 h-4" /> Find pairs</span>
                    </div>
                    
                    <motion.div
                      className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Play className="w-5 h-5" /> Play Now
                    </motion.div>
                  </div>
                </motion.button>

                {/* Reflex Reaction Game Card */}
                <motion.button
                  whileHover={{ scale: 1.03, y: -10 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedGame('reflex')}
                  className="relative p-8 rounded-3xl overflow-hidden group bg-gradient-to-br from-orange-500/20 via-red-500/20 to-yellow-500/20 backdrop-blur-xl border border-white/20 text-left"
                >
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    animate={{
                      background: [
                        'linear-gradient(45deg, rgba(249,115,22,0.3), rgba(239,68,68,0.3), rgba(234,179,8,0.3))',
                        'linear-gradient(45deg, rgba(234,179,8,0.3), rgba(249,115,22,0.3), rgba(239,68,68,0.3))',
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center"
                        animate={{
                          scale: [0, 1, 0],
                          opacity: [0, 0.6, 0],
                          x: [0, Math.random() * 20 - 10],
                          y: [0, Math.random() * 20 - 10],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.4,
                        }}
                        style={{
                          top: `${20 + (i % 3) * 20}%`,
                          right: `${5 + (i % 2) * 20}%`,
                        }}
                      >
                        <Crosshair className="w-6 h-6 text-white" />
                      </motion.div>
                    ))}
                  </div>

                  <div className="relative z-10">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mb-6 shadow-xl shadow-orange-500/30">
                      <Crosshair className="w-10 h-10 text-white" />
                    </div>
                    
                    <h2 className="text-3xl font-bold text-white mb-3">Reflex Reactor</h2>
                    <p className="text-gray-300 mb-4">Test your reaction speed! Click green targets quickly, avoid the red ones. How fast can you react?</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1"><Zap className="w-4 h-4" /> Speed test</span>
                      <span className="flex items-center gap-1"><Timer className="w-4 h-4" /> 30 seconds</span>
                      <span className="flex items-center gap-1"><Target className="w-4 h-4" /> Hit targets</span>
                    </div>
                    
                    <motion.div
                      className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Play className="w-5 h-5" /> Play Now
                    </motion.div>
                  </div>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ==================== BUBBLE POP GAME ==================== */}
          <AnimatePresence>
            {selectedGame === 'bubbles' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                {/* Game Header */}
                <div className="flex items-center justify-between mb-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedGame(null);
                      setBubbleGameActive(false);
                    }}
                    className="px-6 py-3 bg-white/10 backdrop-blur-xl rounded-xl text-white border border-white/20 flex items-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" /> Back to Games
                  </motion.button>
                  
                  <div className="flex items-center gap-6">
                    {/* Mood Meter */}
                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-xl px-4 py-2 border border-white/20">
                      {(() => {
                        const mood = getMoodEmoji();
                        const MoodIcon = mood.icon;
                        return (
                          <>
                            <MoodIcon className={`w-6 h-6 ${mood.color}`} />
                            <div className="w-32 h-3 bg-gray-700 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                                initial={{ width: '50%' }}
                                animate={{ width: `${moodMeter}%` }}
                              />
                            </div>
                            <span className={`text-sm font-bold ${mood.color}`}>{mood.label}</span>
                          </>
                        );
                      })()}
                    </div>
                    
                    {/* Stats */}
                    <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-xl rounded-xl px-4 py-2 border border-yellow-500/30">
                      <Trophy className="w-5 h-5 text-yellow-400" />
                      <span className="text-2xl font-bold text-white">{bubbleScore}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-xl rounded-xl px-4 py-2 border border-orange-500/30">
                      <Flame className="w-5 h-5 text-orange-400" />
                      <span className="text-lg font-bold text-white">x{Math.floor(bubbleCombo / 5) + 1}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-xl px-4 py-2 border border-blue-500/30">
                      <Timer className="w-5 h-5 text-cyan-400" />
                      <span className="text-2xl font-bold text-white">{bubbleTimeLeft}s</span>
                    </div>
                  </div>
                </div>

                {/* Game Area */}
                <div
                  ref={gameAreaRef}
                  className="relative w-full h-[600px] rounded-3xl overflow-hidden bg-gradient-to-b from-indigo-900/50 via-purple-900/50 to-pink-900/50 backdrop-blur-xl border border-white/20"
                >
                  {/* Bubbles */}
                  {bubbles.map((bubble) => {
                    const moodType = BUBBLE_MOODS.find(m => m.mood === bubble.mood);
                    const Icon = moodType?.icon || Circle;
                    
                    return (
                      <motion.div
                        key={bubble.id}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        onClick={(e) => bubbleGameActive && popBubble(bubble, e)}
                        className={`absolute rounded-full bg-gradient-to-br ${bubble.color} flex items-center justify-center cursor-pointer shadow-lg hover:shadow-2xl transition-shadow`}
                        style={{
                          left: `${bubble.x}%`,
                          top: `${bubble.y}%`,
                          width: bubble.size,
                          height: bubble.size,
                          transform: 'translate(-50%, -50%)',
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Icon className="w-1/2 h-1/2 text-white" />
                      </motion.div>
                    );
                  })}

                  {/* Pop Effects */}
                  <AnimatePresence>
                    {poppedEffects.map((effect) => (
                      <motion.div
                        key={effect.id}
                        initial={{ opacity: 1, scale: 1, y: 0 }}
                        animate={{ opacity: 0, scale: 1.5, y: -50 }}
                        exit={{ opacity: 0 }}
                        className={`absolute pointer-events-none text-2xl font-bold ${effect.points > 0 ? 'text-green-400' : 'text-red-400'}`}
                        style={{
                          left: `${effect.x}%`,
                          top: `${effect.y}%`,
                          transform: 'translate(-50%, -50%)',
                        }}
                      >
                        {effect.points > 0 ? `+${effect.points}` : effect.points}
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Start/End Overlay */}
                  {!bubbleGameActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center"
                    >
                      {bubbleTimeLeft === 0 ? (
                        <>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-6xl font-bold text-white mb-4"
                          >
                            Game Over!
                          </motion.div>
                          <div className="text-3xl text-yellow-400 mb-2 flex items-center gap-2">
                            <Trophy className="w-8 h-8" /> Score: {bubbleScore}
                          </div>
                          <div className="text-xl text-gray-300 mb-8">
                            Final Mood: {getMoodEmoji().label}
                          </div>
                        </>
                      ) : (
                        <>
                          <MousePointer2 className="w-20 h-20 text-white/50 mb-4" />
                          <div className="text-3xl text-white mb-2">Bubble Pop Therapy</div>
                          <div className="text-gray-400 mb-8">Pop positive bubbles, avoid stress!</div>
                        </>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={startBubbleGame}
                        className="px-12 py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl text-white font-bold text-xl shadow-xl flex items-center gap-3"
                      >
                        <Play className="w-6 h-6" /> {bubbleTimeLeft === 0 ? 'Play Again' : 'Start Game'}
                      </motion.button>
                    </motion.div>
                  )}

                  {/* Legend */}
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    {BUBBLE_MOODS.slice(0, 5).map((mood) => {
                      const Icon = mood.icon;
                      return (
                        <div key={mood.mood} className={`flex items-center gap-1 px-2 py-1 rounded-lg bg-gradient-to-r ${mood.color} text-white text-xs`}>
                          <Icon className="w-3 h-3" /> +{mood.points}
                        </div>
                      );
                    })}
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white text-xs">
                      <CloudRain className="w-3 h-3" /> -10
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ==================== MEMORY PATTERN GAME ==================== */}
          <AnimatePresence>
            {selectedGame === 'memory' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                {/* Game Header */}
                <div className="flex items-center justify-between mb-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedGame(null);
                      setMemoryGameActive(false);
                    }}
                    className="px-6 py-3 bg-white/10 backdrop-blur-xl rounded-xl text-white border border-white/20 flex items-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" /> Back to Games
                  </motion.button>
                  
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-xl px-4 py-2 border border-purple-500/30">
                      <Crown className="w-5 h-5 text-purple-400" />
                      <span className="text-lg text-white">Level <span className="font-bold text-2xl">{memoryLevel}</span></span>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-xl rounded-xl px-4 py-2 border border-yellow-500/30">
                      <Trophy className="w-5 h-5 text-yellow-400" />
                      <span className="text-2xl font-bold text-white">{memoryScore}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-xl px-4 py-2 border border-blue-500/30">
                      <Target className="w-5 h-5 text-cyan-400" />
                      <span className="text-lg text-white">{playerPattern.length}/{memoryPattern.length}</span>
                    </div>
                  </div>
                </div>

                {/* Game Area */}
                <div className="relative w-full h-[600px] rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900/80 via-blue-900/50 to-cyan-900/50 backdrop-blur-xl border border-white/20 flex flex-col items-center justify-center">
                  {/* Message */}
                  <motion.div
                    key={memoryMessage}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-bold text-white mb-12"
                  >
                    {memoryMessage}
                  </motion.div>

                  {/* Arrow Buttons */}
                  <div className="relative w-80 h-80">
                    {DIRECTIONS.map((dir, index) => {
                      const positions = [
                        { top: '0', left: '50%', transform: 'translateX(-50%)' }, // up
                        { bottom: '0', left: '50%', transform: 'translateX(-50%)' }, // down
                        { left: '0', top: '50%', transform: 'translateY(-50%)' }, // left
                        { right: '0', top: '50%', transform: 'translateY(-50%)' }, // right
                      ];
                      
                      const isActive = currentShowIndex >= 0 && memoryPattern[currentShowIndex]?.direction === dir.direction;
                      const isPlayerActive = activeDirection === dir.direction;
                      
                      return (
                        <motion.button
                          key={dir.direction}
                          onClick={() => handleDirectionClick(dir.direction as 'up' | 'down' | 'left' | 'right')}
                          disabled={isShowingPattern || !memoryGameActive}
                          className={`absolute w-24 h-24 rounded-2xl flex items-center justify-center transition-all ${
                            isActive || isPlayerActive
                              ? `bg-gradient-to-br ${dir.color} shadow-2xl scale-110`
                              : 'bg-white/10 border border-white/30 hover:border-white/50'
                          }`}
                          style={positions[index] as any}
                          whileHover={{ scale: memoryGameActive && !isShowingPattern ? 1.1 : 1 }}
                          whileTap={{ scale: 0.9 }}
                          animate={{
                            boxShadow: isActive ? '0 0 40px rgba(255,255,255,0.5)' : '0 0 0px rgba(0,0,0,0)',
                          }}
                        >
                          <dir.icon className={`w-12 h-12 ${isActive || isPlayerActive ? 'text-white' : 'text-gray-400'}`} />
                        </motion.button>
                      );
                    })}

                    {/* Center */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <Brain className="w-10 h-10 text-white" />
                    </div>
                  </div>

                  {/* Progress Dots */}
                  <div className="flex gap-2 mt-12">
                    {memoryPattern.map((_, index) => (
                      <motion.div
                        key={index}
                        className={`w-4 h-4 rounded-full ${
                          index < playerPattern.length
                            ? 'bg-green-500'
                            : index === playerPattern.length && memoryGameActive
                            ? 'bg-yellow-500 animate-pulse'
                            : 'bg-gray-600'
                        }`}
                        animate={{
                          scale: index === currentShowIndex ? 1.5 : 1,
                        }}
                      />
                    ))}
                  </div>

                  {/* Keyboard hint */}
                  <div className="mt-8 text-gray-400 text-sm flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Tip: Use arrow keys on your keyboard!
                  </div>

                  {/* Start/End Overlay */}
                  {!memoryGameActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center"
                    >
                      {memoryScore > 0 ? (
                        <>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-6xl font-bold text-white mb-4"
                          >
                            Game Over!
                          </motion.div>
                          <div className="text-3xl text-yellow-400 mb-2 flex items-center gap-2">
                            <Trophy className="w-8 h-8" /> Score: {memoryScore}
                          </div>
                          <div className="text-xl text-purple-400 mb-8 flex items-center gap-2">
                            <Crown className="w-6 h-6" /> Reached Level {memoryLevel}
                          </div>
                        </>
                      ) : (
                        <>
                          <Brain className="w-20 h-20 text-white/50 mb-4" />
                          <div className="text-3xl text-white mb-2">Mind Pattern Match</div>
                          <div className="text-gray-400 mb-8">Watch and repeat the sequence</div>
                        </>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={startMemoryGame}
                        className="px-12 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl text-white font-bold text-xl shadow-xl flex items-center gap-3"
                      >
                        <Play className="w-6 h-6" /> {memoryScore > 0 ? 'Play Again' : 'Start Game'}
                      </motion.button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ==================== ZEN COLOR MATCH GAME ==================== */}
          <AnimatePresence>
            {selectedGame === 'zen' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                {/* Game Header */}
                <div className="flex items-center justify-between mb-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedGame(null);
                      setZenGameActive(false);
                    }}
                    className="px-6 py-3 bg-white/10 backdrop-blur-xl rounded-xl text-white border border-white/20 flex items-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" /> Back to Games
                  </motion.button>
                  
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 backdrop-blur-xl rounded-xl px-4 py-2 border border-teal-500/30">
                      <Shuffle className="w-5 h-5 text-teal-400" />
                      <span className="text-lg text-white">Moves: <span className="font-bold text-2xl">{zenMoves}</span></span>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-xl px-4 py-2 border border-green-500/30">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      <span className="text-lg text-white">Matches: <span className="font-bold text-2xl">{zenMatches}/{ZEN_COLORS.length}</span></span>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-xl px-4 py-2 border border-blue-500/30">
                      <Timer className="w-5 h-5 text-cyan-400" />
                      <span className="text-2xl font-bold text-white">{Math.floor(zenTime / 60)}:{(zenTime % 60).toString().padStart(2, '0')}</span>
                    </div>
                  </div>
                </div>

                {/* Game Area */}
                <div className="relative w-full min-h-[600px] rounded-3xl overflow-hidden bg-gradient-to-b from-teal-900/50 via-emerald-900/50 to-green-900/50 backdrop-blur-xl border border-white/20 flex items-center justify-center p-12">
                  {/* Zen decorative elements */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute"
                        animate={{
                          y: [-20, 20],
                          rotate: [0, 360],
                          opacity: [0.1, 0.3, 0.1],
                        }}
                        transition={{
                          duration: 10 + Math.random() * 10,
                          repeat: Infinity,
                          delay: i * 0.5,
                        }}
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                        }}
                      >
                        <Leaf className="w-8 h-8 text-emerald-500/20" />
                      </motion.div>
                    ))}
                  </div>

                  {/* Tiles Grid */}
                  <div className="grid grid-cols-4 gap-4 relative z-10">
                    {zenTiles.map((tile, index) => (
                      <motion.button
                        key={tile.id}
                        onClick={() => handleZenTileClick(index)}
                        disabled={tile.matched}
                        className={`w-28 h-28 rounded-2xl transition-all relative ${
                          tile.matched 
                            ? 'opacity-30 cursor-default' 
                            : 'cursor-pointer'
                        }`}
                        whileHover={{ scale: tile.matched ? 1 : 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        style={{ perspective: 1000 }}
                      >
                        <motion.div
                          className="w-full h-full relative"
                          animate={{
                            rotateY: tile.revealed || tile.matched ? 180 : 0,
                          }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                          style={{ transformStyle: 'preserve-3d' }}
                        >
                          {/* Card Back */}
                          <div
                            className="absolute inset-0 bg-gradient-to-br from-slate-600 to-slate-800 rounded-2xl flex items-center justify-center border-2 border-white/20 shadow-xl"
                            style={{
                              backfaceVisibility: 'hidden',
                            }}
                          >
                            <Sparkles className="w-10 h-10 text-white/40" />
                          </div>
                          
                          {/* Card Front */}
                          <div
                            className={`absolute inset-0 bg-gradient-to-br ${tile.color} rounded-2xl flex flex-col items-center justify-center border-2 border-white/40 shadow-xl`}
                            style={{
                              backfaceVisibility: 'hidden',
                              transform: 'rotateY(180deg)',
                            }}
                          >
                            <div className="w-14 h-14 rounded-full bg-white/30 flex items-center justify-center mb-2">
                              <Circle className="w-8 h-8 text-white" />
                            </div>
                            <span className="text-sm text-white font-bold">{tile.name}</span>
                          </div>
                        </motion.div>
                      </motion.button>
                    ))}
                  </div>

                  {/* Win/Start Overlay */}
                  {!zenGameActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-20"
                    >
                      {zenMatches === ZEN_COLORS.length && zenMoves > 0 ? (
                        <>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-6xl font-bold text-white mb-4"
                          >
                            Zen Master! 🎋
                          </motion.div>
                          <div className="text-3xl text-teal-400 mb-2 flex items-center gap-2">
                            <Trophy className="w-8 h-8" /> Completed in {zenMoves} moves
                          </div>
                          <div className="text-xl text-emerald-400 mb-8 flex items-center gap-2">
                            <Clock className="w-6 h-6" /> Time: {Math.floor(zenTime / 60)}:{(zenTime % 60).toString().padStart(2, '0')}
                          </div>
                        </>
                      ) : (
                        <>
                          <Grid3X3 className="w-20 h-20 text-white/50 mb-4" />
                          <div className="text-3xl text-white mb-2">Zen Color Match</div>
                          <div className="text-gray-400 mb-8">Find all matching color pairs</div>
                        </>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={initZenGame}
                        className="px-12 py-4 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-2xl text-white font-bold text-xl shadow-xl flex items-center gap-3"
                      >
                        <Play className="w-6 h-6" /> {zenMoves > 0 ? 'Play Again' : 'Start Game'}
                      </motion.button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ==================== REFLEX REACTOR GAME ==================== */}
          <AnimatePresence>
            {selectedGame === 'reflex' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                {/* Game Header */}
                <div className="flex items-center justify-between mb-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedGame(null);
                      setReflexGameActive(false);
                    }}
                    className="px-6 py-3 bg-white/10 backdrop-blur-xl rounded-xl text-white border border-white/20 flex items-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" /> Back to Games
                  </motion.button>
                  
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-xl px-4 py-2 border border-green-500/30">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      <span className="text-lg text-white">Hits: <span className="font-bold text-2xl">{reflexHits}</span></span>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-gradient-to-r from-red-500/20 to-rose-500/20 backdrop-blur-xl rounded-xl px-4 py-2 border border-red-500/30">
                      <XCircle className="w-5 h-5 text-red-400" />
                      <span className="text-lg text-white">Misses: <span className="font-bold text-2xl">{reflexMisses}</span></span>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-xl rounded-xl px-4 py-2 border border-yellow-500/30">
                      <Trophy className="w-5 h-5 text-yellow-400" />
                      <span className="text-2xl font-bold text-white">{reflexScore}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-xl px-4 py-2 border border-purple-500/30">
                      <Zap className="w-5 h-5 text-purple-400" />
                      <span className="text-lg text-white">Best: <span className="font-bold">{reflexBestReaction ? `${reflexBestReaction}ms` : '-'}</span></span>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-xl px-4 py-2 border border-blue-500/30">
                      <Timer className="w-5 h-5 text-cyan-400" />
                      <span className="text-2xl font-bold text-white">{reflexTimeLeft}s</span>
                    </div>
                  </div>
                </div>

                {/* Game Area */}
                <div
                  className="relative w-full h-[600px] rounded-3xl overflow-hidden bg-gradient-to-b from-orange-900/30 via-red-900/30 to-yellow-900/30 backdrop-blur-xl border border-white/20"
                >
                  {/* Targets */}
                  <AnimatePresence>
                    {reflexTargets.map((target) => (
                      <motion.button
                        key={target.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        onClick={(e) => reflexGameActive && hitReflexTarget(target, e)}
                        className={`absolute rounded-full bg-gradient-to-br ${target.color} flex items-center justify-center cursor-pointer shadow-lg border-4 border-white/30`}
                        style={{
                          left: `${target.x}%`,
                          top: `${target.y}%`,
                          width: target.size,
                          height: target.size,
                          transform: 'translate(-50%, -50%)',
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {target.isGood ? (
                          <CheckCircle2 className="w-1/2 h-1/2 text-white" />
                        ) : (
                          <XCircle className="w-1/2 h-1/2 text-white" />
                        )}
                        
                        {/* Shrinking timer ring */}
                        <motion.div
                          className="absolute inset-0 rounded-full border-4 border-white/50"
                          initial={{ scale: 1.3, opacity: 1 }}
                          animate={{ scale: 1, opacity: 0 }}
                          transition={{ duration: 2 }}
                        />
                      </motion.button>
                    ))}
                  </AnimatePresence>

                  {/* Instructions */}
                  {reflexGameActive && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4 text-sm text-white/60">
                      <div className="flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-xl">
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                        <span>Click GREEN = +Points</span>
                      </div>
                      <div className="flex items-center gap-2 bg-red-500/20 px-4 py-2 rounded-xl">
                        <XCircle className="w-5 h-5 text-red-400" />
                        <span>Avoid RED = -200 Points</span>
                      </div>
                    </div>
                  )}

                  {/* Start/End Overlay */}
                  {!reflexGameActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center"
                    >
                      {reflexScore > 0 || reflexHits > 0 ? (
                        <>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-6xl font-bold text-white mb-4"
                          >
                            Time&apos;s Up!
                          </motion.div>
                          <div className="text-3xl text-yellow-400 mb-2 flex items-center gap-2">
                            <Trophy className="w-8 h-8" /> Score: {reflexScore}
                          </div>
                          <div className="grid grid-cols-3 gap-6 mb-8">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-400">{reflexHits}</div>
                              <div className="text-gray-400">Hits</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-red-400">{reflexMisses}</div>
                              <div className="text-gray-400">Misses</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-purple-400">{reflexBestReaction}ms</div>
                              <div className="text-gray-400">Best Reaction</div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <Crosshair className="w-20 h-20 text-white/50 mb-4" />
                          <div className="text-3xl text-white mb-2">Reflex Reactor</div>
                          <div className="text-gray-400 mb-8">Click green targets, avoid red ones!</div>
                        </>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={startReflexGame}
                        className="px-12 py-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl text-white font-bold text-xl shadow-xl flex items-center gap-3"
                      >
                        <Play className="w-6 h-6" /> {reflexScore > 0 ? 'Play Again' : 'Start Game'}
                      </motion.button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}
