'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, UserPlus, LogIn, Sparkles, Shield, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function AuthPage() {
  const router = useRouter();
  const [isSignIn, setIsSignIn] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(isSignIn ? 'Sign In submitted:' : 'Sign Up submitted:', formData);
    
    // Create user profile in localStorage to trigger tour auto-start
    const userProfile = {
      name: formData.email.split('@')[0], // Use email prefix as name
      email: formData.email,
      loginTime: new Date().toISOString(),
      isNewUser: !isSignIn, // true for sign up, false for sign in
    };
    
    // Only set user profile if it doesn't exist (new login)
    const existingProfile = localStorage.getItem('reveura_user_profile');
    if (!existingProfile) {
      localStorage.setItem('reveura_user_profile', JSON.stringify(userProfile));
      console.log('✅ User profile created:', userProfile);
    } else {
      // Update login time for existing users
      const existing = JSON.parse(existingProfile);
      localStorage.setItem('reveura_user_profile', JSON.stringify({
        ...existing,
        loginTime: new Date().toISOString(),
      }));
      console.log('✅ User login time updated');
    }
    
    // Redirect to dashboard after successful login/signup
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Image Carousel */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            opacity: [0, 1, 1, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            times: [0, 0.1, 0.9, 1]
          }}
          className="absolute inset-0"
        >
          <Image
            src="/1.1.jpg"
            alt="Wellness background"
            fill
            className="object-cover"
            priority
          />
        </motion.div>
        <motion.div
          animate={{
            opacity: [0, 0, 1, 1, 0]
          }}
          transition={{
            duration: 20,
            delay: 5,
            repeat: Infinity,
            times: [0, 0, 0.1, 0.9, 1]
          }}
          className="absolute inset-0"
        >
          <Image
            src="/2.1.jpg"
            alt="Mental health"
            fill
            className="object-cover"
          />
        </motion.div>
        <motion.div
          animate={{
            opacity: [0, 0, 1, 1, 0]
          }}
          transition={{
            duration: 20,
            delay: 10,
            repeat: Infinity,
            times: [0, 0, 0.1, 0.9, 1]
          }}
          className="absolute inset-0"
        >
          <Image
            src="/3.1.jpg"
            alt="Mindfulness"
            fill
            className="object-cover"
          />
        </motion.div>
        <motion.div
          animate={{
            opacity: [0, 0, 1, 1, 0, 0]
          }}
          transition={{
            duration: 20,
            delay: 15,
            repeat: Infinity,
            times: [0, 0, 0.1, 0.9, 1, 1]
          }}
          className="absolute inset-0"
        >
          <Image
            src="/4.1.jpg"
            alt="Meditation"
            fill
            className="object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-red-950/80" />
      </div>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-red-600 rounded-full opacity-10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-red-500 rounded-full opacity-10 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-neutral-700 rounded-full opacity-5 blur-3xl"
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-5xl mx-4 px-4 sm:px-6 lg:mx-auto"
      >
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 items-center">
          {/* Left Side - Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative h-[520px] rounded-2xl overflow-hidden shadow-2xl border border-red-900/20 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0"
              >
                <Image
                  src="/1.5.jpg"
                  alt="Peaceful meditation"
                  fill
                  className="object-cover"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/80 via-black/60 to-neutral-900/90 z-10" />
              
              {/* Using decorative pattern instead of image */}
              <div className="absolute inset-0 bg-[url('/window.svg')] opacity-10 bg-repeat" />
              
              <div className="relative z-20 h-full flex flex-col items-center justify-center p-8 text-white">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  className="mb-6"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl flex items-center justify-center shadow-2xl">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="text-3xl font-bold mb-3 text-center bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Welcome to Reveura
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="text-neutral-200 text-center text-base mb-6 max-w-md"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Track your mood, habits, sleep & reflections. Understand your emotional patterns and build balanced well-being through awareness.
                </motion.p>

                <div className="space-y-3 w-full max-w-sm">
                  {[
                    { icon: Shield, text: "Bank-level security" },
                    { icon: Zap, text: "Lightning-fast performance" },
                    { icon: Sparkles, text: "Premium experience" }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + index * 0.2 }}
                      className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20"
                    >
                      <div className="w-9 h-9 bg-red-500/20 rounded-lg flex items-center justify-center">
                        <item.icon className="w-4 h-4 text-red-400" />
                      </div>
                      <span className="text-white font-medium text-sm">{item.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Form Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full"
          >
            <div className="bg-gradient-to-br from-neutral-900 to-black rounded-2xl shadow-2xl border border-red-900/30 backdrop-blur-xl p-4 sm:p-6 lg:p-8">
              {/* Logo */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center mb-4 sm:mb-6"
              >
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-500 via-red-400 to-neutral-300 bg-clip-text text-transparent"
                    style={{ fontFamily: "'Playfair Display', serif" }}>
                  REVEURA
                </h1>
                <p className="text-neutral-400 text-xs mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Mental Wellness Habit Tracker
                </p>
              </motion.div>

              {/* Toggle Buttons */}
              <div className="flex gap-2 mb-4 sm:mb-6 bg-black/50 p-1.5 rounded-2xl border border-neutral-800">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsSignIn(true)}
                  className={`flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                    isSignIn
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-900/50'
                      : 'text-white hover:text-white'
                  }`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <LogIn size={16} />
                  Sign In
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsSignIn(false)}
                  className={`flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                    !isSignIn
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-900/50'
                      : 'text-white hover:text-white'
                  }`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <UserPlus size={16} />
                  Sign Up
                </motion.button>
              </div>

              <AnimatePresence mode="wait">
                {isSignIn ? (
                  <motion.div
                    key="signin"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl font-bold text-white mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Welcome Back
                    </h2>
                    <p className="text-neutral-400 text-xs mb-5">
                      Don't have an account?{' '}
                      <button
                        onClick={() => setIsSignIn(false)}
                        className="text-red-500 hover:text-red-400 font-semibold transition cursor-pointer"
                      >
                        Create now
                      </button>
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Email Field */}
                      <div className="group">
                        <label className="block text-neutral-300 text-xs font-medium mb-1.5 flex items-center gap-2">
                          <Mail size={14} className="text-red-500" />
                          Email Address
                        </label>
                        <motion.div whileFocus={{ scale: 1.01 }} className="relative">
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="your.email@example.com"
                            className="w-full px-4 py-2.5 bg-black/50 border border-neutral-800 rounded-xl text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-300"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          />
                        </motion.div>
                      </div>

                      {/* Password Field */}
                      <div className="group">
                        <label className="block text-neutral-300 text-xs font-medium mb-1.5 flex items-center gap-2">
                          <Lock size={14} className="text-red-500" />
                          Password
                        </label>
                        <motion.div whileFocus={{ scale: 1.01 }} className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Enter your password"
                            className="w-full px-4 py-2.5 bg-black/50 border border-neutral-800 rounded-xl text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-300"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-red-500 transition"
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </motion.div>
                      </div>

                      {/* Remember Me & Forgot Password */}
                      <div className="flex items-center justify-between text-xs">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            name="rememberMe"
                            checked={formData.rememberMe}
                            onChange={handleInputChange}
                            className="w-3.5 h-3.5 bg-black border-neutral-700 rounded accent-red-600 cursor-pointer"
                          />
                          <span className="text-neutral-400 group-hover:text-white transition">Remember Me</span>
                        </label>
                        <button type="button" className="text-red-500 hover:text-red-400 font-medium transition cursor-pointer">
                          Forgot Password?
                        </button>
                      </div>

                      {/* Sign In Button */}
                      <motion.button
                        whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(239, 68, 68, 0.4)" }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full bg-gradient-to-r from-red-600 via-red-500 to-red-700 hover:from-red-700 hover:via-red-600 hover:to-red-800 text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-red-900/50 mt-2"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        Sign In Now
                      </motion.button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="signup"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl font-bold text-white mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Create Account
                    </h2>
                    <p className="text-neutral-400 text-xs mb-5">
                      Already have an account?{' '}
                      <button
                        onClick={() => setIsSignIn(true)}
                        className="text-red-500 hover:text-red-400 font-semibold transition"
                      >
                        Sign in
                      </button>
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Email Field */}
                      <div className="group">
                        <label className="block text-neutral-300 text-xs font-medium mb-1.5 flex items-center gap-2">
                          <Mail size={14} className="text-red-500" />
                          Email Address
                        </label>
                        <motion.div whileFocus={{ scale: 1.01 }} className="relative">
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="your.email@example.com"
                            className="w-full px-4 py-2.5 bg-black/50 border border-neutral-800 rounded-xl text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-300"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          />
                        </motion.div>
                      </div>

                      {/* Password Field */}
                      <div className="group">
                        <label className="text-neutral-300 text-xs font-medium mb-1.5 flex items-center gap-2">
                          <Lock size={14} className="text-red-500" />
                          Password
                        </label>
                        <motion.div whileFocus={{ scale: 1.01 }} className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Create a strong password"
                            className="w-full px-4 py-2.5 bg-black/50 border border-neutral-800 rounded-xl text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-300"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-red-500 transition cursor-pointer"
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </motion.div>
                      </div>

                      {/* Confirm Password Field */}
                      <div className="group">
                        <label className="text-neutral-300 text-xs font-medium mb-1.5 flex items-center gap-2">
                          <Lock size={14} className="text-red-500" />
                          Confirm Password
                        </label>
                        <motion.div whileFocus={{ scale: 1.01 }} className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="Confirm your password"
                            className="w-full px-4 py-2.5 bg-black/50 border border-neutral-800 rounded-xl text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-300"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-red-500 transition cursor-pointer"
                          >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </motion.div>
                      </div>

                      {/* Sign Up Button */}
                      <motion.button
                        whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(239, 68, 68, 0.4)" }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full bg-gradient-to-r from-red-600 via-red-500 to-red-700 hover:from-red-700 hover:via-red-600 hover:to-red-800 text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-red-900/50 mt-2 cursor-pointer"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        Create Account
                      </motion.button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent"></div>
                <span className="text-neutral-500 text-[10px] font-medium">OR CONTINUE WITH</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent"></div>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-3 gap-2.5">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  className="flex items-center justify-center p-2.5 bg-black/50 border border-neutral-800 rounded-xl hover:border-red-500/50 transition-all duration-300 group cursor-pointer"
                >
                  <svg className="w-4 h-4 group-hover:scale-110 transition" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#4285F4"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  className="flex items-center justify-center p-2.5 bg-black/50 border border-neutral-800 rounded-xl hover:border-red-500/50 transition-all duration-300 group cursor-pointer"
                >
                  <svg className="w-4 h-4 text-blue-600 group-hover:scale-110 transition" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  className="flex items-center justify-center p-2.5 bg-black/50 border border-neutral-800 rounded-xl hover:border-red-500/50 transition-all duration-300 group cursor-pointer"
                >
                  <svg className="w-4 h-4 group-hover:scale-110 transition" viewBox="0 0 24 24" fill="white">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </motion.button>
              </div>

              {/* Footer Text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-center text-neutral-500 text-[10px] mt-5"
              >
                By continuing, you agree to our{' '}
                <Link href="/terms" className="text-red-500 hover:text-red-400 transition cursor-pointer underline">
                  Terms
                </Link>
                {' & '}
                <Link href="/privacy" className="text-red-500 hover:text-red-400 transition cursor-pointer underline">
                  Privacy Policy
                </Link>
              </motion.p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
