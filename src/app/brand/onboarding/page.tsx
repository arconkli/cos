'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, 
  Building, 
  Users, 
  Calendar, 
  CreditCard, 
  Check, 
  X, 
  DollarSign,
  Globe
} from 'lucide-react';

// Define types for steps and form data
interface FormData {
  companyName: string;
  industry: string;
  website: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  password: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  paymentMethod: string;
  cardNumber: string;
  cardName: string;
  cardExpiry: string;
  cardCVC: string;
  skipPayment: boolean;
}

type StepField = 'company' | 'contact' | 'password' | 'payment';

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
  nextEnabled: (formData: FormData) => boolean;
}

const BrandOnboardingPage: React.FC = () => {
  // State to manage the current onboarding step
  const [step, setStep] = useState(0);
  
  // Form data
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    industry: '',
    website: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    password: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: '',
    },
    paymentMethod: '',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCVC: '',
    skipPayment: false
  });
  
  const router = useRouter();
  
  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };
  
  // Format card expiry date
  const formatExpiryDate = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/, '$1/$2')
      .substr(0, 5);
  };
  
  // Steps configuration
  const steps: Step[] = [
    {
      title: "Let's get started",
      subtitle: "Tell us about your company",
      field: "company",
      type: "company",
      nextEnabled: (data: FormData) => 
        data.companyName.trim().length > 0 && 
        data.industry.trim().length > 0,
    },
    {
      title: "Contact information",
      subtitle: "How can creators reach you?",
      field: "contact",
      type: "contact",
      nextEnabled: (data: FormData) => 
        data.contactName.trim().length > 0 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail),
    },
    {
      title: "Create a password",
      subtitle: "Secure your brand account",
      field: "password",
      type: "password",
      placeholder: "••••••••",
      nextEnabled: (data: FormData) => data.password.length >= 8,
    },
    {
      title: "Payment Information",
      subtitle: "Set up your campaign funding method",
      field: "payment",
      type: "payment",
      nextText: "Complete",
      nextEnabled: (data: FormData) => {
        // Skip validation if the user chooses to skip payment setup
        if (data.skipPayment) return true;
        
        // Otherwise, check if payment information is complete
        return (
          data.paymentMethod === 'card' && 
          data.cardNumber.replace(/\s/g, '').length === 16 &&
          data.cardName.trim().length > 0 &&
          data.cardExpiry.length === 5 &&
          data.cardCVC.length === 3
        );
      },
    }
  ];
  
  // Handle field value changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested fields (e.g., billingAddress.street)
      const [parent, child] = name.split('.');
      const parentKey = parent as keyof FormData;
      const parentObj = formData[parentKey];
      
      if (typeof parentObj === 'object' && parentObj !== null) {
        setFormData({
          ...formData,
          [parent]: {
            ...parentObj,
            [child]: value
          }
        });
      }
    } else if (name === 'cardNumber') {
      setFormData({
        ...formData,
        cardNumber: formatCardNumber(value)
      });
    } else if (name === 'cardExpiry') {
      setFormData({
        ...formData,
        cardExpiry: formatExpiryDate(value)
      });
    } else if (name === 'cardCVC') {
      setFormData({
        ...formData,
        cardCVC: value.replace(/\D/g, '').substr(0, 3)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // Navigate to the next step or complete onboarding
  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };
  
  // Complete onboarding and redirect to dashboard
  const handleComplete = () => {
    // Create brand data object
    const brandData = {
      companyName: formData.companyName,
      industry: formData.industry,
      website: formData.website,
      contactName: formData.contactName,
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone,
      paymentAdded: !formData.skipPayment
    };
    
    // Save brand data and mark as logged in as a brand
    localStorage.setItem('brandData', JSON.stringify(brandData));
    localStorage.setItem('isBrandLoggedIn', 'true');
    
    // Redirect to brand dashboard
    router.push('/brand/dashboard');
  };
  
  // Check if the next button should be enabled
  const isNextEnabled = () => {
    const currentStep = steps[step];
    return currentStep.nextEnabled(formData);
  };
  
  // Render company information fields
  const renderCompanyFields = () => {
    return (
      <div className="space-y-4">
        <div>
          <label htmlFor="companyName" className="block text-sm opacity-70 mb-1">Company Name</label>
          <input
            id="companyName"
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            className="w-full p-3 bg-transparent border rounded focus:border-red-500 outline-none transition-colors"
            placeholder="Your company name"
            autoFocus
          />
        </div>
        
        <div>
          <label htmlFor="industry" className="block text-sm opacity-70 mb-1">Industry</label>
          <select
            id="industry"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            className="w-full p-3 bg-transparent border rounded focus:border-red-500 outline-none transition-colors"
          >
            <option value="">Select your industry</option>
            <option value="entertainment">Entertainment</option>
            <option value="fashion">Fashion</option>
            <option value="beauty">Beauty</option>
            <option value="technology">Technology</option>
            <option value="food">Food & Beverage</option>
            <option value="travel">Travel</option>
            <option value="health">Health & Fitness</option>
            <option value="education">Education</option>
            <option value="finance">Finance</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="website" className="block text-sm opacity-70 mb-1">Website (Optional)</label>
          <input
            id="website"
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="w-full p-3 bg-transparent border rounded focus:border-red-500 outline-none transition-colors"
            placeholder="https://yourcompany.com"
          />
        </div>
      </div>
    );
  };
  
  // Render contact information fields
  const renderContactFields = () => {
    return (
      <div className="space-y-4">
        <div>
          <label htmlFor="contactName" className="block text-sm opacity-70 mb-1">Contact Name</label>
          <input
            id="contactName"
            type="text"
            name="contactName"
            value={formData.contactName}
            onChange={handleChange}
            className="w-full p-3 bg-transparent border rounded focus:border-red-500 outline-none transition-colors"
            placeholder="Your name"
            autoFocus
          />
        </div>
        
        <div>
          <label htmlFor="contactEmail" className="block text-sm opacity-70 mb-1">Contact Email</label>
          <input
            id="contactEmail"
            type="email"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            className="w-full p-3 bg-transparent border rounded focus:border-red-500 outline-none transition-colors"
            placeholder="you@yourcompany.com"
          />
        </div>
        
        <div>
          <label htmlFor="contactPhone" className="block text-sm opacity-70 mb-1">Contact Phone (Optional)</label>
          <input
            id="contactPhone"
            type="tel"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            className="w-full p-3 bg-transparent border rounded focus:border-red-500 outline-none transition-colors"
            placeholder="Your phone number"
          />
        </div>
      </div>
    );
  };
  
  // Render payment fields
  const renderPaymentFields = () => {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm mb-3">Choose how you want to fund your campaigns:</p>
          
          <div className="grid grid-cols-1 gap-3">
            <motion.button
              className={`p-4 border rounded-lg text-left flex items-start gap-3 ${formData.paymentMethod === 'card' ? 'border-green-500 bg-green-900 bg-opacity-10' : ''}`}
              whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.05)" }}
              onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
              type="button"
            >
              <div className="mt-1">
                <CreditCard className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="font-medium">Credit / Debit Card</p>
                <p className="text-sm text-gray-400">Fund campaigns directly with your card</p>
              </div>
              {formData.paymentMethod === 'card' && (
                <div className="absolute right-4 top-4">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
              )}
            </motion.button>
          </div>
        </div>
        
        {formData.paymentMethod === 'card' && (
          <div className="space-y-4 border-t border-gray-700 pt-4 mt-4">
            <div>
              <label htmlFor="cardName" className="block text-sm opacity-70 mb-1">Cardholder Name</label>
              <input
                id="cardName"
                type="text"
                name="cardName"
                value={formData.cardName}
                onChange={handleChange}
                className="w-full p-3 bg-transparent border rounded focus:border-red-500 outline-none transition-colors"
                placeholder="Name on card"
              />
            </div>
            
            <div>
              <label htmlFor="cardNumber" className="block text-sm opacity-70 mb-1">Card Number</label>
              <input
                id="cardNumber"
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                className="w-full p-3 bg-transparent border rounded focus:border-red-500 outline-none transition-colors"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="cardExpiry" className="block text-sm opacity-70 mb-1">Expiry Date</label>
                <input
                  id="cardExpiry"
                  type="text"
                  name="cardExpiry"
                  value={formData.cardExpiry}
                  onChange={handleChange}
                  className="w-full p-3 bg-transparent border rounded focus:border-red-500 outline-none transition-colors"
                  placeholder="MM/YY"
                  maxLength={5}
                />
              </div>
              
              <div>
                <label htmlFor="cardCVC" className="block text-sm opacity-70 mb-1">CVC</label>
                <input
                  id="cardCVC"
                  type="password"
                  name="cardCVC"
                  value={formData.cardCVC}
                  onChange={handleChange}
                  className="w-full p-3 bg-transparent border rounded focus:border-red-500 outline-none transition-colors"
                  placeholder="•••"
                  maxLength={3}
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label htmlFor="billingAddress.country" className="block text-sm opacity-70 mb-1">Country</label>
              <select
                id="billingAddress.country"
                name="billingAddress.country"
                value={formData.billingAddress.country}
                onChange={handleChange}
                className="w-full p-3 bg-transparent border rounded focus:border-red-500 outline-none transition-colors"
              >
                <option value="">Select country</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="UK">United Kingdom</option>
                <option value="AU">Australia</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        )}
        
        <div className="mt-5 pt-5 border-t border-gray-700">
          <p className="text-xs text-gray-400 mt-2 mb-4">
            Your payment information is encrypted and secure. You'll only be charged when 
            you create campaigns, and we'll always show clear pricing upfront.
          </p>
        </div>
      </div>
    );
  };

  // Render appropriate fields based on current step
  const renderStepFields = () => {
    const currentStep = steps[step];
    
    switch (currentStep.field) {
      case 'company':
        return renderCompanyFields();
      case 'contact':
        return renderContactFields();
      case 'password':
        return (
          <div>
            <label htmlFor="password" className="block text-sm opacity-70 mb-1">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 bg-transparent border rounded focus:border-red-500 outline-none transition-colors"
              placeholder="••••••••"
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-2">Use at least 8 characters with a mix of letters, numbers, and symbols</p>
          </div>
        );
      case 'payment':
        return renderPaymentFields();
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Minimal header */}
      <header className="p-4 border-b border-gray-800">
        <div className="text-2xl font-bold">CREATE_OS</div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Progress bar */}
          <div className="flex gap-1 mb-8">
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
              
              {/* Input fields for the current step */}
              {renderStepFields()}
            </motion.div>
          </AnimatePresence>
          
          {/* Next and Skip buttons */}
          <div className="flex flex-col space-y-3">
            <motion.button
              onClick={handleNext}
              className={`w-full p-4 flex items-center justify-center gap-2 rounded-lg font-bold text-xl transition-colors ${
                isNextEnabled() 
                  ? 'bg-gradient-to-r from-red-500 to-red-700 text-white' 
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
              whileHover={isNextEnabled() ? { scale: 1.02 } : {}}
              whileTap={isNextEnabled() ? { scale: 0.98 } : {}}
              disabled={!isNextEnabled()}
              type="button"
            >
              {steps[step].nextText || 'Continue'} 
              <ArrowRight className="h-5 w-5" />
            </motion.button>
            
            {step === steps.length - 1 && ( // Only show skip button on payment step
              <motion.button
                onClick={() => {
                  setFormData({...formData, skipPayment: true});
                  handleComplete();
                }}
                className="text-gray-400 py-2 hover:text-gray-200 transition-colors text-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
              >
                Skip payment setup for now
              </motion.button>
            )}
          </div>
          
          {/* Additional tips or help text */}
          <div className="mt-4 text-center text-gray-500 text-sm">
            {step === 0 && "We're excited to have your brand on CREATE_OS"}
            {step === 1 && "We'll never share your contact information with third parties"}
            {step === 2 && "Your password secures your brand's campaign data and analytics"}
            {step === 3 && "You can always set up your payment method later in settings"}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BrandOnboardingPage;