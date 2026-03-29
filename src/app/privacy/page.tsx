'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Lock, Eye, EyeOff, Database, 
  Cookie, Share2, UserX, Download, Trash2,
  Globe, Server, Bell, CheckCircle2, 
  AlertTriangle, Mail, ArrowLeft, ChevronDown,
  Fingerprint, Key, ShieldCheck, FileKey,
  Sparkles, BookOpen, ScrollText, Users
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PrivacySection {
  id: string;
  title: string;
  icon: React.ElementType;
  content: string[];
  highlights?: string[];
}

const privacySections: PrivacySection[] = [
  {
    id: 'introduction',
    title: 'Privacy Commitment',
    icon: Shield,
    content: [
      'At Reveura, your privacy is our top priority. We are committed to protecting your personal information and being transparent about how we collect, use, and safeguard your data.',
      'This Privacy Policy explains how we handle your information when you use our mental wellness platform.',
      'We believe in your right to privacy and control over your personal data.',
      'By using Reveura, you consent to the data practices described in this policy.',
    ],
    highlights: ['Bank-level encryption', 'GDPR & CCPA compliant', 'Never sell your data'],
  },
  {
    id: 'collection',
    title: 'Information We Collect',
    icon: Database,
    content: [
      'Account Information: Name, email address, password (encrypted), and profile details.',
      'Usage Data: Mood entries, habit tracking, journal entries, sleep patterns, and breathing exercises.',
      'Device Information: IP address, browser type, device type, and operating system.',
      'Analytics Data: How you interact with our platform to improve user experience.',
      'Optional Data: Any additional information you choose to provide, such as profile photo or preferences.',
    ],
  },
  {
    id: 'usage',
    title: 'How We Use Your Information',
    icon: Eye,
    content: [
      'To provide and improve our mental wellness services and personalized recommendations.',
      'To analyze trends and patterns in your mood and habits to generate insights.',
      'To communicate with you about your account, updates, and important changes.',
      'To ensure platform security and prevent fraudulent activities.',
      'To comply with legal obligations and enforce our Terms of Service.',
      'We NEVER sell your personal information to third parties.',
    ],
  },
  {
    id: 'security',
    title: 'Data Security',
    icon: Lock,
    content: [
      'All data is encrypted in transit using SSL/TLS protocols and at rest using AES-256 encryption.',
      'We use industry-standard security measures including firewalls, intrusion detection, and regular security audits.',
      'Access to your data is strictly limited to authorized personnel who need it to perform their job functions.',
      'We conduct regular security assessments and penetration testing to identify vulnerabilities.',
      'Two-factor authentication is available for enhanced account security.',
      'In the event of a data breach, we will notify affected users within 72 hours.',
    ],
  },
  {
    id: 'sharing',
    title: 'Data Sharing & Third Parties',
    icon: Share2,
    content: [
      'We do NOT sell or rent your personal information to third parties.',
      'Service Providers: We may share data with trusted service providers who help us operate our platform (e.g., cloud hosting, analytics).',
      'Legal Requirements: We may disclose information if required by law, court order, or government request.',
      'Business Transfers: In the event of a merger or acquisition, your data may be transferred to the new entity.',
      'All third-party service providers are bound by strict confidentiality agreements.',
    ],
  },
  {
    id: 'cookies',
    title: 'Cookies & Tracking',
    icon: Cookie,
    content: [
      'We use cookies and similar technologies to enhance your experience and analyze platform usage.',
      'Essential Cookies: Required for basic platform functionality and security.',
      'Analytics Cookies: Help us understand how you use our platform to improve services.',
      'Preference Cookies: Remember your settings and preferences.',
      'You can control cookie preferences through your browser settings.',
      'Disabling certain cookies may affect platform functionality.',
    ],
  },
  {
    id: 'rights',
    title: 'Your Privacy Rights',
    icon: UserX,
    content: [
      'Right to Access: Request a copy of all personal data we have about you.',
      'Right to Rectification: Correct any inaccurate or incomplete information.',
      'Right to Erasure: Request deletion of your account and associated data.',
      'Right to Data Portability: Download your data in a machine-readable format.',
      'Right to Restrict Processing: Limit how we use your data.',
      'Right to Object: Opt-out of certain data processing activities.',
      'Right to Withdraw Consent: Stop us from processing your data at any time.',
    ],
  },
  {
    id: 'retention',
    title: 'Data Retention',
    icon: Database,
    content: [
      'We retain your personal data only as long as necessary to provide our services.',
      'Active accounts: Data is retained while your account is active.',
      'Deleted accounts: Data is permanently deleted within 30 days of account deletion.',
      'Legal obligations: Some data may be retained longer if required by law.',
      'Anonymized data: We may retain anonymized, aggregated data for research and analytics.',
      'You can request immediate data deletion by contacting our support team.',
    ],
  },
  {
    id: 'international',
    title: 'International Data Transfers',
    icon: Globe,
    content: [
      'Your data may be processed and stored in different countries where our service providers operate.',
      'We ensure appropriate safeguards are in place for international data transfers.',
      'We comply with GDPR, CCPA, and other applicable data protection regulations.',
      'Standard contractual clauses are used for transfers outside the EU/EEA.',
      'You can request information about where your data is stored at any time.',
    ],
  },
  {
    id: 'children',
    title: 'Children\'s Privacy',
    icon: Users,
    content: [
      'Our service is not intended for children under 13 years of age.',
      'We do not knowingly collect personal information from children under 13.',
      'If we discover we have collected data from a child under 13, we will delete it immediately.',
      'Parents or guardians can contact us if they believe their child has provided personal information.',
      'Users between 13-18 should have parental consent before using our service.',
    ],
  },
  {
    id: 'updates',
    title: 'Policy Updates',
    icon: Bell,
    content: [
      'We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements.',
      'We will notify you of significant changes via email or prominent notice on our platform.',
      'The "Last Updated" date at the top of this policy indicates when it was last revised.',
      'Continued use of our service after changes constitutes acceptance of the updated policy.',
      'We encourage you to review this policy periodically.',
    ],
  },
  {
    id: 'contact',
    title: 'Contact & Data Protection Officer',
    icon: Mail,
    content: [
      'If you have questions or concerns about this Privacy Policy, please contact us:',
      'Email: privacy@reveura.com',
      'Data Protection Officer: dpo@reveura.com',
      'Address: [Your Business Address]',
      'Phone: [Your Contact Number]',
      'We respond to all privacy inquiries within 48 hours.',
    ],
  },
];

export default function PrivacyPolicyPage() {
  const router = useRouter();
  const [expandedSections, setExpandedSections] = useState<string[]>(['introduction']);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('introduction');
  const [showPrivacyBadge, setShowPrivacyBadge] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);

      // Show/hide privacy badge based on scroll
      setShowPrivacyBadge(window.scrollY < 100);

      // Determine active section
      const sectionElements = privacySections.map(s => document.getElementById(s.id));
      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const element = sectionElements[i];
        if (element && element.getBoundingClientRect().top <= 150) {
          setActiveSection(privacySections[i].id);
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
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, 60, 0],
            y: [0, -40, 0],
          }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1.3, 1, 1.3],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -60, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 15, repeat: Infinity }}
        />
      </div>

      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 z-50"
        style={{ scaleX: scrollProgress / 100, transformOrigin: '0%' }}
      />

      {/* Privacy Badge - Floating */}
      <AnimatePresence>
        {showPrivacyBadge && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-24 right-6 z-40 bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-xl border border-green-600/30 rounded-2xl p-4 shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              >
                <ShieldCheck className="w-6 h-6 text-green-500" />
              </motion.div>
              <div>
                <p className="text-sm font-semibold text-white">Privacy Protected</p>
                <p className="text-xs text-neutral-400">GDPR Compliant</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-40 backdrop-blur-xl bg-black/50 border-b border-purple-600/20"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-neutral-400 hover:text-purple-500 transition-colors"
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </motion.button>

          <div className="flex items-center gap-3">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Lock className="w-6 h-6 text-purple-500" />
            </motion.div>
            <h1 className="text-xl font-semibold text-white">Privacy Policy</h1>
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
          <div className="bg-neutral-900/50 backdrop-blur-lg border border-purple-600/20 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-purple-500 mb-4 flex items-center gap-2">
              <ScrollText className="w-4 h-4" />
              Quick Navigation
            </h3>
            <nav className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
              {privacySections.map((section, index) => (
                <motion.button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full text-left text-xs py-2 px-3 rounded-lg transition-all ${
                    activeSection === section.id
                      ? 'bg-purple-600/20 text-purple-400'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                  }`}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
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
            <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-lg border border-purple-600/30 rounded-3xl p-8 md:p-12 relative overflow-hidden">
              {/* Animated particles */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-purple-500/30 rounded-full"
                    animate={{
                      x: [Math.random() * 100, Math.random() * 100],
                      y: [Math.random() * 100, Math.random() * 100],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 3 + i,
                      repeat: Infinity,
                      delay: i * 0.5,
                    }}
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                  />
                ))}
              </div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mb-6 relative z-10"
              >
                <Shield className="w-10 h-10 text-white" />
              </motion.div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 relative z-10">
                Privacy Policy
              </h2>
              <p className="text-lg text-neutral-300 leading-relaxed relative z-10">
                Your privacy matters to us. This policy outlines how Reveura collects, uses, protects, and respects your personal information. We're committed to transparency and giving you control over your data.
              </p>
              
              <motion.div
                className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {privacySections[0].highlights?.map((highlight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="bg-black/30 backdrop-blur-sm border border-purple-600/20 rounded-xl p-4 flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-white">{highlight}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Privacy Sections */}
          <div className="space-y-6">
            {privacySections.map((section, index) => {
              const Icon = section.icon;
              const isExpanded = expandedSections.includes(section.id);

              return (
                <motion.div
                  key={section.id}
                  id={section.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="scroll-mt-24"
                >
                  <motion.div
                    className="bg-neutral-900/50 backdrop-blur-lg border border-purple-600/20 rounded-2xl overflow-hidden"
                    whileHover={{ borderColor: 'rgba(147, 51, 234, 0.4)' }}
                  >
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-purple-600/5 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <motion.div
                          className="w-12 h-12 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-xl flex items-center justify-center"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Icon className="w-6 h-6 text-purple-500" />
                        </motion.div>
                        <div>
                          <h3 className="text-xl font-semibold text-white">
                            {section.title}
                          </h3>
                          <p className="text-sm text-neutral-500 mt-1">
                            {section.content.length} {section.content.length === 1 ? 'detail' : 'details'}
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
                          <div className="px-6 pb-6 pt-2 border-t border-purple-600/10">
                            <div className="space-y-4">
                              {section.content.map((paragraph, pIndex) => (
                                <motion.div
                                  key={pIndex}
                                  initial={{ x: -20, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  transition={{ delay: pIndex * 0.05 }}
                                  className="flex gap-3"
                                >
                                  <div className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2" />
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
            className="mt-12 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-lg border border-purple-600/30 rounded-2xl p-8 text-center"
          >
            <Fingerprint className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">
              Your Data, Your Control
            </h3>
            <p className="text-neutral-300 mb-6">
              Have questions about your privacy? We're here to help you understand and manage your data.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <motion.button
                onClick={() => window.location.href = 'mailto:privacy@reveura.com'}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-600/50 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Privacy Team
              </motion.button>
              <motion.button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-neutral-800 text-white rounded-xl font-semibold hover:bg-neutral-700 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Back to Home
              </motion.button>
            </div>
          </motion.div>
        </main>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(147, 51, 234, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(147, 51, 234, 0.7);
        }
      `}</style>
    </div>
  );
}
