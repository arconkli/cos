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
      <h3 className="text-lg font-bold mb-4">Connected Platforms</h3>
      
      <div className="space-y-3">
        {connectedAccounts.map((account, index) => (
          <div 
            key={index}
            className="p-4 bg-black/40 border border-gray-800 rounded-lg"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-800 rounded-full">
                  <span className="text-xl" aria-hidden="true">
                    {account.platform === 'youtube' ? '📹' : 
                     account.platform === 'instagram' ? '📸' : 
                     account.platform === 'tiktok' ? '🎵' : '🔗'}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
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
              
              <div className="flex gap-2 mt-2 sm:mt-0">
                <motion.button
                  className="text-sm border border-gray-700 bg-gray-800 px-3 py-1 rounded-lg"
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                  aria-label={`Refresh ${account.platform} data`}
                >
                  Refresh
                </motion.button>
                <motion.button
                  className="text-sm border border-red-500 border-opacity-40 text-red-400 px-3 py-1 rounded-lg"
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
          className="w-full p-4 border border-dashed border-gray-700 rounded-lg flex items-center justify-center gap-2"
          whileHover={{ borderColor: 'rgba(255,255,255,0.3)', backgroundColor: "rgba(255,255,255,0.03)" }}
        >
          <Link className="h-5 w-5" />
          <span>Connect New Platform</span>
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
            className={`p-4 ${method.default ? 'bg-red-900/10 border border-red-500/30' : 'bg-black/40 border border-gray-800'} rounded-lg`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${method.default ? 'bg-red-900/20' : 'bg-gray-800'}`}>
                  {method.type === 'bank' ? 
                    <span aria-hidden="true">🏦</span> : 
                    <span aria-hidden="true">💳</span>
                  }
                </div>
                <div>
                  <div className="flex items-center gap-2">
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
              
              <div className="flex gap-2 mt-2 sm:mt-0">
                {!method.default && (
                  <motion.button
                    className="text-sm border border-gray-700 bg-gray-800 px-3 py-1 rounded-lg"
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                    onClick={() => setDefaultPaymentMethod(method.id)}
                    aria-label={`Make ${method.type === 'bank' ? 'bank account' : 'PayPal'} default payment method`}
                  >
                    Make Default
                  </motion.button>
                )}
                <motion.button
                  className="text-sm border border-red-500 border-opacity-40 text-red-400 px-3 py-1 rounded-lg"
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
          className="w-full p-4 border border-dashed border-gray-700 rounded-lg flex items-center justify-center gap-2"
          whileHover={{ borderColor: 'rgba(255,255,255,0.3)', backgroundColor: "rgba(255,255,255,0.03)" }}
        >
          <CreditCard className="h-5 w-5" />
          <span>Add Payment Method</span>
        </motion.button>
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
        aria-label={`${navItems.find(item => item.id === activeSection)?.label || 'Settings'} section`}
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