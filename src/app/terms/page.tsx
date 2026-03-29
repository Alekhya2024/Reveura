'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, FileText, CheckCircle2, AlertCircle, 
  Scale, Lock, Eye, UserCheck, Globe, 
  Mail, ArrowLeft, ChevronDown, ChevronUp,
  Sparkles, BookOpen, ScrollText
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Section {
  id: string;
  title: string;
  icon: React.ElementType;
  content: string[];
}

const sections: Section[] = [
  {
    id: 'acceptance',
    title: 'Acceptance of Terms',
    icon: CheckCircle2,
    content: [
      'By accessing and using Reveura, you accept and agree to be bound by the terms and provisions of this agreement.',
      'If you do not agree to these Terms of Service, please do not use our services.',
      'We reserve the right to update and change the Terms of Service from time to time without notice.',
      'Continued use of the service after any such changes constitutes your consent to such changes.',
    ],
  },
  {
    id: 'service',
    title: 'Description of Service',
    icon: BookOpen,
    content: [
      'Reveura is a mental wellness and habit tracking platform designed to help users monitor and improve their mental health.',
      'We provide tools for mood tracking, habit formation, journaling, sleep monitoring, and mindfulness exercises.',
      'The service includes personalized insights and recommendations based on your usage patterns.',
      'We do not provide medical advice, diagnosis, or treatment. Our service is not a substitute for professional mental health care.',
    ],
  },
  {
    id: 'user-obligations',
    title: 'User Obligations',
    icon: UserCheck,
    content: [
      'You must be at least 13 years old to use this service.',
      'You are responsible for maintaining the confidentiality of your account and password.',
      'You agree to accept responsibility for all activities that occur under your account.',
      'You must not use the service for any illegal or unauthorized purpose.',
      'You must not transmit any viruses, worms, or malicious code.',
    ],
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual Property',
    icon: Scale,
    content: [
      'All content, features, and functionality of Reveura are owned by us and are protected by international copyright, trademark, and other intellectual property laws.',
      'You may not reproduce, distribute, modify, or create derivative works of our content without explicit permission.',
      'Your personal data and journal entries remain your property.',
      'By using our service, you grant us a license to use your anonymized data to improve our platform.',
    ],
  },
  {
    id: 'privacy',
    title: 'Privacy and Data Protection',
    icon: Lock,
    content: [
      'We take your privacy seriously and handle your data in accordance with our Privacy Policy.',
      'Your personal information is encrypted and stored securely.',
      'We will never sell your personal data to third parties.',
      'You have the right to access, modify, or delete your data at any time through your account settings.',
    ],
  },
  {
    id: 'limitation',
    title: 'Limitation of Liability',
    icon: AlertCircle,
    content: [
      'Reveura is provided "as is" without any warranties, expressed or implied.',
      'We do not guarantee that the service will be uninterrupted, timely, secure, or error-free.',
      'We shall not be liable for any indirect, incidental, special, consequential, or punitive damages.',
      'In no event shall our total liability exceed the amount you paid for the service in the past 12 months.',
      'If you are experiencing a mental health emergency, please contact emergency services or a mental health crisis line immediately.',
    ],
  },
  {
    id: 'termination',
    title: 'Termination',
    icon: XCircle,
    content: [
      'You may terminate your account at any time by contacting support or through account settings.',
      'We reserve the right to suspend or terminate your account if you violate these terms.',
      'Upon termination, your right to use the service will immediately cease.',
      'We will retain your data for 30 days after termination, after which it will be permanently deleted.',
    ],
  },
  {
    id: 'contact',
    title: 'Contact Information',
    icon: Mail,
    content: [
      'If you have any questions about these Terms of Service, please contact us:',
      'Email: support@reveura.com',
      'Address: [Your Business Address]',
      'We aim to respond to all inquiries within 48 hours.',
    ],
  },
];

function XCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  );
}

export default function TermsPage() {
  const router = useRouter();
  const [expandedSections, setExpandedSections] = useState<string[]>(['acceptance']);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('acceptance');

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);

      // Determine active section based on scroll position
      const sectionElements = sections.map(s => document.getElementById(s.id));
      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const element = sectionElements[i];
        if (element && element.getBoundingClientRect().top <= 150) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSection = (id: string) => {
    setExpandedSections(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-black relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-pink-600 to-red-600 z-50"
        style={{ scaleX: scrollProgress / 100, transformOrigin: '0%' }}
      />

      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-40 backdrop-blur-xl bg-black/50 border-b border-red-600/20"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-neutral-400 hover:text-red-500 transition-colors"
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </motion.button>

          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Scale className="w-6 h-6 text-red-500" />
            </motion.div>
            <h1 className="text-xl font-semibold text-white">Terms of Service</h1>
          </div>

          <div className="text-sm text-neutral-500">
            Last updated: Jan 2026
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-6 py-12 flex gap-8">
        {/* Table of Contents - Sticky Sidebar */}
        <motion.aside
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="hidden lg:block w-64 sticky top-24 h-fit"
        >
          <div className="bg-neutral-900/50 backdrop-blur-lg border border-red-600/20 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-red-500 mb-4 flex items-center gap-2">
              <ScrollText className="w-4 h-4" />
              Contents
            </h3>
            <nav className="space-y-2">
              {sections.map((section, index) => (
                <motion.button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full text-left text-sm py-2 px-3 rounded-lg transition-all ${
                    activeSection === section.id
                      ? 'bg-red-600/20 text-red-400'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                  }`}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {section.title}
                </motion.button>
              ))}
            </nav>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="bg-gradient-to-br from-red-600/20 to-pink-600/20 backdrop-blur-lg border border-red-600/30 rounded-3xl p-8 md:p-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-20 h-20 bg-gradient-to-br from-red-600 to-pink-600 rounded-2xl flex items-center justify-center mb-6"
              >
                <FileText className="w-10 h-10 text-white" />
              </motion.div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Terms of Service
              </h2>
              <p className="text-lg text-neutral-300 leading-relaxed">
                Welcome to Reveura. These terms and conditions outline the rules and regulations for the use of our mental wellness platform. By accessing this service, we assume you accept these terms and conditions in full.
              </p>
              
              <motion.div
                className="mt-6 flex flex-wrap gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                  <Globe className="w-4 h-4 text-red-500" />
                  <span>Effective Worldwide</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                  <Shield className="w-4 h-4 text-red-500" />
                  <span>GDPR Compliant</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                  <Eye className="w-4 h-4 text-red-500" />
                  <span>Transparent</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Sections */}
          <div className="space-y-6">
            {sections.map((section, index) => {
              const Icon = section.icon;
              const isExpanded = expandedSections.includes(section.id);

              return (
                <motion.div
                  key={section.id}
                  id={section.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="scroll-mt-24"
                >
                  <motion.div
                    className="bg-neutral-900/50 backdrop-blur-lg border border-red-600/20 rounded-2xl overflow-hidden"
                    whileHover={{ borderColor: 'rgba(220, 38, 38, 0.4)' }}
                  >
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-red-600/5 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <motion.div
                          className="w-12 h-12 bg-gradient-to-br from-red-600/20 to-pink-600/20 rounded-xl flex items-center justify-center"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Icon className="w-6 h-6 text-red-500" />
                        </motion.div>
                        <div>
                          <h3 className="text-xl font-semibold text-white">
                            {section.title}
                          </h3>
                          <p className="text-sm text-neutral-500 mt-1">
                            {section.content.length} {section.content.length === 1 ? 'point' : 'points'}
                          </p>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-6 h-6 text-neutral-400" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="px-6 pb-6 pt-2 border-t border-red-600/10">
                            <div className="space-y-4">
                              {section.content.map((paragraph, pIndex) => (
                                <motion.div
                                  key={pIndex}
                                  initial={{ x: -20, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  transition={{ delay: pIndex * 0.05 }}
                                  className="flex gap-3"
                                >
                                  <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-2" />
                                  <p className="text-neutral-300 leading-relaxed">
                                    {paragraph}
                                  </p>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Footer CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 bg-gradient-to-r from-red-600/20 to-pink-600/20 backdrop-blur-lg border border-red-600/30 rounded-2xl p-8 text-center"
          >
            <Sparkles className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">
              Questions about our Terms?
            </h3>
            <p className="text-neutral-300 mb-6">
              We're here to help. Contact our support team anytime.
            </p>
            <motion.button
              onClick={() => router.push('/')}
              className="px-8 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-red-600/50 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back to Home
            </motion.button>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
