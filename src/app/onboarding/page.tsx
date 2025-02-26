'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// Define types for steps and form data
interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  platforms: string[];
  paymentMethod: string;
  paymentEmail: string;
  accountNumber: string;
  routingNumber: string;
  accountName: string;
  skipPayment: boolean;
}

type StepField = 'name' | 'email' | 'phone' | 'password' | 'platforms' | 'payment';

interface Option {
  id: string;
  label: string;
}

interface Step {
  title: string;
  subtitle: string;
  field: StepField;
  type: string;
  placeholder?: string;
  options?: Option[];
  nextText?: string;
  nextEnabled: (value: any) => boolean;
}

const OnboardingPage: React.FC = () => {
  // State to manage the current onboarding step
  const [step, setStep] = useState(0);
  
  // Form data
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    platforms: [],
    paymentMethod: '',
    paymentEmail: '',
    accountNumber: '',
    routingNumber: '',
    accountName: '',
    skipPayment: false
  });
  
  const router = useRouter();
  
  // Format account number
  const formatAccountNumber = (value: string) => {
    return value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  };
  
  // Format routing number
  const formatRoutingNumber = (value: string) => {
    return value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  };
  
  // Steps configuration
  const steps: Step[] = [
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
      title: "Your phone number",
      subtitle: "For account security (optional)",
      field: "phone",
      type: "tel",
      placeholder: "Your phone number",
      nextEnabled: (_: string) => true, // Optional field
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
      nextEnabled: (_: string[]) => true, // Always enabled as platforms are optional
    },
    {
      title: "Payment Information",
      subtitle: "How would you like to receive your earnings?",
      field: "payment",
      type: "payment",
      nextText: "Complete",
      nextEnabled: (data: FormData) => {
        // Skip validation if the user chooses to skip payment setup
        if (data.skipPayment) return true;
        
        // Otherwise, check if a payment method was selected
        return (
          data.paymentMethod === 'paypal' || 
          data.paymentMethod === 'bank'
        );
      },
    }
  ];
  
  // Social media login handlers
  const handleSocialLogin = (provider: string) => {
    // In a real app, this would authenticate with the provider
    console.log(`Authenticating with ${provider}`);
    
    // For demo, simulate successful login
    localStorage.setItem('userData', JSON.stringify({
      name: `${provider} User`,
      email: `user@${provider.toLowerCase()}.com`,
      platforms: [provider.toLowerCase()]
    }));
    
    localStorage.setItem('isLoggedIn', 'true');
    router.push('/dashboard');
  };
  
  // Navigate to the next step or complete onboarding
  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };
  
  // Handle field value changes
  const handleChange = (value: string | string[] | boolean, field?: string) => {
    const fieldName = field || steps[step].field;
    
    setFormData({
      ...formData,
      [fieldName]: value
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
      phone: formData.phone,
      platforms: formData.platforms,
      paymentAdded: !formData.skipPayment
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
    
    // Special case for payment step
    if (currentStep.field === 'payment') {
      return currentStep.nextEnabled(formData);
    }
    
    // For other steps, use the specific field value with proper type assertion
    const value = formData[currentStep.field as keyof typeof formData];
    return currentStep.nextEnabled(value);
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

  // Render payment form fields
  const renderPaymentFields = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="skipPayment"
            checked={formData.skipPayment}
            onChange={(e) => handleChange(e.target.checked, 'skipPayment')}
            className="rounded border-gray-400 text-red-500 focus:ring-red-500"
          />
          <label htmlFor="skipPayment" className="ml-2 cursor-pointer">
            Skip payment setup for now
          </label>
        </div>
        
        {!formData.skipPayment && (
          <>
            <p className="text-sm mb-3">Choose how you want to receive your earnings from campaigns:</p>
            
            <div className="grid grid-cols-1 gap-3">
              <motion.button
                className={`p-4 border rounded-lg text-left flex items-start gap-3 ${formData.paymentMethod === 'bank' ? 'border-green-500 bg-green-900 bg-opacity-10' : ''}`}
                whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.05)" }}
                onClick={() => handleChange('bank', 'paymentMethod')}
              >
                <div className="mt-1">
                  <svg className="h-5 w-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Bank Account</p>
                  <p className="text-sm text-gray-400">Receive direct deposits to your bank account</p>
                </div>
                {formData.paymentMethod === 'bank' && (
                  <div className="absolute right-4 top-4">
                    <svg className="h-5 w-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                )}
              </motion.button>
              
              <motion.button
                className={`p-4 border rounded-lg text-left flex items-start gap-3 ${formData.paymentMethod === 'paypal' ? 'border-blue-500 bg-blue-900 bg-opacity-10' : ''}`}
                whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.05)" }}
                onClick={() => handleChange('paypal', 'paymentMethod')}
              >
                <div className="mt-1">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 11l5-7"></path>
                    <path d="M21 6l-3 7"></path>
                    <path d="M11 4h1a3 3 0 0 1 3 3v0a3 3 0 0 1-3 3h-1v5"></path>
                    <path d="M14 15v-3a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-1"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-medium">PayPal</p>
                  <p className="text-sm text-gray-400">Get paid quickly to your PayPal account</p>
                </div>
                {formData.paymentMethod === 'paypal' && (
                  <div className="absolute right-4 top-4">
                    <svg className="h-5 w-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                )}
              </motion.button>
            </div>
            
            {formData.paymentMethod === 'paypal' && (
              <div className="mt-3">
                <label className="block text-sm opacity-70 mb-1">PayPal Email</label>
                <input
                  type="email"
                  value={formData.paymentEmail}
                  onChange={(e) => handleChange(e.target.value, 'paymentEmail')}
                  className="w-full p-3 bg-transparent border rounded focus:border-red-500 outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>
            )}
            
            {formData.paymentMethod === 'bank' && (
              <div className="space-y-3 mt-3">
                <div>
                  <label className="block text-sm opacity-70 mb-1">Account Holder Name</label>
                  <input
                    type="text"
                    value={formData.accountName}
                    onChange={(e) => handleChange(e.target.value, 'accountName')}
                    className="w-full p-3 bg-transparent border rounded focus:border-red-500 outline-none transition-colors"
                    placeholder="Full name on account"
                  />
                </div>
                
                <div>
                  <label className="block text-sm opacity-70 mb-1">Routing Number</label>
                  <input
                    type="text"
                    value={formData.routingNumber}
                    onChange={(e) => handleChange(formatRoutingNumber(e.target.value), 'routingNumber')}
                    className="w-full p-3 bg-transparent border rounded focus:border-red-500 outline-none transition-colors"
                    placeholder="9 digits"
                    maxLength={9}
                  />
                </div>
                
                <div>
                  <label className="block text-sm opacity-70 mb-1">Account Number</label>
                  <input
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) => handleChange(formatAccountNumber(e.target.value), 'accountNumber')}
                    className="w-full p-3 bg-transparent border rounded focus:border-red-500 outline-none transition-colors"
                    placeholder="Your account number"
                  />
                </div>
              </div>
            )}
            
            <p className="text-xs text-gray-400 mt-3">
              Your payment information is encrypted and secure. This account will be used
              to receive your earnings from campaigns once you reach the minimum payout threshold.
            </p>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Minimal header */}
      <header className="p-4 border-b border-gray-800">
        <div className="text-2xl font-bold">CREATE_OS</div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Social Login Options */}
          {step === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <p className="text-center text-sm text-gray-400 mb-3">Sign up faster with</p>
              <div className="grid grid-cols-4 gap-3">
                <motion.button
                  className="flex items-center justify-center border border-gray-700 p-3 rounded-lg"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSocialLogin('Google')}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"/>
                    <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2970142 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"/>
                    <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"/>
                    <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"/>
                  </svg>
                </motion.button>
                
                <motion.button
                  className="flex items-center justify-center border border-gray-700 p-3 rounded-lg"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSocialLogin('Facebook')}
                >
                  <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" />
                  </svg>
                </motion.button>
                
                <motion.button
                  className="flex items-center justify-center border border-gray-700 p-3 rounded-lg"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSocialLogin('Twitter')}
                >
                  <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </motion.button>
                
                <motion.button
                  className="flex items-center justify-center border border-gray-700 p-3 rounded-lg"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSocialLogin('Instagram')}
                >
                  <svg className="h-5 w-5 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </motion.button>
              </div>
              
              <div className="flex items-center my-4">
                <div className="flex-grow border-t border-gray-700"></div>
                <span className="flex-shrink mx-4 text-sm text-gray-400">or continue with email</span>
                <div className="flex-grow border-t border-gray-700"></div>
              </div>
            </motion.div>
          )}
        
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
              
              {/* Input field based on step type */}
              {steps[step].type === 'text' || steps[step].type === 'email' || steps[step].type === 'password' || steps[step].type === 'tel' ? (
                <input
                  type={steps[step].type}
                  value={formData[steps[step].field as keyof typeof formData] as string}
                  onChange={(e) => handleChange(e.target.value)}
                  placeholder={steps[step].placeholder}
                  className="w-full p-4 bg-transparent border border-gray-700 rounded-lg text-xl focus:border-red-500 focus:outline-none transition-colors"
                  autoFocus
                />
              ) : steps[step].type === 'multi-select' ? (
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
              ) : steps[step].type === 'payment' ? (
                renderPaymentFields()
              ) : null}
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
            {step === 2 && "Your phone helps secure your account and receive notifications"}
            {step === 3 && "Use at least 6 characters for a secure password"}
            {step === 4 && "You can connect more platforms later in your settings"}
            {step === 5 && "Your payment details are securely encrypted"}
          </div>
        </div>
      </main>
    </div>
  );
};

export default OnboardingPage;