// src/components/Navigation.tsx
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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
  const pathname = usePathname();
  const { resetOnboarding } = useOnboarding();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleLogout = () => {
    // Here you would normally clear authentication tokens
    localStorage.removeItem('isLoggedIn');
    router.push('/');
  };

  const handleLogin = () => {
    // For demo purposes, set logged in state
    localStorage.setItem('isLoggedIn', 'true');
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
            {isLoggedIn ? (
              <>
                <div className="hidden md:flex items-center gap-4">
                  <NavLink href="/dashboard" isActive={pathname === '/dashboard'}>Dashboard</NavLink>
                  <NavLink href="/campaigns" isActive={pathname === '/campaigns'}>Campaigns</NavLink>
                  <NavLink href="/analytics" isActive={pathname === '/analytics'}>Analytics</NavLink>
                  <NavLink href="/settings" isActive={pathname === '/settings'}>Settings</NavLink>
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
              {isLoggedIn ? (
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
                    href="/campaigns" 
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <MobileNavLink 
                    icon={<BarChart2 />} 
                    label="Analytics" 
                    href="/analytics" 
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <MobileNavLink 
                    icon={<Settings />} 
                    label="Settings" 
                    href="/settings" 
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
  isActive: boolean;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, isActive, children }) => (
  <Link href={href} passHref>
    <div
      className={`relative px-2 py-1 cursor-pointer hover:text-red-400 transition-colors ${
        isActive ? 'text-red-400' : 'text-white'
      }`}
    >
      {children}
      {isActive && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"
          layoutId="navIndicator"
        />
      )}
    </div>
  </Link>
);

// Helper component for mobile navigation
interface MobileNavLinkProps {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ icon, label, href, onClick }) => {
  const content = (
    <motion.div
      className="flex items-center gap-4 py-3 px-2"
      whileHover={{ x: 5, backgroundColor: "rgba(255,255,255,0.05)" }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="text-red-400">{icon}</div>
      <span className="text-lg">{label}</span>
    </motion.div>
  );
  
  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  
  return content;
};

export default Navigation;