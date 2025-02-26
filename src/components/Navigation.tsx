'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogOut, ArrowUpRight, User } from 'lucide-react';
import { useOnboarding } from './OnboardingProvider';

interface NavigationProps {
  isLoggedIn?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ isLoggedIn = false }) => {
  const router = useRouter();
  const { resetOnboarding } = useOnboarding();
  
  // Start with a definitive authStatus value - either from props or false
  const [authStatus, setAuthStatus] = useState(isLoggedIn);
  
  // Use a second state variable to track if we've checked localStorage
  // This prevents any flash of incorrect UI
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false);
  
  // Force immediate check of localStorage on client side
  useEffect(() => {
    // This will only run on the client
    const storedLoginStatus = localStorage.getItem('isLoggedIn') === 'true';
    setAuthStatus(storedLoginStatus);
    setHasCheckedStorage(true);
  }, []);
  
  const handleLogout = () => {
    // Clear authentication tokens
    localStorage.removeItem('isLoggedIn');
    setAuthStatus(false);
    router.push('/');
  };

  const handleLogin = () => {
    // Always redirect to the full onboarding page
    router.push('/onboarding');
  };

  const goToDashboard = () => {
    router.push('/dashboard');
  };
  
  // Only render once we've checked localStorage
  return (
    <div className="sticky top-0 z-50 bg-black bg-opacity-80 backdrop-blur-sm border-b">
      <div className="flex justify-between items-center p-4 max-w-7xl mx-auto">
        <motion.h1 
          className="text-2xl md:text-4xl font-bold cursor-pointer text-white"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={() => router.push('/')}
        >
          CREATE_OS
        </motion.h1>
        
        <div className="flex items-center gap-3">
          {authStatus && (
            <>
              {/* Improved dashboard button that matches site styling */}
              <motion.button
                onClick={goToDashboard}
                className="px-3 py-1.5 md:px-5 md:py-2 bg-gradient-to-r from-red-500 to-red-700 rounded-lg text-white font-bold flex items-center gap-2 shadow-lg"
                whileHover={{ scale: 1.05, boxShadow: "0 0 10px rgba(255,68,68,0.3)" }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="hidden xs:inline">Dashboard</span>
                <User className="h-4 w-4" />
              </motion.button>
              
              {/* Desktop-only logout button */}
              <motion.button
                onClick={handleLogout}
                className="hidden md:flex px-3 py-1.5 md:px-4 md:py-2 border border-gray-600 hover:border-gray-400 rounded-lg text-white items-center gap-2"
                whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Logout</span>
                <LogOut className="h-4 w-4" />
              </motion.button>
            </>
          )}
          
          {!authStatus && (
            <motion.button
              onClick={handleLogin}
              className="px-3 py-1.5 md:px-6 md:py-2 border-2 border-red-500 rounded-lg flex items-center gap-2 text-white"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,68,68,0.1)" }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <span>Join as Creator</span>
              <ArrowUpRight className="h-4 w-4" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navigation;