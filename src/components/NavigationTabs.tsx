'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';

// NavigationTabs component
const NavigationTabs: React.FC<{
  activeView: 'campaigns' | 'analytics' | 'payments' | 'settings';
  setActiveView: (view: 'campaigns' | 'analytics' | 'payments' | 'settings') => void;
}> = memo(({ activeView, setActiveView }) => {
  return (
    // Updated z-index from z-10 to z-20
    <div className="mb-6 md:mb-8 flex overflow-x-auto custom-scrollbar border-b relative z-20">
      <motion.button
        className={`px-4 md:px-6 py-3 font-medium relative whitespace-nowrap ${
          activeView === 'campaigns' ? 'text-white' : 'text-gray-400'
        }`}
        onClick={() => setActiveView('campaigns')}
        whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
        // Add transition for smoother hover effect
        transition={{ duration: 0.2 }}
      >
        Campaigns
        {activeView === 'campaigns' && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
            layoutId="activeTab"
            // Add transition for the active tab indicator
            transition={{ duration: 0.2 }}
          />
        )}
      </motion.button>
      <motion.button
        className={`px-4 md:px-6 py-3 font-medium relative whitespace-nowrap ${
          activeView === 'analytics' ? 'text-white' : 'text-gray-400'
        }`}
        onClick={() => setActiveView('analytics')}
        whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
        transition={{ duration: 0.2 }}
      >
        Analytics
        {activeView === 'analytics' && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
            layoutId="activeTab"
            transition={{ duration: 0.2 }}
          />
        )}
      </motion.button>
      <motion.button
        className={`px-4 md:px-6 py-3 font-medium relative whitespace-nowrap ${
          activeView === 'payments' ? 'text-white' : 'text-gray-400'
        }`}
        onClick={() => setActiveView('payments')}
        whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
        transition={{ duration: 0.2 }}
      >
        Payments
        {activeView === 'payments' && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
            layoutId="activeTab"
            transition={{ duration: 0.2 }}
          />
        )}
      </motion.button>
      <motion.button
        className={`px-4 md:px-6 py-3 font-medium relative whitespace-nowrap ${
          activeView === 'settings' ? 'text-white' : 'text-gray-400'
        }`}
        onClick={() => setActiveView('settings')}
        whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
        transition={{ duration: 0.2 }}
      >
        Settings
        {activeView === 'settings' && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
            layoutId="activeTab"
            transition={{ duration: 0.2 }}
          />
        )}
      </motion.button>
    </div>
  );
});

NavigationTabs.displayName = 'NavigationTabs';

export default NavigationTabs;