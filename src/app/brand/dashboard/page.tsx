"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  ComposedChart, Area, Cell, PieChart, Pie
} from 'recharts';
import {
  Plus, Search, Eye, DollarSign, TrendingUp, Filter,
  Users, Calendar, ArrowUpRight, Clock, CheckCircle,
  Settings, LogOut, BarChart2, Activity, User, AlertTriangle, X,
  Lock, Mail, Key, Bell, ArrowLeft, ArrowRight, Shield, 
  Zap, HelpCircle, Info, ExternalLink, CreditCard, BarChart as BarChartIcon,
  Layers, FileText, Download, Percent, Target, ChevronDown, ChevronUp, 
  MoreHorizontal, Copy, Archive, Trash2, Repeat, Video, Share2, Globe
} from 'lucide-react';

// Types definitions
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

interface Creator {
  id: string;
  name: string;
  platforms: string[];
  followers: number;
  views: number;
  engagement: number;
  posts: number;
  costPerView: number;
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

// Enhanced content distribution data
const contentDistributionData = [
  { type: 'Original', views: 3.2, engagement: 240000, creators: 8, conversion: 4.2 },
  { type: 'Repurposed', views: 5.6, engagement: 320000, creators: 12, conversion: 3.8 },
  { type: 'Brand-Supplied', views: 1.4, engagement: 105000, creators: 5, conversion: 5.1 }
];

// Campaign performance data for a stacked bar chart
const campaignPerformanceData = [
  { campaign: 'Summer Launch', tiktok: 42, instagram: 28, youtube: 18, twitter: 12 },
  { campaign: 'Holiday Special', tiktok: 35, instagram: 32, youtube: 22, twitter: 11 },
  { campaign: 'Product Reveal', tiktok: 48, instagram: 24, youtube: 15, twitter: 13 },
  { campaign: 'Brand Awareness', tiktok: 38, instagram: 30, youtube: 20, twitter: 12 }
];

// Platform data for ROI visualization
const platformROIData = [
  { platform: 'TikTok', cpv: 3.65, views: 4.2, engagement: 220000, color: '#69C9D0' },
  { platform: 'Instagram', cpv: 4.82, views: 2.8, engagement: 180000, color: '#E1306C' },
  { platform: 'YouTube', cpv: 5.21, views: 1.9, engagement: 95000, color: '#FF0000' },
  { platform: 'X/Twitter', cpv: 6.10, views: 0.9, engagement: 48000, color: '#1DA1F2' }
];

// Sample creators data
const topCreators = [
  { id: 'c1', name: 'Creator Alpha', platforms: ['TikTok', 'Instagram'], followers: 1500000, views: 2400000, engagement: 5.2, posts: 5, costPerView: 3.20 },
  { id: 'c2', name: 'Creator Beta', platforms: ['YouTube', 'TikTok'], followers: 980000, views: 1800000, engagement: 4.8, posts: 4, costPerView: 3.65 },
  { id: 'c3', name: 'Creator Gamma', platforms: ['Instagram', 'YouTube'], followers: 750000, views: 1200000, engagement: 6.1, posts: 3, costPerView: 3.90 },
  { id: 'c4', name: 'Creator Delta', platforms: ['TikTok', 'X'], followers: 620000, views: 980000, engagement: 4.3, posts: 4, costPerView: 4.10 },
  { id: 'c5', name: 'Creator Epsilon', platforms: ['YouTube', 'Instagram'], followers: 540000, views: 820000, engagement: 5.7, posts: 2, costPerView: 3.75 }
];

// Platform colors
const PLATFORM_COLORS = {
  'TikTok': '#69C9D0',
  'Instagram': '#E1306C',
  'YouTube': '#FF0000',
  'X': '#1DA1F2',
  'Twitter': '#1DA1F2'
};

// Generic chart colors
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
  },
  {
    id: '4',
    title: 'Holiday Marketing Blitz',
    status: 'active',
    budget: 15000,
    spent: 8200,
    views: 2700000,
    engagement: 580000,
    platforms: ['TikTok', 'Instagram', 'YouTube'],
    startDate: '2025-05-15',
    endDate: '2025-07-15',
    brief: 'Promote holiday specials and limited-time offers through engaging creator content.',
    creatorCount: 12,
    contentType: 'both',
    payoutRate: {
      original: 550,
      repurposed: 275
    },
    engagement_rate: 5.8,
    completedPosts: 24,
    pendingPosts: 6,
    reachEstimate: '2.8M - 3.5M',
    budgetAllocation: {
      original: 60,
      repurposed: 40
    },
    minViews: 12000,
    hashtags: ['#HolidaySpecial', '#YourBrand'],
    guidelines: ['Show excitement for holiday offers', 'Demonstrate product use', 'Include call to action']
  },
  {
    id: '5',
    title: 'Back to School Campaign',
    status: 'draft',
    budget: 8000,
    spent: 0,
    views: 0,
    engagement: 0,
    platforms: ['TikTok', 'Instagram'],
    startDate: '2025-08-01',
    endDate: '2025-08-31',
    brief: 'Target college students with move-in essentials and dorm room solutions.',
    creatorCount: 0,
    contentType: 'both',
    payoutRate: {
      original: 525,
      repurposed: 275
    },
    engagement_rate: 0,
    completedPosts: 0,
    pendingPosts: 0,
    reachEstimate: '1.2M - 1.8M',
    budgetAllocation: {
      original: 70,
      repurposed: 30
    },
    minViews: 10000,
    hashtags: ['#BackToSchool', '#YourBrand'],
    guidelines: ['Show product utility for students', 'Focus on affordability', 'Highlight space-saving features']
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
  },
  {
    id: '3',
    name: 'Content Coordinator',
    email: 'content@yourbrand.com',
    role: 'viewer',
    status: 'active'
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

// PlatformIcon component
const PlatformIcon = ({ platform }: { platform: string }) => {
  const iconClass = "h-5 w-5";
  
  switch (platform.toLowerCase()) {
    case 'tiktok':
      return (
        <svg className={`${iconClass} text-cyan-400`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
      );
    case 'instagram':
      return <svg className={`${iconClass} text-pink-500`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0z"/>
        <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>;
    case 'youtube':
      return <svg className={`${iconClass} text-red-500`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>;
    case 'twitter':
    case 'x':
      return <svg className={`${iconClass} text-blue-400`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
      </svg>;
    default:
      return <Globe className={`${iconClass} text-gray-400`} />;
  }
};

// CampaignCard component
const CampaignCard: React.FC<{ campaign: Campaign; onClick: () => void }> = ({ campaign, onClick }) => {
  return (
    <div
      className="p-5 border border-gray-800 rounded-lg bg-black/40 hover:border-gray-600 transition-all cursor-pointer"
      onClick={onClick}
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
              <p className="font-medium">{campaign.status === 'active' ? 
                formatNumber(campaign.views) : 
                campaign.reachEstimate || '0'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Engagement</p>
              <p className="font-medium">{campaign.status === 'active' ? 
                formatNumber(campaign.engagement) : 
                '0'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Engagement Rate</p>
              <p className="font-medium">{campaign.engagement_rate ? 
                `${campaign.engagement_rate}%` : 
                '0%'}</p>
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
              <span>${formatMoney(campaign.spent)} spent</span>
              <span className="text-gray-400">${formatMoney(campaign.budget)} total</span>
            </div>
          </div>
          
          <div className="mt-3">
            <p className="text-xs text-gray-400 mb-1">Content</p>
            {campaign.status === 'active' && campaign.completedPosts !== undefined && campaign.pendingPosts !== undefined ? (
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ width: `${(campaign.completedPosts / (campaign.completedPosts + campaign.pendingPosts)) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs">
                  {campaign.completedPosts}/{campaign.completedPosts + campaign.pendingPosts}
                </span>
              </div>
            ) : (
              <p className="text-xs text-gray-400">Not started</p>
            )}
          </div>
        </div>
        
        {/* Column 4: Actions */}
        <div className="lg:col-span-1 flex flex-col justify-between">
          <div>
            <p className="text-xs text-gray-400 mb-1">Reach Estimate</p>
            <p className="font-medium">{campaign.reachEstimate || 'N/A'}</p>
          </div>
          
          <div className="flex flex-col gap-2 mt-auto">
            <button
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 transition-colors rounded text-white text-sm flex items-center justify-center gap-1"
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
            >
              Campaign Details
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
            <button
              className="px-3 py-1.5 border border-gray-700 hover:bg-white/5 transition-colors rounded text-sm flex items-center justify-center gap-1"
              onClick={(e) => {
                e.stopPropagation();
                // Download report functionality would go here
                console.log('Download report for campaign', campaign.id);
              }}
            >
              <Download className="h-3.5 w-3.5" />
              Export Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Campaign Detail Modal Component
const CampaignDetailModal: React.FC<{ 
  campaign: Campaign; 
  onClose: () => void;
}> = ({ campaign, onClose }) => {
  // Handle ESC key for modal close
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 z-[100]"
      onClick={onClose}
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
          onClick={onClose}
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
              <p className="text-sm text-gray-400">Duration</p>
              <p className="text-lg font-medium text-gray-300">
                {new Date(campaign.startDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })} - {new Date(campaign.endDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Campaign Performance */}
          <div className="p-6 bg-black/40 rounded-lg border border-gray-800 space-y-6">
            <h3 className="text-xl font-bold text-white">Campaign Performance</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-4 bg-black/40 rounded-lg border border-gray-800">
                <h4 className="text-sm text-gray-400 mb-1">Views</h4>
                <p className="text-xl font-bold text-white">
                  {campaign.status === 'active' ? formatNumber(campaign.views) : 'N/A'}
                </p>
              </div>
              
              <div className="p-4 bg-black/40 rounded-lg border border-gray-800">
                <h4 className="text-sm text-gray-400 mb-1">Engagement</h4>
                <p className="text-xl font-bold text-white">
                  {campaign.status === 'active' ? formatNumber(campaign.engagement) : 'N/A'}
                </p>
              </div>
              
              <div className="p-4 bg-black/40 rounded-lg border border-gray-800">
                <h4 className="text-sm text-gray-400 mb-1">Engagement Rate</h4>
                <p className="text-xl font-bold text-green-400">
                  {campaign.engagement_rate ? `${campaign.engagement_rate}%` : 'N/A'}
                </p>
              </div>
              
              <div className="p-4 bg-black/40 rounded-lg border border-gray-800">
                <h4 className="text-sm text-gray-400 mb-1">Creators</h4>
                <p className="text-xl font-bold text-white">
                  {campaign.creatorCount || 'N/A'}
                </p>
              </div>
            </div>
            
            {/* Budget Progress */}
            <div className="p-4 bg-black/30 rounded-lg border border-gray-800">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium text-gray-400">Budget Utilization</h4>
                <p className="text-sm font-medium">
                  ${formatMoney(campaign.spent)} of ${formatMoney(campaign.budget)}
                </p>
              </div>
              <div className="w-full h-2.5 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full" 
                  style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-400">
                <span>
                  {Math.round((campaign.spent / campaign.budget) * 100)}% used
                </span>
                <span>
                  ${formatMoney(campaign.budget - campaign.spent)} remaining
                </span>
              </div>
            </div>
          </div>

          {/* Payout Rates */}
          <div className="p-6 bg-black/40 rounded-lg border border-gray-800 space-y-4">
            <h3 className="text-xl font-bold text-white">Payout Rates</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(campaign.contentType === 'original' || campaign.contentType === 'both') && (
                <div className="p-4 bg-black/40 rounded-lg border border-gray-800">
                  <h4 className="font-medium mb-2 text-gray-300">Original Content</h4>
                  <p className="text-xl font-bold text-green-400">${campaign.payoutRate.original} per 1M views</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Content created specifically for this campaign
                  </p>
                </div>
              )}

              {(campaign.contentType === 'repurposed' || campaign.contentType === 'both') && (
                <div className="p-4 bg-black/40 rounded-lg border border-gray-800">
                  <h4 className="font-medium mb-2 text-gray-300">Repurposed Content</h4>
                  <p className="text-xl font-bold text-blue-400">${campaign.payoutRate.repurposed} per 1M views</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Adapted existing content for this campaign
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center p-3 bg-black/40 rounded-lg border border-gray-800">
              <Eye className="h-5 w-5 text-gray-400 mr-3" />
              <span className="text-gray-300">Minimum views for payout: <strong className="text-white">{formatNumber(campaign.minViews)}</strong></span>
            </div>
          </div>

          {/* Guidelines */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Campaign Brief & Guidelines</h3>

            <div className="p-4 bg-black/40 border border-gray-800 rounded-lg">
              <h4 className="font-medium mb-2 text-gray-300">Brief</h4>
              <p className="text-gray-300">{campaign.brief}</p>
              
              <h4 className="font-medium mt-4 mb-2 text-gray-300">Guidelines</h4>
              <ul className="list-disc pl-5 space-y-2">
                {campaign.guidelines.map((guideline, i) => (
                  <li key={i} className="text-gray-300">{guideline}</li>
                ))}
              </ul>
              
              <h4 className="font-medium mt-4 mb-2 text-gray-300">Campaign Hashtags</h4>
              <div className="flex flex-wrap gap-2">
                {campaign.hashtags.map((hashtag) => (
                  <span key={hashtag} className="px-3 py-1 bg-blue-900/20 text-blue-400 rounded-full">
                    {hashtag}
                  </span>
                ))}
              </div>
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
              onClick={onClose}
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

// Helper functions
const formatMoney = (amount: number, minimumFractionDigits = 0, maximumFractionDigits = 0) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount);
};

const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// Confirmation dialog component
const ConfirmationDialog: React.FC<{ 
  title: string; 
  message: string; 
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ title, message, confirmLabel, cancelLabel, onConfirm, onCancel }) => {
  // Handle ESC key for dialog close
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm z-[100] p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      onClick={onCancel}
    >
      <div
        className="p-6 rounded-lg w-full max-w-md bg-black/40 border border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="confirm-title" className="text-xl font-bold mb-4 text-white">{title}</h3>
        <p className="mb-6 text-gray-300">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            className="px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-300 hover:bg-white/5"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main BrandDashboard component
const BrandDashboard: React.FC = () => {
  const router = useRouter();
  const [activeView, setActiveView] = useState<'overview' | 'campaigns' | 'creators' | 'analytics' | 'team' | 'settings'>('overview');
  const [timeFilter, setTimeFilter] = useState<string>('6M');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState<boolean>(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showCampaignDetail, setShowCampaignDetail] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [campaignFilterStatus, setCampaignFilterStatus] = useState<string>('all');
  const [campaignsView, setCampaignsView] = useState<'grid' | 'list'>('list');
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  
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
  
  // Toggle campaign selection
  const toggleCampaignSelection = (campaignId: string) => {
    setSelectedCampaigns(prev => {
      if (prev.includes(campaignId)) {
        return prev.filter(id => id !== campaignId);
      } else {
        return [...prev, campaignId];
      }
    });
  };
  
  // Clear all selected campaigns
  const clearSelectedCampaigns = () => {
    setSelectedCampaigns([]);
  };
  
  // Handle batch actions on selected campaigns
  const handleBatchAction = (action: 'archive' | 'duplicate' | 'delete') => {
    // This would typically call an API
    console.log(`Performing ${action} on campaigns:`, selectedCampaigns);
    
    // Show success message
    setSuccessMessage(`${selectedCampaigns.length} campaign${selectedCampaigns.length !== 1 ? 's' : ''} ${
      action === 'archive' ? 'archived' : 
      action === 'duplicate' ? 'duplicated' : 
      'deleted'
    }`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    
    // Clear selection
    setSelectedCampaigns([]);
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

  // Overview view with improved active campaigns styling and accessibility
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
      
      {/* Enhanced KPI Section */}
      <section aria-labelledby="kpi-overview" className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <h2 id="kpi-overview" className="sr-only">Key Performance Indicators</h2>
        
        {/* Cost Per View KPI */}
        <div className="p-4 bg-black/40 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Cost Per 1K Views</h3>
            <span className="text-xs bg-green-900/20 text-green-400 px-2 py-0.5 rounded-full">-12%</span>
          </div>
          <p className="text-2xl font-bold text-white">$4.82</p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-gray-500">Industry avg: $5.30</p>
            <p className="text-xs text-blue-400">All Platforms</p>
          </div>
        </div>
        
        {/* Engagement Rate KPI */}
        <div className="p-4 bg-black/40 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Engagement Rate</h3>
            <span className="text-xs bg-green-900/20 text-green-400 px-2 py-0.5 rounded-full">+8%</span>
          </div>
          <p className="text-2xl font-bold text-white">4.7%</p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-gray-500">Industry avg: 3.2%</p>
            <p className="text-xs text-blue-400">Across 5 campaigns</p>
          </div>
        </div>
        
        {/* Total Views KPI */}
        <div className="p-4 bg-black/40 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Total Views</h3>
            <span className="text-xs bg-green-900/20 text-green-400 px-2 py-0.5 rounded-full">+24%</span>
          </div>
          <p className="text-2xl font-bold text-white">28.3M</p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-gray-500">Last 30 days: 5.2M</p>
            <p className="text-xs text-blue-400">All Campaigns</p>
          </div>
        </div>
        
        {/* Budget Utilization KPI */}
        <div className="p-4 bg-black/40 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Budget Utilization</h3>
            <span className="text-xs bg-gray-900/20 text-gray-400 px-2 py-0.5 rounded-full">42%</span>
          </div>
          <p className="text-2xl font-bold text-white">$12,400</p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-gray-500">of $30,000 total</p>
            <p className="text-xs text-blue-400">Active Campaigns</p>
          </div>
        </div>
      </section>
      
      {/* Action Center */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-4 bg-black/40 border border-gray-800 rounded-lg">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <button 
              onClick={handleCreateCampaign}
              className="w-full p-2 bg-red-600 hover:bg-red-700 transition-colors rounded-lg text-white flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Campaign
            </button>
            <button 
              onClick={() => setActiveView('campaigns')}
              className="w-full p-2 bg-black/60 border border-gray-700 hover:border-gray-600 transition-colors rounded-lg text-white flex items-center justify-center gap-2"
            >
              <Eye className="h-4 w-4" />
              View All Campaigns
            </button>
          </div>
        </div>
        
        <div className="p-4 bg-black/40 border border-gray-800 rounded-lg">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Campaign Health</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Content Submissions</span>
              <span className="text-green-400">12 New</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Approval Pending</span>
              <span className="text-yellow-400">5 Items</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Budget Utilization</span>
              <span>42%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Active Creators</span>
              <span>20</span>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-black/40 border border-gray-800 rounded-lg">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Optimization Tips</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Zap className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm">Increase budget allocation for TikTok to improve ROI by ~15%</p>
            </div>
            <div className="flex items-start gap-2">
              <Zap className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm">Consider repurposed content for higher engagement rates</p>
            </div>
            <div className="flex items-start gap-2">
              <Zap className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm">5 new creators match your campaign criteria</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Platform ROI Comparison */}
      <section className="p-6 bg-black/40 border border-gray-800 rounded-lg mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-400" />
            Platform ROI Comparison
          </h3>
          <select 
            className="bg-transparent border border-gray-700 rounded p-1 text-sm"
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
          >
            <option value="30D">Last 30 Days</option>
            <option value="3M">Last 3 Months</option>
            <option value="6M">Last 6 Months</option>
          </select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {platformROIData.map(platform => (
            <div key={platform.platform} className="p-4 bg-black/20 border border-gray-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <PlatformIcon platform={platform.platform} />
                <h4 className="text-sm font-medium">{platform.platform}</h4>
              </div>
              <p className="text-xl font-bold text-white">${platform.cpv.toFixed(2)}</p>
              <p className="text-xs text-gray-400">Cost per 1K views</p>
              <div className="w-full h-1.5 bg-gray-800 rounded-full mt-2">
                <div 
                  className="h-full rounded-full"
                  style={{ 
                    width: `${Math.max(30, 100 - (platform.cpv - 3) * 25)}%`,
                    backgroundColor: platform.color 
                  }}
                ></div>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs">{platform.views.toFixed(1)}M views</span>
                <span className="text-xs text-green-400">
                  {(platform.engagement / platform.views / 10000).toFixed(1)}% eng.
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 bg-black/20 border border-gray-800 rounded-lg mt-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-300">
              <span className="font-medium">Platform Insights:</span> TikTok is currently your best performing platform with the lowest cost per view and highest engagement rates. Consider allocating more budget to TikTok campaigns for optimal ROI.
            </p>
          </div>
        </div>
      </section>
      
      {/* Top Performing Creators */}
      <section className="p-6 bg-black/40 border border-gray-800 rounded-lg mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-400" />
            Top Performing Creators
          </h3>
          <button 
            className="text-sm text-red-400 flex items-center gap-1"
            onClick={() => setActiveView('creators')}
          >
            View All <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-2 text-xs text-gray-400 font-medium">Creator</th>
                <th className="text-right py-2 text-xs text-gray-400 font-medium">Platforms</th>
                <th className="text-right py-2 text-xs text-gray-400 font-medium">Views</th>
                <th className="text-right py-2 text-xs text-gray-400 font-medium">Eng. Rate</th>
                <th className="text-right py-2 text-xs text-gray-400 font-medium">CPV</th>
                <th className="text-right py-2 text-xs text-gray-400 font-medium">Posts</th>
              </tr>
            </thead>
            <tbody>
              {topCreators.slice(0, 3).map((creator) => (
                <tr key={creator.id} className="border-b border-gray-800 hover:bg-white/5">
                  <td className="py-3 text-white font-medium">{creator.name}</td>
                  <td className="py-3 text-right">
                    <div className="flex justify-end gap-1">
                      {creator.platforms.map(platform => (
                        <div key={platform} className="inline-block">
                          <PlatformIcon platform={platform} />
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 text-right">{formatNumber(creator.views)}</td>
                  <td className="py-3 text-right text-green-400">{creator.engagement.toFixed(1)}%</td>
                  <td className="py-3 text-right">${creator.costPerView.toFixed(2)}</td>
                  <td className="py-3 text-right">{creator.posts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      
      {/* Content Type Effectiveness */}
      <section className="p-6 bg-black/40 border border-gray-800 rounded-lg mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Layers className="h-5 w-5 text-cyan-400" />
            Content Type Effectiveness
          </h3>
          <select 
            className="bg-transparent border border-gray-700 rounded p-1 text-sm"
            defaultValue="engagement"
          >
            <option value="engagement">By Engagement</option>
            <option value="views">By Views</option>
            <option value="roi">By ROI</option>
          </select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contentDistributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                  dataKey="type"
                  stroke="#9CA3AF"
                  tick={{ fill: '#FFFFFF' }}
                />
                <YAxis
                  stroke="#9CA3AF"
                  tick={{ fill: '#FFFFFF' }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="conversion" 
                  name="Engagement Rate" 
                  unit="%" 
                  radius={[4, 4, 0, 0]}
                >
                  {contentDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex flex-col justify-between">
            <div className="space-y-4">
              {contentDistributionData.map((item, index) => (
                <div key={index} className="p-3 bg-black/20 border border-gray-800 rounded-lg">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{item.type} Content</h4>
                    <span 
                      className="text-sm" 
                      style={{ color: COLORS[index % COLORS.length] }}
                    >
                      {item.conversion}% engagement
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
                    <div>
                      <p className="text-gray-400">Views</p>
                      <p>{item.views}M</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Creators</p>
                      <p>{item.creators}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Engagement</p>
                      <p>{formatNumber(item.engagement)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <p className="text-sm text-gray-300 mt-2">
              <span className="font-medium">Insight:</span> Brand-supplied content has the highest engagement rate at 5.1%, while repurposed content drives the most views at 5.6M.
            </p>
          </div>
        </div>
      </section>
      
      {/* Active Campaigns - Improved with more data and better layout */}
      <section aria-labelledby="active-campaigns">
        <div className="flex justify-between items-center mb-6">
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
              .slice(0, 2) // Only show 2 campaigns on overview
              .map(campaign => (
                <CampaignCard 
                  key={campaign.id}
                  campaign={campaign}
                  onClick={() => handleCampaignClick(campaign)}
                />
              ))}
              
            {activeCampaigns.filter(c => c.status === 'active').length > 2 && (
              <button 
                onClick={() => setActiveView('campaigns')}
                className="w-full p-4 border border-dashed border-gray-700 hover:border-gray-500 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>{activeCampaigns.filter(c => c.status === 'active').length - 2} more active campaigns</span>
              </button>
            )}
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
      
      {/* Campaign Count and View Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="font-medium">{filteredCampaigns.length} campaign{filteredCampaigns.length !== 1 && 's'}</span>
          {searchTerm && <span>matching "{searchTerm}"</span>}
          {campaignFilterStatus !== 'all' && <span>with status: {campaignFilterStatus}</span>}
        </div>
        
        <div className="flex items-center gap-3">
          {/* Batch Actions (visible when campaigns are selected) */}
          {selectedCampaigns.length > 0 && (
            <div className="flex items-center gap-2 bg-black/60 border border-gray-700 rounded-lg p-1">
              <span className="text-xs text-gray-400 ml-2">{selectedCampaigns.length} selected</span>
              
              <button 
                className="p-1.5 rounded hover:bg-white/10 transition-colors" 
                onClick={() => handleBatchAction('duplicate')}
                title="Duplicate selected"
              >
                <Copy className="h-4 w-4 text-gray-300" />
              </button>
              
              <button 
                className="p-1.5 rounded hover:bg-white/10 transition-colors" 
                onClick={() => handleBatchAction('archive')}
                title="Archive selected"
              >
                <Archive className="h-4 w-4 text-gray-300" />
              </button>
              
              <button 
                className="p-1.5 rounded hover:bg-white/10 transition-colors" 
                onClick={() => handleBatchAction('delete')}
                title="Delete selected"
              >
                <Trash2 className="h-4 w-4 text-red-400" />
              </button>
              
              <button 
                className="p-1.5 rounded hover:bg-white/10 transition-colors" 
                onClick={clearSelectedCampaigns}
                title="Clear selection"
              >
                <X className="h-4 w-4 text-gray-300" />
              </button>
            </div>
          )}
          
          {/* View Toggle */}
          <div className="flex items-center bg-black/40 border border-gray-800 rounded-lg overflow-hidden">
            <button
              className={`p-2 ${campaignsView === 'list' ? 'bg-gray-800 text-white' : 'text-gray-400'}`}
              onClick={() => setCampaignsView('list')}
              aria-label="List view"
              aria-pressed={campaignsView === 'list'}
            >
              <Layers className="h-4 w-4" />
            </button>
            <button
              className={`p-2 ${campaignsView === 'grid' ? 'bg-gray-800 text-white' : 'text-gray-400'}`}
              onClick={() => setCampaignsView('grid')}
              aria-label="Grid view"
              aria-pressed={campaignsView === 'grid'}
            >
              <BarChart2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Enhanced Campaign Table for List View */}
      {campaignsView === 'list' && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="w-8 p-3">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      className="rounded border-gray-700 text-red-500 focus:ring-red-500"
                      checked={selectedCampaigns.length === filteredCampaigns.length && filteredCampaigns.length > 0}
                      onChange={() => {
                        if (selectedCampaigns.length === filteredCampaigns.length) {
                          setSelectedCampaigns([]);
                        } else {
                          setSelectedCampaigns(filteredCampaigns.map(c => c.id));
                        }
                      }}
                    />
                  </div>
                </th>
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
                  className={`border-b border-gray-800 hover:bg-white/5 transition-colors ${
                    selectedCampaigns.includes(campaign.id) ? 'bg-red-900/10' : ''
                  }`}
                  onClick={() => toggleCampaignSelection(campaign.id)}
                >
                  <td className="p-3">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        className="rounded border-gray-700 text-red-500 focus:ring-red-500"
                        checked={selectedCampaigns.includes(campaign.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleCampaignSelection(campaign.id);
                        }}
                      />
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-col">
                      <button 
                        className="font-medium text-white text-left hover:text-red-400 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCampaignClick(campaign);
                        }}
                      >
                        {campaign.title}
                      </button>
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
                        <div className="font-medium">${formatMoney(campaign.spent)}</div>
                        <div className="text-xs text-gray-400">of ${formatMoney(campaign.budget)}</div>
                        <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden mt-1 ml-auto">
                          <div 
                            className="h-full bg-green-500 rounded-full" 
                            style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ) : (
                      <span>${formatMoney(campaign.budget)}</span>
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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCampaignClick(campaign);
                        }}
                        className="p-1.5 bg-black/40 border border-gray-700 rounded hover:bg-white/5 transition-colors"
                        aria-label={`View details for ${campaign.title}`}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Edit functionality would go here
                          console.log('Edit campaign', campaign.id);
                        }}
                        className="p-1.5 bg-black/40 border border-gray-700 rounded hover:bg-white/5 transition-colors"
                        aria-label={`Edit ${campaign.title}`}
                      >
                        <FileText className="h-4 w-4" />
                      </button>
                      
                      {campaign.status === 'active' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Download report functionality would go here
                            console.log('Download report for campaign', campaign.id);
                          }}
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
                <td colSpan={8} className="p-3">
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
      )}
      
      {/* Grid View for Campaigns */}
      {campaignsView === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => (
            <div 
              key={campaign.id} 
              className={`border border-gray-800 rounded-lg bg-black/40 hover:border-gray-600 transition-all overflow-hidden ${
                selectedCampaigns.includes(campaign.id) ? 'ring-2 ring-red-500' : ''
              }`}
              onClick={() => toggleCampaignSelection(campaign.id)}
            >
              <div className="p-4 relative">
                <div className="absolute top-3 right-3">
                  <input
                    type="checkbox"
                    className="rounded border-gray-700 text-red-500 focus:ring-red-500"
                    checked={selectedCampaigns.includes(campaign.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleCampaignSelection(campaign.id);
                    }}
                  />
                </div>
                
                <div className="mb-4 pr-6">
                  <div className="flex items-center gap-2 mb-2">
                    <StatusBadge status={campaign.status} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    <button 
                      className="hover:text-red-400 transition-colors text-left"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCampaignClick(campaign);
                      }}
                    >
                      {campaign.title}
                    </button>
                  </h3>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {campaign.platforms.map(platform => (
                      <span 
                        key={platform}
                        className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-gray-800 text-gray-300"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-2">{campaign.brief}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-400">Budget</p>
                    <p className="font-medium">${formatMoney(campaign.budget)}</p>
                    {campaign.status === 'active' && (
                      <p className="text-xs text-gray-500">${formatMoney(campaign.spent)} spent</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Views</p>
                    <p className="font-medium">
                      {campaign.status === 'active' ? formatNumber(campaign.views) : campaign.reachEstimate || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Duration</p>
                    <p className="font-medium">
                      {Math.ceil((new Date(campaign.endDate).getTime() - new Date(campaign.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Type</p>
                    <p className="font-medium capitalize">{campaign.contentType}</p>
                  </div>
                </div>
                
                <div className="flex justify-between mt-4 pt-4 border-t border-gray-800">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                    <span>{new Date(campaign.endDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCampaignClick(campaign);
                      }}
                      className="p-1.5 border border-gray-700 rounded hover:bg-white/5 transition-colors"
                      aria-label="View details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Edit functionality would go here
                        console.log('Edit campaign', campaign.id);
                      }}
                      className="p-1.5 border border-gray-700 rounded hover:bg-white/5 transition-colors"
                      aria-label="Edit campaign"
                    >
                      <FileText className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Create New Campaign Card */}
          <div className="border border-dashed border-gray-700 rounded-lg bg-black/20 hover:border-red-500 transition-all">
            <button
              className="w-full h-full p-6 flex flex-col items-center justify-center gap-3 text-gray-400 hover:text-white transition-colors"
              onClick={handleCreateCampaign}
            >
              <div className="w-12 h-12 rounded-full bg-black/40 flex items-center justify-center">
                <Plus className="h-6 w-6" />
              </div>
              <span className="font-medium">Create New Campaign</span>
            </button>
          </div>
        </div>
      )}
      
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

  // Creators view
  const renderCreators = () => (
    <div className="space-y-6">
      {/* Search and filter controls */}
      <div className="p-4 bg-black/40 border border-gray-800 rounded-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1">
            <div className="text-xl font-bold mb-2">Creator Management</div>
            <p className="text-sm text-gray-400">View and manage creators who have worked on your campaigns</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
              </div>
              <label htmlFor="creator-search" className="sr-only">Search creators</label>
              <input
                id="creator-search"
                type="text"
                className="pl-10 pr-4 py-2 w-full bg-black/40 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Search creators..."
                aria-label="Search creators"
              />
            </div>
            
            <div className="flex gap-3 w-full sm:w-auto">
              <div className="relative flex-1">
                <label htmlFor="platform-filter" className="sr-only">Filter by platform</label>
                <select
                  id="platform-filter"
                  className="px-3 py-2 w-full bg-black/40 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none pr-8"
                  aria-label="Filter by platform"
                >
                  <option value="all">All Platforms</option>
                  <option value="tiktok">TikTok</option>
                  <option value="instagram">Instagram</option>
                  <option value="youtube">YouTube</option>
                  <option value="twitter">X/Twitter</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <Filter className="h-4 w-4 text-gray-400" aria-hidden="true" />
                </div>
              </div>
              
              <button
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 transition-colors rounded-lg text-white font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="Invite creators"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                <span>Invite Creators</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Creator Performance Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-800">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-black/40 border-b border-gray-800">
              <th className="text-left p-4 text-gray-400 font-medium">Creator</th>
              <th className="text-left p-4 text-gray-400 font-medium">Platforms</th>
              <th className="text-left p-4 text-gray-400 font-medium">Followers</th>
              <th className="text-right p-4 text-gray-400 font-medium">Views</th>
              <th className="text-right p-4 text-gray-400 font-medium">Eng. Rate</th>
              <th className="text-right p-4 text-gray-400 font-medium">CPV</th>
              <th className="text-center p-4 text-gray-400 font-medium">Posts</th>
              <th className="text-right p-4 text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {topCreators.map((creator) => (
              <tr key={creator.id} className="border-b border-gray-800 hover:bg-white/5">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-lg font-bold text-gray-300">
                      {creator.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-white">{creator.name}</p>
                      <p className="text-xs text-gray-400">{creator.id}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex gap-1">
                    {creator.platforms.map(platform => (
                      <div key={platform} className="inline-block">
                        <PlatformIcon platform={platform} />
                      </div>
                    ))}
                  </div>
                </td>
                <td className="p-4 text-gray-300">{formatNumber(creator.followers)}</td>
                <td className="p-4 text-right text-gray-300">{formatNumber(creator.views)}</td>
                <td className="p-4 text-right text-green-400">{creator.engagement.toFixed(1)}%</td>
                <td className="p-4 text-right">${creator.costPerView.toFixed(2)}</td>
                <td className="p-4 text-center">{creator.posts}</td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <button
                      className="p-1.5 bg-black/40 border border-gray-700 rounded hover:bg-white/5 transition-colors"
                      aria-label={`View profile for ${creator.name}`}
                    >
                      <User className="h-4 w-4" />
                    </button>
                    
                    <button
                      className="p-1.5 bg-black/40 border border-gray-700 rounded hover:bg-white/5 transition-colors"
                      aria-label={`View content from ${creator.name}`}
                    >
                      <Video className="h-4 w-4" />
                    </button>
                    
                    <button
                      className="p-1.5 bg-red-600 rounded hover:bg-red-700 transition-colors"
                      aria-label={`Invite ${creator.name} to a campaign`}
                    >
                      <Share2 className="h-4 w-4 text-white" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Creator Performance Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-black/40 border border-gray-800 rounded-lg">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-400" />
            Creator Performance by Platform
          </h3>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformROIData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                  dataKey="platform"
                  stroke="#9CA3AF"
                  tick={{ fill: '#FFFFFF' }}
                />
                <YAxis
                  stroke="#9CA3AF"
                  tick={{ fill: '#FFFFFF' }}
                  tickFormatter={(value) => `${value}M`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="views" 
                  name="Views" 
                  unit="M" 
                  radius={[4, 4, 0, 0]}
                >
                  {platformROIData.map((entry) => (
                    <Cell key={`cell-${entry.platform}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex justify-around mt-4">
            {platformROIData.map((platform) => (
              <div key={platform.platform} className="text-center">
                <div className="flex items-center justify-center">
                  <PlatformIcon platform={platform.platform} />
                </div>
                <p className="text-xs mt-1">{platform.engagement}%</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-6 bg-black/40 border border-gray-800 rounded-lg">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <Percent className="h-5 w-5 text-green-400" />
            Engagement Funnel
          </h3>
          
          <div className="space-y-4">
            <div className="p-3 border border-gray-800 rounded-lg bg-black/20">
              <div className="flex justify-between items-center">
                <span className="font-medium">Views to Engagement</span>
                <span className="text-green-400">4.7%</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full mt-2">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '4.7%' }}></div>
              </div>
            </div>
            
            <div className="p-3 border border-gray-800 rounded-lg bg-black/20">
              <div className="flex justify-between items-center">
                <span className="font-medium">Engagement to Click</span>
                <span className="text-blue-400">8.2%</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full mt-2">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '8.2%' }}></div>
              </div>
            </div>
            
            <div className="p-3 border border-gray-800 rounded-lg bg-black/20">
              <div className="flex justify-between items-center">
                <span className="font-medium">Click to Conversion</span>
                <span className="text-purple-400">12.5%</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full mt-2">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '12.5%' }}></div>
              </div>
            </div>
            
            <div className="p-3 border border-gray-800 rounded-lg bg-black/20">
              <div className="flex justify-between items-center">
                <span className="font-medium">Overall Conversion Rate</span>
                <span className="text-red-400">0.05%</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full mt-2">
                <div className="h-full bg-red-500 rounded-full" style={{ width: '0.5%' }}></div>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-gray-300 mt-4">
            <span className="font-medium">Insight:</span> TikTok creators drive the highest engagement-to-click ratio at 9.3%, while YouTube creators have the best click-to-conversion at 15.1%.
          </p>
        </div>
      </div>
    </div>
  );
  
  // Analytics View
  const renderAnalytics = () => (
    <div className="space-y-8">
      <div className="p-6 bg-black/40 border border-gray-800 rounded-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Activity className="h-5 w-5 text-red-400" />
            Performance Over Time
          </h3>
          
          <div className="flex items-center gap-3">
            <select 
              className="bg-transparent border border-gray-700 rounded p-2 text-sm"
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
            >
              <option value="30D">Last 30 Days</option>
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
                dy={10}
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
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-black/40 border border-gray-800 rounded-lg">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <BarChartIcon className="h-5 w-5 text-yellow-400" />
            Campaign Comparison
          </h3>
          
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={activeCampaigns.filter(c => c.status === 'active').map(c => ({
                  name: c.title,
                  views: c.views / 1000000,
                  engagement: c.engagement_rate
                }))}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis type="number" stroke="#9CA3AF" tick={{ fill: '#FFFFFF' }} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  stroke="#9CA3AF" 
                  tick={{ fill: '#FFFFFF' }}
                  width={150}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="views" name="Views (M)" fill="#4287f5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="p-6 bg-black/40 border border-gray-800 rounded-lg">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-green-400" />
            Engagement by Platform
          </h3>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={platformROIData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    dataKey="engagement"
                    nameKey="platform"
                    label={({ name }) => name}
                  >
                    {platformROIData.map((entry) => (
                      <Cell key={`cell-${entry.platform}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex flex-col justify-center space-y-4">
              {platformROIData.map((platform) => (
                <div key={platform.platform} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: platform.color }}></div>
                  <span>{platform.platform}</span>
                  <span className="ml-auto font-medium">{formatNumber(platform.engagement)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-black/40 border border-gray-800 rounded-lg col-span-full md:col-span-1">
          <h3 className="text-lg font-medium mb-4">Demographic Insights</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm text-gray-400 mb-2">Age Distribution</h4>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>18-24</span>
                    <span>42%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: '42%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>25-34</span>
                    <span>35%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>35-44</span>
                    <span>15%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>45+</span>
                    <span>8%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: '8%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm text-gray-400 mb-2">Gender Distribution</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-black/20 border border-gray-800 rounded-lg text-center">
                  <p className="text-xs text-gray-400">Female</p>
                  <p className="text-xl font-bold">62%</p>
                </div>
                <div className="p-3 bg-black/20 border border-gray-800 rounded-lg text-center">
                  <p className="text-xs text-gray-400">Male</p>
                  <p className="text-xl font-bold">38%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-black/40 border border-gray-800 rounded-lg col-span-full md:col-span-2">
          <h3 className="text-lg font-medium mb-4">Geographic Distribution</h3>
          
          <div className="space-y-3">
            <div className="p-3 bg-black/20 border border-gray-800 rounded-lg">
              <div className="flex justify-between items-center">
                <span>United States</span>
                <span className="font-medium">65%</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full mt-1">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            
            <div className="p-3 bg-black/20 border border-gray-800 rounded-lg">
              <div className="flex justify-between items-center">
                <span>United Kingdom</span>
                <span className="font-medium">12%</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full mt-1">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '12%' }}></div>
              </div>
            </div>
            
            <div className="p-3 bg-black/20 border border-gray-800 rounded-lg">
              <div className="flex justify-between items-center">
                <span>Canada</span>
                <span className="font-medium">8%</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full mt-1">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '8%' }}></div>
              </div>
            </div>
            
            <div className="p-3 bg-black/20 border border-gray-800 rounded-lg">
              <div className="flex justify-between items-center">
                <span>Australia</span>
                <span className="font-medium">6%</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full mt-1">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '6%' }}></div>
              </div>
            </div>
            
            <div className="p-3 bg-black/20 border border-gray-800 rounded-lg">
              <div className="flex justify-between items-center">
                <span>Other</span>
                <span className="font-medium">9%</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full mt-1">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '9%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6 bg-black/40 border border-gray-800 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Analytics Report</h3>
          <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Full Report
          </button>
        </div>
        
        <div className="p-4 bg-black/20 border border-gray-800 rounded-lg">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm">
                <span className="font-medium">Analytics Overview:</span> Your campaigns are performing 24% better than industry average with TikTok driving the highest engagement. Consider allocating more budget to video-based content focused on the 18-24 age demographic for optimal results.
              </p>
            </div>
          </div>
        </div>
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
  
  // Settings view
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
              <p className="text-sm text-gray-400">When creators submit content</p>
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
            className={`px-6 py-3 font-medium relative ${activeView === 'creators' ? 'text-white' : 'text-gray-400'}`}
            onClick={() => setActiveView('creators')}
            aria-current={activeView === 'creators' ? 'page' : undefined}
            aria-label="Creators section"
          >
            Creators
            {activeView === 'creators' && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"
                layoutId="activeTab"
              />
            )}
          </button>
          
          <button
            className={`px-6 py-3 font-medium relative ${activeView === 'analytics' ? 'text-white' : 'text-gray-400'}`}
            onClick={() => setActiveView('analytics')}
            aria-current={activeView === 'analytics' ? 'page' : undefined}
            aria-label="Analytics section"
          >
            Analytics
            {activeView === 'analytics' && (
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

        {/* Main Content Area */}
        <AnimatePresence mode="wait">
          {activeView === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {renderOverview()}
            </motion.div>
          )}

          {activeView === 'campaigns' && (
            <motion.div
              key="campaigns"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {renderCampaigns()}
            </motion.div>
          )}
          
          {activeView === 'creators' && (
            <motion.div
              key="creators"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {renderCreators()}
            </motion.div>
          )}
          
          {activeView === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {renderAnalytics()}
            </motion.div>
          )}

          {activeView === 'team' && (
            <motion.div
              key="team"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {renderTeam()}
            </motion.div>
          )}

          {activeView === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {renderSettings()}
            </motion.div>
          )}
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
          <ConfirmationDialog
            title="Log Out"
            message="Are you sure you want to log out of your brand account?"
            confirmLabel="Log Out"
            cancelLabel="Cancel"
            onConfirm={handleLogout}
            onCancel={() => setShowLogoutConfirm(false)}
          />
        )}
      </AnimatePresence>

      {/* Campaign Detail Modal */}
      <AnimatePresence>
        {showCampaignDetail && selectedCampaign && (
          <CampaignDetailModal
            campaign={selectedCampaign}
            onClose={() => setShowCampaignDetail(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default BrandDashboard;