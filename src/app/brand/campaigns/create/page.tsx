'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Plus,
  Trash,
  Check,
  Upload,
  DollarSign,
  Target,
  Layers,
  Users,
  Clock,
  Hash,
  HelpCircle,
  ExternalLink,
  X,
  AlertCircle,
  CreditCard,
  Info,
  Eye,
  FileText,
  Image,
  MessageSquare,
  Globe,
  CalendarIcon,
} from 'lucide-react';

// Interface for campaign form data
interface CampaignFormData {
  title: string;
  brief: {
    original: string;
    repurposed: string;
  };
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
  guidelines: {
    original: string[];
    repurposed: string[];
  };
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

// Interface for field errors
interface FieldErrors {
  [key: string]: string;
}

// Interface for view estimates
interface ViewEstimates {
  originalViews: number;
  repurposedViews: number;
  totalViews: number;
}

// Calculate estimated views based on budget and rates
const calculateEstimatedViews = (
  budget: string,
  originalRate: string,
  repurposedRate: string,
  contentType: 'original' | 'repurposed' | 'both',
  budgetAllocation: { original: number; repurposed: number }
): ViewEstimates => {
  const budgetValue = parseFloat(budget) || 1000; // Default to 1000 if empty

  if (contentType === 'original') {
    const originalRateValue = parseFloat(originalRate) || 500; // Default to 500 if empty
    const views = (budgetValue / originalRateValue) * 1000000;
    return { originalViews: views, repurposedViews: 0, totalViews: views };
  } else if (contentType === 'repurposed') {
    const repurposedRateValue = parseFloat(repurposedRate) || 250; // Default to 250 if empty
    const views = (budgetValue / repurposedRateValue) * 1000000;
    return { originalViews: 0, repurposedViews: views, totalViews: views };
  } else {
    const originalRateValue = parseFloat(originalRate) || 500;
    const repurposedRateValue = parseFloat(repurposedRate) || 250;

    const originalBudget = budgetValue * (budgetAllocation.original / 100);
    const repurposedBudget = budgetValue * (budgetAllocation.repurposed / 100);

    const originalViews = (originalBudget / originalRateValue) * 1000000;
    const repurposedViews = (repurposedBudget / repurposedRateValue) * 1000000;

    return {
      originalViews,
      repurposedViews,
      totalViews: originalViews + repurposedViews,
    };
  }
};

const CampaignCreationPage = () => {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState<'start' | 'end' | null>(
    null
  );
  const [validationErrors, setValidationErrors] = useState<FieldErrors>({});

  // Sample payment methods (in a real app, this would come from an API)
  const paymentMethods = useMemo(
    () => [
      {
        id: 'pm_1',
        type: 'visa',
        last4: '4242',
        expiry: '12/25',
        isDefault: true,
      },
      {
        id: 'pm_2',
        type: 'mastercard',
        last4: '5555',
        expiry: '10/26',
        isDefault: false,
      },
    ],
    []
  );

  // Get today's date formatted as YYYY-MM-DD for date inputs
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Get date 30 days from now
  const defaultEndDate = useMemo(() => {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return thirtyDaysFromNow.toISOString().split('T')[0];
  }, []);

  // Initialize form data with improved structure
  const [formData, setFormData] = useState<CampaignFormData>({
    title: '',
    brief: {
      original: '',
      repurposed: '',
    },
    goal: '',
    platforms: {
      tiktok: false,
      instagram: false,
      youtube: false,
      twitter: false,
    },
    contentType: 'original',
    budgetAllocation: {
      original: 70,
      repurposed: 30,
    },
    startDate: today,
    endDate: defaultEndDate,
    budget: '1000', // Start with minimum budget
    payoutRate: {
      original: '500', // Default to $500 per 1M views for original
      repurposed: '250', // Default to $250 per 1M views for repurposed
    },
    hashtags: {
      original: '#YourBrand #ad',
      repurposed: '#YourBrand #ad',
    },
    guidelines: {
      original: [''],
      repurposed: [''],
    },
    assets: [],
    paymentMethod: paymentMethods.find((method) => method.isDefault)?.id || '',
    termsAccepted: false,
  });

  // Define steps - REORDERED per request
  const steps: Step[] = useMemo(
    () => [
      {
        title: 'Campaign Details',
        subtitle: "Let's set up your basic campaign information",
        isComplete: (data) => {
          let isValid =
            data.title.trim().length > 0 &&
            data.goal.trim().length > 0 &&
            (data.platforms.tiktok ||
              data.platforms.instagram ||
              data.platforms.youtube ||
              data.platforms.twitter) &&
            Boolean(data.contentType);
          return isValid;
        },
      },
      {
        title: 'Content Guidelines',
        subtitle: 'Create your campaign brief, hashtags, and assets',
        isComplete: (data) => {
          let isValid = true;

          // Validate dates
          if (!data.startDate) {
            isValid = false;
          }
          if (!data.endDate) {
            isValid = false;
          }

          // Validate original content if applicable
          if (data.contentType === 'original' || data.contentType === 'both') {
            // Check brief
            if (!data.brief.original.trim()) {
              isValid = false;
            }

            // Check guidelines
            const validGuidelinesOriginal =
              data.guidelines.original.filter((g) => g.trim().length > 0)
                .length > 0;
            if (!validGuidelinesOriginal) {
              isValid = false;
            }

            // Check hashtag format and ensure it contains "#ad" and only one #
            const originalHashtag = data.hashtags.original.trim();
            if (
              !originalHashtag.startsWith('#') ||
              originalHashtag.includes(' ') ||
              !originalHashtag.toLowerCase().includes('ad') ||
              originalHashtag.slice(1).includes('#')
            ) {
              isValid = false;
            }
          }

          // Validate repurposed content if applicable
          if (data.contentType === 'repurposed' || data.contentType === 'both') {
            // Check brief
            if (!data.brief.repurposed.trim()) {
              isValid = false;
            }

            // Check guidelines
            const validGuidelinesRepurposed =
              data.guidelines.repurposed.filter((g) => g.trim().length > 0)
                .length > 0;
            if (!validGuidelinesRepurposed) {
              isValid = false;
            }

            // Check hashtag format and ensure it contains "#ad" and only one #
            const repurposedHashtag = data.hashtags.repurposed.trim();
            if (
              !repurposedHashtag.startsWith('#') ||
              repurposedHashtag.includes(' ') ||
              !repurposedHashtag.toLowerCase().includes('ad') ||
              repurposedHashtag.slice(1).includes('#')
            ) {
              isValid = false;
            }
          }

          return isValid;
        },
      },
      {
        title: 'Creator View',
        subtitle: 'Preview how your campaign appears to creators',
        isComplete: (data) => true, // This step is always completable
      },
      {
        title: 'Budget & Rates',
        subtitle: 'Set your campaign budget for views',
        isComplete: (data) => {
          let isValid = true;

          const budgetValue = parseFloat(data.budget);
          const originalRateValue = parseFloat(data.payoutRate.original);
          const repurposedRateValue = parseFloat(data.payoutRate.repurposed);

          // Check if budget is at least $1000
          if (isNaN(budgetValue) || budgetValue < 1000) {
            isValid = false;
          }

          // Check original rate if applicable
          if (data.contentType === 'original' || data.contentType === 'both') {
            if (isNaN(originalRateValue) || originalRateValue < 500) {
              isValid = false;
            }
          }

          // Check repurposed rate if applicable
          if (data.contentType === 'repurposed' || data.contentType === 'both') {
            if (isNaN(repurposedRateValue) || repurposedRateValue < 250) {
              isValid = false;
            }
          }

          return isValid;
        },
      },
      {
        title: 'Payment Summary',
        subtitle: 'Review your payment details',
        isComplete: (data) => {
          let isValid = true;

          if (!data.paymentMethod) {
            isValid = false;
          }

          return isValid;
        },
      },
      {
        title: 'Final Review',
        subtitle: 'Review your campaign before submission',
        isComplete: (data) => {
          return data.termsAccepted;
        },
      },
    ],
    []
  );

  // Check authentication on mount
  useEffect(() => {
    const isBrandLoggedIn = localStorage.getItem('isBrandLoggedIn') === 'true';
    if (!isBrandLoggedIn) {
      router.push('/brand/login');
    }

    // Close date picker when clicking outside
    const handleClickOutside = (e: MouseEvent) => {
      if (
        showDatePicker &&
        !(e.target as Element).closest('.date-picker-container')
      ) {
        setShowDatePicker(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [router, showDatePicker]);

  // Handle form input changes
  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value, type } = e.target;

      // Clear validation error when field is changed
      if (validationErrors[name]) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }

      // For checkbox inputs, we need to handle the checked property
      if (type === 'checkbox') {
        // Use type assertion to tell TypeScript that this is an HTMLInputElement
        const checkboxInput = e.target as HTMLInputElement;
        setFormData((prevData) => ({
          ...prevData,
          [name]: checkboxInput.checked,
        }));
        return;
      }

      // Special handling for hashtags to enforce single hashtag and #ad inclusion
      if (name === 'hashtags.original' || name === 'hashtags.repurposed') {
        const hashtagType = name.split('.')[1] as 'original' | 'repurposed';

        // Remove all spaces and trim
        let newValue = value.replace(/\s+/g, '').trim();

        // Ensure it starts with '#'
        if (newValue && !newValue.startsWith('#')) {
          newValue = '#' + newValue;
        }

        setFormData((prevData) => ({
          ...prevData,
          hashtags: {
            ...prevData.hashtags,
            [hashtagType]: newValue,
          },
        }));
        return;
      }

      if (name.includes('.')) {
        // Handle nested fields (e.g., brief.original)
        const [parent, child, subChild] = name.split('.');

        if (subChild) {
          // Handle deeply nested fields (e.g., guidelines.original.0)
          const parentKey = parent as keyof typeof formData;

          setFormData((prevData) => {
            const parentObj = prevData[parentKey] as any;
            const index = parseInt(subChild);

            if (!isNaN(index) && Array.isArray(parentObj[child])) {
              // This is an array item update (like guidelines.original.0)
              const newArray = [...parentObj[child]];
              newArray[index] = value;

              return {
                ...prevData,
                [parent]: {
                  ...parentObj,
                  [child]: newArray,
                },
              };
            }
            return prevData;
          });
        } else {
          // Handle regular nested fields (like brief.original)
          const parentKey = parent as keyof typeof formData;

          setFormData((prevData) => {
            const parentObj = prevData[parentKey] as any;
            return {
              ...prevData,
              [parent]: {
                ...parentObj,
                [child]: value,
              },
            };
          });
        }
      } else {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    },
    [validationErrors]
  );

  // Handle checkbox changes for platforms
  const handlePlatformChange = useCallback(
    (platform: keyof typeof formData.platforms) => {
      // Clear platform validation error
      if (validationErrors['platforms']) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors['platforms'];
          return newErrors;
        });
      }

      setFormData((prevData) => ({
        ...prevData,
        platforms: {
          ...prevData.platforms,
          [platform]: !prevData.platforms[platform],
        },
      }));
    },
    [validationErrors]
  );

  // Handle budget allocation slider
  const handleBudgetAllocationChange = useCallback((value: number) => {
    setFormData((prevData) => ({
      ...prevData,
      budgetAllocation: {
        original: value,
        repurposed: 100 - value,
      },
    }));
  }, []);

  // Handle date selection from calendar
  const handleDateSelect = useCallback(
    (type: 'start' | 'end', date: string) => {
      // Clear any date-related validation errors
      if (validationErrors[`${type}Date`]) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[`${type}Date`];
          return newErrors;
        });
      }

      setFormData((prevData) => ({
        ...prevData,
        [type === 'start' ? 'startDate' : 'endDate']: date,
      }));

      setShowDatePicker(null);
    },
    [validationErrors]
  );

  // Handle adding/removing guidelines for a specific content type
  const handleAddGuideline = useCallback(
    (type: 'original' | 'repurposed') => {
      // Clear guidelines validation error
      if (validationErrors[`guidelines.${type}`]) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[`guidelines.${type}`];
          return newErrors;
        });
      }

      setFormData((prevData) => ({
        ...prevData,
        guidelines: {
          ...prevData.guidelines,
          [type]: [...prevData.guidelines[type], ''],
        },
      }));
    },
    [validationErrors]
  );

  const handleGuidelineChange = useCallback(
    (type: 'original' | 'repurposed', index: number, value: string) => {
      // Clear guidelines validation error
      if (validationErrors[`guidelines.${type}`]) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[`guidelines.${type}`];
          return newErrors;
        });
      }

      setFormData((prevData) => {
        const newGuidelines = [...prevData.guidelines[type]];
        newGuidelines[index] = value;

        return {
          ...prevData,
          guidelines: {
            ...prevData.guidelines,
            [type]: newGuidelines,
          },
        };
      });
    },
    [validationErrors]
  );

  const handleRemoveGuideline = useCallback(
    (type: 'original' | 'repurposed', index: number) => {
      setFormData((prevData) => {
        const newGuidelines = [...prevData.guidelines[type]];
        newGuidelines.splice(index, 1);

        return {
          ...prevData,
          guidelines: {
            ...prevData.guidelines,
            [type]: newGuidelines,
          },
        };
      });
    },
    []
  );

  // Handle file uploads
  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const newFiles = Array.from(e.target.files);
        setFormData((prevData) => ({
          ...prevData,
          assets: [...prevData.assets, ...newFiles],
        }));
      }
    },
    []
  );

  const handleRemoveFile = useCallback((index: number) => {
    setFormData((prevData) => {
      const newFiles = [...prevData.assets];
      newFiles.splice(index, 1);

      return {
        ...prevData,
        assets: newFiles,
      };
    });
  }, []);

  // Update content type and ensure proper hashtags
  const handleContentTypeChange = useCallback(
    (type: 'original' | 'repurposed' | 'both') => {
      setFormData((prevData) => ({
        ...prevData,
        contentType: type,
      }));
    },
    []
  );

  // Navigate between steps
  const handleNext = useCallback(() => {
    // Validate current step
    const currentStep = steps[step];

    // Only proceed if current step is valid
    if (currentStep.isComplete(formData)) {
      if (step < steps.length - 1) {
        setStep((prevStep) => prevStep + 1);
        window.scrollTo(0, 0);
      } else {
        setShowPreview(true);
      }
      // Clear validation errors when moving to next step
      setValidationErrors({});
    } else {
      // Create validation errors based on the current step
      const newErrors: FieldErrors = {};

      // Step 0: Campaign Details validation
      if (step === 0) {
        if (!formData.title.trim())
          newErrors['title'] = 'Please enter a campaign title';
        if (!formData.goal) newErrors['goal'] = 'Please select a campaign goal';
        if (
          !(
            formData.platforms.tiktok ||
            formData.platforms.instagram ||
            formData.platforms.youtube ||
            formData.platforms.twitter
          )
        ) {
          newErrors['platforms'] = 'Please select at least one platform';
        }
      }

      // Step 1: Content Guidelines validation
      else if (step === 1) {
        // Validate dates
        if (!formData.startDate) {
          newErrors['startDate'] = 'Please select a start date';
        }
        if (!formData.endDate) {
          newErrors['endDate'] = 'Please select an end date';
        }

        // Validate original content if applicable
        if (formData.contentType === 'original' || formData.contentType === 'both') {
          // Check brief
          if (!formData.brief.original.trim()) {
            newErrors['brief.original'] =
              'Please provide a brief for original content';
          }

          // Check guidelines
          const validGuidelinesOriginal =
            formData.guidelines.original.filter((g) => g.trim().length > 0)
              .length > 0;
          if (!validGuidelinesOriginal) {
            newErrors['guidelines.original'] = 'Please add at least one guideline';
          }

          // Check hashtag format, ensure it starts with #, contains ad, and has only one #
            const originalHashtag = formData.hashtags.original.trim();
            if (!originalHashtag.startsWith('#')) {
              newErrors['hashtags.original'] = 'Hashtag must start with #';
            } else if (originalHashtag.includes(' ')) {
              newErrors['hashtags.original'] = 'Hashtag cannot contain spaces';
            } else if (!originalHashtag.toLowerCase().includes('ad')) {
              newErrors['hashtags.original'] = 'Hashtag must include "ad"';
            } else if (originalHashtag.slice(1).includes('#')) {
              newErrors['hashtags.original'] = 'Hashtag can only have one # at the start';
            }
        }

        // Validate repurposed content if applicable
        if (formData.contentType === 'repurposed' || formData.contentType === 'both') {
          // Check brief
          if (!formData.brief.repurposed.trim()) {
            newErrors['brief.repurposed'] =
              'Please provide a brief for repurposed content';
          }

          // Check guidelines
          const validGuidelinesRepurposed =
            formData.guidelines.repurposed.filter((g) => g.trim().length > 0)
              .length > 0;
          if (!validGuidelinesRepurposed) {
            newErrors['guidelines.repurposed'] =
              'Please add at least one guideline';
          }

          // Check hashtag format, ensure it starts with #, contains ad, and has only one #
          const repurposedHashtag = formData.hashtags.repurposed.trim();
          if (!repurposedHashtag.startsWith('#')) {
            newErrors['hashtags.repurposed'] = 'Hashtag must start with #';
          } else if (repurposedHashtag.includes(' ')) {
            newErrors['hashtags.repurposed'] = 'Hashtag cannot contain spaces';
          } else if (!repurposedHashtag.toLowerCase().includes('ad')) {
            newErrors['hashtags.repurposed'] = 'Hashtag must include "ad"';
          } else if (repurposedHashtag.slice(1).includes('#')) {
            newErrors['hashtags.repurposed'] = 'Hashtag can only have one # at the start';
          }
        }
      }

      // Step 3: Budget validation
      else if (step === 3) {
        const budgetValue = parseFloat(formData.budget);
        const originalRateValue = parseFloat(formData.payoutRate.original);
        const repurposedRateValue = parseFloat(formData.payoutRate.repurposed);

        // Check if budget is at least $1000
        if (isNaN(budgetValue) || budgetValue < 1000) {
          newErrors['budget'] = 'Minimum budget is $1,000';
        }

        // Check original rate if applicable
        if (formData.contentType === 'original' || formData.contentType === 'both') {
          if (isNaN(originalRateValue) || originalRateValue < 500) {
            newErrors['payoutRate.original'] = 'Minimum rate is $500 per 1M views';
          }
        }

        // Check repurposed rate if applicable
        if (formData.contentType === 'repurposed' || formData.contentType === 'both') {
          if (isNaN(repurposedRateValue) || repurposedRateValue < 250) {
            newErrors['payoutRate.repurposed'] =
              'Minimum rate is $250 per 1M views';
          }
        }
      }

      // Step 4: Payment validation
      else if (step === 4) {
        if (!formData.paymentMethod) {
          newErrors['paymentMethod'] = 'Please select a payment method';
        }
      }

      // Step 5: Terms validation
      else if (step === 5) {
        if (!formData.termsAccepted) {
          newErrors['termsAccepted'] = 'Please accept the terms to continue';
        }
      }

      setValidationErrors(newErrors);
    }
  }, [step, steps, formData]);

  const handleBack = useCallback(() => {
    // Clear any validation errors when going back
    setValidationErrors({});

    if (step > 0) {
      setStep((prevStep) => prevStep - 1);
      window.scrollTo(0, 0);
    } else {
      router.push('/brand/dashboard');
    }
  }, [step, router]);

  // Save campaign (in a real app, this would send data to a server)
  const handleSaveCampaign = useCallback(() => {
    // Simulate API call
    setTimeout(() => {
      // Store in localStorage for demo purposes
      const campaigns = JSON.parse(
        localStorage.getItem('brandCampaigns') || '[]'
      );
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
  }, [formData, router]);

  // Submit campaign for review
  const handleSubmitCampaign = useCallback(() => {
    // Start processing payment animation
    setIsProcessingPayment(true);

    // Simulate payment verification and API call
    setTimeout(() => {
      // Store in localStorage for demo purposes
      const campaigns = JSON.parse(
        localStorage.getItem('brandCampaigns') || '[]'
      );
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
  }, [formData, router]);

  // Generate calendar dates for the date picker
  const generateCalendarDates = useCallback((year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Create an array to hold all days
    const days = [];

    // Add empty spaces for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  }, []);

  // Calculate view estimates
  const viewEstimates = useMemo(
    () =>
      calculateEstimatedViews(
        formData.budget,
        formData.payoutRate.original,
        formData.payoutRate.repurposed,
        formData.contentType,
        formData.budgetAllocation
      ),
    [
      formData.budget,
      formData.payoutRate.original,
      formData.payoutRate.repurposed,
      formData.contentType,
      formData.budgetAllocation,
    ]
  );

  // Check if current step is complete
  const isCurrentStepComplete = useMemo(() => {
    return steps[step].isComplete(formData);
  }, [steps, step, formData]);

  // Helper to format numbers as money
  const formatMoney = useCallback((amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }, []);

  // Helper to format numbers in millions with one decimal
  const formatMillions = useCallback((num: number) => {
    return (num / 1000000).toFixed(1) + 'M';
  }, []);

  // Format date for display
  const formatDate = useCallback((dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }, []);

  // Calendar component
  const Calendar = useCallback(
    ({
      type,
      onSelect,
    }: {
      type: 'start' | 'end';
      onSelect: (date: string) => void;
    }) => {
      const [currentDate, setCurrentDate] = useState(new Date());
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const calendarDates = generateCalendarDates(currentYear, currentMonth);

      const isDateDisabled = (date: Date | null) => {
        if (!date) return true;

        // Convert to YYYY-MM-DD format for comparison
        const dateStr = date.toISOString().split('T')[0];
        const todayStr = today;

        // For start date, disable dates before today
        if (type === 'start') {
          return dateStr < todayStr;
        }

        // For end date, disable dates before start date
        return dateStr < formData.startDate;
      };

      const handlePrevMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
      };

      const handleNextMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
      };

      const handleDateClick = (date: Date | null) => {
        if (date && !isDateDisabled(date)) {
          const dateStr = date.toISOString().split('T')[0];
          onSelect(dateStr);
        }
      };

      return (
        <div className="bg-black border border-gray-700 rounded-lg p-4 shadow-lg w-full max-w-xs">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={handlePrevMonth}
              className="p-1 hover:bg-gray-800 rounded-full"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            <div className="font-bold">
              {currentDate.toLocaleString('default', { month: 'long' })}{' '}
              {currentYear}
            </div>

            <button
              onClick={handleNextMonth}
              className="p-1 hover:bg-gray-800 rounded-full"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-gray-400"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDates.map((date, index) => (
              <button
                key={index}
                onClick={() => handleDateClick(date)}
                className={`
                h-8 w-8 flex items-center justify-center rounded-full text-sm
                ${date ? 'hover:bg-gray-700' : ''}
                ${
                  date && isDateDisabled(date)
                  ? 'text-gray-600 cursor-not-allowed'
                  : ''
              }
              ${
                date &&
                date.toISOString().split('T')[0] ===
                  (type === 'start'
                    ? formData.startDate
                    : formData.endDate)
                  ? 'bg-red-600 text-white'
                  : ''
              }
            `}
              disabled={date ? isDateDisabled(date) : true}
            >
              {date ? date.getDate() : ''}
            </button>
          ))}
        </div>
      </div>
    );
  },
  [today, formData.startDate, generateCalendarDates]
);

// Render campaign details step
const renderDetailsStep = () => (
  <div className="space-y-6">
    <div>
      <label
        htmlFor="title"
        className="block text-sm font-medium text-gray-300 mb-1"
      >
        Campaign Title <span className="text-red-500">*</span>
      </label>
      <input
        id="title"
        name="title"
        type="text"
        value={formData.title}
        onChange={handleChange}
        className={`w-full p-3 bg-transparent border rounded-lg focus:outline-none ${
          validationErrors['title']
            ? 'border-red-500'
            : 'border-gray-700 focus:border-red-500'
        }`}
        placeholder="e.g., Summer Movie Launch"
        required
      />
      {validationErrors['title'] && (
        <p className="mt-1 text-sm text-red-500">{validationErrors['title']}</p>
      )}
    </div>

    <div>
      <label
        htmlFor="goal"
        className="block text-sm font-medium text-gray-300 mb-1"
      >
        Campaign Goal <span className="text-red-500">*</span>
      </label>
      <select
        id="goal"
        name="goal"
        value={formData.goal}
        onChange={handleChange}
        className={`w-full p-3 bg-transparent border rounded-lg focus:outline-none ${
          validationErrors['goal']
            ? 'border-red-500'
            : 'border-gray-700 focus:border-red-500'
        }`}
        required
      >
        <option value="">Select your industry</option>
        <option value="awareness">Brand Awareness</option>
        <option value="consideration">Content Promotion</option>
        <option value="conversion">Drive Viewership/Streaming</option>
        <option value="engagement">Community Engagement</option>
        <option value="launch">New Release Promotion</option>
        <option value="event">Event Promotion</option>
        <option value="other">Other</option>
      </select>
      {validationErrors['goal'] && (
        <p className="mt-1 text-sm text-red-500">{validationErrors['goal']}</p>
      )}
    </div>

    <div className="mt-8">
      <div className="flex items-center gap-2 mb-3">
        <Globe className="h-5 w-5 text-blue-400" />
        <label className="block text-sm font-medium text-gray-300">
          Platforms <span className="text-red-500">*</span>
        </label>
      </div>

      <div
        className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${
          validationErrors['platforms']
            ? 'border border-red-500 rounded-lg p-4'
            : ''
        }`}
      >
        <div
          className={`p-4 border rounded-lg flex flex-col items-center cursor-pointer transition-colors ${
            formData.platforms.tiktok
              ? 'border-cyan-500 bg-cyan-900/20'
              : 'border-gray-700 hover:border-gray-500'
          }`}
          onClick={() => handlePlatformChange('tiktok')}
        >
          <svg
            className="h-8 w-8 text-cyan-400 mb-2"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
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
          <svg
            className="h-8 w-8 text-pink-500 mb-2"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0z" />
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
          <svg
            className="h-8 w-8 text-red-500 mb-2"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
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
          <svg
            className="h-8 w-8 text-blue-400 mb-2"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
          </svg>
          <span className="font-medium">X/Twitter</span>
        </div>
      </div>
      {validationErrors['platforms'] && (
        <p className="mt-1 text-sm text-red-500">
          {validationErrors['platforms']}
        </p>
      )}
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
            <div
              className={`w-4 h-4 rounded-full mr-2 ${
                formData.contentType === 'original'
                  ? 'bg-green-500'
                  : 'bg-gray-700'
              }`}
            ></div>
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
            <div
              className={`w-4 h-4 rounded-full mr-2 ${
                formData.contentType === 'repurposed'
                  ? 'bg-blue-500'
                  : 'bg-gray-700'
              }`}
            ></div>
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
            <div
              className={`w-4 h-4 rounded-full mr-2 ${
                formData.contentType === 'both'
                  ? 'bg-purple-500'
                  : 'bg-gray-700'
              }`}
            ></div>
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

// Render creative step
const renderCreativeStep = () => (
  <div className="space-y-8">
    {/* Campaign Dates - Improved with calendar selector */}
    <div className="p-6 border border-gray-800 rounded-lg bg-black/40">
      <h3 className="text-lg font-medium mb-4">Campaign Dates</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CalendarIcon className="h-5 w-5 text-orange-400" />
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-300"
            >
              Start Date <span className="text-red-500">*</span>
            </label>
          </div>
          <div className="relative date-picker-container">
            <div
              className={`w-full p-3 bg-transparent border rounded-lg cursor-pointer flex items-center justify-between ${
                validationErrors['startDate']
                  ? 'border-red-500'
                  : 'border-gray-700'
              }`}
              onClick={() => setShowDatePicker('start')}
            >
              <div>
                {formData.startDate
                  ? formatDate(formData.startDate)
                  : 'Select start date'}
              </div>
              <CalendarIcon className="h-5 w-5 text-gray-500" />
            </div>

            {showDatePicker === 'start' && (
              <div className="absolute z-10 mt-2">
                <Calendar
                  type="start"
                  onSelect={(date) => handleDateSelect('start', date)}
                />
              </div>
            )}

            {validationErrors['startDate'] && (
              <p className="mt-1 text-sm text-red-500">
                {validationErrors['startDate']}
              </p>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <CalendarIcon className="h-5 w-5 text-red-400" />
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-300"
            >
              End Date <span className="text-red-500">*</span>
            </label>
          </div>
          <div className="relative date-picker-container">
            <div
              className={`w-full p-3 bg-transparent border rounded-lg cursor-pointer flex items-center justify-between ${
                validationErrors['endDate']
                  ? 'border-red-500'
                  : 'border-gray-700'
              }`}
              onClick={() => setShowDatePicker('end')}
            >
              <div>
                {formData.endDate
                  ? formatDate(formData.endDate)
                  : 'Select end date'}
              </div>
              <CalendarIcon className="h-5 w-5 text-gray-500" />
            </div>

            {showDatePicker === 'end' && (
              <div className="absolute z-10 mt-2">
                <Calendar
                  type="end"
                  onSelect={(date) => handleDateSelect('end', date)}
                />
              </div>
            )}

            {validationErrors['endDate'] && (
              <p className="mt-1 text-sm text-red-500">
                {validationErrors['endDate']}
              </p>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Campaigns run for a minimum of 30 days. If your campaign budget
            is not fully used, you will receive a refund or credit for the
            remainder.
          </p>
        </div>
      </div>
    </div>

    {/* Original Content Section */}
    {(formData.contentType === 'original' ||
      formData.contentType === 'both') && (
      <div className="p-6 border border-green-800 bg-green-900/10 rounded-lg">
        <h3 className="text-xl font-bold mb-4 text-green-400">
          Original Content
        </h3>

        {/* Campaign Brief */}
        <div className="mb-6">
          <label
            htmlFor="brief.original"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Campaign Brief <span className="text-red-500">*</span>
          </label>
          <textarea
            id="brief.original"
            name="brief.original"
            value={formData.brief.original}
            onChange={handleChange}
            className={`w-full p-3 bg-transparent border rounded-lg focus:outline-none min-h-32 ${
              validationErrors['brief.original']
                ? 'border-red-500'
                : 'border-gray-700 focus:border-red-500'
            }`}
            placeholder="Describe what you want creators to make for your campaign..."
            required
            rows={4}
          />
          {validationErrors['brief.original'] && (
            <p className="mt-1 text-sm text-red-500">
              {validationErrors['brief.original']}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Be specific about your entertainment brand, show, movie, or event
            that you want creators to showcase.
          </p>
        </div>

        {/* Campaign Guidelines */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-400" />
              <label className="block text-sm font-medium text-gray-300">
                Content Guidelines <span className="text-red-500">*</span>
              </label>
            </div>
            <button
              type="button"
              onClick={() => handleAddGuideline('original')}
              className="text-sm flex items-center text-green-400 hover:text-green-300"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Guideline
            </button>
          </div>

          <div className="p-3 bg-black/60 border border-gray-800 rounded-lg mb-4">
            <p className="text-sm text-gray-400">
              Provide clear instructions for creators to follow when making
              original content.
            </p>
          </div>

          <div
            className={`space-y-3 ${
              validationErrors['guidelines.original']
                ? 'border border-red-500 rounded-lg p-4'
                : ''
            }`}
          >
            {formData.guidelines.original.map((guideline, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={guideline}
                  onChange={(e) =>
                    handleGuidelineChange('original', index, e.target.value)
                  }
                  className="flex-1 p-3 bg-transparent border border-gray-700 rounded-lg focus:border-green-500 focus:outline-none"
                  placeholder="e.g., Show excitement for our upcoming movie premiere"
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveGuideline('original', index)}
                    className="p-2 text-gray-400 hover:text-red-400"
                    aria-label="Remove guideline"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
          {validationErrors['guidelines.original'] && (
            <p className="mt-1 text-sm text-red-500">
              {validationErrors['guidelines.original']}
            </p>
          )}
        </div>

        {/* Campaign Hashtag - Improved single hashtag validation */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Hash className="h-5 w-5 text-purple-400" />
            <label className="block text-sm font-medium text-gray-300">
              Campaign Hashtag <span className="text-red-500">*</span>
            </label>
          </div>

          <div className="p-3 bg-black/60 border border-gray-800 rounded-lg mb-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-400">
                  <span className="text-yellow-400 font-medium">
                    Include ONE hashtag with #ad
                  </span>{' '}
                  in it (e.g., #NetflixAd). This is required for disclosure
                  compliance.
                </p>
              </div>
            </div>
          </div>

          <input
            type="text"
            value={formData.hashtags.original}
            onChange={(e) =>
              handleChange({
                target: {
                  name: 'hashtags.original',
                  value: e.target.value,
                },
              } as React.ChangeEvent<HTMLInputElement>)
            }
            className={`w-full p-3 bg-transparent border rounded-lg focus:outline-none ${
              validationErrors['hashtags.original']
                ? 'border-red-500'
                : 'border-gray-700 focus:border-green-500'
            }`}
            placeholder="#YourBrandAd"
          />
          {validationErrors['hashtags.original'] && (
            <p className="mt-1 text-sm text-red-500">
              {validationErrors['hashtags.original']}
            </p>
          )}
        </div>
      </div>
    )}

    {/* Repurposed Content Section */}
    {(formData.contentType === 'repurposed' ||
      formData.contentType === 'both') && (
      <div className="p-6 border border-blue-800 bg-blue-900/10 rounded-lg">
        <h3 className="text-xl font-bold mb-4 text-blue-400">
          Repurposed Content
        </h3>

        {/* Campaign Brief */}
        <div className="mb-6">
          <label
            htmlFor="brief.repurposed"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Campaign Brief <span className="text-red-500">*</span>
          </label>
          <textarea
            id="brief.repurposed"
            name="brief.repurposed"
            value={formData.brief.repurposed}
            onChange={handleChange}
            className={`w-full p-3 bg-transparent border rounded-lg focus:outline-none min-h-32 ${
              validationErrors['brief.repurposed']
                ? 'border-red-500'
                : 'border-gray-700 focus:border-red-500'
            }`}
            placeholder="Describe how creators should adapt their existing content for your campaign..."
            required
            rows={4}
          />
          {validationErrors['brief.repurposed'] && (
            <p className="mt-1 text-sm text-red-500">
              {validationErrors['brief.repurposed']}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Explain how creators can adapt their existing content to feature
            your entertainment brand.
          </p>
        </div>

        {/* Campaign Guidelines */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-400" />
              <label className="block text-sm font-medium text-gray-300">
                Content Guidelines <span className="text-red-500">*</span>
              </label>
            </div>
            <button
              type="button"
              onClick={() => handleAddGuideline('repurposed')}
              className="text-sm flex items-center text-blue-400 hover:text-blue-300"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Guideline
            </button>
          </div>

          <div className="p-3 bg-black/60 border border-gray-800 rounded-lg mb-4">
            <p className="text-sm text-gray-400">
              Provide clear instructions for creators to follow when adapting
              existing content.
            </p>
          </div>

          <div
            className={`space-y-3 ${
              validationErrors['guidelines.repurposed']
                ? 'border border-red-500 rounded-lg p-4'
                : ''
            }`}
          >
            {formData.guidelines.repurposed.map((guideline, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={guideline}
                  onChange={(e) =>
                    handleGuidelineChange('repurposed', index, e.target.value)
                  }
                  className="flex-1 p-3 bg-transparent border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., Add our movie trailer to your existing reaction videos"
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveGuideline('repurposed', index)}
                    className="p-2 text-gray-400 hover:text-red-400"
                    aria-label="Remove guideline"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
          {validationErrors['guidelines.repurposed'] && (
            <p className="mt-1 text-sm text-red-500">
              {validationErrors['guidelines.repurposed']}
            </p>
          )}
        </div>

        {/* Campaign Hashtag - Improved single hashtag validation */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Hash className="h-5 w-5 text-purple-400" />
            <label className="block text-sm font-medium text-gray-300">
              Campaign Hashtag <span className="text-red-500">*</span>
            </label>
          </div>

          <div className="p-3 bg-black/60 border border-gray-800 rounded-lg mb-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-400">
                  <span className="text-yellow-400 font-medium">
                    Include ONE hashtag with #ad
                  </span>{' '}
                  in it (e.g., #NetflixAd). This is required for disclosure
                  compliance.
                </p>
              </div>
            </div>
          </div>

          <input
            type="text"
            value={formData.hashtags.repurposed}
            onChange={(e) =>
              handleChange({
                target: {
                  name: 'hashtags.repurposed',
                  value: e.target.value,
                },
              } as React.ChangeEvent<HTMLInputElement>)
            }
            className={`w-full p-3 bg-transparent border rounded-lg focus:outline-none ${
                validationErrors['hashtags.repurposed']
                  ? 'border-red-500'
                  : 'border-gray-700 focus:border-blue-500'
              }`}
              placeholder="#YourBrandAd"
            />
            {validationErrors['hashtags.repurposed'] && (
              <p className="mt-1 text-sm text-red-500">
                {validationErrors['hashtags.repurposed']}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Campaign Assets */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Image className="h-5 w-5 text-green-400" />
          <label className="block text-sm font-medium text-gray-300">
            Campaign Assets <span className="text-gray-500">(Optional)</span>
          </label>
        </div>

        <div className="p-3 bg-black/60 border border-gray-800 rounded-lg mb-4">
          <p className="text-sm text-gray-400">
            Upload images, videos, logos, or other assets for creators to use
            in their content. For entertainment brands, consider including
            trailers, promotional images, or event details.
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
              <span className="font-medium">Click to upload</span> or drag and
              drop
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
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-black/40 border border-gray-800 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-gray-800 rounded mr-3">
                      <Layers className="h-4 w-4 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024).toFixed(0)} KB
                      </p>
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
    </div>
  );

  // Render creator view preview
  const renderCreatorView = () => (
    <div className="space-y-6">
      <div className="p-6 rounded-lg bg-black/40 border border-gray-800">
        <h3 className="text-xl font-bold mb-6">Creator View Preview</h3>

        <div className="p-5 border border-gray-700 rounded-lg bg-black/60 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-xl font-bold text-white">
                {formData.title || 'Your Campaign Title'}
              </h4>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="px-3 py-1 rounded-full bg-red-900/20 text-red-400 text-sm">
                  NEW
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 text-sm text-gray-300">
                  {formData.goal === 'awareness'
                    ? 'Brand Awareness'
                    : formData.goal === 'consideration'
                    ? 'Content Promotion'
                    : formData.goal === 'conversion'
                    ? 'Drive Viewership'
                    : formData.goal === 'engagement'
                    ? 'Community Engagement'
                    : formData.goal === 'launch'
                    ? 'New Release'
                    : formData.goal === 'event'
                    ? 'Event Promotion'
                    : 'Campaign'}
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-400 flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1" />
              {formData.endDate
                ? formatDate(formData.endDate)
                : 'Campaign End Date'}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Original Content Section */}
              {(formData.contentType === 'original' ||
                formData.contentType === 'both') && (
                <div className="bg-black/40 p-4 rounded-lg border border-gray-800">
                  <h5 className="font-medium text-green-400 mb-3">
                    Original Content
                  </h5>

                  <div className="mb-3">
                    <p className="text-sm text-gray-400 mb-1">Campaign Brief</p>
                    <p className="bg-black/40 p-3 rounded-lg border border-gray-800 text-sm">
                      {formData.brief.original ||
                        'Your campaign brief will appear here'}
                    </p>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm text-gray-400 mb-1">
                      Content Guidelines
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {formData.guidelines.original
                        .filter((guideline) => guideline.trim().length > 0)
                        .map((guideline, index) => (
                          <li key={index}>{guideline}</li>
                        ))}
                      {formData.guidelines.original.filter(
                        (g) => g.trim().length > 0
                      ).length === 0 && (
                        <li className="text-gray-500 italic">
                          Your guidelines will appear here
                        </li>
                      )}
                    </ul>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400 mb-1">
                      Required Hashtag
                    </p>
                    <p className="font-bold text-blue-400">
                      {formData.hashtags.original || '#YourBrandAd'}
                    </p>
                  </div>
                </div>
              )}

              {/* Repurposed Content Section */}
              {(formData.contentType === 'repurposed' ||
                formData.contentType === 'both') && (
                <div className="bg-black/40 p-4 rounded-lg border border-gray-800">
                  <h5 className="font-medium text-blue-400 mb-3">
                    Repurposed Content
                  </h5>

                  <div className="mb-3">
                    <p className="text-sm text-gray-400 mb-1">Campaign Brief</p>
                    <p className="bg-black/40 p-3 rounded-lg border border-gray-800 text-sm">
                      {formData.brief.repurposed ||
                        'Your campaign brief will appear here'}
                    </p>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm text-gray-400 mb-1">
                      Content Guidelines
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {formData.guidelines.repurposed
                        .filter((guideline) => guideline.trim().length > 0)
                        .map((guideline, index) => (
                          <li key={index}>{guideline}</li>
                        ))}
                      {formData.guidelines.repurposed.filter(
                        (g) => g.trim().length > 0
                      ).length === 0 && (
                        <li className="text-gray-500 italic">
                          Your guidelines will appear here
                        </li>
                      )}
                    </ul>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400 mb-1">
                      Required Hashtag
                    </p>
                    <p className="font-bold text-blue-400">
                      {formData.hashtags.repurposed || '#YourBrandAd'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Payout Rate</p>
                <div>
                  {(formData.contentType === 'original' ||
                    formData.contentType === 'both') && (
                    <p className="font-bold text-white">
                      ${formData.payoutRate.original || '500'} per 1M views{' '}
                      <span className="font-normal text-sm text-green-400">
                        (Original)
                      </span>
                    </p>
                  )}
                  {(formData.contentType === 'repurposed' ||
                    formData.contentType === 'both') && (
                    <p className="font-bold text-white">
                      ${formData.payoutRate.repurposed || '250'} per 1M views{' '}
                      <span className="font-normal text-sm text-blue-400">
                        (Repurposed)
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {formData.assets.length > 0 && (
                <div>
                  <p className="text-sm text-gray-400 mb-1">Campaign Assets</p>
                  <div className="bg-black/40 p-3 rounded-lg border border-gray-800 flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-2" />
                    <span>
                      {formData.assets.length} file
                      {formData.assets.length !== 1 ? 's' : ''} available
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 bg-blue-900/10 border border-blue-800 rounded-lg">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-300">
              This is how your campaign will appear to creators on their
              dashboard. They will be able to join the campaign and submit
              content that follows your guidelines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Render budget step
  const renderBudgetStep = () => (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="h-5 w-5 text-green-400" />
          <label
            htmlFor="budget"
            className="block text-sm font-medium text-gray-300"
          >
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
            className={`w-full p-3 pl-10 bg-transparent border rounded-lg focus:outline-none ${
              validationErrors['budget']
                ? 'border-red-500'
                : 'border-gray-700 focus:border-red-500'
            }`}
            placeholder="5000"
            required
          />
          {validationErrors['budget'] && (
            <p className="mt-1 text-sm text-red-500">
              {validationErrors['budget']}
            </p>
          )}
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
          {(formData.contentType === 'original' ||
            formData.contentType === 'both') && (
            <div>
              <div className="flex justify-between mb-2">
                <label
                  htmlFor="payoutRate.original"
                  className="block text-sm font-medium text-gray-300"
                >
                  Original Content Rate <span className="text-red-500">*</span>
                </label>
                <span className="text-xs text-gray-400">Minimum: $500</span>
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
                  min="500"
                  className={`w-full p-3 pl-10 bg-transparent border rounded-lg focus:outline-none transition-colors ${
                    validationErrors['payoutRate.original']
                      ? 'border-red-500'
                      : 'border-gray-700 focus:border-red-500'
                  }`}
                  placeholder="500"
                  required={
                    formData.contentType === 'original' ||
                    formData.contentType === 'both'
                  }
                />
                {validationErrors['payoutRate.original'] && (
                  <p className="mt-1 text-sm text-red-500">
                    {validationErrors['payoutRate.original']}
                  </p>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Rate for brand-new content created specifically for your
                campaign
              </p>
            </div>
          )}

          {/* Repurposed Content Rate */}
          {(formData.contentType === 'repurposed' ||
            formData.contentType === 'both') && (
            <div>
              <div className="flex justify-between mb-2">
                <label
                  htmlFor="payoutRate.repurposed"
                  className="block text-sm font-medium text-gray-300"
                >
                  Repurposed Content Rate <span className="text-red-500">*</span>
                </label>
                <span className="text-xs text-gray-400">Minimum: $250</span>
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
                  min="250"
                  className={`w-full p-3 pl-10 bg-transparent border rounded-lg focus:outline-none transition-colors ${
                    validationErrors['payoutRate.repurposed']
                      ? 'border-red-500'
                      : 'border-gray-700 focus:border-red-500'
                  }`}
                  placeholder="250"
                  required={
                    formData.contentType === 'repurposed' ||
                    formData.contentType === 'both'
                  }
                />
                {validationErrors['payoutRate.repurposed'] && (
                  <p className="mt-1 text-sm text-red-500">
                    {validationErrors['payoutRate.repurposed']}
                  </p>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Rate for existing content adapted to include your campaign
                messaging
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
            onChange={(e) =>
              handleBudgetAllocationChange(parseInt(e.target.value))
            }
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      )}

      {/* View Calculator - Always show with at least default values */}
      <div className="p-5 rounded-lg bg-green-900/10 border border-green-800">
        <h3 className="font-medium text-lg text-green-400 mb-4 flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Estimated Campaign Reach
        </h3>

        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-6">
            {formData.contentType === 'both' ||
            formData.contentType === 'original' ? (
              <div className="p-4 bg-black/40 border border-gray-800 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Original Content</p>
                <p className="text-2xl font-bold text-white">
                  {formatMillions(viewEstimates.originalViews)} views
                </p>
                <div className="flex items-center text-xs text-gray-400 mt-1">
                  <DollarSign className="h-3 w-3 mr-1" />
                  {formData.budget && formData.contentType === 'both'
                    ? formatMoney(
                        parseInt(formData.budget) *
                          formData.budgetAllocation.original /
                          100
                      )
                    : formatMoney(parseInt(formData.budget) || 0)}
                </div>
              </div>
            ) : null}

            {formData.contentType === 'both' ||
            formData.contentType === 'repurposed' ? (
              <div className="p-4 bg-black/40 border border-gray-800 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Repurposed Content</p>
                <p className="text-2xl font-bold text-white">
                  {formatMillions(viewEstimates.repurposedViews)} views
                </p>
                <div className="flex items-center text-xs text-gray-400 mt-1">
                  <DollarSign className="h-3 w-3 mr-1" />
                  {formData.budget && formData.contentType === 'both'
                    ? formatMoney(
                        parseInt(formData.budget) *
                          formData.budgetAllocation.repurposed /
                          100
                      )
                    : formatMoney(parseInt(formData.budget) || 0)}
                </div>
              </div>
            ) : null}
          </div>

          <div className="p-4 bg-green-900/20 border border-green-800 rounded-lg">
            <p className="text-sm text-gray-400 mb-1">Total Estimated Views</p>
            <div className="flex justify-between items-end">
              <p className="text-3xl font-bold text-green-400">
                {formatMillions(viewEstimates.totalViews)} views
              </p>
              <p className="text-lg font-medium text-white">
                {formData.budget ? formatMoney(parseInt(formData.budget)) : '$0'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render payment step
  const renderPaymentStep = () => (
    <div className="space-y-6">
      <div className="p-5 rounded-lg bg-black/40 border border-gray-800">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-black/60 rounded-lg border border-green-700">
            <DollarSign className="h-6 w-6 text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-white mb-2">
              Payment on Approval
            </h3>
            <p className="text-gray-400 mb-4">
              When your campaign is approved, your payment method will be
              charged immediately for the full campaign budget:{' '}
              <span className="font-bold text-white">
                {formData.budget
                  ? formatMoney(parseInt(formData.budget))
                  : '$0'}
              </span>
            </p>

            <div className="p-3 bg-yellow-900/10 border border-yellow-800 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-300">
                  Your campaign must have valid payment information before it
                  can be reviewed and published.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Select Payment Method</h3>

        <div
          className={`space-y-3 ${
            validationErrors['paymentMethod']
              ? 'border border-red-500 rounded-lg p-4'
              : ''
          }`}
        >
          {paymentMethods.map((method) => (
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
                    {method.type.charAt(0).toUpperCase() + method.type.slice(1)}{' '}
                    •••• {method.last4}
                  </p>
                  <p className="text-sm text-gray-400">Expires {method.expiry}</p>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                  formData.paymentMethod === method.id
                    ? 'border-green-500'
                    : 'border-gray-600'
                }`}
              >
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
        {validationErrors['paymentMethod'] && (
          <p className="mt-1 text-sm text-red-500">
            {validationErrors['paymentMethod']}
          </p>
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-700">
        <h3 className="text-lg font-medium mb-4">Campaign Budget Summary</h3>

        <div className="p-4 bg-black/40 border border-gray-800 rounded-lg mb-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <p className="text-gray-300">Campaign Budget:</p>
              <p className="font-bold">
                {formData.budget ? formatMoney(parseInt(formData.budget)) : '$0'}
              </p>
            </div>

            <div className="flex justify-between">
              <p className="text-gray-300">Estimated Views:</p>
              <p className="font-bold text-green-400">
                {formatMillions(viewEstimates.totalViews)}
              </p>
            </div>

            <div className="pt-3 border-t border-gray-700">
              <div className="flex justify-between">
                <p className="text-gray-300">Content Types:</p>
                <p className="font-medium">
                  {formData.contentType === 'original'
                    ? 'Original Only'
                    : formData.contentType === 'repurposed'
                    ? 'Repurposed Only'
                    : 'Original & Repurposed'}
                </p>
              </div>

              {formData.contentType === 'both' && (
                <div className="mt-2">
                  <div className="flex justify-between text-sm">
                    <p className="text-gray-400">
                      Original ({formData.budgetAllocation.original}%):
                    </p>
                    <p>
                      {formatMoney(
                        parseInt(formData.budget || '0') *
                          formData.budgetAllocation.original /
                          100
                      )}
                    </p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p className="text-gray-400">
                      Repurposed ({formData.budgetAllocation.repurposed}%):
                    </p>
                    <p>
                      {formatMoney(
                        parseInt(formData.budget || '0') *
                          formData.budgetAllocation.repurposed /
                          100
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render final review step
  const renderFinalReviewStep = () => (
    <div className="space-y-6">
      <div className="p-6 rounded-lg bg-black/40 border border-gray-800">
        <h3 className="text-xl font-bold mb-6">Campaign Details Review</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h4 className="text-sm text-gray-400 mb-1">
                Campaign Title & Goal
              </h4>
              <p className="font-bold text-lg text-white">{formData.title}</p>
              <p className="text-gray-300">
                {formData.goal === 'awareness'
                  ? 'Brand Awareness'
                  : formData.goal === 'consideration'
                  ? 'Content Promotion'
                  : formData.goal === 'conversion'
                  ? 'Drive Viewership/Streaming'
                  : formData.goal === 'engagement'
                  ? 'Community Engagement'
                  : formData.goal === 'launch'
                  ? 'New Release Promotion'
                  : formData.goal === 'event'
                  ? 'Event Promotion'
                  : 'Other'}
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
                      className="px-2 py-1 bg-black/40 border border-gray-700 rounded-lg text-sm"
                    >
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </span>
                  ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm text-gray-400 mb-1">Content Type</h4>
              <p className="font-medium">
                {formData.contentType === 'original'
                  ? 'Original Content'
                  : formData.contentType === 'repurposed'
                  ? 'Repurposed Content'
                  : 'Both Types'}
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
              <h4 className="text-sm text-gray-400 mb-1">
                Campaign Duration
              </h4>
              <p className="font-medium">
                {formatDate(formData.startDate)} to{' '}
                {formatDate(formData.endDate)}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-sm text-gray-400 mb-1">Budget</h4>
              <p className="text-2xl font-bold">
                {formData.budget ? formatMoney(parseInt(formData.budget)) : '$0'}
              </p>

              <div className="mt-2 p-3 bg-black/30 border border-gray-700 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Eye className="h-4 w-4 text-green-400" />
                  <p className="font-medium text-green-400">
                    Estimated Campaign Reach
                  </p>
                </div>
                <p className="text-xl font-bold">
                  {formatMillions(viewEstimates.totalViews)} views
                </p>
                {formData.contentType === 'both' && (
                  <div className="text-sm text-gray-400 mt-1 grid grid-cols-2 gap-2">
                    <div>
                      Original: {formatMillions(viewEstimates.originalViews)}
                      </div>
                    <div>
                      Repurposed: {formatMillions(viewEstimates.repurposedViews)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-sm text-gray-400 mb-1">View Rates</h4>
              <div className="space-y-2">
                {(formData.contentType === 'original' ||
                  formData.contentType === 'both') && (
                  <div className="flex justify-between">
                    <span>Original Content:</span>
                    <span className="font-medium">
                      ${formData.payoutRate.original} per 1M views
                    </span>
                  </div>
                )}
                {(formData.contentType === 'repurposed' ||
                  formData.contentType === 'both') && (
                  <div className="flex justify-between">
                    <span>Repurposed Content:</span>
                    <span className="font-medium">
                      ${formData.payoutRate.repurposed} per 1M views
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-sm text-gray-400 mb-1">Payment Method</h4>
              {formData.paymentMethod ? (
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-gray-300" />
                  <p className="font-medium">
                    {
                      paymentMethods.find((m) => m.id === formData.paymentMethod)
                        ?.type || 'Card'
                    }{' '}
                    ••••
                    {paymentMethods.find((m) => m.id === formData.paymentMethod)
                      ?.last4}
                  </p>
                </div>
              ) : (
                <p className="text-yellow-400">No payment method selected</p>
              )}
            </div>

            {formData.assets.length > 0 && (
              <div>
                <h4 className="text-sm text-gray-400 mb-1">Campaign Assets</h4>
                <p className="font-medium">
                  {formData.assets.length} file
                  {formData.assets.length !== 1 ? 's' : ''} included
                </p>
              </div>
            )}
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
              className={`rounded text-red-500 focus:ring-red-500 ${
                validationErrors['termsAccepted'] ? 'border-red-500' : ''
              }`}
            />
          </div>
          <label htmlFor="termsAccepted" className="text-sm leading-relaxed text-gray-300">
            I understand that by submitting this campaign for review, I
            authorize CREATE_OS to charge my selected payment method for the
            campaign budget amount upon approval. I understand that my budget
            will be used to deliver the views calculated above. If my campaign
            doesn't use the full budget within the campaign period, I will
            receive a refund or credit for the unused portion.
          </label>
        </div>
        {validationErrors['termsAccepted'] && (
          <p className="mt-1 text-sm text-red-500">
            {validationErrors['termsAccepted']}
          </p>
        )}
      </div>
    </div>
  );

  // Render the current step content
  const renderStepContent = () => {
    switch (step) {
      case 0:
        return renderDetailsStep();
      case 1:
        return renderCreativeStep();
      case 2:
        return renderCreatorView();
      case 3:
        return renderBudgetStep();
      case 4:
        return renderPaymentStep();
      case 5:
        return renderFinalReviewStep();
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
              Ready to Submit
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h4 className="text-sm text-gray-400 mb-1">Content Types</h4>
                <p className="font-medium">
                  {formData.contentType === 'original'
                    ? 'Original Content Only'
                    : formData.contentType === 'repurposed'
                    ? 'Repurposed Content Only'
                    : 'Both Original & Repurposed Content'}
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
                <h4 className="text-sm text-gray-400 mb-1">
                  Campaign Duration
                </h4>
                <p className="font-medium">
                  {formatDate(formData.startDate)} to{' '}
                  {formatDate(formData.endDate)}
                </p>
              </div>

              <div>
                <h4 className="text-sm text-gray-400 mb-1">Budget & Views</h4>
                <p className="text-xl font-bold">
                  {formData.budget
                    ? formatMoney(parseInt(formData.budget))
                    : '$0'}
                </p>
                <div className="flex items-center gap-2 mt-1 text-green-400">
                  <Eye className="h-4 w-4" />
                  <p>{formatMillions(viewEstimates.totalViews)} estimated views</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm text-gray-400 mb-1">Payment Method</h4>
                {formData.paymentMethod ? (
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-gray-300" />
                    <p className="font-medium">
                      {
                        paymentMethods.find(
                          (m) => m.id === formData.paymentMethod
                        )?.type || 'Card'
                      }{' '}
                      ••••
                      {
                        paymentMethods.find(
                          (m) => m.id === formData.paymentMethod
                        )?.last4
                      }
                    </p>
                  </div>
                ) : (
                  <p className="text-yellow-400">No payment method selected</p>
                )}
              </div>

              <div>
                <h4 className="text-sm text-gray-400 mb-1">View Rates</h4>
                <div className="space-y-2">
                  {(formData.contentType === 'original' ||
                    formData.contentType === 'both') && (
                    <div className="flex justify-between">
                      <span>Original Content:</span>
                      <span className="font-medium">
                        ${formData.payoutRate.original} per 1M views
                      </span>
                    </div>
                  )}
                  {(formData.contentType === 'repurposed' ||
                    formData.contentType === 'both') && (
                    <div className="flex justify-between">
                      <span>Repurposed Content:</span>
                      <span className="font-medium">
                        ${formData.payoutRate.repurposed} per 1M views
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {formData.contentType === 'both' && (
                <div>
                  <h4 className="text-sm text-gray-400 mb-1">
                    Budget Allocation
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-gray-300">Original Content:</p>
                      <p className="font-medium">
                        {formData.budgetAllocation.original}%
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-300">Repurposed Content:</p>
                      <p className="font-medium">
                        {formData.budgetAllocation.repurposed}%
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {formData.assets.length > 0 && (
                <div>
                  <h4 className="text-sm text-gray-400 mb-1">Assets</h4>
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-300 mr-2" />
                    <p>
                      {formData.assets.length} file
                      {formData.assets.length !== 1 ? 's' : ''}
                    </p>
                  </div>
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
              <h4 className="font-medium text-yellow-400 mb-1">
                Payment Authorization
              </h4>
              <p className="text-sm text-gray-300">
                By submitting this campaign for review, your selected payment
                method will be charged
                {formData.budget ? ' ' + formatMoney(parseInt(formData.budget)) : ''}{' '}
                upon approval. This budget will deliver approximately{' '}
                {formatMillions(viewEstimates.totalViews)} views for your
                campaign. Any unused budget at the end of the campaign period
                will be refunded or credited to your account.
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
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
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
                      index < step
                        ? 'bg-red-500'
                        : index === step
                        ? 'bg-red-500/70'
                        : 'bg-gray-700'
                    }`}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-400">
                <span>
                  Step {step + 1} of {steps.length}
                </span>
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
                className={`px-4 py-2 flex items-center gap-2 rounded-lg ${
                  isCurrentStepComplete
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-gray-800 text-gray-500'
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