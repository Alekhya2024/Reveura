'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function StressFreeAnimation() {
  const [animationPhase, setAnimationPhase] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Premium gradient background with animated elements
  const GradientBackground = () => (
    <>
      {/* Primary gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-500 to-pink-600" />
      
      {/* Animated glassmorphic overlay */}
      <motion.div
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 opacity-40"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.1) 100%)",
          backgroundSize: "200% 200%",
        }}
      />

      {/* Animated grid pattern */}
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(0deg, rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Blob shapes for premium feel */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-2 right-4 w-20 h-20 bg-blue-400 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute bottom-0 left-0 w-24 h-24 bg-pink-400 rounded-full blur-3xl"
      />
    </>
  );

  // Exercise activity with advanced animations
  const ExerciseActivity = () => (
    <motion.div
      key="exercise"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.6 }}
      className="absolute inset-0 flex flex-col items-center justify-center gap-1"
    >
      {/* Main character with advanced motion */}
      <motion.div
        animate={{
          rotateZ: [0, -12, 0],
          y: [0, -6, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatDelay: 0.3,
          ease: "easeInOut",
        }}
        className="text-6xl filter drop-shadow-lg"
      >
        💪
      </motion.div>

      {/* Particle effects - sweat drops with physics */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={`sweat-${i}`}
          animate={{
            y: [0, 12],
            opacity: [1, 0],
            x: Math.sin(i) * 8,
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeIn",
          }}
          className="absolute text-base"
        >
          💧
        </motion.div>
      ))}

      {/* Energy rings */}
      {[0, 1].map((i) => (
        <motion.div
          key={`ring-${i}`}
          animate={{
            scale: [0.8, 1.4],
            opacity: [1, 0],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeOut",
          }}
          className="absolute w-16 h-16 border-2 border-yellow-300 rounded-full"
        />
      ))}
    </motion.div>
  );

  // Running activity with smooth flowing motion
  const RunningActivity = () => (
    <motion.div
      key="running"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.6 }}
      className="absolute inset-0 flex flex-col items-center justify-center"
    >
      {/* Running figure with complex motion path */}
      <motion.div
        animate={{
          x: [-16, 16, -16],
          rotateZ: [0, 8, -8, 0],
          y: [0, -2, 0],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="text-6xl filter drop-shadow-lg"
      >
        🏃
      </motion.div>

      {/* Speed lines with trail effect */}
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={`speed-${i}`}
          animate={{
            x: [-12, 12, -12],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
          className="absolute text-lg"
        >
          💨
        </motion.div>
      ))}

      {/* Motion blur effect */}
      <motion.div
        animate={{
          scaleX: [0.8, 1.2, 0.8],
          opacity: [0, 0.3, 0],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute w-20 h-8 bg-gradient-to-r from-transparent via-yellow-300 to-transparent blur-lg"
      />
    </motion.div>
  );

  // Reading activity with knowledge aura
  const ReadingActivity = () => (
    <motion.div
      key="reading"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.6 }}
      className="absolute inset-0 flex flex-col items-center justify-center"
    >
      {/* Book with 3D-like tilt */}
      <motion.div
        animate={{
          rotateX: [0, 12, 0],
          y: [0, -3, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="text-6xl filter drop-shadow-lg perspective"
        style={{ transformStyle: "preserve-3d" }}
      >
        📚
      </motion.div>

      {/* Knowledge sparkles - particles emitting from book */}
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={`spark-${i}`}
          initial={{
            x: 0,
            y: 0,
            scale: 1,
          }}
          animate={{
            x: Math.cos((i / 5) * Math.PI * 2) * 30,
            y: Math.sin((i / 5) * Math.PI * 2) * 30 - 20,
            scale: [1, 0],
            opacity: [1, 0],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeOut",
          }}
          className="absolute text-xl"
        >
          ✨
        </motion.div>
      ))}

      {/* Light bulb idea with glow */}
      <motion.div
        animate={{
          scale: [0, 1, 0.9],
          opacity: [0, 1, 0],
          rotate: [0, 10, -5, 0],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          delay: 0.8,
          ease: "easeInOut",
        }}
        className="absolute top-1 right-5 text-3xl filter drop-shadow-lg"
      >
        💡
      </motion.div>

      {/* Glow effect for light bulb */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          delay: 0.8,
          ease: "easeInOut",
        }}
        className="absolute top-1 right-5 w-12 h-12 bg-yellow-300 rounded-full blur-xl"
      />
    </motion.div>
  );

  // Activity selector
  const getActivity = () => {
    switch (animationPhase) {
      case 0:
        return <ExerciseActivity />;
      case 1:
        return <RunningActivity />;
      case 2:
        return <ReadingActivity />;
      default:
        return <ExerciseActivity />;
    }
  };

  // Activity indicators
  const ActivityIndicator = ({ index }: { index: number }) => (
    <motion.div
      animate={{
        scale: animationPhase === index ? 1.3 : 0.9,
        boxShadow: animationPhase === index ? "0 0 12px rgba(250, 204, 21, 0.6)" : "none",
      }}
      transition={{ ease: "easeInOut" }}
      className={`w-2.5 h-2.5 rounded-full transition-all ${
        animationPhase === index ? "bg-yellow-300" : "bg-white/50"
      }`}
    />
  );

  // Get activity-specific text
  const getActivityText = () => {
    switch (animationPhase) {
      case 0:
        return "💪 Get Strong!";
      case 1:
        return "🏃 Keep Moving!";
      case 2:
        return "📚 Grow Your Mind!";
      default:
        return "Stay Active & Healthy!";
    }
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      className="relative w-full h-32 rounded-2xl overflow-hidden border-2 border-yellow-400/60 shadow-2xl cursor-pointer"
      whileHover={{ scale: 1.02 }}
      transition={{ ease: "easeInOut" }}
    >
      {/* Background */}
      <GradientBackground />

      {/* Floating stars with parallax effect */}
      <motion.div
        animate={{ y: [0, -8, 0], x: [0, 4, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-2 left-3 text-2xl z-10 filter drop-shadow-lg"
      >
        ⭐
      </motion.div>

      {/* Floating sparkles with stagger */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={`sparkle-${i}`}
          animate={{
            opacity: [0.3, 1, 0.3],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: i * 0.3,
          }}
          className="absolute top-3 right-8 text-lg z-10"
          style={{ right: `${12 + i * 12}px` }}
        >
          ✨
        </motion.div>
      ))}

      {/* Main animation area */}
      <div className="relative w-full h-24 flex items-center justify-center z-20">
        {getActivity()}
      </div>

      {/* Text with glow effect */}
      <motion.div
        key={`text-${animationPhase}`}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="absolute bottom-8 left-0 right-0 text-center z-30"
      >
        <p className="text-sm font-black text-white drop-shadow-lg filter brightness-110">
          {getActivityText()}
        </p>
      </motion.div>

      {/* Activity indicator dots with glow */}
      <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-3 z-30">
        <ActivityIndicator index={0} />
        <ActivityIndicator index={1} />
        <ActivityIndicator index={2} />
      </div>

      {/* Premium shine effect on hover */}
      <motion.div
        initial={{ opacity: 0, x: "-100%" }}
        whileHover={{ opacity: 1, x: "100%" }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent z-25 pointer-events-none"
      />
    </motion.div>
  );
}



