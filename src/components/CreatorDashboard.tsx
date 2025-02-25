import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  DollarSign,
  Eye,
  Calendar,
  TrendingUp,
  Filter,
  Search,
  ArrowUpRight,
  Clock,
  Youtube,
  Instagram,
  Twitter,
  CreditCard,
  LogOut,
  ChevronDown,
  X,
  AlertCircle
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

interface Campaign {
  id: number;
  title: string;
  earned: number;
  pendingPayout: number;
  views: string;
  endDate: string;
  status: string;
  contentType: 'original' | 'repurposed' | 'both';
  requirements: {
    platforms: string[];
    contentGuidelines: string[];
    hashtags?: string[];
    minViewsForPayout?: string;
    totalBudget?: string; // Added totalBudget
    payoutRate: {
      original: string;
      repurposed?: string;
    };
  };
  posts: Post[];
}

interface AvailableCampaign extends Omit<Campaign, 'earned' | 'pendingPayout' | 'posts'> {
    requirements: {
        platforms: string[];
        contentGuidelines: string[];
        hashtags?: string[];
        minViewsForPayout?: string;
        totalBudget?: string;
        payoutRate: {
            original: string;
            repurposed?: string;
        };
        postCount: number; // Added postCount for AvailableCampaigns
    }
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

// Sample data
const viewsData = [
  { date: 'Jan', views: 2.1, earnings: 4200 },
  { date: 'Feb', views: 3.4, earnings: 6800 },
  { date: 'Mar', views: 4.2, earnings: 8400 },
  { date: 'Apr', views: 6.8, earnings: 13600 },
  { date: 'May', views: 8.5, earnings: 17000 },
  { date: 'Jun', views: 12.3, earnings: 24600 }
];

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
      totalBudget: "$25,000", // Example value
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
  }
];

const availableCampaigns: AvailableCampaign[] = [
  {
    id: 3,
    title: "New Artist Album",
    views: "0", // Added, though not used directly in AvailableCampaignsSection
    endDate: "2025-04-01",
    status: "available", //  Important for consistency
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
    views: "0", // Added, though not used directly in AvailableCampaignsSection
    endDate: "2025-03-25",
    status: "available",  // Important for consistency
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
  avatar: "/api/placeholder/40/40",  // Placeholder, ensure your API endpoint exists
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

interface ProfileMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ isOpen, setIsOpen }) => {
  const [activeTab, setActiveTab] = useState<'accounts' | 'payment' | 'settings'>('accounts');

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      <motion.div
        className="absolute right-0 top-full mt-2 w-[32rem] border rounded-lg bg-black p-6 shadow-lg z-50"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: isOpen ? 'block' : 'none' }}
      >
        <div className="flex items-center gap-3 pb-4 border-b">
          <img
            src={userProfile.avatar}
            alt="Profile"
            className="w-10 h-10 rounded-full flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="font-bold truncate">{userProfile.name}</p>
            <p className="text-sm opacity-70 truncate">{userProfile.email}</p>
          </div>
        </div>

        <div className="flex gap-2 my-4 border-b">
          <button
            className={`px-4 py-2 text-sm ${activeTab === 'accounts' ? 'border-b-2 border-white' : ''}`}
            onClick={() => setActiveTab('accounts')}
          >
            Accounts
          </button>
          <button
            className={`px-4 py-2 text-sm ${activeTab === 'payment' ? 'border-b-2 border-white' : ''}`}
            onClick={() => setActiveTab('payment')}
          >
            Payment
          </button>
          <button
            className={`px-4 py-2 text-sm ${activeTab === 'settings' ? 'border-b-2 border-white' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </div>

        <div className="h-auto max-h-[calc(100vh-16rem)] overflow-y-auto">
          <div className="space-y-4 w-full">
            {activeTab === 'accounts' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold">Connected Accounts</h3>
                {Object.entries(userProfile.connectedAccounts).map(([platform, data]) => (
                  data && (
                    <div key={platform} className="flex items-center justify-between p-4 border rounded">
                      <div className="flex items-center gap-3 min-w-0">
                        {platform === 'youtube' && <Youtube className="h-5 w-5 flex-shrink-0" />}
                        {platform === 'instagram' && <Instagram className="h-5 w-5 flex-shrink-0" />}
                        {platform === 'tiktok' && <svg className="h-5 w-5 flex-shrink-0"  width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><path d="M16.5 7.3c-.4-.1-.8-.1-1.2-.1-3 0-5.6 2-6.7 4.7-.3.7-.4 1.5-.4 2.3 0 3.3 2.7 6 6 6 .8 0 1.6-.1 2.3-.4.8-.3 1.5-.8 2-1.3.1-.1.1-.3.2-.4V9.9c0-.1 0-.3-.1-.4-.5-2.2-2.4-3.8-4.7-3.8-.4 0-.8 0-1.2.1-.3.1-.7.2-1 .4-.2.2-.4.4-.5.7-.1.3-.2.7-.2 1 0 1.4 1 2.6 2.4 2.6h.1V15c-.9 0-1.7-.1-2.5-.4-1.7-.6-3-2-3.6-3.7-.2-.6-.3-1.3-.3-2 0-1.5.5-2.9 1.4-4C7 3 8.4 2.3 9.9 2.1c1.5-.2 3.1 0 4.5.7 1.3.6 2.4 1.7 3 3 .1.1.2.2.3.2.1.1.3.1.4.1l.1-.1c.4-.4.6-.9.8-1.4.1-.5.2-1.1.1-1.6 0-.1-.1-.2-.3-.2zm-.5 11.1c-.1.2-.4.3-.6.3-1.7 0-3.1-1.4-3.1-3.1 0-.2.1-.4.3-.6.1-.1.3-.2.5-.1 1.7 0 3.1 1.4 3.1 3.1 0 .2-.1.4-.3.6 0 .1-.1.1-.2.1z"/></svg>}
                        {platform === 'twitter' && <Twitter className="h-5 w-5 flex-shrink-0" />}
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{data.username}</p>
                          <p className="text-sm opacity-70 truncate">{data.followers} followers</p>
                        </div>
                      </div>
                      <button className="ml-4 text-sm border px-4 py-1.5 rounded flex-shrink-0">
                        Disconnect
                      </button>
                    </div>
                  )
                ))}
                <button className="w-full border p-2.5 rounded">
                  Connect New Account
                </button>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold">Payment Methods</h3>
                {userProfile.paymentMethods.map((method, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded">
                    <div className="flex items-center gap-3 min-w-0">
                      <CreditCard className="h-5 w-5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">
                          {method.type === 'bank' ? `Bank Account ****${method.last4}` : `PayPal ${method.email}`}
                        </p>
                        {method.default && (
                          <span className="text-sm opacity-70">Default</span>
                        )}
                      </div>
                    </div>
                    <button className="ml-4 text-sm border px-4 py-1.5 rounded flex-shrink-0">
                      {method.default ? 'Default' : 'Make Default'}
                    </button>
                  </div>
                ))}
                <button className="w-full border p-2.5 rounded">
                  Add Payment Method
                </button>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold">Account Settings</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm">Email Address</label>
                    <input
                      type="email"
                      value={userProfile.email}
                      className="w-full bg-transparent border rounded p-2.5"
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm">Current Password</label>
                    <input
                      type="password"
                      className="w-full bg-transparent border rounded p-2.5"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm">New Password</label>
                    <input
                      type="password"
                      className="w-full bg-transparent border rounded p-2.5"
                    />
                  </div>
                  <button className="w-full border p-2.5 rounded">
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          className="w-full border p-2.5 rounded mt-4 flex items-center justify-center gap-2"
          onClick={() => setIsOpen(false)}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </motion.div>
    </>
  );
};



const PaymentHistory: React.FC = () => (
  <div className="border p-6 rounded-lg">
    <h2 className="text-xl font-bold mb-6">PAYMENT HISTORY</h2>
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
        <tr className="border-b">
          <td className="py-2">Feb 15, 2025</td>
          <td className="py-2">$2,500</td>
          <td className="py-2">PayPal</td>
          <td className="py-2">Completed</td>
        </tr>
        <tr className="border-b">
          <td className="py-2">Jan 15, 2025</td>
          <td className="py-2">$1,800</td>
          <td className="py-2">Bank Transfer</td>
          <td className="py-2">Completed</td>
        </tr>
      </tbody>
    </table>
  </div>
);

const ContentTypeRates: React.FC<{ campaign: Campaign | AvailableCampaign }> = ({ campaign }) => (
    <div className="space-y-4 border rounded-lg p-4">
      <h4 className="font-bold">Content Types & Rates</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-lg p-4 bg-opacity-10 bg-white">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold">Original Content</span>
            <span className="border border-green-500 text-green-500 px-2 py-1 rounded text-sm">
              Active
            </span>
          </div>
          <p className="text-sm opacity-70 mb-2">Create unique content specifically for this campaign</p>
          <p className="font-bold">{campaign.requirements.payoutRate.original}</p>
        </div>

        {campaign.requirements.payoutRate.repurposed && (
          <div className="border rounded-lg p-4 bg-opacity-10 bg-white">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold">Repurposed Content</span>
              <span className="border border-blue-500 text-blue-500 px-2 py-1 rounded text-sm">
                Available
              </span>
            </div>
            <p className="text-sm opacity-70 mb-2">Adapt existing content to fit campaign requirements</p>
            <p className="font-bold">{campaign.requirements.payoutRate.repurposed}</p>
          </div>
        )}
      </div>

      <div className="mt-4 border-t pt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm opacity-70">Minimum Views:</span>
          <span className="font-bold">{campaign.requirements.minViewsForPayout}</span>
        </div>
      </div>
    </div>
);

// Updated CampaignDetail component
const CampaignDetail: React.FC<CampaignDetailProps> = ({ campaign, onClose }) => {
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

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-6 z-50">
            <motion.div
                className="border p-8 rounded-lg w-full max-w-4xl bg-black overflow-y-auto max-h-[90vh]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex justify-between items-start mb-6">
                    <h2 className="text-2xl font-bold">{campaign.title}</h2>
                    <button
                        className="border p-2 rounded hover:bg-white hover:bg-opacity-10"
                        onClick={onClose}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-6 mb-6">
                    <ContentTypeRates campaign={campaign} />

                    <div className="space-y-4">
                        <h3 className="text-xl font-bold">Campaign Requirements</h3>

                        <div>
                            <p className="font-bold mb-2">Required Hashtags:</p>
                            <div className="flex gap-2 flex-wrap">
                                {campaign.requirements.hashtags?.map(hashtag => (
                                    <span key={hashtag} className="border px-2 py-1 rounded">{hashtag}</span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="font-bold mb-2">Platforms:</p>
                            <div className="flex gap-2">
                                {campaign.requirements.platforms.map(platform => (
                                    <span key={platform} className="border px-2 py-1 rounded">{platform}</span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="font-bold mb-2">Content Guidelines:</p>
                            <ul className="list-disc pl-4 space-y-2">
                                {campaign.requirements.contentGuidelines.map((guideline, i) => (
                                    <li key={i}>{guideline}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {'posts' in campaign && (
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold">Posts</h3>
                            {campaign.posts.map((post, i) => (
                                <div key={i} className="border p-4 rounded">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold">{post.platform}</span>
                                        <span className={`px-2 py-1 rounded text-sm border ${getStatusColor(post.status)}`}>
                                            {post.status.toUpperCase()}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-2">
                                        <div>
                                            <p className="text-sm opacity-70">Views</p>
                                            <p className="font-bold">{post.views}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm opacity-70">Earned</p>
                                            <p className="font-bold">${post.earned}</p>
                                        </div>
                                    </div>

                                    <div className="text-sm space-y-1">
                                        <p>Content Type: <span className="capitalize">{post.contentType}</span></p>
                                        <p>Posted: {post.postDate && new Date(post.postDate).toLocaleDateString()}</p>
                                        <p>Hashtags: {post.hashtags?.join(", ")}</p>
                                        {post.status === 'denied' && post.denialReason && (
                                            <div className="mt-2 p-2 border border-red-500 rounded flex items-start gap-2">
                                                <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                                                <p className="text-red-500">{post.denialReason}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

// Updated the main ActiveCampaigns section in CreatorDashboard
const ActiveCampaigns: React.FC<{ campaigns: Campaign[], onCampaignClick: (campaign: Campaign | AvailableCampaign) => void }> = ({ campaigns, onCampaignClick }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {campaigns.map((campaign) => (
      <motion.div
        key={campaign.id}
        className="border p-6 rounded-lg cursor-pointer"
        onClick={() => onCampaignClick(campaign)}
        whileHover={{ scale: 1.01 }}
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold">{campaign.title}</h3>
          <span className="border px-2 py-1 rounded text-sm">
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
              <span key={platform} className="border px-2 py-1 rounded text-sm">
                {platform}
              </span>
            ))}
          </div>

          <p className="text-sm opacity-70">
            Ends: {new Date(campaign.endDate).toLocaleDateString()}
          </p>
        </div>
      </motion.div>
    ))}
  </div>
);


// Available Campaigns section
const AvailableCampaignsSection: React.FC<{
    campaigns: AvailableCampaign[],
    onCampaignClick: (campaign: Campaign | AvailableCampaign) => void
}> = ({ campaigns, onCampaignClick }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campaigns.map((campaign) => (
            <motion.div
                key={campaign.id}
                className="border p-6 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
                onClick={() => onCampaignClick(campaign)}
            >
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold">{campaign.title}</h3>
                    <motion.button
                        className="border px-4 py-2 rounded flex items-center gap-2"
                        whileHover={{ scale: 1.02 }}
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
                    </div>

                    <div>
                        <p className="text-sm opacity-70">Content Type:</p>
                        <p className="capitalize font-medium">{campaign.contentType}</p>
                    </div>

                    <div>
                        <p className="text-sm opacity-70">Platforms</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {campaign.requirements.platforms.map((platform) => (
                                <span
                                    key={platform}
                                    className="border px-2 py-1 rounded text-sm"
                                >
                                    {platform}
                                </span>
                            ))}
                        </div>
                    </div>

                    <p className="text-sm opacity-70">
                        Deadline: {new Date(campaign.endDate).toLocaleDateString()}
                    </p>
                </div>
            </motion.div>
        ))}
    </div>
);

export default function CreatorDashboard() {
  const [timeFilter, setTimeFilter] = useState('6M');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | AvailableCampaign | null>(null); // Updated type
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const totalPendingPayout = activeCampaigns.reduce((sum, campaign) => sum + campaign.pendingPayout, 0);

  return (
    <div className="min-h-screen bg-black p-6">
      {/* Header with Profile */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold mb-2">DASHBOARD</h1>
          <div className="flex items-center gap-4">
            <motion.div
              className="flex items-center gap-2 border px-3 py-1 rounded"
              whileHover={{ scale: 1.02 }}
            >
              <Calendar className="h-4 w-4" />
              <select
                className="bg-transparent border-none outline-none"
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
            className="flex items-center gap-2 border px-4 py-2 rounded"
            whileHover={{ scale: 1.02 }}
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <img
              src={userProfile.avatar}
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
            <span>{userProfile.name}</span>
            <ChevronDown className="h-4 w-4" />
          </motion.button>

          <ProfileMenu
            isOpen={isProfileOpen}
            setIsOpen={setIsProfileOpen}
          />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { icon: <Eye className="h-6 w-6" />, label: "Total Views", value: "28.3M" },
          { icon: <DollarSign className="h-6 w-6" />, label: "Total Earned", value: "$74,600" },
          { icon: <Clock className="h-6 w-6" />, label: "Pending Payout", value: `$${totalPendingPayout}` },
          { icon: <TrendingUp className="h-6 w-6" />, label: "Active Campaigns", value: activeCampaigns.length.toString() }
        ].map((stat, i) => (
          <motion.div
            key={i}
            className="border p-6 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              {stat.icon}
              <span className="text-sm opacity-70">{stat.label}</span>
            </div>
            <p className="text-3xl font-bold">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Active Campaigns */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">ACTIVE CAMPAIGNS</h2>
        <ActiveCampaigns campaigns={activeCampaigns} onCampaignClick={setSelectedCampaign} />
      </div>

      {/* Available Campaigns */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">AVAILABLE CAMPAIGNS</h2>
          <div className="flex items-center gap-4">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.02 }}
            >
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search campaigns..."
                className="pl-10 pr-4 py-2 border rounded bg-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </motion.div>
            <motion.button
              className="border p-2 rounded"
              whileHover={{ scale: 1.02 }}
            >
              <Filter className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
        <AvailableCampaignsSection
          campaigns={availableCampaigns}
          onCampaignClick={setSelectedCampaign}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <motion.div
          className="border p-6 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 className="text-xl font-bold mb-6">VIEWS OVER TIME</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={viewsData}>
                <XAxis dataKey="date" stroke="#FFFFFF" />
                <YAxis stroke="#FFFFFF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111',
                    border: '1px solid #FFFFFF'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#FFFFFF"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          className="border p-6 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 className="text-xl font-bold mb-6">EARNINGS OVER TIME</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={viewsData}>
                <XAxis dataKey="date" stroke="#FFFFFF" />
                <YAxis stroke="#FFFFFF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111',
                    border: '1px solid #FFFFFF'
                  }}
                />
                <Bar dataKey="earnings" fill="#FFFFFF" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
      {/* Add Payment History section */}
      <div className="mt-8">
      <PaymentHistory />
    </div>

    {/* Campaign Detail Modal */}
    {selectedCampaign && (
      <CampaignDetail
        campaign={selectedCampaign}
        onClose={() => setSelectedCampaign(null)}
      />
    )}
  </div>
);
}