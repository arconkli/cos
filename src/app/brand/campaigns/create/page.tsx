import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, ArrowRight, Calendar, Plus, Trash, Check,
  Upload, DollarSign, Target, Layers, Users, Clock, Hash,
  HelpCircle, ExternalLink, X, AlertCircle, CreditCard, Info, Eye,
  FileText, Image, MessageSquare, Globe
} from 'lucide-react';

// Interface for campaign form data
interface CampaignFormData {
  title: string;
  brief: string;
  goal: string;
  platforms: {
    tiktok: boolean;
    instagram: boolean;
    youtube: boolean;
    twitter: boolean;
  };
  contentType: 'original' | 'repurposed' | 'both';
  budgetAllocation: {
    original: number;
    repurposed: number;
  };
  startDate: string;
  endDate: string;
  budget: string;
  payoutRate: {
    original: string;
    repurposed: string;
  };
  hashtags: {
    original: string;
    repurposed: string;
  };
  guidelines: string[];
  assets: File[];
  paymentMethod: string;
  termsAccepted: boolean;
}

// Interface for steps
interface Step {
  title: string;
  subtitle: string;
  isComplete: (data: CampaignFormData) => boolean;
}

// Calculate estimated views based on budget and rates
const calculateEstimatedViews = (
  budget: string, 
  originalRate: string, 
  repurposedRate: string, 
  contentType: 'original' | 'repurposed' | 'both',
  budgetAllocation: { original: number, repurposed: number }
) => {
  const budgetValue = parseFloat(budget);
  if (isNaN(budgetValue) || budgetValue <= 0) return { originalViews: 0, repurposedViews: 0, totalViews: 0 };
  
  if (contentType === 'original') {
    const originalRateValue = parseFloat(originalRate);
    if (isNaN(originalRateValue) || originalRateValue <= 0) return { originalViews: 0, repurposedViews: 0, totalViews: 0 };
    const views = (budgetValue / originalRateValue) * 1000000;
    return { originalViews: views, repurposedViews: 0, totalViews: views };
  } 
  else if (contentType === 'repurposed') {
    const repurposedRateValue = parseFloat(repurposedRate);
    if (isNaN(repurposedRateValue) || repurposedRateValue <= 0) return { originalViews: 0, repurposedViews: 0, totalViews: 0 };
    const views = (budgetValue / repurposedRateValue) * 1000000;
    return { originalViews: 0, repurposedViews: views, totalViews: views };
  }
  else {
    const originalRateValue = parseFloat(originalRate);
    const repurposedRateValue = parseFloat(repurposedRate);
    if (isNaN(originalRateValue) || originalRateValue <= 0 || isNaN(repurposedRateValue) || repurposedRateValue <= 0) {
      return { originalViews: 0, repurposedViews: 0, totalViews: 0 };
    }
    
    const originalBudget = budgetValue * (budgetAllocation.original / 100);
    const repurposedBudget = budgetValue * (budgetAllocation.repurposed / 100);
    
    const originalViews = (originalBudget / originalRateValue) * 1000000;
    const repurposedViews = (repurposedBudget / repurposedRateValue) * 1000000;
    
    return {
      originalViews,
      repurposedViews,
      totalViews: originalViews + repurposedViews
    };
  }
};

const CampaignCreationPage = () => {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // Sample payment methods (in a real app, this would come from an API)
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 'pm_1',
      type: 'visa',
      last4: '4242',
      expiry: '12/25',
      isDefault: true
    },
    {
      id: 'pm_2',
      type: 'mastercard',
      last4: '5555',
      expiry: '10/26',
      isDefault: false
    }
  ]);
  
  // Get today's date formatted as YYYY-MM-DD for date inputs
  const today = new Date().toISOString().split('T')[0];
  // Get date 30 days from now
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  const defaultEndDate = thirtyDaysFromNow.toISOString().split('T')[0];
  
  // Initialize form data
  const [formData, setFormData] = useState<CampaignFormData>({
    title: '',
    brief: '',
    goal: '',
    platforms: {
      tiktok: false,
      instagram: false,
      youtube: false,
      twitter: false
    },
    contentType: 'original',
    budgetAllocation: {
      original: 70,
      repurposed: 30
    },
    startDate: today,
    endDate: defaultEndDate,
    budget: '',
    payoutRate: {
      original: '500',  // Default to $500 per 1M views for original
      repurposed: '250'  // Default to $250 per 1M views for repurposed
    },
    hashtags: {
      original: '#YourBrand #ad',
      repurposed: '#YourBrand #ad'
    },
    guidelines: [''],
    assets: [],
    paymentMethod: paymentMethods.find(method => method.isDefault)?.id || '',
    termsAccepted: false
  });
  
  // Define steps - REORDERED per request
  const steps: Step[] = [
    {
      title: 'Campaign Details',
      subtitle: 'Let\'s start with the basic information',
      isComplete: (data) => 
        data.title.trim().length > 0 && 
        data.goal.trim().length > 0
    },
    {
      title: 'Platforms & Content',
      subtitle: 'Choose where your campaign will run',
      isComplete: (data) => 
        (data.platforms.tiktok || data.platforms.instagram || 
        data.platforms.youtube || data.platforms.twitter) &&
        Boolean(data.contentType)
    },
    {
      title: 'Content Guidelines',
      subtitle: 'Create your campaign brief, hashtags, and assets',
      isComplete: (data) => {
        const validGuidelines = data.guidelines.filter(g => g.trim().length > 0).length > 0;
        const validHashtags = data.contentType === 'both' 
          ? data.hashtags.original.includes('#ad') && data.hashtags.repurposed.includes('#ad') && 
            data.hashtags.original !== data.hashtags.repurposed 
          : data.contentType === 'original' 
            ? data.hashtags.original.includes('#ad')
            : data.hashtags.repurposed.includes('#ad');
            
        return validGuidelines && validHashtags && 
               data.startDate !== '' && data.endDate !== '' &&
               data.brief.trim().length > 0;
      }
    },
    {
      title: 'Budget & Rates',
      subtitle: 'Set your campaign budget for views',
      isComplete: (data) => {
        const budgetValue = parseFloat(data.budget);
        const originalRateValue = parseFloat(data.payoutRate.original);
        
        let isValid = !isNaN(budgetValue) && budgetValue > 0 && 
                     !isNaN(originalRateValue) && originalRateValue > 0;
                     
        // If content type includes repurposed, check repurposed rate too
        if (data.contentType === 'both' || data.contentType === 'repurposed') {
          const repurposedRateValue = parseFloat(data.payoutRate.repurposed);
          isValid = isValid && !isNaN(repurposedRateValue) && repurposedRateValue > 0;
        }
        
        return isValid;
      }
    },
    {
      title: 'Payment Summary',
      subtitle: 'Review your payment details',
      isComplete: (data) => 
        data.paymentMethod !== ''
    },
    {
      title: 'Campaign Review',
      subtitle: 'Preview how your campaign appears to creators',
      isComplete: (data) => 
        data.termsAccepted
    }
  ];
  
  // Check authentication on mount
  useEffect(() => {
    const isBrandLoggedIn = localStorage.getItem('isBrandLoggedIn') === 'true';
    if (!isBrandLoggedIn) {
      router.push('/brand/login');
    }
  }, [router]);
  
  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    // For checkbox inputs, we need to handle the checked property
    if (type === 'checkbox') {
      // Use type assertion to tell TypeScript that this is an HTMLInputElement
      const checkboxInput = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: checkboxInput.checked
      });
      return;
    }
    
    if (name.includes('.')) {
      // Handle nested fields (e.g., payoutRate.original)
      const [parent, child] = name.split('.');
      const parentKey = parent as keyof typeof formData;
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
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // Handle checkbox changes for platforms
  const handlePlatformChange = (platform: keyof typeof formData.platforms) => {
    setFormData({
      ...formData,
      platforms: {
        ...formData.platforms,
        [platform]: !formData.platforms[platform]
      }
    });
  };
  
  // Handle budget allocation slider
  const handleBudgetAllocationChange = (value: number) => {
    setFormData({
      ...formData,
      budgetAllocation: {
        original: value,
        repurposed: 100 - value
      }
    });
  };
  
  // Handle hashtag changes with #ad validation
  const handleHashtagChange = (type: 'original' | 'repurposed', value: string) => {
    // Ensure value contains #ad - add it if it doesn't
    let newValue = value;
    if (!newValue.includes('#ad')) {
      // If they removed #ad, add it back
      newValue += ' #ad';
    }
    
    setFormData({
      ...formData,
      hashtags: {
        ...formData.hashtags,
        [type]: newValue
      }
    });
  };
  
  // Handle adding/removing guidelines
  const handleAddGuideline = () => {
    setFormData({
      ...formData,
      guidelines: [...formData.guidelines, '']
    });
  };
  
  const handleGuidelineChange = (index: number, value: string) => {
    const newGuidelines = [...formData.guidelines];
    newGuidelines[index] = value;
    
    setFormData({
      ...formData,
      guidelines: newGuidelines
    });
  };
  
  const handleRemoveGuideline = (index: number) => {
    const newGuidelines = [...formData.guidelines];
    newGuidelines.splice(index, 1);
    
    setFormData({
      ...formData,
      guidelines: newGuidelines
    });
  };
  
  // Handle file uploads
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFormData({
        ...formData,
        assets: [...formData.assets, ...newFiles]
      });
    }
  };
  
  const handleRemoveFile = (index: number) => {
    const newFiles = [...formData.assets];
    newFiles.splice(index, 1);
    
    setFormData({
      ...formData,
      assets: newFiles
    });
  };
  
  // Update content type and ensure proper hashtags
  const handleContentTypeChange = (type: 'original' | 'repurposed' | 'both') => {
    // Make sure we preserve existing hashtags when changing content types
    const updatedHashtags = { ...formData.hashtags };
    
    // Ensure both hashtags have #ad
    if (!updatedHashtags.original.includes('#ad')) {
      updatedHashtags.original += ' #ad';
    }
    if (!updatedHashtags.repurposed.includes('#ad')) {
      updatedHashtags.repurposed += ' #ad';
    }
    
    // If transitioning to "both" type and both hashtags are the same,
    // slightly modify the repurposed hashtag to make it different
    if (type === 'both' && updatedHashtags.original === updatedHashtags.repurposed) {
      updatedHashtags.repurposed = updatedHashtags.repurposed.replace('#ad', '#Repurposed #ad');
    }
    
    setFormData({
      ...formData,
      contentType: type,
      hashtags: updatedHashtags
    });
  };
  
  // Navigate between steps
  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    } else {
      setShowPreview(true);
    }
  };
  
  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    } else {
      router.push('/brand/dashboard');
    }
  };
  
  // Save campaign (in a real app, this would send data to a server)
  const handleSaveCampaign = () => {
    // Simulate API call
    setTimeout(() => {
      // Store in localStorage for demo purposes
      const campaigns = JSON.parse(localStorage.getItem('brandCampaigns') || '[]');
      campaigns.push({
        ...formData,
        id: `campaign-${Date.now()}`,
        status: 'draft',
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('brandCampaigns', JSON.stringify(campaigns));
      
      setShowSaveSuccess(true);
      
      // Redirect after brief delay to show success message
      setTimeout(() => {
        router.push('/brand/dashboard');
      }, 2000);
    }, 1000);
  };
  
  // Submit campaign for review
  const handleSubmitCampaign = () => {
    // Start processing payment animation
    setIsProcessingPayment(true);
    
    // Simulate payment verification and API call
    setTimeout(() => {
      // Store in localStorage for demo purposes
      const campaigns = JSON.parse(localStorage.getItem('brandCampaigns') || '[]');
      campaigns.push({
        ...formData,
        id: `campaign-${Date.now()}`,
        status: 'pending-approval',
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('brandCampaigns', JSON.stringify(campaigns));
      
      setIsProcessingPayment(false);
      setShowSaveSuccess(true);
      
      // Redirect after brief delay to show success message
      setTimeout(() => {
        router.push('/brand/dashboard');
      }, 2000);
    }, 2500);
  };
  
  // Check if current step is complete
  const isCurrentStepComplete = () => {
    return steps[step].isComplete(formData);
  };

  // Calculate view estimates
  const viewEstimates = calculateEstimatedViews(
    formData.budget,
    formData.payoutRate.original,
    formData.payoutRate.repurposed,
    formData.contentType,
    formData.budgetAllocation
  );
  
  // Helper to format numbers as money
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Helper to format numbers in millions with one decimal
  const formatMillions = (num: number) => {
    return (num / 1000000).toFixed(1) + 'M';
  };
  
  // Helper to check if hashtags contain #ad
  const hashtagsValid = () => {
    if (formData.contentType === 'both') {
      return formData.hashtags.original.includes('#ad') && 
             formData.hashtags.repurposed.includes('#ad') &&
             formData.hashtags.original !== formData.hashtags.repurposed;
    } else if (formData.contentType === 'original') {
      return formData.hashtags.original.includes('#ad');
    } else {
      return formData.hashtags.repurposed.includes('#ad');
    }
  };
  
  // Render STEP 1: Campaign Details step (title and goal only)
  const renderDetailsStep = () => (
    <div className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
          Campaign Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-3 bg-transparent border border-gray-700 rounded-lg focus:border-red-500 outline-none"
          placeholder="e.g., Summer Movie Launch"
          required
        />
      </div>
      
      <div>
        <label htmlFor="goal" className="block text-sm font-medium text-gray-300 mb-1">
          Campaign Goal <span className="text-red-500">*</span>
        </label>
        <select
          id="goal"
          name="goal"
          value={formData.goal}
          onChange={handleChange}
          className="w-full p-3 bg-transparent border border-gray-700 rounded-lg focus:border-red-500 outline-none"
          required
        >
          <option value="">Select a primary goal</option>
          <option value="awareness">Brand Awareness</option>
          <option value="consideration">Content Promotion</option>
          <option value="conversion">Drive Viewership/Streaming</option>
          <option value="engagement">Community Engagement</option>
          <option value="launch">New Release Promotion</option>
          <option value="event">Event Promotion</option>
          <option value="other">Other</option>
        </select>
      </div>
      
      {/* Simple platform explanation */}
      <div className="mt-8 p-5 rounded-lg bg-black/40 border border-gray-800">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-black/60 rounded-lg border border-gray-700">
            <DollarSign className="h-6 w-6 text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-white mb-2">Simple View-Based Pricing</h3>
            <p className="text-gray-400">
              You pay for exactly the number of views your campaign receives. No hidden fees, 
              no extra commissions - just straightforward view-based pricing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Render STEP 2: Platforms and content type (without dates or budget allocation)
  const renderPlatformsStep = () => (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Globe className="h-5 w-5 text-blue-400" />
          <label className="block text-sm font-medium text-gray-300">
            Platforms <span className="text-red-500">*</span>
          </label>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            className={`p-4 border rounded-lg flex flex-col items-center cursor-pointer transition-colors ${
              formData.platforms.tiktok 
                ? 'border-cyan-500 bg-cyan-900/20' 
                : 'border-gray-700 hover:border-gray-500'
            }`}
            onClick={() => handlePlatformChange('tiktok')}
          >
            <svg className="h-8 w-8 text-cyan-400 mb-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
            </svg>
            <span className="font-medium">TikTok</span>
          </div>
          
          <div
            className={`p-4 border rounded-lg flex flex-col items-center cursor-pointer transition-colors ${
              formData.platforms.instagram 
                ? 'border-pink-500 bg-pink-900/20' 
                : 'border-gray-700 hover:border-gray-500'
            }`}
            onClick={() => handlePlatformChange('instagram')}
          >
            <svg className="h-8 w-8 text-pink-500 mb-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0z"/>
              <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
            <span className="font-medium">Instagram</span>
          </div>
          
          <div
            className={`p-4 border rounded-lg flex flex-col items-center cursor-pointer transition-colors ${
              formData.platforms.youtube 
                ? 'border-red-500 bg-red-900/20' 
                : 'border-gray-700 hover:border-gray-500'
            }`}
            onClick={() => handlePlatformChange('youtube')}
          >
            <svg className="h-8 w-8 text-red-500 mb-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span className="font-medium">YouTube</span>
          </div>
          
          <div
            className={`p-4 border rounded-lg flex flex-col items-center cursor-pointer transition-colors ${
              formData.platforms.twitter 
                ? 'border-blue-500 bg-blue-900/20' 
                : 'border-gray-700 hover:border-gray-500'
            }`}
            onClick={() => handlePlatformChange('twitter')}
          >
            <svg className="h-8 w-8 text-blue-400 mb-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
            </svg>
            <span className="font-medium">X/Twitter</span>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-3">
          <Layers className="h-5 w-5 text-purple-400" />
          <label className="block text-sm font-medium text-gray-300">
            Content Type <span className="text-red-500">*</span>
          </label>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              formData.contentType === 'original' 
                ? 'border-green-500 bg-green-900/20' 
                : 'border-gray-700 hover:border-gray-500'
            }`}
            onClick={() => handleContentTypeChange('original')}
          >
            <div className="flex items-center mb-2">
              <div className={`w-4 h-4 rounded-full mr-2 ${
                formData.contentType === 'original' ? 'bg-green-500' : 'bg-gray-700'
              }`}></div>
              <h4 className="font-medium">Original Content</h4>
            </div>
            <p className="text-sm text-gray-400 mb-3">
              Creators will produce new content specifically for your campaign
            </p>
          </div>
          
          <div
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              formData.contentType === 'repurposed' 
                ? 'border-blue-500 bg-blue-900/20' 
                : 'border-gray-700 hover:border-gray-500'
            }`}
            onClick={() => handleContentTypeChange('repurposed')}
          >
            <div className="flex items-center mb-2">
              <div className={`w-4 h-4 rounded-full mr-2 ${
                formData.contentType === 'repurposed' ? 'bg-blue-500' : 'bg-gray-700'
              }`}></div>
              <h4 className="font-medium">Repurposed Content</h4>
            </div>
            <p className="text-sm text-gray-400 mb-3">
              Creators will adapt existing content to fit your campaign
            </p>
          </div>
          
          <div
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              formData.contentType === 'both' 
                ? 'border-purple-500 bg-purple-900/20' 
                : 'border-gray-700 hover:border-gray-500'
            }`}
            onClick={() => handleContentTypeChange('both')}
          >
            <div className="flex items-center mb-2">
              <div className={`w-4 h-4 rounded-full mr-2 ${
                formData.contentType === 'both' ? 'bg-purple-500' : 'bg-gray-700'
              }`}></div>
              <h4 className="font-medium">Both Types</h4>
            </div>
            <p className="text-sm text-gray-400 mb-3">
              Creators can choose to create new or adapt existing content
            </p>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Render STEP 3: Content Guidelines, Campaign Brief, Hashtags, Assets, and Dates
  const renderCreativeStep = () => (
    <div className="space-y-6">
      {/* Campaign Brief */}
      <div>
        <label htmlFor="brief" className="block text-sm font-medium text-gray-300 mb-1">
          Campaign Brief <span className="text-red-500">*</span>
        </label>
        <textarea
          id="brief"
          name="brief"
          value={formData.brief}
          onChange={handleChange}
          className="w-full p-3 bg-transparent border border-gray-700 rounded-lg focus:border-red-500 outline-none min-h-32"
          placeholder="Describe your campaign and what you're looking for from creators..."
          required
          rows={5}
        />
        <p className="text-xs text-gray-500 mt-1">
          Be specific about your entertainment brand, show, movie, or event that you want creators to showcase.
        </p>
      </div>
      
      {/* Campaign Guidelines */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-400" />
            <label className="block text-sm font-medium text-gray-300">
              Content Guidelines <span className="text-red-500">*</span>
            </label>
          </div>
          <button
            type="button"
            onClick={handleAddGuideline}
            className="text-sm flex items-center text-red-400 hover:text-red-300"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Guideline
          </button>
        </div>
        
        <div className="p-4 bg-black/40 border border-gray-800 rounded-lg mb-4">
          <p className="text-sm text-gray-400 mb-3">
            Provide clear instructions for creators to follow when making content for your campaign.
            Be specific about what to include, mention, or show.
          </p>
        </div>
        
        <div className="space-y-3">
          {formData.guidelines.map((guideline, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={guideline}
                onChange={(e) => handleGuidelineChange(index, e.target.value)}
                className="flex-1 p-3 bg-transparent border border-gray-700 rounded-lg focus:border-red-500 outline-none"
                placeholder="e.g., Show excitement for the upcoming season premiere"
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => handleRemoveGuideline(index)}
                  className="p-2 text-gray-400 hover:text-red-400"
                  aria-label="Remove guideline"
                >
                  <Trash className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Campaign Hashtags */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-3">
          <Hash className="h-5 w-5 text-purple-400" />
          <label className="block text-sm font-medium text-gray-300">
            Campaign Hashtags <span className="text-red-500">*</span>
          </label>
        </div>
        
        <div className="p-4 bg-black/40 border border-gray-800 rounded-lg mb-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-gray-400">
                <span className="text-yellow-400 font-medium">All hashtags must include #ad</span> to comply with 
                disclosure requirements. If you select both content types, you must use different hashtags for each.
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {(formData.contentType === 'original' || formData.contentType === 'both') && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Original Content Hashtag
              </label>
              <input
                type="text"
                value={formData.hashtags.original}
                onChange={(e) => handleHashtagChange('original', e.target.value)}
                className={`w-full p-3 bg-transparent border rounded-lg outline-none ${
                  formData.hashtags.original.includes('#ad') 
                    ? 'border-gray-700 focus:border-green-500' 
                    : 'border-red-500 focus:border-red-500'
                }`}
                placeholder="#YourBrand #ad"
              />
              {!formData.hashtags.original.includes('#ad') && (
                <p className="text-xs text-red-400 mt-1">
                  Hashtag must include #ad
                </p>
              )}
            </div>
          )}
          
          {(formData.contentType === 'repurposed' || formData.contentType === 'both') && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Repurposed Content Hashtag
              </label>
              <input
                type="text"
                value={formData.hashtags.repurposed}
                onChange={(e) => handleHashtagChange('repurposed', e.target.value)}
                className={`w-full p-3 bg-transparent border rounded-lg outline-none ${
                  formData.hashtags.repurposed.includes('#ad') 
                    ? 'border-gray-700 focus:border-green-500' 
                    : 'border-red-500 focus:border-red-500'
                }`}
                placeholder="#YourBrand #ad"
              />
              {!formData.hashtags.repurposed.includes('#ad') && (
                <p className="text-xs text-red-400 mt-1">
                  Hashtag must include #ad
                </p>
              )}
            </div>
          )}
          
          {formData.contentType === 'both' && 
           formData.hashtags.original === formData.hashtags.repurposed && 
           formData.hashtags.original.includes('#ad') && (
            <p className="text-xs text-red-400 mt-1">
              Original and repurposed content must use different hashtags
            </p>
          )}
        </div>
      </div>
      
      {/* Campaign Assets */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Image className="h-5 w-5 text-green-400" />
          <label className="block text-sm font-medium text-gray-300">
            Campaign Assets <span className="text-gray-500">(Optional)</span>
          </label>
        </div>
        
        <div className="p-4 bg-black/40 border border-gray-800 rounded-lg mb-4">
          <p className="text-sm text-gray-400">
            Upload images, videos, logos, or other assets for creators to use in their content.
            For entertainment brands, consider including trailers, promotional images, or event details.
          </p>
        </div>
        
        <div
          className="border-2 border-dashed border-gray-700 rounded-lg p-6 cursor-pointer hover:border-red-500 transition-colors"
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <input
            type="file"
            id="file-upload"
            multiple
            className="hidden"
            onChange={handleFileUpload}
          />
          <div className="flex flex-col items-center">
            <Upload className="h-12 w-12 text-gray-500 mb-3" />
            <p className="text-center">
              <span className="font-medium">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, MP4, PDF (max 10MB per file)
            </p>
          </div>
        </div>
        
        {formData.assets.length > 0 && (
          <div className="mt-6 space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-400" />
              Uploaded Files ({formData.assets.length})
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {formData.assets.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-black/40 border border-gray-800 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-gray-800 rounded mr-3">
                      <Layers className="h-4 w-4 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(0)} KB</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="p-1 text-gray-400 hover:text-red-400"
                    aria-label="Remove file"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Campaign Dates - Moved from platforms step */}
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Campaign Dates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-5 w-5 text-orange-400" />
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-300">
                Start Date <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                min={today}
                className="w-full p-3 pl-10 bg-transparent border border-gray-700 rounded-lg focus:border-red-500 outline-none"
                required
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-5 w-5 text-red-400" />
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-300">
                End Date <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                min={formData.startDate || today}
                className="w-full p-3 pl-10 bg-transparent border border-gray-700 rounded-lg focus:border-red-500 outline-none"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Campaigns run for a minimum of 30 days. If your campaign budget is not fully used,
              you will receive a refund or credit for the remainder.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Render STEP 4: Budget & Rates step
  const renderBudgetStep = () => (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="h-5 w-5 text-green-400" />
          <label htmlFor="budget" className="block text-sm font-medium text-gray-300">
            Total Campaign Budget <span className="text-red-500">*</span>
          </label>
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <DollarSign className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="budget"
            name="budget"
            type="number"
            value={formData.budget}
            onChange={handleChange}
            min="1000"
            className="w-full p-3 pl-10 bg-transparent border border-gray-700 rounded-lg focus:border-red-500 outline-none"
            placeholder="5000"
            required
          />
        </div>
        
        <div className="flex items-center p-3 mt-2 bg-black/40 border border-gray-800 rounded-lg">
          <Info className="h-5 w-5 text-gray-400 mr-3" />
          <p className="text-sm text-gray-400">
            You pay for the views your campaign receives. Minimum budget: $1,000
          </p>
        </div>
      </div>
      
      <div className="p-5 rounded-lg bg-black/40 border border-gray-800">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-400" />
            <span>View Rates</span>
          </h3>
          <div className="flex items-center p-2 rounded-lg bg-blue-900/20 border border-blue-800 text-xs text-blue-400">
            <Info className="h-4 w-4 mr-1" />
            <span>Pay per 1M views</span>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Original Content Rate */}
          {(formData.contentType === 'original' || formData.contentType === 'both') && (
            <div>
              <div className="flex justify-between mb-2">
                <label htmlFor="payoutRate.original" className="block text-sm font-medium text-gray-300">
                  Original Content Rate <span className="text-red-500">*</span>
                </label>
                <span className="text-xs text-gray-400">Recommended: $500-$1,000</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="payoutRate.original"
                  name="payoutRate.original"
                  type="number"
                  value={formData.payoutRate.original}
                  onChange={handleChange}
                  min="100"
                  className="w-full p-3 pl-10 bg-transparent border border-gray-700 rounded-lg focus:border-red-500 outline-none transition-colors"
                  placeholder="500"
                  required={formData.contentType === 'original' || formData.contentType === 'both'}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Rate for brand-new content created specifically for your campaign
              </p>
            </div>
          )}
          
          {/* Repurposed Content Rate */}
          {(formData.contentType === 'repurposed' || formData.contentType === 'both') && (
            <div>
              <div className="flex justify-between mb-2">
                <label htmlFor="payoutRate.repurposed" className="block text-sm font-medium text-gray-300">
                  Repurposed Content Rate <span className="text-red-500">*</span>
                </label>
                <span className="text-xs text-gray-400">Recommended: $250-$500</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="payoutRate.repurposed"
                  name="payoutRate.repurposed"
                  type="number"
                  value={formData.payoutRate.repurposed}
                  onChange={handleChange}
                  min="50"
                  className="w-full p-3 pl-10 bg-transparent border border-gray-700 rounded-lg focus:border-red-500 outline-none transition-colors"
                  placeholder="250"
                  required={formData.contentType === 'repurposed' || formData.contentType === 'both'}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Rate for existing content adapted to include your campaign messaging
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Budget Allocation (only if "both" content types selected) */}
      {formData.contentType === 'both' && (
        <div className="mt-4 p-5 bg-purple-900/10 border border-purple-800 rounded-lg">
          <h3 className="font-medium mb-3">Budget Allocation</h3>
          <div className="mb-2 flex justify-between text-sm text-gray-400">
            <span>Original: {formData.budgetAllocation.original}%</span>
            <span>Repurposed: {formData.budgetAllocation.repurposed}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={formData.budgetAllocation.original}
            onChange={(e) => handleBudgetAllocationChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      )}
      
      {/* View Calculator */}
      {formData.budget && (
        ((formData.contentType === 'original' && formData.payoutRate.original) ||
         (formData.contentType === 'repurposed' && formData.payoutRate.repurposed) ||
         (formData.contentType === 'both' && formData.payoutRate.original && formData.payoutRate.repurposed))
      ) && (
        <div className="p-5 rounded-lg bg-green-900/10 border border-green-800">
          <h3 className="font-medium text-lg text-green-400 mb-4 flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Estimated Campaign Reach
          </h3>
          
          {(() => {
            return (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-6">
                  {formData.contentType === 'both' || formData.contentType === 'original' ? (
                    <div className="p-4 bg-black/40 border border-gray-800 rounded-lg">
                      <p className="text-sm text-gray-400 mb-1">Original Content</p>
                      <p className="text-2xl font-bold text-white">{formatMillions(viewEstimates.originalViews)} views</p>
                      <div className="flex items-center text-xs text-gray-400 mt-1">
                        <DollarSign className="h-3 w-3 mr-1" />
                        {formData.budget && formData.contentType === 'both' 
                          ? formatMoney(parseInt(formData.budget) * formData.budgetAllocation.original / 100) 
                          : formatMoney(parseInt(formData.budget) || 0)}
                      </div>
                    </div>
                  ) : null}
                  
                  {formData.contentType === 'both' || formData.contentType === 'repurposed' ? (
                    <div className="p-4 bg-black/40 border border-gray-800 rounded-lg">
                      <p className="text-sm text-gray-400 mb-1">Repurposed Content</p>
                      <p className="text-2xl font-bold text-white">{formatMillions(viewEstimates.repurposedViews)} views</p>
                      <div className="flex items-center text-xs text-gray-400 mt-1">
                        <DollarSign className="h-3 w-3 mr-1" />
                        {formData.budget && formData.contentType === 'both' 
                          ? formatMoney(parseInt(formData.budget) * formData.budgetAllocation.repurposed / 100) 
                          : formatMoney(parseInt(formData.budget) || 0)}
                      </div>
                    </div>
                  ) : null}
                </div>
                
                <div className="p-4 bg-green-900/20 border border-green-800 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Total Estimated Views</p>
                  <div className="flex justify-between items-end">
                    <p className="text-3xl font-bold text-green-400">{formatMillions(viewEstimates.totalViews)} views</p>
                    <p className="text-lg font-medium text-white">
                      {formData.budget ? formatMoney(parseInt(formData.budget)) : '$0'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
  
  // Render STEP 5: Payment Summary
  const renderPaymentStep = () => (
    <div className="space-y-6">
      <div className="p-5 rounded-lg bg-black/40 border border-gray-800">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-black/60 rounded-lg border border-green-700">
            <DollarSign className="h-6 w-6 text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-white mb-2">Payment on Approval</h3>
            <p className="text-gray-400 mb-4">
              When your campaign is approved, your payment method will be charged immediately for the
              full campaign budget: <span className="font-bold text-white">{formData.budget ? formatMoney(parseInt(formData.budget)) : '$0'}</span>
            </p>
            
            <div className="p-3 bg-yellow-900/10 border border-yellow-800 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-300">
                  Your campaign must have valid payment information before it can be reviewed and published.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Select Payment Method</h3>
        
        <div className="space-y-3">
          {paymentMethods.map(method => (
            <label
              key={method.id}
              className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${
                formData.paymentMethod === method.id
                  ? 'border-green-500 bg-green-900/10'
                  : 'border-gray-700 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={formData.paymentMethod === method.id}
                  onChange={handleChange}
                  className="hidden"
                />
                <CreditCard className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium">
                    {method.type.charAt(0).toUpperCase() + method.type.slice(1)} •••• {method.last4}
                  </p>
                  <p className="text-sm text-gray-400">Expires {method.expiry}</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                formData.paymentMethod === method.id
                  ? 'border-green-500'
                  : 'border-gray-600'
              }`}>
                {formData.paymentMethod === method.id && (
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                )}
              </div>
            </label>
          ))}
          
          <button
            type="button"
            className="flex items-center gap-2 mt-2 text-sm text-red-400 hover:text-red-300"
          >
            <Plus className="h-4 w-4" /> Add New Payment Method
          </button>
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-700">
        <h3 className="text-lg font-medium mb-4">Campaign Budget Summary</h3>
        
        <div className="p-4 bg-black/40 border border-gray-800 rounded-lg mb-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <p className="text-gray-300">Campaign Budget:</p>
              <p className="font-bold">{formData.budget ? formatMoney(parseInt(formData.budget)) : '$0'}</p>
            </div>
            
            <div className="flex justify-between">
              <p className="text-gray-300">Estimated Views:</p>
              <p className="font-bold text-green-400">{formatMillions(viewEstimates.totalViews)}</p>
            </div>
            
            <div className="pt-3 border-t border-gray-700">
              <div className="flex justify-between">
                <p className="text-gray-300">Content Types:</p>
                <p className="font-medium">
                  {formData.contentType === 'original' ? 'Original Only' : 
                   formData.contentType === 'repurposed' ? 'Repurposed Only' : 
                   'Original & Repurposed'}
                </p>
              </div>
              
              {formData.contentType === 'both' && (
                <div className="mt-2">
                  <div className="flex justify-between text-sm">
                    <p className="text-gray-400">Original ({formData.budgetAllocation.original}%):</p>
                    <p>{formatMoney(parseInt(formData.budget || '0') * formData.budgetAllocation.original / 100)}</p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p className="text-gray-400">Repurposed ({formData.budgetAllocation.repurposed}%):</p>
                    <p>{formatMoney(parseInt(formData.budget || '0') * formData.budgetAllocation.repurposed / 100)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Render STEP 6: Campaign Review
  const renderReviewStep = () => (
    <div className="space-y-6">
      {/* Creator View Preview */}
      <div className="p-6 rounded-lg bg-black/40 border border-gray-800">
        <h3 className="text-xl font-bold mb-6">Creator View Preview</h3>
        
        <div className="p-5 border border-gray-700 rounded-lg bg-black/60 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-xl font-bold text-white">{formData.title}</h4>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="px-3 py-1 rounded-full bg-red-900/20 text-red-400 text-sm">
                  NEW
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 text-sm text-gray-300">
                  {formData.goal === 'awareness' ? 'Brand Awareness' :
                   formData.goal === 'consideration' ? 'Content Promotion' :
                   formData.goal === 'conversion' ? 'Drive Viewership' :
                   formData.goal === 'engagement' ? 'Community Engagement' :
                   formData.goal === 'launch' ? 'New Release' :
                   formData.goal === 'event' ? 'Event Promotion' : 'Campaign'}
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-400 flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(formData.endDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
          </div>
          
          <div className="space-y-5">
            <div>
              <p className="text-sm text-gray-400 mb-1">Platforms</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(formData.platforms)
                  .filter(([_, active]) => active)
                  .map(([platform]) => (
                    <span
                      key={platform}
                      className="px-3 py-1 bg-black/40 border border-gray-700 rounded-lg text-sm text-gray-300"
                    >
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </span>
                  ))}
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-400 mb-1">Campaign Brief</p>
              <p className="bg-black/40 p-4 rounded-lg border border-gray-800">
                {formData.brief}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Payout Rate</p>
                <div>
                  {(formData.contentType === 'original' || formData.contentType === 'both') && (
                    <p className="font-bold text-white">${formData.payoutRate.original} per 1M views <span className="font-normal text-sm text-green-400">(Original)</span></p>
                  )}
                  {(formData.contentType === 'repurposed' || formData.contentType === 'both') && (
                    <p className="font-bold text-white">${formData.payoutRate.repurposed} per 1M views <span className="font-normal text-sm text-blue-400">(Repurposed)</span></p>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Required Hashtag</p>
                <div>
                  {(formData.contentType === 'original' || formData.contentType === 'both') && (
                    <p className="font-bold text-blue-400">{formData.hashtags.original}</p>
                  )}
                  {formData.contentType === 'both' && (
                    <p className="font-bold text-blue-400 mt-1">{formData.hashtags.repurposed} <span className="font-normal text-sm text-gray-400">(for repurposed)</span></p>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-400 mb-1">Content Guidelines</p>
              <ul className="list-disc pl-5 space-y-1 text-gray-300">
                {formData.guidelines
                  .filter(guideline => guideline.trim().length > 0)
                  .map((guideline, index) => (
                    <li key={index}>{guideline}</li>
                  ))}
              </ul>
            </div>
            
            {formData.assets.length > 0 && (
              <div>
                <p className="text-sm text-gray-400 mb-1">Campaign Assets</p>
                <div className="bg-black/40 p-3 rounded-lg border border-gray-800 flex items-center">
                  <FileText className="h-5 w-5 text-gray-400 mr-2" />
                  <span>{formData.assets.length} file{formData.assets.length !== 1 ? 's' : ''} available</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-4 bg-blue-900/10 border border-blue-800 rounded-lg">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-300">
              This is how your campaign will appear to creators on their dashboard. 
              They will be able to join the campaign and submit content that follows your guidelines.
            </p>
          </div>
        </div>
      </div>
      
      {/* Terms and Conditions */}
      <div className="mt-6 pt-6 border-t border-gray-800">
        <div className="flex items-start gap-2 mb-6">
          <div className="mt-0.5">
            <input
              type="checkbox"
              id="termsAccepted"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
              className="rounded text-red-500 focus:ring-red-500"
            />
          </div>
          <label htmlFor="termsAccepted" className="text-sm leading-relaxed text-gray-300">
            I understand that by submitting this campaign for review, I authorize CREATE_OS to charge my selected 
            payment method for the campaign budget amount upon approval. I understand that my budget will be used 
            to deliver the views calculated above. If my campaign doesn't use the full budget within the campaign 
            period, I will receive a refund or credit for the unused portion.
          </label>
        </div>
      </div>
    </div>
  );
  
  // Render the current step content
  const renderStepContent = () => {
    switch (step) {
      case 0:
        return renderDetailsStep();
      case 1:
        return renderPlatformsStep();
      case 2:
        return renderCreativeStep();
      case 3:
        return renderBudgetStep();
      case 4:
        return renderPaymentStep();
      case 5:
        return renderReviewStep();
      default:
        return null;
    }
  };
  
  // Render final campaign preview for submit/save
  const renderCampaignPreview = () => {
    return (
      <div className="space-y-8">
        <h2 className="text-2xl font-bold">Campaign Review</h2>
        
        <div className="p-6 bg-black/40 border border-gray-800 rounded-lg">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-bold">{formData.title}</h3>
            <span className="px-3 py-1 bg-gray-900/50 text-gray-300 rounded-full text-sm">
              Draft
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h4 className="text-sm text-gray-400 mb-1">Campaign Brief</h4>
                <p className="bg-black/40 p-4 rounded-lg border border-gray-800">
                  {formData.brief}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm text-gray-400 mb-1">Campaign Goal</h4>
                <p className="font-medium">
                  {formData.goal === 'awareness' ? 'Brand Awareness' :
                   formData.goal === 'consideration' ? 'Content Promotion' :
                   formData.goal === 'conversion' ? 'Drive Viewership/Streaming' :
                   formData.goal === 'engagement' ? 'Community Engagement' :
                   formData.goal === 'launch' ? 'New Release Promotion' :
                   formData.goal === 'event' ? 'Event Promotion' : 'Other'}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm text-gray-400 mb-1">Platforms</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(formData.platforms)
                    .filter(([_, isEnabled]) => isEnabled)
                    .map(([platform]) => (
                      <span
                        key={platform}
                        className="px-3 py-1 bg-black/40 border border-gray-700 rounded-lg text-sm"
                      >
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </span>
                    ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm text-gray-400 mb-1">Content Type</h4>
                <p className="font-medium">
                  {formData.contentType === 'original' ? 'Original Content' :
                   formData.contentType === 'repurposed' ? 'Repurposed Content' : 'Both Types'}
                </p>
                
                {formData.contentType === 'both' && (
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-400">Original Allocation:</p>
                      <p>{formData.budgetAllocation.original}%</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Repurposed Allocation:</p>
                      <p>{formData.budgetAllocation.repurposed}%</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="text-sm text-gray-400 mb-1">Campaign Dates</h4>
                <p className="font-medium">
                  {new Date(formData.startDate).toLocaleDateString()} to {new Date(formData.endDate).toLocaleDateString()}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm text-gray-400 mb-1">Required Hashtags</h4>
                <div>
                  {formData.contentType === 'original' || formData.contentType === 'both' ? (
                    <div className="mb-2">
                      <p className="text-xs text-gray-400">Original Content:</p>
                      <p className="text-blue-400">{formData.hashtags.original}</p>
                    </div>
                  ) : null}
                  
                  {formData.contentType === 'repurposed' || formData.contentType === 'both' ? (
                    <div>
                      <p className="text-xs text-gray-400">Repurposed Content:</p>
                      <p className="text-blue-400">{formData.hashtags.repurposed}</p>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-sm text-gray-400 mb-1">Budget</h4>
                <p className="text-2xl font-bold">{formData.budget ? formatMoney(parseInt(formData.budget)) : '$0'}</p>
                
                <div className="mt-2 p-3 bg-black/30 border border-gray-700 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Eye className="h-4 w-4 text-green-400" />
                    <p className="font-medium text-green-400">Estimated Campaign Reach</p>
                  </div>
                  <p className="text-xl font-bold">{formatMillions(viewEstimates.totalViews)} views</p>
                  {formData.contentType === 'both' && (
                    <div className="text-sm text-gray-400 mt-1 grid grid-cols-2 gap-2">
                      <div>Original: {formatMillions(viewEstimates.originalViews)}</div>
                      <div>Repurposed: {formatMillions(viewEstimates.repurposedViews)}</div>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm text-gray-400 mb-1">View Rates</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Original Content:</span>
                    <span className="font-medium">${formData.payoutRate.original} per 1M views</span>
                  </div>
                  {(formData.contentType === 'repurposed' || formData.contentType === 'both') && (
                    <div className="flex justify-between">
                      <span>Repurposed Content:</span>
                      <span className="font-medium">${formData.payoutRate.repurposed} per 1M views</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm text-gray-400 mb-1">Content Guidelines</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {formData.guidelines
                    .filter(guideline => guideline.trim().length > 0)
                    .map((guideline, index) => (
                      <li key={index}>{guideline}</li>
                    ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm text-gray-400 mb-1">Payment Method</h4>
                {formData.paymentMethod ? (
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-gray-300" />
                    <p className="font-medium">
                      {paymentMethods.find(m => m.id === formData.paymentMethod)?.type || 'Card'} •••• 
                      {paymentMethods.find(m => m.id === formData.paymentMethod)?.last4}
                    </p>
                  </div>
                ) : (
                  <p className="text-yellow-400">No payment method selected</p>
                )}
              </div>
              
              {formData.assets.length > 0 && (
                <div>
                  <h4 className="text-sm text-gray-400 mb-1">Campaign Assets</h4>
                  <p className="font-medium">{formData.assets.length} file{formData.assets.length !== 1 ? 's' : ''} included</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Payment authorization notice */}
        <div className="p-4 bg-yellow-900/10 border border-yellow-800 rounded-lg mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-400 mb-1">Payment Authorization</h4>
              <p className="text-sm text-gray-300">
                By submitting this campaign for review, your selected payment method will be charged 
                {formData.budget ? ' ' + formatMoney(parseInt(formData.budget)) : ''} upon approval. 
                This budget will deliver approximately {formatMillions(viewEstimates.totalViews)} views for your campaign.
                Any unused budget at the end of the campaign period will be refunded or credited to your account.
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between gap-4 pt-6">
          <button
            type="button"
            onClick={() => setShowPreview(false)}
            className="px-6 py-3 border border-gray-700 rounded-lg hover:bg-white/5"
          >
            Back to Edit
          </button>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSaveCampaign}
              className="px-6 py-3 border border-red-500 text-red-500 rounded-lg hover:bg-red-900/20"
              disabled={isProcessingPayment}
            >
              Save as Draft
            </button>
            
            <button
              type="button"
              onClick={handleSubmitCampaign}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 transition-colors rounded-lg text-white flex items-center gap-2"
              disabled={isProcessingPayment}
            >
              {isProcessingPayment ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing Payment...
                </>
              ) : (
                <>Submit for Review</>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black bg-opacity-80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold">Create Campaign</h1>
            
            <button
              type="button"
              onClick={() => router.push('/brand/dashboard')}
              className="p-2 text-gray-400 hover:text-white"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Success message */}
        <AnimatePresence>
          {showSaveSuccess && (
            <motion.div
              className="fixed top-4 right-4 flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg shadow-lg z-50"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Check className="h-5 w-5" />
              <span>Campaign saved successfully</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        {showPreview ? (
          renderCampaignPreview()
        ) : (
          <>
            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex gap-1">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 flex-1 rounded-full ${
                      index < step ? 'bg-red-500' : index === step ? 'bg-red-500/70' : 'bg-gray-700'
                    }`}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-400">
                <span>Step {step + 1} of {steps.length}</span>
                <span>{steps[step].title}</span>
              </div>
            </div>
            
            {/* Step content */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">{steps[step].title}</h2>
              <p className="text-gray-400 mb-6">{steps[step].subtitle}</p>
              
              {renderStepContent()}
            </div>
            
            {/* Navigation buttons */}
            <div className="flex justify-between pt-4 border-t border-gray-800">
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 flex items-center gap-2 border border-gray-700 rounded-lg hover:bg-white/5"
              >
                <ArrowLeft className="h-4 w-4" />
                {step === 0 ? 'Cancel' : 'Back'}
              </button>
              
              <button
                type="button"
                onClick={handleNext}
                disabled={!isCurrentStepComplete()}
                className={`px-4 py-2 flex items-center gap-2 rounded-lg ${
                  isCurrentStepComplete()
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                }`}
              >
                {step === steps.length - 1 ? 'Review Campaign' : 'Continue'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default CampaignCreationPage;