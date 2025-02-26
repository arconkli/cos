// src/components/OnboardingProvider.tsx
import React, { useState, useEffect, createContext, useContext } from 'react';
import { AnimatePresence } from 'framer-motion';
import Onboarding from './Onboarding';

// Context for managing onboarding state
interface OnboardingContextType {
  showOnboarding: boolean;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType>({
  showOnboarding: false,
  completeOnboarding: () => {},
  resetOnboarding: () => {},
});

// Custom hook to use the onboarding context
export const useOnboarding = () => useContext(OnboardingContext);

interface OnboardingProviderProps {
  children: React.ReactNode;
  // Set to false to disable automatic display for testing
  autoShow?: boolean;
}

const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ 
  children,
  autoShow = true
}) => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  // Check if this is the user's first visit
  useEffect(() => {
    // Only run on client-side
    if (typeof window !== 'undefined' && autoShow) {
      const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding');
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      
      // Don't show onboarding if the user is already logged in
      if (!hasCompletedOnboarding && !isLoggedIn) {
        // Show onboarding after a brief delay to let the page load
        const timer = setTimeout(() => {
          setShowOnboarding(true);
        }, 800);
        
        return () => clearTimeout(timer);
      }
    }
  }, [autoShow]);
  
  // Mark onboarding as complete
  const completeOnboarding = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hasCompletedOnboarding', 'true');
    }
    setShowOnboarding(false);
  };
  
  // Reset onboarding (for testing or when user clicks "How It Works")
  const resetOnboarding = () => {
    if (typeof window !== 'undefined') {
      // We don't remove the completed flag, just force the onboarding to show
      setShowOnboarding(true);
    }
  };
  
  return (
    <OnboardingContext.Provider 
      value={{ 
        showOnboarding, 
        completeOnboarding, 
        resetOnboarding 
      }}
    >
      {children}
      
      <AnimatePresence>
        {showOnboarding && (
          <Onboarding
            onComplete={completeOnboarding}
            onSkip={completeOnboarding}
          />
        )}
      </AnimatePresence>
    </OnboardingContext.Provider>
  );
};

export default OnboardingProvider;