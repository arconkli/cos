import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell, ComposedChart, Area
} from 'recharts';
import {
  DollarSign, Eye, Calendar, TrendingUp, Search, Filter, Sliders,
  ArrowUpRight, Clock, CheckCircle, Settings, Download, FileText,
  Percent, Target, AlertTriangle, X, Users, Zap, BarChart2, Layers,
  ArrowLeft, ArrowRight, Share2, Edit, Pause, Play, Plus, Info, Activity
} from 'lucide-react';

// Type definitions
interface MetricItem {
  id: string;
  label: string;
  value: string;
  trend: string;
  icon: React.ReactNode;
  color: string;
}

interface PerformanceDataPoint {
  date: string;
  views: number;
  engagement: number;
  creators: number;
  ctr: number;
  roi: number;
}

interface ContentPerformanceItem {
  type: string;
  views: number;
  engagement: number;
  creators: number;
  conversion: number;
  roi: number;
}

interface PlatformDataItem {
  platform: string;
  value: number;
  color: string;
}

interface DemographicDataPoint {
  age: string;
  percentage: number;
  male: number;
  female: number;
}

interface Campaign {
  id: number;
  title: string;
  status: string;
  budget: number;
  spent: number;
  views: number;
  engagement: number;
  engagement_rate: number;
  roi: number;
  platforms: string[];
  startDate: string;
  endDate: string;
  reachEstimate: string;
  completedPosts: number;
  pendingPosts: number;
  creatorCount: number;
  conversionRate: number;
  tags: string[];
}

interface ActionModalState {
  show: boolean;
  action: string | null;
  campaign: Campaign | null;
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

// Mock data for a more comprehensive dashboard
const overviewMetrics: MetricItem[] = [
  { id: 'views', label: 'Total Views', value: '12.8M', trend: '+24%', icon: <Eye/>, color: 'blue' },
  { id: 'engagements', label: 'Engagement Rate', value: '4.7%', trend: '+12%', icon: <Target/>, color: 'purple' },
  { id: 'budget', label: 'Budget Utilization', value: '$42.5K', trend: '42%', icon: <DollarSign/>, color: 'green' },
  { id: 'roi', label: 'Campaign ROI', value: '287%', trend: '+15%', icon: <Percent/>, color: 'red' }
];

// Enhanced performance data with more metrics
const performanceData: PerformanceDataPoint[] = [
  { date: 'Jan', views: 1.2, engagement: 0.8, creators: 3, ctr: 1.9, roi: 215 },
  { date: 'Feb', views: 1.8, engagement: 1.2, creators: 5, ctr: 2.1, roi: 225 },
  { date: 'Mar', views: 2.2, engagement: 1.5, creators: 7, ctr: 2.3, roi: 230 },
  { date: 'Apr', views: 3.5, engagement: 2.3, creators: 10, ctr: 2.5, roi: 240 },
  { date: 'May', views: 5.1, engagement: 3.4, creators: 15, ctr: 2.7, roi: 265 },
  { date: 'Jun', views: 7.3, engagement: 4.8, creators: 18, ctr: 3.0, roi: 287 }
];

// Content performance data - more detailed
const contentPerformanceData: ContentPerformanceItem[] = [
  { type: 'Original', views: 7.9, engagement: 4.8, creators: 14, conversion: 4.2, roi: 305 },
  { type: 'Repurposed', views: 3.6, engagement: 3.2, creators: 12, conversion: 3.8, roi: 265 },
  { type: 'User-Generated', views: 1.3, engagement: 1.1, creators: 8, conversion: 5.1, roi: 320 }
];

// Platform distribution data
const platformData: PlatformDataItem[] = [
  { platform: 'TikTok', value: 48, color: '#69C9D0' },
  { platform: 'Instagram', value: 30, color: '#E1306C' },
  { platform: 'YouTube', value: 15, color: '#FF0000' },
  { platform: 'X/Twitter', value: 7, color: '#1DA1F2' }
];

// Demographic data
const demographicData: DemographicDataPoint[] = [
  { age: '13-17', percentage: 15, male: 6, female: 9 },
  { age: '18-24', percentage: 38, male: 17, female: 21 },
  { age: '25-34', percentage: 28, male: 14, female: 14 },
  { age: '35-44', percentage: 12, male: 7, female: 5 },
  { age: '45+', percentage: 7, male: 4, female: 3 }
];

// Active campaigns with more detailed metrics
const activeCampaigns: Campaign[] = [
  {
    id: 1,
    title: "Summer Product Launch",
    status: "active",
    budget: 42500,
    spent: 18200,
    views: 3600000,
    engagement: 172000,
    engagement_rate: 4.8,
    roi: 297,
    platforms: ["TikTok", "Instagram"],
    startDate: "2025-06-01",
    endDate: "2025-07-15",
    reachEstimate: "5.2M - 7.8M",
    completedPosts: 15,
    pendingPosts: 3,
    creatorCount: 12,
    conversionRate: 2.4,
    tags: ["summer", "product-launch"]
  },
  {
    id: 2,
    title: "Brand Awareness Campaign",
    status: "active",
    budget: 28000,
    spent: 12700,
    views: 2100000,
    engagement: 89000,
    engagement_rate: 4.2,
    roi: 267,
    platforms: ["TikTok", "YouTube", "Instagram"],
    startDate: "2025-05-15",
    endDate: "2025-06-30",
    reachEstimate: "3.4M - 4.6M",
    completedPosts: 18,
    pendingPosts: 2,
    creatorCount: 14,
    conversionRate: 1.9,
    tags: ["brand-awareness", "entertainment"]
  },
  {
    id: 3,
    title: "Product Demo Series",
    status: "active",
    budget: 32000,
    spent: 8700,
    views: 1500000,
    engagement: 85000,
    engagement_rate: 5.7,
    roi: 312,
    platforms: ["YouTube", "TikTok"],
    startDate: "2025-06-10",
    endDate: "2025-07-25",
    reachEstimate: "2.8M - 3.5M",
    completedPosts: 8,
    pendingPosts: 6,
    creatorCount: 7,
    conversionRate: 3.1,
    tags: ["product-demo", "tutorials"]
  }
];

// Enhanced tooltip for charts
const CustomTooltip: React.FC<TooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 border border-gray-700 bg-black rounded-lg shadow-lg">
        <p className="font-bold text-white mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm flex items-center gap-1" style={{ color: entry.color || '#FFF' }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
            <span>{entry.name}: {entry.value} {entry.name === 'views' ? 'M' : entry.name === 'roi' ? '%' : ''}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Status Badge Component
interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let bgColor: string = '';
  let textColor: string = '';
  let label: string = '';
  
  switch (status) {
    case 'active':
      bgColor = 'bg-green-900/20';
      textColor = 'text-green-400';
      label = 'ACTIVE';
      break;
    case 'paused':
      bgColor = 'bg-yellow-900/20';
      textColor = 'text-yellow-400';
      label = 'PAUSED';
      break;
    case 'draft':
      bgColor = 'bg-gray-900/20';
      textColor = 'text-gray-400';
      label = 'DRAFT';
      break;
    case 'completed':
      bgColor = 'bg-blue-900/20';
      textColor = 'text-blue-400';
      label = 'COMPLETED';
      break;
    default:
      bgColor = 'bg-gray-900/20';
      textColor = 'text-gray-400';
      label = status.toUpperCase();
  }
  
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {label}
    </span>
  );
};

// Campaign modal for handling actions
interface CampaignActionModalProps {
  action: string | null;
  campaign: Campaign | null;
  onClose: () => void;
  onConfirm: (campaignId: number, action: string) => void;
}

const CampaignActionModal: React.FC<CampaignActionModalProps> = ({ action, campaign, onClose, onConfirm }) => {
  let title = '';
  let content = '';
  let confirmText = '';
  let confirmColor = '';
  
  if (!campaign || !action) return null;
  
  switch (action) {
    case 'pause':
      title = 'Pause Campaign';
      content = `Are you sure you want to pause "${campaign.title}"? This will temporarily stop your campaign from being shown to creators.`;
      confirmText = 'Pause Campaign';
      confirmColor = 'bg-yellow-600 hover:bg-yellow-700';
      break;
    case 'resume':
      title = 'Resume Campaign';
      content = `Are you sure you want to resume "${campaign.title}"? This will make your campaign active again.`;
      confirmText = 'Resume Campaign';
      confirmColor = 'bg-green-600 hover:bg-green-700';
      break;
    case 'delete':
      title = 'Delete Campaign';
      content = `Are you sure you want to delete "${campaign.title}"? This action cannot be undone.`;
      confirmText = 'Delete Campaign';
      confirmColor = 'bg-red-600 hover:bg-red-700';
      break;
    case 'edit':
      title = 'Edit Campaign';
      content = `You are about to edit "${campaign.title}". This will take you to the campaign editor.`;
      confirmText = 'Continue to Editor';
      confirmColor = 'bg-blue-600 hover:bg-blue-700';
      break;
  }
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black border border-gray-800 rounded-lg p-6 w-full max-w-md relative">
        <button 
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>
        
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="mb-6 text-gray-300">{content}</p>
        
        <div className="flex gap-3 justify-end">
          <button 
            className="px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-800"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className={`px-4 py-2 ${confirmColor} text-white rounded-lg`}
            onClick={() => onConfirm(campaign.id, action)}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
const BrandDashboard: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<string>('6M');
  const [activeView, setActiveView] = useState<string>('overview');
  const [actionModal, setActionModal] = useState<ActionModalState>({ show: false, action: null, campaign: null });
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>(activeCampaigns);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [campaignFilterStatus, setCampaignFilterStatus] = useState<string>('all');
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  
  // Handle campaign action confirmation
  const handleConfirmAction = (campaignId: number, action: string): void => {
    // Find the campaign in the state
    const updatedCampaigns = filteredCampaigns.map(campaign => {
      if (campaign.id === campaignId) {
        switch (action) {
          case 'pause':
            return { ...campaign, status: 'paused' };
          case 'resume':
            return { ...campaign, status: 'active' };
          default:
            return campaign;
        }
      }
      return campaign;
    });
    
    // Update campaigns and clear modal
    setFilteredCampaigns(updatedCampaigns);
    setActionModal({ show: false, action: null, campaign: null });
    
    // Show success notification
    setSuccessMessage(`Campaign successfully ${action === 'pause' ? 'paused' : action === 'resume' ? 'resumed' : action === 'delete' ? 'deleted' : 'updated'}`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Handle search and filter
  useEffect(() => {
    let filtered = activeCampaigns;
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(campaign => 
        campaign.title.toLowerCase().includes(term) || 
        campaign.tags.some(tag => tag.toLowerCase().includes(term)) ||
        campaign.platforms.some(platform => platform.toLowerCase().includes(term))
      );
    }
    
    // Apply status filter
    if (campaignFilterStatus !== 'all') {
      filtered = filtered.filter(campaign => campaign.status === campaignFilterStatus);
    }
    
    setFilteredCampaigns(filtered);
  }, [searchTerm, campaignFilterStatus]);

  // Handle campaign action (edit, pause, resume, etc.)
  const handleCampaignAction = (campaign: Campaign, action: string): void => {
    if (action === 'edit') {
      // In a real app this would navigate to the edit page
      window.location.href = `/brand/campaigns/create?edit=${campaign.id}`;
      return;
    }
    
    // Show confirmation modal for other actions
    setActionModal({ show: true, action, campaign });
  };

  // Helper to format numbers as money
  const formatMoney = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Helper to format numbers with K/M suffix
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };
  
  // OVERVIEW SECTION - Enhanced with more metrics and better mobile optimization
  const renderOverview = (): JSX.Element => (
    <div className="space-y-6">
      {/* Create Campaign CTA - Optimized for mobile */}
      <div className="p-4 sm:p-6 rounded-lg border border-red-500 bg-red-900/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-start gap-3">
          <Zap className="h-7 w-7 text-red-400 flex-shrink-0 hidden sm:block" />
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white mb-1">Launch Your Next Campaign</h2>
            <p className="text-sm text-gray-300">Target creators precisely with our AI-powered matching and boost your campaign performance</p>
          </div>
        </div>
        <button
          onClick={() => window.location.href = '/brand/campaigns/create'}
          className="w-full md:w-auto px-4 py-2.5 bg-red-600 hover:bg-red-700 transition-colors text-white font-bold rounded-lg flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <Plus className="h-4 w-4" />
          Create Campaign
        </button>
      </div>
      
      {/* Performance Overview - Enhanced Card Grid for mobile */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {overviewMetrics.map((metric) => (
          <div key={metric.id} className="p-4 rounded-lg bg-black/40 border border-gray-800">
            <div className="flex items-center gap-2 mb-2">
              <div className={`text-${metric.color}-400`}>{metric.icon}</div>
              <h3 className="text-sm font-medium">{metric.label}</h3>
            </div>
            <p className="text-xl sm:text-2xl font-bold">{metric.value}</p>
            <div className="mt-1 flex justify-between items-end">
              <div className="flex items-center text-green-400 text-xs">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>{metric.trend}</span>
              </div>
              {metric.id === 'budget' && (
                <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: metric.trend }}></div>
                </div>
              )}
            </div>
          </div>
        ))}
      </section>
      
      {/* Campaign Performance Chart - Enhanced with metrics toggle */}
      <section className="p-4 sm:p-6 rounded-lg bg-black/40 border border-gray-800">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-blue-400" />
            <span>Campaign Performance</span>
          </h3>
          
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-3 py-1 bg-transparent border border-gray-700 rounded text-sm focus:outline-none focus:border-red-500"
            >
              <option value="1M">Last Month</option>
              <option value="3M">Last 3 Months</option>
              <option value="6M">Last 6 Months</option>
              <option value="1Y">Last Year</option>
            </select>
            
            <select
              className="px-3 py-1 bg-transparent border border-gray-700 rounded text-sm focus:outline-none focus:border-red-500"
            >
              <option value="views">Views</option>
              <option value="engagement">Engagement</option>
              <option value="roi">ROI</option>
              <option value="ctr">CTR</option>
            </select>
          </div>
        </div>
        
        <div className="h-72 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={performanceData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="date" 
                stroke="#9CA3AF" 
                tick={{ fill: '#FFFFFF', fontSize: 12 }}
                tickLine={{ stroke: '#4B5563' }}
                axisLine={{ stroke: '#4B5563' }}
              />
              <YAxis 
                yAxisId="left"
                stroke="#4287f5"
                tick={{ fill: '#FFFFFF', fontSize: 12 }}
                tickLine={{ stroke: '#4B5563' }}
                axisLine={{ stroke: '#4B5563' }}
                tickFormatter={(value) => `${value}M`}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="#FF4444"
                tick={{ fill: '#FFFFFF', fontSize: 12 }}
                tickLine={{ stroke: '#4B5563' }}
                axisLine={{ stroke: '#4B5563' }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="views" 
                name="Views"
                stroke="#4287f5"
                strokeWidth={3}
                dot={{ fill: '#FFFFFF', r: 3 }}
                activeDot={{ r: 6, fill: '#4287f5' }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="roi" 
                name="ROI"
                stroke="#FF4444"
                strokeWidth={3}
                dot={{ fill: '#FFFFFF', r: 3 }}
                activeDot={{ r: 6, fill: '#FF4444' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex flex-wrap items-center justify-center mt-3 gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Views (M)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>ROI (%)</span>
          </div>
        </div>
      </section>
      
      {/* Content Strategy & Platform Distribution - Side by side on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Content Strategy */}
        <section className="p-4 sm:p-6 rounded-lg bg-black/40 border border-gray-800">
          <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
            <Layers className="h-5 w-5 text-red-400" />
            <span>Content Strategy</span>
          </h3>
          
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contentPerformanceData} barSize={36} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="type" stroke="#9CA3AF" tick={{ fill: '#FFFFFF' }} />
                <YAxis stroke="#9CA3AF" tick={{ fill: '#FFFFFF' }} tickFormatter={(value) => `${value}M`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="views" name="Views" fill="#4287f5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="engagement" name="Engagement" fill="#b026ff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mt-3">
            {contentPerformanceData.map((data, index) => (
              <div key={index} className="p-2 sm:p-3 bg-black/40 border border-gray-700 rounded">
                <p className="text-xs text-gray-400 mb-1">{data.type}</p>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                  <span className="text-sm sm:text-base font-bold">{data.views}M</span>
                  <span className="text-xs text-green-400">+{data.roi}%</span>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Platform Distribution */}
        <section className="p-4 sm:p-6 rounded-lg bg-black/40 border border-gray-800">
          <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-yellow-400" />
            <span>Platform Distribution</span>
          </h3>
          
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={platformData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {platformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="w-full md:w-1/2">
              <div className="space-y-2">
                {platformData.map((platform, index) => (
                  <div key={index} className="flex items-center justify-between px-3 py-2 bg-black/40 border border-gray-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: platform.color }}></div>
                      <span>{platform.platform}</span>
                    </div>
                    <span className="font-medium">{platform.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
      
      {/* Audience Demographics - Responsive */}
      <section className="p-4 sm:p-6 rounded-lg bg-black/40 border border-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-400" />
            <span>Audience Demographics</span>
          </h3>
          
          <div className="flex gap-2">
            <select className="bg-transparent border border-gray-700 rounded px-2 py-1 text-xs sm:text-sm focus:outline-none">
              <option value="age">Age</option>
              <option value="gender">Gender</option>
              <option value="location">Location</option>
            </select>
          </div>
        </div>
        
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={demographicData}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
              barSize={20}
              barGap={0}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
              <XAxis type="number" domain={[0, 40]} stroke="#9CA3AF" tick={{ fill: '#FFFFFF' }} />
              <YAxis dataKey="age" type="category" stroke="#9CA3AF" tick={{ fill: '#FFFFFF' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="male" name="Male" stackId="a" fill="#4287f5" />
              <Bar dataKey="female" name="Female" stackId="a" fill="#E1306C" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-3 px-3 py-2 bg-black/30 border border-gray-800 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm">Primary audience:</span>
            <span className="font-medium">18-24 (38%)</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm">Gender ratio:</span>
            <span className="font-medium">48% Male / 52% Female</span>
          </div>
        </div>
      </section>
      
      {/* Active Campaigns - Optimized for mobile */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2">
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
        
        <div className="space-y-4">
          {filteredCampaigns.map((campaign) => (
            <div 
              key={campaign.id} 
              className="p-4 border border-gray-800 rounded-lg bg-black/40 hover:border-gray-600 transition-all"
            >
              <div className="grid grid-cols-1 gap-4">
                {/* Header Row - Mobile Optimized */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
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
                </div>
                
                {/* Metrics Grid - Responsive */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <p className="text-xs text-gray-400">Views</p>
                    <p className="font-medium">{formatNumber(campaign.views)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Engagement</p>
                    <p className="font-medium">{campaign.engagement_rate}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">ROI</p>
                    <p className="font-medium">{campaign.roi}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Creators</p>
                    <p className="font-medium">{campaign.creatorCount}</p>
                  </div>
                </div>
                
                {/* Progress Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Content</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full" 
                          style={{ width: `${(campaign.completedPosts / (campaign.completedPosts + campaign.pendingPosts)) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs">{campaign.completedPosts}/{campaign.completedPosts + campaign.pendingPosts}</span>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons - Mobile Optimized */}
                <div className="flex flex-wrap gap-2 justify-end mt-2">
                  <button
                    onClick={() => handleCampaignAction(campaign, campaign.status === 'active' ? 'pause' : 'resume')}
                    className="px-3 py-1.5 border border-gray-700 hover:bg-white/5 transition-colors rounded text-sm flex items-center justify-center gap-1"
                  >
                    {campaign.status === 'active' ? (
                      <>
                        <Pause className="h-3.5 w-3.5" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5" />
                        Resume
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => handleCampaignAction(campaign, 'edit')}
                    className="px-3 py-1.5 border border-gray-700 hover:bg-white/5 transition-colors rounded text-sm flex items-center justify-center gap-1"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  
                  <button
                    onClick={() => { window.location.href = `/brand/campaign/${campaign.id}`; }}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 transition-colors rounded text-white text-sm flex items-center justify-center gap-1"
                  >
                    View Details
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
  
  // Renders campaign action confirmation modal
  const renderActionModal = (): JSX.Element | null => {
    if (!actionModal.show) return null;
    
    return (
      <CampaignActionModal
        action={actionModal.action}
        campaign={actionModal.campaign}
        onClose={() => setActionModal({ show: false, action: null, campaign: null })}
        onConfirm={handleConfirmAction}
      />
    );
  };
  
  // Success Notification
  const renderSuccessNotification = (): JSX.Element | null => {
    if (!showSuccess) return null;
    
    return (
      <div className="fixed top-4 right-4 z-50 flex items-center bg-green-900/90 border border-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
        <CheckCircle className="h-5 w-5 mr-2" />
        <span>{successMessage}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black p-3 md:p-6">
      {/* Header with title and navigation */}
      <header className="mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-bold">Brand Dashboard</h1>
          
          <div className="flex items-center flex-wrap gap-2">
            {/* Search Box */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                className="pl-10 pr-4 py-2 w-full sm:w-auto bg-transparent border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filter Button */}
            <div className="relative">
              <select
                value={campaignFilterStatus}
                onChange={(e) => setCampaignFilterStatus(e.target.value)}
                className="px-3 py-2 bg-transparent border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none pr-8 text-sm"
              >
                <option value="all">All Campaigns</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="draft">Drafts</option>
                <option value="completed">Completed</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <Filter className="h-4 w-4 text-gray-400" aria-hidden="true" />
              </div>
            </div>
            
            {/* Period Selector & Settings */}
            <button
              className="p-2 border border-gray-800 rounded-lg hover:bg-white/5"
              aria-label="Open dashboard settings"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>
      
      {/* Main content - Only overview */}
      <main>
        {renderOverview()}
      </main>

      {/* Campaign action modal */}
      {renderActionModal()}
      
      {/* Success notification */}
      {renderSuccessNotification()}
    </div>
  );
};

export default BrandDashboard;