'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Play, Trophy, Timer, Brain,
  Zap, CheckCircle2, XCircle, Eye,
  Smile, Grid3X3, RotateCcw, Star,
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  getStoredMoodGameStats,
  saveStoredMoodGameStats,
  type MoodGameStats,
} from '@/lib/userData';

// ─── Static lookup data — Math.random() NEVER called at module/render level ──
const STROOP = [
  { word: 'RED',    hex: '#ef4444' },
  { word: 'BLUE',   hex: '#3b82f6' },
  { word: 'GREEN',  hex: '#22c55e' },
  { word: 'YELLOW', hex: '#eab308' },
  { word: 'PURPLE', hex: '#a855f7' },
  { word: 'ORANGE', hex: '#f97316' },
];

const EMOJI_POOLS: string[][] = [
  ['😄', '😢', '😠', '😱', '😍', '😴'],
  ['💪', '🎯', '🌟', '💎', '🔥', '🏆'],
  ['🌸', '🌺', '🌻', '🌹', '🌼', '🌷'],
];

type GameType = 'stroop' | 'tiles' | 'reaction' | 'emoji' | null;

const TILE_COUNT = 9;
const REACTION_ROUNDS = 5;

// Helpers — only call from event handlers / effects, NEVER during render
const ri = (max: number) => Math.floor(Math.random() * max);

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = ri(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickN<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}

function avgArr(arr: number[]) {
  return arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function MoodGamesPage() {
  const [selected, setSelected] = useState<GameType>(null);

  // Stats — saved via effect, never inside a setState updater
  const [stats, setStats] = useState<MoodGameStats>(getStoredMoodGameStats);
  const statsMounted = useRef(false);
  useEffect(() => {
    if (!statsMounted.current) { statsMounted.current = true; return; }
    saveStoredMoodGameStats(stats);
  }, [stats]);

  // ══════════════════════════════════════════════════════════════════════
  // GAME 1 — Stroop Color Challenge
  // ══════════════════════════════════════════════════════════════════════
  const [sActive, setSActive] = useState(false);
  const [sTime,   setSTime]   = useState(30);
  const [sScore,  setSScore]  = useState(0);
  const [sStreak, setSStreak] = useState(0);
  const [sBest,   setSBest]   = useState(0);
  const [sItem,   setSItem]   = useState<{ word: string; hex: string; isMatch: boolean }>({
    word: 'RED', hex: '#ef4444', isMatch: true,
  });
  const [sFb, setSFb] = useState<'correct' | 'wrong' | null>(null);

  const genStroop = useCallback(() => {
    const w = STROOP[ri(STROOP.length)];
    const match = Math.random() < 0.5;
    const others = STROOP.filter(s => s.hex !== w.hex);
    const c = match ? w : others[ri(others.length)];
    setSItem({ word: w.word, hex: c.hex, isMatch: match });
  }, []);

  const startStroop = useCallback(() => {
    setSScore(0); setSStreak(0); setSBest(0); setSTime(30); setSFb(null);
    genStroop();
    setSActive(true);
    setStats(s => ({ ...s, bubbleSessions: s.bubbleSessions + 1 }));
  }, [genStroop]);

  const answerStroop = useCallback((sayMatch: boolean) => {
    if (!sActive || sFb) return;
    const ok = sayMatch === sItem.isMatch;
    setSFb(ok ? 'correct' : 'wrong');
    const ns = ok ? sStreak + 1 : 0;
    setSStreak(ns);
    setSBest(p => Math.max(p, ns));
    setSScore(p => p + (ok ? 10 + sStreak * 2 : 0));
    setTimeout(() => { setSFb(null); genStroop(); }, 400);
  }, [sActive, sFb, sItem.isMatch, sStreak, genStroop]);

  useEffect(() => {
    if (!sActive) return;
    const t = setInterval(() => setSTime(p => (p <= 1 ? 0 : p - 1)), 1000);
    return () => clearInterval(t);
  }, [sActive]);

  useEffect(() => {
    if (!sActive || sTime !== 0) return;
    const tid = setTimeout(() => {
      setSActive(false);
      setStats(s => ({ ...s, bubbleBestScore: Math.max(s.bubbleBestScore, sScore) }));
    }, 0);
    return () => clearTimeout(tid);
  }, [sActive, sTime, sScore]);

  // ══════════════════════════════════════════════════════════════════════
  // GAME 2 — Memory Tiles
  // ══════════════════════════════════════════════════════════════════════
  const [tPhase,  setTPhase]  = useState<'idle' | 'showing' | 'input' | 'done'>('idle');
  const [tLevel,  setTLevel]  = useState(1);
  const [tScore,  setTScore]  = useState(0);
  const [tTarget, setTTarget] = useState<number[]>([]);
  const [tPlayer, setTPlayer] = useState<number[]>([]);
  const [tLit,    setTLit]    = useState<number | null>(null);
  const [tFb,     setTFb]     = useState<'correct' | 'wrong' | null>(null);
  const tIDs = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTIds = useCallback(() => {
    tIDs.current.forEach(clearTimeout);
    tIDs.current = [];
  }, []);

  const flashSeq = useCallback((tiles: number[]) => {
    clearTIds();
    setTPhase('showing');
    setTLit(null);
    let d = 400;
    tiles.forEach(tile => {
      tIDs.current.push(setTimeout(() => setTLit(tile), d));
      d += 700;
      tIDs.current.push(setTimeout(() => setTLit(null), d - 150));
    });
    tIDs.current.push(setTimeout(() => {
      setTPhase('input');
      setTPlayer([]);
    }, d + 300));
  }, [clearTIds]);

  const startTiles = useCallback(() => {
    clearTIds();
    setTFb(null);
    const lvl = 1;
    const tiles = pickN(Array.from({ length: TILE_COUNT }, (_, i) => i), lvl + 2);
    setTLevel(lvl);
    setTScore(0);
    setTTarget(tiles);
    setStats(s => ({ ...s, memorySessions: s.memorySessions + 1 }));
    tIDs.current.push(setTimeout(() => flashSeq(tiles), 300));
  }, [clearTIds, flashSeq]);

  const tapTile = useCallback((idx: number) => {
    if (tPhase !== 'input' || tPlayer.includes(idx)) return;
    const np = [...tPlayer, idx];
    const pos = np.length - 1;
    if (tTarget[pos] !== idx) {
      setTPlayer(np);
      setTFb('wrong');
      setTPhase('done');
      clearTIds();
      return;
    }
    setTPlayer(np);
    if (np.length === tTarget.length) {
      const ns = tScore + (tLevel + 2) * 50;
      const nl = tLevel + 1;
      setTScore(ns);
      setTFb('correct');
      setTLevel(nl);
      setStats(s => ({
        ...s,
        memoryBestScore: Math.max(s.memoryBestScore, ns),
        memoryBestLevel: Math.max(s.memoryBestLevel, nl),
      }));
      const nt = pickN(Array.from({ length: TILE_COUNT }, (_, i) => i), nl + 2);
      setTTarget(nt);
      clearTIds();
      tIDs.current.push(setTimeout(() => {
        setTFb(null);
        flashSeq(nt);
      }, 900));
    }
  }, [tPhase, tPlayer, tTarget, tLevel, tScore, clearTIds, flashSeq]);

  useEffect(() => () => { tIDs.current.forEach(clearTimeout); }, []);

  // ══════════════════════════════════════════════════════════════════════
  // GAME 3 — Reaction Speed
  // ══════════════════════════════════════════════════════════════════════
  type RPhase = 'idle' | 'waiting' | 'go' | 'result' | 'toosoon' | 'done';
  const [rPhase,   setRPhase]   = useState<RPhase>('idle');
  const [rResults, setRResults] = useState<number[]>([]);
  const [rCurrent, setRCurrent] = useState<number | null>(null);
  const rAt  = useRef(0);
  const rTid = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearR = useCallback(() => {
    if (rTid.current) { clearTimeout(rTid.current); rTid.current = null; }
  }, []);

  const scheduleGo = useCallback(() => {
    const wait = 1200 + Math.random() * 3000;
    rTid.current = setTimeout(() => {
      rAt.current = Date.now();
      setRPhase('go');
    }, wait);
  }, []);

  const startReaction = useCallback(() => {
    clearR();
    setRResults([]);
    setRCurrent(null);
    setRPhase('waiting');
    setStats(s => ({ ...s, reflexSessions: s.reflexSessions + 1 }));
    scheduleGo();
  }, [clearR, scheduleGo]);

  const tapReaction = useCallback(() => {
    if (rPhase === 'idle' || rPhase === 'done' || rPhase === 'result') return;
    if (rPhase === 'toosoon') return;
    if (rPhase === 'waiting') {
      clearR();
      setRPhase('toosoon');
      rTid.current = setTimeout(() => {
        setRPhase('waiting');
        scheduleGo();
      }, 1500);
      return;
    }
    clearR();
    const ms = Date.now() - rAt.current;
    setRCurrent(ms);
    setRResults(prev => {
      const nr = [...prev, ms];
      if (nr.length >= REACTION_ROUNDS) {
        const best = Math.min(...nr);
        setStats(s => ({
          ...s,
          reflexBestReaction: s.reflexBestReaction === null ? best : Math.min(s.reflexBestReaction, best),
          reflexBestScore: Math.max(s.reflexBestScore, REACTION_ROUNDS * 1000 - avgArr(nr)),
        }));
        rTid.current = setTimeout(() => setRPhase('done'), 1500);
      } else {
        rTid.current = setTimeout(() => {
          setRPhase('waiting');
          scheduleGo();
        }, 1200);
      }
      return nr;
    });
    setRPhase('result');
  }, [rPhase, clearR, scheduleGo]);

  useEffect(() => () => clearR(), [clearR]);

  // ══════════════════════════════════════════════════════════════════════
  // GAME 4 — Emoji Speed Match
  // ══════════════════════════════════════════════════════════════════════
  const [eActive,  setEActive]  = useState(false);
  const [eTime,    setETime]    = useState(45);
  const [eScore,   setEScore]   = useState(0);
  const [eTarget,  setETarget]  = useState('');
  const [eOptions, setEOptions] = useState<string[]>([]);
  const [eFb,      setEFb]      = useState<'correct' | 'wrong' | null>(null);

  const genEmoji = useCallback(() => {
    const pool = EMOJI_POOLS[ri(EMOJI_POOLS.length)];
    const target = pool[ri(pool.length)];
    const opts = shuffle([target, ...shuffle(pool.filter(e => e !== target)).slice(0, 5)]);
    setETarget(target);
    setEOptions(opts);
  }, []);

  const startEmoji = useCallback(() => {
    setEScore(0);
    setETime(45);
    setEFb(null);
    genEmoji();
    setEActive(true);
    setStats(s => ({ ...s, zenSessions: s.zenSessions + 1 }));
  }, [genEmoji]);

  const tapEmoji = useCallback((e: string) => {
    if (!eActive || eFb) return;
    const ok = e === eTarget;
    setEFb(ok ? 'correct' : 'wrong');
    if (ok) setEScore(p => p + 10);
    setTimeout(() => { setEFb(null); genEmoji(); }, 300);
  }, [eActive, eFb, eTarget, genEmoji]);

  useEffect(() => {
    if (!eActive) return;
    const t = setInterval(() => setETime(p => (p <= 1 ? 0 : p - 1)), 1000);
    return () => clearInterval(t);
  }, [eActive]);

  useEffect(() => {
    if (!eActive || eTime !== 0) return;
    const tid = setTimeout(() => {
      setEActive(false);
      setStats(s => ({
        ...s,
        zenBestTime: s.zenBestTime === null ? eScore : Math.max(s.zenBestTime, eScore),
      }));
    }, 0);
    return () => clearTimeout(tid);
  }, [eActive, eTime, eScore]);

  // ─── Universal back ───────────────────────────────────────────────────────
  const goBack = useCallback(() => {
    clearR();
    tIDs.current.forEach(clearTimeout);
    tIDs.current = [];
    setSActive(false);
    setTPhase('idle');
    setRPhase('idle');
    setEActive(false);
    setSelected(null);
  }, [clearR]);

  // ─── Game card metadata ───────────────────────────────────────────────────
  const GAMES = [
    {
      id: 'stroop'   as GameType,
      title: 'Stroop Challenge',
      desc: 'A color word appears in colored ink. Tap MATCH if they agree, NO MATCH if they differ.',
      Icon: Eye,
      grad: 'from-pink-500 to-rose-600',
      bg:   'from-pink-500/10 to-rose-500/10',
      bdr:  'border-pink-500/30',
      tags: ['Focus', '30 sec', 'Match / No Match'],
      stat: `Best: ${stats.bubbleBestScore} pts`,
    },
    {
      id: 'tiles'    as GameType,
      title: 'Memory Tiles',
      desc: 'Tiles light up in a sequence — remember and tap them back in the same order!',
      Icon: Grid3X3,
      grad: 'from-blue-500 to-cyan-600',
      bg:   'from-blue-500/10 to-cyan-500/10',
      bdr:  'border-blue-500/30',
      tags: ['Memory', 'Endless levels', 'Tap to recall'],
      stat: `Best Level: ${stats.memoryBestLevel}`,
    },
    {
      id: 'reaction' as GameType,
      title: 'Reaction Speed',
      desc: 'The circle turns red (wait) then green — tap as fast as you can! 5 rounds.',
      Icon: Zap,
      grad: 'from-yellow-400 to-orange-500',
      bg:   'from-yellow-500/10 to-orange-500/10',
      bdr:  'border-yellow-500/30',
      tags: ['Reflexes', '5 rounds', 'Speed test'],
      stat: stats.reflexBestReaction ? `Best: ${stats.reflexBestReaction} ms` : 'Not played yet',
    },
    {
      id: 'emoji'    as GameType,
      title: 'Emoji Match',
      desc: 'A target emoji appears at the top — spot it in the grid and tap it before time runs out!',
      Icon: Smile,
      grad: 'from-purple-500 to-indigo-600',
      bg:   'from-purple-500/10 to-indigo-500/10',
      bdr:  'border-purple-500/30',
      tags: ['Speed', '45 sec', 'Find and tap'],
      stat: `Best: ${stats.zenBestTime ?? 0} pts`,
    },
  ];

  const cardBase = 'rounded-3xl p-8 bg-gradient-to-b from-slate-800/80 to-slate-900/80 border border-white/10';
  const backBtn  = 'flex items-center gap-2 px-6 py-3 bg-white/10 rounded-xl text-white border border-white/20 font-semibold';

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
        <div className="p-5 sm:p-8 md:p-10">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            {selected ? (
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={goBack}
                className="flex items-center gap-2 px-5 py-2.5 bg-white/10 rounded-xl text-white border border-white/20 text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Games
              </motion.button>
            ) : (
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-white mb-1">Mood Games</p>
                <p className="text-gray-400 text-sm">Play to focus, relax and recharge</p>
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">

            {/* ───────────────── GAME SELECTION ───────────────── */}
            {!selected && (
              <motion.div
                key="sel"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-5 max-w-4xl mx-auto"
              >
                {GAMES.map(g => (
                  <motion.button
                    key={String(g.id)}
                    whileHover={{ scale: 1.02, y: -4 }} whileTap={{ scale: 0.98 }}
                    onClick={() => setSelected(g.id)}
                    className={`p-6 rounded-3xl text-left bg-gradient-to-br ${g.bg} border ${g.bdr}`}
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${g.grad} flex items-center justify-center mb-4 shadow-lg`}>
                      <g.Icon className="w-7 h-7 text-white" />
                    </div>
                    <p className="text-xl font-bold text-white mb-2">{g.title}</p>
                    <p className="text-gray-300 text-sm mb-4 leading-relaxed">{g.desc}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {g.tags.map(t => (
                        <span key={t} className="px-2.5 py-1 bg-white/10 text-gray-300 rounded-full text-xs">{t}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{g.stat}</span>
                      <div className={`flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r ${g.grad} text-white text-sm font-semibold`}>
                        <Play className="w-4 h-4" /> Play
                      </div>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}

            {/* ───────────────── STROOP ───────────────── */}
            {selected === 'stroop' && (
              <motion.div
                key="stroop"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="max-w-lg mx-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2 border border-white/20">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <span className="text-xl font-bold text-white">{sScore}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2 border border-white/20">
                    <Star className="w-5 h-5 text-orange-400" />
                    <span className="text-sm text-white">Streak <span className="font-bold text-lg">{sStreak}</span></span>
                  </div>
                  <div className={`flex items-center gap-2 rounded-xl px-4 py-2 border ${sTime <= 10 ? 'bg-red-500/20 border-red-500/40' : 'bg-white/10 border-white/20'}`}>
                    <Timer className="w-5 h-5 text-cyan-400" />
                    <span className="text-xl font-bold text-white">{sTime}s</span>
                  </div>
                </div>

                <div className={`${cardBase} flex flex-col items-center justify-center min-h-[380px] transition-all ${sFb === 'correct' ? 'ring-4 ring-green-500' : sFb === 'wrong' ? 'ring-4 ring-red-500' : ''}`}>
                  {!sActive && sTime === 30 && (
                    <div className="text-center">
                      <Eye className="w-16 h-16 text-pink-400 mx-auto mb-4" />
                      <p className="text-2xl font-bold text-white mb-2">Stroop Challenge</p>
                      <p className="text-gray-400 mb-8 text-sm leading-relaxed">
                        A color word appears in colored ink.<br />
                        Tap <strong className="text-green-400">MATCH</strong> if the ink matches the word,{' '}
                        <strong className="text-red-400">NO MATCH</strong> if not.
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={startStroop}
                        className="px-10 py-3.5 bg-gradient-to-r from-pink-500 to-rose-600 rounded-2xl text-white font-bold flex items-center gap-2 mx-auto"
                      >
                        <Play className="w-5 h-5" /> Start
                      </motion.button>
                    </div>
                  )}

                  {sActive && (
                    <>
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={sItem.word + sItem.hex}
                          initial={{ opacity: 0, scale: 0.7 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.7 }}
                          className="text-7xl font-black mb-12 select-none"
                          style={{ color: sItem.hex }}
                        >
                          {sItem.word}
                        </motion.p>
                      </AnimatePresence>
                      <div className="flex gap-4 w-full">
                        <motion.button
                          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          onClick={() => answerStroop(true)}
                          className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl text-white font-bold text-lg flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 className="w-6 h-6" /> MATCH
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          onClick={() => answerStroop(false)}
                          className="flex-1 py-4 bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl text-white font-bold text-lg flex items-center justify-center gap-2"
                        >
                          <XCircle className="w-6 h-6" /> NO MATCH
                        </motion.button>
                      </div>
                    </>
                  )}

                  {!sActive && sTime === 0 && (
                    <div className="text-center">
                      <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                      <p className="text-3xl font-bold text-white mb-1">Time&apos;s Up!</p>
                      <p className="text-5xl font-black text-yellow-400 mb-2">{sScore} pts</p>
                      <p className="text-gray-400 mb-1">Best streak: <span className="text-white font-bold">{sBest}</span></p>
                      <p className="text-xs text-gray-500 mb-8">All-time best: {stats.bubbleBestScore} pts</p>
                      <div className="flex gap-3 justify-center">
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={goBack} className={backBtn}>
                          <ArrowLeft className="w-4 h-4" /> Back
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          onClick={startStroop}
                          className="px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl text-white font-bold flex items-center gap-2"
                        >
                          <RotateCcw className="w-4 h-4" /> Play Again
                        </motion.button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ───────────────── TILES ───────────────── */}
            {selected === 'tiles' && (
              <motion.div
                key="tiles"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="max-w-lg mx-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2 border border-white/20">
                    <Brain className="w-5 h-5 text-blue-400" />
                    <span className="text-sm text-white">Level <span className="font-bold text-xl">{tLevel}</span></span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2 border border-white/20">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <span className="text-xl font-bold text-white">{tScore}</span>
                  </div>
                </div>

                <div className={`${cardBase} transition-all ${tFb === 'correct' ? 'ring-4 ring-green-500' : tFb === 'wrong' ? 'ring-4 ring-red-500' : ''}`}>
                  {tPhase === 'idle' && !tFb && (
                    <div className="text-center py-8">
                      <Grid3X3 className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                      <p className="text-2xl font-bold text-white mb-2">Memory Tiles</p>
                      <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                        Tiles light up one by one.<br />Remember the sequence and tap them back in order!
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={startTiles}
                        className="px-10 py-3.5 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl text-white font-bold flex items-center gap-2 mx-auto"
                      >
                        <Play className="w-5 h-5" /> Start
                      </motion.button>
                    </div>
                  )}

                  {tPhase !== 'idle' && (
                    <>
                      <p className="text-center text-sm text-gray-400 mb-5 min-h-[20px]">
                        {tFb === 'correct' && '✅ Correct! Next level coming up…'}
                        {tFb === 'wrong'   && '❌ Wrong order! Green tiles show the target.'}
                        {!tFb && tPhase === 'showing' && '👀 Watch the tiles…'}
                        {!tFb && tPhase === 'input'   && '👆 Now tap them back in the same order!'}
                      </p>
                      <div className="grid grid-cols-3 gap-3 mb-6">
                        {Array.from({ length: TILE_COUNT }, (_, i) => {
                          const isLit      = tLit === i;
                          const isSelected = tPlayer.includes(i);
                          const isTarget   = tFb === 'wrong' && tTarget.includes(i);
                          return (
                            <motion.button key={i}
                              whileTap={{ scale: 0.92 }}
                              onClick={() => tapTile(i)}
                              disabled={tPhase !== 'input'}
                              className={`aspect-square rounded-2xl transition-all duration-200 ${
                                isLit      ? 'bg-gradient-to-br from-blue-400 to-cyan-400 shadow-lg shadow-blue-500/50 scale-105' :
                                isSelected ? 'bg-gradient-to-br from-blue-600 to-indigo-700' :
                                isTarget   ? 'bg-gradient-to-br from-green-500 to-emerald-500' :
                                'bg-white/10 border border-white/20 hover:bg-white/20'
                              }`}
                            />
                          );
                        })}
                      </div>
                    </>
                  )}

                  {tPhase === 'done' && (
                    <div className="text-center mt-2">
                      <p className="text-2xl font-bold text-white mb-1">Game Over!</p>
                      <p className="text-5xl font-black text-yellow-400 mb-2">{tScore} pts</p>
                      <p className="text-gray-400 mb-1">Level reached: <span className="text-white font-bold">{tLevel}</span></p>
                      <p className="text-xs text-gray-500 mb-6">All-time best: Level {stats.memoryBestLevel}</p>
                      <div className="flex gap-3 justify-center">
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={goBack} className={backBtn}>
                          <ArrowLeft className="w-4 h-4" /> Back
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          onClick={startTiles}
                          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl text-white font-bold flex items-center gap-2"
                        >
                          <RotateCcw className="w-4 h-4" /> Play Again
                        </motion.button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ───────────────── REACTION ───────────────── */}
            {selected === 'reaction' && (
              <motion.div
                key="reaction"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="max-w-lg mx-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2 border border-white/20">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm text-white">
                      Round{' '}
                      <span className="font-bold text-xl">
                        {Math.min(rResults.length + (rPhase === 'done' ? 0 : 1), REACTION_ROUNDS)}/{REACTION_ROUNDS}
                      </span>
                    </span>
                  </div>
                  {rResults.length > 0 && (
                    <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2 border border-white/20">
                      <Timer className="w-5 h-5 text-orange-400" />
                      <span className="text-sm text-white">Avg <span className="font-bold">{avgArr(rResults)} ms</span></span>
                    </div>
                  )}
                </div>

                <div className={`${cardBase} flex flex-col items-center min-h-[440px] justify-center`}>
                  {rPhase === 'idle' && (
                    <div className="text-center">
                      <Zap className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                      <p className="text-2xl font-bold text-white mb-2">Reaction Speed</p>
                      <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                        Circle turns <span className="text-red-400 font-bold">RED</span> — wait.<br />
                        Circle turns <span className="text-green-400 font-bold">GREEN</span> — tap as fast as you can!<br />
                        {REACTION_ROUNDS} rounds total.
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={startReaction}
                        className="px-10 py-3.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl text-white font-bold flex items-center gap-2 mx-auto"
                      >
                        <Play className="w-5 h-5" /> Start
                      </motion.button>
                    </div>
                  )}

                  {(rPhase === 'waiting' || rPhase === 'go' || rPhase === 'result' || rPhase === 'toosoon') && (
                    <>
                      <motion.button
                        onClick={tapReaction}
                        animate={rPhase === 'go' ? { scale: [1, 1.06, 1] } : { scale: 1 }}
                        transition={{ repeat: rPhase === 'go' ? Infinity : 0, duration: 0.6 }}
                        className={`w-52 h-52 rounded-full font-bold text-2xl text-white shadow-2xl select-none transition-colors duration-200 ${
                          rPhase === 'go'      ? 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-green-500/50' :
                          rPhase === 'toosoon' ? 'bg-gradient-to-br from-orange-400 to-red-500' :
                          rPhase === 'result'  ? 'bg-gradient-to-br from-blue-500 to-indigo-600' :
                          'bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/30'
                        }`}
                      >
                        {rPhase === 'waiting' && 'WAIT…'}
                        {rPhase === 'go'      && 'TAP!'}
                        {rPhase === 'toosoon' && 'Too soon!'}
                        {rPhase === 'result'  && rCurrent !== null && `${rCurrent} ms`}
                      </motion.button>
                      {rResults.length > 0 && (
                        <div className="flex gap-2 mt-8 flex-wrap justify-center">
                          {rResults.map((r, i) => (
                            <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-sm text-white">{r} ms</span>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {rPhase === 'done' && (
                    <div className="text-center">
                      <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                      <p className="text-3xl font-bold text-white mb-1">Done!</p>
                      <p className="text-xl text-gray-300 mb-1">
                        Avg: <span className="text-white font-bold text-3xl">{avgArr(rResults)} ms</span>
                      </p>
                      <p className="text-gray-400 mb-1">
                        Best this game: <span className="text-white font-bold">{Math.min(...rResults)} ms</span>
                      </p>
                      <p className="text-xs text-gray-500 mb-6">All-time best: {stats.reflexBestReaction ?? '–'} ms</p>
                      <div className="flex flex-wrap gap-2 justify-center mb-6">
                        {rResults.map((r, i) => (
                          <span
                            key={i}
                            className={`px-3 py-1 rounded-full text-sm font-medium ${r === Math.min(...rResults) ? 'bg-green-500/20 text-green-300' : 'bg-white/10 text-gray-300'}`}
                          >
                            R{i + 1}: {r} ms
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-3 justify-center">
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={goBack} className={backBtn}>
                          <ArrowLeft className="w-4 h-4" /> Back
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          onClick={startReaction}
                          className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl text-white font-bold flex items-center gap-2"
                        >
                          <RotateCcw className="w-4 h-4" /> Play Again
                        </motion.button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ───────────────── EMOJI ───────────────── */}
            {selected === 'emoji' && (
              <motion.div
                key="emoji"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="max-w-lg mx-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2 border border-white/20">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <span className="text-xl font-bold text-white">{eScore} pts</span>
                  </div>
                  <div className={`flex items-center gap-2 rounded-xl px-4 py-2 border ${eTime <= 10 ? 'bg-red-500/20 border-red-500/40' : 'bg-white/10 border-white/20'}`}>
                    <Timer className="w-5 h-5 text-cyan-400" />
                    <span className="text-xl font-bold text-white">{eTime}s</span>
                  </div>
                </div>

                <div className={`${cardBase} transition-all ${eFb === 'correct' ? 'ring-4 ring-green-500' : eFb === 'wrong' ? 'ring-4 ring-red-500' : ''}`}>
                  {!eActive && eTime === 45 && (
                    <div className="text-center py-8">
                      <Smile className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                      <p className="text-2xl font-bold text-white mb-2">Emoji Match</p>
                      <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                        A target emoji appears at the top.<br />Find and tap it in the grid as fast as you can!
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={startEmoji}
                        className="px-10 py-3.5 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl text-white font-bold flex items-center gap-2 mx-auto"
                      >
                        <Play className="w-5 h-5" /> Start
                      </motion.button>
                    </div>
                  )}

                  {eActive && (
                    <>
                      <p className="text-center text-xs text-gray-500 mb-2 uppercase tracking-widest">Find this emoji</p>
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={eTarget}
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.5, opacity: 0 }}
                          className="text-8xl text-center mb-8 select-none"
                        >
                          {eTarget}
                        </motion.p>
                      </AnimatePresence>
                      <div className="grid grid-cols-3 gap-3">
                        {eOptions.map((e, i) => (
                          <motion.button
                            key={`${eTarget}-${i}`}
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.92 }}
                            onClick={() => tapEmoji(e)}
                            className="text-5xl py-4 rounded-2xl bg-white/10 border border-white/20 hover:bg-white/20 transition-colors"
                          >
                            {e}
                          </motion.button>
                        ))}
                      </div>
                    </>
                  )}

                  {!eActive && eTime === 0 && (
                    <div className="text-center py-4">
                      <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                      <p className="text-3xl font-bold text-white mb-1">Time&apos;s Up!</p>
                      <p className="text-5xl font-black text-yellow-400 mb-2">{eScore} pts</p>
                      <p className="text-xs text-gray-500 mb-8">All-time best: {stats.zenBestTime ?? 0} pts</p>
                      <div className="flex gap-3 justify-center">
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={goBack} className={backBtn}>
                          <ArrowLeft className="w-4 h-4" /> Back
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          onClick={startEmoji}
                          className="px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl text-white font-bold flex items-center gap-2"
                        >
                          <RotateCcw className="w-4 h-4" /> Play Again
                        </motion.button>
                      </div>
                    </div>
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
