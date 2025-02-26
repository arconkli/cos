'use client';

// src/components/Navigation.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap, LogOut, Home, BarChart2, User, Settings, ArrowUpRight, Building } from 'lucide-react';
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
    localStorage.setItem('isLoggedIn', 'true');
    setAuthStatus(true);
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
                <div className="hidden md:flex items-center gap-4">
                  <NavLink href="/dashboard" label="Dashboard" />
                  <NavLink href="/campaigns" label="Campaigns" />
                  <NavLink href="/analytics" label="Analytics" />
                  <NavLink href="/settings" label="Settings" />
                </div>
                
                <motion.button
                  onClick={handleLogout}
                  className="px-3 py-1 md:px-4 md:py-2 border rounded flex items-center gap-2 text-sm md:text-base"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)", borderColor: "#FF4444" }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  Logout <LogOut className="h-4 w-4" />
                </motion.button>
              </>
            ) : (
              <>
                <div className="hidden md:flex items-center gap-6">
                  <motion.button
                    className="text-white hover:text-red-400 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => resetOnboarding()}
                  >
                    How It Works
                  </motion.button>
                  <motion.button
                    className="text-white hover:text-red-400 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push('/#campaigns')}
                  >
                    Campaigns
                  </motion.button>
                  <motion.button
                    className="text-white hover:text-red-400 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push('/#creator')}
                  >
                    For Brands
                  </motion.button>
                </div>
                
                <motion.button
                  onClick={handleLogin}
                  className="px-3 py-1 md:px-4 md:py-2 border rounded flex items-center gap-2 text-sm md:text-base"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)", borderColor: "#FF4444" }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  Login <ArrowUpRight className="h-4 w-4" />
                </motion.button>
              </>
            )}
            
            <button
              onClick={toggleMenu}
              className="block md:hidden p-2 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black bg-opacity-95 md:hidden pt-20"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col p-6 space-y-6">
              {authStatus ? (
                <>
                  <MobileNavLink 
                    icon={<Home />} 
                    label="Dashboard" 
                    href="/dashboard" 
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <MobileNavLink 
                    icon={<Zap />} 
                    label="Campaigns" 
                    href="/dashboard" 
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <MobileNavLink 
                    icon={<BarChart2 />} 
                    label="Analytics" 
                    href="/dashboard" 
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <MobileNavLink 
                    icon={<Settings />} 
                    label="Settings" 
                    href="/dashboard" 
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <div className="pt-6 border-t border-white border-opacity-20">
                    <MobileNavLink 
                      icon={<LogOut />} 
                      label="Log Out" 
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <MobileNavLink 
                    icon={<Zap />} 
                    label="How It Works" 
                    onClick={() => {
                      resetOnboarding();
                      setIsMenuOpen(false);
                    }}
                  />
                  <MobileNavLink 
                    icon={<BarChart2 />} 
                    label="Campaigns" 
                    href="/#campaigns" 
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <MobileNavLink 
                    icon={<Building />} 
                    label="For Brands" 
                    href="/#creator" 
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <div className="pt-6 mt-auto">
                    <motion.button
                      onClick={() => {
                        handleLogin();
                        setIsMenuOpen(false);
                      }}
                      className="w-full py-3 border rounded flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Login <ArrowUpRight className="h-4 w-4" />
                    </motion.button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Helper component for navigation links
interface NavLinkProps {
  href: string;
  label: string;
}

const NavLink: React.FC<NavLinkProps> = ({ href, label }) => {
  // Use client-side navigation
  const router = useRouter();
  const isActive = typeof window !== 'undefined' && window.location.pathname === href;

  return (
    <div
      onClick={() => router.push(href)}
      className={`relative px-2 py-1 cursor-pointer hover:text-red-400 transition-colors ${
        isActive ? 'text-red-400' : 'text-white'
      }`}
    >
      {label}
      {isActive && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"
          layoutId="navIndicator"
        />
      )}
    </div>
  );
};

// Helper component for mobile navigation
interface MobileNavLinkProps {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ icon, label, href, onClick }) => {
  const router = useRouter();
  
  const handleClick = () => {
    if (onClick) onClick();
    if (href) router.push(href);
  };
  
  return (
    <motion.div
      className="flex items-center gap-4 py-3 px-2"
      whileHover={{ x: 5, backgroundColor: "rgba(255,255,255,0.05)" }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
    >
      <div className="text-red-400">{icon}</div>
      <span className="text-lg">{label}</span>
    </motion.div>
  );
};

export default Navigation;