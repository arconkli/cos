'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  // Add effect to handle ESC key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // For demo purposes, simulate a login request
    setTimeout(() => {
      // Set user as logged in
      localStorage.setItem('isLoggedIn', 'true');
      
      // Store basic user data
      const userData = {
        name: 'Demo User',
        email: email
      };
      localStorage.setItem('userData', JSON.stringify(userData));
      
      setIsLoading(false);
      
      // Redirect to dashboard
      router.push('/dashboard');
    }, 1500);
  };
  
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose} // Close when clicking outside
    >
      <motion.div
        className="border p-6 rounded-lg w-full max-w-md relative bg-black"
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl" />
        
        <motion.button 
          className="absolute top-2 right-2 p-2" 
          onClick={onClose}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="h-6 w-6" />
        </motion.button>
        
        <h2 className="text-2xl font-bold mb-6">Login to CREATE_OS</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm opacity-70 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-gray-700 p-2 rounded focus:border-red-500 focus:outline-none transition-colors"
              placeholder="your@email.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm opacity-70 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-gray-700 p-2 rounded focus:border-red-500 focus:outline-none transition-colors"
              placeholder="••••••••"
              required
            />
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded border-gray-600" />
              <span>Remember me</span>
            </label>
            <button 
              type="button" 
              className="text-red-400 hover:underline"
            >
              Forgot password?
            </button>
          </div>
          
          <motion.button
            type="submit"
            className="w-full mt-2 py-2 bg-gradient-to-r from-red-500 to-red-700 rounded font-bold flex items-center justify-center"
            whileHover={{ scale: 1.02, boxShadow: "0 0 10px rgba(255,68,68,0.5)" }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <>Login <ArrowUpRight className="h-4 w-4 ml-1" /></>
            )}
          </motion.button>
          
          <div className="text-center mt-4 text-sm">
            <p>Don't have an account? <button 
              type="button"
              className="text-red-400 hover:underline"
              onClick={() => {
                onClose();
                // This would typically open a registration modal
                document.dispatchEvent(new CustomEvent('openRegistration'));
              }}
            >Sign up</button></p>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default LoginModal;