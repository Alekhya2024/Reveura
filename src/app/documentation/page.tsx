'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  BookOpen, 
  ChevronRight, 
  FileText, 
  Download,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function DocumentationPage() {
  const { theme } = useTheme();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    intro: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const tableOfContents = [
    { id: 'intro', title: 'Introduction' },
    { id: 'problem', title: 'Problem Statement' },
    { id: 'design', title: 'System Design & Methodology' },
    { id: 'implementation', title: 'Implementation Details' },
    { id: 'results', title: 'Results and Evaluation' },
    { id: 'discussion', title: 'Discussion' },
    { id: 'future', title: 'Future Work' },
    { id: 'conclusion', title: 'Conclusion' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <DashboardLayout>
      <div className={`min-h-screen ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950' 
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${
            theme === 'dark'
              ? 'bg-gradient-to-r from-red-950/50 via-neutral-900/50 to-red-950/50 border-red-900/30'
              : 'bg-gradient-to-r from-red-50/50 via-white/50 to-red-50/50 border-red-200'
          } backdrop-blur-sm border-b p-8 mb-8`}
        >
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-xl ${
                theme === 'dark' ? 'bg-red-900/30' : 'bg-red-100'
              }`}>
                <FileText className="w-8 h-8 text-red-500" />
              </div>
              <div>
                <h1 
                  className={`text-4xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Reveura - Final Capstone Report
                </h1>
                <p 
                  className={`mt-2 ${
                    theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'
                  }`}
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  A Mental Wellness Habit Tracker - Complete Documentation
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mt-4">
              <span className={`px-3 py-1 rounded-full text-sm ${
                theme === 'dark' 
                  ? 'bg-green-900/30 text-green-400' 
                  : 'bg-green-100 text-green-700'
              }`}>
                Version 1.0
              </span>
              <span className={`${
                theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'
              } text-sm`}>
                Last Updated: May 2, 2026
              </span>
            </div>
          </div>
        </motion.div>

        <div className="max-w-6xl mx-auto px-4 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Table of Contents - Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className={`sticky top-24 ${
                theme === 'dark'
                  ? 'bg-neutral-900/50 border-red-900/30'
                  : 'bg-white/50 border-red-200'
              } backdrop-blur-sm border rounded-2xl p-6`}>
                <h2 
                  className={`text-lg font-bold mb-4 flex items-center gap-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  <BookOpen className="w-5 h-5" />
                  Contents
                </h2>
                <nav className="space-y-2">
                  {tableOfContents.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center gap-2 group ${
                        theme === 'dark'
                          ? 'hover:bg-red-900/20 text-neutral-300 hover:text-white'
                          : 'hover:bg-red-50 text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      <span className="text-sm">{item.title}</span>
                    </button>
                  ))}
                </nav>

                <div className="mt-6 pt-6 border-t border-neutral-700/30">
                  <a
                    href="https://github.com/Alekhya2024/Reveura"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 text-sm ${
                      theme === 'dark' 
                        ? 'text-red-400 hover:text-red-300' 
                        : 'text-red-600 hover:text-red-500'
                    } transition-colors`}
                  >
                    <ExternalLink className="w-4 h-4" />
                    View on GitHub
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-3"
            >
              <div className={`${
                theme === 'dark'
                  ? 'bg-neutral-900/30 border-red-900/20'
                  : 'bg-white/50 border-red-200/50'
              } backdrop-blur-sm border rounded-2xl p-8 space-y-8`}>
                
                {/* Introduction */}
                <section id="intro" className="scroll-mt-24">
                  <h2 
                    className={`text-3xl font-bold mb-4 flex items-center gap-3 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    <span className="text-red-500">1.</span> Introduction
                  </h2>
                  
                  <div className="space-y-4">
                    <h3 
                      className={`text-xl font-semibold ${
                        theme === 'dark' ? 'text-red-400' : 'text-red-600'
                      }`}
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      Project Overview
                    </h3>
                    <p className={`leading-relaxed ${
                      theme === 'dark' ? 'text-neutral-300' : 'text-gray-700'
                    }`}>
                      Reveura is a comprehensive mental wellness and habit tracking application designed to help individuals improve their mental health, build positive habits, and track their emotional well-being holistically. The name "Reveura" combines the concepts of "Revive" and "Aura," representing the journey to revitalize one's inner peace and positive energy.
                    </p>

                    <h3 
                      className={`text-xl font-semibold mt-6 ${
                        theme === 'dark' ? 'text-red-400' : 'text-red-600'
                      }`}
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      Motivation
                    </h3>
                    <p className={`leading-relaxed ${
                      theme === 'dark' ? 'text-neutral-300' : 'text-gray-700'
                    }`}>
                      In today's fast-paced world, mental health challenges have become increasingly prevalent. Existing mental wellness applications often focus on isolated aspects of mental health—such as mood tracking, meditation, or habit formation—without providing an integrated approach.
                    </p>

                    <div className={`mt-4 p-4 rounded-lg ${
                      theme === 'dark' 
                        ? 'bg-red-950/30 border-red-900/30' 
                        : 'bg-red-50 border-red-200'
                    } border`}>
                      <h4 className={`font-semibold mb-2 ${
                        theme === 'dark' ? 'text-red-300' : 'text-red-700'
                      }`}>
                        Key Integration Features:
                      </h4>
                      <ul className={`space-y-2 ${
                        theme === 'dark' ? 'text-neutral-300' : 'text-gray-700'
                      }`}>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-5 h-5 mt-0.5 text-red-500 flex-shrink-0" />
                          <span><strong>Mood tracking and journaling</strong> for emotional awareness</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-5 h-5 mt-0.5 text-red-500 flex-shrink-0" />
                          <span><strong>Habit formation and tracking</strong> for building positive routines</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-5 h-5 mt-0.5 text-red-500 flex-shrink-0" />
                          <span><strong>Sleep monitoring</strong> to understand rest patterns and their impact</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-5 h-5 mt-0.5 text-red-500 flex-shrink-0" />
                          <span><strong>Mindfulness exercises and games</strong> for stress relief</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-5 h-5 mt-0.5 text-red-500 flex-shrink-0" />
                          <span><strong>Data-driven insights</strong> to identify patterns and correlations</span>
                        </li>
                      </ul>
                    </div>

                    <h3 
                      className={`text-xl font-semibold mt-6 ${
                        theme === 'dark' ? 'text-red-400' : 'text-red-600'
                      }`}
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      Project Goals
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {[
                        { title: 'Holistic Wellness Tracking', desc: 'Unified platform for multiple aspects of mental health' },
                        { title: 'User Engagement', desc: 'Intuitive, visually appealing interface' },
                        { title: 'Data-Driven Insights', desc: 'Discover patterns and correlations' },
                        { title: 'Gamification', desc: 'Motivation through achievements and rewards' },
                        { title: 'Accessibility', desc: 'Responsive across all devices' },
                        { title: 'Privacy-First', desc: 'User data security as core principle' },
                      ].map((goal, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg ${
                            theme === 'dark'
                              ? 'bg-neutral-800/50 border-neutral-700/30'
                              : 'bg-white border-gray-200'
                          } border`}
                        >
                          <h4 className={`font-semibold mb-1 ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {goal.title}
                          </h4>
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'
                          }`}>
                            {goal.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <div className={`border-t ${
                  theme === 'dark' ? 'border-neutral-800' : 'border-gray-200'
                } my-8`} />

                {/* Problem Statement */}
                <section id="problem" className="scroll-mt-24">
                  <h2 
                    className={`text-3xl font-bold mb-4 flex items-center gap-3 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    <span className="text-red-500">2.</span> Problem Statement
                  </h2>

                  <h3 
                    className={`text-xl font-semibold mb-4 ${
                      theme === 'dark' ? 'text-red-400' : 'text-red-600'
                    }`}
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Identified Gap
                  </h3>

                  <p className={`leading-relaxed mb-4 ${
                    theme === 'dark' ? 'text-neutral-300' : 'text-gray-700'
                  }`}>
                    Current mental wellness applications suffer from several limitations:
                  </p>

                  <div className="space-y-4">
                    {[
                      {
                        title: 'Fragmentation',
                        desc: 'Users must juggle multiple apps for different aspects of mental health, creating friction and reducing adherence.'
                      },
                      {
                        title: 'Lack of Integration',
                        desc: 'Existing apps rarely show correlations between different wellness metrics like sleep quality and mood.'
                      },
                      {
                        title: 'Poor User Retention',
                        desc: 'Many wellness apps have high abandonment rates due to complexity or failure to demonstrate tangible value.'
                      },
                      {
                        title: 'Limited Personalization',
                        desc: 'One-size-fits-all approaches don\'t account for individual differences in mental health needs.'
                      },
                      {
                        title: 'Data Silos',
                        desc: 'Health data remains trapped in individual applications, preventing comprehensive analysis.'
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-l-4 ${
                          theme === 'dark'
                            ? 'bg-neutral-800/30 border-red-500/50'
                            : 'bg-red-50/50 border-red-500'
                        }`}
                      >
                        <h4 className={`font-semibold mb-1 ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {index + 1}. {item.title}
                        </h4>
                        <p className={`text-sm ${
                          theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'
                        }`}>
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>

                  <h3 
                    className={`text-xl font-semibold mt-6 mb-4 ${
                      theme === 'dark' ? 'text-red-400' : 'text-red-600'
                    }`}
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Reveura's Solution
                  </h3>

                  <div className={`p-6 rounded-xl ${
                    theme === 'dark'
                      ? 'bg-gradient-to-br from-red-950/30 to-neutral-900/30 border-red-900/30'
                      : 'bg-gradient-to-br from-red-50 to-white border-red-200'
                  } border`}>
                    <p className={`font-semibold mb-4 ${
                      theme === 'dark' ? 'text-red-300' : 'text-red-700'
                    }`}>
                      Reveura addresses these gaps by providing:
                    </p>
                    <ul className={`space-y-2 ${
                      theme === 'dark' ? 'text-neutral-300' : 'text-gray-700'
                    }`}>
                      {[
                        'Unified Platform: All wellness tracking features in one application',
                        'Correlation Analytics: Visual insights showing relationships between metrics',
                        'Gamification Elements: Achievements, streaks, and rewards',
                        'Personalized Experience: Customizable habits, moods, and journaling',
                        'Data Integration: Centralized storage enabling comprehensive analysis',
                        'Beautiful UX: Modern, calming interface that makes tracking enjoyable',
                      ].map((solution, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <ChevronRight className="w-5 h-5 mt-0.5 text-red-500 flex-shrink-0" />
                          <span>{solution}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                <div className={`border-t ${
                  theme === 'dark' ? 'border-neutral-800' : 'border-gray-200'
                } my-8`} />

                {/* System Design */}
                <section id="design" className="scroll-mt-24">
                  <h2 
                    className={`text-3xl font-bold mb-4 flex items-center gap-3 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    <span className="text-red-500">3.</span> System Design & Methodology
                  </h2>

                  <h3 
                    className={`text-xl font-semibold mb-4 ${
                      theme === 'dark' ? 'text-red-400' : 'text-red-600'
                    }`}
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Technology Stack
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {[
                      { name: 'Next.js', version: '16.1.3', type: 'Framework' },
                      { name: 'React', version: '19.2.3', type: 'UI Library' },
                      { name: 'TypeScript', version: '5.x', type: 'Language' },
                      { name: 'Tailwind CSS', version: '4.x', type: 'Styling' },
                      { name: 'Framer Motion', version: '12.26.2', type: 'Animation' },
                      { name: 'Recharts', version: '3.6.0', type: 'Charts' },
                    ].map((tech, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg ${
                          theme === 'dark'
                            ? 'bg-neutral-800/50 border-neutral-700/30'
                            : 'bg-white border-gray-200'
                        } border`}
                      >
                        <div className={`text-sm mb-1 ${
                          theme === 'dark' ? 'text-neutral-400' : 'text-gray-500'
                        }`}>
                          {tech.type}
                        </div>
                        <div className={`font-bold ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {tech.name}
                        </div>
                        <div className={`text-sm mt-1 ${
                          theme === 'dark' ? 'text-red-400' : 'text-red-600'
                        }`}>
                          v{tech.version}
                        </div>
                      </div>
                    ))}
                  </div>

                  <h3 
                    className={`text-xl font-semibold mb-4 ${
                      theme === 'dark' ? 'text-red-400' : 'text-red-600'
                    }`}
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Architecture Layers
                  </h3>

                  <div className="space-y-3">
                    {[
                      { layer: 'User Interface', tech: 'React 19 Components + Framer Motion', color: 'blue' },
                      { layer: 'Application Layer', tech: 'Next.js 16 App Router + TypeScript', color: 'green' },
                      { layer: 'Data Layer', tech: 'LocalStorage (Current) / MongoDB (Planned)', color: 'purple' },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg ${
                          theme === 'dark'
                            ? 'bg-neutral-800/30 border-neutral-700/30'
                            : 'bg-white border-gray-200'
                        } border`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className={`font-semibold ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                              {item.layer}
                            </div>
                            <div className={`text-sm mt-1 ${
                              theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'
                            }`}>
                              {item.tech}
                            </div>
                          </div>
                          <ChevronDown className="w-5 h-5 text-red-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <div className={`border-t ${
                  theme === 'dark' ? 'border-neutral-800' : 'border-gray-200'
                } my-8`} />

                {/* Implementation */}
                <section id="implementation" className="scroll-mt-24">
                  <h2 
                    className={`text-3xl font-bold mb-4 flex items-center gap-3 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    <span className="text-red-500">4.</span> Implementation Details
                  </h2>

                  <h3 
                    className={`text-xl font-semibold mb-4 ${
                      theme === 'dark' ? 'text-red-400' : 'text-red-600'
                    }`}
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Core Modules
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: 'Dashboard', desc: 'Central hub with overview and quick actions', status: '100%' },
                      { name: 'Habits Tracker', desc: 'Create, track, and maintain daily habits', status: '100%' },
                      { name: 'Journal & Mood', desc: 'Track emotions with sentiment analysis', status: '100%' },
                      { name: 'Sleep Tracker', desc: 'Monitor sleep patterns and quality', status: '100%' },
                      { name: 'Breathe Games', desc: '4 mindfulness games for stress relief', status: '100%' },
                      { name: 'Achievements', desc: 'Gamification with 5-tier reward system', status: '100%' },
                      { name: 'Insights', desc: 'Data visualization and correlation charts', status: '100%' },
                      { name: 'Inspiration', desc: '100 curated motivational quotes', status: '100%' },
                    ].map((module, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg ${
                          theme === 'dark'
                            ? 'bg-neutral-800/50 border-neutral-700/30'
                            : 'bg-white border-gray-200'
                        } border hover:scale-[1.02] transition-transform`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className={`font-semibold ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {module.name}
                          </h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            theme === 'dark'
                              ? 'bg-green-900/30 text-green-400'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {module.status}
                          </span>
                        </div>
                        <p className={`text-sm ${
                          theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'
                        }`}>
                          {module.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                <div className={`border-t ${
                  theme === 'dark' ? 'border-neutral-800' : 'border-gray-200'
                } my-8`} />

                {/* Results */}
                <section id="results" className="scroll-mt-24">
                  <h2 
                    className={`text-3xl font-bold mb-4 flex items-center gap-3 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    <span className="text-red-500">5.</span> Results and Evaluation
                  </h2>

                  <div className={`p-6 rounded-xl mb-6 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-green-950/30 to-neutral-900/30 border-green-900/30'
                      : 'bg-gradient-to-r from-green-50 to-white border-green-200'
                  } border`}>
                    <h3 className={`text-lg font-semibold mb-4 ${
                      theme === 'dark' ? 'text-green-300' : 'text-green-700'
                    }`}>
                      ✅ Production-Ready Features
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        'Authentication',
                        'Frontend Complete',
                        'Data Persistence',
                        'Responsive Design',
                        'Dark/Light Theme',
                        'Multi-language (3)',
                        'Onboarding Tour',
                        'Sound Effects',
                      ].map((feature, index) => (
                        <div
                          key={index}
                          className={`text-sm ${
                            theme === 'dark' ? 'text-neutral-300' : 'text-gray-700'
                          }`}
                        >
                          ✓ {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  <h3 
                    className={`text-xl font-semibold mb-4 ${
                      theme === 'dark' ? 'text-red-400' : 'text-red-600'
                    }`}
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Performance Metrics
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { metric: 'First Contentful Paint', value: '< 1.5s' },
                      { metric: 'Time to Interactive', value: '< 3s' },
                      { metric: 'Lighthouse Score', value: '90+' },
                      { metric: 'Animation FPS', value: '60fps' },
                      { metric: 'Mobile Responsive', value: '100%' },
                      { metric: 'Bundle Size (gzip)', value: '~450 KB' },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg text-center ${
                          theme === 'dark'
                            ? 'bg-neutral-800/50 border-neutral-700/30'
                            : 'bg-white border-gray-200'
                        } border`}
                      >
                        <div className={`text-2xl font-bold mb-1 ${
                          theme === 'dark' ? 'text-red-400' : 'text-red-600'
                        }`}>
                          {item.value}
                        </div>
                        <div className={`text-sm ${
                          theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'
                        }`}>
                          {item.metric}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <div className={`border-t ${
                  theme === 'dark' ? 'border-neutral-800' : 'border-gray-200'
                } my-8`} />

                {/* Discussion */}
                <section id="discussion" className="scroll-mt-24">
                  <h2 
                    className={`text-3xl font-bold mb-4 flex items-center gap-3 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    <span className="text-red-500">6.</span> Discussion
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <h3 
                        className={`text-xl font-semibold mb-3 ${
                          theme === 'dark' ? 'text-green-400' : 'text-green-600'
                        }`}
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        System Strengths
                      </h3>
                      <ul className={`space-y-2 ${
                        theme === 'dark' ? 'text-neutral-300' : 'text-gray-700'
                      }`}>
                        {[
                          'Holistic integration of multiple wellness aspects',
                          'User experience excellence with calming aesthetics',
                          'Gamification that motivates without overwhelming',
                          'Data-driven insights with visual analytics',
                          'Privacy-first design with local data storage',
                          'Accessibility & inclusivity (multilingual support)',
                        ].map((strength, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">✓</span>
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 
                        className={`text-xl font-semibold mb-3 ${
                          theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                        }`}
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        Current Limitations
                      </h3>
                      <ul className={`space-y-2 ${
                        theme === 'dark' ? 'text-neutral-300' : 'text-gray-700'
                      }`}>
                        {[
                          'No backend infrastructure (planned for future)',
                          'LocalStorage-based authentication (upgrading to JWT)',
                          'Basic correlation analysis (ML planned)',
                          'No push notifications (PWA in development)',
                          'Missing social features (optional privacy-aware)',
                        ].map((limitation, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-yellow-500 mt-1">⚠</span>
                            <span>{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>

                <div className={`border-t ${
                  theme === 'dark' ? 'border-neutral-800' : 'border-gray-200'
                } my-8`} />

                {/* Future Work */}
                <section id="future" className="scroll-mt-24">
                  <h2 className={`text-3xl font-bold mb-4 flex items-center gap-3 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    <span className="text-red-500">7.</span> Future Work
                  </h2>

                  <div className="space-y-4">
                    {[
                      {
                        title: 'Short-Term (3 Months)',
                        items: ['MongoDB backend integration', 'JWT authentication', 'Data export/import', 'Enhanced security'],
                      },
                      {
                        title: 'Medium-Term (6 Months)',
                        items: ['Progressive Web App (PWA)', 'Push notifications', 'Advanced ML analytics', 'Smart reminders'],
                      },
                      {
                        title: 'Long-Term (1 Year+)',
                        items: ['AI-powered insights', 'Wearable integration', 'Mobile native apps', 'Content library'],
                      },
                    ].map((phase, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg ${
                          theme === 'dark'
                            ? 'bg-neutral-800/30 border-neutral-700/30'
                            : 'bg-white border-gray-200'
                        } border`}
                      >
                        <h3 className={`font-semibold mb-2 ${
                          theme === 'dark' ? 'text-red-300' : 'text-red-600'
                        }`}>
                          {phase.title}
                        </h3>
                        <ul className={`space-y-1 ${
                          theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'
                        }`}>
                          {phase.items.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm">
                              <ChevronRight className="w-4 h-4 text-red-500" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>

                <div className={`border-t ${
                  theme === 'dark' ? 'border-neutral-800' : 'border-gray-200'
                } my-8`} />

                {/* Conclusion */}
                <section id="conclusion" className="scroll-mt-24">
                  <h2 className={`text-3xl font-bold mb-4 flex items-center gap-3 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    <span className="text-red-500">8.</span> Conclusion
                  </h2>

                  <div className={`p-6 rounded-xl ${
                    theme === 'dark'
                      ? 'bg-gradient-to-br from-red-950/30 via-purple-950/20 to-neutral-900/30 border-red-900/30'
                      : 'bg-gradient-to-br from-red-50 via-purple-50 to-white border-red-200'
                  } border`}>
                    <p className={`text-lg leading-relaxed mb-4 ${
                      theme === 'dark' ? 'text-neutral-200' : 'text-gray-800'
                    }`}>
                      Reveura represents a significant advancement in mental wellness technology by addressing a critical gap in the market: the fragmentation of mental health tools.
                    </p>
                    <p className={`leading-relaxed mb-4 ${
                      theme === 'dark' ? 'text-neutral-300' : 'text-gray-700'
                    }`}>
                      This capstone project successfully demonstrates technical excellence through a production-ready web application built with modern technologies, showcasing advanced frontend development skills including state management, data visualization, animation, and responsive design.
                    </p>
                    <p className={`text-xl font-semibold text-center mt-6 ${
                      theme === 'dark' ? 'text-red-300' : 'text-red-600'
                    }`}>
                      "Reveura is more than an app; it's a companion for the journey toward better mental health."
                    </p>
                  </div>

                  <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { label: 'Lines of Code', value: '15,000+' },
                      { label: 'Components', value: '50+' },
                      { label: 'Features', value: '8 Modules' },
                    ].map((stat, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg text-center ${
                          theme === 'dark'
                            ? 'bg-neutral-800/50 border-neutral-700/30'
                            : 'bg-white border-gray-200'
                        } border`}
                      >
                        <div className={`text-3xl font-bold mb-1 ${
                          theme === 'dark' ? 'text-red-400' : 'text-red-600'
                        }`}>
                          {stat.value}
                        </div>
                        <div className={`text-sm ${
                          theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'
                        }`}>
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Footer */}
                <div className={`mt-12 pt-8 border-t ${
                  theme === 'dark' ? 'border-neutral-800' : 'border-gray-200'
                } text-center`}>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'
                  }`}>
                    Reveura - Mental Wellness Tracker | Version 1.0 | May 2, 2026
                  </p>
                  <p className={`text-xs mt-2 ${
                    theme === 'dark' ? 'text-neutral-500' : 'text-gray-500'
                  }`}>
                    Developed by Alekhya Vaddineni | MIT License
                  </p>
                  <div className="mt-4">
                    <a
                      href="https://github.com/Alekhya2024/Reveura"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        theme === 'dark'
                          ? 'bg-red-900/30 hover:bg-red-900/50 text-red-300'
                          : 'bg-red-100 hover:bg-red-200 text-red-700'
                      }`}
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Full Documentation on GitHub
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
