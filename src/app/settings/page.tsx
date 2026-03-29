'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import {
  User,
  Bell,
  Globe,
  Download,
  Trash2,
  Shield,
  Moon,
  Sun,
  Save,
  Sparkles,
  Camera,
  Upload,
  X,
  Check,
  AlertTriangle,
  Eye,
  EyeOff,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Lock,
  Key,
  FileJson,
  CheckCircle2,
  XCircle,
  Loader2,
  Edit3,
  UserCircle
} from 'lucide-react';
import Image from 'next/image';
import FloatingImages from '@/components/FloatingImages';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage, languages } from '@/contexts/LanguageContext';
import { TourButton } from '@/components/NewTourButton';
import toast, { Toaster } from 'react-hot-toast';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  bio: string;
  location: string;
  joinedDate: string;
  timezone: string;
  profileImage: string | null;
  notifications: {
    moodReminder: boolean;
    habitReminder: boolean;
    sleepReminder: boolean;
    weeklyInsights: boolean;
    emailNotifications: boolean;
    pushNotifications: boolean;
  };
  preferences: {
    theme: string;
    language: string;
    weekStart: string;
  };
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Alex Johnson',
  email: 'alex@reveura.com',
  phone: '+1 (555) 123-4567',
  bio: 'Passionate about mental wellness and personal growth. On a journey to become the best version of myself.',
  location: 'New York, NY',
  joinedDate: '2025-12-01',
  timezone: 'America/New_York',
  profileImage: null,
  notifications: {
    moodReminder: true,
    habitReminder: true,
    sleepReminder: true,
    weeklyInsights: true,
    emailNotifications: true,
    pushNotifications: false,
  },
  preferences: {
    theme: 'dark',
    language: 'en',
    weekStart: 'monday'
  }
};

export default function Settings() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [originalProfile, setOriginalProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [activeTab, setActiveTab] = useState('profile');
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isExporting, setIsExporting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { soundEnabled, toggleSound } = require('@/contexts/SoundContext').useSound();
  const { playClickSound } = require('@/hooks/useSoundEffects').useSoundEffects();

  // Load profile from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('reveura_user_profile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        // Merge saved profile with default profile to ensure all fields exist
        const mergedProfile = {
          ...DEFAULT_PROFILE,
          ...parsed,
          notifications: {
            ...DEFAULT_PROFILE.notifications,
            ...(parsed.notifications || {})
          },
          preferences: {
            ...DEFAULT_PROFILE.preferences,
            ...(parsed.preferences || {})
          }
        };
        setProfile(mergedProfile);
        setOriginalProfile(mergedProfile);
      } catch (e) {
        console.error('Error loading profile:', e);
      }
    }
  }, []);

  // Track changes
  useEffect(() => {
    const changed = JSON.stringify(profile) !== JSON.stringify(originalProfile);
    setHasChanges(changed);
  }, [profile, originalProfile]);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Globe },
    { id: 'privacy', label: 'Privacy & Data', icon: Shield },
  ];

  // Handle profile image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setProfile(prev => ({ ...prev, profileImage: base64 }));
        toast.success('Profile picture updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfileImage = () => {
    setProfile(prev => ({ ...prev, profileImage: null }));
    toast.success('Profile picture removed');
  };

  // Save changes
  const handleSaveChanges = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    localStorage.setItem('reveura_user_profile', JSON.stringify(profile));
    setOriginalProfile(profile);
    setHasChanges(false);
    setIsSaving(false);
    
    toast.custom((t) => (
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-gradient-to-r from-green-600 to-emerald-600 border border-green-400/50 rounded-2xl p-4 shadow-2xl shadow-green-500/30 flex items-center gap-3"
      >
        <CheckCircle2 className="w-6 h-6 text-white" />
        <div>
          <p className="text-white font-bold">Changes Saved!</p>
          <p className="text-green-100 text-sm">Your profile has been updated successfully</p>
        </div>
      </motion.div>
    ), { duration: 3000 });
  };

  // Export data
  const handleExportData = async () => {
    setIsExporting(true);
    
    // Simulate gathering data
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const exportData = {
      profile: {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        bio: profile.bio,
        location: profile.location,
        timezone: profile.timezone,
        joinedDate: profile.joinedDate,
      },
      settings: {
        notifications: profile.notifications,
        preferences: profile.preferences,
      },
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reveura-data-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setIsExporting(false);
    toast.success('Data exported successfully!');
  };

  // Delete account
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      toast.error('Please type DELETE to confirm');
      return;
    }
    
    // Clear all data
    localStorage.removeItem('reveura_user_profile');
    localStorage.clear();
    
    toast.success('Account deleted. Redirecting...');
    setShowDeleteModal(false);
    
    // Simulate redirect
    setTimeout(() => {
      window.location.href = '/';
    }, 2000);
  };

  // Change password
  const handleChangePassword = async () => {
    if (passwordData.new !== passwordData.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordData.new.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    
    // Simulate password change
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setShowPasswordModal(false);
    setPasswordData({ current: '', new: '', confirm: '' });
    toast.success('Password changed successfully!');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <DashboardLayout>
      <Toaster position="top-center" />
      <FloatingImages images={['4.1.jpg', '4.2.jpg', '1.1.jpg']} />
      <TourButton variant="inline" label="Help & Tour" />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6 relative z-10"
      >
        {/* Header with Profile Image */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative overflow-hidden rounded-3xl h-64"
        >
          <div className="absolute inset-0 image-hover-zoom">
            <Image
              src="/4.jpg"
              alt="Profile Background"
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
          <div className="relative z-10 h-full flex items-center px-10">
            <div className="flex items-center gap-6 profile-section">
              {/* Profile Image with Upload */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative group"
              >
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-red-500 shadow-2xl shadow-red-500/50 bg-gradient-to-br from-red-600 to-red-800">
                  {profile.profileImage ? (
                    <img
                      src={profile.profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <UserCircle className="w-16 h-16 text-white/80" />
                    </div>
                  )}
                </div>
                
                {/* Upload overlay */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center"
                >
                  <Camera className="w-8 h-8 text-white" />
                </div>
                
                {/* Online indicator */}
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-black" />
                
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </motion.div>
              
              <div>
                <h1 className="font-bold text-white mb-2" style={{ fontFamily: "var(--font-display)", fontSize: "var(--font-display-md)" }}>
                  {t('settings.title')}
                </h1>
                <p className="text-neutral-200" style={{ fontFamily: "var(--font-body)", fontSize: "var(--font-body-md)" }}>{t('settings.subtitle')}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Unsaved Changes Banner */}
        <AnimatePresence>
          {hasChanges && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-500/50 rounded-2xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <p className="text-amber-200">{t('settings.unsavedChanges')}</p>
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setProfile(originalProfile);
                    toast.success('Changes discarded');
                  }}
                  className="px-4 py-2 bg-neutral-800 text-white rounded-xl text-sm font-medium hover:bg-neutral-700 transition"
                >
                  Discard
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    playClickSound();
                    handleSaveChanges();
                  }}
                  disabled={isSaving}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl text-sm font-medium flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Tabs */}
          <div className="lg:col-span-1">
            <div className={`rounded-2xl p-4 shadow-xl border ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-neutral-900 to-black border-red-900/30'
                : 'bg-gradient-to-br from-white to-gray-50 border-red-200'
            }`}>
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <motion.button
                      key={tab.id}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-900/50'
                          : theme === 'dark'
                          ? 'text-white hover:text-white hover:bg-neutral-800/50'
                          : 'text-black hover:text-gray-900 hover:bg-gray-200/50'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium text-sm">{tab.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className={`rounded-2xl p-8 shadow-xl border ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-neutral-900 to-black border-red-900/30'
                : 'bg-gradient-to-br from-white to-gray-50 border-red-200'
            }`}>
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className={`font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-heading-md)" }}>
                      Profile Information
                    </h2>
                    <p className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'}`} style={{ fontFamily: "var(--font-body)", fontSize: "var(--font-body-sm)" }}>
                      Update your personal details and profile picture
                    </p>
                  </div>

                  {/* Profile Picture Section */}
                  <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-neutral-800/30 border-neutral-700' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center gap-6">
                      <div className="relative group">
                        <div className={`w-24 h-24 rounded-2xl overflow-hidden border-2 ${theme === 'dark' ? 'border-neutral-600' : 'border-gray-300'}`}>
                          {profile.profileImage ? (
                            <img
                              src={profile.profileImage}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                              <User className="w-10 h-10 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Profile Picture
                        </h3>
                        <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'}`}>
                          JPG, PNG or GIF. Max size 5MB.
                        </p>
                        <div className="flex gap-3">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl text-sm font-medium"
                          >
                            <Upload className="w-4 h-4" />
                            Upload
                          </motion.button>
                          {profile.profileImage && (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={removeProfileImage}
                              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${
                                theme === 'dark' 
                                  ? 'bg-neutral-700 text-white hover:bg-neutral-600' 
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              <X className="w-4 h-4" />
                              Remove
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Profile Details */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${theme === 'dark' ? 'text-neutral-300' : 'text-gray-700'}`}>
                        <User className="w-4 h-4" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition ${
                          theme === 'dark'
                            ? 'bg-black/50 border-neutral-800 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${theme === 'dark' ? 'text-neutral-300' : 'text-gray-700'}`}>
                        <Mail className="w-4 h-4" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition ${
                          theme === 'dark'
                            ? 'bg-black/50 border-neutral-800 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="Enter your email"
                      />
                    </div>

                    <div>
                      <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${theme === 'dark' ? 'text-neutral-300' : 'text-gray-700'}`}>
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition ${
                          theme === 'dark'
                            ? 'bg-black/50 border-neutral-800 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>

                    <div>
                      <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${theme === 'dark' ? 'text-neutral-300' : 'text-gray-700'}`}>
                        <MapPin className="w-4 h-4" />
                        Location
                      </label>
                      <input
                        type="text"
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition ${
                          theme === 'dark'
                            ? 'bg-black/50 border-neutral-800 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="City, Country"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${theme === 'dark' ? 'text-neutral-300' : 'text-gray-700'}`}>
                      <Edit3 className="w-4 h-4" />
                      Bio
                    </label>
                    <textarea
                      value={profile.bio || ''}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      rows={4}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition resize-none ${
                        theme === 'dark'
                          ? 'bg-black/50 border-neutral-800 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="Tell us about yourself..."
                    />
                    <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-neutral-500' : 'text-gray-500'}`}>
                      {(profile.bio || '').length}/500 characters
                    </p>
                  </div>

                  {/* Timezone */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${theme === 'dark' ? 'text-neutral-300' : 'text-gray-700'}`}>
                        <Globe className="w-4 h-4" />
                        Timezone
                      </label>
                      <select
                        value={profile.timezone}
                        onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition ${
                          theme === 'dark'
                            ? 'bg-black/50 border-neutral-800 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="America/New_York">Eastern Time (ET)</option>
                        <option value="America/Chicago">Central Time (CT)</option>
                        <option value="America/Denver">Mountain Time (MT)</option>
                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                        <option value="Europe/London">London (GMT)</option>
                        <option value="Europe/Paris">Paris (CET)</option>
                        <option value="Asia/Tokyo">Tokyo (JST)</option>
                        <option value="Asia/Shanghai">Shanghai (CST)</option>
                        <option value="Asia/Kolkata">India (IST)</option>
                        <option value="Australia/Sydney">Sydney (AEST)</option>
                      </select>
                    </div>

                    <div>
                      <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${theme === 'dark' ? 'text-neutral-300' : 'text-gray-700'}`}>
                        <Calendar className="w-4 h-4" />
                        Member Since
                      </label>
                      <div className={`px-4 py-3 border rounded-xl ${
                        theme === 'dark'
                          ? 'bg-neutral-800/50 border-neutral-700 text-neutral-400'
                          : 'bg-gray-100 border-gray-300 text-gray-600'
                      }`}>
                        {formatDate(profile.joinedDate)}
                      </div>
                    </div>
                  </div>

                  {/* Password Change */}
                  <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-neutral-800/30 border-neutral-700' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                          <Lock className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Password & Security</h3>
                          <p className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'}`}>
                            Update your password to keep your account secure
                          </p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowPasswordModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition"
                      >
                        <Key className="w-4 h-4" />
                        Change Password
                      </motion.button>
                    </div>
                  </div>

                  {/* Save Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSaveChanges}
                    disabled={!hasChanges || isSaving}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition ${
                      hasChanges
                        ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-900/50'
                        : theme === 'dark'
                        ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Changes
                      </>
                    )}
                  </motion.button>
                </motion.div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6 notifications-section"
                >
                  <div>
                    <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Notification Preferences
                    </h2>
                    <p className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'}`}>
                      Stay on track with gentle reminders for your mental wellness journey
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { key: 'moodReminder', title: 'Mood Reminders', desc: 'Daily reminder to check-in with your emotions' },
                      { key: 'habitReminder', title: 'Habit Reminders', desc: 'Stay consistent with your self-care routines' },
                      { key: 'sleepReminder', title: 'Sleep Reminders', desc: 'Bedtime reminders for better rest and recovery' },
                      { key: 'weeklyInsights', title: 'Weekly Insights', desc: 'Weekly emotional patterns and wellness summary' },
                      { key: 'emailNotifications', title: 'Email Notifications', desc: 'Receive updates and tips via email' },
                      { key: 'pushNotifications', title: 'Push Notifications', desc: 'Get instant alerts on your device' },
                    ].map(({ key, title, desc }) => (
                      <motion.div
                        key={key}
                        whileHover={{ x: 4 }}
                        className={`flex items-center justify-between p-5 border rounded-2xl transition-all ${
                          theme === 'dark'
                            ? 'bg-neutral-800/50 border-neutral-700 hover:border-red-500/50'
                            : 'bg-white border-gray-200 hover:border-red-300'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            (profile.notifications as Record<string, boolean>)[key] 
                              ? 'bg-red-500/20 text-red-500' 
                              : theme === 'dark' ? 'bg-neutral-700 text-neutral-500' : 'bg-gray-100 text-gray-400'
                          }`}>
                            <Bell className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              {title}
                            </h3>
                            <p className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'}`}>
                              {desc}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setProfile({
                            ...profile,
                            notifications: { 
                              ...profile.notifications, 
                              [key]: !(profile.notifications as Record<string, boolean>)[key] 
                            }
                          })}
                          className={`relative w-14 h-8 rounded-full transition-all ${
                            (profile.notifications as Record<string, boolean>)[key] 
                              ? 'bg-gradient-to-r from-red-500 to-red-600 shadow-lg shadow-red-500/30' 
                              : theme === 'dark' ? 'bg-neutral-700' : 'bg-gray-300'
                          }`}
                        >
                          <motion.div
                            animate={{ x: (profile.notifications as Record<string, boolean>)[key] ? 24 : 2 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center"
                          >
                            {(profile.notifications as Record<string, boolean>)[key] ? (
                              <Check className="w-3 h-3 text-red-500" />
                            ) : null}
                          </motion.div>
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      App Preferences
                    </h2>
                    <p className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'}`}>
                      Customize your experience
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Theme */}
                    <div>
                      <label className={`flex items-center gap-2 text-sm font-medium mb-3 ${theme === 'dark' ? 'text-neutral-300' : 'text-gray-700'}`}>
                        <Sparkles className="w-4 h-4 text-red-500" />
                        Theme
                      </label>
                      <div className="grid grid-cols-2 gap-4 theme-toggle">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            if (theme !== 'dark') {
                              playClickSound();
                              toggleTheme();
                            }
                          }}
                          className={`group relative overflow-hidden flex items-center gap-3 p-5 rounded-2xl border-2 transition-all ${
                            theme === 'dark'
                              ? 'bg-gradient-to-br from-slate-900 to-black border-red-500 shadow-lg shadow-red-500/20'
                              : 'bg-neutral-800/30 border-neutral-700 hover:border-red-500/50'
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            theme === 'dark' 
                              ? 'bg-gradient-to-br from-indigo-600 to-purple-700' 
                              : 'bg-neutral-700'
                          }`}>
                            <Moon size={24} className="text-white" />
                          </div>
                          <div className="text-left flex-1">
                            <h3 className="text-white font-bold text-base">Dark</h3>
                            <p className="text-neutral-400 text-xs">Easy on the eyes</p>
                          </div>
                          {theme === 'dark' && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-3 right-3"
                            >
                              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            </motion.div>
                          )}
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            if (theme !== 'light') {
                              playClickSound();
                              toggleTheme();
                            }
                          }}
                          className={`group relative overflow-hidden flex items-center gap-3 p-5 rounded-2xl border-2 transition-all ${
                            theme === 'light'
                              ? 'bg-gradient-to-br from-amber-50 to-orange-100 border-red-500 shadow-lg shadow-red-500/20'
                              : 'bg-neutral-800/30 border-neutral-700 hover:border-red-500/50'
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            theme === 'light' 
                              ? 'bg-gradient-to-br from-amber-400 to-orange-500' 
                              : 'bg-neutral-700'
                          }`}>
                            <Sun size={24} className="text-white" />
                          </div>
                          <div className="text-left flex-1">
                            <h3 className={`font-bold text-base ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Light</h3>
                            <p className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-neutral-400'}`}>Bright and clear</p>
                          </div>
                          {theme === 'light' && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-3 right-3"
                            >
                              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            </motion.div>
                          )}
                        </motion.button>
                      </div>
                    </div>

                    {/* Sound Effects */}
                    <div>
                      <label className={`flex items-center gap-2 text-sm font-medium mb-3 ${theme === 'dark' ? 'text-neutral-300' : 'text-gray-700'}`}>
                        <Sparkles className="w-4 h-4 text-red-500" />
                        Sound Effects
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            if (!soundEnabled) {
                              toggleSound();
                              playClickSound();
                            }
                          }}
                          className={`group relative overflow-hidden flex items-center gap-3 p-5 rounded-2xl border-2 transition-all ${
                            soundEnabled
                              ? 'bg-gradient-to-br from-green-900 to-emerald-800 border-red-500 shadow-lg shadow-red-500/20'
                              : 'bg-neutral-800/30 border-neutral-700 hover:border-red-500/50'
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            soundEnabled 
                              ? 'bg-gradient-to-br from-green-600 to-emerald-700' 
                              : 'bg-neutral-700'
                          }`}>
                            <Bell size={24} className="text-white" />
                          </div>
                          <div className="text-left flex-1">
                            <h3 className="text-white font-bold text-base">Enabled</h3>
                            <p className="text-neutral-400 text-xs">Nature sounds</p>
                          </div>
                          {soundEnabled && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-3 right-3"
                            >
                              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            </motion.div>
                          )}
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            if (soundEnabled) {
                              toggleSound();
                            }
                          }}
                          className={`group relative overflow-hidden flex items-center gap-3 p-5 rounded-2xl border-2 transition-all ${
                            !soundEnabled
                              ? 'bg-gradient-to-br from-gray-800 to-slate-900 border-red-500 shadow-lg shadow-red-500/20'
                              : 'bg-neutral-800/30 border-neutral-700 hover:border-red-500/50'
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            !soundEnabled 
                              ? 'bg-gradient-to-br from-gray-600 to-slate-700' 
                              : 'bg-neutral-700'
                          }`}>
                            <EyeOff size={24} className="text-white" />
                          </div>
                          <div className="text-left flex-1">
                            <h3 className="text-white font-bold text-base">Disabled</h3>
                            <p className="text-neutral-400 text-xs">Silent mode</p>
                          </div>
                          {!soundEnabled && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-3 right-3"
                            >
                              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            </motion.div>
                          )}
                        </motion.button>
                      </div>
                    </div>

                    {/* Sound Test Button */}
                    {soundEnabled && (
                      <div>
                        <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${theme === 'dark' ? 'text-neutral-300' : 'text-gray-700'}`}>
                          <Sparkles className="w-4 h-4 text-red-500" />
                          Test Sounds
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => playClickSound()}
                            className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                              theme === 'dark'
                                ? 'border-neutral-700 bg-neutral-800/50 text-neutral-300 hover:border-red-500/50'
                                : 'border-gray-200 bg-white text-gray-600 hover:border-red-300'
                            }`}
                          >
                            🔘 Click
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              const { playWaterDropSound } = require('@/hooks/useSoundEffects').useSoundEffects();
                              playWaterDropSound();
                            }}
                            className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                              theme === 'dark'
                                ? 'border-neutral-700 bg-neutral-800/50 text-neutral-300 hover:border-red-500/50'
                                : 'border-gray-200 bg-white text-gray-600 hover:border-red-300'
                            }`}
                          >
                            💧 Water
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              const { playSoftClickSound } = require('@/hooks/useSoundEffects').useSoundEffects();
                              playSoftClickSound();
                            }}
                            className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                              theme === 'dark'
                                ? 'border-neutral-700 bg-neutral-800/50 text-neutral-300 hover:border-red-500/50'
                                : 'border-gray-200 bg-white text-gray-600 hover:border-red-300'
                            }`}
                          >
                            🔇 Soft
                          </motion.button>
                        </div>
                      </div>
                    )}

                    {/* Language */}
                    <div className="language-selector">
                      <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${theme === 'dark' ? 'text-neutral-300' : 'text-gray-700'}`}>
                        <Globe className="w-4 h-4" />
                        {t('settings.language')}
                      </label>
                      <select
                        value={language}
                        onChange={(e) => {
                          setLanguage(e.target.value as any);
                          setProfile({ 
                            ...profile, 
                            preferences: { ...profile.preferences, language: e.target.value } 
                          });
                          toast.success(`Language changed to ${languages.find(l => l.code === e.target.value)?.nativeName}`);
                        }}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition ${
                          theme === 'dark'
                            ? 'bg-black/50 border-neutral-800 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        {languages.map((lang) => (
                          <option key={lang.code} value={lang.code}>
                            {lang.nativeName} ({lang.name})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Week Start */}
                    <div>
                      <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${theme === 'dark' ? 'text-neutral-300' : 'text-gray-700'}`}>
                        <Calendar className="w-4 h-4" />
                        Week Starts On
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        {['sunday', 'monday'].map((day) => (
                          <motion.button
                            key={day}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              playClickSound();
                              setProfile({
                                ...profile,
                                preferences: { ...profile.preferences, weekStart: day }
                              });
                            }}
                            className={`p-4 rounded-xl border-2 font-medium capitalize transition-all ${
                              profile.preferences.weekStart === day
                                ? 'border-red-500 bg-red-500/10 text-red-400'
                                : theme === 'dark'
                                ? 'border-neutral-700 bg-neutral-800/50 text-neutral-400 hover:border-red-500/50'
                                : 'border-gray-200 bg-white text-gray-600 hover:border-red-300'
                            }`}
                          >
                            {day}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Privacy & Data
                    </h2>
                    <p className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'}`}>
                      Manage your data and privacy settings
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Export Data */}
                    <motion.button
                      whileHover={{ scale: 1.01, x: 4 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => {
                        playClickSound();
                        handleExportData();
                      }}
                      disabled={isExporting}
                      className={`w-full flex items-center gap-4 p-5 border rounded-2xl text-left transition-all ${
                        theme === 'dark'
                          ? 'bg-neutral-800/50 border-neutral-700 hover:border-blue-500/50'
                          : 'bg-white border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                        {isExporting ? (
                          <Loader2 className="w-7 h-7 text-white animate-spin" />
                        ) : (
                          <FileJson className="w-7 h-7 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-bold text-lg mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Export Your Data
                        </h3>
                        <p className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'}`}>
                          Download your profile, settings, and wellness data in JSON format
                        </p>
                      </div>
                      <Download className={`w-5 h-5 ${theme === 'dark' ? 'text-neutral-400' : 'text-gray-400'}`} />
                    </motion.button>

                    {/* Delete Account */}
                    <motion.button
                      whileHover={{ scale: 1.01, x: 4 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => {
                        playClickSound();
                        setShowDeleteModal(true);
                      }}
                      className={`w-full flex items-center gap-4 p-5 border rounded-2xl text-left transition-all ${
                        theme === 'dark'
                          ? 'bg-neutral-800/50 border-neutral-700 hover:border-red-500/50'
                          : 'bg-white border-gray-200 hover:border-red-300'
                      }`}
                    >
                      <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30">
                        <Trash2 className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-bold text-lg mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Delete Account
                        </h3>
                        <p className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'}`}>
                          Permanently remove your account and all wellness data
                        </p>
                      </div>
                      <XCircle className="w-5 h-5 text-red-500" />
                    </motion.button>

                    {/* Privacy Info */}
                    <div className={`border rounded-2xl p-6 mt-6 ${
                      theme === 'dark'
                        ? 'bg-gradient-to-br from-neutral-800/30 to-neutral-900/30 border-neutral-700'
                        : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'
                    }`}>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className={`font-bold text-lg mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            Privacy-First Design
                          </h3>
                          <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-neutral-400' : 'text-gray-700'}`}>
                            Reveura puts your privacy first. Your emotional data is encrypted and stored securely with no ads or external tracking.
                            You have complete control over your wellness data - export, delete, or manage it anytime. We believe mental health
                            tracking should be personal, safe, and transparent.
                          </p>
                          <div className="flex flex-wrap gap-3 mt-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              theme === 'dark' ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                            }`}>
                              End-to-End Encryption
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              theme === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'
                            }`}>
                              No Third-Party Tracking
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              theme === 'dark' ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700'
                            }`}>
                              GDPR Compliant
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Delete Account Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-8"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-900 to-slate-950 border border-red-500/30 rounded-3xl p-8 max-w-md w-full shadow-2xl shadow-red-500/20"
            >
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Delete Account?</h2>
                <p className="text-neutral-400">
                  This action is permanent and cannot be undone. All your data will be permanently deleted.
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Type <span className="text-red-500 font-bold">DELETE</span> to confirm
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="w-full px-4 py-3 bg-black/50 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-red-500"
                  placeholder="DELETE"
                />
              </div>

              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmText('');
                  }}
                  className="flex-1 py-3 bg-neutral-800 text-white rounded-xl font-medium hover:bg-neutral-700 transition"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== 'DELETE'}
                  className={`flex-1 py-3 rounded-xl font-medium transition ${
                    deleteConfirmText === 'DELETE'
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white'
                      : 'bg-neutral-700 text-neutral-500 cursor-not-allowed'
                  }`}
                >
                  Delete Account
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Change Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-8"
            onClick={() => setShowPasswordModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-900 to-slate-950 border border-purple-500/30 rounded-3xl p-8 max-w-md w-full shadow-2xl shadow-purple-500/20"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Key className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Change Password</h2>
                </div>
                <button onClick={() => setShowPasswordModal(false)} className="text-neutral-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwordData.current}
                      onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                      className="w-full px-4 py-3 bg-black/50 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-purple-500 pr-12"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                    >
                      {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordData.new}
                      onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                      className="w-full px-4 py-3 bg-black/50 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-purple-500 pr-12"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                    >
                      {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">Minimum 8 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordData.confirm}
                      onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                      className="w-full px-4 py-3 bg-black/50 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-purple-500 pr-12"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                    >
                      {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {passwordData.new && passwordData.confirm && passwordData.new !== passwordData.confirm && (
                    <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
                  )}
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordData({ current: '', new: '', confirm: '' });
                  }}
                  className="flex-1 py-3 bg-neutral-800 text-white rounded-xl font-medium hover:bg-neutral-700 transition"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleChangePassword}
                  disabled={!passwordData.current || !passwordData.new || passwordData.new !== passwordData.confirm}
                  className={`flex-1 py-3 rounded-xl font-medium transition ${
                    passwordData.current && passwordData.new && passwordData.new === passwordData.confirm
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                      : 'bg-neutral-700 text-neutral-500 cursor-not-allowed'
                  }`}
                >
                  Update Password
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
