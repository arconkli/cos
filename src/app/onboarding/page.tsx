'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const OnboardingPage = () => {
  // State to manage the current onboarding step
  const [step, setStep] = useState(0);
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    platforms: [] as string[]
  });
  
  const router = useRouter();
  
  // Steps configuration
  const steps = [
    {
      title: "What's your name?",
      subtitle: "Let's start with a proper introduction",
      field: "name",
      type: "text",
      placeholder: "Your name",
      nextEnabled: (value: string) => value.trim().length > 0,
    },
    {
      title: "What's your email?",
      subtitle: "We'll use this to create your account",
      field: "email",
      type: "email",
      placeholder: "your@email.com",
      nextEnabled: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    },
    {
      title: "Create a password",
      subtitle: "Make it strong and memorable",
      field: "password",
      type: "password",
      placeholder: "••••••••",
      nextEnabled: (value: string) => value.length >= 6,
    },
    {
      title: "Which platforms do you create on?",
      subtitle: "Select all that apply",
      field: "platforms",
      type: "multi-select",
      options: [
        { id: "tiktok", label: "TikTok" },
        { id: "instagram", label: "Instagram" },
        { id: "youtube", label: "YouTube" },
        { id: "twitter", label: "X (Twitter)" }
      ],
      nextText: "Complete",
      nextEnabled: () => true, // Always enabled as platforms are optional
    }
  ];
  
  // Navigate to the next step or complete onboarding
  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };
  
  // Handle field value changes
  const handleChange = (value: string | string[]) => {
    const currentField = steps[step].field;
    setFormData({
      ...formData,
      [currentField]: value
    });
  };
  
  // Handle multi-select options
  const handleOptionToggle = (optionId: string) => {
    const currentPlatforms = [...formData.platforms];
    const index = currentPlatforms.indexOf(optionId);
    
    if (index > -1) {
      // Remove if already selected
      currentPlatforms.splice(index, 1);
    } else {
      // Add if not selected
      currentPlatforms.push(optionId);
    }
    
    setFormData({
      ...formData,
      platforms: currentPlatforms
    });
  };
  
  // Complete onboarding and redirect to dashboard
  const handleComplete = () => {
    // Create user data object
    const userData = {
      name: formData.name,
      email: formData.email,
      platforms: formData.platforms
    };
    
    // Save user data and mark as logged in
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
    
    // Redirect to dashboard
    router.push('/dashboard');
  };
  
  // Check if the next button should be enabled
  const isNextEnabled = () => {
    const currentStep = steps[step];
    const value = formData[currentStep.field as keyof typeof formData];
    
    if (typeof currentStep.nextEnabled === 'function') {
      return currentStep.nextEnabled(value as string);
    }
    
    return true;
  };
  
  // Handle pressing Enter to advance
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && isNextEnabled()) {
        handleNext();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [step, formData]);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Minimal header */}
      <header className="p-4 border-b border-gray-800">
        <div className="text-2xl font-bold">CREATE_OS</div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Progress bar */}
          <div className="flex gap-1 mb-12">
            {steps.map((_, index) => (
              <div 
                key={index} 
                className={`h-1 flex-1 rounded-full ${index <= step ? 'bg-red-500' : 'bg-gray-700'}`}
              />
            ))}
          </div>
          
          {/* Step content with animations */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`step-${step}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-bold mb-2">{steps[step].title}</h1>
              <p className="text-gray-400 mb-6">{steps[step].subtitle}</p>
              
              {/* Input field or multi-select based on step type */}
              {steps[step].type !== 'multi-select' ? (
                <input
                  type={steps[step].type}
                  value={formData[steps[step].field as keyof typeof formData] as string}
                  onChange={(e) => handleChange(e.target.value)}
                  placeholder={steps[step].placeholder}
                  className="w-full p-4 bg-transparent border border-gray-700 rounded-lg text-xl focus:border-red-500 focus:outline-none transition-colors"
                  autoFocus
                />
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {steps[step].options?.map((option) => (
                    <motion.button
                      key={option.id}
                      className={`p-4 border rounded-lg text-left ${
                        formData.platforms.includes(option.id) 
                          ? 'border-red-500 bg-red-500 bg-opacity-10' 
                          : 'border-gray-700'
                      }`}
                      onClick={() => handleOptionToggle(option.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {option.label}
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          
          {/* Next button */}
          <motion.button
            onClick={handleNext}
            className={`w-full p-4 mt-6 flex items-center justify-center gap-2 rounded-lg font-bold text-xl transition-colors ${
              isNextEnabled() 
                ? 'bg-gradient-to-r from-red-500 to-red-700 text-white' 
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
            whileHover={isNextEnabled() ? { scale: 1.02 } : {}}
            whileTap={isNextEnabled() ? { scale: 0.98 } : {}}
            disabled={!isNextEnabled()}
          >
            {steps[step].nextText || 'Continue'} 
            <ArrowRight className="h-5 w-5" />
          </motion.button>
          
          {/* Additional tips or help text */}
          <div className="mt-4 text-center text-gray-500 text-sm">
            {step === 0 && "We're excited to have you join us"}
            {step === 1 && "We'll never share your email with third parties"}
            {step === 2 && "Use at least 6 characters for a secure password"}
            {step === 3 && "You can connect more platforms later in your settings"}
          </div>
        </div>
      </main>
    </div>
  );
};

export default OnboardingPage;