'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface FloatingImagesProps {
  images?: string[];
}

export default function FloatingImages({ images = ['1.5.jpg', '2.5.jpg', '3.5.jpg'] }: FloatingImagesProps) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Top Left */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 rounded-full opacity-10 overflow-hidden"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Image
          src={`/${images[0]}`}
          alt="Floating decoration"
          fill
          className="object-cover blur-sm"
        />
      </motion.div>

      {/* Top Right */}
      <motion.div
        className="absolute top-40 right-20 w-48 h-48 rounded-full opacity-10 overflow-hidden"
        animate={{
          y: [0, 30, 0],
          rotate: [0, -10, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <Image
          src={`/${images[1]}`}
          alt="Floating decoration"
          fill
          className="object-cover blur-sm"
        />
      </motion.div>

      {/* Bottom Left */}
      <motion.div
        className="absolute bottom-40 left-40 w-40 h-40 rounded-full opacity-10 overflow-hidden"
        animate={{
          y: [0, -25, 0],
          rotate: [0, 8, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      >
        <Image
          src={`/${images[2]}`}
          alt="Floating decoration"
          fill
          className="object-cover blur-sm"
        />
      </motion.div>

      {/* Bottom Right */}
      <motion.div
        className="absolute bottom-20 right-40 w-36 h-36 rounded-full opacity-10 overflow-hidden"
        animate={{
          y: [0, 20, 0],
          rotate: [0, -6, 0],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      >
        <Image
          src="/1.6.jpg"
          alt="Floating decoration"
          fill
          className="object-cover blur-sm"
        />
      </motion.div>

      {/* Center subtle background */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-5 overflow-hidden"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 360],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <Image
          src="/2.6.jpg"
          alt="Background decoration"
          fill
          className="object-cover blur-3xl"
        />
      </motion.div>
    </div>
  );
}
