// src/components/SettingsView.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User, Shield, Link, CreditCard, Check, X, Upload,
  Smartphone, Bell, ArrowUpRight, LogOut, AlertTriangle
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// Interface for payment methods
interface PaymentMethod {
  id: string;
  type: 'bank' | 'paypal';
  last4?: string;
  email?: string;
  default: boolean;
  addedOn: string;
}

// Interface for connected accounts
interface ConnectedAccount {
  platform: string;
  username: string;
  followers: string;
  lastSync: string;
  isVerified: boolean;
}

// Main Settings component
const SettingsView: React.FC = () => {
  // Active section state
  const [activeSection, setActiveSection] = useState<string>('profile');
  
  // User profile state
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    avatar: '/api/placeholder/100/100',
    notificationPreferences: {
      email: true,
      push: true,
      campaigns: true,
      payments: true,
      platform: false
    }
  });
  
  // Password state
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  
  // Payment methods state
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 'pm_1',
      type: 'bank',
      last4: '4321',
      default: true,
      addedOn: '2025-01-15'
    },
    {
      id: 'pm_2',
      type: 'paypal',
      email: 'creator@example.com',
      default: false,
      addedOn: '2025-02-10'
    }
  ]);
  
  // Connected accounts state
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([
    {
      platform: 'tiktok',
      username: 'creator',
      followers: '500K',
      lastSync: '2025-03-01',
      isVerified: true
    },
    {
      platform: 'instagram',
      username: 'creator',
      followers: '180K',
      lastSync: '2025-03-01',
      isVerified: true
    },
    {
      platform: 'youtube',
      username: 'creator',
      followers: '250K',
      lastSync: '2025-02-28',
      isVerified: true
    },
    {
      platform: 'twitter',
      username: 'creator',
      followers: '75K',
      lastSync: '2025-03-01',
      isVerified: false
    }
  ]);
  
  // Payout settings
  const [payoutSettings, setPayoutSettings] = useState({
    minAmount: '100',
    frequency: 'monthly'
  });
  
  // Form flags
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState<'bank' | 'paypal' | null>(null);
  
  const router = useRouter();
  
  // Load user data on component mount
  useEffect(() => {
    // In a real app, this would fetch from an API
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        setUserProfile(prev => ({
          ...prev,
          name: parsedData.name || prev.name,
          email: parsedData.email || prev.email
        }));
      } catch (error) {
        console.error('Error parsing user data', error);
      }
    }
  }, []);
  
  // Get icon for platform
  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'youtube':
        return (
          <svg className="h-5 w-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        );
      case 'instagram':
        return (
          <svg className="h-5 w-5 text-pink-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
          </svg>
        );
      case 'tiktok':
        return (
          <svg className="h-5 w-5 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.12 1.13.43 2.27 1.22 3.06.83.82 1.95 1.15 3.07 1.4v3.12c-1.02-.02-2.05-.25-3-.75-.57-.3-1.08-.71-1.53-1.17-.01 1.8.01 3.61 0 5.42-.07 1.83-.69 3.72-2 5.08-1.57 1.68-3.95 2.51-6.26 2.36-1.43-.08-2.83-.49-4.08-1.21C1.55 16.06.38 13.13 1.14 10.5c.7-2.55 2.94-4.51 5.5-5.08 1.38-.31 2.84-.14 4.2.18v3.34c-.67-.26-1.41-.38-2.14-.29-1.25.17-2.4 1.05-2.94 2.24-.61 1.33-.47 3.05.55 4.16.88.97 2.21 1.39 3.53 1.27 1.24-.09 2.48-.78 3.08-1.81.4-.68.61-1.47.61-2.25l.01-9.32c-.01-.53-.01-1.07-.01-1.59z"/>
          </svg>
        );
      case 'twitter':
        return (
          <svg className="h-5 w-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
          </svg>
        );
      default:
        return <Link className="h-5 w-5" />;
    }
  };
  
  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith('password.')) {
      const field = name.split('.')[1];
      setPasswordForm(prev => ({
        ...prev,
        [field]: value
      }));
      return;
    }
    
    if (name.startsWith('payout.')) {
      const field = name.split('.')[1];
      setPayoutSettings(prev => ({
        ...prev,
        [field]: value
      }));
      return;
    }
    
    if (name.startsWith('notification.')) {
      const field = name.split('.')[1];
      setUserProfile(prev => ({
        ...prev,
        notificationPreferences: {
          ...prev.notificationPreferences,
          [field]: (e.target as HTMLInputElement).checked
        }
      }));
      return;
    }
    
    setUserProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Save profile changes
  const saveProfile = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update localStorage
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        localStorage.setItem('userData', JSON.stringify({
          ...parsedData,
          name: userProfile.name,
          email: userProfile.email
        }));
      } catch (error) {
        console.error('Error updating user data', error);
      }
    }
    
    setIsSaving(false);
    setShowSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };
  
  // Handle password update
  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSaving(false);
    setShowSuccess(true);
    
    // Reset form and hide success message after 3 seconds
    setPasswordForm({ current: '', new: '', confirm: '' });
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };
  
  // Make payment method default
  const setDefaultPaymentMethod = (id: string) => {
    setPaymentMethods(prev => 
      prev.map(method => ({
        ...method,
        default: method.id === id
      }))
    );
  };
  
  // Remove payment method
  const removePaymentMethod = (id: string) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== id));
  };
  
  // Add new payment method
  const addPaymentMethod = (type: 'bank' | 'paypal') => {
    setShowPaymentForm(type);
  };
  
  // Handle payment form submission
  const handlePaymentFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add a new payment method
    const newId = `pm_${Date.now()}`;
    
    if (showPaymentForm === 'bank') {
      setPaymentMethods(prev => [
        ...prev,
        {
          id: newId,
          type: 'bank',
          last4: '1234', // This would come from the form
          default: prev.length === 0, // Make default if it's the first one
          addedOn: new Date().toISOString().split('T')[0]
        }
      ]);
    } else if (showPaymentForm === 'paypal') {
      setPaymentMethods(prev => [
        ...prev,
        {
          id: newId,
          type: 'paypal',
          email: userProfile.email, // This would come from the form
          default: prev.length === 0, // Make default if it's the first one
          addedOn: new Date().toISOString().split('T')[0]
        }
      ]);
    }
    
    setShowPaymentForm(null);
  };
  
  // Save payout settings
  const savePayoutSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSaving(false);
    setShowSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };
  
  // Disconnect platform
  const disconnectPlatform = (platform: string) => {
    setConnectedAccounts(prev => 
      prev.filter(account => account.platform !== platform)
    );
  };
  
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
    router.push('/');
  };
  
  // Get content for profile section
  const renderProfileContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl md:text-2xl font-bold">Profile Settings</h2>
        
        {/* Success notification */}
        {showSuccess && (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-900 bg-opacity-20 text-green-400 text-sm rounded">
            <Check className="h-4 w-4" />
            <span>Saved successfully</span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile photo */}
        <div className="flex flex-col items-center">
          <div className="mb-4 relative group">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-white border-opacity-20">
              <img 
                src={userProfile.avatar} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <motion.button
              className="absolute bottom-0 right-0 bg-black border border-white border-opacity-20 rounded-full p-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Upload className="h-4 w-4" />
            </motion.button>
          </div>
          <p className="text-xs md:text-sm opacity-60 text-center max-w-xs">
            Upload a square image (JPG or PNG) for best results. Maximum size 5MB.
          </p>
        </div>
        
        {/* Profile form */}
        <div className="md:col-span-2 space-y-4">
          <div className="space-y-1">
            <label className="block text-sm opacity-70">Display Name</label>
            <input
              type="text"
              name="name"
              value={userProfile.name}
              onChange={handleInputChange}
              className="w-full bg-black bg-opacity-50 border border-white border-opacity-20 p-2 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
            />
          </div>
          
          <div className="space-y-1">
            <label className="block text-sm opacity-70">Email Address</label>
            <input
              type="email"
              name="email"
              value={userProfile.email}
              onChange={handleInputChange}
              className="w-full bg-black bg-opacity-50 border border-white border-opacity-20 p-2 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
            />
          </div>
          
          <div className="space-y-1">
            <label className="block text-sm opacity-70">Phone Number <span className="text-xs opacity-60">(Optional)</span></label>
            <input
              type="tel"
              name="phone"
              value={userProfile.phone}
              onChange={handleInputChange}
              className="w-full bg-black bg-opacity-50 border border-white border-opacity-20 p-2 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
              placeholder="+1 (555) 123-4567"
            />
          </div>
          
          <div className="space-y-1">
            <label className="block text-sm opacity-70">Creator Bio</label>
            <textarea
              name="bio"
              value={userProfile.bio}
              onChange={handleInputChange}
              className="w-full bg-black bg-opacity-50 border border-white border-opacity-20 p-2 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
              rows={4}
              placeholder="Tell brands a bit about yourself..."
            />
          </div>
          
          <motion.button
            onClick={saveProfile}
            className="px-4 py-2 mt-2 bg-gradient-to-r from-red-500 to-red-700 rounded-lg flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSaving}
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Saving...</span>
              </div>
            ) : (
              <span>Save Changes</span>
            )}
          </motion.button>
        </div>
      </div>
      
      {/* Notification preferences */}
      <div className="mt-8 pt-6 border-t border-white border-opacity-10">
        <h3 className="text-lg font-bold mb-4">Notification Preferences</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 border border-white border-opacity-10 rounded-lg">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-400" />
              <span>Email Notifications</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="notification.email"
                checked={userProfile.notificationPreferences.email}
                onChange={handleInputChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-3 border border-white border-opacity-10 rounded-lg">
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-purple-400" />
              <span>Push Notifications</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="notification.push"
                checked={userProfile.notificationPreferences.push}
                onChange={handleInputChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-3 border border-white border-opacity-10 rounded-lg">
            <div className="flex items-center gap-2">
              <ArrowUpRight className="h-5 w-5 text-green-400" />
              <span>New Campaign Alerts</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="notification.campaigns"
                checked={userProfile.notificationPreferences.campaigns}
                onChange={handleInputChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-3 border border-white border-opacity-10 rounded-lg">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-yellow-400" />
              <span>Payment Notifications</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="notification.payments"
                checked={userProfile.notificationPreferences.payments}
                onChange={handleInputChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
        </div>
        
        <motion.button
          onClick={saveProfile}
          className="px-4 py-2 mt-4 bg-gradient-to-r from-red-500 to-red-700 rounded-lg flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isSaving}
        >
          Save Notifications
        </motion.button>
      </div>
    </div>
  );

  // Get content for security section
  const renderSecurityContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl md:text-2xl font-bold">Security Settings</h2>
        
        {/* Success notification */}
        {showSuccess && (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-900 bg-opacity-20 text-green-400 text-sm rounded">
            <Check className="h-4 w-4" />
            <span>Password updated</span>
          </div>
        )}
      </div>
      
      {/* Password change form */}
      <div>
        <h3 className="text-lg font-bold mb-4">Change Password</h3>
        
        <form onSubmit={updatePassword} className="space-y-4 max-w-md">
          <div className="space-y-1">
            <label className="block text-sm opacity-70">Current Password</label>
            <input
              type="password"
              name="password.current"
              value={passwordForm.current}
              onChange={handleInputChange}
              className="w-full bg-black bg-opacity-50 border border-white border-opacity-20 p-2 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
            />
          </div>
          
          <div className="space-y-1">
            <label className="block text-sm opacity-70">New Password</label>
            <input
              type="password"
              name="password.new"
              value={passwordForm.new}
              onChange={handleInputChange}
              className="w-full bg-black bg-opacity-50 border border-white border-opacity-20 p-2 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
            />
          </div>
          
          <div className="space-y-1">
            <label className="block text-sm opacity-70">Confirm New Password</label>
            <input
              type="password"
              name="password.confirm"
              value={passwordForm.confirm}
              onChange={handleInputChange}
              className="w-full bg-black bg-opacity-50 border border-white border-opacity-20 p-2 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
            />
          </div>
          
          <ul className="text-xs space-y-1 opacity-60 list-disc pl-5">
            <li>Password must be at least 8 characters</li>
            <li>Include at least one uppercase letter</li>
            <li>Include at least one number</li>
            <li>Include at least one special character</li>
          </ul>
          
          <motion.button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-700 rounded-lg flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSaving}
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Updating...</span>
              </div>
            ) : (
              <span>Update Password</span>
            )}
          </motion.button>
        </form>
      </div>
      
      {/* Two-factor authentication */}
      <div className="mt-8 pt-6 border-t border-white border-opacity-10">
        <h3 className="text-lg font-bold mb-4">Two-Factor Authentication</h3>
        
        <div className="p-4 border border-white border-opacity-10 rounded-lg max-w-md">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-400" />
              <span className="font-bold">Two-Factor Authentication</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
          
          <p className="text-sm opacity-70 mb-4">
            Protect your account with an additional verification step each time you log in.
          </p>
          
          <motion.button
            className="px-4 py-2 border border-white border-opacity-20 rounded-lg text-sm"
            whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
          >
            Setup Two-Factor Authentication
          </motion.button>
        </div>
      </div>
      
      {/* Account deletion */}
      <div className="mt-8 pt-6 border-t border-white border-opacity-10">
        <h3 className="text-lg font-bold mb-4">Danger Zone</h3>
        
        <div className="p-4 border border-red-500 border-opacity-40 rounded-lg bg-red-900 bg-opacity-10">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-1" />
            <div>
              <p className="font-bold text-red-400 mb-2">Delete Account</p>
              <p className="text-sm mb-3 opacity-70">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <motion.button
                className="px-4 py-1.5 border border-red-500 text-red-400 rounded text-sm"
                whileHover={{ backgroundColor: "rgba(239,68,68,0.1)" }}
              >
                Delete Account
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Get content for connected accounts section
  const renderAccountsContent = () => (
    <div className="space-y-6">
      <h2 className="text-xl md:text-2xl font-bold">Connected Accounts</h2>
      
      {/* Connected platforms */}
      <div className="grid grid-cols-1 gap-4">
        {connectedAccounts.map((account, index) => (
          <motion.div 
            key={index}
            className="p-4 border border-white border-opacity-10 rounded-lg"
            whileHover={{ borderColor: 'rgba(255,255,255,0.3)' }}
          >
            <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-white bg-opacity-5">
                  {getPlatformIcon(account.platform)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold capitalize">{account.platform}</span>
                    {account.isVerified && (
                      <span className="text-xs bg-green-900 bg-opacity-20 text-green-400 px-2 py-0.5 rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-sm">
                    <span className="opacity-70">@{account.username}</span> • {account.followers} followers
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 ml-auto">
                <span className="text-xs opacity-60">
                  Last synced: {account.lastSync}
                </span>
                <div className="flex gap-2">
                  <motion.button
                    className="text-sm border border-white border-opacity-20 px-3 py-1 rounded"
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                  >
                    Refresh
                  </motion.button>
                  <motion.button
                    className="text-sm border border-red-500 border-opacity-40 text-red-400 px-3 py-1 rounded"
                    whileHover={{ backgroundColor: "rgba(239,68,68,0.1)" }}
                    onClick={() => disconnectPlatform(account.platform)}
                  >
                    Disconnect
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        
        {/* Add new platform */}
        <motion.div
          className="p-4 border border-dashed border-white border-opacity-10 rounded-lg"
          whileHover={{ borderColor: 'rgba(255,255,255,0.3)', backgroundColor: "rgba(255,255,255,0.03)" }}
        >
          <div className="flex flex-col items-center justify-center py-6">
            <Link className="h-8 w-8 mb-3 opacity-60" />
            <p className="mb-4 font-medium">Connect Additional Platform</p>
            <div className="flex flex-wrap justify-center gap-3">
              <motion.button
                className="px-4 py-2 border border-white border-opacity-20 rounded-lg flex items-center gap-2"
                whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
              >
                {getPlatformIcon('youtube')}
                <span>YouTube</span>
              </motion.button>
              <motion.button
                className="px-4 py-2 border border-white border-opacity-20 rounded-lg flex items-center gap-2"
                whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
              >
                {getPlatformIcon('instagram')}
                <span>Instagram</span>
              </motion.button>
              <motion.button
                className="px-4 py-2 border border-white border-opacity-20 rounded-lg flex items-center gap-2"
                whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
              >
                {getPlatformIcon('tiktok')}
                <span>TikTok</span>
              </motion.button>
              <motion.button
                className="px-4 py-2 border border-white border-opacity-20 rounded-lg flex items-center gap-2"
                whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
              >
                {getPlatformIcon('twitter')}
                <span>X (Twitter)</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  // Get content for payments section
  const renderPaymentsContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl md:text-2xl font-bold">Payment Settings</h2>
        
        {/* Success notification */}
        {showSuccess && (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-900 bg-opacity-20 text-green-400 text-sm rounded">
            <Check className="h-4 w-4" />
            <span>Settings updated</span>
          </div>
        )}
      </div>
      
      {/* Payment methods */}
      <div>
        <h3 className="text-lg font-bold mb-4">Payment Methods</h3>
        
        <div className="grid grid-cols-1 gap-4">
          {paymentMethods.map((method) => (
            <motion.div 
              key={method.id}
              className={`p-4 border ${method.default ? 'border-green-500 border-opacity-40 bg-green-900 bg-opacity-5' : 'border-white border-opacity-10'} rounded-lg`}
              whileHover={{ borderColor: method.default ? 'rgba(52, 211, 153, 0.5)' : 'rgba(255,255,255,0.3)' }}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${method.default ? 'bg-green-900 bg-opacity-10' : 'bg-white bg-opacity-5'}`}>
                    {method.type === 'bank' ? (
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 22H22" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 6V2" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 6C13.1 6 14 6.9 14 8V10C14 11.1 13.1 12 12 12C10.9 12 10 11.1 10 10V8C10 6.9 10.9 6 12 6Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 17H8C5 17 3 15 3 12V10C3 7 5 5 8 5H16C19 5 21 7 21 10V12C21 15 19 17 16 17Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3.5 13.9597C4.6 16.6597 7.5 18.5997 12 18.5997C16.5 18.5997 19.4 16.6597 20.5 13.9597" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.5 13.75C9.5 14.72 10.25 15.5 11.17 15.5H13.05C13.85 15.5 14.5 14.82 14.5 13.97C14.5 13.06 14.1 12.73 13.51 12.52L10.5 11.47C9.91 11.26 9.51001 10.94 9.51001 10.02C9.51001 9.17999 10.16 8.48999 10.96 8.48999H12.84C13.76 8.48999 14.51 9.26999 14.51 10.24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 7.5V16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M17 3V7H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M22 2L17 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">
                        {method.type === 'bank' ? 'Bank Account' : 'PayPal'}
                      </span>
                      {method.default && (
                        <span className="text-xs bg-green-900 bg-opacity-20 text-green-400 px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm opacity-70">
                      {method.type === 'bank' ? `****${method.last4}` : method.email}
                      <span className="ml-2">• Added {method.addedOn}</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 ml-auto">
                  {!method.default && (
                    <motion.button
                      className="text-sm border border-white border-opacity-20 px-3 py-1 rounded"
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                      onClick={() => setDefaultPaymentMethod(method.id)}
                    >
                      Make Default
                    </motion.button>
                  )}
                  <motion.button
                    className="text-sm border border-white border-opacity-20 px-3 py-1 rounded"
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                  >
                    Edit
                  </motion.button>
                  <motion.button
                    className="text-sm border border-red-500 border-opacity-40 text-red-400 px-3 py-1 rounded"
                    whileHover={{ backgroundColor: "rgba(239,68,68,0.1)" }}
                    onClick={() => removePaymentMethod(method.id)}
                  >
                    Remove
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
          
          {/* Add new payment method */}
          {!showPaymentForm ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.button
                className="p-4 border border-dashed border-white border-opacity-10 rounded-lg flex items-center gap-3"
                whileHover={{ borderColor: 'rgba(255,255,255,0.3)', backgroundColor: "rgba(255,255,255,0.03)" }}
                onClick={() => addPaymentMethod('bank')}
              >
                <div className="p-2 rounded-full bg-white bg-opacity-5">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 22H22" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 6V2" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 6C13.1 6 14 6.9 14 8V10C14 11.1 13.1 12 12 12C10.9 12 10 11.1 10 10V8C10 6.9 10.9 6 12 6Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 17H8C5 17 3 15 3 12V10C3 7 5 5 8 5H16C19 5 21 7 21 10V12C21 15 19 17 16 17Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3.5 13.9597C4.6 16.6597 7.5 18.5997 12 18.5997C16.5 18.5997 19.4 16.6597 20.5 13.9597" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-bold">Add Bank Account</p>
                  <p className="text-xs opacity-70">Direct deposit to your bank account</p>
                </div>
              </motion.button>
              
              <motion.button
                className="p-4 border border-dashed border-white border-opacity-10 rounded-lg flex items-center gap-3"
                whileHover={{ borderColor: 'rgba(255,255,255,0.3)', backgroundColor: "rgba(255,255,255,0.03)" }}
                onClick={() => addPaymentMethod('paypal')}
              >
                <div className="p-2 rounded-full bg-white bg-opacity-5">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.5 13.75C9.5 14.72 10.25 15.5 11.17 15.5H13.05C13.85 15.5 14.5 14.82 14.5 13.97C14.5 13.06 14.1 12.73 13.51 12.52L10.5 11.47C9.91 11.26 9.51001 10.94 9.51001 10.02C9.51001 9.17999 10.16 8.48999 10.96 8.48999H12.84C13.76 8.48999 14.51 9.26999 14.51 10.24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 7.5V16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17 3V7H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 2L17 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-bold">Add PayPal</p>
                  <p className="text-xs opacity-70">Get paid directly to your PayPal account</p>
                </div>
              </motion.button>
            </div>
          ) : (
            // Payment method form
            <div className="p-4 border border-white border-opacity-10 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold flex items-center gap-2">
                  {showPaymentForm === 'bank' ? (
                    <>
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 22H22" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 6V2" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 6C13.1 6 14 6.9 14 8V10C14 11.1 13.1 12 12 12C10.9 12 10 11.1 10 10V8C10 6.9 10.9 6 12 6Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 17H8C5 17 3 15 3 12V10C3 7 5 5 8 5H16C19 5 21 7 21 10V12C21 15 19 17 16 17Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3.5 13.9597C4.6 16.6597 7.5 18.5997 12 18.5997C16.5 18.5997 19.4 16.6597 20.5 13.9597" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Add Bank Account
                    </>
                  ) : (
                    <>
                      <svg className="h-5 w-5 text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.5 13.75C9.5 14.72 10.25 15.5 11.17 15.5H13.05C13.85 15.5 14.5 14.82 14.5 13.97C14.5 13.06 14.1 12.73 13.51 12.52L10.5 11.47C9.91 11.26 9.51001 10.94 9.51001 10.02C9.51001 9.17999 10.16 8.48999 10.96 8.48999H12.84C13.76 8.48999 14.51 9.26999 14.51 10.24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 7.5V16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M17 3V7H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M22 2L17 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Add PayPal
                    </>
                  )}
                </h4>
                <motion.button
                  onClick={() => setShowPaymentForm(null)}
                  className="p-1 rounded-full hover:bg-white hover:bg-opacity-10"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>
              
              <form onSubmit={handlePaymentFormSubmit} className="space-y-4">
                {showPaymentForm === 'bank' ? (
                  <>
                    <div className="space-y-1">
                      <label className="block text-sm opacity-70">Account Holder Name</label>
                      <input
                        type="text"
                        className="w-full bg-black bg-opacity-50 border border-white border-opacity-20 p-2 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
                        placeholder="Full name on account"
                        required
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-sm opacity-70">Routing Number</label>
                      <input
                        type="text"
                        className="w-full bg-black bg-opacity-50 border border-white border-opacity-20 p-2 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
                        placeholder="9 digits"
                        maxLength={9}
                        required
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-sm opacity-70">Account Number</label>
                      <input
                        type="text"
                        className="w-full bg-black bg-opacity-50 border border-white border-opacity-20 p-2 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
                        placeholder="Account number"
                        required
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-sm opacity-70">Account Type</label>
                      <select
                        className="w-full bg-black bg-opacity-50 border border-white border-opacity-20 p-2 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
                        required
                      >
                        <option value="">Select account type</option>
                        <option value="checking">Checking</option>
                        <option value="savings">Savings</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <div className="space-y-1">
                    <label className="block text-sm opacity-70">PayPal Email</label>
                    <input
                      type="email"
                      defaultValue={userProfile.email}
                      className="w-full bg-black bg-opacity-50 border border-white border-opacity-20 p-2 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
                      placeholder="your@email.com"
                      required
                    />
                    <p className="text-xs opacity-60 mt-1">
                      Make sure this email is registered with PayPal.
                    </p>
                  </div>
                )}
                
                <div className="pt-2 flex gap-3">
                  <motion.button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-700 rounded-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Add Payment Method
                  </motion.button>
                  <motion.button
                    type="button"
                    className="px-4 py-2 border border-white border-opacity-20 rounded-lg"
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                    onClick={() => setShowPaymentForm(null)}
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
      
      {/* Payout preferences */}
      <div className="mt-8 pt-6 border-t border-white border-opacity-10">
        <h3 className="text-lg font-bold mb-4">Payout Preferences</h3>
        
        <form onSubmit={savePayoutSettings} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          <div className="space-y-1">
            <label className="block text-sm opacity-70">Minimum Payout Amount</label>
            <select
              name="payout.minAmount"
              value={payoutSettings.minAmount}
              onChange={handleInputChange}
              className="w-full bg-black bg-opacity-50 border border-white border-opacity-20 p-2 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
            >
              <option value="50">$50</option>
              <option value="100">$100</option>
              <option value="250">$250</option>
              <option value="500">$500</option>
            </select>
            <p className="text-xs opacity-60 mt-1">
              We'll hold your earnings until they reach this amount.
            </p>
          </div>
          
          <div className="space-y-1">
            <label className="block text-sm opacity-70">Payout Frequency</label>
            <select
              name="payout.frequency"
              value={payoutSettings.frequency}
              onChange={handleInputChange}
              className="w-full bg-black bg-opacity-50 border border-white border-opacity-20 p-2 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
            >
              <option value="monthly">Monthly (15th)</option>
              <option value="biweekly">Bi-weekly</option>
              <option value="weekly">Weekly</option>
            </select>
            <p className="text-xs opacity-60 mt-1">
              How often you want to receive payouts when above the minimum.
            </p>
          </div>
          
          <div className="pt-2 md:col-span-2">
            <motion.button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-700 rounded-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSaving}
            >
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Saving...</span>
                </div>
              ) : (
                <span>Save Preferences</span>
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );

  // Dynamic content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileContent();
      case 'security':
        return renderSecurityContent();
      case 'accounts':
        return renderAccountsContent();
      case 'payments':
        return renderPaymentsContent();
      case 'logout':
        // Handle logout immediately
        handleLogout();
        return null;
      default:
        return (
          <div className="text-center p-12">
            <p>Select a settings category to begin</p>
          </div>
        );
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-6">
      {/* Settings navigation sidebar */}
      <div className="md:w-64 flex-shrink-0">
        <div className="h-full border border-white border-opacity-10 rounded-lg overflow-hidden bg-black bg-opacity-70 backdrop-blur-sm">
          <nav className="space-y-1 p-1">
            {[
              { id: 'profile', label: 'Profile', icon: <User className="h-5 w-5" /> },
              { id: 'security', label: 'Security', icon: <Shield className="h-5 w-5" /> },
              { id: 'accounts', label: 'Connected Accounts', icon: <Link className="h-5 w-5" /> },
              { id: 'payments', label: 'Payments', icon: <CreditCard className="h-5 w-5" /> },
              { id: 'logout', label: 'Log Out', icon: <LogOut className="h-5 w-5" /> }
            ].map(item => (
              <motion.button
                key={item.id}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left ${
                  activeSection === item.id
                    ? 'bg-white bg-opacity-10 text-white'
                    : 'text-gray-300 hover:bg-white hover:bg-opacity-5'
                }`}
                onClick={() => setActiveSection(item.id)}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.1 }}
              >
                {item.icon}
                <span>{item.label}</span>
                {activeSection === item.id && (
                  <motion.div
                    className="ml-auto h-2 w-2 rounded-full bg-red-500"
                    layoutId="activeDot"
                  />
                )}
              </motion.button>
            ))}
          </nav>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex-grow">
        <div className="border border-white border-opacity-10 rounded-lg p-6 bg-black bg-opacity-70 backdrop-blur-sm">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SettingsView;