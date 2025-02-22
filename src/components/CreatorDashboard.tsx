// CreatorDashboard.tsx
import React, { useState, useMemo, Suspense, lazy } from 'react';
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
  AlertCircle,
  Bell,
  Info
} from 'lucide-react';

// Custom hooks and components (assume these are defined elsewhere)
import { useDashboardState } from '../app/hooks/useDashboardState'; // Manages dashboard state
import { AnimatedNumber } from '../components/shared/AnimatedNumber'; // Animated stat display
import { CampaignCard } from '../components/dashboard/CampaignCard'; // Reusable campaign card
import { StatCard } from '../components/dashboard/StatCard'; // Reusable stat card
import { ChartContainer } from '../components/shared/ChartContainer'; // Reusable chart wrapper
import { NotificationBell } from '../components/dashboard/NotificationBell'; // Notification system
import { Leaderboard } from '../components/dashboard/Leaderboard'; // Top creators display
import { OnboardingTour } from '../components/dashboard/OnboardingTour'; // Guided tour for new users

// Lazy-loaded components for performance
const LazyCampaignDetail = lazy(() => import('../components/dashboard/CampaignDetail'));
const LazyPaymentHistory = lazy(() => import('../components/dashboard/PaymentHistory'));
const LazyProfileMenu = lazy(() => import('../components/dashboard/ProfileMenu'));

// Sample data (replace with your dynamic data source)
const viewsData = [
  { date: 'Jan', views: 2.1, earnings: 4200 },
  { date: 'Feb', views: 3.4, earnings: 6800 },
  { date: 'Mar', views: 4.2, earnings: 8400 },
  { date: 'Apr', views: 6.8, earnings: 13600 },
  { date: 'May', views: 8.5, earnings: 17000 },
  { date: 'Jun', views: 12.3, earnings: 24600 }
];

const activeCampaigns = [
  {
    id: 1,
    title: 'Summer Vibes Collab',
    platform: 'youtube',
    pendingPayout: 1200,
    progress: 75,
    deadline: '2023-12-01'
  },
  {
    id: 2,
    title: 'Insta Fashion Challenge',
    platform: 'instagram',
    pendingPayout: 800,
    progress: 40,
    deadline: '2023-11-20'
  }
];

const availableCampaigns = [
  {
    id: 3,
    title: 'Tech Review Series',
    platform: 'youtube',
    requirements: { totalBudget: 60000, contentType: 'video' }
  },
  {
    id: 4,
    title: 'Tweet Storm Event',
    platform: 'twitter',
    requirements: { totalBudget: 20000, contentType: 'text' }
  }
];

const userProfile = {
  name: 'Jane Creator',
  avatar: 'https://example.com/avatar.jpg'
};

export default function CreatorDashboard() {
  // State management via custom hook
  const {
    timeFilter,
    setTimeFilter,
    searchTerm,
    setSearchTerm,
    selectedCampaign,
    setSelectedCampaign,
    isProfileOpen,
    setIsProfileOpen,
    notifications,
    markNotificationAsRead
  } = useDashboardState();

  // Memoized calculation for total pending payout
  const totalPendingPayout = useMemo(() => {
    return activeCampaigns.reduce((sum, campaign) => sum + campaign.pendingPayout, 0);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-mono p-6">
      {/* Header with Profile Menu and Notification Bell */}
      <header className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold mb-2">DASHBOARD</h1>
          <motion.div
            className="flex items-center gap-2 border border-gray-700 px-3 py-1 rounded bg-gradient-to-r from-red-900/20 to-transparent"
            whileHover={{ scale: 1.02 }}
            aria-label="Time filter"
          >
            <Calendar className="h-4 w-4" />
            <select
              className="bg-transparent border-none outline-none text-white"
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

        <div className="relative flex items-center gap-4">
          <NotificationBell
            notifications={notifications}
            onMarkAsRead={markNotificationAsRead}
            aria-label="Notifications"
          />
          <motion.button
            className="flex items-center gap-2 border border-gray-700 px-4 py-2 rounded bg-gradient-to-r from-red-900/20 to-transparent"
            whileHover={{ scale: 1.02 }}
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            aria-label="Open profile menu"
          >
            <img
              src={userProfile.avatar}
              alt={`${userProfile.name}'s avatar`}
              className="w-8 h-8 rounded-full"
            />
            <span>{userProfile.name}</span>
            <ChevronDown className="h-4 w-4" />
          </motion.button>

          <Suspense fallback={<div>Loading...</div>}>
            <LazyProfileMenu
              isOpen={isProfileOpen}
              setIsOpen={setIsProfileOpen}
            />
          </Suspense>
        </div>
      </header>

      {/* Stats Overview with Animated Numbers */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { icon: <Eye className="h-6 w-6" />, label: 'Total Views', value: '28.3M' },
          { icon: <DollarSign className="h-6 w-6" />, label: 'Total Earned', value: '$74,600' },
          { icon: <Clock className="h-6 w-6" />, label: 'Pending Payout', value: `$${totalPendingPayout}` },
          { icon: <TrendingUp className="h-6 w-6" />, label: 'Active Campaigns', value: activeCampaigns.length.toString() }
        ].map((stat, i) => (
          <StatCard key={i}>
            <AnimatedNumber value={stat.value} label={stat.label} icon={stat.icon} />
          </StatCard>
        ))}
      </section>

      {/* Active Campaigns with Platform Icons and Progress Bars */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-6">ACTIVE CAMPAIGNS</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeCampaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onClick={() => setSelectedCampaign(campaign)}
              showProgressBar
              platformIcon={
                campaign.platform === 'youtube' ? <Youtube /> :
                campaign.platform === 'instagram' ? <Instagram /> :
                <Twitter />
              }
            />
          ))}
        </div>
      </section>

      {/* Available Campaigns with Filters and Featured Badge */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">AVAILABLE CAMPAIGNS</h2>
          <div className="flex items-center gap-4">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.02 }}
            >
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search campaigns..."
                className="pl-10 pr-4 py-2 border border-gray-700 rounded bg-transparent text-white placeholder-gray-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search campaigns"
              />
            </motion.div>
            <motion.button
              className="border border-gray-700 p-2 rounded bg-gradient-to-r from-red-900/20 to-transparent"
              whileHover={{ scale: 1.02 }}
              aria-label="Filter campaigns"
            >
              <Filter className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availableCampaigns
            .filter((campaign) => campaign.title.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                onClick={() => setSelectedCampaign(campaign)}
                showFeaturedBadge={campaign.requirements.totalBudget > 50000}
                platformIcon={
                  campaign.platform === 'youtube' ? <Youtube /> :
                  campaign.platform === 'instagram' ? <Instagram /> :
                  <Twitter />
                }
              />
            ))}
        </div>
      </section>

      {/* Charts with Responsive Design and Tooltips */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <ChartContainer title="VIEWS OVER TIME">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={viewsData}>
              <XAxis dataKey="date" stroke="#FFFFFF" />
              <YAxis stroke="#FFFFFF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111',
                  border: '1px solid #FFFFFF',
                  color: '#FFFFFF'
                }}
                formatter={(value) => [`${value}M`, 'Views']}
              />
              <Line
                type="monotone"
                dataKey="views"
                stroke="#FFFFFF"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="EARNINGS OVER TIME">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={viewsData}>
              <XAxis dataKey="date" stroke="#FFFFFF" />
              <YAxis stroke="#FFFFFF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111',
                  border: '1px solid #FFFFFF',
                  color: '#FFFFFF'
                }}
                formatter={(value) => [`$${value}`, 'Earnings']}
              />
              <Bar dataKey="earnings" fill="#FFFFFF" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </section>

      {/* Payment History with Lazy Loading */}
      <section className="mt-8">
        <Suspense fallback={<div className="text-white">Loading Payment History...</div>}>
          <LazyPaymentHistory />
        </Suspense>
      </section>

      {/* Leaderboard Section */}
      <section className="mt-8">
        <Leaderboard />
      </section>

      {/* Onboarding Tour for First-Time Users */}
      <OnboardingTour />

      {/* Campaign Detail Modal */}
      {selectedCampaign && (
        <Suspense fallback={<div className="text-white">Loading Campaign Details...</div>}>
          <LazyCampaignDetail
            campaign={selectedCampaign}
            onClose={() => setSelectedCampaign(null)}
          />
        </Suspense>
      )}
    </div>
  );
}