'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, ArrowUpRight, User } from 'lucide-react';
import { useOnboarding } from './OnboardingProvider';

interface NavigationProps {
  isLoggedIn?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ isLoggedIn = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleLogout = () => {
    // Clear authentication tokens
    localStorage.removeItem('isLoggedIn');
    setAuthStatus(false);
    router.push('/');
  };

  const handleLogin = () => {
    // For demo purposes, set logged in state
    resetOnboarding(); // Open onboarding flow instead of direct login
  };

  const goToDashboard = () => {
    router.push('/dashboard');
  };
  
  return (
    <>
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
                {/* Creator is logged in - show minimal options */}
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
                {/* User is not logged in - show join option */}
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
            
            {/* Mobile menu toggle - only shown for logged in creators */}
            {authStatus && (
              <button
                onClick={toggleMenu}
                className="block md:hidden p-2 focus:outline-none"
                aria-label="Toggle Menu"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Menu - simplified for creators only */}
      <AnimatePresence>
        {isMenuOpen && authStatus && (
          <motion.div
            className="fixed inset-0 z-40 bg-black bg-opacity-95 md:hidden pt-20"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col p-6 space-y-6">
              <motion.div
                className="flex items-center gap-4 py-3 px-2"
                whileHover={{ x: 5, backgroundColor: "rgba(255,255,255,0.05)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  goToDashboard();
                  setIsMenuOpen(false);
                }}
              >
                <div className="text-red-400"><User className="h-5 w-5" /></div>
                <span className="text-lg">Dashboard</span>
              </motion.div>
              
              <div className="pt-6 border-t border-white border-opacity-20">
                <motion.div
                  className="flex items-center gap-4 py-3 px-2"
                  whileHover={{ x: 5, backgroundColor: "rgba(255,255,255,0.05)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  <div className="text-red-400"><LogOut className="h-5 w-5" /></div>
                  <span className="text-lg">Log Out</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;