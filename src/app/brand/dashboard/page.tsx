'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  ComposedChart, Area, Cell, PieChart, Pie, Legend
} from 'recharts';
import {
  Plus, Search, Eye, DollarSign, TrendingUp, Filter,
  Users, Calendar, ArrowUpRight, Clock, CheckCircle,
  Settings, LogOut, BarChart2, Activity, User, AlertTriangle, X,
  Lock, Mail, Key, Bell, ArrowLeft, ArrowRight, Shield, 
  Zap, HelpCircle, Info, ExternalLink, CreditCard, BarChart as BarChartIcon,
  Layers, FileText, Download, Percent, Target, ArrowDown
} from 'lucide-react';

// TypeScript interfaces
interface PayoutRate {
  original: number;
  repurposed: number;
}

interface BudgetAllocation {
  original: number;
  repurposed: number;
}

interface Campaign {
  id: string;
  title: string;
  status: 'active' | 'draft' | 'pending-approval' | 'completed' | 'rejected' | 'paused';
  budget: number;
  spent: number;
  views: number;
  engagement: number;
  platforms: string[];
  startDate: string;
  endDate: string;
  brief: string;
  creatorCount: number;
  contentType: 'original' | 'repurposed' | 'both';
  payoutRate: PayoutRate;
  budgetAllocation?: BudgetAllocation;
  minViews: number;
  hashtags: string[];
  guidelines: string[];
  engagement_rate?: number;
  completedPosts?: number;
  pendingPosts?: number;
  reachEstimate?: string;
}

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  isLoading?: boolean;
  type: 'pause' | 'edit' | 'delete';
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color?: string;
    unit?: string;
  }>;
  label?: string;
}

interface ButtonTooltipProps {
  children: React.ReactNode;
  tooltip: string;
}

interface BrandData {
  companyName: string;
  industry: string;
  email: string;
  password: string;
  logo: string | null;
  twoFactorEnabled: boolean;
  notificationPreferences: {
    email: boolean;
    creatorJoins: boolean;
    contentSubmissions: boolean;
    paymentAlerts: boolean;
  };
}

interface ViewEstimates {
  originalViews: number;
  repurposedViews: number;
  totalViews: number;
}

interface CampaignDetailModalProps {
  campaign: Campaign;
}

// Sample performance data with more clarity
const performanceData = [
  { date: 'Jan', views: 1.2, engagement: 0.8, creators: 3 },
  { date: 'Feb', views: 1.8, engagement: 1.2, creators: 5 },
  { date: 'Mar', views: 2.2, engagement: 1.5, creators: 7 },
  { date: 'Apr', views: 3.5, engagement: 2.3, creators: 10 },
  { date: 'May', views: 5.1, engagement: 3.4, creators: 15 },
  { date: 'Jun', views: 7.3, engagement: 4.8, creators: 18 }
];

// Improved data for content performance comparison (replacing content distribution)
const contentPerformanceData = [
  { name: 'Original', views: 3.2, engagement: 8.5, conversionRate: 4.2, roi: 2.3 },
  { name: 'Repurposed', views: 5.6, engagement: 7.2, conversionRate: 3.8, roi: 3.1 },
  { name: 'Combined', views: 1.4, engagement: 9.1, conversionRate: 5.1, roi: 2.8 }
];

// Platform performance data with clearer structure
const platformPerformanceData = [
  { platform: 'TikTok', views: 14.5, engagement: 3.2, share: 51 },
  { platform: 'Instagram', views: 8.3, engagement: 2.8, share: 29 },
  { platform: 'YouTube', views: 4.2, engagement: 3.5, share: 15 },
  { platform: 'X', views: 1.3, engagement: 2.1, share: 5 }
];

// Audience demographics data for better insights
const audienceDemographicsData = [
  { age: '18-24', percentage: 35 },
  { age: '25-34', percentage: 40 },
  { age: '35-44', percentage: 15 },
  { age: '45+', percentage: 10 }
];

// Sample active campaigns
const sampleActiveCampaigns: Campaign[] = [
  {
    id: '1',
    title: 'Summer Product Launch',
    status: 'active',
    budget: 10000,
    spent: 4200,
    views: 1200000,
    engagement: 320000,
    platforms: ['TikTok', 'Instagram'],
    startDate: '2025-06-01',
    endDate: '2025-06-30',
    brief: 'Promote our new summer collection with creative, authentic content.',
    creatorCount: 8,
    contentType: 'original',
    payoutRate: {
      original: 500,
      repurposed: 0
    },
    engagement_rate: 4.2,
    completedPosts: 15,
    pendingPosts: 3,
    reachEstimate: '1.5M - 2.2M',
    minViews: 10000,
    hashtags: ['#SummerLaunch', '#YourBrand'],
    guidelines: ['Show product in use', 'Highlight key features', 'Be authentic']
  },
  {
    id: '2',
    title: 'Brand Awareness Campaign',
    status: 'draft',
    budget: 5000,
    spent: 0,
    views: 0,
    engagement: 0,
    platforms: ['TikTok', 'YouTube'],
    startDate: '2025-07-15',
    endDate: '2025-08-15',
    brief: 'Increase brand awareness among 18-24 year olds.',
    creatorCount: 0,
    contentType: 'both',
    payoutRate: {
      original: 600,
      repurposed: 300
    },
    engagement_rate: 0,
    completedPosts: 0,
    pendingPosts: 0,
    reachEstimate: '800K - 1.2M',
    budgetAllocation: {
      original: 70,
      repurposed: 30
    },
    minViews: 8000,
    hashtags: ['#BrandAwareness', '#YourBrand'],
    guidelines: ['Tell your audience why you love our brand', 'Be creative']
  },
  {
    id: '3',
    title: 'Product Review Series',
    status: 'pending-approval',
    budget: 7500,
    spent: 0,
    views: 0,
    engagement: 0,
    platforms: ['YouTube', 'Instagram'],
    startDate: '2025-07-01',
    endDate: '2025-07-31',
    brief: 'Honest reviews of our flagship products by trusted creators.',
    creatorCount: 0,
    contentType: 'repurposed',
    payoutRate: {
      original: 0,
      repurposed: 350
    },
    engagement_rate: 0,
    completedPosts: 0,
    pendingPosts: 0,
    reachEstimate: '1.0M - 1.5M',
    minViews: 15000,
    hashtags: ['#ProductReview', '#YourBrand'],
    guidelines: ['Honest review', 'Show product in detail', 'Compare with competitors']
  }
];

// Colors for consistent styling
const COLORS = ['#FF4444', '#4287f5', '#31a952', '#b026ff'];

// Calculate estimated views based on budget and rates
const calculateEstimatedViews = (
  budget: number, 
  originalRate: number, 
  repurposedRate: number, 
  contentType: string, 
  originalAllocation = 70, 
  repurposedAllocation = 30
): ViewEstimates => {
  if (isNaN(budget) || budget <= 0) return { originalViews: 0, repurposedViews: 0, totalViews: 0 };
  
  if (contentType === 'original') {
    if (isNaN(originalRate) || originalRate <= 0) return { originalViews: 0, repurposedViews: 0, totalViews: 0 };
    const views = (budget / originalRate) * 1000000;
    return { originalViews: views, repurposedViews: 0, totalViews: views };
  } 
  else if (contentType === 'repurposed') {
    if (isNaN(repurposedRate) || repurposedRate <= 0) return { originalViews: 0, repurposedViews: 0, totalViews: 0 };
    const views = (budget / repurposedRate) * 1000000;
    return { originalViews: 0, repurposedViews: views, totalViews: views };
  }
  else {
    if (isNaN(originalRate) || originalRate <= 0 || isNaN(repurposedRate) || repurposedRate <= 0) {
      return { originalViews: 0, repurposedViews: 0, totalViews: 0 };
    }
    
    const originalBudget = budget * (originalAllocation / 100);
    const repurposedBudget = budget * (repurposedAllocation / 100);
    
    const originalViews = (originalBudget / originalRate) * 1000000;
    const repurposedViews = (repurposedBudget / repurposedRate) * 1000000;
    
    return {
      originalViews,
      repurposedViews,
      totalViews: originalViews + repurposedViews
    };
  }
};

// Custom tooltip component for charts with better formatting
const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 border border-gray-700 bg-black rounded shadow-lg">
        <p className="text-white font-bold mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} className="text-sm flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color || '#FFFFFF' }}></span>
            <span style={{ color: entry.color || '#FFFFFF' }}>
              {entry.name}: {typeof entry.value === 'number' ? 
                entry.name.toLowerCase().includes('rate') ? `${entry.value}%` :
                entry.name === 'views' ? `${entry.value}M` : 
                entry.value.toLocaleString() : 
                entry.value}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Campaign Status Badge component with improved accessibility
const StatusBadge: React.FC<{ status: Campaign['status'] }> = ({ status }) => {
  let bgColor = '';
  let textColor = '';
  let label = '';
  
  switch (status) {
    case 'active':
      bgColor = 'bg-green-900/20';
      textColor = 'text-green-400';
      label = 'ACTIVE';
      break;
    case 'draft':
      bgColor = 'bg-gray-900/20';
      textColor = 'text-gray-400';
      label = 'DRAFT';
      break;
    case 'pending-approval':
      bgColor = 'bg-yellow-900/20';
      textColor = 'text-yellow-400';
      label = 'PENDING REVIEW';
      break;
    case 'completed':
      bgColor = 'bg-blue-900/20';
      textColor = 'text-blue-400';
      label = 'COMPLETED';
      break;
    case 'rejected':
      bgColor = 'bg-red-900/20';
      textColor = 'text-red-400';
      label = 'REJECTED';
      break;
    case 'paused':
      bgColor = 'bg-orange-900/20';
      textColor = 'text-orange-400';
      label = 'PAUSED';
      break;
    default:
      bgColor = 'bg-gray-900/20';
      textColor = 'text-gray-400';
      label = 'UNKNOWN';
  }
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`} role="status">
      {label}
    </span>
  );
};

// Action confirmation modal component
const ActionModal: React.FC<ActionModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  confirmText, 
  cancelText,
  onConfirm,
  isLoading = false,
  type
}) => {
  // Get icon and color based on action type
  const getIconAndColor = () => {
    switch (type) {
      case 'pause':
        return { icon: <Clock className="h-6 w-6 text-yellow-400" />, color: 'bg-yellow-600 hover:bg-yellow-700' };
      case 'edit':
        return { icon: <FileText className="h-6 w-6 text-blue-400" />, color: 'bg-blue-600 hover:bg-blue-700' };
      case 'delete':
        return { icon: <AlertTriangle className="h-6 w-6 text-red-400" />, color: 'bg-red-600 hover:bg-red-700' };
      default:
        return { icon: <Info className="h-6 w-6 text-gray-400" />, color: 'bg-gray-600 hover:bg-gray-700' };
    }
  };

  const { icon, color } = getIconAndColor();

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-black border border-gray-800 rounded-lg p-6 w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start mb-4">
          <div className="mr-4 p-2 rounded-full bg-black/50 border border-gray-700">
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-gray-300">{description}</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-6 sm:justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-700 rounded-lg hover:bg-white/5 transition-colors"
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 ${color} rounded-lg text-white transition-colors flex items-center justify-center gap-2`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper component for tooltips
const ButtonTooltip: React.FC<ButtonTooltipProps> = ({ children, tooltip }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [tooltipSize, setTooltipSize] = useState({ width: 0, height: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && tooltipRef.current) {
      setTooltipSize({
        width: tooltipRef.current.offsetWidth,
        height: tooltipRef.current.offsetHeight
      });
    }
  }, [isVisible]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: rect.left + (rect.width / 2),
      y: rect.top - 10
    });
    setIsVisible(true);
  };

  return (
    <div className="relative inline-block">
      <div 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsVisible(false)}
        className="inline-block"
      >
        {children}
      </div>
      {isVisible && (
        <div
          ref={tooltipRef}
          className="absolute z-50 px-2 py-1 text-xs bg-gray-800 text-white rounded whitespace-nowrap pointer-events-none transition-opacity duration-150"
          style={{
            left: position.x - (tooltipSize.width / 2),
            top: position.y - tooltipSize.height,
            opacity: isVisible ? 1 : 0
          }}
        >
          {tooltip}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
        </div>
      )}
    </div>
  );
};

// Helper component to format numbers
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// Helper to format currency
const formatMoney = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const BrandDashboard: React.FC = () => {
  const router = useRouter();
  const [activeView, setActiveView] = useState<'overview' | 'campaigns' | 'team' | 'settings'>('overview');
  const [timeFilter, setTimeFilter] = useState<string>('6M');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState<boolean>(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showCampaignDetail, setShowCampaignDetail] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [campaignFilterStatus, setCampaignFilterStatus] = useState<string>('all');
  const [campaigns, setCampaigns] = useState<Campaign[]>(sampleActiveCampaigns);
  
  // Action modal state
  const [actionModal, setActionModal] = useState({
    isOpen: false,
    title: '',
    description: '',
    confirmText: '',
    cancelText: 'Cancel',
    type: 'pause' as 'pause' | 'edit' | 'delete',
    campaignId: null as string | null,
    isLoading: false
  });
  
  // State for help popover
  const [showHelpPopover, setShowHelpPopover] = useState<boolean>(false);
  
  // Settings state
  const [brandData, setBrandData] = useState<BrandData>({
    companyName: 'Your Brand',
    industry: 'Entertainment',
    email: 'contact@yourbrand.com',
    password: '••••••••',
    logo: null,
    twoFactorEnabled: false,
    notificationPreferences: {
      email: true,
      creatorJoins: true,
      contentSubmissions: true,
      paymentAlerts: true
    }
  });
  
  // Effect to load brand data on component mount
  useEffect(() => {
    const savedBrandData = localStorage.getItem('brandData');
    if (savedBrandData) {
      try {
        const parsedData = JSON.parse(savedBrandData);
        setBrandData(prev => ({
          ...prev,
          companyName: parsedData.companyName || prev.companyName,
          industry: parsedData.industry || prev.industry,
          email: parsedData.email || prev.email
        }));
      } catch (error) {
        console.error('Error parsing brand data', error);
      }
    }
    
    // Check if user is logged in as a brand
    const isBrandLoggedIn = localStorage.getItem('isBrandLoggedIn') === 'true';
    if (!isBrandLoggedIn) {
      router.push('/brand/login');
    }
    
    // Check localStorage for brand campaigns
    const storedCampaigns = localStorage.getItem('brandCampaigns');
    if (storedCampaigns) {
      try {
        const parsedCampaigns = JSON.parse(storedCampaigns);
        if (Array.isArray(parsedCampaigns) && parsedCampaigns.length > 0) {
          setCampaigns(parsedCampaigns);
        }
      } catch (error) {
        console.error('Error parsing stored campaigns', error);
      }
    }
  }, [router]);
  
  // Campaign click handler
  const handleCampaignClick = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowCampaignDetail(true);
  };

  // Handle saving settings
  const handleSaveSettings = (field: string, value: any) => {
    // For nested objects like notificationPreferences
    if (field === 'notificationPreferences') {
      setBrandData(prev => ({
        ...prev,
        notificationPreferences: value
      }));
    } 
    // For profile updates that may include multiple fields
    else if (field === 'profile') {
      setBrandData(prev => ({
        ...prev,
        // Only update provided fields
        ...(value.companyName && { companyName: value.companyName }),
        ...(value.industry && { industry: value.industry }),
        ...(value.email && { email: value.email })
      }));
    }
    // For direct field updates
    else {
      setBrandData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    setSuccessMessage(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Handle toggling 2FA
  const handleToggle2FA = () => {
    setBrandData(prev => ({
      ...prev,
      twoFactorEnabled: !prev.twoFactorEnabled
    }));
    
    setSuccessMessage(brandData.twoFactorEnabled ? 
      '2FA has been disabled' : 
      '2FA has been enabled');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };
  
  // Handle creating a new campaign
  const handleCreateCampaign = () => {
    router.push('/brand/campaigns/create');
  };
  
  // Filtered campaigns based on search term and status filter
  const filteredCampaigns = useMemo(() => {
    if (!searchTerm && campaignFilterStatus === 'all') return campaigns;
    
    return campaigns.filter(campaign => {
      const matchesSearch = !searchTerm || 
        campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.platforms.some(platform => 
          platform.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      const matchesStatus = campaignFilterStatus === 'all' || 
        campaign.status === campaignFilterStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, campaignFilterStatus, campaigns]);
  
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('isBrandLoggedIn');
    localStorage.removeItem('brandData');
    router.push('/');
  };

  // Handle campaign action (pause, edit, delete)
  const handleCampaignAction = (action: string, campaign: Campaign) => {
    if (action === 'pause') {
      setActionModal({
        isOpen: true,
        title: 'Pause Campaign',
        description: `Are you sure you want to pause "${campaign.title}"? This will temporarily stop the campaign from accepting new content.`,
        confirmText: 'Pause Campaign',
        cancelText: 'Cancel',
        type: 'pause',
        campaignId: campaign.id,
        isLoading: false
      });
    } 
    else if (action === 'edit') {
      setActionModal({
        isOpen: true,
        title: 'Edit Campaign',
        description: `You're about to edit "${campaign.title}". This will allow you to update campaign settings and requirements.`,
        confirmText: 'Edit Campaign',
        cancelText: 'Cancel',
        type: 'edit',
        campaignId: campaign.id,
        isLoading: false
      });
    }
    else if (action === 'delete') {
      setActionModal({
        isOpen: true,
        title: 'Delete Campaign',
        description: `Are you sure you want to delete "${campaign.title}"? This action cannot be undone.`,
        confirmText: 'Delete Campaign',
        cancelText: 'Cancel',
        type: 'delete',
        campaignId: campaign.id,
        isLoading: false
      });
    }
  };

  // Handle confirmation of campaign action
  const handleConfirmAction = () => {
    setActionModal(prev => ({ ...prev, isLoading: true }));

    // Simulate API delay
    setTimeout(() => {
      const { type, campaignId } = actionModal;
      
      if (type === 'pause') {
        setCampaigns(prev => 
          prev.map(campaign => 
            campaign.id === campaignId
              ? { ...campaign, status: campaign.status === 'paused' ? 'active' : 'paused' }
              : campaign
          )
        );
        
        setSuccessMessage('Campaign paused successfully');
      }
      else if (type === 'edit') {
        // For edit, we would typically navigate to an edit page
        // For now, we'll just show a success message
        setSuccessMessage('Campaign edit mode activated');
        setActionModal(prev => ({ ...prev, isOpen: false, isLoading: false }));
        
        // Navigate to edit page with the campaign ID
        if (campaignId) {
          router.push(`/brand/campaigns/create?edit=${campaignId}`);
        }
        return;
      }
      else if (type === 'delete') {
        setCampaigns(prev => 
          prev.filter(campaign => campaign.id !== campaignId)
        );
        
        setSuccessMessage('Campaign deleted successfully');
      }
      
      // Update in localStorage
      localStorage.setItem('brandCampaigns', JSON.stringify(campaigns));
      
      setActionModal(prev => ({ ...prev, isOpen: false, isLoading: false }));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  // Overview view
  const renderOverview = () => (
    <div className="space-y-8">
      {/* Create Campaign CTA */}
      <div className="p-6 rounded-lg border border-red-500 bg-red-900/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-start gap-4">
          <Zap className="h-8 w-8 text-red-400 flex-shrink-0" />
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Launch Your Next Campaign</h2>
            <p className="text-gray-300">Reach your target audience through creator content and boost your brand visibility</p>
          </div>
        </div>
        <button
          onClick={handleCreateCampaign}
          className="w-full md:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 transition-colors text-white font-bold rounded-lg flex items-center justify-center gap-2"
          aria-label="Create a new campaign"
        >
          <Plus className="h-5 w-5" />
          Create Campaign
        </button>
      </div>
      
      {/* Performance Overview */}
      <section aria-labelledby="performance-overview" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <h2 id="performance-overview" className="sr-only">Performance Overview</h2>
        
        <div className="p-6 rounded-lg bg-black/40 border border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-medium">Total Views</h3>
          </div>
          <p className="text-3xl font-bold">1.2M</p>
          <div className="mt-2 flex justify-between items-end">
            <div className="flex items-center text-green-400 text-sm">
              <TrendingUp className="h-4 w-4 mr-1" aria-hidden="true" />
              <span>+24% from last period</span>
            </div>
            <div className="text-sm text-gray-400">
              <span>Goal: 2M</span>
            </div>
          </div>
        </div>
        
        <div className="p-6 rounded-lg bg-black/40 border border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <Target className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-medium">Engagement Rate</h3>
          </div>
          <p className="text-3xl font-bold">4.7%</p>
          <div className="mt-2 flex justify-between items-end">
            <div className="flex items-center text-green-400 text-sm">
              <TrendingUp className="h-4 w-4 mr-1" aria-hidden="true" />
              <span>+12% from last period</span>
            </div>
            <div className="text-sm text-gray-400">
              <span>Avg: 3.2%</span>
            </div>
          </div>
        </div>
        
        <div className="p-6 rounded-lg bg-black/40 border border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="h-5 w-5 text-green-400" />
            <h3 className="text-lg font-medium">Budget Utilization</h3>
          </div>
          <p className="text-3xl font-bold">$4,200</p>
          <div className="flex flex-col gap-1 mt-2">
            <p className="text-gray-400 text-sm flex justify-between">
              <span>of $10,000 total budget</span>
              <span className="text-green-400">42%</span>
            </p>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: '42%' }}></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Performance Chart */}
      <section aria-labelledby="performance-chart" className="p-6 rounded-lg bg-black/40 border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h3 id="performance-chart" className="text-xl font-bold flex items-center gap-2">
            <BarChartIcon className="h-5 w-5 text-blue-400" />
            <span>Campaign Performance</span>
          </h3>
          
          <div className="flex items-center gap-2">
            <label htmlFor="time-filter" className="sr-only">Filter by time period</label>
            <select
              id="time-filter"
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-3 py-1 bg-transparent border border-gray-700 rounded text-sm focus:outline-none focus:border-red-500"
              aria-label="Select time period"
            >
              <option value="1M">Last Month</option>
              <option value="3M">Last 3 Months</option>
              <option value="6M">Last 6 Months</option>
              <option value="1Y">Last Year</option>
            </select>
          </div>
        </div>
        
        <div className="h-80" aria-label="Line chart showing view and engagement metrics over time">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="date" 
                stroke="#9CA3AF" 
                tick={{ fill: '#FFFFFF' }}
              />
              <YAxis 
                stroke="#9CA3AF"
                tick={{ fill: '#FFFFFF' }}
                tickFormatter={(value) => `${value}M`}
                width={40}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="views" 
                name="Views"
                stroke="#4287f5"
                strokeWidth={3}
                dot={{ fill: '#FFFFFF', r: 4 }}
                activeDot={{ r: 6, fill: '#4287f5' }}
              />
              <Line 
                type="monotone" 
                dataKey="engagement" 
                name="Engagement"
                stroke="#b026ff"
                strokeWidth={3}
                dot={{ fill: '#FFFFFF', r: 4 }}
                activeDot={{ r: 6, fill: '#b026ff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
      
      {/* REPLACEMENT for Content Strategy Breakdown */}
      <section aria-labelledby="campaign-roi" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ROI by Content Type Chart */}
        <div className="p-6 rounded-lg bg-black/40 border border-gray-800">
          <h3 id="campaign-roi" className="text-xl font-bold mb-6 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-400" />
            <span>ROI by Content Type</span>
          </h3>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contentPerformanceData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="name" 
                  stroke="#9CA3AF" 
                  tick={{ fill: '#FFFFFF' }}
                />
                <YAxis 
                  stroke="#9CA3AF" 
                  tick={{ fill: '#FFFFFF' }}
                  label={{ value: 'ROI Multiplier', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="roi" name="ROI Multiplier" fill="#31a952">
                  {contentPerformanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4">
            {contentPerformanceData.map((item, index) => (
              <div key={index} className="p-3 bg-black/40 border border-gray-700 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <h4 className="text-sm font-medium text-gray-300">{item.name}</h4>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold">{item.roi}x</span>
                  <span className="text-xs text-gray-400">ROI</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Audience Demographics */}
        <div className="p-6 rounded-lg bg-black/40 border border-gray-800">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-400" />
            <span>Audience Demographics</span>
          </h3>
          
          <div className="flex items-center justify-center h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <Pie
                  data={audienceDemographicsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  dataKey="percentage"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {audienceDemographicsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  formatter={(value: string) => (
                    <span>{value}</span>
                  )}
                  layout="horizontal"
                  verticalAlign="bottom"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="p-3 bg-black/40 border border-gray-700 rounded-lg">
              <h4 className="text-sm text-gray-400 mb-1">Primary Audience</h4>
              <p className="text-lg font-bold text-white">25-34 years</p>
              <p className="text-xs text-gray-400">40% of total audience</p>
            </div>
            <div className="p-3 bg-black/40 border border-gray-700 rounded-lg">
              <h4 className="text-sm text-gray-400 mb-1">Growth Opportunity</h4>
              <p className="text-lg font-bold text-white">35-44 years</p>
              <p className="text-xs text-gray-400">Currently 15% of audience</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Platform Performance with tooltips */}
      <section aria-labelledby="platform-performance" className="p-6 rounded-lg bg-black/40 border border-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h3 id="platform-performance" className="text-xl font-bold flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-yellow-400" />
            <span>Platform Performance</span>
          </h3>
          <ButtonTooltip tooltip="Shows how each social platform is performing in your campaigns">
            <button
              className="flex items-center text-sm text-gray-400 gap-1 hover:text-white transition-colors"
              aria-label="Learn more about platform performance"
            >
              <Info className="h-4 w-4" />
              <span className="hidden md:inline">What's this?</span>
            </button>
          </ButtonTooltip>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={platformPerformanceData} 
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
              barSize={24}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="platform" 
                stroke="#9CA3AF" 
                tick={{ fill: '#FFFFFF' }}
              />
              <YAxis 
                yAxisId="left"
                orientation="left"
                stroke="#4287f5"
                tick={{ fill: '#FFFFFF' }}
                tickFormatter={(value) => `${value}M`}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="#FF4444"
                tick={{ fill: '#FFFFFF' }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                yAxisId="left" 
                dataKey="views" 
                name="Views (M)" 
                fill="#4287f5" 
              />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="engagement" 
                name="Engagement Rate (%)" 
                stroke="#FF4444" 
                strokeWidth={3}
                dot={{ fill: '#FFFFFF', r: 3 }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-4 gap-4 mt-6">
          {platformPerformanceData.map((platform) => (
            <div key={platform.platform} className="p-3 bg-black/40 border border-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{platform.platform}</h4>
                <span className="text-xs px-2 py-0.5 bg-white/10 rounded-full">{platform.share}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Views:</span>
                <span className="text-white">{platform.views}M</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Eng:</span>
                <span className="text-white">{platform.engagement}%</span>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Active Campaigns - Improved with more data and button tooltips */}
      <section aria-labelledby="active-campaigns">
        <div className="flex items-center justify-between mb-6">
          <h3 id="active-campaigns" className="text-xl font-bold flex items-center gap-2">
            <Zap className="h-5 w-5 text-red-400" />
            <span>Active Campaigns</span>
          </h3>
          
          <button
            onClick={() => setActiveView('campaigns')}
            className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1"
          >
            View All
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
        
        {filteredCampaigns.filter(c => c.status === 'active').length > 0 ? (
          <div className="space-y-4">
            {filteredCampaigns
              .filter(c => c.status === 'active')
              .map((campaign) => (
                <div 
                  key={campaign.id} 
                  className="p-5 border border-gray-800 rounded-lg bg-black/40 hover:border-gray-600 transition-all"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    {/* Column 1: Title and Status */}
                    <div className="lg:col-span-1">
                      <div className="flex flex-col h-full justify-between">
                        <div>
                          <div className="flex items-start justify-between">
                            <h4 className="font-bold text-white">{campaign.title}</h4>
                            <StatusBadge status={campaign.status} />
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {campaign.platforms.map(platform => (
                              <span 
                                key={platform} 
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-800 text-gray-300"
                              >
                                {platform}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="mt-3 text-xs text-gray-400 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>Ends: {new Date(campaign.endDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Column 2: Performance Metrics */}
                    <div className="lg:col-span-1 flex flex-col justify-between">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-xs text-gray-400">Views</p>
                          <p className="font-medium">{formatNumber(campaign.views)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Engagement</p>
                          <p className="font-medium">{formatNumber(campaign.engagement)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Engagement Rate</p>
                          <p className="font-medium">{campaign.engagement_rate}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Creators</p>
                          <p className="font-medium">{campaign.creatorCount}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Column 3: Budget and Content */}
                    <div className="lg:col-span-1 flex flex-col justify-between">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Budget</p>
                        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 rounded-full" 
                            style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center mt-1 text-xs">
                          <span>${campaign.spent.toLocaleString()} spent</span>
                          <span className="text-gray-400">${campaign.budget.toLocaleString()} total</span>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <p className="text-xs text-gray-400 mb-1">Content</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                            {campaign.completedPosts !== undefined && campaign.pendingPosts !== undefined && (
                              <div 
                                className="h-full bg-blue-500 rounded-full" 
                                style={{ width: `${(campaign.completedPosts / (campaign.completedPosts + campaign.pendingPosts)) * 100}%` }}
                              ></div>
                            )}
                          </div>
                          <span className="text-xs">
                            {campaign.completedPosts !== undefined && campaign.pendingPosts !== undefined
                              ? `${campaign.completedPosts}/${campaign.completedPosts + campaign.pendingPosts}`
                              : '0/0'
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Column 4: Actions */}
                    <div className="lg:col-span-1 flex flex-col justify-between">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Estimated Reach</p>
                        <p className="font-medium">{campaign.reachEstimate}</p>
                      </div>
                      
                      <div className="flex flex-col gap-2 mt-auto">
                        <ButtonTooltip tooltip="View detailed campaign analytics and content">
                          <button
                            onClick={() => handleCampaignClick(campaign)}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 transition-colors rounded text-white text-sm flex items-center justify-center gap-1"
                          >
                            Campaign Details
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </button>
                        </ButtonTooltip>
                        
                        <div className="flex gap-2">
                          <ButtonTooltip tooltip="Pause this campaign temporarily">
                            <button
                              onClick={() => handleCampaignAction('pause', campaign)}
                              className="flex-1 px-3 py-1.5 border border-gray-700 hover:bg-white/5 transition-colors rounded text-sm flex items-center justify-center gap-1"
                            >
                              <Clock className="h-3.5 w-3.5" />
                              Pause
                            </button>
                          </ButtonTooltip>
                          
                          <ButtonTooltip tooltip="Download campaign report">
                            <button
                              className="flex-1 px-3 py-1.5 border border-gray-700 hover:bg-white/5 transition-colors rounded text-sm flex items-center justify-center gap-1"
                            >
                              <Download className="h-3.5 w-3.5" />
                              Export
                            </button>
                          </ButtonTooltip>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 border border-dashed border-gray-700 rounded-lg">
            <AlertTriangle className="h-12 w-12 text-gray-500 mb-3" aria-hidden="true" />
            <p className="text-center text-gray-400 mb-6">No active campaigns</p>
            <button
              onClick={handleCreateCampaign}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 transition-colors rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label="Create your first campaign"
            >
              Create Campaign
            </button>
          </div>
        )}
      </section>
    </div>
  );
  
  // Campaigns view - Showing all campaigns with improved filters and better action buttons
  const renderCampaigns = () => (
    <div className="space-y-6">
      {/* Search and filter controls */}
      <div className="p-4 bg-black/40 border border-gray-800 rounded-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1">
            <div className="text-xl font-bold mb-2">Campaign Management</div>
            <p className="text-sm text-gray-400">View, edit and analyze all your campaigns in one place</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
              </div>
              <label htmlFor="campaign-search" className="sr-only">Search campaigns</label>
              <input
                id="campaign-search"
                type="text"
                className="pl-10 pr-4 py-2 w-full bg-black/40 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search campaigns"
              />
            </div>
            
            <div className="flex gap-3 w-full sm:w-auto">
              <div className="relative flex-1">
                <label htmlFor="status-filter" className="sr-only">Filter by status</label>
                <select
                  id="status-filter"
                  value={campaignFilterStatus}
                  onChange={(e) => setCampaignFilterStatus(e.target.value)}
                  className="px-3 py-2 w-full sm:w-auto bg-black/40 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none pr-8"
                  aria-label="Filter by campaign status"
                >
                  <option value="all">All Campaigns</option>
                  <option value="active">Active</option>
                  <option value="draft">Drafts</option>
                  <option value="pending-approval">Pending</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <Filter className="h-4 w-4 text-gray-400" aria-hidden="true" />
                </div>
              </div>
              
              <button
                onClick={handleCreateCampaign}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 transition-colors rounded-lg text-white font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="Create a new campaign"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                <span>New Campaign</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Campaign Count Summary */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
        <span className="font-medium">{filteredCampaigns.length} campaign{filteredCampaigns.length !== 1 && 's'}</span>
        {searchTerm && <span>matching "{searchTerm}"</span>}
        {campaignFilterStatus !== 'all' && <span>with status: {campaignFilterStatus}</span>}
      </div>
      
      {/* Enhanced Campaign Table with better action buttons */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left p-3 text-gray-400 font-medium">Campaign</th>
              <th className="text-left p-3 text-gray-400 font-medium">Status</th>
              <th className="text-left p-3 text-gray-400 font-medium">Dates</th>
              <th className="text-right p-3 text-gray-400 font-medium">Budget</th>
              <th className="text-right p-3 text-gray-400 font-medium">Views</th>
              <th className="text-right p-3 text-gray-400 font-medium">Creators</th>
              <th className="text-right p-3 text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCampaigns.map((campaign) => (
              <tr 
                key={campaign.id} 
                className="border-b border-gray-800 hover:bg-white/5 transition-colors"
              >
                <td className="p-3">
                  <div className="flex flex-col">
                    <span className="font-medium text-white">{campaign.title}</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {campaign.platforms.slice(0, 2).map(platform => (
                        <span 
                          key={platform}
                          className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-gray-800 text-gray-300"
                        >
                          {platform}
                        </span>
                      ))}
                      {campaign.platforms.length > 2 && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-gray-800 text-gray-300">
                          +{campaign.platforms.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  <StatusBadge status={campaign.status} />
                </td>
                <td className="p-3">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-gray-400">Start:</span>
                      <span>{new Date(campaign.startDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-gray-400">End:</span>
                      <span>{new Date(campaign.endDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}</span>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-right">
                  {campaign.status === 'active' || campaign.status === 'paused' ? (
                    <div>
                      <div className="font-medium">${campaign.spent.toLocaleString()}</div>
                      <div className="text-xs text-gray-400">of ${campaign.budget.toLocaleString()}</div>
                      <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden mt-1 ml-auto">
                        <div 
                          className="h-full bg-green-500 rounded-full" 
                          style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <span>${campaign.budget.toLocaleString()}</span>
                  )}
                </td>
                <td className="p-3 text-right">
                  {campaign.status === 'active' || campaign.status === 'paused' || campaign.status === 'completed' ? (
                    <span>{formatNumber(campaign.views)}</span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="p-3 text-right">
                  {campaign.status === 'active' || campaign.status === 'paused' || campaign.status === 'completed' ? (
                    <span>{campaign.creatorCount}</span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="p-3">
                  <div className="flex justify-end gap-2">
                    <ButtonTooltip tooltip="View campaign details">
                      <button
                        onClick={() => handleCampaignClick(campaign)}
                        className="p-1.5 bg-black/40 border border-gray-700 rounded hover:bg-white/5 transition-colors"
                        aria-label={`View details for ${campaign.title}`}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </ButtonTooltip>
                    
                    {campaign.status !== 'completed' && campaign.status !== 'rejected' && (
                      <ButtonTooltip tooltip="Edit campaign">
                        <button
                          onClick={() => handleCampaignAction('edit', campaign)}
                          className="p-1.5 bg-black/40 border border-gray-700 rounded hover:bg-white/5 transition-colors"
                          aria-label={`Edit ${campaign.title}`}
                        >
                          <FileText className="h-4 w-4" />
                        </button>
                      </ButtonTooltip>
                    )}
                    
                    {campaign.status === 'active' && (
                      <ButtonTooltip tooltip="Pause campaign">
                        <button
                          onClick={() => handleCampaignAction('pause', campaign)}
                          className="p-1.5 bg-black/40 border border-gray-700 rounded hover:bg-white/5 transition-colors"
                          aria-label={`Pause ${campaign.title}`}
                        >
                          <Clock className="h-4 w-4" />
                        </button>
                      </ButtonTooltip>
                    )}
                    
                    {campaign.status === 'paused' && (
                      <ButtonTooltip tooltip="Resume campaign">
                        <button
                          onClick={() => handleCampaignAction('pause', campaign)}
                          className="p-1.5 bg-black/40 border border-gray-700 rounded hover:bg-white/5 transition-colors"
                          aria-label={`Resume ${campaign.title}`}
                        >
                          <Zap className="h-4 w-4" />
                        </button>
                      </ButtonTooltip>
                    )}
                    
                    {campaign.status === 'active' || campaign.status === 'paused' || campaign.status === 'completed' ? (
                      <ButtonTooltip tooltip="Download report">
                        <button
                          className="p-1.5 bg-red-600 rounded hover:bg-red-700 transition-colors"
                          aria-label={`Download report for ${campaign.title}`}
                        >
                          <Download className="h-4 w-4 text-white" />
                        </button>
                      </ButtonTooltip>
                    ) : (
                      <ButtonTooltip tooltip="Delete campaign">
                        <button
                          onClick={() => handleCampaignAction('delete', campaign)}
                          className="p-1.5 bg-red-600 rounded hover:bg-red-700 transition-colors"
                          aria-label={`Delete ${campaign.title}`}
                        >
                          <X className="h-4 w-4 text-white" />
                        </button>
                      </ButtonTooltip>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            
            {/* Create Campaign Row */}
            <tr className="hover:bg-white/5 transition-colors">
              <td colSpan={7} className="p-3">
                <button
                  onClick={handleCreateCampaign}
                  className="w-full py-4 border border-dashed border-gray-700 hover:border-red-500 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  <span>Create New Campaign</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {filteredCampaigns.length === 0 && (
        <div className="col-span-full p-12 flex flex-col items-center justify-center text-center border border-dashed border-gray-700 rounded-lg">
          <AlertTriangle className="h-12 w-12 text-gray-600 mb-4" aria-hidden="true" />
          <h3 className="text-xl font-medium text-gray-400 mb-2">No campaigns found</h3>
          <p className="text-gray-500 mb-6 max-w-md">
            {searchTerm || campaignFilterStatus !== 'all' ? 
              `No campaigns matching your search criteria. Try another search term or clear your filters.` : 
              "You haven't created any campaigns yet. Get started by creating your first campaign."}
          </p>
          <button
            onClick={handleCreateCampaign}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 transition-colors rounded-lg text-white font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Create your first campaign"
          >
            <Plus className="h-4 w-4 inline mr-2" aria-hidden="true" />
            Create Campaign
          </button>
        </div>
      )}
    </div>
  );
  
  // Campaign Detail Component with improved UI and actions
  const CampaignDetailModal: React.FC<CampaignDetailModalProps> = ({ campaign }) => {
    // Helper to format date
    const formatDate = (dateString: string): string => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };
    
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 z-[100]"
        onClick={() => setShowCampaignDetail(false)}
        role="dialog"
        aria-modal="true"
        aria-labelledby="campaign-title"
      >
        <div
          className="border border-gray-800 bg-black/40 rounded-lg p-6 md:p-8 w-full max-w-4xl custom-scrollbar overflow-y-auto max-h-[90vh] md:max-h-[85vh] relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white hover:bg-opacity-10 transition-colors"
            onClick={() => setShowCampaignDetail(false)}
            aria-label="Close campaign details"
          >
            <X className="h-6 w-6 text-gray-300" />
          </button>

          <div className="flex items-center justify-between mb-6 pr-10">
            <h2 id="campaign-title" className="text-2xl md:text-3xl font-bold text-white">
              {campaign.title}
            </h2>
            <StatusBadge status={campaign.status} />
          </div>

          <div className="space-y-8">
            {/* Campaign Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Content Type</p>
                <p className="text-lg font-medium capitalize text-gray-300">
                  {campaign.contentType === 'both' ? 'Original & Repurposed' : campaign.contentType}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-400">Platforms</p>
                <div className="flex flex-wrap gap-2">
                  {campaign.platforms.map(platform => (
                    <span
                      key={platform}
                      className="px-3 py-1 rounded-full bg-white/5 text-sm text-gray-300"
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-400">Campaign Period</p>
                <p className="text-lg font-medium text-gray-300">
                  {formatDate(campaign.startDate)} – {formatDate(campaign.endDate)}
                </p>
              </div>
            </div>

            {/* Campaign Brief */}
            <div className="p-6 bg-black/40 rounded-lg border border-gray-800">
              <h3 className="text-xl font-bold mb-4 text-white">Campaign Brief</h3>
              <p className="text-gray-300">{campaign.brief}</p>
              
              <div className="mt-6 pt-4 border-t border-gray-700">
                <h4 className="font-medium mb-3 text-gray-200">Content Guidelines:</h4>
                <ul className="list-disc pl-5 space-y-2">
                  {campaign.guidelines.map((guideline, i) => (
                    <li key={i} className="text-gray-300">{guideline}</li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-700">
                <h4 className="font-medium mb-3 text-gray-200">Required Hashtags:</h4>
                <div className="flex flex-wrap gap-2">
                  {campaign.hashtags.map((hashtag, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-800 rounded-full text-blue-400">
                      {hashtag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Payout Rates */}
            <div className="p-6 bg-black/40 rounded-lg border border-gray-800 space-y-4">
              <h3 className="text-xl font-bold text-white">Payout Rates</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {campaign.contentType === 'original' || campaign.contentType === 'both' ? (
                  <div className="p-4 bg-black/40 rounded-lg border border-gray-800">
                    <h4 className="font-medium mb-2 text-gray-300">Original Content</h4>
                    <p className="text-xl font-bold text-green-400">${campaign.payoutRate.original} per 1M views</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Create new content specifically for this campaign
                    </p>
                  </div>
                ) : null}

                {campaign.contentType === 'repurposed' || campaign.contentType === 'both' ? (
                  <div className="p-4 bg-black/40 rounded-lg border border-gray-800">
                    <h4 className="font-medium mb-2 text-gray-300">Repurposed Content</h4>
                    <p className="text-xl font-bold text-blue-400">${campaign.payoutRate.repurposed} per 1M views</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Adapt existing content to fit campaign requirements
                    </p>
                  </div>
                ) : null}
              </div>

              <div className="flex items-center p-3 bg-black/40 rounded-lg border border-gray-800">
                <Eye className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-300">Minimum views for payout: <strong className="text-white">{campaign.minViews.toLocaleString()}</strong></span>
              </div>
            </div>

            {/* Budget and Performance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-black/40 border border-gray-800 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Budget</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <p className="text-gray-400">Total:</p>
                    <p className="font-bold">${campaign.budget.toLocaleString()}</p>
                  </div>
                  
                  <div className="flex justify-between">
                    <p className="text-gray-400">Spent:</p>
                    <p className="font-medium">${campaign.spent.toLocaleString()}</p>
                  </div>
                  
                  <div className="flex justify-between">
                    <p className="text-gray-400">Remaining:</p>
                    <p className="font-medium">${(campaign.budget - campaign.spent).toLocaleString()}</p>
                  </div>
                  
                  <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden mt-2">
                    <div 
                      className="h-full bg-red-500 rounded-full"
                      style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-right text-sm text-gray-400">
                    {Math.round((campaign.spent / campaign.budget) * 100)}% used
                  </p>
                </div>
              </div>
              
              <div className="p-6 bg-black/40 border border-gray-800 rounded-lg">
                <h3 className="text-xl font-bold mb-4">
                  {campaign.status === 'active' || campaign.status === 'paused' ? 'Performance' : 'Estimated Reach'}
                </h3>
                
                {campaign.status === 'active' || campaign.status === 'paused' ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="text-gray-400">Views:</p>
                      <p className="font-bold">{formatNumber(campaign.views)}</p>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <p className="text-gray-400">Engagement:</p>
                      <p className="font-bold">{formatNumber(campaign.engagement)}</p>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <p className="text-gray-400">Creators:</p>
                      <p className="font-bold">{campaign.creatorCount}</p>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <p className="text-gray-400">Engagement Rate:</p>
                      <p className="font-bold text-green-400">
                        {campaign.views > 0 ? 
                          ((campaign.engagement / campaign.views) * 100).toFixed(1) + '%' : 
                          'N/A'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="text-gray-400">Estimated Reach:</p>
                      <p className="font-bold text-white">{campaign.reachEstimate || 'N/A'}</p>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <p className="text-gray-400">Target Creators:</p>
                      <p className="font-medium">5-15</p>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <p className="text-gray-400">Estimated ROI:</p>
                      <p className="font-bold text-green-400">2.1x - 3.4x</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-end gap-3 pt-6 border-t border-gray-800">
              {campaign.status === 'draft' && (
                <>
                  <button 
                    className="px-4 py-2 border border-gray-700 hover:bg-white/5 transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                    onClick={() => handleCampaignAction('edit', campaign)}
                  >
                    Edit Campaign
                  </button>
                  <button 
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 transition-colors rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Submit for Approval
                  </button>
                </>
              )}
              
              {campaign.status === 'active' && (
                <>
                  <button 
                    onClick={() => handleCampaignAction('pause', campaign)}
                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 transition-colors rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    aria-label="Pause this campaign"
                  >
                    Pause Campaign
                  </button>
                  <button 
                    onClick={() => handleCampaignAction('edit', campaign)}
                    className="px-4 py-2 border border-gray-700 hover:bg-white/5 transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label="Edit this campaign"
                  >
                    Edit Campaign
                  </button>
                </>
              )}
              
              {campaign.status === 'paused' && (
                <>
                  <button 
                    onClick={() => handleCampaignAction('pause', campaign)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 transition-colors rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    aria-label="Resume this campaign"
                  >
                    Resume Campaign
                  </button>
                  <button 
                    onClick={() => handleCampaignAction('edit', campaign)}
                    className="px-4 py-2 border border-gray-700 hover:bg-white/5 transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label="Edit this campaign"
                  >
                    Edit Campaign
                  </button>
                </>
              )}
              
              <button
                onClick={() => setShowCampaignDetail(false)}
                className="px-4 py-2 border border-gray-700 hover:bg-white/5 transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Close this dialog"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Help popover with button explanations
  const HelpPopover: React.FC = () => (
    <div className="fixed bottom-6 right-6 z-50 bg-black border border-gray-800 rounded-lg shadow-lg p-5 w-80">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-bold flex items-center gap-2">
          <Info className="h-4 w-4 text-blue-400" />
          Button Actions
        </h4>
        <button 
          onClick={() => setShowHelpPopover(false)}
          className="p-1 hover:bg-white/10 rounded-full"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      <div className="space-y-3 text-sm">
        <div className="flex items-start gap-2">
          <Eye className="h-4 w-4 text-gray-300 mt-0.5" />
          <div>
            <p className="text-white font-medium">View Details</p>
            <p className="text-gray-400">View complete campaign information</p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <Clock className="h-4 w-4 text-yellow-400 mt-0.5" />
          <div>
            <p className="text-white font-medium">Pause/Resume</p>
            <p className="text-gray-400">Temporarily pause campaign or resume it</p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <FileText className="h-4 w-4 text-blue-400 mt-0.5" />
          <div>
            <p className="text-white font-medium">Edit Campaign</p>
            <p className="text-gray-400">Modify campaign settings and content guidelines</p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <Download className="h-4 w-4 text-red-400 mt-0.5" />
          <div>
            <p className="text-white font-medium">Export Report</p>
            <p className="text-gray-400">Download campaign analytics as PDF/CSV</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Main render function for the dashboard
  return (
    <div className="min-h-screen bg-black p-4 md:p-8 relative">
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Brand Dashboard</h1>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 border border-gray-800 rounded-lg bg-black/40">
              <Calendar className="h-4 w-4 text-gray-400" aria-hidden="true" />
              <select
                className="bg-transparent border-none outline-none text-sm text-gray-300"
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                aria-label="Select time period"
              >
                <option value="7D">Last 7 Days</option>
                <option value="1M">Last Month</option>
                <option value="3M">Last 3 Months</option>
                <option value="6M">Last 6 Months</option>
                <option value="1Y">Last Year</option>
              </select>
            </div>

            <button
              className="hidden md:flex px-4 py-2 rounded-lg border border-gray-800 bg-black/40 items-center gap-2 hover:bg-black/60 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 text-gray-300"
              onClick={() => setShowLogoutConfirm(true)}
              aria-label="Log out"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation tabs */}
      <nav aria-label="Dashboard sections" className="mb-8 flex overflow-x-auto border-b border-gray-800">
        <button
          className={`px-6 py-3 font-medium relative ${activeView === 'overview' ? 'text-white' : 'text-gray-400'}`}
          onClick={() => setActiveView('overview')}
          aria-current={activeView === 'overview' ? 'page' : undefined}
          aria-label="Overview section"
        >
          Overview
          {activeView === 'overview' && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"
              layoutId="activeTab"
            />
          )}
        </button>
        
        <button
          className={`px-6 py-3 font-medium relative ${activeView === 'campaigns' ? 'text-white' : 'text-gray-400'}`}
          onClick={() => setActiveView('campaigns')}
          aria-current={activeView === 'campaigns' ? 'page' : undefined}
          aria-label="Campaigns section"
        >
          Campaigns
          {activeView === 'campaigns' && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"
              layoutId="activeTab"
            />
          )}
        </button>
        
        <button
          className={`px-6 py-3 font-medium relative ${activeView === 'team' ? 'text-white' : 'text-gray-400'}`}
          onClick={() => setActiveView('team')}
          aria-current={activeView === 'team' ? 'page' : undefined}
          aria-label="Team section"
        >
          Team
          {activeView === 'team' && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"
              layoutId="activeTab"
            />
          )}
        </button>

        <button
          className={`px-6 py-3 font-medium relative ${activeView === 'settings' ? 'text-white' : 'text-gray-400'}`}
          onClick={() => setActiveView('settings')}
          aria-current={activeView === 'settings' ? 'page' : undefined}
          aria-label="Settings section"
        >
          Settings
          {activeView === 'settings' && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"
              layoutId="activeTab"
            />
          )}
        </button>
      </nav>

      {/* Main content area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {activeView === 'overview' && renderOverview()}
          {activeView === 'campaigns' && renderCampaigns()}
          {/* Other views would go here */}
        </motion.div>
      </AnimatePresence>

      {/* Success message */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            role="alert"
          >
            <CheckCircle className="h-5 w-5" aria-hidden="true" />
            <span>{successMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile-only logout button */}
      <div className="md:hidden">
        <button
          className="fixed bottom-6 left-6 z-50 bg-black/40 shadow-lg rounded-full w-12 h-12 flex items-center justify-center border border-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 text-red-500"
          onClick={() => setShowLogoutConfirm(true)}
          aria-label="Log out"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>

      {/* Help button */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-black/40 shadow-lg rounded-full w-12 h-12 flex items-center justify-center border border-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        onClick={() => setShowHelpPopover(!showHelpPopover)}
        aria-label="Get help"
      >
        <HelpCircle className="h-5 w-5" />
      </button>

      {/* Help popover */}
      <AnimatePresence>
        {showHelpPopover && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
          >
            <HelpPopover />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout confirmation modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 z-[100]"
            onClick={() => setShowLogoutConfirm(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
          >
            <motion.div
              className="bg-black border border-gray-800 rounded-lg p-6 w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h3 id="logout-title" className="text-xl font-bold mb-4">Log Out</h3>
              <p className="mb-6">Are you sure you want to log out of your brand account?</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Cancel logout"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 transition-colors rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-label="Confirm logout"
                >
                  Log Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Campaign Detail Modal */}
      <AnimatePresence>
        {showCampaignDetail && selectedCampaign && (
          <CampaignDetailModal campaign={selectedCampaign} />
        )}
      </AnimatePresence>

      {/* Action Confirmation Modal (pause/edit/delete) */}
      <ActionModal 
        isOpen={actionModal.isOpen}
        onClose={() => setActionModal({...actionModal, isOpen: false})}
        title={actionModal.title}
        description={actionModal.description}
        confirmText={actionModal.confirmText}
        cancelText={actionModal.cancelText}
        onConfirm={handleConfirmAction}
        isLoading={actionModal.isLoading}
        type={actionModal.type}
      />

      {/* Loading state */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[200]" role="status">
          <div className="p-6 bg-black border border-gray-800 rounded-lg flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mb-4"></div>
            <p className="text-white">Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandDashboard;