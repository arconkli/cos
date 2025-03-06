'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpRight, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
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
    setErrorMessage('');
    
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
  
  // Handle social login
  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    setErrorMessage('');
    
    // For demo purposes, simulate authentication with the provider
    setTimeout(() => {
      console.log(`Authenticating with ${provider}`);
      
      // Set user as logged in
      localStorage.setItem('isLoggedIn', 'true');
      
      // Store user data with provider info
      const userData = {
        name: `${provider} User`,
        email: `user@${provider.toLowerCase()}.com`,
        platforms: [provider.toLowerCase()]
      };
      localStorage.setItem('userData', JSON.stringify(userData));
      
      setIsLoading(false);
      
      // Redirect to dashboard
      router.push('/dashboard');
    }, 1000);
  };
  
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-title"
    >
      <motion.div
        className="border border-gray-800 p-6 rounded-lg w-full max-w-md bg-black/40 relative"
        initial={{ scale: 0.95, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 20, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full" 
          onClick={onClose}
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>
        
        <h2 id="login-title" className="text-2xl font-bold mb-6 text-white">Login to CREATE_OS</h2>
        
        {/* Social login options */}
        <div className="mb-6">
          <p className="text-center text-sm text-gray-400 mb-3">Login with your connected account</p>
          <div className="grid grid-cols-4 gap-3">
            <button
              className="flex items-center justify-center border border-gray-700 p-3 rounded-lg hover:bg-white/5 transition-colors"
              onClick={() => handleSocialLogin('Google')}
              disabled={isLoading}
              aria-label="Login with Google"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"/>
                <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2970142 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"/>
                <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"/>
                <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"/>
              </svg>
            </button>
            
            <button
              className="flex items-center justify-center border border-gray-700 p-3 rounded-lg hover:bg-white/5 transition-colors"
              onClick={() => handleSocialLogin('Facebook')}
              disabled={isLoading}
              aria-label="Login with Facebook"
            >
              <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" />
              </svg>
            </button>
            
            <button
              className="flex items-center justify-center border border-gray-700 p-3 rounded-lg hover:bg-white/5 transition-colors"
              onClick={() => handleSocialLogin('Twitter')}
              disabled={isLoading}
              aria-label="Login with Twitter/X"
            >
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </button>
            
            <button
              className="flex items-center justify-center border border-gray-700 p-3 rounded-lg hover:bg-white/5 transition-colors"
              onClick={() => handleSocialLogin('Instagram')}
              disabled={isLoading}
              aria-label="Login with Instagram"
            >
              <svg className="h-5 w-5 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0z"/>
                <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </button>
          </div>
          
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="flex-shrink mx-4 text-sm text-gray-400">or continue with email</span>
            <div className="flex-grow border-t border-gray-700"></div>
          </div>
        </div>
        
        {/* Error message if login fails */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-red-400 text-sm">{errorMessage}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/40 border border-gray-700 p-3 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-white"
              placeholder="your@email.com"
              required
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm text-gray-400 mb-1">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-gray-700 p-3 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-white"
              placeholder="••••••••"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2 text-gray-400">
              <input 
                type="checkbox" 
                className="rounded border-gray-600 bg-black/40"
                disabled={isLoading}
              />
              <span>Remember me</span>
            </label>
            <button 
              type="button" 
              className="text-red-400 hover:underline"
              disabled={isLoading}
            >
              Forgot password?
            </button>
          </div>
          
          <button
            type="submit"
            className="w-full mt-2 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold flex items-center justify-center transition-colors disabled:opacity-70"
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
          </button>
          
          <div className="text-center mt-4 text-sm text-gray-400">
            <p>Don't have an account? <button 
              type="button"
              className="text-red-400 hover:underline"
              onClick={() => {
                onClose();
                // This would typically open a registration modal or redirect
                router.push('/onboarding');
              }}
              disabled={isLoading}
            >Sign up</button></p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginModal;