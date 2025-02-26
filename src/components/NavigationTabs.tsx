'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';

// Define NavigationTabs component at the beginning
const NavigationTabs: React.FC<{
  activeView: 'campaigns' | 'analytics' | 'payments' | 'settings';
  setActiveView: (view: 'campaigns' | 'analytics' | 'payments' | 'settings') => void;
}> = memo(({ activeView, setActiveView }) => {
  return (
    <div className="mb-6 md:mb-8 flex overflow-x-auto custom-scrollbar border-b relative z-10">
      <motion.button
        className={`px-4 md:px-6 py-3 font-medium relative whitespace-nowrap ${activeView === 'campaigns' ? 'text-white' : 'text-gray-400'}`}
        onClick={() => setActiveView('campaigns')}
        whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
      >
        Campaigns
        {activeView === 'campaigns' && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
            layoutId="activeTab"
          />
        )}
      </motion.button>
      <motion.button
        className={`px-4 md:px-6 py-3 font-medium relative whitespace-nowrap ${activeView === 'analytics' ? 'text-white' : 'text-gray-400'}`}
        onClick={() => setActiveView('analytics')}
        whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
      >
        Analytics
        {activeView === 'analytics' && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
            layoutId="activeTab"
          />
        )}
      </motion.button>
      <motion.button
        className={`px-4 md:px-6 py-3 font-medium relative whitespace-nowrap ${activeView === 'payments' ? 'text-white' : 'text-gray-400'}`}
        onClick={() => setActiveView('payments')}
        whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
      >
        Payments
        {activeView === 'payments' && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
            layoutId="activeTab"
          />
        )}
      </motion.button>
      <motion.button
        className={`px-4 md:px-6 py-3 font-medium relative whitespace-nowrap ${activeView === 'settings' ? 'text-white' : 'text-gray-400'}`}
        onClick={() => setActiveView('settings')}
        whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
      >
        Settings
        {activeView === 'settings' && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
            layoutId="activeTab"
          />
        )}
      </motion.button>
    </div>
  );
});

// Important: Set displayName to avoid React warnings
NavigationTabs.displayName = 'NavigationTabs';

export default NavigationTabs;