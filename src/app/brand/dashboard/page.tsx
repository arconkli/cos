"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  Plus, Search, Eye, DollarSign, TrendingUp, Filter,
  Users, Calendar, ArrowUpRight, Clock, CheckCircle,
  Settings, LogOut, BarChart2, Activity, User, AlertTriangle, X,
  Lock, Mail, Key, Bell, ArrowLeft, ArrowRight, Shield, 
  Zap, HelpCircle, Info, ExternalLink, CreditCard
} from 'lucide-react';

// Define TypeScript interfaces
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

interface PlatformDataPoint {
  name: string;
  value: number;
  color: string;
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
const performanceData: ChartDataPoint[] = [
  { date: 'Jan', views: 1.2, engagement: 0.8, creators: 3 },
  { date: 'Feb', views: 1.8, engagement: 1.2, creators: 5 },
  { date: 'Mar', views: 2.2, engagement: 1.5, creators: 7 },
  { date: 'Apr', views: 3.5, engagement: 2.3, creators: 10 },
  { date: 'May', views: 5.1, engagement: 3.4, creators: 15 },
  { date: 'Jun', views: 7.3, engagement: 4.8, creators: 18 }
];

// Platform distribution data
const platformData: PlatformDataPoint[] = [
  { name: 'TikTok', value: 45, color: '#69C9D0' },
  { name: 'Instagram', value: 30, color: '#E1306C' },
  { name: 'YouTube', value: 20, color: '#FF0000' },
  { name: 'Twitter', value: 5, color: '#1DA1F2' }
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

// Sample campaigns
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
    minViews: 15000,
    hashtags: ['#ProductReview', '#YourBrand'],
    guidelines: ['Honest review', 'Show product in detail', 'Compare with competitors']
  }
];

// Sample available campaign templates
const campaignTemplates: CampaignTemplate[] = [
  {
    id: 'template-1',
    title: 'Trailer/Teaser Promotion',
    description: 'Promote a movie, show, or product launch with teaser content',
    platforms: ['TikTok', 'Instagram', 'YouTube'],
    contentType: 'both'
  },
  {
    id: 'template-2',
    title: 'Product Spotlight',
    description: 'Showcase your product features and benefits',
    platforms: ['TikTok', 'Instagram', 'YouTube'],
    contentType: 'original'
  },
  {
    id: 'template-3',
    title: 'Brand Partnership',
    description: 'Create sponsored content with your brand messaging',
    platforms: ['Instagram', 'YouTube', 'Twitter'],
    contentType: 'both'
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
  const [showQuickStart, setShowQuickStart] = useState<boolean>(false);
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
  const handleCampaignClick = (campaign: Campaign): void => {
    setSelectedCampaign(campaign);
    setShowCampaignDetail(true);
  };

  // Handle saving settings
  const handleSaveSettings = (field: string, value: any): void => {
    setBrandData(prev => ({
      ...prev,
      [field]: value
    }));
    setSuccessMessage(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Handle toggling 2FA
  const handleToggle2FA = (): void => {
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
  const handleCreateCampaign = (): void => {
    router.push('/brand/campaigns/create');
  };
  
  // Start a campaign from a template
  const handleStartFromTemplate = (templateId: string): void => {
    localStorage.setItem('selectedTemplate', templateId);
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
  const handleLogout = (): void => {
    localStorage.removeItem('isBrandLoggedIn');
    localStorage.removeItem('brandData');
    router.push('/');
  };

  // Custom tooltip for charts
  const CustomTooltip: React.FC<TooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 border border-gray-700 bg-black rounded-lg shadow-lg" role="tooltip">
          <p className="text-white font-bold mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} className="text-sm" style={{ color: entry.color || '#FFFFFF' }}>
              {entry.name}: {entry.value} {entry.name === 'views' ? 'M' : entry.unit || ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  // Overview view with improved active campaigns styling and accessibility
  const renderOverview = () => (
    <div className="space-y-8">
      {/* Create Campaign CTA at top for immediate visibility */}
      <div className="p-6 rounded-lg border border-red-500 bg-red-900/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-start gap-4">
          <Zap className="h-8 w-8 text-red-400 flex-shrink-0" />
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Launch Your Next Campaign</h2>
            <p className="text-gray-300">Reach creators and boost your brand visibility</p>
          </div>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button
            onClick={handleCreateCampaign}
            className="w-full md:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 transition-colors text-white font-bold rounded-lg flex items-center justify-center gap-2"
            aria-label="Create a new campaign"
          >
            <Plus className="h-5 w-5" />
            Create Campaign
          </button>
          <button
            onClick={() => setShowQuickStart(true)}
            className="w-full md:w-auto px-6 py-3 border border-red-500 text-red-400 hover:bg-red-900/20 transition-colors rounded-lg font-bold flex items-center justify-center gap-2"
            aria-label="Use a campaign template"
          >
            <Zap className="h-5 w-5" />
            Quick Start
          </button>
        </div>
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
          <div className="flex items-center mt-2 text-green-400 text-sm">
            <TrendingUp className="h-4 w-4 mr-1" aria-hidden="true" />
            <span>+24% from last period</span>
          </div>
        </div>
        
        <div className="p-6 rounded-lg bg-black/40 border border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-medium">Engagement Rate</h3>
          </div>
          <p className="text-3xl font-bold">4.7%</p>
          <div className="flex items-center mt-2 text-green-400 text-sm">
            <TrendingUp className="h-4 w-4 mr-1" aria-hidden="true" />
            <span>+12% from last period</span>
          </div>
        </div>
        
        <div className="p-6 rounded-lg bg-black/40 border border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="h-5 w-5 text-green-400" />
            <h3 className="text-lg font-medium">Budget Utilization</h3>
          </div>
          <p className="text-3xl font-bold">$4,200</p>
          <p className="text-gray-400 text-sm mt-2">of $10,000 total budget</p>
        </div>
      </section>
      
      {/* Performance Chart */}
      <section aria-labelledby="performance-chart" className="p-6 rounded-lg bg-black/40 border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h3 id="performance-chart" className="text-xl font-bold">Campaign Performance</h3>
          
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
      
      {/* Platform Distribution - Improved */}
      <section aria-labelledby="platform-distribution" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-lg bg-black/40 border border-gray-800">
          <h3 id="platform-distribution" className="text-xl font-bold mb-6">Platform Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-64" aria-label="Pie chart showing distribution of views across platforms">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={platformData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {platformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                  <Legend 
                    layout="vertical" 
                    verticalAlign="middle" 
                    align="right"
                    formatter={(value) => (
                      <span style={{ color: 'white' }}>{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              {platformData.map((platform, index) => (
                <div key={index} className="p-3 bg-black/40 border border-gray-800 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: platform.color }} aria-hidden="true"></div>
                      <p className="font-medium">{platform.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{platform.value}%</p>
                    </div>
                  </div>
                  <div className="mt-2 w-full bg-gray-700 h-1.5 rounded-full" role="progressbar" aria-valuenow={platform.value} aria-valuemin={0} aria-valuemax={100}>
                    <div 
                      className="h-full rounded-full" 
                      style={{ width: `${platform.value}%`, backgroundColor: platform.color }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="p-6 rounded-lg bg-black/40 border border-gray-800">
          <h3 id="active-campaigns" className="text-xl font-bold mb-6">Active Campaigns</h3>
          
          {activeCampaigns.filter(c => c.status === 'active').length > 0 ? (
            <div className="space-y-4">
              {activeCampaigns
                .filter(c => c.status === 'active')
                .map(campaign => (
                  <button 
                    key={campaign.id} 
                    className="p-4 border border-gray-800 rounded-lg bg-black/40 hover:border-gray-600 transition-all w-full text-left focus:outline-none focus:ring-2 focus:ring-red-500"
                    onClick={() => handleCampaignClick(campaign)}
                    aria-label={`View details for ${campaign.title} campaign`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium text-white">{campaign.title}</h4>
                      <StatusBadge status={campaign.status} />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div>
                        <p className="text-xs text-gray-400">Views</p>
                        <p className="font-medium">{(campaign.views / 1000).toLocaleString()}K</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Spent</p>
                        <p className="font-medium">${campaign.spent.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Creators</p>
                        <p className="font-medium">{campaign.creatorCount}</p>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t border-gray-800 flex justify-between items-center mt-1">
                      <div className="flex items-center text-xs text-gray-400">
                        <Calendar className="h-3 w-3 mr-1" aria-hidden="true" />
                        <span>Ends: {new Date(campaign.endDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}</span>
                      </div>
                      <div className="flex text-red-400 text-xs">
                        <span>Details</span>
                        <ArrowUpRight className="h-3 w-3 ml-1" aria-hidden="true" />
                      </div>
                    </div>
                  </button>
                ))
              }
              
              <div className="pt-4 text-center">
                <button
                  onClick={() => setActiveView('campaigns')}
                  className="text-red-400 hover:text-red-300 transition-colors inline-flex items-center"
                  aria-label="View all campaigns"
                >
                  View All Campaigns
                  <ArrowUpRight className="h-4 w-4 ml-1" aria-hidden="true" />
                </button>
              </div>
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
        </div>
      </section>
    </div>
  );
  
  // Campaigns view - Showing all campaigns with filters
  const renderCampaigns = () => (
    <div className="space-y-6">
      {/* Search and filter controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div className="relative w-full sm:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
          </div>
          <label htmlFor="campaign-search" className="sr-only">Search campaigns</label>
          <input
            id="campaign-search"
            type="text"
            className="pl-10 pr-4 py-2 w-full sm:w-64 bg-black/40 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search campaigns"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative">
            <label htmlFor="status-filter" className="sr-only">Filter by status</label>
            <select
              id="status-filter"
              value={campaignFilterStatus}
              onChange={(e) => setCampaignFilterStatus(e.target.value)}
              className="px-3 py-2 bg-black/40 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none pr-8"
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
      
      {/* Campaign Count Summary */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
        <span className="font-medium">{filteredCampaigns.length} campaign{filteredCampaigns.length !== 1 && 's'}</span>
        {searchTerm && <span>matching "{searchTerm}"</span>}
        {campaignFilterStatus !== 'all' && <span>with status: {campaignFilterStatus}</span>}
      </div>
      
      {/* Campaigns grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create Campaign Card - Always first */}
        <div className="p-6 border border-dashed border-gray-700 hover:border-red-500 rounded-lg flex flex-col items-center justify-center text-center space-y-4 bg-black/40 hover:bg-black/60 transition-colors cursor-pointer h-60"
          onClick={handleCreateCampaign}
          tabIndex={0}
          role="button"
          aria-label="Create a new campaign"
          onKeyDown={(e) => e.key === 'Enter' && handleCreateCampaign()}
        >
          <div className="w-16 h-16 rounded-full bg-red-900/20 flex items-center justify-center">
            <Plus className="h-8 w-8 text-red-400" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Create Campaign</h3>
            <p className="text-gray-400">Set up a new campaign to reach creators</p>
          </div>
        </div>
        
        {/* Campaign Cards */}
        {filteredCampaigns.map(campaign => (
          <button
            key={campaign.id}
            className="text-left p-6 rounded-lg bg-black/40 border border-gray-800 hover:border-gray-600 transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 h-60 overflow-hidden"
            onClick={() => handleCampaignClick(campaign)}
            aria-label={`View details of ${campaign.title} campaign`}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-white">{campaign.title}</h3>
              <StatusBadge status={campaign.status} />
            </div>
            
            <div className="space-y-4 mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Budget</p>
                  <p className="text-lg font-bold text-white">${campaign.budget.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Views</p>
                  <p className="text-lg font-bold text-white">
                    {campaign.views > 0 
                      ? (campaign.views / 1000).toLocaleString() + 'K' 
                      : 'Estimated: ' + (campaign.budget / 500 * 1000).toFixed(0) + 'K'}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-400 mb-1">Brief</p>
                <p className="text-sm text-gray-300 line-clamp-2">{campaign.brief}</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-3 border-t border-gray-800">
              <div className="flex flex-wrap gap-2">
                {campaign.platforms.slice(0, 2).map((platform) => (
                  <span
                    key={platform}
                    className="px-2 py-0.5 text-xs bg-white/10 rounded-full text-gray-300"
                  >
                    {platform}
                  </span>
                ))}
                {campaign.platforms.length > 2 && (
                  <span className="px-2 py-0.5 text-xs bg-white/10 rounded-full text-gray-300">
                    +{campaign.platforms.length - 2}
                  </span>
                )}
              </div>
              
              <div className="flex items-center text-sm text-gray-400">
                <Calendar className="h-4 w-4 mr-1" aria-hidden="true" />
                <span>
                  {new Date(campaign.endDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </button>
        ))}
        
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
        {teamMembers.map(member => (
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
          onClick={() => {
            handleSaveSettings('profile', brandData);
          }}
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
          onClick={() => handleSaveSettings('notifications', brandData.notificationPreferences)}
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
      
    return (
      <div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm p-4 z-[100]"
        onClick={() => setShowCampaignDetail(false)}
        role="dialog"
        aria-modal="true"
        aria-labelledby="campaign-detail-title"
      >
        <div
          className="bg-black border border-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-red-500"
            onClick={() => setShowCampaignDetail(false)}
            aria-label="Close campaign details"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
          
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 id="campaign-detail-title" className="text-2xl font-bold mb-2">{campaign.title}</h2>
              <div className="flex items-center gap-3">
                <StatusBadge status={campaign.status} />
                <span className="text-gray-400">Created on {new Date(campaign.startDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Campaign Details</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Status</p>
                      <p className="font-medium">{campaign.status === 'active' ? 'Active' : 
                                               campaign.status === 'draft' ? 'Draft' : 
                                               campaign.status === 'pending-approval' ? 'Pending Approval' : 
                                               campaign.status === 'completed' ? 'Completed' : 'Rejected'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Dates</p>
                      <p className="font-medium">
                        {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400">Content Type</p>
                    <p className="font-medium">
                      {campaign.contentType === 'original' ? 'Original Content' :
                       campaign.contentType === 'repurposed' ? 'Repurposed Content' : 'Both Content Types'}
                    </p>
                    
                    {campaign.contentType === 'both' && campaign.budgetAllocation && (
                      <div className="mt-1 text-sm">
                        <span className="text-gray-400">Budget Split: </span>
                        <span>{campaign.budgetAllocation.original}% Original, </span>
                        <span>{campaign.budgetAllocation.repurposed}% Repurposed</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400">Campaign Brief</p>
                    <p className="bg-black/40 p-4 rounded-lg border border-gray-800 mt-1">
                      {campaign.brief}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400">Platforms</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {campaign.platforms.map(platform => (
                        <span
                          key={platform}
                          className="px-3 py-1 bg-black/40 border border-gray-800 rounded-lg text-sm"
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Creator Guidelines</h3>
                <div className="bg-black/40 border border-gray-800 rounded-lg p-4">
                  <div className="mb-3">
                    <p className="text-sm text-gray-400 mb-2">Required Hashtags</p>
                    <div className="flex flex-wrap gap-2">
                      {campaign.hashtags.map((hashtag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-black/30 border border-gray-700 rounded-full text-sm"
                        >
                          {hashtag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Content Guidelines</p>
                    <ul className="list-disc pl-5 space-y-1 text-gray-300">
                      {campaign.guidelines.map((guideline, index) => (
                        <li key={index}>{guideline}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Campaign Budget</h3>
                <div className="bg-black/40 border border-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-400">Total Budget</p>
                    <p className="font-bold">${campaign.budget.toLocaleString()}</p>
                  </div>
                  
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-400">Spent</p>
                    <p className="font-medium">${campaign.spent.toLocaleString()}</p>
                  </div>
                  
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm text-gray-400">Remaining</p>
                    <p className="font-medium">${(campaign.budget - campaign.spent).toLocaleString()}</p>
                  </div>
                  
                  {/* Budget progress bar */}
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden" 
                       role="progressbar" 
                       aria-valuenow={(campaign.spent / campaign.budget) * 100}
                       aria-valuemin={0}
                       aria-valuemax={100}
                  >
                    <div
                      className="h-full bg-red-500"
                      style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-right mt-1 text-gray-400">
                    {Math.round((campaign.spent / campaign.budget) * 100)}% used
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Creator Payments</h3>
                <div className="bg-black/40 border border-gray-800 rounded-lg p-4">
                  <div className="mb-3">
                    <p className="text-sm text-gray-400">Minimum Views Required</p>
                    <p className="font-medium">{campaign.minViews.toLocaleString()} views</p>
                  </div>
                  
                  <div className="space-y-2">
                    {(campaign.contentType === 'original' || campaign.contentType === 'both') && (
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-400">Original Content Rate</p>
                        <p className="font-medium">${campaign.payoutRate.original} per 1M views</p>
                      </div>
                    )}
                    
                    {(campaign.contentType === 'repurposed' || campaign.contentType === 'both') && (
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-400">Repurposed Content Rate</p>
                        <p className="font-medium">${campaign.payoutRate.repurposed} per 1M views</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">
                  {campaign.status === 'active' || campaign.status === 'completed' 
                    ? 'Campaign Performance' 
                    : 'Estimated Performance'}
                </h3>
                {campaign.status === 'active' || campaign.status === 'completed' ? (
                  <div className="bg-black/40 border border-gray-800 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Total Views</p>
                        <p className="text-xl font-bold">{campaign.views.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Engagement</p>
                        <p className="text-xl font-bold">{campaign.engagement ? campaign.engagement.toLocaleString() : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Creators</p>
                        <p className="text-xl font-bold">{campaign.creatorCount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Engagement Rate</p>
                        <p className="text-xl font-bold">
                          {campaign.views > 0 && campaign.engagement
                            ? `${((campaign.engagement / campaign.views) * 100).toFixed(1)}%` 
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-black/40 border border-gray-800 rounded-lg p-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Estimated Total Views</p>
                      <p className="text-2xl font-bold text-green-400">
                        {viewsEstimate ? (viewsEstimate.totalViews / 1000000).toFixed(1) + 'M' : 'N/A'}
                      </p>
                      
                      {campaign.contentType === 'both' && viewsEstimate && (
                        <div className="text-sm text-gray-400 mt-2">
                          <div className="grid grid-cols-2 gap-4 mt-3">
                            <div>
                              <p className="text-sm">Original Content</p>
                              <p className="font-medium">{(viewsEstimate.originalViews / 1000000).toFixed(1)}M views</p>
                            </div>
                            <div>
                              <p className="text-sm">Repurposed Content</p>
                              <p className="font-medium">{(viewsEstimate.repurposedViews / 1000000).toFixed(1)}M views</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-end gap-3 mt-6 pt-6 border-t border-gray-800">
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
    );
  };
  
  // Quick Start Modal
  const QuickStartModal: React.FC = () => (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm p-4 z-[100]"
      onClick={() => setShowQuickStart(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quickstart-title"
    >
      <div
        className="bg-black border border-gray-800 rounded-lg p-6 w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-red-500"
          onClick={() => setShowQuickStart(false)}
          aria-label="Close quick start dialog"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
        
        <div className="mb-8">
          <h2 id="quickstart-title" className="text-2xl font-bold mb-2">Quick Start Campaign</h2>
          <p className="text-gray-400">Choose a template to jumpstart your campaign creation process</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaignTemplates.map(template => (
            <button
              key={template.id}
              className="p-6 border border-gray-800 hover:border-red-500 rounded-lg bg-black/40 hover:bg-red-900/5 transition-colors text-left flex flex-col focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={() => handleStartFromTemplate(template.id)}
              aria-label={`Start campaign with ${template.title} template`}
            >
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-5 w-5 text-red-400" aria-hidden="true" />
                <h3 className="font-bold">{template.title}</h3>
              </div>
              
              <p className="text-sm text-gray-300 mb-4">{template.description}</p>
              
              <div className="mt-auto">
                <div className="text-xs text-gray-500 mb-1">Recommended platforms:</div>
                <div className="flex flex-wrap gap-1">
                  {template.platforms.map(platform => (
                    <span key={platform} className="px-2 py-0.5 bg-black/30 rounded-full text-xs">{platform}</span>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-center w-full mt-4 pt-4 border-t border-gray-800">
                <span className="text-red-400 text-sm">Start with this template</span>
                <ArrowRight className="h-4 w-4 ml-1 text-red-400" aria-hidden="true" />
              </div>
            </button>
          ))}
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-800 flex justify-end">
          <button
            onClick={handleCreateCampaign}
            className="px-4 py-2 border border-gray-700 rounded-lg hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Create a campaign from scratch"
          >
            Create from scratch instead
          </button>
        </div>
      </div>
    </div>
  );
  
  // Loading indicator component
  const LoadingIndicator: React.FC = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[200]" role="status">
      <div className="p-6 bg-black border border-gray-800 rounded-lg flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mb-4"></div>
        <p className="text-white">Loading...</p>
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-black">
      {/* Loading state */}
      {isLoading && <LoadingIndicator />}
      
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
      
      {/* Quick Start Modal */}
      <AnimatePresence>
        {showQuickStart && (
          <QuickStartModal />
        )}
      </AnimatePresence>
    </div>
  );
};

export default BrandDashboard;