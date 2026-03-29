'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function TypographyShowcase() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black p-12">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="page-title text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Reveura Typography System
          </h1>
          <p className="text-neutral-400" style={{ fontFamily: "var(--font-body)" }}>
            A carefully curated, mood-optimized typography system for wellness excellence
          </p>
        </motion.div>

        {/* Display Fonts */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="space-y-8">
          <h2 className="section-title text-white" style={{ fontFamily: "var(--font-heading)" }}>
            Display Fonts - Playfair Display
          </h2>
          <div className="space-y-6">
            <div className="bg-neutral-900/50 border border-red-900/30 rounded-2xl p-8">
              <div className="text-3xl font-bold text-red-500 mb-2" style={{ fontFamily: "var(--font-display)" }}>
                Display Large - 3.5rem
              </div>
              <p className="text-neutral-500">Perfect for main page titles and hero sections</p>
            </div>
            <div className="bg-neutral-900/50 border border-red-900/30 rounded-2xl p-8">
              <div className="text-3xl font-bold text-neutral-300 mb-2" style={{ fontFamily: "var(--font-display)", fontSize: "2.8rem" }}>
                Display Medium - 2.8rem
              </div>
              <p className="text-neutral-500">Great for section headers and premium content</p>
            </div>
            <div className="bg-neutral-900/50 border border-red-900/30 rounded-2xl p-8">
              <div className="text-2xl font-bold text-neutral-400 mb-2" style={{ fontFamily: "var(--font-display)", fontSize: "2.2rem" }}>
                Display Small - 2.2rem
              </div>
              <p className="text-neutral-500">Subtle yet impactful for secondary titles</p>
            </div>
          </div>
        </motion.section>

        {/* Heading Fonts */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="space-y-8">
          <h2 className="section-title text-white" style={{ fontFamily: "var(--font-heading)" }}>
            Heading Fonts - Sora (Modern, Clean)
          </h2>
          <div className="space-y-6">
            <div className="bg-neutral-900/50 border border-blue-900/30 rounded-2xl p-8">
              <div className="text-2xl font-bold text-blue-400 mb-2" style={{ fontFamily: "var(--font-heading)", fontSize: "1.875rem" }}>
                Heading Large - 1.875rem (30px)
              </div>
              <p className="text-neutral-500">Primary section headings throughout the app</p>
            </div>
            <div className="bg-neutral-900/50 border border-blue-900/30 rounded-2xl p-8">
              <div className="text-xl font-bold text-blue-300 mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                Heading Medium - 1.5rem (24px)
              </div>
              <p className="text-neutral-500">Card titles and feature headings</p>
            </div>
            <div className="bg-neutral-900/50 border border-blue-900/30 rounded-2xl p-8">
              <div className="text-lg font-bold text-blue-200 mb-2" style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem" }}>
                Heading Small - 1.25rem (20px)
              </div>
              <p className="text-neutral-500">Secondary section titles</p>
            </div>
          </div>
        </motion.section>

        {/* Subheading Fonts */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="space-y-8">
          <h2 className="section-title text-white" style={{ fontFamily: "var(--font-heading)" }}>
            Subheading Fonts - DM Sans (Friendly, Clear)
          </h2>
          <div className="space-y-6">
            <div className="bg-neutral-900/50 border border-green-900/30 rounded-2xl p-8">
              <div className="text-lg font-semibold text-green-400 mb-2" style={{ fontFamily: "var(--font-subheading)", fontSize: "1.125rem" }}>
                Subheading Large - 1.125rem (18px)
              </div>
              <p className="text-neutral-500">Form labels and secondary headers</p>
            </div>
            <div className="bg-neutral-900/50 border border-green-900/30 rounded-2xl p-8">
              <div className="text-base font-semibold text-green-300 mb-2" style={{ fontFamily: "var(--font-subheading)" }}>
                Subheading Medium - 1rem (16px)
              </div>
              <p className="text-neutral-500">Card subtitles and emphasis text</p>
            </div>
          </div>
        </motion.section>

        {/* Body Fonts */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="space-y-8">
          <h2 className="section-title text-white" style={{ fontFamily: "var(--font-heading)" }}>
            Body Fonts - Outfit (Warm, Readable)
          </h2>
          <div className="space-y-6">
            <div className="bg-neutral-900/50 border border-purple-900/30 rounded-2xl p-8">
              <div className="text-base font-normal text-purple-300 mb-2 leading-relaxed" style={{ fontFamily: "var(--font-body)", fontSize: "1.0625rem" }}>
                Body Large - 1.0625rem (17px)
              </div>
              <p className="text-neutral-500">Primary body text for readability</p>
            </div>
            <div className="bg-neutral-900/50 border border-purple-900/30 rounded-2xl p-8">
              <div className="text-sm font-normal text-purple-300 mb-2 leading-normal" style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem" }}>
                Body Medium - 0.95rem (15.2px)
              </div>
              <p className="text-neutral-500">Standard body text and descriptions</p>
            </div>
            <div className="bg-neutral-900/50 border border-purple-900/30 rounded-2xl p-8">
              <div className="text-xs font-normal text-purple-300 mb-2" style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem" }}>
                Body Small - 0.875rem (14px)
              </div>
              <p className="text-neutral-500">Secondary text and helper text</p>
            </div>
            <div className="bg-neutral-900/50 border border-purple-900/30 rounded-2xl p-8">
              <div className="text-xs font-normal text-purple-300 mb-2" style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem" }}>
                Body XS - 0.75rem (12px)
              </div>
              <p className="text-neutral-500">Fine print and metadata</p>
            </div>
          </div>
        </motion.section>

        {/* Accent Fonts */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="space-y-8">
          <h2 className="section-title text-white" style={{ fontFamily: "var(--font-heading)" }}>
            Accent Fonts - Poppins (Energetic)
          </h2>
          <div className="space-y-6">
            <div className="bg-neutral-900/50 border border-yellow-900/30 rounded-2xl p-8">
              <div className="text-base font-bold text-yellow-400 mb-2 tracking-wider" style={{ fontFamily: "var(--font-accent)" }}>
                CTA Button Text - Bold + Wide Spacing
              </div>
              <p className="text-neutral-500">Perfect for call-to-action buttons</p>
            </div>
            <div className="bg-neutral-900/50 border border-yellow-900/30 rounded-2xl p-8">
              <div className="text-xs font-bold text-yellow-400 mb-2 tracking-wider uppercase" style={{ fontFamily: "var(--font-accent)" }}>
                Badge Label - Small Caps
              </div>
              <p className="text-neutral-500">Used for badges and tags</p>
            </div>
          </div>
        </motion.section>

        {/* Line Heights */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="space-y-8">
          <h2 className="section-title text-white" style={{ fontFamily: "var(--font-heading)" }}>
            Line Heights (Readability Optimized)
          </h2>
          <div className="space-y-6">
            <div className="bg-neutral-900/50 border border-red-900/30 rounded-2xl p-8">
              <div className="text-neutral-300 mb-4" style={{ fontFamily: "var(--font-body)", lineHeight: "var(--leading-tight)" }}>
                Tight (1.2): Headlines use this tight spacing for impact. It creates visual hierarchy.
              </div>
              <p className="text-xs text-neutral-500">var(--leading-tight)</p>
            </div>
            <div className="bg-neutral-900/50 border border-red-900/30 rounded-2xl p-8">
              <div className="text-neutral-300 mb-4" style={{ fontFamily: "var(--font-body)", lineHeight: "var(--leading-snug)" }}>
                Snug (1.4): Subheadings and labels benefit from this balanced spacing. It provides clarity.
              </div>
              <p className="text-xs text-neutral-500">var(--leading-snug)</p>
            </div>
            <div className="bg-neutral-900/50 border border-red-900/30 rounded-2xl p-8">
              <div className="text-neutral-300 mb-4" style={{ fontFamily: "var(--font-body)", lineHeight: "var(--leading-normal)" }}>
                Normal (1.6): Body text uses this standard spacing for comfortable reading. It balances density with clarity perfectly.
              </div>
              <p className="text-xs text-neutral-500">var(--leading-normal)</p>
            </div>
            <div className="bg-neutral-900/50 border border-red-900/30 rounded-2xl p-8">
              <div className="text-neutral-300 mb-4" style={{ fontFamily: "var(--font-body)", lineHeight: "var(--leading-relaxed)" }}>
                Relaxed (1.75): Long-form content and wellness advice uses generous spacing. It feels calm and easy to read through longer passages of text.
              </div>
              <p className="text-xs text-neutral-500">var(--leading-relaxed)</p>
            </div>
          </div>
        </motion.section>

        {/* Mood Psychology */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="space-y-8">
          <h2 className="section-title text-white" style={{ fontFamily: "var(--font-heading)" }}>
            Mood Psychology
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-red-900/20 to-red-950/20 border border-red-900/30 rounded-2xl p-6">
              <h3 className="text-red-400 font-bold mb-2" style={{ fontFamily: "var(--font-heading)" }}>Playfair Display</h3>
              <p className="text-neutral-300 text-sm" style={{ fontFamily: "var(--font-body)" }}>Creates premium, sophisticated feel - builds trust and confidence</p>
            </div>
            <div className="bg-gradient-to-br from-blue-900/20 to-blue-950/20 border border-blue-900/30 rounded-2xl p-6">
              <h3 className="text-blue-400 font-bold mb-2" style={{ fontFamily: "var(--font-heading)" }}>Sora</h3>
              <p className="text-neutral-300 text-sm" style={{ fontFamily: "var(--font-body)" }}>Modern and clean - reduces cognitive load and stress</p>
            </div>
            <div className="bg-gradient-to-br from-green-900/20 to-green-950/20 border border-green-900/30 rounded-2xl p-6">
              <h3 className="text-green-400 font-bold mb-2" style={{ fontFamily: "var(--font-heading)" }}>DM Sans</h3>
              <p className="text-neutral-300 text-sm" style={{ fontFamily: "var(--font-body)" }}>Clear and friendly - builds understanding and connection</p>
            </div>
            <div className="bg-gradient-to-br from-purple-900/20 to-purple-950/20 border border-purple-900/30 rounded-2xl p-6">
              <h3 className="text-purple-400 font-bold mb-2" style={{ fontFamily: "var(--font-heading)" }}>Outfit</h3>
              <p className="text-neutral-300 text-sm" style={{ fontFamily: "var(--font-body)" }}>Warm and approachable - creates comfort and belonging</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-900/20 to-yellow-950/20 border border-yellow-900/30 rounded-2xl p-6">
              <h3 className="text-yellow-400 font-bold mb-2" style={{ fontFamily: "var(--font-heading)" }}>Poppins</h3>
              <p className="text-neutral-300 text-sm" style={{ fontFamily: "var(--font-body)" }}>Energetic and motivating - encourages action and engagement</p>
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
}
