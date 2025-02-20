import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Zap, 
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
  ChevronDown
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// TypeScript interfaces
interface Post {
  platform: string;
  views: string;
  earned: number;
  status: 'approved' | 'pending';
}

interface Campaign {
  id: number;
  title: string;
  progress: number;
  earned: number;
  pendingPayout: number;
  views: string;
  endDate: string;
  status: string;
  requirements: {
    postCount: number;
    platforms: string[];
    contentGuidelines: string[];
  };
  posts: Post[];
}

interface AvailableCampaign {
  id: number;
  title: string;
  payout: string;
  minViews: string;
  deadline: string;
  platforms: string[];
  requirements: {
    postCount: number;
    contentGuidelines: string[];
  };
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
    youtube: ConnectedAccount;
    instagram: ConnectedAccount;
    tiktok: ConnectedAccount;
    twitter: ConnectedAccount;
  };
  paymentMethods: PaymentMethod[];
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
    progress: 68,
    earned: 3200,
    pendingPayout: 1800,
    views: "820K",
    endDate: "2025-03-15",
    status: "active",
    requirements: {
      postCount: 5,
      platforms: ["TikTok", "Instagram"],
      contentGuidelines: [
        "Show series poster in first 3 seconds",
        "Use official hashtags #NetflixNewSeries",
        "Include link in bio",
        "Minimum 30s duration"
      ]
    },
    posts: [
      { platform: "TikTok", views: "500K", earned: 2000, status: "approved" },
      { platform: "Instagram", views: "320K", earned: 1200, status: "pending" }
    ]
  },
  {
    id: 2,
    title: "Gaming Stream Promo",
    progress: 45,
    earned: 1800,
    pendingPayout: 900,
    views: "450K",
    endDate: "2025-03-20",
    status: "active",
    requirements: {
      postCount: 3,
      platforms: ["YouTube", "TikTok"],
      contentGuidelines: [
        "Gameplay footage must be HD quality",
        "Mention key features",
        "Show Call-to-Action overlay",
        "Minimum 60s duration"
      ]
    },
    posts: [
      { platform: "YouTube", views: "250K", earned: 1000, status: "approved" },
      { platform: "TikTok", views: "200K", earned: 800, status: "pending" }
    ]
  }
];

const availableCampaigns: AvailableCampaign[] = [
  {
    id: 3,
    title: "New Artist Album",
    payout: "$500 per 1M views",
    minViews: "100K",
    deadline: "2025-04-01",
    platforms: ["TikTok", "Instagram"],
    requirements: {
      postCount: 4,
      contentGuidelines: [
        "Feature album artwork",
        "Use artist's music in background",
        "Include #NewAlbumDrop hashtag",
        "Minimum 15s duration"
      ]
    }
  },
  {
    id: 4,
    title: "Movie Premiere",
    payout: "Share of $100K pool",
    minViews: "500K",
    deadline: "2025-03-25",
    platforms: ["TikTok", "YouTube"],
    requirements: {
      postCount: 6,
      contentGuidelines: [
        "Show movie trailer clips",
        "Personal reaction/review",
        "Use official hashtags",
        "Mention release date"
      ]
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

interface ProfileMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ isOpen, setIsOpen }) => {
  const [activeTab, setActiveTab] = useState<'accounts' | 'payment' | 'settings'>('accounts');

  const MenuContent: React.FC = () => {
    switch (activeTab) {
      case 'accounts':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-4">Connected Accounts</h3>
            {Object.entries(userProfile.connectedAccounts).map(([platform, data]) => (
              <div key={platform} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  {platform === 'youtube' && <Youtube className="h-5 w-5" />}
                  {platform === 'instagram' && <Instagram className="h-5 w-5" />}
                  {platform === 'tiktok' && <Twitter className="h-5 w-5" />}
                  {platform === 'twitter' && <Twitter className="h-5 w-5" />}
                  <div>
                    <p className="font-medium">{data.username}</p>
                    <p className="text-sm opacity-70">{data.followers} followers</p>
                  </div>
                </div>
                <button className="text-sm border px-3 py-1 rounded">
                  Disconnect
                </button>
              </div>
            ))}
            <button className="w-full border p-2 rounded mt-4">
              Connect New Account
            </button>
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-4">Payment Methods</h3>
            {userProfile.paymentMethods.map((method, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5" />
                  <div>
                    <p className="font-medium">
                      {method.type === 'bank' ? `Bank Account ****${method.last4}` : `PayPal ${method.email}`}
                    </p>
                    {method.default && (
                      <span className="text-sm opacity-70">Default</span>
                    )}
                  </div>
                </div>
                <button className="text-sm border px-3 py-1 rounded">
                  {method.default ? 'Default' : 'Make Default'}
                </button>
              </div>
            ))}
            <button className="w-full border p-2 rounded mt-4">
              Add Payment Method
            </button>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-4">Account Settings</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm">Email Address</label>
                <input
                  type="email"
                  value={userProfile.email}
                  className="w-full bg-transparent border rounded p-2"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm">Current Password</label>
                <input
                  type="password"
                  className="w-full bg-transparent border rounded p-2"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm">New Password</label>
                <input
                  type="password"
                  className="w-full bg-transparent border rounded p-2"
                />
              </div>
              <button className="w-full border p-2 rounded mt-4">
                Save Changes
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };


  return (
    <>
      <div 
        className="fixed inset-0 z-40"
        onClick={() => setIsOpen(false)}
      />
      
      <motion.div
        className="absolute right-0 top-full mt-2 w-[32rem] border rounded-lg bg-black p-6 shadow-lg z-50"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
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
            className={`px-4 py-2 text-sm ${activeTab === 'accounts' ? 'border-b-2' : ''}`}
            onClick={() => setActiveTab('accounts')}
          >
            Accounts
          </button>
          <button
            className={`px-4 py-2 text-sm ${activeTab === 'payment' ? 'border-b-2' : ''}`}
            onClick={() => setActiveTab('payment')}
          >
            Payment
          </button>
          <button
            className={`px-4 py-2 text-sm ${activeTab === 'settings' ? 'border-b-2' : ''}`}
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
                  <div key={platform} className="flex items-center justify-between p-4 border rounded">
                    <div className="flex items-center gap-3 min-w-0">
                      {platform === 'youtube' && <Youtube className="h-5 w-5 flex-shrink-0" />}
                      {platform === 'instagram' && <Instagram className="h-5 w-5 flex-shrink-0" />}
                      {platform === 'tiktok' && <Twitter className="h-5 w-5 flex-shrink-0" />}
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

interface CampaignDetailProps {
  campaign: Campaign;
  onClose: () => void;
}

const CampaignDetail: React.FC<CampaignDetailProps> = ({ campaign, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-6 z-50">
    <motion.div 
      className="border p-8 rounded-lg w-full max-w-4xl bg-black"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold">{campaign.title}</h2>
        <button 
          className="border px-3 py-1 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Requirements</h3>
          <p>Number of Posts: {campaign.requirements.postCount}</p>
          <div>
            <p className="mb-2">Platforms:</p>
            <div className="flex gap-2">
              {campaign.requirements.platforms.map(platform => (
                <span key={platform} className="border px-2 py-1 rounded">{platform}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2">Content Guidelines:</p>
            <ul className="list-disc pl-4 space-y-2">
              {campaign.requirements.contentGuidelines.map((guideline, i) => (
                <li key={i}>{guideline}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold">Posts Performance</h3>
          {campaign.posts.map((post, i) => (
            <div key={i} className="border p-4 rounded">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold">{post.platform}</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  post.status === 'approved' ? 'border-green-500' : 'border-yellow-500'
                } border`}>
                  {post.status.toUpperCase()}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm opacity-70">Views</p>
                  <p className="font-bold">{post.views}</p>
                </div>
                <div>
                  <p className="text-sm opacity-70">Earned</p>
                  <p className="font-bold">${post.earned}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  </div>
);

export default function CreatorDashboard() {
  const [timeFilter, setTimeFilter] = useState('6M');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const totalPendingPayout = activeCampaigns.reduce((sum, campaign) => sum + campaign.pendingPayout, 0);

  return (
    <div className="min-h-screen bg-black p-6">
      {/* Header with Profile */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold mb-2">DASHBOARD_</h1>
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

          {isProfileOpen && (
            <ProfileMenu
              isOpen={isProfileOpen}
              setIsOpen={setIsProfileOpen}
            />
          )}
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
        <h2 className="text-2xl font-bold mb-6">ACTIVE CAMPAIGNS_</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeCampaigns.map((campaign, i) => (
            <motion.div
              key={campaign.id}
              className="border p-6 rounded-lg cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedCampaign(campaign)}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{campaign.title}</h3>
                <span className="border px-2 py-1 rounded text-sm">
                  {campaign.status.toUpperCase()}
                </span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-70">Progress</span>
                  <span className="font-bold">{campaign.progress}%</span>
                </div>
                <div className="w-full bg-white bg-opacity-10 rounded-full h-2">
                  <div 
                    className="bg-white rounded-full h-2"
                    style={{ width: `${campaign.progress}%` }}
                  />
                </div>
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
                <div className="space-y-2">
                  <p className="text-sm opacity-70">Requirements:</p>
                  <ul className="list-disc pl-4 text-sm">
                    <li>{campaign.requirements.postCount} posts required</li>
                    <li>Platforms: {campaign.requirements.platforms.join(", ")}</li>
                  </ul>
                </div>
                <p className="text-sm opacity-70">
                  Ends: {new Date(campaign.endDate).toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Available Campaigns */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">AVAILABLE CAMPAIGNS_</h2>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availableCampaigns.map((campaign, i) => (
            <motion.div
              key={campaign.id}
              className="border p-6 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
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
                <p className="text-lg font-bold">{campaign.payout}</p>
                <div>
                  <p className="text-sm opacity-70">Requirements:</p>
                  <ul className="list-disc pl-4 text-sm mt-2">
                    <li>{campaign.requirements.postCount} posts required</li>
                    <li>Minimum Views: {campaign.minViews}</li>
                    {campaign.requirements.contentGuidelines.map((guideline, i) => (
                      <li key={i}>{guideline}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm opacity-70">Platforms</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {campaign.platforms.map((platform) => (
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
                  Deadline: {new Date(campaign.deadline).toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <motion.div
          className="border p-6 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 className="text-xl font-bold mb-6">VIEWS OVER TIME_</h2>
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
          <h2 className="text-xl font-bold mb-6">EARNINGS OVER TIME_</h2>
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