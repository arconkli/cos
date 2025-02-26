'use client';

// src/components/Onboarding.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ArrowRight, ArrowLeft, Check, Zap,
  Eye, DollarSign, Building, Users, ArrowUpRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// Onboarding steps data
const steps = [
  {
    title: "WELCOME TO CREATE_OS",
    description: "The monetization platform for creators. No follower requirements. No complex sign-ups.",
    icon: <Zap className="h-10 w-10 text-red-500" />,
  },
  {
    title: "CONNECT YOUR PLATFORMS",
    description: "Link your social accounts from TikTok, Instagram, YouTube, and more. No minimum followers required.",
    icon: <Users className="h-10 w-10 text-blue-500" />,
  },
  {
    title: "CREATE ENGAGING CONTENT",
    description: "Choose campaigns that match your style, follow simple guidelines, and post with campaign hashtags.",
    icon: <Eye className="h-10 w-10 text-purple-500" />,
  },
  {
    title: "GET PAID FOR VIEWS",
    description: "Earn based on your content's performance. Minimum threshold starts at just 100K views.",
    icon: <DollarSign className="h-10 w-10 text-green-500" />,
  },
  {
    title: "START EARNING TODAY",
    description: "Ready to monetize your creativity? Let's set up your creator profile.",
    icon: <Building className="h-10 w-10 text-red-500" />,
  }
];

// Background pattern from existing components
const BackgroundPattern = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <svg width="100%" height="100%" className="opacity-5">
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
      </pattern>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  </div>
);

// OnboardingProgress component
const OnboardingProgress = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => (
  <div className="flex gap-2 justify-center mt-6">
    {Array.from({ length: totalSteps }).map((_, index) => (
      <motion.div
        key={index}
        className={`h-1 rounded-full ${
          index === currentStep ? 'bg-red-500 w-8' : 'bg-white bg-opacity-30 w-4'
        }`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1 }}
      />
    ))}
  </div>
);

interface OnboardingProps {
  onComplete: () => void;
  onSkip: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    platforms: {
      tiktok: false,
      instagram: false,
      youtube: false,
      twitter: false
    }
  });
  
  const router = useRouter();
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox' && name.startsWith('platform-')) {
      const platform = name.replace('platform-', '');
      setFormData({
        ...formData,
        platforms: {
          ...formData.platforms,
          [platform]: checked
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleComplete = () => {
    // Here you would typically submit the form data to your backend
    // For demo, we'll just store in localStorage as a user object
    const userData = {
      name: formData.name || 'Demo User',
      email: formData.email || 'demo@create-os.com',
      platforms: Object.entries(formData.platforms)
        .filter(([_, enabled]) => enabled)
        .map(([platform]) => platform)
    };
    
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
    
    onComplete();
    router.push('/dashboard');
  };

  // Final step with form
  const renderFinalStep = () => (
    <motion.div 
      className="space-y-4 w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Your Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 bg-transparent border rounded focus:border-red-500 outline-none transition-colors"
            placeholder="Enter your name"
          />
        </div>
        
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 bg-transparent border rounded focus:border-red-500 outline-none transition-colors"
            placeholder="your@email.com"
          />
        </div>
        
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 bg-transparent border rounded focus:border-red-500 outline-none transition-colors"
            placeholder="••••••••"
          />
        </div>
        
        <div>
          <label className="block text-sm mb-1">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-3 bg-transparent border rounded focus:border-red-500 outline-none transition-colors"
            placeholder="••••••••"
          />
        </div>
        
        <div className="pt-4">
          <p className="font-bold mb-2">Connect Your Platforms</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="platform-tiktok"
                name="platform-tiktok"
                checked={formData.platforms.tiktok}
                onChange={handleChange}
                className="rounded border-gray-400 text-red-500 focus:ring-red-500"
              />
              <label htmlFor="platform-tiktok">TikTok</label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="platform-instagram"
                name="platform-instagram"
                checked={formData.platforms.instagram}
                onChange={handleChange}
                className="rounded border-gray-400 text-red-500 focus:ring-red-500"
              />
              <label htmlFor="platform-instagram">Instagram</label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="platform-youtube"
                name="platform-youtube"
                checked={formData.platforms.youtube}
                onChange={handleChange}
                className="rounded border-gray-400 text-red-500 focus:ring-red-500"
              />
              <label htmlFor="platform-youtube">YouTube</label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="platform-twitter"
                name="platform-twitter"
                checked={formData.platforms.twitter}
                onChange={handleChange}
                className="rounded border-gray-400 text-red-500 focus:ring-red-500"
              />
              <label htmlFor="platform-twitter">X (Twitter)</label>
            </div>
          </div>
          <p className="text-xs mt-2 opacity-70">You can always connect more platforms later</p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div 
      className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <BackgroundPattern />
      
      <motion.div
        className="absolute -right-20 -top-20 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"
        animate={{
          x: [0, 10, 0],
          y: [0, 10, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute -left-20 -bottom-20 w-64 h-64 bg-red-500 opacity-10 rounded-full blur-3xl"
        animate={{
          x: [0, -10, 0],
          y: [0, -10, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <div className="bg-black border border-white border-opacity-20 rounded-lg p-8 max-w-2xl w-full relative overflow-hidden">
        <div className="absolute top-4 right-4">
          <motion.button
            onClick={onSkip}
            className="p-2 rounded-full hover:bg-white hover:bg-opacity-10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="h-5 w-5" />
          </motion.button>
        </div>
        
        <div className="flex flex-col items-center justify-center mb-8">
          {steps[currentStep].icon}
          <motion.h2 
            className="text-2xl md:text-3xl font-bold text-center mt-4"
            key={`title-${currentStep}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {steps[currentStep].title}
          </motion.h2>
          <motion.p 
            className="text-center text-gray-300 mt-2 max-w-md"
            key={`desc-${currentStep}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {steps[currentStep].description}
          </motion.p>
        </div>
        
        {/* Content for each step */}
        <AnimatePresence mode="wait">
          {currentStep === steps.length - 1 ? (
            renderFinalStep()
          ) : (
            <motion.div 
              key={`step-content-${currentStep}`}
              className="flex justify-center items-center min-h-[200px]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
            >
              {currentStep === 0 && (
                <motion.div
                  className="w-full flex justify-center" 
                  whileHover={{ scale: 1.02 }}
                >
                  <img 
                    src="/api/placeholder/500/300" 
                    alt="Platform Overview" 
                    className="rounded-lg border border-white border-opacity-20 max-w-full h-auto"
                  />
                </motion.div>
              )}
              
              {currentStep === 1 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['TikTok', 'Instagram', 'YouTube', 'X'].map((platform, i) => (
                    <motion.div 
                      key={platform}
                      className="border p-3 rounded-lg flex flex-col items-center justify-center text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.05, borderColor: i === 0 ? '#69C9D0' : i === 1 ? '#E1306C' : i === 2 ? '#FF0000' : '#1DA1F2' }}
                    >
                      <div className="h-10 w-10 mb-2 flex items-center justify-center">
                        {i === 0 && <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16.5 7.3c-.4-.1-.8-.1-1.2-.1-3 0-5.6 2-6.7 4.7-.3.7-.4 1.5-.4 2.3 0 3.3 2.7 6 6 6 .8 0 1.6-.1 2.3-.4.8-.3 1.5-.8 2-1.3.1-.1.1-.3.2-.4V9.9c0-.1 0-.3-.1-.4-.5-2.2-2.4-3.8-4.7-3.8-.4 0-.8 0-1.2.1-.3.1-.7.2-1 .4-.2.2-.4.4-.5.7-.1.3-.2.7-.2 1 0 1.4 1 2.6 2.4 2.6h.1V15c-.9 0-1.7-.1-2.5-.4-1.7-.6-3-2-3.6-3.7-.2-.6-.3-1.3-.3-2 0-1.5.5-2.9 1.4-4C7 3 8.4 2.3 9.9 2.1c1.5-.2 3.1 0 4.5.7 1.3.6 2.4 1.7 3 3 .1.1.2.2.3.2.1.1.3.1.4.1l.1-.1c.4-.4.6-.9.8-1.4.1-.5.2-1.1.1-1.6 0-.1-.1-.2-.3-.2z"/><path d="M16 18.4c-.1.2-.4.3-.6.3-1.7 0-3.1-1.4-3.1-3.1 0-.2.1-.4.3-.6.1-.1.3-.2.5-.1 1.7 0 3.1 1.4 3.1 3.1 0 .2-.1.4-.3.6 0 .1-.1.1-.2.1z"/></svg>}
                        {i === 1 && <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><circle cx="17.5" cy="6.5" r="1.5"></circle></svg>}
                        {i === 2 && <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>}
                        {i === 3 && <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>}
                      </div>
                      <p className="text-sm">{platform}</p>
                    </motion.div>
                  ))}
                </div>
              )}
              
              {currentStep === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  <motion.div 
                    className="border p-4 rounded-lg relative overflow-hidden"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    whileHover={{ scale: 1.02, borderColor: '#FF4444' }}
                  >
                    <div className="absolute -right-20 -top-20 w-40 h-40 bg-red-500 opacity-5 rounded-full blur-xl" />
                    <h3 className="font-bold mb-2">Netflix Series Launch</h3>
                    <p className="text-sm opacity-80 mb-3">Create unique content promoting our new series launch.</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-0.5 bg-white bg-opacity-10 rounded-full text-xs">TikTok</span>
                      <span className="px-2 py-0.5 bg-white bg-opacity-10 rounded-full text-xs">Instagram</span>
                    </div>
                    <p className="text-xs mt-3 opacity-70">$500 per 1M views</p>
                  </motion.div>
                  
                  <motion.div 
                    className="border p-4 rounded-lg relative overflow-hidden"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.02, borderColor: '#4287f5' }}
                  >
                    <div className="absolute -right-20 -top-20 w-40 h-40 bg-blue-500 opacity-5 rounded-full blur-xl" />
                    <h3 className="font-bold mb-2">Summer Fashion Collection</h3>
                    <p className="text-sm opacity-80 mb-3">Showcase items from the new collection in your style.</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-0.5 bg-white bg-opacity-10 rounded-full text-xs">YouTube</span>
                      <span className="px-2 py-0.5 bg-white bg-opacity-10 rounded-full text-xs">Instagram</span>
                    </div>
                    <p className="text-xs mt-3 opacity-70">$600 per 1M views</p>
                  </motion.div>
                </div>
              )}
              
              {currentStep === 3 && (
                <motion.div 
                  className="text-center space-y-6 max-w-md mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex justify-center items-center gap-6">
                    <motion.div 
                      className="flex flex-col items-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <p className="text-3xl font-bold text-blue-400">100K</p>
                      <p className="text-sm">Minimum Views</p>
                    </motion.div>
                    
                    <motion.div 
                      className="w-px h-16 bg-white bg-opacity-20"
                      initial={{ height: 0 }}
                      animate={{ height: 64 }}
                      transition={{ delay: 0.3 }}
                    />
                    
                    <motion.div 
                      className="flex flex-col items-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <p className="text-3xl font-bold text-green-400">$500</p>
                      <p className="text-sm">Per 1M Views</p>
                    </motion.div>
                  </div>
                  
                  <motion.div 
                    className="border p-4 rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <p className="text-sm mb-3">Monthly payments for qualifying content:</p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>500K views</span>
                        <span className="font-bold">$250</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>1M views</span>
                        <span className="font-bold">$500</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>5M views</span>
                        <span className="font-bold">$2,500</span>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        <OnboardingProgress currentStep={currentStep} totalSteps={steps.length} />
        
        <div className="flex justify-between mt-8">
          <motion.button
            onClick={handlePrevious}
            className={`px-4 py-2 border rounded flex items-center gap-2 ${
              currentStep === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            whileHover={currentStep > 0 ? { scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" } : {}}
            whileTap={currentStep > 0 ? { scale: 0.98 } : {}}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </motion.button>
          
          <motion.button
            onClick={currentStep === steps.length - 1 ? handleComplete : handleNext}
            className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-700 rounded flex items-center gap-2 font-bold"
            whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(255,68,68,0.3)" }}
            whileTap={{ scale: 0.98 }}
          >
            {currentStep === steps.length - 1 ? (
              <>
                Get Started <Check className="h-4 w-4" />
              </>
            ) : (
              <>
                Next <ArrowRight className="h-4 w-4" />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default Onboarding;