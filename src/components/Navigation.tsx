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
  
  // Check localStorage on component mount to determine login status
  const [authStatus, setAuthStatus] = useState(isLoggedIn);
  
  useEffect(() => {
    // Check if user is logged in from localStorage when component mounts
    const storedLoginStatus = localStorage.getItem('isLoggedIn');
    if (storedLoginStatus === 'true') {
      setAuthStatus(true);
    }
  }, []);
  
  const handleLogout = () => {
    // Clear authentication tokens
    localStorage.removeItem('isLoggedIn');
    setAuthStatus(false);
    router.push('/');
  };

  const handleLogin = () => {
    // Open onboarding flow instead of direct login
    router.push('/onboarding');
  };

  const goToDashboard = () => {
    router.push('/dashboard');
  };
  
  return (
    <div className="sticky top-0 z-50 bg-black bg-opacity-80 backdrop-blur-sm border-b">
      <div className="flex justify-between items-center p-4 max-w-7xl mx-auto">
        <motion.h1 
          className="text-2xl md:text-4xl font-bold cursor-pointer"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={() => router.push('/')}
        >
          CREATE_OS
        </motion.h1>
        
        <div className="flex items-center gap-4">
          {authStatus ? (
            <>
              {/* User is logged in - show dashboard + logout */}
              <motion.button
                onClick={goToDashboard}
                className="px-3 py-1 md:px-4 md:py-2 border rounded flex items-center gap-2 text-sm md:text-base"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)", borderColor: "#FF4444" }}
                whileTap={{ scale: 0.95 }}
              >
                Dashboard <User className="h-4 w-4" />
              </motion.button>
              
              <motion.button
                onClick={handleLogout}
                className="px-3 py-1 md:px-4 md:py-2 border rounded flex items-center gap-2 text-sm md:text-base"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)", borderColor: "#FF4444" }}
                whileTap={{ scale: 0.95 }}
              >
                Logout <LogOut className="h-4 w-4" />
              </motion.button>
            </>
          ) : (
            <>
              {/* User is not logged in - show join button */}
              <motion.button
                onClick={handleLogin}
                className="px-3 py-1 md:px-6 md:py-2 border border-red-500 rounded flex items-center gap-2 text-sm md:text-base"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,68,68,0.1)" }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                Join as Creator <ArrowUpRight className="h-4 w-4" />
              </motion.button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navigation;