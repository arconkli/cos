"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  ComposedChart, Area, Cell
} from 'recharts';
import {
  Plus, Search, Eye, DollarSign, TrendingUp, Filter,
  Users, Calendar, ArrowUpRight, Clock, CheckCircle,
  Settings, LogOut, BarChart2, Activity, User, AlertTriangle, X,
  Lock, Mail, Key, Bell, ArrowLeft, ArrowRight, Shield, 
  Zap, HelpCircle, Info, ExternalLink, CreditCard, BarChart as BarChartIcon,
  Layers, FileText, Download, Percent, Target
} from 'lucide-react';

// Types definitions remain the same
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
  status: 'active' | 'draft' | 'pending-approval' | 'completed' | 'rejected';
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

interface CampaignTemplate {
  id: string;
  title: string;
  description: string;
  platforms: string[];
  contentType: 'original' | 'repurposed' | 'both';
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'viewer';
  status: 'active' | 'pending';
}

interface ViewEstimates {
  originalViews: number;
  repurposedViews: number;
  totalViews: number;
}

interface NotificationPreferences {
  email: boolean;
  creatorJoins: boolean;
  contentSubmissions: boolean;
  paymentAlerts: boolean;
}

interface BrandData {
  companyName: string;
  industry: string;
  email: string;
  password: string;
  logo: string | null;
  twoFactorEnabled: boolean;
  notificationPreferences: NotificationPreferences;
}

interface ChartDataPoint {
  date: string;
  views: number;
  engagement: number;
  creators: number;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color?: string;
    unit?: string;
  }>;
  label?: string;
}

// Sample performance data
const performanceData = [
  { date: 'Jan', views: 1.2, engagement: 0.8, creators: 3 },
  { date: 'Feb', views: 1.8, engagement: 1.2, creators: 5 },
  { date: 'Mar', views: 2.2, engagement: 1.5, creators: 7 },
  { date: 'Apr', views: 3.5, engagement: 2.3, creators: 10 },
  { date: 'May', views: 5.1, engagement: 3.4, creators: 15 },
  { date: 'Jun', views: 7.3, engagement: 4.8, creators: 18 }
];

// Enhanced content distribution data - replacing the platform pie chart with more useful data
const contentDistributionData = [
  { type: 'Original', views: 3.2, engagement: 240000, creators: 8, conversion: 4.2 },
  { type: 'Repurposed', views: 5.6, engagement: 320000, creators: 12, conversion: 3.8 },
  { type: 'Brand-Supplied', views: 1.4, engagement: 105000, creators: 5, conversion: 5.1 }
];

// Campaign performance data for a stacked bar chart to replace platform distribution
const campaignPerformanceData = [
  { campaign: 'Summer Launch', tiktok: 42, instagram: 28, youtube: 18, twitter: 12 },
  { campaign: 'Holiday Special', tiktok: 35, instagram: 32, youtube: 22, twitter: 11 },
  { campaign: 'Product Reveal', tiktok: 48, instagram: 24, youtube: 15, twitter: 13 },
  { campaign: 'Brand Awareness', tiktok: 38, instagram: 30, youtube: 20, twitter: 12 }
];

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

// Sample active campaigns
const activeCampaigns: Campaign[] = [
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

// Sample team members
const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'You',
    email: 'you@yourbrand.com',
    role: 'admin',
    status: 'active'
  },
  {
    id: '2',
    name: 'Marketing Manager',
    email: 'marketing@yourbrand.com',
    role: 'manager',
    status: 'pending'
  }
];

// Custom tooltip component for charts
const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 border border-gray-700 bg-black rounded">
        <p className="text-white font-bold">{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color || '#FFFFFF' }}>
            {entry.name}: {entry.value} {entry.name === 'views' ? 'M' : entry.unit || ''}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Campaign Status Badge component
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

// BrandDashboard component
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
  }, [router]);
  
  // Campaign click handler
  const handleCampaignClick = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowCampaignDetail(true);
  };

  // Handle saving settings - with improved type handling
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
    if (!searchTerm && campaignFilterStatus === 'all') return activeCampaigns;
    
    return activeCampaigns.filter(campaign => {
      const matchesSearch = !searchTerm || 
        campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.platforms.some(platform => 
          platform.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      const matchesStatus = campaignFilterStatus === 'all' || 
        campaign.status === campaignFilterStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, campaignFilterStatus]);
  
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('isBrandLoggedIn');
    localStorage.removeItem('brandData');
    router.push('/');
  };

  // Helper to format numbers as money
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Helper to format numbers with K/M suffix
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num;
  };

  // Overview view with improved active campaigns styling and accessibility
  const renderOverview = () => (
    <div className="space-y-8">
      {/* Create Campaign CTA at top for immediate visibility - Removed Quick Start button */}
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
            <LineChart data={performanceData}>
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
      
      {/* Content Distribution - REPLACEMENT for Platform Distribution */}
      <section aria-labelledby="content-distribution" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-lg bg-black/40 border border-gray-800">
          <h3 id="content-distribution" className="text-xl font-bold mb-6 flex items-center gap-2">
            <Layers className="h-5 w-5 text-red-400" />
            <span>Content Strategy Breakdown</span>
          </h3>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={contentDistributionData} margin={{ top: 10, right: 10, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="type" stroke="#9CA3AF" tick={{ fill: '#FFFFFF' }} />
                <YAxis 
                  yAxisId="left" 
                  stroke="#4287f5" 
                  tick={{ fill: '#FFFFFF' }} 
                  tickFormatter={(value) => `${value}M`}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  stroke="#ff4444" 
                  tick={{ fill: '#FFFFFF' }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  yAxisId="left" 
                  dataKey="views" 
                  name="Views" 
                  barSize={40} 
                  fill="#4287f5" 
                />
                <Line 
                  yAxisId="right" 
                  dataKey="conversion" 
                  name="Conversion Rate %" 
                  stroke="#ff4444" 
                  strokeWidth={3}
                  dot={{ fill: '#FFFFFF', r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mt-4">
            {contentDistributionData.map((item, index) => (
              <div key={index} className="p-3 bg-black/40 border border-gray-700 rounded-lg">
                <h4 className="text-sm font-medium text-gray-300 mb-1">{item.type}</h4>
                <div className="flex justify-between items-end">
                  <span className="text-xl font-bold">{item.views}M</span>
                  <span className="text-sm text-red-400">{item.conversion}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-6 rounded-lg bg-black/40 border border-gray-800">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-yellow-400" />
            <span>Platform Performance</span>
          </h3>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={campaignPerformanceData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis type="number" stroke="#9CA3AF" tick={{ fill: '#FFFFFF' }} />
                <YAxis 
                  dataKey="campaign" 
                  type="category" 
                  stroke="#9CA3AF" 
                  tick={{ fill: '#FFFFFF' }}
                  width={100}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="tiktok" name="TikTok" stackId="a" fill="#69C9D0" />
                <Bar dataKey="instagram" name="Instagram" stackId="a" fill="#E1306C" />
                <Bar dataKey="youtube" name="YouTube" stackId="a" fill="#FF0000" />
                <Bar dataKey="twitter" name="X/Twitter" stackId="a" fill="#1DA1F2" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#69C9D0]"></div>
              <span className="text-xs">TikTok</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#E1306C]"></div>
              <span className="text-xs">Instagram</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF0000]"></div>
              <span className="text-xs">YouTube</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#1DA1F2]"></div>
              <span className="text-xs">X/Twitter</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Active Campaigns - Improved with more data and better layout */}
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
        
        {activeCampaigns.filter(c => c.status === 'active').length > 0 ? (
          <div className="space-y-4">
            {activeCampaigns
              .filter(c => c.status === 'active')
              .map(campaign => (
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
                            <div 
                              className="h-full bg-blue-500 rounded-full" 
                              style={{ width: `${(campaign.completedPosts! / (campaign.completedPosts! + campaign.pendingPosts!)) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs">{campaign.completedPosts}/{campaign.completedPosts! + campaign.pendingPosts!}</span>
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
                        <button
                          onClick={() => handleCampaignClick(campaign)}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 transition-colors rounded text-white text-sm flex items-center justify-center gap-1"
                        >
                          Campaign Details
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </button>
                        <button
                          className="px-3 py-1.5 border border-gray-700 hover:bg-white/5 transition-colors rounded text-sm flex items-center justify-center gap-1"
                        >
                          <Download className="h-3.5 w-3.5" />
                          Export Report
                        </button>
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
  
  // Campaigns view - Showing all campaigns with filters
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
                  className="px-3 py-2 w-full bg-black/40 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none pr-8"
                  aria-label="Filter by campaign status"
                >
                  <option value="all">All Campaigns</option>
                  <option value="active">Active</option>
                  <option value="draft">Drafts</option>
                  <option value="pending-approval">Pending</option>
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
      
      {/* Enhanced Campaign Table */}
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
                  {campaign.status === 'active' ? (
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
                  {campaign.status === 'active' ? (
                    <span>{formatNumber(campaign.views)}</span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="p-3 text-right">
                  {campaign.status === 'active' ? (
                    <span>{campaign.creatorCount}</span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="p-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleCampaignClick(campaign)}
                      className="p-1.5 bg-black/40 border border-gray-700 rounded hover:bg-white/5 transition-colors"
                      aria-label={`View details for ${campaign.title}`}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    
                    <button
                      className="p-1.5 bg-black/40 border border-gray-700 rounded hover:bg-white/5 transition-colors"
                      aria-label={`Edit ${campaign.title}`}
                    >
                      <FileText className="h-4 w-4" />
                    </button>
                    
                    {campaign.status === 'active' && (
                      <button
                        className="p-1.5 bg-red-600 rounded hover:bg-red-700 transition-colors"
                        aria-label={`Download report for ${campaign.title}`}
                      >
                        <Download className="h-4 w-4 text-white" />
                      </button>
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
  
  // Team view
  const renderTeam = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Team Members</h2>
        
        <button
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 transition-colors rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label="Invite a new team member"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>Invite Member</span>
        </button>
      </div>
      
      <div className="space-y-4">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="p-4 bg-black/40 border border-gray-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center text-lg font-bold">
                {member.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="font-medium">{member.name}</h4>
                <p className="text-sm text-gray-400">{member.email}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs ${
                member.role === 'admin' 
                  ? 'bg-red-900/20 text-red-400' 
                  : member.role === 'manager'
                    ? 'bg-blue-900/20 text-blue-400'
                    : 'bg-gray-900/20 text-gray-400'
              }`}>
                {member.role === 'admin' ? 'Admin' : member.role === 'manager' ? 'Manager' : 'Viewer'}
              </span>
              
              {member.status === 'pending' && (
                <span className="px-3 py-1 bg-yellow-900/20 text-yellow-400 rounded-full text-xs">
                  Invitation Sent
                </span>
              )}
              
              {member.role !== 'admin' && (
                <button
                  className="ml-auto px-3 py-1 border border-gray-700 rounded-lg text-sm hover:bg-red-900/10 hover:border-red-500 hover:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-label={`Remove ${member.name} from team`}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Team roles explanation */}
      <div className="p-6 bg-black/40 border border-gray-800 rounded-lg mt-8">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Info className="h-5 w-5 text-blue-400" aria-hidden="true" />
          Team Member Roles
        </h3>
        
        <div className="space-y-4">
          <div className="p-3 bg-black/40 border border-gray-800 rounded-lg">
            <h4 className="font-medium mb-1 text-red-400">Admin</h4>
            <p className="text-sm text-gray-300">Full access to all campaigns, billing, and team management</p>
          </div>
          
          <div className="p-3 bg-black/40 border border-gray-800 rounded-lg">
            <h4 className="font-medium mb-1 text-blue-400">Manager</h4>
            <p className="text-sm text-gray-300">Can create and manage campaigns, but cannot access billing or team settings</p>
          </div>
          
          <div className="p-3 bg-black/40 border border-gray-800 rounded-lg">
            <h4 className="font-medium mb-1 text-gray-400">Viewer</h4>
            <p className="text-sm text-gray-300">View-only access to campaigns and reports, no edit permissions</p>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Settings view - Enhanced with email, password change, and 2FA
  const renderSettings = () => (
    <div className="space-y-8">
      <section className="p-6 rounded-lg bg-black/40 border border-gray-800">
        <h3 className="text-xl font-bold mb-6">Account Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="brandName" className="block text-sm text-gray-400 mb-1">Brand Name</label>
              <input
                id="brandName"
                type="text"
                value={brandData.companyName}
                onChange={(e) => setBrandData({...brandData, companyName: e.target.value})}
                className="w-full p-3 bg-transparent border border-gray-700 rounded-lg focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="Brand name"
              />
            </div>
            
            <div>
              <label htmlFor="industryType" className="block text-sm text-gray-400 mb-1">Industry</label>
              <select
                id="industryType"
                value={brandData.industry}
                onChange={(e) => setBrandData({...brandData, industry: e.target.value})}
                className="w-full p-3 bg-transparent border border-gray-700 rounded-lg focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="Select your industry"
              >
                <option value="Entertainment">Entertainment</option>
                <option value="Fashion">Fashion</option>
                <option value="Technology">Technology</option>
                <option value="Food & Beverage">Food & Beverage</option>
                <option value="Beauty">Beauty</option>
                <option value="Retail">Retail</option>
                <option value="Travel">Travel</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          
          <div className="p-6 rounded-lg bg-black/20 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-lg bg-gray-800 flex items-center justify-center text-2xl font-bold" aria-label="Brand logo placeholder">
                {brandData.companyName.charAt(0)}
              </div>
              <div>
                <h4 className="text-lg font-medium">{brandData.companyName}</h4>
                <p className="text-sm text-gray-400">{brandData.industry}</p>
              </div>
            </div>
            <button 
              className="mt-2 px-4 py-2 border border-gray-700 rounded-lg hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label="Upload brand logo"
            >
              Upload Logo
            </button>
            <p className="mt-2 text-xs text-gray-500">Recommended size: 512x512px. JPG, PNG or SVG.</p>
          </div>
        </div>
        
        <button 
          className="mt-6 px-4 py-2 bg-red-600 hover:bg-red-700 transition-colors rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          onClick={() => handleSaveSettings('profile', {
            companyName: brandData.companyName,
            industry: brandData.industry,
            email: brandData.email
          })}
          aria-label="Save profile changes"
        >
          Save Profile
        </button>
      </section>
      
      {/* Email & Password Section */}
      <section className="p-6 rounded-lg bg-black/40 border border-gray-800">
        <h3 className="text-xl font-bold mb-6 flex items-center">
          <Shield className="h-5 w-5 mr-2 text-blue-400" aria-hidden="true" />
          Security Settings
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email Change */}
          <div className="space-y-4 p-5 border border-gray-800 rounded-lg bg-black/20">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
              <h4 className="font-medium">Email Address</h4>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm text-gray-400 mb-1">Current Email</label>
              <input
                id="email"
                type="email"
                value={brandData.email}
                onChange={(e) => setBrandData({...brandData, email: e.target.value})}
                className="w-full p-3 bg-transparent border border-gray-700 rounded-lg focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="Email address"
              />
            </div>
            
            <button 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition-colors rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => handleSaveSettings('email', brandData.email)}
              aria-label="Update email address"
            >
              Update Email
            </button>
          </div>
          
          {/* Password Change */}
          <div className="space-y-4 p-5 border border-gray-800 rounded-lg bg-black/20">
            <div className="flex items-center gap-2 mb-2">
              <Key className="h-5 w-5 text-gray-400" aria-hidden="true" />
              <h4 className="font-medium">Password</h4>
            </div>
            
            <div>
              <label htmlFor="currentPassword" className="block text-sm text-gray-400 mb-1">Current Password</label>
              <input
                id="currentPassword"
                type="password"
                placeholder="••••••••"
                className="w-full p-3 bg-transparent border border-gray-700 rounded-lg focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="Current password"
              />
            </div>
            
            <div>
              <label htmlFor="newPassword" className="block text-sm text-gray-400 mb-1">New Password</label>
              <input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                className="w-full p-3 bg-transparent border border-gray-700 rounded-lg focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="New password"
              />
            </div>
            
            <button 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition-colors rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => handleSaveSettings('password', '••••••••')}
              aria-label="Change password"
            >
              Change Password
            </button>
          </div>
        </div>
        
        {/* Two-Factor Authentication */}
        <div className="mt-6 p-5 border border-gray-800 rounded-lg bg-black/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-yellow-400" aria-hidden="true" />
              <div>
                <h4 className="font-medium">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-400 mt-1">
                  Add an extra layer of security to your account
                </p>
              </div>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={brandData.twoFactorEnabled}
                onChange={handleToggle2FA}
                aria-labelledby="twofa-label"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              <span id="twofa-label" className="sr-only">Enable two-factor authentication</span>
            </label>
          </div>
          
          {brandData.twoFactorEnabled && (
            <div className="mt-4 p-4 bg-black/40 border border-gray-700 rounded-lg">
              <p className="text-sm">
                Two-factor authentication is enabled. You'll be asked for a verification code when signing in from a new device.
              </p>
              <button 
                className="mt-3 px-3 py-1.5 border border-gray-700 rounded text-sm hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                aria-label="Manage two-factor authentication settings"
              >
                Manage 2FA Settings
              </button>
            </div>
          )}
        </div>
      </section>
      
      {/* Notifications */}
      <section className="p-6 rounded-lg bg-black/40 border border-gray-800">
        <h3 className="text-xl font-bold mb-6 flex items-center">
          <Bell className="h-5 w-5 mr-2 text-purple-400" aria-hidden="true" />
          Notification Preferences
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 border border-gray-800 rounded-lg">
            <div>
              <h4 className="font-medium">Email Notifications</h4>
              <p className="text-sm text-gray-400">Receive updates via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={brandData.notificationPreferences.email}
                onChange={() => {
                  setBrandData({
                    ...brandData, 
                    notificationPreferences: {
                      ...brandData.notificationPreferences,
                      email: !brandData.notificationPreferences.email
                    }
                  });
                }}
                aria-label="Toggle email notifications"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-800 rounded-lg">
            <div>
              <h4 className="font-medium">Creator Joins</h4>
              <p className="text-sm text-gray-400">When creators join your campaigns</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={brandData.notificationPreferences.creatorJoins}
                onChange={() => {
                  setBrandData({
                    ...brandData, 
                    notificationPreferences: {
                      ...brandData.notificationPreferences,
                      creatorJoins: !brandData.notificationPreferences.creatorJoins
                    }
                  });
                }}
                aria-label="Toggle creator join notifications"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-800 rounded-lg">
            <div>
              <h4 className="font-medium">Content Submissions</h4>
              <p className="text-sm text-gray-400">When creators submit content for approval</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={brandData.notificationPreferences.contentSubmissions}
                onChange={() => {
                  setBrandData({
                    ...brandData, 
                    notificationPreferences: {
                      ...brandData.notificationPreferences,
                      contentSubmissions: !brandData.notificationPreferences.contentSubmissions
                    }
                  });
                }}
                aria-label="Toggle content submission notifications"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-800 rounded-lg">
            <div>
              <h4 className="font-medium">Payment Alerts</h4>
              <p className="text-sm text-gray-400">Billing and payment notifications</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={brandData.notificationPreferences.paymentAlerts}
                onChange={() => {
                  setBrandData({
                    ...brandData, 
                    notificationPreferences: {
                      ...brandData.notificationPreferences,
                      paymentAlerts: !brandData.notificationPreferences.paymentAlerts
                    }
                  });
                }}
                aria-label="Toggle payment alert notifications"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
        </div>
        
        <button 
          className="mt-6 px-4 py-2 bg-red-600 hover:bg-red-700 transition-colors rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          onClick={() => handleSaveSettings('notificationPreferences', brandData.notificationPreferences)}
          aria-label="Save notification preferences"
        >
          Save Notification Preferences
        </button>
      </section>
      
      <section className="p-6 rounded-lg bg-black/40 border border-gray-800">
        <h3 className="text-xl font-bold mb-6 flex items-center text-red-500">
          <AlertTriangle className="h-5 w-5 mr-2" aria-hidden="true" />
          Danger Zone
        </h3>
        
        <div className="space-y-4">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="px-4 py-2 border border-red-500 text-red-500 hover:bg-red-900/20 transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Log out of your account"
          >
            Log Out
          </button>
          
          <button
            className="px-4 py-2 border border-red-500 text-red-500 hover:bg-red-900/20 transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Delete your account permanently"
          >
            Delete Account
          </button>
        </div>
      </section>
    </div>
  );

  // Campaign Detail Modal Component
  const CampaignDetailModal: React.FC<{ campaign: Campaign }> = ({ campaign }) => {
    // Get estimated views if campaign is not active
    const viewsEstimate = campaign.status !== 'active' ? 
      calculateEstimatedViews(
        campaign.budget - campaign.spent,
        campaign.payoutRate.original,
        campaign.payoutRate.repurposed,
        campaign.contentType,
        campaign.budgetAllocation?.original || 70,
        campaign.budgetAllocation?.repurposed || 30
      ) : null;
      
    // Handle ESC key for modal close
    useEffect(() => {
      const handleEsc = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setShowCampaignDetail(false);
        }
      };
      window.addEventListener('keydown', handleEsc);
      return () => {
        window.removeEventListener('keydown', handleEsc);
      };
    }, []);
    
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 z-[100]"
        onClick={() => setShowCampaignDetail(false)}
        role="dialog"
        aria-modal="true"
        aria-labelledby="campaign-title"
      >
        <div
          className="border border-gray-800 bg-black/40 rounded-lg p-6 md:p-8 w-full max-w-4xl  custom-scrollbar overflow-y-auto max-h-[90vh] md:max-h-[85vh] relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white hover:bg-opacity-10 transition-colors"
            onClick={() => setShowCampaignDetail(false)}
            aria-label="Close campaign details"
          >
            <X className="h-6 w-6 text-gray-300" />
          </button>

          <h2 id="campaign-title" className="text-2xl md:text-3xl font-bold mb-6 pr-10 text-white">
            {campaign.title}
          </h2>

          <div className="space-y-8">
            {/* Campaign Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Type</p>
                <p className="text-lg font-medium capitalize text-gray-300">{campaign.contentType === 'both' ? 'Original & Repurposed' : campaign.contentType}</p>
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
                <p className="text-sm text-gray-400">Deadline</p>
                <p className="text-lg font-medium text-gray-300">
                  {new Date(campaign.endDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {/* Payout Rates */}
            <div className="p-6 bg-black/40 rounded-lg border border-gray-800 space-y-4">
              <h3 className="text-xl font-bold text-white">Payout Rates</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-black/40 rounded-lg border border-gray-800">
                  <h4 className="font-medium mb-2 text-gray-300">Original Content</h4>
                  <p className="text-xl font-bold text-green-400">${campaign.payoutRate.original} per 1M views</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Create new content specifically for this campaign
                  </p>
                </div>

                {campaign.contentType !== 'original' && (
                  <div className="p-4 bg-black/40 rounded-lg border border-gray-800">
                    <h4 className="font-medium mb-2 text-gray-300">Repurposed Content</h4>
                    <p className="text-xl font-bold text-blue-400">${campaign.payoutRate.repurposed} per 1M views</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Adapt existing content to fit campaign requirements
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center p-3 bg-black/40 rounded-lg border border-gray-800">
                <Eye className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-300">Minimum views for payout: <strong className="text-white">{campaign.minViews.toLocaleString()}</strong></span>
              </div>
            </div>

            {/* Guidelines */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">Campaign Guidelines</h3>

              <div className="p-4 bg-black/40 border border-gray-800 rounded-lg">
                <p className="mb-4">{campaign.brief}</p>
                <h4 className="font-medium mb-2">Content Guidelines:</h4>
                <ul className="list-disc pl-5 space-y-2">
                  {campaign.guidelines.map((guideline, i) => (
                    <li key={i} className="text-gray-300">{guideline}</li>
                  ))}
                </ul>
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
                  {campaign.status === 'active' ? 'Performance' : 'Estimated Reach'}
                </h3>
                
                {campaign.status === 'active' ? (
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
                      <p className="text-gray-400">Estimated Views:</p>
                      <p className="font-bold text-green-400">
                        {viewsEstimate ? 
                          formatNumber(viewsEstimate.totalViews) : 
                          'N/A'}
                      </p>
                    </div>
                    
                    {campaign.contentType === 'both' && viewsEstimate && (
                      <>
                        <div className="flex justify-between items-center">
                          <p className="text-gray-400 ml-3">- Original:</p>
                          <p className="font-medium">
                            {formatNumber(viewsEstimate.originalViews)}
                          </p>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <p className="text-gray-400 ml-3">- Repurposed:</p>
                          <p className="font-medium">
                            {formatNumber(viewsEstimate.repurposedViews)}
                          </p>
                        </div>
                      </>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <p className="text-gray-400">Target Creators:</p>
                      <p className="font-medium">5-15</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-end gap-3 pt-6 border-t border-gray-800">
              {campaign.status === 'draft' && (
                <button 
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 transition-colors rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-label="Submit this campaign for approval"
                >
                  Submit for Approval
                </button>
              )}
              
              {campaign.status === 'active' && (
                <button 
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 transition-colors rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  aria-label="Pause this campaign"
                >
                  Pause Campaign
                </button>
              )}
              
              {campaign.status !== 'completed' && campaign.status !== 'rejected' && (
                <button 
                  className="px-4 py-2 border border-gray-700 hover:bg-white/5 transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Edit this campaign"
                >
                  Edit Campaign
                </button>
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

  return (
    <div className="min-h-screen bg-black">
      {/* Loading state */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[200]" role="status">
          <div className="p-6 bg-black border border-gray-800 rounded-lg flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mb-4"></div>
            <p className="text-white">Loading...</p>
          </div>
        </div>
      )}
      
      {/* Header */}
      <header className="border-b border-gray-800 bg-black bg-opacity-80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-bold">
                <a href="/" className="focus:outline-none focus:ring-2 focus:ring-red-500 rounded-sm">CREATE_OS</a>
              </h1>
              
              <div className="hidden md:block">
                <p className="text-gray-400 text-sm">
                  Brand Dashboard
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 bg-gray-800 rounded-full flex items-center justify-center font-bold" aria-label="Brand logo">
                {brandData.companyName.charAt(0).toUpperCase()}
              </div>
              
              <span className="hidden md:block font-medium">{brandData.companyName}</span>
              
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="p-2 hover:bg-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="Log out"
              >
                <LogOut className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
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
            {activeView === 'team' && renderTeam()}
            {activeView === 'settings' && renderSettings()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Help Button - Fixed position */}
      <button
        className="fixed bottom-6 right-6 p-3 bg-gray-800 hover:bg-gray-700 text-white rounded-full shadow-lg z-30 focus:outline-none focus:ring-2 focus:ring-red-500"
        aria-label="Get help"
      >
        <HelpCircle className="h-6 w-6" aria-hidden="true" />
      </button>

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
    </div>
  );
};

export default BrandDashboard;