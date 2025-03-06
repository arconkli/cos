'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell
} from 'recharts';
import {
  Plus, Search, Eye, DollarSign, TrendingUp, Filter,
  Users, Calendar, ArrowUpRight, Clock, CheckCircle,
  Settings, LogOut, BarChart2, Activity, User, AlertTriangle, X
} from 'lucide-react';

// Sample data for dashboard visualizations
const performanceData = [
  { date: 'Jan', views: 1.2, engagement: 0.8, creators: 3 },
  { date: 'Feb', views: 1.8, engagement: 1.2, creators: 5 },
  { date: 'Mar', views: 2.2, engagement: 1.5, creators: 7 },
  { date: 'Apr', views: 3.5, engagement: 2.3, creators: 10 },
  { date: 'May', views: 5.1, engagement: 3.4, creators: 15 },
  { date: 'Jun', views: 7.3, engagement: 4.8, creators: 18 }
];

const platformData = [
  { name: 'TikTok', value: 45 },
  { name: 'Instagram', value: 30 },
  { name: 'YouTube', value: 20 },
  { name: 'Twitter', value: 5 }
];

const PLATFORM_COLORS = ['#69C9D0', '#E1306C', '#FF0000', '#1DA1F2'];

// Calculate estimated views based on budget and rates
const calculateEstimatedViews = (
  budget: number, 
  originalRate: number, 
  repurposedRate: number, 
  contentType: string, 
  originalAllocation = 70, 
  repurposedAllocation = 30
) => {
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

// TypeScript interfaces
interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'viewer';
  status: 'active' | 'pending';
  avatar?: string;
}

interface Campaign {
  id: string;
  title: string;
  status: 'draft' | 'pending-approval' | 'active' | 'completed' | 'rejected';
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
  payoutRate: {
    original: number;
    repurposed: number;
  };
  budgetAllocation?: {
    original: number;
    repurposed: number;
  };
  minViews: number;
  hashtags: string[];
  guidelines: string[];
}

// Dashboard component
const BrandDashboard: React.FC = () => {
  const router = useRouter();
  const [activeView, setActiveView] = useState<'overview' | 'campaigns' | 'team' | 'settings'>('overview');
  const [timeFilter, setTimeFilter] = useState('6M');
  const [searchTerm, setSearchTerm] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [brandData, setBrandData] = useState({
    companyName: 'Your Brand',
    industry: '',
    logo: null
  });
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'manager' | 'viewer'>('viewer');
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showCampaignDetail, setShowCampaignDetail] = useState(false);
  
  // Sample campaigns
  const [campaigns, setCampaigns] = useState<Campaign[]>([
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
  ]);
  
  // Sample team members
  const [team, setTeam] = useState<TeamMember[]>([
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
  ]);
  
  // Load brand data on component mount
  useEffect(() => {
    const savedBrandData = localStorage.getItem('brandData');
    if (savedBrandData) {
      try {
        const parsedData = JSON.parse(savedBrandData);
        setBrandData(prev => ({
          ...prev,
          companyName: parsedData.companyName || prev.companyName,
          industry: parsedData.industry || prev.industry
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
  
  // Filtered campaigns based on search term
  const filteredCampaigns = useMemo(() => {
    if (!searchTerm) return campaigns;
    
    const term = searchTerm.toLowerCase();
    return campaigns.filter(campaign => 
      campaign.title.toLowerCase().includes(term) ||
      campaign.status.toLowerCase().includes(term) ||
      campaign.platforms.some(platform => platform.toLowerCase().includes(term))
    );
  }, [campaigns, searchTerm]);
  
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('isBrandLoggedIn');
    localStorage.removeItem('brandData');
    router.push('/');
  };
  
  // Handle team member invitation
  const handleInviteMember = () => {
    if (!inviteEmail || !inviteEmail.includes('@')) return;
    
    // Add new pending team member
    const newMember: TeamMember = {
      id: `tmp-${Date.now()}`,
      name: inviteEmail.split('@')[0], // Temporary name from email
      email: inviteEmail,
      role: inviteRole,
      status: 'pending'
    };
    
    setTeam([...team, newMember]);
    setInviteEmail('');
    setShowInviteForm(false);
  };
  
  // Handle removing a team member
  const handleRemoveTeamMember = (id: string) => {
    setTeam(team.filter(member => member.id !== id));
  };
  
  // Handle creating a new campaign
  const handleCreateCampaign = () => {
    router.push('/brand/campaigns/create');
  };
  
  // Handle campaign detail view
  const handleCampaignClick = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowCampaignDetail(true);
  };
  
  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 border border-gray-700 bg-black rounded">
          <p className="text-white font-bold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color || '#FFF' }}>
              {entry.name}: {entry.value} {entry.name === 'views' ? 'M' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  // Campaign Status Badge component
  const StatusBadge = ({ status }: { status: Campaign['status'] }) => {
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
    }
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {label}
      </span>
    );
  };
  
  // Overview view
  const renderOverview = () => (
    <div className="space-y-8">
      {/* Performance Overview */}
      <section aria-labelledby="performance-overview" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-lg bg-black/40 border border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-medium">Total Views</h3>
          </div>
          <p className="text-3xl font-bold">1.2M</p>
          <div className="flex items-center mt-2 text-green-400 text-sm">
            <TrendingUp className="h-4 w-4 mr-1" />
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
            <TrendingUp className="h-4 w-4 mr-1" />
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
          <h3 className="text-xl font-bold">Campaign Performance</h3>
          
          <div className="flex items-center gap-2">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-3 py-1 bg-transparent border border-gray-700 rounded text-sm"
            >
              <option value="1M">Last Month</option>
              <option value="3M">Last 3 Months</option>
              <option value="6M">Last 6 Months</option>
              <option value="1Y">Last Year</option>
            </select>
          </div>
        </div>
        
        <div className="h-80">
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
      
      {/* Platform Distribution */}
      <section aria-labelledby="platform-distribution" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-lg bg-black/40 border border-gray-800">
          <h3 className="text-xl font-bold mb-6">Platform Distribution</h3>
          <div className="h-64">
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
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PLATFORM_COLORS[index % PLATFORM_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="p-6 rounded-lg bg-black/40 border border-gray-800">
          <h3 className="text-xl font-bold mb-6">Active Campaigns</h3>
          
          {campaigns.filter(c => c.status === 'active').length > 0 ? (
            <div className="space-y-4">
              {campaigns
                .filter(c => c.status === 'active')
                .map(campaign => (
                  <div key={campaign.id} className="p-4 border border-gray-800 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium">{campaign.title}</h4>
                      <StatusBadge status={campaign.status} />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-400">Views</p>
                        <p className="font-medium">{campaign.views.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Budget Used</p>
                        <p className="font-medium">${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCampaignClick(campaign)}
                      className="mt-3 text-red-400 text-sm flex items-center"
                    >
                      View Details <ArrowUpRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                ))
              }
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 border border-dashed border-gray-700 rounded-lg">
              <AlertTriangle className="h-12 w-12 text-gray-500 mb-3" />
              <p className="text-center text-gray-400">No active campaigns</p>
              <button
                onClick={handleCreateCampaign}
                className="mt-4 px-4 py-2 bg-red-600 rounded-lg text-white"
              >
                Create Campaign
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
  
  // Campaigns view - IMPROVED VERSION
  const renderCampaigns = () => {
    // Calculate estimated views for each campaign
    const campaignsWithEstimatedViews = filteredCampaigns.map(campaign => {
      const viewEstimate = campaign.status === 'draft' || campaign.status === 'pending-approval' 
        ? calculateEstimatedViews(
            campaign.budget,
            campaign.payoutRate.original,
            campaign.payoutRate.repurposed || 0,
            campaign.contentType,
            campaign.budgetAllocation?.original || 70,
            campaign.budgetAllocation?.repurposed || 30
          )
        : null;
        
      return {
        ...campaign,
        estimatedViews: viewEstimate ? viewEstimate.totalViews : null
      };
    });
  
    return (
      <div className="space-y-6">
        {/* Search and filter controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
          <div className="relative w-full sm:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 w-full sm:w-64 bg-black/40 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              className="flex items-center gap-2 px-3 py-2 bg-black/40 border border-gray-800 rounded-lg"
            >
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>
            
            <button
              onClick={handleCreateCampaign}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 transition-colors rounded-lg text-white font-medium"
            >
              <Plus className="h-4 w-4" />
              <span>New Campaign</span>
            </button>
          </div>
        </div>
  
        {/* Campaign Count Summary */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <span className="font-medium">{filteredCampaigns.length} campaign{filteredCampaigns.length !== 1 && 's'}</span>
          {searchTerm && <span>matching "{searchTerm}"</span>}
        </div>
        
        {/* Campaign grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {campaignsWithEstimatedViews.map(campaign => (
            <button
              key={campaign.id}
              className="text-left p-6 rounded-lg bg-black/40 border border-gray-800 hover:border-gray-700 transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              onClick={() => handleCampaignClick(campaign)}
            >
              {/* Header - Title and Status */}
              <div className="flex justify-between items-start mb-5">
                <h3 className="text-xl font-bold text-white">{campaign.title}</h3>
                <StatusBadge status={campaign.status} />
              </div>
              
              {/* Primary Stats */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-5 p-4 rounded-lg bg-black/30 border border-gray-800">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Budget</p>
                  <p className="text-lg font-bold text-white">${campaign.budget.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Spent</p>
                  <div className="flex flex-col">
                    <p className="text-lg font-bold text-white">${campaign.spent.toLocaleString()}</p>
                    <div className="w-full bg-gray-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div 
                        className="bg-red-500 h-full rounded-full" 
                        style={{ width: `${Math.min(100, (campaign.spent / campaign.budget) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">
                    {campaign.status === 'active' ? 'Current Views' : 'Est. Total Views'}
                  </p>
                  <p className="text-lg font-bold text-white">
                    {campaign.status === 'active' ? 
                      campaign.views.toLocaleString() : 
                      campaign.estimatedViews ? 
                        `${(campaign.estimatedViews / 1000000).toFixed(1)}M` : 
                        'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Creators</p>
                  <p className="text-lg font-bold text-white">{campaign.creatorCount}</p>
                </div>
              </div>
              
              {/* Campaign Type */}
              <div className="mb-5">
                <p className="text-sm text-gray-400 mb-1">Content Type</p>
                <div className="flex flex-wrap gap-2">
                  {campaign.contentType === 'original' && (
                    <span className="px-3 py-1 bg-green-900/20 text-green-400 rounded-full text-xs font-medium">
                      Original Content
                    </span>
                  )}
                  {campaign.contentType === 'repurposed' && (
                    <span className="px-3 py-1 bg-blue-900/20 text-blue-400 rounded-full text-xs font-medium">
                      Repurposed Content
                    </span>
                  )}
                  {campaign.contentType === 'both' && (
                    <span className="px-3 py-1 bg-purple-900/20 text-purple-400 rounded-full text-xs font-medium">
                      Original & Repurposed
                    </span>
                  )}
                </div>
              </div>
              
              {/* Footer - Platforms and Date */}
              <div className="flex justify-between items-center pt-3 border-t border-gray-800">
                <div className="flex flex-wrap gap-2">
                  {campaign.platforms.slice(0, 2).map(platform => (
                    <span
                      key={platform}
                      className="px-2 py-1 bg-white/5 rounded-full text-xs"
                    >
                      {platform}
                    </span>
                  ))}
                  {campaign.platforms.length > 2 && (
                    <span className="px-2 py-1 bg-white/5 rounded-full text-xs">
                      +{campaign.platforms.length - 2}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center text-sm text-gray-400">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>
                    Ends: {new Date(campaign.endDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
        
        {filteredCampaigns.length === 0 && (
          <div className="p-12 flex flex-col items-center justify-center text-center border border-dashed border-gray-700 rounded-lg">
            <AlertTriangle className="h-12 w-12 text-gray-600 mb-4" />
            <h3 className="text-xl font-medium text-gray-400 mb-2">No campaigns found</h3>
            <p className="text-gray-500 mb-6 max-w-md">
              {searchTerm ? 
                `No campaigns matching "${searchTerm}". Try another search term or clear your search.` : 
                "You haven't created any campaigns yet. Get started by creating your first campaign."}
            </p>
            <button
              onClick={handleCreateCampaign}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 transition-colors rounded-lg text-white font-medium"
            >
              <Plus className="h-4 w-4 inline mr-2" />
              Create Campaign
            </button>
          </div>
        )}
      </div>
    );
  };
  
  // Team management view
  const renderTeam = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Team Members</h2>
        
        <button
          onClick={() => setShowInviteForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 transition-colors rounded-lg text-white"
        >
          <Plus className="h-4 w-4" />
          <span>Invite Member</span>
        </button>
      </div>
      
      {showInviteForm && (
        <div className="p-6 bg-black/40 border border-gray-800 rounded-lg mb-6">
          <h3 className="text-lg font-medium mb-4">Invite Team Member</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="inviteEmail" className="block text-sm text-gray-400 mb-1">Email Address</label>
              <input
                id="inviteEmail"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full p-3 bg-transparent border border-gray-700 rounded-lg focus:border-red-500 focus:outline-none"
                placeholder="colleague@yourbrand.com"
              />
            </div>
            
            <div>
              <label htmlFor="inviteRole" className="block text-sm text-gray-400 mb-1">Role</label>
              <select
                id="inviteRole"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as 'manager' | 'viewer')}
                className="w-full p-3 bg-transparent border border-gray-700 rounded-lg focus:border-red-500 focus:outline-none"
              >
                <option value="manager">Campaign Manager</option>
                <option value="viewer">Viewer (Reports Only)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Managers can create and edit campaigns. Viewers can only view reports and performance data.
              </p>
            </div>
            
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowInviteForm(false)}
                className="px-4 py-2 border border-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleInviteMember}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 transition-colors rounded-lg text-white"
              >
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        {team.map(member => (
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
                  onClick={() => handleRemoveTeamMember(member.id)}
                  className="ml-auto px-3 py-1 border border-gray-700 rounded-lg text-sm hover:bg-red-900/10 hover:border-red-500 hover:text-red-400 transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
  // Add campaign details section to the modal
  const renderCampaignDetailModal = () => {
    if (!selectedCampaign) return null;
    
    // Calculate estimated views
    const viewsEstimate = calculateEstimatedViews(
      selectedCampaign.budget - selectedCampaign.spent,
      selectedCampaign.payoutRate.original,
      selectedCampaign.payoutRate.repurposed,
      selectedCampaign.contentType,
      selectedCampaign.budgetAllocation?.original || 70,
      selectedCampaign.budgetAllocation?.repurposed || 30
    );
    
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 z-[100]"
        onClick={() => setShowCampaignDetail(false)}
      >
        <div
          className="bg-black border border-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{selectedCampaign.title}</h2>
                <StatusBadge status={selectedCampaign.status} />
              </div>
              <p className="text-gray-400">Created on {new Date(selectedCampaign.startDate).toLocaleDateString()}</p>
            </div>
            <button
              onClick={() => setShowCampaignDetail(false)}
              className="p-2 hover:bg-white/10 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Campaign Details</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Status</p>
                      <p className="font-medium">{selectedCampaign.status === 'active' ? 'Active' : 
                                               selectedCampaign.status === 'draft' ? 'Draft' : 
                                               selectedCampaign.status === 'pending-approval' ? 'Pending Approval' : 
                                               selectedCampaign.status === 'completed' ? 'Completed' : 'Rejected'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Dates</p>
                      <p className="font-medium">
                        {new Date(selectedCampaign.startDate).toLocaleDateString()} - {new Date(selectedCampaign.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400">Content Type</p>
                    <p className="font-medium">
                      {selectedCampaign.contentType === 'original' ? 'Original Content' :
                       selectedCampaign.contentType === 'repurposed' ? 'Repurposed Content' : 'Both Content Types'}
                    </p>
                    
                    {selectedCampaign.contentType === 'both' && selectedCampaign.budgetAllocation && (
                      <div className="mt-1 text-sm">
                        <span className="text-gray-400">Budget Split: </span>
                        <span>{selectedCampaign.budgetAllocation.original}% Original, </span>
                        <span>{selectedCampaign.budgetAllocation.repurposed}% Repurposed</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400">Campaign Brief</p>
                    <p className="bg-black/40 p-4 rounded-lg border border-gray-800 mt-1">
                      {selectedCampaign.brief}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400">Platforms</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedCampaign.platforms.map(platform => (
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
                      {selectedCampaign.hashtags.map((hashtag, index) => (
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
                      {selectedCampaign.guidelines.map((guideline, index) => (
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
                    <p className="font-bold">${selectedCampaign.budget.toLocaleString()}</p>
                  </div>
                  
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-400">Spent</p>
                    <p className="font-medium">${selectedCampaign.spent.toLocaleString()}</p>
                  </div>
                  
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm text-gray-400">Remaining</p>
                    <p className="font-medium">${(selectedCampaign.budget - selectedCampaign.spent).toLocaleString()}</p>
                  </div>
                  
                  {/* Budget progress bar */}
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500"
                      style={{ width: `${(selectedCampaign.spent / selectedCampaign.budget) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-right mt-1 text-gray-400">
                    {Math.round((selectedCampaign.spent / selectedCampaign.budget) * 100)}% used
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Creator Payments</h3>
                <div className="bg-black/40 border border-gray-800 rounded-lg p-4">
                  <div className="mb-3">
                    <p className="text-sm text-gray-400">Minimum Views Required</p>
                    <p className="font-medium">{selectedCampaign.minViews.toLocaleString()} views</p>
                  </div>
                  
                  <div className="space-y-2">
                    {(selectedCampaign.contentType === 'original' || selectedCampaign.contentType === 'both') && (
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-400">Original Content Rate</p>
                        <p className="font-medium">${selectedCampaign.payoutRate.original} per 1M views</p>
                      </div>
                    )}
                    
                    {(selectedCampaign.contentType === 'repurposed' || selectedCampaign.contentType === 'both') && (
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-400">Repurposed Content Rate</p>
                        <p className="font-medium">${selectedCampaign.payoutRate.repurposed} per 1M views</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">
                  {selectedCampaign.status === 'active' || selectedCampaign.status === 'completed' 
                    ? 'Campaign Performance' 
                    : 'Estimated Performance'}
                </h3>
                {selectedCampaign.status === 'active' || selectedCampaign.status === 'completed' ? (
                  <div className="bg-black/40 border border-gray-800 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Total Views</p>
                        <p className="text-xl font-bold">{selectedCampaign.views.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Engagement</p>
                        <p className="text-xl font-bold">{selectedCampaign.engagement.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Creators</p>
                        <p className="text-xl font-bold">{selectedCampaign.creatorCount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Engagement Rate</p>
                        <p className="text-xl font-bold">
                          {selectedCampaign.views > 0 
                            ? `${((selectedCampaign.engagement / selectedCampaign.views) * 100).toFixed(1)}%` 
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
                        {(viewsEstimate.totalViews / 1000000).toFixed(1)}M
                      </p>
                      
                      {selectedCampaign.contentType === 'both' && (
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
            {selectedCampaign.status === 'draft' && (
              <button className="px-4 py-2 bg-red-600 hover:bg-red-700 transition-colors rounded-lg text-white">
                Submit for Approval
              </button>
            )}
            
            {selectedCampaign.status === 'active' && (
              <button className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 transition-colors rounded-lg text-white">
                Pause Campaign
              </button>
            )}
            
            {selectedCampaign.status !== 'completed' && selectedCampaign.status !== 'rejected' && (
              <button className="px-4 py-2 border border-gray-700 hover:bg-white/5 transition-colors rounded-lg">
                Edit Campaign
              </button>
            )}
            
            <button
              onClick={() => setShowCampaignDetail(false)}
              className="px-4 py-2 border border-gray-700 hover:bg-white/5 transition-colors rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Settings view (simplified)
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
                className="w-full p-3 bg-transparent border border-gray-700 rounded-lg focus:border-red-500 focus:outline-none"
                readOnly
              />
            </div>
            
            <div>
              <label htmlFor="industryType" className="block text-sm text-gray-400 mb-1">Industry</label>
              <input
                id="industryType"
                type="text"
                value={brandData.industry}
                className="w-full p-3 bg-transparent border border-gray-700 rounded-lg focus:border-red-500 focus:outline-none"
                readOnly
              />
            </div>
          </div>
        </div>
        
        <button className="mt-6 px-4 py-2 bg-red-600 hover:bg-red-700 transition-colors rounded-lg text-white">
          Edit Profile
        </button>
      </section>
      
      <section className="p-6 rounded-lg bg-black/40 border border-gray-800">
        <h3 className="text-xl font-bold mb-6">Billing & Payment</h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-black/40 border border-gray-800 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-gray-400" />
                <span className="font-medium">Credit Card</span>
              </div>
              <span className="text-xs px-2 py-1 bg-green-900/20 text-green-400 rounded-full">Default</span>
            </div>
            <p className="text-sm text-gray-400">**** **** **** 4242</p>
            <p className="text-xs text-gray-500">Expires 12/25</p>
          </div>
          
          <button className="px-4 py-2 border border-gray-700 hover:bg-white/5 transition-colors rounded-lg">
            Add Payment Method
          </button>
        </div>
      </section>
      
      <section className="p-6 rounded-lg bg-black/40 border border-gray-800">
        <h3 className="text-xl font-bold mb-6 flex items-center text-red-500">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Danger Zone
        </h3>
        
        <div className="space-y-4">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="px-4 py-2 border border-red-500 text-red-500 hover:bg-red-900/20 transition-colors rounded-lg"
          >
            Log Out
          </button>
        </div>
      </section>
    </div>
  );
  
  // Navigation tabs
  const NavTabs = () => (
    <div className="mb-8 flex overflow-x-auto border-b border-gray-800">
      <button
        className={`px-6 py-3 font-medium relative ${activeView === 'overview' ? 'text-white' : 'text-gray-400'}`}
        onClick={() => setActiveView('overview')}
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
      >
        Settings
        {activeView === 'settings' && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"
            layoutId="activeTab"
          />
        )}
      </button>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black bg-opacity-80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-bold">CREATE_OS</h1>
              
              <div className="hidden md:block">
                <p className="text-gray-400 text-sm">
                  Brand Dashboard
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 bg-gray-800 rounded-full flex items-center justify-center font-bold">
                {brandData.companyName.charAt(0).toUpperCase()}
              </div>
              
              <span className="hidden md:block font-medium">{brandData.companyName}</span>
              
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="p-2 hover:bg-white/10 rounded-full"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <NavTabs />
        
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
      
      {/* Logout confirmation modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 z-[100]"
            onClick={() => setShowLogoutConfirm(false)}
          >
            <motion.div
              className="bg-black border border-gray-800 rounded-lg p-6 w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-xl font-bold mb-4">Log Out</h3>
              <p className="mb-6">Are you sure you want to log out of your brand account?</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 border border-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 transition-colors rounded-lg text-white"
                >
                  Log Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Campaign detail modal */}
      <AnimatePresence>
        {showCampaignDetail && renderCampaignDetailModal()}
      </AnimatePresence>
    </div>
  );
};

export default BrandDashboard;