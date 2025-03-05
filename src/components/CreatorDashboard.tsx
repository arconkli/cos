// CreatorDashboard.tsx - Optimized for accessibility and usability
'use client';

import React, { useState, useEffect, memo, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, 
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell
} from 'recharts';
import {
  DollarSign, Eye, Calendar, TrendingUp, Search,
  ArrowUpRight, Clock, Youtube, Instagram, Twitter, 
  LogOut, X, AlertCircle, Layers, Users, Plus
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import NavigationTabs from './NavigationTabs';
import SettingsView from './SettingsView';

// TypeScript interfaces
interface Post {
  platform: string;
  views: string;
  earned: number;
  status: 'approved' | 'pending' | 'denied';
  postDate?: string;
  contentType: 'original' | 'repurposed';
}

interface CampaignRequirements {
  platforms: string[];
  contentGuidelines: string[];
  minViewsForPayout?: string;
  totalBudget?: string;
  payoutRate: {
    original: string;
    repurposed?: string;
  };
}

interface AvailableCampaignRequirements extends CampaignRequirements {
  postCount: number;
}

interface Campaign {
  id: number;
  title: string;
  earned: number;
  pendingPayout: number;
  views: string;
  endDate: string;
  status: string;
  contentType: 'original' | 'repurposed' | 'both';
  requirements: CampaignRequirements;
  posts: Post[];
}

interface AvailableCampaign {
  id: number;
  title: string;
  views: string;
  endDate: string;
  status: string;
  contentType: 'original' | 'repurposed' | 'both';
  requirements: AvailableCampaignRequirements;
}

// Sample data (reduced and simplified)
const viewsData = [
  { date: 'Jan', views: 2.1, earnings: 4200 },
  { date: 'Feb', views: 3.4, earnings: 6800 },
  { date: 'Mar', views: 4.2, earnings: 8400 },
  { date: 'Apr', views: 6.8, earnings: 13600 },
  { date: 'May', views: 8.5, earnings: 17000 },
  { date: 'Jun', views: 12.3, earnings: 24600 }
];

const platformData = [
  { platform: 'TikTok', views: 14.5, percentage: 51 },
  { platform: 'Instagram', views: 8.3, percentage: 29 },
  { platform: 'YouTube', views: 4.2, percentage: 15 },
  { platform: 'X', views: 1.3, percentage: 5 }
];

const COLORS = ['#FF4444', '#4287f5', '#31a952', '#b026ff'];

// Sample campaigns (reduced content)
const activeCampaigns = [
  {
    id: 1,
    title: "Netflix Series Launch",
    earned: 250,
    pendingPayout: 150,
    views: "820K",
    endDate: "2025-03-15",
    status: "active",
    contentType: "both",
    requirements: {
      platforms: ["TikTok", "Instagram"],
      contentGuidelines: [
        "Use official hashtags #NetflixNewSeries",
        "Minimum 30s duration"
      ],
      minViewsForPayout: "100K",
      totalBudget: "$25,000",
      payoutRate: {
        original: "$500 per 1M views",
        repurposed: "$250 per 1M views"
      }
    },
    posts: [
      {
        platform: "TikTok",
        views: "500K",
        earned: 250,
        status: "approved",
        postDate: "2025-02-15",
        contentType: "original"
      },
      {
        platform: "Instagram",
        views: "320K",
        earned: 150,
        status: "pending",
        postDate: "2025-02-16",
        contentType: "original"
      }
    ]
  },
  {
    id: 2,
    title: "Summer Fashion Collection",
    earned: 450,
    pendingPayout: 300,
    views: "1.2M",
    endDate: "2025-04-10",
    status: "active",
    contentType: "original",
    requirements: {
      platforms: ["TikTok", "Instagram", "YouTube"],
      contentGuidelines: [
        "Showcase at least 3 items from collection",
        "Include brand tag in description"
      ],
      minViewsForPayout: "250K",
      totalBudget: "$50,000",
      payoutRate: {
        original: "$600 per 1M views"
      }
    },
    posts: [
      {
        platform: "TikTok",
        views: "750K",
        earned: 450,
        status: "approved",
        postDate: "2025-02-12",
        contentType: "original"
      }
    ]
  }
];

const availableCampaigns = [
  {
    id: 3,
    title: "New Artist Album",
    views: "0",
    endDate: "2025-04-01",
    status: "available",
    contentType: "both",
    requirements: {
      platforms: ["TikTok", "Instagram"],
      postCount: 4,
      contentGuidelines: [
        "Use artist's music in background",
        "Include #NewAlbumDrop hashtag"
      ],
      minViewsForPayout: "100K",
      totalBudget: "$50,000",
      payoutRate: {
        original: "$500 per 1M views",
        repurposed: "$250 per 1M views"
      }
    }
  },
  {
    id: 4,
    title: "Movie Premiere",
    views: "0",
    endDate: "2025-03-25",
    status: "available",
    contentType: "original",
    requirements: {
      platforms: ["TikTok", "YouTube"],
      postCount: 6,
      contentGuidelines: [
        "Show movie trailer clips",
        "Personal reaction/review"
      ],
      minViewsForPayout: "500K",
      totalBudget: "$100,000",
      payoutRate: {
        original: "$1,000 per 1M views"
      }
    }
  }
];

// Background pattern component (subtle version)
const BackgroundPattern = memo(() => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    <svg width="100%" height="100%" className="opacity-3">
      <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5"/>
      </pattern>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  </div>
));

BackgroundPattern.displayName = 'BackgroundPattern';

// Accessible tooltip component
const CustomTooltip = memo(({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;
  
  return (
    <div className="p-4 border border-white bg-black rounded-md shadow-lg" role="tooltip">
      <p className="font-bold text-base text-white mb-2" aria-label={`Month: ${label}`}>{label}</p>
      {payload.map((entry: any, index: number) => (
        <p key={`item-${index}`} className="text-sm mb-1" style={{ color: entry.color || '#FFFFFF' }}>
          {entry.name}: {entry.value} {entry.name === 'views' ? 'M' : entry.unit || ''}
        </p>
      ))}
    </div>
  );
});

CustomTooltip.displayName = 'CustomTooltip';

// Helper function to get color based on platform
function getColorForPlatform(platform: string): string {
  switch (platform.toLowerCase()) {
    case 'youtube': return '#FF0000';
    case 'instagram': return '#E1306C';
    case 'tiktok': return '#69C9D0';
    case 'twitter': return '#1DA1F2';
    default: return '#FFFFFF';
  }
}

// Helper to check if the campaign is of type Campaign (has posts)
function isActiveCampaign(campaign: Campaign | AvailableCampaign): campaign is Campaign {
  return 'posts' in campaign && Array.isArray(campaign.posts);
}

// Campaign Detail Component - Simplified and accessible
interface CampaignDetailProps {
  campaign: Campaign | AvailableCampaign;
  onClose: () => void;
}

const CampaignDetail = memo(({ campaign, onClose }: CampaignDetailProps) => {
  const isActive = isActiveCampaign(campaign);
  
  // Status Label Component
  const StatusLabel = ({ status }: { status: string }) => {
    let bgColor, textColor;
    
    switch (status.toLowerCase()) {
      case 'approved':
        bgColor = 'bg-green-900 bg-opacity-20';
        textColor = 'text-green-400';
        break;
      case 'denied':
        bgColor = 'bg-red-900 bg-opacity-20';
        textColor = 'text-red-400';
        break;
      case 'pending':
        bgColor = 'bg-yellow-900 bg-opacity-20';
        textColor = 'text-yellow-400';
        break;
      default:
        bgColor = 'bg-gray-900 bg-opacity-20';
        textColor = 'text-gray-400';
    }
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${bgColor} ${textColor}`} role="status">
        {status.toUpperCase()}
      </span>
    );
  };

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
        className="border p-6 md:p-8 rounded-lg w-full max-w-4xl bg-black custom-scrollbar overflow-y-auto max-h-[90vh] md:max-h-[85vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white hover:bg-opacity-10 transition-colors"
          onClick={onClose}
          aria-label="Close campaign details"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 id="campaign-title" className="text-2xl md:text-3xl font-bold mb-6 pr-10">
          {campaign.title}
        </h2>

        <div className="space-y-8">
          {/* Campaign Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-400">Type</p>
              <p className="text-lg font-medium capitalize">{campaign.contentType === 'both' ? 'Original & Repurposed' : campaign.contentType}</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-400">Platforms</p>
              <div className="flex flex-wrap gap-2">
                {campaign.requirements.platforms.map(platform => (
                  <span 
                    key={platform} 
                    className="px-3 py-1 rounded-full bg-white bg-opacity-5 text-sm"
                  >
                    {platform}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-400">Deadline</p>
              <p className="text-lg font-medium">
                {new Date(campaign.endDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
          
          {/* Payout Rates */}
          <div className="p-6 bg-gray-900 bg-opacity-30 rounded-lg border border-gray-800 space-y-4">
            <h3 className="text-xl font-bold">Payout Rates</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-gray-800 bg-opacity-30 rounded-lg">
                <h4 className="font-medium mb-2">Original Content</h4>
                <p className="text-xl font-bold text-green-400">{campaign.requirements.payoutRate.original}</p>
                <p className="text-sm text-gray-400 mt-2">
                  Create new content specifically for this campaign
                </p>
              </div>
              
              {campaign.requirements.payoutRate.repurposed && (
                <div className="p-4 bg-gray-800 bg-opacity-30 rounded-lg">
                  <h4 className="font-medium mb-2">Repurposed Content</h4>
                  <p className="text-xl font-bold text-blue-400">{campaign.requirements.payoutRate.repurposed}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Adapt existing content to fit campaign requirements
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex items-center p-3 bg-gray-800 bg-opacity-40 rounded-lg">
              <Eye className="h-5 w-5 text-gray-400 mr-3" />
              <span>Minimum views for payout: <strong>{campaign.requirements.minViewsForPayout}</strong></span>
            </div>
          </div>
          
          {/* Guidelines */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Campaign Guidelines</h3>
            
            <ul className="list-disc pl-5 space-y-2">
              {campaign.requirements.contentGuidelines.map((guideline, i) => (
                <li key={i} className="text-gray-300">{guideline}</li>
              ))}
            </ul>
          </div>
          
          {/* Posts for active campaigns */}
          {isActive && campaign.posts.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Your Posts</h3>
              
              <div className="grid grid-cols-1 gap-4">
                {campaign.posts.map((post, i) => (
                  <div 
                    key={i}
                    className="p-5 border border-gray-800 rounded-lg bg-gray-900 bg-opacity-30"
                  >
                    <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
                      <div className="flex items-center">
                        {post.platform === 'TikTok' && (
                          <span className="mr-2 text-cyan-400">
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                            </svg>
                          </span>
                        )}
                        {post.platform === 'Instagram' && <Instagram className="h-5 w-5 text-pink-500 mr-2" />}
                        {post.platform === 'YouTube' && <Youtube className="h-5 w-5 text-red-500 mr-2" />}
                        {post.platform === 'Twitter' && <Twitter className="h-5 w-5 text-blue-400 mr-2" />}
                        <span className="font-medium">{post.platform}</span>
                      </div>
                      <StatusLabel status={post.status} />
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Views</p>
                        <p className="text-lg font-bold">{post.views}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Earned</p>
                        <p className="text-lg font-bold text-green-400">${post.earned}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Posted</p>
                        <p className="text-base">
                          {post.postDate && new Date(post.postDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    {post.status === 'denied' && (
                      <div className="mt-4 p-3 border border-red-500 rounded-lg bg-red-900 bg-opacity-10 flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-red-400">Content doesn't follow campaign guidelines</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Join Button for Available Campaigns */}
          {!isActive && (
            <button
              className="w-full py-4 bg-gradient-to-r from-red-500 to-red-700 rounded-lg text-white font-bold text-lg transition hover:shadow-lg hover:shadow-red-900/40"
            >
              Join This Campaign
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

CampaignDetail.displayName = 'CampaignDetail';

// StatsOverview Component - Simplified and accessible
const StatsOverview = memo(({ totalPendingPayout }: { totalPendingPayout: number }) => {
  const stats = [
    { icon: <Eye className="h-6 w-6 text-blue-400" aria-hidden="true" />, label: "Total Views", value: "28.3M", trend: "+14%" },
    { icon: <DollarSign className="h-6 w-6 text-green-400" aria-hidden="true" />, label: "Total Earned", value: "$74,600", trend: "+23%" },
    { icon: <Clock className="h-6 w-6 text-yellow-400" aria-hidden="true" />, label: "Pending", value: `$${totalPendingPayout}`, trend: "+8%" }
  ];

  return (
    <section aria-label="Performance overview" className="mb-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="p-6 rounded-lg bg-gray-900 bg-opacity-50 border border-gray-800 hover:border-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              {stat.icon}
              <span className="text-gray-400">{stat.label}</span>
            </div>
            <div className="flex justify-between items-end">
              <p className="text-3xl font-bold">{stat.value}</p>
              <div className="text-sm flex items-center gap-1 text-green-400">
                <TrendingUp className="h-4 w-4" aria-hidden="true" />
                <span>{stat.trend}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});

StatsOverview.displayName = 'StatsOverview';

// ActiveCampaigns Component - Simplified and more accessible
interface CampaignsProps {
  campaigns: Campaign[] | AvailableCampaign[];
  onCampaignClick: (campaign: Campaign | AvailableCampaign) => void;
}

const ActiveCampaigns = memo(({ campaigns, onCampaignClick }: CampaignsProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {campaigns.map((campaign) => (
      <button
        key={campaign.id}
        className="text-left p-6 rounded-lg bg-gray-900 bg-opacity-50 border border-gray-800 hover:border-gray-600 transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        onClick={() => onCampaignClick(campaign)}
        aria-label={`View details of ${campaign.title} campaign`}
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold">{campaign.title}</h3>
          <span className="px-3 py-1 rounded-full bg-green-900 bg-opacity-20 text-green-400 text-sm">
            ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">Earned</p>
            <p className="text-xl font-bold">${(campaign as Campaign).earned}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Pending</p>
            <p className="text-xl font-bold">${(campaign as Campaign).pendingPayout}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Views</p>
            <p className="text-xl font-bold">{campaign.views}</p>
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div className="flex flex-wrap gap-2">
            {campaign.requirements.platforms.slice(0, 2).map((platform) => (
              <span
                key={platform}
                className="px-3 py-1 rounded-full bg-white bg-opacity-5 text-sm"
              >
                {platform}
              </span>
            ))}
            {campaign.requirements.platforms.length > 2 && (
              <span className="px-3 py-1 rounded-full bg-white bg-opacity-5 text-sm">
                +{campaign.requirements.platforms.length - 2}
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
  </div>
));

ActiveCampaigns.displayName = 'ActiveCampaigns';

// AvailableCampaignsSection Component - Simplified and more accessible
const AvailableCampaignsSection = memo(({ campaigns, onCampaignClick }: CampaignsProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {campaigns.map((campaign) => (
      <button
        key={campaign.id}
        className="text-left p-6 rounded-lg bg-gray-900 bg-opacity-50 border border-gray-800 hover:border-gray-600 transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        onClick={() => onCampaignClick(campaign)}
        aria-label={`View details of ${campaign.title} campaign`}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold mb-2">{campaign.title}</h3>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white bg-opacity-5 text-sm text-blue-400">
                NEW
              </span>
              <span className="px-3 py-1 rounded-full bg-white bg-opacity-5 text-sm">
                {campaign.contentType === 'both' ? 'Original & Repurposed' : campaign.contentType.charAt(0).toUpperCase() + campaign.contentType.slice(1)}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">Payout Rate</p>
            <p className="text-lg font-bold">{campaign.requirements.payoutRate.original}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Min. Views</p>
              <p className="text-xl font-bold">{campaign.requirements.minViewsForPayout}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Budget</p>
              <p className="text-lg font-bold">{campaign.requirements.totalBudget}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-gray-800">
          <div className="flex flex-wrap gap-2">
            {campaign.requirements.platforms.slice(0, 2).map((platform) => (
              <span
                key={platform}
                className="px-3 py-1 rounded-full bg-white bg-opacity-5 text-sm"
              >
                {platform}
              </span>
            ))}
            {campaign.requirements.platforms.length > 2 && (
              <span className="px-3 py-1 rounded-full bg-white bg-opacity-5 text-sm">
                +{campaign.requirements.platforms.length - 2}
              </span>
            )}
          </div>
          
          <span className="inline-flex items-center text-red-400 font-medium text-sm">
            Join <ArrowUpRight className="h-4 w-4 ml-1" aria-hidden="true" />
          </span>
        </div>
      </button>
    ))}
    
    {/* Add Campaign Card */}
    <button 
      className="flex flex-col items-center justify-center p-6 rounded-lg border border-dashed border-gray-700 bg-gray-900 bg-opacity-30 hover:border-gray-500 hover:bg-opacity-40 transition-all text-center focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
      aria-label="Find more campaigns"
    >
      <div className="w-12 h-12 mb-4 rounded-full flex items-center justify-center bg-gray-800">
        <Plus className="h-6 w-6 text-gray-400" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-medium mb-2">Find More Campaigns</h3>
      <p className="text-sm text-gray-400">
        Browse our marketplace for more opportunities
      </p>
    </button>
  </div>
));

AvailableCampaignsSection.displayName = 'AvailableCampaignsSection';

// Analytics View Component - Simplified
const AnalyticsView = memo(() => {
  return (
    <div className="space-y-10">
      {/* Views and Earnings Charts */}
      <section aria-labelledby="analytics-charts" className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <h2 id="analytics-charts" className="sr-only">Analytics Charts</h2>
        
        {/* Views Chart */}
        <div className="p-6 rounded-lg bg-gray-900 bg-opacity-50 border border-gray-800">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-400" aria-hidden="true" />
              Views Over Time
            </h3>
            <select 
              className="px-3 py-1 bg-transparent border border-gray-700 rounded text-sm focus:outline-none focus:border-blue-500"
              aria-label="Select view type"
            >
              <option value="total">Total Views</option>
              <option value="platform">By Platform</option>
            </select>
          </div>

          <div className="h-64" aria-label="Views chart showing increasing trend over 6 months">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={viewsData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF" 
                  tick={{ fill: '#9CA3AF' }}
                  dy={10}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                  tickFormatter={(value) => `${value}M`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#4287f5"
                  strokeWidth={3}
                  dot={{ fill: '#FFFFFF', r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#4287f5' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Earnings Chart */}
        <div className="p-6 rounded-lg bg-gray-900 bg-opacity-50 border border-gray-800">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-400" aria-hidden="true" />
              Earnings Over Time
            </h3>
            <select 
              className="px-3 py-1 bg-transparent border border-gray-700 rounded text-sm focus:outline-none focus:border-green-500"
              aria-label="Select earnings view"
            >
              <option value="total">Total Earnings</option>
              <option value="campaign">By Campaign</option>
            </select>
          </div>

          <div className="h-64" aria-label="Earnings chart showing increasing trend over 6 months">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={viewsData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF" 
                  tick={{ fill: '#9CA3AF' }}
                  dy={10}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                  tickFormatter={(value) => `$${value/1000}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="earnings"
                  fill="#31a952"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Platform Breakdown */}
      <section aria-labelledby="platform-breakdown" className="p-6 rounded-lg bg-gray-900 bg-opacity-50 border border-gray-800">
        <h2 id="platform-breakdown" className="text-xl font-bold mb-6">Platform Breakdown</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pie Chart */}
          <div className="h-64" aria-label="Pie chart showing distribution of views across platforms">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  dataKey="percentage"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Platform Stats */}
          <div className="space-y-4">
            {platformData.map((platform, index) => (
              <div
                key={platform.platform}
                className="p-4 rounded-lg bg-white bg-opacity-5 border border-gray-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  {platform.platform === 'YouTube' && <Youtube className="h-5 w-5 text-red-500" aria-hidden="true" />}
                  {platform.platform === 'Instagram' && <Instagram className="h-5 w-5 text-pink-500" aria-hidden="true" />}
                  {platform.platform === 'TikTok' && (
                    <svg className="h-5 w-5 text-cyan-400" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  )}
                  {platform.platform === 'X' && <Twitter className="h-5 w-5 text-blue-400" aria-hidden="true" />}
                  <span className="font-medium">{platform.platform}</span>
                </div>
                <div className="text-right">
                  <p className="font-bold">{platform.views}M</p>
                  <p className="text-sm text-gray-400">{platform.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Audience Demographics - Placeholder */}
      <section aria-labelledby="audience-demographics" className="p-6 rounded-lg bg-gray-900 bg-opacity-50 border border-gray-800">
        <h2 id="audience-demographics" className="text-xl font-bold mb-6 flex items-center gap-2">
          <Users className="h-5 w-5 text-purple-400" aria-hidden="true" />
          Audience Demographics
        </h2>

        <div className="flex flex-col items-center justify-center py-12 border border-dashed border-gray-700 rounded-lg">
          <div className="w-16 h-16 mb-4 rounded-full flex items-center justify-center bg-gray-800">
            <Users className="h-8 w-8 text-gray-400" aria-hidden="true" />
          </div>
          <h3 className="text-lg font-medium mb-2">Demographics Coming Soon</h3>
          <p className="text-sm text-gray-400 text-center max-w-md">
            Connect more accounts to see detailed audience demographics across your platforms
          </p>
          <button
            className="mt-6 px-4 py-2 border border-gray-700 rounded-lg hover:bg-white hover:bg-opacity-5 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Connect Accounts
          </button>
        </div>
      </section>
    </div>
  );
});

AnalyticsView.displayName = 'AnalyticsView';

// PaymentsView Component - Simplified
const PaymentsView = memo(() => {
  return (
    <div className="space-y-10">
      {/* Payment Summary */}
      <section aria-labelledby="payment-summary" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <h2 id="payment-summary" className="sr-only">Payment Summary</h2>
        
        <div className="p-6 rounded-lg bg-gray-900 bg-opacity-50 border border-gray-800">
          <h3 className="text-xl font-medium mb-2">Total Earned</h3>
          <p className="text-3xl font-bold mb-3">$74,600</p>
          <div className="flex items-center text-sm text-green-400">
            <TrendingUp className="h-4 w-4 mr-1" aria-hidden="true" />
            <span>+23% from last period</span>
          </div>
        </div>

        <div className="p-6 rounded-lg bg-gray-900 bg-opacity-50 border border-gray-800">
          <h3 className="text-xl font-medium mb-2">Pending Payout</h3>
          <p className="text-3xl font-bold mb-3">${activeCampaigns.reduce((sum, campaign) => sum + campaign.pendingPayout, 0)}</p>
          <p className="text-sm text-gray-400">Expected on Mar 15, 2025</p>
        </div>

        <div className="p-6 rounded-lg bg-gray-900 bg-opacity-50 border border-gray-800">
          <h3 className="text-xl font-medium mb-2">Average Per Campaign</h3>
          <p className="text-3xl font-bold mb-3">$350</p>
          <div className="flex items-center text-sm text-green-400">
            <TrendingUp className="h-4 w-4 mr-1" aria-hidden="true" />
            <span>+12% from last period</span>
          </div>
        </div>
      </section>

      {/* Payment History */}
      <section aria-labelledby="payment-history" className="p-6 rounded-lg bg-gray-900 bg-opacity-50 border border-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h2 id="payment-history" className="text-xl font-bold">Payment History</h2>
          <div className="flex items-center">
            <select 
              className="px-3 py-1 bg-transparent border border-gray-700 rounded text-sm focus:outline-none focus:border-red-500"
              aria-label="Filter by time period"
            >
              <option value="6M">Last 6 Months</option>
              <option value="1Y">Last Year</option>
              <option value="ALL">All Time</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto" tabIndex={0} aria-label="Payment history table with dates, amounts, and status">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 text-left">
                <th className="py-3 font-medium text-gray-400">Date</th>
                <th className="py-3 font-medium text-gray-400">Amount</th>
                <th className="py-3 font-medium text-gray-400">Method</th>
                <th className="py-3 font-medium text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { date: 'Feb 15, 2025', amount: 2500, method: 'PayPal', status: 'Completed' },
                { date: 'Jan 15, 2025', amount: 1800, method: 'Bank Transfer', status: 'Completed' },
                { date: 'Dec 15, 2024', amount: 3200, method: 'PayPal', status: 'Completed' }
              ].map((payment, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-800 hover:bg-white hover:bg-opacity-5 transition-colors"
                >
                  <td className="py-4">{payment.date}</td>
                  <td className="py-4 font-bold">${payment.amount.toLocaleString()}</td>
                  <td className="py-4">{payment.method}</td>
                  <td className="py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-green-900 bg-opacity-20 text-green-400 text-xs font-medium">
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-center">
          <button
            className="px-4 py-2 border border-gray-700 rounded-lg hover:bg-white hover:bg-opacity-5 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            View All Transactions
          </button>
        </div>
      </section>

      {/* Payment Methods */}
      <section aria-labelledby="payment-methods" className="p-6 rounded-lg bg-gray-900 bg-opacity-50 border border-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h2 id="payment-methods" className="text-xl font-bold">Payment Methods</h2>
          <button
            className="px-3 py-1 border border-gray-700 rounded-lg flex items-center gap-2 hover:bg-white hover:bg-opacity-5 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            aria-label="Add payment method"
          >
            <Plus className="h-4 w-4" />
            <span>Add Method</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-white bg-opacity-5 border border-gray-800 relative">
            <div className="absolute top-2 right-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-green-900 bg-opacity-20 text-green-400 text-xs font-medium">
                Default
              </span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-full bg-gray-800">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Bank Account</p>
                <p className="text-sm text-gray-400">****4321</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="px-3 py-1 text-sm border border-gray-700 rounded hover:bg-white hover:bg-opacity-5 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
                Edit
              </button>
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-white bg-opacity-5 border border-gray-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-full bg-gray-800">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor">
                  <path d="M9.5 13.75C9.5 14.72 10.25 15.5 11.17 15.5H13.05C13.85 15.5 14.5 14.82 14.5 13.97C14.5 13.06 14.1 12.73 13.51 12.52L10.5 11.47C9.91 11.26 9.51 10.94 9.51 10.02C9.51 9.18 10.16 8.49 10.96 8.49H12.84C13.76 8.49 14.51 9.27 14.51 10.24" />
                  <path d="M12 7.5V16.5" />
                </svg>
              </div>
              <div>
                <p className="font-medium">PayPal</p>
                <p className="text-sm text-gray-400">creator@example.com</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="px-3 py-1 text-sm border border-gray-700 rounded hover:bg-white hover:bg-opacity-5 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
                Make Default
              </button>
              <button className="px-3 py-1 text-sm border border-gray-700 rounded hover:bg-white hover:bg-opacity-5 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
                Edit
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
});

PaymentsView.displayName = 'PaymentsView';

// MAIN COMPONENT - CreatorDashboard optimized for accessibility and usability
export default function CreatorDashboard() {
  const router = useRouter();
  const [timeFilter, setTimeFilter] = useState('6M');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | AvailableCampaign | null>(null);
  const [activeView, setActiveView] = useState<'campaigns' | 'analytics' | 'payments' | 'settings'>('campaigns');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Type assertion for activeCampaigns to resolve TypeScript error
  const typedActiveCampaigns = activeCampaigns as Campaign[];
  
  // Type assertion for availableCampaigns to resolve TypeScript error
  const typedAvailableCampaigns = availableCampaigns as AvailableCampaign[];

  // Filter available campaigns based on search term
  const filteredAvailableCampaigns = useMemo(() => {
    if (!searchTerm) return typedAvailableCampaigns;

    const term = searchTerm.toLowerCase();
    return typedAvailableCampaigns.filter(campaign =>
      campaign.title.toLowerCase().includes(term) ||
      campaign.requirements.platforms.some(platform => platform.toLowerCase().includes(term))
    );
  }, [searchTerm]);

  // Check authentication on component mount
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      router.push('/');
    }
  }, [router]);

  // Handle logout
  const handleLogout = useCallback(() => {
    localStorage.removeItem('isLoggedIn');
    router.push('/');
  }, [router]);

  // Campaign click handler
  const handleCampaignClick = useCallback((campaign: Campaign | AvailableCampaign) => {
    setSelectedCampaign(campaign);
  }, []);

  // Calculate total pending payout
  const totalPendingPayout = useMemo(() =>
    typedActiveCampaigns.reduce((sum, campaign) => sum + campaign.pendingPayout, 0),
    []
  );

  return (
    <div className="min-h-screen bg-black p-4 md:p-8">
      {/* Subtle background pattern */}
      <BackgroundPattern />

      {/* Header with Title and Time Filter */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h1 className="text-3xl md:text-4xl font-bold">Creator Dashboard</h1>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 border border-gray-800 rounded-lg bg-gray-900 bg-opacity-50">
              <Calendar className="h-4 w-4 text-gray-400" aria-hidden="true" />
              <select
                className="bg-transparent border-none outline-none text-sm"
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
              className="hidden md:flex px-4 py-2 rounded-lg border border-gray-800 bg-gray-900 bg-opacity-50 items-center gap-2 hover:bg-white hover:bg-opacity-5 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              onClick={() => setShowLogoutConfirm(true)}
              aria-label="Log out"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Key Stats Overview */}
      <StatsOverview totalPendingPayout={totalPendingPayout} />

      {/* Navigation Tabs */}
      <NavigationTabs activeView={activeView} setActiveView={setActiveView} />
      
      {/* Main Content Area */}
      <main aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          {activeView === 'campaigns' && (
            <motion.div
              key="campaigns"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Active Campaigns */}
              <section aria-labelledby="active-campaigns" className="mb-12">
                <div className="flex items-center mb-6">
                  <h2 id="active-campaigns" className="text-2xl font-bold">Active Campaigns</h2>
                </div>
                
                <ActiveCampaigns 
                  campaigns={typedActiveCampaigns} 
                  onCampaignClick={handleCampaignClick} 
                />
              </section>

              {/* Available Campaigns */}
              <section aria-labelledby="available-campaigns" className="mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
                  <h2 id="available-campaigns" className="text-2xl font-bold">Available Campaigns</h2>
                  
                  <div className="relative w-full sm:w-auto">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="text"
                      className="pl-10 pr-4 py-2 w-full sm:w-auto bg-gray-900 bg-opacity-50 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                      placeholder="Search campaigns..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      aria-label="Search campaigns"
                    />
                  </div>
                </div>
                
                <AvailableCampaignsSection
                  campaigns={filteredAvailableCampaigns}
                  onCampaignClick={handleCampaignClick}
                />
              </section>
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
              <AnalyticsView />
            </motion.div>
          )}

          {activeView === 'payments' && (
            <motion.div
              key="payments"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <PaymentsView />
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
              <SettingsView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Mobile-only logout button */}
      <div className="md:hidden">
        <button
          className="fixed bottom-6 right-6 z-50 bg-gray-900 shadow-lg rounded-full w-12 h-12 flex items-center justify-center border border-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          onClick={() => setShowLogoutConfirm(true)}
          aria-label="Log out"
        >
          <LogOut className="h-5 w-5 text-red-500" />
        </button>
      </div>

      {/* Logout confirmation modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div 
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm z-50 p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
          >
            <div
              className="p-6 rounded-lg w-full max-w-xs bg-gray-900 border border-gray-800"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 id="logout-title" className="text-xl font-bold mb-4">Log Out</h3>
              <p className="mb-6">Are you sure you want to log out?</p>
              <div className="flex gap-3">
                <button
                  className="flex-1 px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                  onClick={() => setShowLogoutConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                  onClick={handleLogout}
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Campaign Detail Modal */}
      <AnimatePresence>
        {selectedCampaign && (
          <CampaignDetail
            campaign={selectedCampaign}
            onClose={() => setSelectedCampaign(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}