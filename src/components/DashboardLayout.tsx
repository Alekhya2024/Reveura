'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import AnimatedBackground from '@/components/AnimatedBackground';
import ParticlesBackground from '@/components/ParticlesBackground';
import { useTheme } from '@/contexts/ThemeContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-black via-neutral-900 to-red-950' 
        : 'bg-gradient-to-br from-white via-gray-50 to-red-50'
    }`}>
      <AnimatedBackground />
      <ParticlesBackground />
      <Sidebar />
      <main className="lg:ml-64 p-4 sm:p-6 md:p-8 pt-20 lg:pt-8 relative z-10">
        {children}
      </main>
    </div>
  );
}
