// src/components/SettingsView.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User, Shield, Link, CreditCard, Check, X,
  Bell, LogOut, AlertTriangle
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// Main Settings component
const SettingsView: React.FC = () => {
  // Active section state
  const [activeSection, setActiveSection] = useState<string>('profile');
  
  // User profile state (simplified)
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    notificationPreferences: {
      email: true,
      push: true,
      campaigns: true,
      payments: true
    }
  });
  
  // Payment methods state (simplified)
  const [paymentMethods, setPaymentMethods] = useState([
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
  
  // Connected accounts state (simplified)
  const [connectedAccounts, setConnectedAccounts] = useState([
    {
      platform: 'tiktok',
      username: 'creator',
      followers: '500K',
      isVerified: true
    },
    {
      platform: 'instagram',
      username: 'creator',
      followers: '180K',
      isVerified: true
    },
    {
      platform: 'youtube',
      username: 'creator',
      followers: '250K',
      isVerified: true
    }
  ]);
  
  // Form flags
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const router = useRouter();
  
  // Load user data on component mount
  useEffect(() => {
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
  
  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
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
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center text-2xl font-bold text-gray-400">
            {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h3 className="text-xl font-bold">{userProfile.name || 'Creator'}</h3>
            <p className="text-gray-400">{userProfile.email || 'creator@example.com'}</p>
          </div>
        </div>
        
        <div className="space-y-4 max-w-md">
          <div className="space-y-1">
            <label htmlFor="name" className="block text-sm">Display Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={userProfile.name}
              onChange={handleInputChange}
              className="w-full bg-gray-900 border border-gray-700 p-2 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
              aria-describedby="name-help"
            />
            <p id="name-help" className="text-xs text-gray-500">This is how your name will appear to brands and other creators.</p>
          </div>
          
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              value={userProfile.email}
              onChange={handleInputChange}
              className="w-full bg-gray-900 border border-gray-700 p-2 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
              aria-describedby="email-help"
            />
            <p id="email-help" className="text-xs text-gray-500">Used for account notifications and payments.</p>
          </div>
          
          <div className="space-y-1">
            <label htmlFor="bio" className="block text-sm">Creator Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={userProfile.bio}
              onChange={handleInputChange}
              className="w-full bg-gray-900 border border-gray-700 p-2 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
              rows={3}
              placeholder="Tell brands a bit about yourself..."
              aria-describedby="bio-help"
            />
            <p id="bio-help" className="text-xs text-gray-500">Brief description of your content style and audience.</p>
          </div>
          
          <motion.button
            onClick={saveProfile}
            className="px-4 py-2 mt-4 bg-red-600 rounded-lg flex items-center justify-center gap-2 w-full"
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
              <span>Save Profile</span>
            )}
          </motion.button>
        </div>
      </div>
      
      {/* Notification preferences */}
      <div className="mt-8 pt-6 border-t border-gray-800">
        <h3 className="text-lg font-bold mb-4">Notification Preferences</h3>
        
        <div className="space-y-3 max-w-md">
          <div className="flex items-center justify-between p-3 bg-black/40 border border-gray-800 rounded-lg">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-red-400" />
              <span>Email Notifications</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="notification.email"
                checked={userProfile.notificationPreferences.email}
                onChange={handleInputChange}
                className="sr-only peer"
                aria-label="Toggle email notifications"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-black/40 border border-gray-800 rounded-lg">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-gray-300" />
              <span>Campaign Alerts</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="notification.campaigns"
                checked={userProfile.notificationPreferences.campaigns}
                onChange={handleInputChange}
                className="sr-only peer"
                aria-label="Toggle campaign alerts"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-black/40 border border-gray-800 rounded-lg">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-gray-300" />
              <span>Payment Notifications</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="notification.payments"
                checked={userProfile.notificationPreferences.payments}
                onChange={handleInputChange}
                className="sr-only peer"
                aria-label="Toggle payment notifications"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  // Get content for connected accounts section
  const renderAccountsContent = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        {connectedAccounts.map((account, index) => (
          <div 
            key={index}
            className="p-5 bg-black/40 border border-gray-800 rounded-lg"
          >
            <div className="flex flex-col gap-4">
              {/* Account info */}
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gray-800 rounded-full">
                  {account.platform === 'youtube' ? (
                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  ) : account.platform === 'instagram' ? (
                    <svg className="h-5 w-5 text-pink-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0z"/>
                      <path d="M12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                    </svg>
                  ) : account.platform === 'tiktok' ? (
                    <svg className="h-5 w-5 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.12 1.13.43 2.27 1.22 3.06.83.82 1.95 1.15 3.07 1.4v3.12c-1.02-.02-2.05-.25-3-.75-.57-.3-1.08-.71-1.53-1.17-.01 1.8.01 3.61 0 5.42-.07 1.83-.69 3.72-2 5.08-1.57 1.68-3.95 2.51-6.26 2.36-1.43-.08-2.83-.49-4.08-1.21C1.55 16.06.38 13.13 1.14 10.5c.7-2.55 2.94-4.51 5.5-5.08 1.38-.31 2.84-.14 4.2.18v3.34c-.67-.26-1.41-.38-2.14-.29-1.25.17-2.4 1.05-2.94 2.24-.61 1.33-.47 3.05.55 4.16.88.97 2.21 1.39 3.53 1.27 1.24-.09 2.48-.78 3.08-1.81.4-.68.61-1.47.61-2.25l.01-9.32c-.01-.53-.01-1.07-.01-1.59z"/>
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  )}
                </div>
                <div>
                  <div className="flex items-center flex-wrap gap-2 mb-1">
                    <span className="font-bold capitalize">{account.platform}</span>
                    {account.isVerified && (
                      <span className="text-xs bg-red-900/30 text-red-400 px-2 py-0.5 rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400">
                    @{account.username} • {account.followers} followers
                  </p>
                </div>
              </div>
              
              {/* Account actions */}
              <div className="flex flex-wrap gap-3 justify-end">
                <motion.button
                  className="text-sm border border-gray-700 bg-gray-800 px-3 py-1.5 rounded-lg"
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                  aria-label={`Refresh ${account.platform} data`}
                >
                  Refresh
                </motion.button>
                <motion.button
                  className="text-sm border border-red-500 border-opacity-40 text-red-400 px-3 py-1.5 rounded-lg"
                  whileHover={{ backgroundColor: "rgba(239,68,68,0.1)" }}
                  onClick={() => disconnectPlatform(account.platform)}
                  aria-label={`Disconnect ${account.platform} account`}
                >
                  Disconnect
                </motion.button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Add platform button */}
        <motion.button
          className="w-full p-5 border border-dashed border-gray-700 rounded-lg flex items-center justify-center gap-3"
          whileHover={{ borderColor: 'rgba(255,255,255,0.3)', backgroundColor: "rgba(255,255,255,0.03)" }}
        >
          <Link className="h-5 w-5" />
          <span className="font-medium">Connect New Platform</span>
        </motion.button>
      </div>
    </div>
  );

  // Get content for payments section
  const renderPaymentsContent = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-bold mb-4">Payment Methods</h3>
      
      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <div 
            key={method.id}
            className={`p-5 ${method.default ? 'bg-red-900/10 border border-red-500/30' : 'bg-black/40 border border-gray-800'} rounded-lg`}
          >
            {/* Main content area */}
            <div className="flex flex-col gap-4">
              {/* Payment method info */}
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-full ${method.default ? 'bg-red-900/20' : 'bg-gray-800'}`}>
                  {method.type === 'bank' ? 
                    <CreditCard className="h-5 w-5" /> : 
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9.5 13.75C9.5 14.72 10.25 15.5 11.17 15.5H13.05C13.85 15.5 14.5 14.82 14.5 13.97C14.5 13.06 14.1 12.73 13.51 12.52L10.5 11.47C9.91 11.26 9.51 10.94 9.51 10.02C9.51 9.18 10.16 8.49 10.96 8.49H12.84C13.76 8.49 14.51 9.27 14.51 10.24" />
                      <path d="M12 7.5V16.5" />
                    </svg>
                  }
                </div>
                <div>
                  <div className="flex items-center flex-wrap gap-2 mb-1">
                    <span className="font-bold">
                      {method.type === 'bank' ? 'Bank Account' : 'PayPal'}
                    </span>
                    {method.default && (
                      <span className="text-xs bg-red-900/30 text-red-400 px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400">
                    {method.type === 'bank' ? `****${method.last4}` : method.email}
                  </p>
                </div>
              </div>
              
              {/* Actions area - buttons in a separate row on mobile, aligned right on desktop */}
              <div className="flex flex-wrap gap-3 justify-end mt-2">
                {!method.default && (
                  <motion.button
                    className="text-sm border border-gray-700 bg-gray-800 px-3 py-1.5 rounded-lg"
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                    onClick={() => setDefaultPaymentMethod(method.id)}
                    aria-label={`Make ${method.type === 'bank' ? 'bank account' : 'PayPal'} default payment method`}
                  >
                    Make Default
                  </motion.button>
                )}
                <motion.button
                  className="text-sm border border-red-500 border-opacity-40 text-red-400 px-3 py-1.5 rounded-lg"
                  whileHover={{ backgroundColor: "rgba(239,68,68,0.1)" }}
                  onClick={() => removePaymentMethod(method.id)}
                  aria-label={`Remove ${method.type === 'bank' ? 'bank account' : 'PayPal'} payment method`}
                >
                  Remove
                </motion.button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Add payment method button */}
        <motion.button
          className="w-full p-5 border border-dashed border-gray-700 rounded-lg flex items-center justify-center gap-3"
          whileHover={{ borderColor: 'rgba(255,255,255,0.3)', backgroundColor: "rgba(255,255,255,0.03)" }}
        >
          <CreditCard className="h-5 w-5" />
          <span className="font-medium">Add Payment Method</span>
        </motion.button>
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-800">
        <h3 className="text-lg font-bold mb-4">Payment History</h3>
        
        <div className="space-y-3">
          {[
            { date: 'Feb 15, 2025', amount: 2500, method: 'PayPal', status: 'Completed' },
            { date: 'Jan 15, 2025', amount: 1800, method: 'Bank Transfer', status: 'Completed' },
            { date: 'Dec 15, 2024', amount: 3200, method: 'PayPal', status: 'Completed' }
          ].map((payment, index) => (
            <div key={index} className="p-4 bg-black/40 border border-gray-800 rounded-lg">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-sm text-gray-400">Date</div>
                  <div className="font-medium">{payment.date}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Amount</div>
                  <div className="font-bold">${payment.amount.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Method</div>
                  <div>{payment.method}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Status</div>
                  <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-red-900/20 text-red-400 text-xs font-medium">
                    {payment.status}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-800">
        <h3 className="text-lg font-bold mb-4">Account Management</h3>
        
        <motion.button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-900 bg-opacity-20 border border-red-500 border-opacity-30 text-red-400 rounded-lg flex items-center justify-center gap-2 w-full sm:w-auto"
          whileHover={{ backgroundColor: "rgba(239,68,68,0.2)" }}
          aria-label="Log out of your account"
        >
          <LogOut className="h-5 w-5" />
          <span>Log Out</span>
        </motion.button>
      </div>
    </div>
  );

  // Unified success notification
  const SuccessNotification = () => (
    showSuccess ? (
      <div 
        className="fixed top-4 right-4 flex items-center gap-2 px-4 py-2 bg-red-900/90 text-white rounded-lg shadow-lg"
        role="alert"
      >
        <Check className="h-5 w-5" />
        <span>Changes saved successfully</span>
      </div>
    ) : null
  );

  // Dynamic content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileContent();
      case 'accounts':
        return renderAccountsContent();
      case 'payments':
        return renderPaymentsContent();
      case 'logout':
        // Handle logout immediately
        handleLogout();
        return null;
      default:
        return renderProfileContent();
    }
  };

  // Navigation data
  const navItems = [
    { id: 'profile', label: 'Profile & Notifications', icon: <User className="h-5 w-5" /> },
    { id: 'accounts', label: 'Connected Platforms', icon: <Link className="h-5 w-5" /> },
    { id: 'payments', label: 'Payment Methods', icon: <CreditCard className="h-5 w-5" /> },
    { id: 'logout', label: 'Log Out', icon: <LogOut className="h-5 w-5" /> }
  ];

  return (
    <div className="w-full flex flex-col md:flex-row gap-6">
      {/* Success notification */}
      <SuccessNotification />
      
      {/* Settings navigation - simplified */}
      <nav 
        className="w-full md:w-64 flex-shrink-0 bg-black/40 border border-gray-800 rounded-lg overflow-hidden"
        aria-label="Settings navigation"
      >
        <div className="p-2">
          {navItems.map(item => (
            <motion.button
              key={item.id}
              className={`w-full flex items-center gap-3 p-3 rounded-lg text-left my-1 ${
                activeSection === item.id
                  ? 'bg-red-900 bg-opacity-20 text-white'
                  : 'text-gray-300 hover:bg-white hover:bg-opacity-5'
              }`}
              onClick={() => setActiveSection(item.id)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.1 }}
              aria-current={activeSection === item.id ? 'page' : undefined}
            >
              {item.icon}
              <span>{item.label}</span>
            </motion.button>
          ))}
        </div>
      </nav>
      
      {/* Main content area - simplified */}
      <main 
        className="flex-grow bg-black/40 border border-gray-800 rounded-lg p-6"
        role="region"
        aria-label={`${activeSection === 'profile' ? 'Profile Settings' : 
                     activeSection === 'accounts' ? 'Connected Platforms' : 
                     activeSection === 'payments' ? 'Payment Settings' : 'Settings'} section`}
      >
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {navItems.find(item => item.id === activeSection)?.label || 'Settings'}
          </h2>
        </div>
        
        <div className="animate-fadeIn">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default SettingsView;