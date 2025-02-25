import React, { useState, useEffect, memo, lazy, Suspense, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  DollarSign, Eye, Calendar, TrendingUp, Filter, Search,
  ArrowUpRight, Clock, Youtube, Instagram, Twitter, CreditCard,
  LogOut, ChevronDown, X, AlertCircle, Zap, Building, Layers,
  PieChart as PieChartIcon, BarChart2, TrendingDown, Users
} from 'lucide-react';

// TypeScript interfaces
interface Post {
  platform: string;
  views: string;
  earned: number;
  status: 'approved' | 'pending' | 'denied';
  postUrl?: string;
  postDate?: string;
  hashtags?: string[];
  denialReason?: string;
  contentType: 'original' | 'repurposed';
}

interface CampaignRequirements {
  platforms: string[];
  contentGuidelines: string[];
  hashtags?: string[];
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

interface ConnectedAccount {
  username: string;
  followers: string;
}

interface PaymentMethod {
  type: 'bank' | 'paypal';
  last4?: string;
  email?: string;
  default: boolean;
}

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  connectedAccounts: {
    youtube?: ConnectedAccount;
    instagram?: ConnectedAccount;
    tiktok?: ConnectedAccount;
    twitter?: ConnectedAccount;
  };
  paymentMethods: PaymentMethod[];
}

interface CampaignDetailProps {
  campaign: Campaign | AvailableCampaign;
  onClose: () => void;
}

interface ProfileMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

// Sample data
const viewsData = [
  { date: 'Jan', views: 2.1, earnings: 4200 },
  { date: 'Feb', views: 3.4, earnings: 6800 },
  { date: 'Mar', views: 4.2, earnings: 8400 },
  { date: 'Apr', views: 6.8, earnings: 13600 },
  { date: 'May', views: 8.5, earnings: 17000 },
  { date: 'Jun', views: 12.3, earnings: 24600 }
];

// Enhanced with platform breakdown
const platformData = [
  { platform: 'TikTok', views: 14.5, percentage: 51.2 },
  { platform: 'Instagram', views: 8.3, percentage: 29.3 },
  { platform: 'YouTube', views: 4.2, percentage: 14.8 },
  { platform: 'X', views: 1.3, percentage: 4.7 }
];

// Enhanced with more detailed platform data
const platformPieData = [
  { name: 'TikTok', value: 51.2 },
  { name: 'Instagram', value: 29.3 },
  { name: 'YouTube', value: 14.8 },
  { name: 'X', value: 4.7 }
];

const COLORS = ['#FF4444', '#4287f5', '#31a952', '#b026ff'];

const activeCampaigns: Campaign[] = [
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
      hashtags: ["#NetflixAd", "#NetflixNewSeries"],
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
        postUrl: "https://tiktok.com/...",
        postDate: "2025-02-15",
        hashtags: ["#NetflixAd"],
        contentType: "original"
      },
      {
        platform: "Instagram",
        views: "320K",
        earned: 150,
        status: "pending",
        postUrl: "https://instagram.com/...",
        postDate: "2025-02-16",
        hashtags: ["#NetflixAd"],
        contentType: "original"
      },
      {
        platform: "TikTok",
        views: "150K",
        earned: 25,
        status: "denied",
        postUrl: "https://tiktok.com/...",
        postDate: "2025-02-17",
        hashtags: ["#NetflixAd"],
        denialReason: "Doesn't follow guidelines",
        contentType: "repurposed"
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
      hashtags: ["#SummerFashion", "#BrandPartner"],
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
        postUrl: "https://tiktok.com/...",
        postDate: "2025-02-12",
        hashtags: ["#SummerFashion"],
        contentType: "original"
      },
      {
        platform: "Instagram",
        views: "500K",
        earned: 300,
        status: "pending",
        postUrl: "https://instagram.com/...",
        postDate: "2025-02-14",
        hashtags: ["#SummerFashion", "#BrandPartner"],
        contentType: "original"
      }
    ]
  }
];

const availableCampaigns: AvailableCampaign[] = [
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
        "Include #NewAlbumDrop hashtag",
        "Minimum 15s duration"
      ],
      hashtags: ["#NewAlbumDrop"],
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
        "Personal reaction/review",
        "Use official hashtags",
        "Mention release date"
      ],
      hashtags: ["#MoviePremiere", "#OfficialHashtag"],
      minViewsForPayout: "500K",
      totalBudget: "$100,000",
      payoutRate: {
        original: "$1,000 per 1M views"
      }
    }
  }
];

const userProfile: UserProfile = {
  name: "Andrew Conklin",
  email: "andrew@create-os.com",
  avatar: "/api/placeholder/40/40",
  connectedAccounts: {
    youtube: { username: "AndrewConklin", followers: "250K" },
    instagram: { username: "AndrewConklin", followers: "180K" },
    tiktok: { username: "AndrewConklin", followers: "500K" },
    twitter: { username: "AndrewConklin", followers: "75K" }
  },
  paymentMethods: [
    { type: "bank", last4: "1234", default: true },
    { type: "paypal", email: "andrew@create-os.com", default: false }
  ]
};

// Animated background pattern from landing page
const BackgroundPattern = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <svg width="100%" height="100%" className="opacity-5">
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
      </pattern>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  </div>
);

// Custom tooltip component for charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 border border-white bg-black">
        <p className="text-white font-bold">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} style={{ color: entry.color || '#FFFFFF' }}>
            {entry.name}: {entry.value} {entry.name === 'views' ? 'M' : entry.unit || ''}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Helper function to get color based on platform
function getColorForPlatform(platform: string): string {
  switch (platform.toLowerCase()) {
    case 'youtube':
      return '#FF0000';
    case 'instagram':
      return '#E1306C';
    case 'tiktok':
      return '#69C9D0';
    case 'twitter':
      return '#1DA1F2';
    default:
      return '#FFFFFF';
  }
}

// Helper to check if the campaign is of type Campaign (has posts)
function isActiveCampaign(campaign: Campaign | AvailableCampaign): campaign is Campaign {
  return 'posts' in campaign && Array.isArray(campaign.posts);
}

// Enhanced ProfileMenu component with click outside functionality
const ProfileMenu: React.FC<ProfileMenuProps> = ({ isOpen, setIsOpen }) => {
  const menuRef = React.useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen]);
  
  if (!isOpen) return null;

  return (
    <motion.div
      ref={menuRef}
      className="absolute top-16 right-4 z-50 bg-black border rounded-lg shadow-lg p-4 w-64"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <div className="flex items-center gap-3 mb-4 pb-4 border-b">
        <img src={userProfile.avatar} alt="Profile" className="w-10 h-10 rounded-full" />
        <div>
          <p className="font-bold">{userProfile.name}</p>
          <p className="text-sm opacity-70">{userProfile.email}</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <motion.button
          className="w-full text-left p-2 rounded flex items-center gap-3 hover:bg-white hover:bg-opacity-10"
          whileHover={{ x: 5 }}
        >
          <Users className="h-4 w-4" />
          <span>Account Settings</span>
        </motion.button>
        
        <motion.button
          className="w-full text-left p-2 rounded flex items-center gap-3 hover:bg-white hover:bg-opacity-10"
          whileHover={{ x: 5 }}
        >
          <CreditCard className="h-4 w-4" />
          <span>Payment Methods</span>
        </motion.button>
        
        <motion.button
          className="w-full text-left p-2 rounded flex items-center gap-3 hover:bg-white hover:bg-opacity-10"
          whileHover={{ x: 5 }}
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

// Enhanced campaign detail modal with better mobile support
const CampaignDetail: React.FC<CampaignDetailProps> = memo(({ campaign, onClose }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-500 border-green-500';
      case 'denied':
        return 'text-red-500 border-red-500';
      default:
        return 'text-yellow-500 border-yellow-500';
    }
  };
  
  // Add effect to handle ESC key
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
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 z-[100]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose} // Close when clicking outside
    >
      <BackgroundPattern />
      
      <motion.div
        className="border p-4 md:p-8 rounded-lg w-full max-w-4xl bg-black custom-scrollbar overflow-y-auto max-h-[90vh] md:max-h-[85vh] relative"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl" />
        
        <div className="flex justify-between items-start mb-4 md:mb-6">
          <motion.h2 
            className="text-xl md:text-2xl font-bold pr-6"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {campaign.title}
          </motion.h2>
          <motion.button
            className="border p-2 rounded hover:bg-white hover:bg-opacity-20 absolute top-4 right-4 md:static z-[200]"
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="h-5 w-5" />
          </motion.button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:gap-6 mb-4 md:mb-6">
          <ContentTypeRates campaign={campaign} />

          {/* Unified Campaign Details & Requirements */}
          <motion.div 
            className="space-y-5 border p-4 rounded-lg bg-black bg-opacity-50 backdrop-blur-sm relative overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl" />
            
            <div className="flex justify-between items-center">
              <h3 className="text-lg md:text-xl font-bold">Campaign Details</h3>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 opacity-70" />
                <span className="text-sm">
                  Due: {new Date(campaign.endDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </div>
            
            {!isActiveCampaign(campaign) && (
              <div className="p-3 border border-yellow-600 bg-yellow-900 bg-opacity-20 rounded-lg">
                <p className="text-sm opacity-90">
                  <span className="font-bold">Note:</span> Please review all campaign details before applying. You can only select one content type.
                </p>
              </div>
            )}
            
            {/* Brand Information */}
            <div className="p-4 bg-white bg-opacity-5 rounded-lg">
              <h4 className="font-bold text-base mb-2">About {campaign.id === 1 ? 'Netflix' : campaign.id === 2 ? 'Fashion Nova' : campaign.id === 3 ? 'Universal Music' : 'Paramount Pictures'}</h4>
              <p className="text-sm">
                {campaign.id === 1 
                  ? 'Netflix is a streaming service offering a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices.'
                  : campaign.id === 2
                  ? 'Fashion Nova is an American fast fashion retail company known for its trendsetting styles and celebrity collaborations.'
                  : campaign.id === 3
                  ? 'Universal Music Group is a world leader in music-based entertainment, with a broad array of businesses engaged in recorded music, music publishing, and more.'
                  : 'Paramount Pictures, one of the oldest Hollywood studios, produces and distributes feature films for worldwide entertainment.'}
              </p>
            </div>
            
            {/* What You Need To Do */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-5 w-5 rounded-full bg-red-500 flex items-center justify-center text-sm font-bold">1</div>
                <h4 className="font-bold text-base">What You Need To Create</h4>
              </div>
              
              <ul className="list-disc pl-8 space-y-2 text-sm md:text-base">
                <li>Content must be published on: <span className="font-semibold">{campaign.requirements.platforms.join(', ')}</span></li>
                <li>You need at least <span className="font-semibold">{campaign.requirements.minViewsForPayout}</span> views for payment</li>
                {isActiveCampaign(campaign) ? (
                  <li>Your content type: <span className="font-semibold">{campaign.contentType === 'both' ? 'Original or Repurposed' : campaign.contentType.charAt(0).toUpperCase() + campaign.contentType.slice(1)}</span></li>
                ) : null}
              </ul>
            </div>
            
            {/* Guidelines */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-5 w-5 rounded-full bg-red-500 flex items-center justify-center text-sm font-bold">2</div>
                <h4 className="font-bold text-base">Content Guidelines</h4>
              </div>
              
              <ul className="list-disc pl-8 space-y-1 text-sm md:text-base">
                {campaign.requirements.contentGuidelines.map((guideline, i) => (
                  <li key={i}>{guideline}</li>
                ))}
              </ul>
            </div>
            
            {/* Hashtags */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-5 w-5 rounded-full bg-red-500 flex items-center justify-center text-sm font-bold">3</div>
                <h4 className="font-bold text-base">Required Hashtags</h4>
              </div>
              
              <div className="flex flex-wrap gap-2 ml-8">
                {campaign.requirements.hashtags?.map((hashtag, index) => (
                  <span 
                    key={hashtag} 
                    className="border px-2 py-1 rounded text-sm bg-white bg-opacity-5"
                  >
                    {hashtag}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Only show budget for "pot" campaigns - campaign ID #4 */}
            {campaign.id === 4 && (
              <div className="border border-yellow-600 bg-yellow-900 bg-opacity-10 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-5 w-5 rounded-full bg-yellow-600 flex items-center justify-center text-xs font-bold">$</div>
                  <h4 className="font-bold">Pot Campaign - Variable Payout</h4>
                </div>
                <p className="text-sm mb-2">Total Campaign Budget: <span className="font-bold">{campaign.requirements.totalBudget}</span></p>
                <div className="space-y-2 text-sm">
                  <p className="opacity-80">Unlike fixed-rate campaigns, pot campaigns distribute the total budget among all participating creators based on performance:</p>
                  <ul className="list-disc pl-5 space-y-1 opacity-80">
                    <li>Your earnings depend on your share of total campaign views</li>
                    <li>More participants means the budget is split among more creators</li>
                    <li>Your estimated payout = (Your Views ÷ Total Campaign Views) × Total Budget</li>
                  </ul>
                </div>
              </div>
            )}
            
            {/* Apply Button - Only for Available Campaigns */}
            {'postCount' in campaign.requirements && (
              <motion.button
                className="mt-4 w-full border p-2 rounded bg-gradient-to-r from-red-500 to-red-700 border-none text-white font-bold"
                whileHover={{ scale: 1.02, boxShadow: "0 0 10px rgba(255,68,68,0.5)" }}
                whileTap={{ scale: 0.98 }}
              >
                Apply For This Campaign
              </motion.button>
            )}
          </motion.div>

          {isActiveCampaign(campaign) && campaign.posts.length > 0 && (
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-lg md:text-xl font-bold">Posts</h3>
              <div className="grid grid-cols-1 gap-3 md:gap-4">
                {campaign.posts.map((post, i) => (
                  <motion.div 
                    key={i} 
                    className="border p-3 md:p-4 rounded relative overflow-hidden"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i + 0.4 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-white opacity-5 rounded-full blur-xl" />
                    
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-sm md:text-base">{post.platform}</span>
                      <span className={`px-2 py-0.5 rounded text-xs md:text-sm border ${getStatusColor(post.status)}`}>
                        {post.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:gap-4 mb-2">
                      <div>
                        <p className="text-xs md:text-sm opacity-70">Views</p>
                        <p className="font-bold text-sm md:text-base">{post.views}</p>
                      </div>
                      <div>
                        <p className="text-xs md:text-sm opacity-70">Earned</p>
                        <p className="font-bold text-sm md:text-base">${post.earned}</p>
                      </div>
                    </div>

                    <div className="text-xs md:text-sm space-y-1">
                      <p>Content Type: <span className="capitalize">{post.contentType}</span></p>
                      <p>Posted: {post.postDate && new Date(post.postDate).toLocaleDateString()}</p>
                      <p>Hashtags: {post.hashtags?.join(", ")}</p>
                      {post.status === 'denied' && post.denialReason && (
                        <motion.div 
                          className="mt-2 p-2 border border-red-500 rounded flex items-start gap-2"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.3 }}
                        >
                          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                          <p className="text-red-500">{post.denialReason}</p>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
});

CampaignDetail.displayName = 'CampaignDetail';

// Enhanced content type rates component with simplified selection
const ContentTypeRates: React.FC<{ campaign: Campaign | AvailableCampaign }> = ({ campaign }) => {
  const [selectedContentType, setSelectedContentType] = useState<'original' | 'repurposed'>(
    // For active campaigns, set the default based on the campaign's content type
    isActiveCampaign(campaign) ? 
      (campaign.contentType === 'both' ? 'original' : campaign.contentType) : 
      'original'
  );
  
  // Determine if this is an active campaign
  const isActive = isActiveCampaign(campaign);
  
  // Check if this is a pot campaign (ID #4)
  const isPotCampaign = campaign.id === 4;
  
  // Only show content types that match the campaign's content type for active campaigns
  const showOriginal = !isActive || 
                      (isActive && (campaign.contentType === 'original' || campaign.contentType === 'both') && selectedContentType === 'original');
  
  const showRepurposed = (!isActive && campaign.requirements.payoutRate.repurposed) || 
                         (isActive && (campaign.contentType === 'repurposed' || campaign.contentType === 'both') && selectedContentType === 'repurposed');
  
  return (
    <div className="space-y-4 border rounded-lg p-4 bg-black bg-opacity-50 backdrop-blur-sm relative overflow-hidden">
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl" />
      
      <h4 className="font-bold">{isPotCampaign ? 'Content Types & Pot Campaign' : 'Content Types & Rates'}</h4>
      
      {!isActive && (
        <p className="text-sm opacity-80 italic mb-2">
          Please review all campaign details below before applying. You can only select one content type per campaign.
        </p>
      )}
      
      <div className="space-y-4">
        {showOriginal && (
          <motion.div 
            className={`border rounded-lg p-4 bg-opacity-10 bg-white relative overflow-hidden ${selectedContentType === 'original' ? 'border-green-500' : ''}`}
            whileHover={!isActive ? { borderColor: "#31a952" } : {}}
            onClick={() => !isActive && setSelectedContentType('original')}
          >
            <div className="absolute -right-20 -top-20 w-32 h-32 bg-green-500 opacity-5 rounded-full blur-xl" />
            <div className="flex items-center gap-2 mb-2">
              {!isActive && (
                <input 
                  type="radio" 
                  id="original" 
                  name="contentType" 
                  checked={selectedContentType === 'original'} 
                  onChange={() => setSelectedContentType('original')}
                  className="text-green-500 focus:ring-green-500"
                />
              )}
              <label htmlFor="original" className="font-bold">Original Content</label>
              <span className="ml-auto border border-green-500 text-green-500 px-2 py-1 rounded text-sm">
                {isActive ? 'Active' : 'Available'}
              </span>
            </div>
            <p className="text-sm opacity-70 mb-2">Create unique content specifically for this campaign</p>
            {isPotCampaign ? (
              <div className="font-bold flex items-center gap-1">
                <span className="text-yellow-500">
                  <svg className="inline-block h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 16V12M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span>Variable payout (pot campaign)</span>
              </div>
            ) : (
              <p className="font-bold">{campaign.requirements.payoutRate.original}</p>
            )}
          </motion.div>
        )}

        {showRepurposed && campaign.requirements.payoutRate.repurposed && (
          <motion.div 
            className={`border rounded-lg p-4 bg-opacity-10 bg-white relative overflow-hidden ${selectedContentType === 'repurposed' ? 'border-blue-500' : ''}`}
            whileHover={!isActive ? { borderColor: "#4287f5" } : {}}
            onClick={() => !isActive && setSelectedContentType('repurposed')}
          >
            <div className="absolute -right-20 -top-20 w-32 h-32 bg-blue-500 opacity-5 rounded-full blur-xl" />
            <div className="flex items-center gap-2 mb-2">
              {!isActive && (
                <input 
                  type="radio" 
                  id="repurposed" 
                  name="contentType" 
                  checked={selectedContentType === 'repurposed'} 
                  onChange={() => setSelectedContentType('repurposed')}
                  className="text-blue-500 focus:ring-blue-500"
                />
              )}
              <label htmlFor="repurposed" className="font-bold">Repurposed Content</label>
              <span className="ml-auto border border-blue-500 text-blue-500 px-2 py-1 rounded text-sm">
                {isActive ? 'Active' : 'Available'}
              </span>
            </div>
            <p className="text-sm opacity-70 mb-2">Adapt existing content to fit campaign requirements</p>
            {isPotCampaign ? (
              <div className="font-bold flex items-center gap-1">
                <span className="text-yellow-500">
                  <svg className="inline-block h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 16V12M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span>Variable payout (pot campaign)</span>
              </div>
            ) : (
              <p className="font-bold">{campaign.requirements.payoutRate.repurposed}</p>
            )}
          </motion.div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t">
        <div className="flex items-center gap-2">
          <span className="text-sm opacity-70">Minimum Views:</span>
          <span className="font-bold">{campaign.requirements.minViewsForPayout}</span>
        </div>
        
        {isPotCampaign && (
          <div className="mt-2 text-sm text-yellow-400">
            <span className="font-bold">⚠️ Pot Campaign:</span> Payout varies based on campaign performance. See details below.
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced payment history component
const PaymentHistory: React.FC = () => {
  const paymentData = [
    { date: 'Feb 15, 2025', amount: 2500, method: 'PayPal', status: 'Completed' },
    { date: 'Jan 15, 2025', amount: 1800, method: 'Bank Transfer', status: 'Completed' },
    { date: 'Dec 15, 2024', amount: 3200, method: 'PayPal', status: 'Completed' },
    { date: 'Nov 15, 2024', amount: 1500, method: 'Bank Transfer', status: 'Completed' }
  ];

  return (
    <motion.div 
      className="border p-6 rounded-lg bg-black bg-opacity-50 backdrop-blur-sm relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl" />
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">PAYMENT HISTORY</h2>
        <motion.div
          className="flex items-center gap-2 border px-3 py-1 rounded text-sm"
          whileHover={{ scale: 1.05 }}
        >
          <Calendar className="h-4 w-4" />
          <select className="bg-transparent border-none outline-none">
            <option value="6M">Last 6 Months</option>
            <option value="1Y">Last Year</option>
            <option value="ALL">All Time</option>
          </select>
        </motion.div>
      </div>
      
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Date</th>
              <th className="text-left py-2">Amount</th>
              <th className="text-left py-2">Method</th>
              <th className="text-left py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {paymentData.map((payment, index) => (
              <motion.tr 
                key={index} 
                className="border-b"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
              >
                <td className="py-3">{payment.date}</td>
                <td className="py-3 font-bold">${payment.amount.toLocaleString()}</td>
                <td className="py-3">{payment.method}</td>
                <td className="py-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-900 bg-opacity-20 text-green-400 text-xs">
                    {payment.status}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <motion.button
        className="w-full border p-2 rounded mt-6 flex items-center justify-center gap-2"
        whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
        whileTap={{ scale: 0.98 }}
      >
        View All Transactions
      </motion.button>
    </motion.div>
  );
};

// Platform Stats component
const PlatformStats: React.FC = () => (
  <motion.div
    className="border p-6 rounded-lg backdrop-blur-sm relative overflow-hidden"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
  >
    <div className="absolute -right-20 -top-20 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl" />
    
    <h2 className="text-xl font-bold mb-6">PLATFORM BREAKDOWN</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={platformPieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
            >
              {platformPieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="space-y-4">
        {platformData.map((platform, index) => (
          <motion.div 
            key={platform.platform}
            className="border p-3 rounded flex items-center justify-between"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index + 0.3 }}
            whileHover={{ scale: 1.02, borderColor: getColorForPlatform(platform.platform) }}
          >
            <div className="flex items-center gap-3">
              {platform.platform === 'YouTube' && <Youtube className="h-5 w-5" />}
              {platform.platform === 'Instagram' && <Instagram className="h-5 w-5" />}
              {platform.platform === 'TikTok' && <svg className="h-5 w-5" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16.5 7.3c-.4-.1-.8-.1-1.2-.1-3 0-5.6 2-6.7 4.7-.3.7-.4 1.5-.4 2.3 0 3.3 2.7 6 6 6 .8 0 1.6-.1 2.3-.4.8-.3 1.5-.8 2-1.3.1-.1.1-.3.2-.4V9.9c0-.1 0-.3-.1-.4-.5-2.2-2.4-3.8-4.7-3.8-.4 0-.8 0-1.2.1-.3.1-.7.2-1 .4-.2.2-.4.4-.5.7-.1.3-.2.7-.2 1 0 1.4 1 2.6 2.4 2.6h.1V15c-.9 0-1.7-.1-2.5-.4-1.7-.6-3-2-3.6-3.7-.2-.6-.3-1.3-.3-2 0-1.5.5-2.9 1.4-4C7 3 8.4 2.3 9.9 2.1c1.5-.2 3.1 0 4.5.7 1.3.6 2.4 1.7 3 3 .1.1.2.2.3.2.1.1.3.1.4.1l.1-.1c.4-.4.6-.9.8-1.4.1-.5.2-1.1.1-1.6 0-.1-.1-.2-.3-.2z"/><path d="M16 18.4c-.1.2-.4.3-.6.3-1.7 0-3.1-1.4-3.1-3.1 0-.2.1-.4.3-.6.1-.1.3-.2.5-.1 1.7 0 3.1 1.4 3.1 3.1 0 .2-.1.4-.3.6 0 .1-.1.1-.2.1z"/></svg>}
              {platform.platform === 'X' && <Twitter className="h-5 w-5" />}
              <span>{platform.platform}</span>
            </div>
            <div className="text-right">
              <p className="font-bold">{platform.views}M</p>
              <p className="text-sm opacity-70">{platform.percentage}%</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.div>
);

// Enhanced available campaigns component
const AvailableCampaignsSection: React.FC<{
  campaigns: AvailableCampaign[],
  onCampaignClick: (campaign: Campaign | AvailableCampaign) => void
}> = ({ campaigns, onCampaignClick }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {campaigns.map((campaign, index) => (
      <motion.div
        key={campaign.id}
        className="border p-6 rounded-lg relative overflow-hidden overflow-x-hidden backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ scale: 1.02, borderColor: '#FF4444' }}
        onClick={() => onCampaignClick(campaign)}
      >
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl" />
        
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold">{campaign.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 bg-white bg-opacity-10 rounded-full text-xs text-green-400">
                {campaign.contentType === 'both' ? 'Original & Repurposed' : campaign.contentType.charAt(0).toUpperCase() + campaign.contentType.slice(1)}
              </span>
              <span className="px-2 py-0.5 bg-white bg-opacity-10 rounded-full text-xs text-blue-400">
                New
              </span>
            </div>
          </div>
          <motion.button
            className="border px-4 py-2 rounded flex items-center gap-2"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onCampaignClick(campaign);
            }}
          >
            Join <ArrowUpRight className="h-4 w-4" />
          </motion.button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm opacity-70">Payout Rates:</p>
            <p className="font-bold">Original: {campaign.requirements.payoutRate.original}</p>
            {campaign.requirements.payoutRate.repurposed && (
              <p className="font-bold">Repurposed: {campaign.requirements.payoutRate.repurposed}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm opacity-70">Budget</p>
              <p className="text-xl font-bold">{campaign.requirements.totalBudget}</p>
            </div>
            <div>
              <p className="text-sm opacity-70">Min. Views</p>
              <p className="text-xl font-bold">{campaign.requirements.minViewsForPayout}</p>
            </div>
          </div>

          <div>
            <p className="text-sm opacity-70">Campaign Brief:</p>
            <p className="text-sm mt-1 line-clamp-2 opacity-90">
              {campaign.id === 3 ? 
                "Create engaging content to promote a new artist's album launch across social media platforms." :
                "Produce reaction videos and reviews for upcoming movie premiere to build audience excitement."
              }
            </p>
          </div>

          <div>
            <p className="text-sm opacity-70">Platforms</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {campaign.requirements.platforms.map((platform) => (
                <motion.span
                  key={platform}
                  className="border px-2 py-1 rounded text-sm"
                  whileHover={{ borderColor: getColorForPlatform(platform) }}
                >
                  {platform}
                </motion.span>
              ))}
            </div>
          </div>

          <p className="text-sm opacity-70 flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Deadline: {new Date(campaign.endDate).toLocaleDateString()}
          </p>
        </div>
      </motion.div>
    ))}
  </div>
);

// Enhanced active campaigns component
const ActiveCampaigns: React.FC<{ 
  campaigns: Campaign[], 
  onCampaignClick: (campaign: Campaign | AvailableCampaign) => void 
}> = ({ campaigns, onCampaignClick }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {campaigns.map((campaign, index) => (
      <motion.div
        key={campaign.id}
        className="border p-6 rounded-lg cursor-pointer relative overflow-hidden overflow-x-hidden backdrop-blur-sm"
        onClick={() => onCampaignClick(campaign)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ scale: 1.02, borderColor: '#FF4444' }}
      >
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl" />
        
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold">{campaign.title}</h3>
          <span className="border px-2 py-1 rounded text-sm bg-green-900 bg-opacity-20 border-green-500 text-green-400">
            {campaign.status.toUpperCase()}
          </span>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm opacity-70">Earned</p>
              <p className="text-xl font-bold">${campaign.earned}</p>
            </div>
            <div>
              <p className="text-sm opacity-70">Pending</p>
              <p className="text-xl font-bold">${campaign.pendingPayout}</p>
            </div>
            <div>
              <p className="text-sm opacity-70">Views</p>
              <p className="text-xl font-bold">{campaign.views}</p>
            </div>
          </div>

          <div>
            <p className="text-sm opacity-70">Content Type:</p>
            <p className="capitalize font-medium">{campaign.contentType}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {campaign.requirements.platforms.map((platform) => (
              <motion.span 
                key={platform} 
                className="border px-2 py-1 rounded text-sm"
                whileHover={{ borderColor: getColorForPlatform(platform) }}
              >
                {platform}
              </motion.span>
            ))}
          </div>

          <p className="text-sm opacity-70 flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Ends: {new Date(campaign.endDate).toLocaleDateString()}
          </p>
        </div>
      </motion.div>
    ))}
  </div>
);

// Mobile optimized header
const DashboardHeader: React.FC<{
  timeFilter: string;
  setTimeFilter: (filter: string) => void;
}> = memo(({ timeFilter, setTimeFilter }) => {
  return (
    <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
      <div>
        <h1 className="text-2xl md:text-4xl font-bold mb-2">DASHBOARD</h1>
        <div className="flex items-center gap-4">
          <motion.div
            className="flex items-center gap-2 border px-3 py-1 rounded"
            whileHover={{ scale: 1.02, borderColor: "#4287f5" }}
          >
            <Calendar className="h-4 w-4" />
            <select
              className="bg-transparent border-none outline-none text-sm md:text-base"
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
            >
              <option value="7D">7 Days</option>
              <option value="1M">1 Month</option>
              <option value="3M">3 Months</option>
              <option value="6M">6 Months</option>
              <option value="1Y">1 Year</option>
              <option value="ALL">Lifetime</option>
            </select>
          </motion.div>
        </div>
      </div>

      <div className="relative">
        <motion.button
          className="flex items-center gap-2 border px-4 py-2 rounded bg-black"
          whileHover={{ scale: 1.02, borderColor: "#FF4444" }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden md:inline">Sign Out</span>
        </motion.button>
      </div>
    </div>
  );
});

DashboardHeader.displayName = 'DashboardHeader';

// Navigation Tabs Component
const NavigationTabs: React.FC<{
  activeView: 'campaigns' | 'analytics' | 'payments' | 'settings';
  setActiveView: (view: 'campaigns' | 'analytics' | 'payments' | 'settings') => void;
}> = memo(({ activeView, setActiveView }) => {
  return (
    <div className="mb-6 md:mb-8 flex overflow-x-auto custom-scrollbar border-b relative z-10">
      <motion.button
        className={`px-4 md:px-6 py-3 font-medium relative whitespace-nowrap ${activeView === 'campaigns' ? 'text-white' : 'text-gray-400'}`}
                  onClick={(e) => {
            e.stopPropagation();
            setActiveView('campaigns');
          }}
        whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
      >
        Campaigns
        {activeView === 'campaigns' && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
            layoutId="activeTab"
          />
        )}
      </motion.button>
      <motion.button
        className={`px-4 md:px-6 py-3 font-medium relative whitespace-nowrap ${activeView === 'analytics' ? 'text-white' : 'text-gray-400'}`}
                  onClick={(e) => {
            e.stopPropagation();
            setActiveView('analytics');
          }}
        whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
      >
        Analytics
        {activeView === 'analytics' && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
            layoutId="activeTab"
          />
        )}
      </motion.button>
      <motion.button
        className={`px-4 md:px-6 py-3 font-medium relative whitespace-nowrap ${activeView === 'payments' ? 'text-white' : 'text-gray-400'}`}
                  onClick={(e) => {
            e.stopPropagation();
            setActiveView('payments');
          }}
        whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
      >
        Payments
        {activeView === 'payments' && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
            layoutId="activeTab"
          />
        )}
      </motion.button>
      <motion.button
        className={`px-4 md:px-6 py-3 font-medium relative whitespace-nowrap ${activeView === 'settings' ? 'text-white' : 'text-gray-400'}`}
                  onClick={(e) => {
            e.stopPropagation();
            setActiveView('settings');
          }}
        whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
      >
        Settings
        {activeView === 'settings' && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
            layoutId="activeTab"
          />
        )}
      </motion.button>
    </div>
  );
});

NavigationTabs.displayName = 'NavigationTabs';

// Mobile optimized stats component
const StatsOverview: React.FC<{ totalPendingPayout: number }> = memo(({ totalPendingPayout }) => {
  const stats = [
    { icon: <Eye className="h-6 w-6 text-blue-400" />, label: "Total Views", value: "28.3M", trend: "+14.2%" },
    { icon: <DollarSign className="h-6 w-6 text-green-400" />, label: "Total Earned", value: "$74,600", trend: "+23.5%" },
    { icon: <Clock className="h-6 w-6 text-yellow-400" />, label: "Pending Payout", value: `${totalPendingPayout}`, trend: "+8.7%" },
    { icon: <TrendingUp className="h-6 w-6 text-red-400" />, label: "Active Campaigns", value: activeCampaigns.length.toString(), trend: "0%" }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8 relative z-10">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          className="border p-4 md:p-6 rounded-lg relative overflow-hidden backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          whileHover={{ scale: 1.02, borderColor: i === 0 ? '#4287f5' : i === 1 ? '#31a952' : i === 2 ? '#FFD700' : '#FF4444' }}
        >
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl" />
          
          <div className="flex items-center gap-3 mb-2 md:mb-4">
            {stat.icon}
            <span className="text-xs md:text-sm opacity-70">{stat.label}</span>
          </div>
          <div className="flex justify-between items-end">
            <p className="text-xl md:text-3xl font-bold">{stat.value}</p>
            <div className="text-xs md:text-sm flex items-center gap-1">
              {stat.trend.startsWith('+') ? (
                <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-green-400" />
              ) : stat.trend.startsWith('-') ? (
                <TrendingDown className="h-3 w-3 md:h-4 md:w-4 text-red-400" />
              ) : (
                <span className="h-3 w-3 md:h-4 md:w-4" />
              )}
              <span className={stat.trend.startsWith('+') ? 'text-green-400' : stat.trend.startsWith('-') ? 'text-red-400' : ''}>
                {stat.trend}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
});

StatsOverview.displayName = 'StatsOverview';

// Main component with fixed errors
export default function CreatorDashboard() {
  const [timeFilter, setTimeFilter] = useState('6M');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | AvailableCampaign | null>(null);
  const [activeView, setActiveView] = useState<'campaigns' | 'analytics' | 'payments' | 'settings'>('campaigns');


  // Calculate derived values once
  const totalPendingPayout = useMemo(() => 
    activeCampaigns.reduce((sum, campaign) => sum + campaign.pendingPayout, 0), 
    [activeCampaigns]
  );

  // Filter available campaigns based on search term
  const filteredAvailableCampaigns = useMemo(() => {
    if (!searchTerm) return availableCampaigns;
    
    const term = searchTerm.toLowerCase();
    return availableCampaigns.filter(campaign => 
      campaign.title.toLowerCase().includes(term) || 
      campaign.requirements.platforms.some(platform => platform.toLowerCase().includes(term))
    );
  }, [searchTerm, availableCampaigns]);

  // Optimize to skip rendering when not needed
  const renderCampaignView = useCallback(() => (
    <>
      {/* Active Campaigns */}
      <div className="mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-400" />
          ACTIVE CAMPAIGNS
        </h2>
        <ActiveCampaigns campaigns={activeCampaigns} onCampaignClick={setSelectedCampaign} />
      </div>

      {/* Available Campaigns */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-3">
          <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
            <Layers className="h-5 w-5 text-blue-400" />
            AVAILABLE CAMPAIGNS
          </h2>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <motion.div
              className="relative flex-1 sm:flex-none"
              whileHover={{ scale: 1.02 }}
            >
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search campaigns..."
                className="pl-10 pr-4 py-2 border rounded bg-transparent w-full sm:w-auto"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </motion.div>
            <motion.button
              className="border p-2 rounded"
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
              whileTap={{ scale: 0.98 }}
            >
              <Filter className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
        <AvailableCampaignsSection
          campaigns={filteredAvailableCampaigns}
          onCampaignClick={setSelectedCampaign}
        />
      </div>
    </>
  ), [activeCampaigns, filteredAvailableCampaigns, searchTerm, setSelectedCampaign]);

  return (
    <div className="min-h-screen bg-black p-3 md:p-6 relative">
      <BackgroundPattern />
      
      {/* Header with Profile */}
      <DashboardHeader 
        timeFilter={timeFilter} 
        setTimeFilter={setTimeFilter}
      />

      {/* Stats Overview */}
      <StatsOverview totalPendingPayout={totalPendingPayout} />

      {/* Navigation Tabs */}
      <NavigationTabs activeView={activeView} setActiveView={setActiveView} />

      <AnimatePresence mode="wait">
        {activeView === 'campaigns' && (
          <motion.div
            key="campaigns"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            {renderCampaignView()}
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
            <Suspense fallback={
              <div className="w-full p-10 flex justify-center">
                <div className="border p-6 rounded-lg inline-flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Loading analytics...</span>
                </div>
              </div>
            }>
              <AnalyticsView />
            </Suspense>
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

// Lazy loaded analytics components
const AnalyticsView = () => {
  return (
    <div className="relative z-10">
      {/* Enhanced Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        <motion.div
          className="border p-4 md:p-6 rounded-lg relative overflow-hidden backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          whileHover={{ borderColor: "#4287f5" }}
        >
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl" />
          
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-400" />
              VIEWS OVER TIME
            </h2>
            <motion.div
              className="flex items-center gap-2 border px-3 py-1 rounded text-xs"
              whileHover={{ scale: 1.05 }}
            >
              <select className="bg-transparent border-none outline-none">
                <option value="total">Total Views</option>
                <option value="platform">By Platform</option>
              </select>
            </motion.div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={viewsData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4287f5" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4287f5" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="#FFFFFF" />
                <YAxis stroke="#FFFFFF" />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="#4287f5"
                  fillOpacity={1}
                  fill="url(#colorViews)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          className="border p-4 md:p-6 rounded-lg relative overflow-hidden backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ borderColor: "#31a952" }}
        >
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl" />
          
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-400" />
              EARNINGS OVER TIME
            </h2>
            <motion.div
              className="flex items-center gap-2 border px-3 py-1 rounded text-xs"
              whileHover={{ scale: 1.05 }}
            >
              <select className="bg-transparent border-none outline-none">
                <option value="total">Total Earnings</option>
                <option value="campaign">By Campaign</option>
              </select>
            </motion.div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={viewsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="#FFFFFF" />
                <YAxis stroke="#FFFFFF" />
                <Tooltip 
                  content={<CustomTooltip />} 
                  cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                />
                <Bar 
                  dataKey="earnings" 
                  fill="#31a952" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
      
      {/* Platform Stats */}
      <PlatformStats />
      
      {/* Audience Demographics */}
      <motion.div
        className="border p-4 md:p-6 rounded-lg mt-4 md:mt-6 relative overflow-hidden backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl" />
        
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-400" />
            AUDIENCE DEMOGRAPHICS
          </h2>
          <motion.div
            className="flex items-center gap-2 border px-3 py-1 rounded text-xs"
            whileHover={{ scale: 1.05 }}
          >
            <select className="bg-transparent border-none outline-none">
              <option value="age">Age Groups</option>
              <option value="gender">Gender</option>
              <option value="location">Location</option>
            </select>
          </motion.div>
        </div>
        
        <div className="text-center p-6 md:p-12 border border-dashed opacity-50">
          <p>Audience data will be available once you connect more accounts</p>
          <motion.button
            className="mt-4 border px-4 py-2 rounded inline-flex items-center gap-2"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.98 }}
          >
            <Zap className="h-4 w-4" />
            Connect Accounts
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

// Payments view with optimized rendering
const PaymentsView = () => {
  return (
    <div className="relative z-10">
      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        <motion.div
          className="border p-4 md:p-6 rounded-lg relative overflow-hidden backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          whileHover={{ borderColor: "#31a952" }}
        >
          <div className="absolute -right-20 -top-20 w-40 h-40 bg-green-500 opacity-5 rounded-full blur-xl" />
          <h3 className="text-base md:text-lg font-medium mb-2">Total Earned</h3>
          <p className="text-2xl md:text-3xl font-bold">$74,600</p>
          <div className="mt-4 text-xs md:text-sm text-green-400 flex items-center gap-1">
            <TrendingUp className="h-3 w-3 md:h-4 md:w-4" />
            <span>+23.5% from last period</span>
          </div>
        </motion.div>
        
        <motion.div
          className="border p-4 md:p-6 rounded-lg relative overflow-hidden backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ borderColor: "#FFD700" }}
        >
          <div className="absolute -right-20 -top-20 w-40 h-40 bg-yellow-500 opacity-5 rounded-full blur-xl" />
          <h3 className="text-base md:text-lg font-medium mb-2">Pending Payout</h3>
          <p className="text-2xl md:text-3xl font-bold">${activeCampaigns.reduce((sum, campaign) => sum + campaign.pendingPayout, 0)}</p>
          <p className="mt-4 text-xs md:text-sm opacity-70">Expected on Mar 15, 2025</p>
        </motion.div>
        
        <motion.div
          className="border p-4 md:p-6 rounded-lg relative overflow-hidden backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ borderColor: "#4287f5" }}
        >
          <div className="absolute -right-20 -top-20 w-40 h-40 bg-blue-500 opacity-5 rounded-full blur-xl" />
          <h3 className="text-base md:text-lg font-medium mb-2">Average Per Campaign</h3>
          <p className="text-2xl md:text-3xl font-bold">$350</p>
          <div className="mt-4 text-xs md:text-sm text-green-400 flex items-center gap-1">
            <TrendingUp className="h-3 w-3 md:h-4 md:w-4" />
            <span>+12.1% from last period</span>
          </div>
        </motion.div>
      </div>
      
      {/* Enhanced Payment History */}
      <PaymentHistory />
      
      {/* Payment Methods Summary */}
      <motion.div
        className="border p-4 md:p-6 rounded-lg mt-6 md:mt-8 relative overflow-hidden backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl" />
        
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl font-bold">PAYMENT METHODS</h2>
          <motion.button
            className="border px-3 md:px-4 py-1.5 md:py-2 rounded flex items-center gap-2 text-sm"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.98 }}
          >
            <CreditCard className="h-3 w-3 md:h-4 md:w-4" />
            Add Method
          </motion.button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {userProfile.paymentMethods.map((method, index) => (
            <motion.div
              key={index}
              className="border p-3 md:p-4 rounded flex items-center justify-between"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index + 0.5 }}
              whileHover={{ scale: 1.02, borderColor: method.default ? "#31a952" : "#FFFFFF" }}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5" />
                <div>
                  <p className="font-medium text-sm md:text-base">
                    {method.type === 'bank' ? `Bank Account ****${method.last4}` : `PayPal ${method.email}`}
                  </p>
                  {method.default && (
                    <span className="text-xs bg-green-900 bg-opacity-30 text-green-400 px-2 py-0.5 rounded-full">
                      Default
                    </span>
                  )}
                </div>
              </div>
              <motion.button
                className="text-xs md:text-sm border px-2 md:px-3 py-1 md:py-1.5 rounded"
                whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                whileTap={{ scale: 0.95 }}
              >
                {method.default ? 'Edit' : 'Make Default'}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// Settings view component as a completely separate component with isolated state
const SettingsView = () => {
  // Local state for the settings tab navigation
  const [activeSettingsTab, setActiveSettingsTab] = useState<'profile' | 'security' | 'accounts' | 'payments'>('profile');
  const [userForm, setUserForm] = useState({
    name: userProfile.name,
    email: userProfile.email,
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // Here would be the API call to save profile changes
    alert('Profile saved successfully!');
  };
  
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // Here would be the API call to change password
    alert('Password changed successfully!');
  };

  // This renders the appropriate content based on the active settings tab
  const renderSettingsContent = () => {
    switch (activeSettingsTab) {
      case 'profile':
        return (
          <motion.div
            key="profile-settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <h2 className="text-xl font-bold mb-6">Profile Settings</h2>
            
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="md:w-1/3">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full mb-4 overflow-hidden relative group">
                    <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <motion.button
                        className="text-white text-xs px-2 py-1 border rounded"
                        whileHover={{ scale: 1.05 }}
                      >
                        Change Photo
                      </motion.button>
                    </div>
                  </div>
                  <p className="text-sm opacity-70 text-center max-w-xs">
                    Upload a square image for best results. Maximum size 5MB.
                  </p>
                </div>
              </div>
              
              <div className="md:w-2/3">
                <form onSubmit={handleSaveProfile}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm opacity-70 mb-1">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={userForm.name}
                        onChange={handleInputChange}
                        className="w-full bg-black border border-gray-700 p-2 rounded focus:border-red-500 focus:outline-none transition-colors"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm opacity-70 mb-1">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={userForm.email}
                        onChange={handleInputChange}
                        className="w-full bg-black border border-gray-700 p-2 rounded focus:border-red-500 focus:outline-none transition-colors"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm opacity-70 mb-1">Creator Bio</label>
                      <textarea
                        rows={4}
                        className="w-full bg-black border border-gray-700 p-2 rounded focus:border-red-500 focus:outline-none transition-colors custom-scrollbar"
                        placeholder="Tell brands about yourself..."
                      ></textarea>
                    </div>
                    
                    <div className="pt-4">
                      <motion.button
                        type="submit"
                        className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-700 rounded font-bold"
                        whileHover={{ scale: 1.02, boxShadow: "0 0 10px rgba(255,68,68,0.5)" }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Save Changes
                      </motion.button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        );
      
      case 'security':
        return (
          <motion.div
            key="security-settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <h2 className="text-xl font-bold mb-6">Security Settings</h2>
            
            <div className="max-w-xl">
              <form onSubmit={handlePasswordChange}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm opacity-70 mb-1">Current Password</label>
                    <input
                      type="password"
                      className="w-full bg-black border border-gray-700 p-2 rounded focus:border-red-500 focus:outline-none transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm opacity-70 mb-1">New Password</label>
                    <input
                      type="password"
                      className="w-full bg-black border border-gray-700 p-2 rounded focus:border-red-500 focus:outline-none transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm opacity-70 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      className="w-full bg-black border border-gray-700 p-2 rounded focus:border-red-500 focus:outline-none transition-colors"
                    />
                  </div>
                  
                  <div className="pt-4">
                    <motion.button
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-700 rounded font-bold"
                      whileHover={{ scale: 1.02, boxShadow: "0 0 10px rgba(255,68,68,0.5)" }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Update Password
                    </motion.button>
                  </div>
                </div>
              </form>
              
              <div className="mt-8 pt-8 border-t">
                <h3 className="text-lg font-bold mb-4">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Protect your account with 2FA</p>
                    <p className="text-sm opacity-70">Secure your account with an additional verification step.</p>
                  </div>
                  <motion.button
                    className="px-4 py-2 border rounded"
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                  >
                    Enable
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        );
      
      case 'accounts':
        return (
          <motion.div
            key="accounts-settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <h2 className="text-xl font-bold mb-6">Connected Accounts</h2>
            
            <div className="space-y-4">
              {Object.entries(userProfile.connectedAccounts).map(([platform, account]) => (
                <motion.div 
                  key={platform} 
                  className="border p-4 rounded-lg flex items-center justify-between"
                  whileHover={{ borderColor: getColorForPlatform(platform) }}
                >
                  <div className="flex items-center gap-4">
                    {platform === 'youtube' && <Youtube className="h-6 w-6 text-red-500" />}
                    {platform === 'instagram' && <Instagram className="h-6 w-6 text-pink-500" />}
                    {platform === 'tiktok' && <svg className="h-6 w-6 text-cyan-300" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16.5 7.3c-.4-.1-.8-.1-1.2-.1-3 0-5.6 2-6.7 4.7-.3.7-.4 1.5-.4 2.3 0 3.3 2.7 6 6 6 .8 0 1.6-.1 2.3-.4.8-.3 1.5-.8 2-1.3.1-.1.1-.3.2-.4V9.9c0-.1 0-.3-.1-.4-.5-2.2-2.4-3.8-4.7-3.8-.4 0-.8 0-1.2.1-.3.1-.7.2-1 .4-.2.2-.4.4-.5.7-.1.3-.2.7-.2 1 0 1.4 1 2.6 2.4 2.6h.1V15c-.9 0-1.7-.1-2.5-.4-1.7-.6-3-2-3.6-3.7-.2-.6-.3-1.3-.3-2 0-1.5.5-2.9 1.4-4C7 3 8.4 2.3 9.9 2.1c1.5-.2 3.1 0 4.5.7 1.3.6 2.4 1.7 3 3 .1.1.2.2.3.2.1.1.3.1.4.1l.1-.1c.4-.4.6-.9.8-1.4.1-.5.2-1.1.1-1.6 0-.1-.1-.2-.3-.2z"/><path d="M16 18.4c-.1.2-.4.3-.6.3-1.7 0-3.1-1.4-3.1-3.1 0-.2.1-.4.3-.6.1-.1.3-.2.5-.1 1.7 0 3.1 1.4 3.1 3.1 0 .2-.1.4-.3.6 0 .1-.1.1-.2.1z"/></svg>}
                    {platform === 'twitter' && <Twitter className="h-6 w-6 text-blue-400" />}
                    <div>
                      <p className="font-bold capitalize">{platform}</p>
                      <p className="text-sm">{account.username} ({account.followers} followers)</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      className="px-3 py-1 border rounded text-sm"
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                    >
                      Refresh
                    </motion.button>
                    <motion.button
                      className="px-3 py-1 border rounded text-sm"
                      whileHover={{ backgroundColor: "rgba(255,0,0,0.1)", borderColor: "rgba(255,0,0,0.5)" }}
                    >
                      Disconnect
                    </motion.button>
                  </div>
                </motion.div>
              ))}
              
              <motion.div 
                className="border border-dashed p-4 rounded-lg text-center"
                whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
              >
                <p className="mb-4">Connect another platform to earn more</p>
                <motion.button
                  className="px-4 py-2 border rounded inline-flex items-center gap-2"
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Zap className="h-4 w-4" />
                  Connect New Platform
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        );
      
      case 'payments':
        return (
          <motion.div
            key="payments-settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <h2 className="text-xl font-bold mb-6">Payment Methods</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userProfile.paymentMethods.map((method, index) => (
                  <motion.div
                    key={index}
                    className="border p-4 rounded-lg flex items-center justify-between"
                    whileHover={{ scale: 1.01, borderColor: method.default ? "#31a952" : "#FFFFFF" }}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-6 w-6" />
                      <div>
                        <p className="font-medium">
                          {method.type === 'bank' ? `Bank Account ****${method.last4}` : `PayPal ${method.email}`}
                        </p>
                        {method.default && (
                          <span className="text-xs bg-green-900 bg-opacity-30 text-green-400 px-2 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        className="px-3 py-1 border rounded text-sm"
                        whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                      >
                        Edit
                      </motion.button>
                      {!method.default && (
                        <motion.button
                          className="px-3 py-1 border rounded text-sm"
                          whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                        >
                          Make Default
                        </motion.button>
                      )}
                      <motion.button
                        className="px-3 py-1 border rounded text-sm"
                        whileHover={{ backgroundColor: "rgba(255,0,0,0.1)", borderColor: "rgba(255,0,0,0.5)" }}
                      >
                        Remove
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div>
                <h3 className="text-lg font-bold mb-4">Add Payment Method</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.button
                    className="border p-4 rounded-lg flex items-center gap-4"
                    whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.05)" }}
                  >
                    <CreditCard className="h-6 w-6" />
                    <div className="text-left">
                      <p className="font-medium">Add Bank Account</p>
                      <p className="text-sm opacity-70">Connect directly to your bank</p>
                    </div>
                  </motion.button>
                  
                  <motion.button
                    className="border p-4 rounded-lg flex items-center gap-4"
                    whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.05)" }}
                  >
                    <svg className="h-6 w-6 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7.144 19.532l1.049-5.751A5.978 5.978 0 016.3 10.286c0-3.316 2.694-6 6.022-6 3.328 0 6.022 2.684 6.022 6 0 3.316-2.694 6-6.022 6-1.269 0-2.447-.395-3.41-1.059l-6.051 1.343a.391.391 0 01-.448-.432l.732-2.606z" />
                    </svg>
                    <div className="text-left">
                      <p className="font-medium">Add PayPal</p>
                      <p className="text-sm opacity-70">Link your PayPal account</p>
                    </div>
                  </motion.button>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t">
                <h3 className="text-lg font-bold mb-4">Payout Preferences</h3>
                
                <div className="max-w-xl">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm opacity-70 mb-1">Minimum Payout Amount</label>
                      <select className="w-full bg-black border border-gray-700 p-2 rounded focus:border-red-500 focus:outline-none transition-colors">
                        <option>$50</option>
                        <option>$100</option>
                        <option>$250</option>
                        <option>$500</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm opacity-70 mb-1">Payout Frequency</label>
                      <select className="w-full bg-black border border-gray-700 p-2 rounded focus:border-red-500 focus:outline-none transition-colors">
                        <option>Monthly (15th)</option>
                        <option>Bi-weekly</option>
                        <option>Weekly</option>
                      </select>
                    </div>
                    
                    <div className="pt-4">
                      <motion.button
                        className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-700 rounded font-bold"
                        whileHover={{ scale: 1.02, boxShadow: "0 0 10px rgba(255,68,68,0.5)" }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Save Preferences
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="relative z-10">
      <motion.div
        className="border rounded-lg overflow-hidden backdrop-blur-sm relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl" />
      
        {/* Settings tabs navigation */}
        <div className="flex overflow-x-auto custom-scrollbar border-b">
          <button
            className={`px-4 py-3 font-medium whitespace-nowrap relative ${activeSettingsTab === 'profile' ? 'text-white' : 'text-gray-400'}`}
            onClick={() => setActiveSettingsTab('profile')}
          >
            Profile
            {activeSettingsTab === 'profile' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
            )}
          </button>
          <button
            className={`px-4 py-3 font-medium whitespace-nowrap relative ${activeSettingsTab === 'security' ? 'text-white' : 'text-gray-400'}`}
            onClick={() => setActiveSettingsTab('security')}
          >
            Security
            {activeSettingsTab === 'security' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
            )}
          </button>
          <button
            className={`px-4 py-3 font-medium whitespace-nowrap relative ${activeSettingsTab === 'accounts' ? 'text-white' : 'text-gray-400'}`}
            onClick={() => setActiveSettingsTab('accounts')}
          >
            Accounts
            {activeSettingsTab === 'accounts' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
            )}
          </button>
          <button
            className={`px-4 py-3 font-medium whitespace-nowrap relative ${activeSettingsTab === 'payments' ? 'text-white' : 'text-gray-400'}`}
            onClick={() => setActiveSettingsTab('payments')}
          >
            Payments
            {activeSettingsTab === 'payments' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
            )}
          </button>
        </div>
      
        {/* Settings content */}
        <div className="p-6">
          {renderSettingsContent()}
        </div>
      </motion.div>
    </div>
  );
};