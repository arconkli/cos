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
    // Open onboarding flow instead of direct login
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
        
        <div className="flex items-center gap-4">
          {authStatus && (
            <>
              {/* Always render dashboard button with maximum visibility guarantees */}
              <a 
                href="/dashboard"
                onClick={(e) => {
                  e.preventDefault();
                  goToDashboard();
                }}
                className="px-3 py-1 md:px-4 md:py-2 border-2 border-white rounded flex items-center gap-2 text-white font-bold"
                style={{ 
                  color: 'white', 
                  backgroundColor: '#000',
                  borderColor: '#FFF',
                  boxShadow: '0 0 0 1px white',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <span style={{ color: 'white', fontWeight: 'bold' }}>Dashboard</span>
                <User color="white" size={16} />
              </a>
              
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleLogout();
                }}
                className="px-3 py-1 md:px-4 md:py-2 border-2 border-white rounded flex items-center gap-2 text-white"
                style={{ 
                  color: 'white', 
                  backgroundColor: '#000',
                  borderColor: '#FFF',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <span style={{ color: 'white' }}>Logout</span>
                <LogOut color="white" size={16} />
              </a>
            </>
          )}
          
          {!authStatus && (
            <motion.button
              onClick={handleLogin}
              className="px-3 py-1 md:px-6 md:py-2 border-2 border-red-500 rounded flex items-center gap-2 text-white"
              style={{ color: 'white', backgroundColor: '#000' }}
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,68,68,0.1)" }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <span style={{ color: 'white' }}>Join as Creator</span>
              <ArrowUpRight color="white" size={16} />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navigation;