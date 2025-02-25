// page.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { 
  XIcon, ArrowUpRight, Zap, Eye, DollarSign, 
  Building, Calendar, ChevronDown, Users, TrendingUp 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// Sample data for the growth chart with enhanced structure
const growthData = [
  { month: 'Jan', views: 2.1, earnings: 4200 },
  { month: 'Feb', views: 3.4, earnings: 6800 },
  { month: 'Mar', views: 4.2, earnings: 8400 },
  { month: 'Apr', views: 6.8, earnings: 13600 },
  { month: 'May', views: 8.5, earnings: 17000 },
  { month: 'Jun', views: 12.3, earnings: 24600 }
];

// Types for better code organization
interface Campaign {
  title: string;
  type: string;
  payout: string;
  minViews: string;
  platforms: string[];
  description: string;
}

interface CampaignModalProps {
  campaign: Campaign;
  onClose: () => void;
}

// Sample campaign data
const exampleCampaigns: Campaign[] = [
  {
    title: "Upcoming Netflix Series",
    type: "Entertainment",
    payout: "$550 per 1M views",
    minViews: "100K",
    platforms: ["TikTok", "Instagram", "YouTube"],
    description: "Create unique content promoting our new series launch. Focus on character reactions, plot theories, or creative skits."
  },
  {
    title: "New Artist Release",
    type: "Music",
    payout: "Share of $500K pool",
    minViews: "1M",
    platforms: ["TikTok", "Instagram"],
    description: "Use the artist's new track in your videos. Dance, lip-sync, or create original content that highlights the song."
  },
  {
    title: "Gaming Stream Highlight",
    type: "Gaming",
    payout: "$250 per 1M views",
    minViews: "500K",
    platforms: ["TikTok", "Instagram", "YouTube", "X"],
    description: "Create clips or reaction videos to interesting stream moments. Emphasis on exciting moments and community engagement."
  }
];

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

// Reusable component for the animated background pattern
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

// Animated numbers component with enhanced animations
const AnimatedNumber = ({ value, label }: { value: string; label: string }) => {
  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <motion.p
        className="text-4xl font-bold mb-2"
        initial={{ scale: 0.5 }}
        whileInView={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        {value}
      </motion.p>
      <p className="text-sm opacity-70">{label}</p>
    </motion.div>
  );
};

// Campaign Modal Component with improved animations
function CampaignModal({ campaign, onClose }: CampaignModalProps) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="border p-6 rounded-lg w-full max-w-md relative bg-black"
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl" />
          
          <motion.button 
            className="absolute top-2 right-2 p-2" 
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <XIcon className="h-6 w-6" />
          </motion.button>
          
          <h2 className="text-2xl font-bold mb-4">{campaign.title}</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <div>
                <p className="text-sm opacity-70">Campaign Type</p>
                <p className="font-bold">{campaign.type}</p>
              </div>
              <div>
                <p className="text-sm opacity-70">Payout</p>
                <p className="font-bold">{campaign.payout}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm opacity-70">Minimum Views</p>
              <p className="text-2xl font-bold">{campaign.minViews}</p>
            </div>
            
            <div>
              <p className="text-sm opacity-70 mb-2">Eligible Platforms</p>
              <div className="flex flex-wrap gap-2">
                {campaign.platforms.map((platform, index) => (
                  <motion.span 
                    key={platform} 
                    className="px-2 py-1 border rounded text-sm"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                  >
                    {platform}
                  </motion.span>
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-sm opacity-70 mb-2">Campaign Details</p>
              <p>{campaign.description}</p>
            </div>
          </div>
          
          <motion.button
            className="mt-6 border px-6 py-2 rounded w-full flex items-center justify-center gap-2"
            onClick={onClose}
            whileHover={{ backgroundColor: "rgba(255,255,255,0.1)", borderColor: "#FF4444" }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowUpRight className="h-4 w-4" />
            Apply Now
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Login modal component
function LoginModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="border p-6 md:p-8 rounded-lg w-full max-w-md relative bg-black overflow-hidden"
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl" />
        
        <motion.h2 
          className="text-2xl font-bold mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Login to CREATE_OS
        </motion.h2>
        
        <form className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block mb-2 text-sm">Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded bg-transparent"
              placeholder="your@email.com"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block mb-2 text-sm">Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded bg-transparent"
              placeholder="••••••••"
            />
          </motion.div>
          
          <motion.button
            type="submit"
            className="w-full py-3 border rounded flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)", borderColor: "#FF4444" }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Login <ArrowUpRight className="h-4 w-4" />
          </motion.button>
        </form>
        
        <motion.div 
          className="mt-4 flex justify-between items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            className="text-sm hover:underline"
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cancel
          </motion.button>
          <motion.button 
            className="text-sm hover:underline"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Forgot Password?
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// Main HomePage component
export default function HomePage() {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="min-h-screen bg-black relative">
      <BackgroundPattern />
      
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-black bg-opacity-80 backdrop-blur-sm border-b">
        <div className="flex justify-between items-center p-4 max-w-7xl mx-auto">
          <motion.h1 
            className="text-2xl md:text-4xl font-bold"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            CREATE_OS
          </motion.h1>
          <motion.button
            onClick={() => setShowLogin(true)}
            className="px-3 py-1 md:px-4 md:py-2 border rounded flex items-center gap-2 text-sm md:text-base"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)", borderColor: "#FF4444" }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            Login <ArrowUpRight className="h-4 w-4" />
          </motion.button>
        </div>
      </div>

      {/* Business Campaign Banner */}
      <motion.div
        className="bg-gradient-to-r from-indigo-900 to-orange-900 p-4 md:p-6 relative"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <svg width="100%" height="100%" className="opacity-10">
            <pattern id="grid-banner" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid-banner)" />
          </svg>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <Building className="h-6 w-6" />
            <p className="text-white font-medium">Looking to launch a campaign?</p>
          </div>
          <motion.button 
            className="px-6 py-2 bg-white text-black rounded-full font-medium flex items-center gap-2 w-full md:w-auto justify-center"
            whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255,255,255,0.3)" }}
            whileTap={{ scale: 0.95 }}
          >
            Start a Campaign <ArrowUpRight className="h-4 w-4" />
          </motion.button>
        </div>
      </motion.div>

      <div className="p-4 md:p-12 max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          className="border p-6 md:p-12 rounded-lg mb-8 md:mb-12 bg-black relative overflow-hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h1 className="text-4xl md:text-7xl font-bold mb-6 leading-tight">
              CREATOR<br />
              <motion.span
                className="inline-block"
                animate={{ 
                  color: ['#FFFFFF', '#FF4444', '#FFFFFF'],
                  transition: { duration: 3, repeat: Infinity }
                }}
              >
                MONETIZATION_
              </motion.span>
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl">
              <b><em>Create great content, go viral, get paid.</em></b>
              <br />
              <br />
              No minimum follower requirements. No complex sign-up.
            </p>
            <motion.div
              className="relative inline-block"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {/* Animated border container */}
              <motion.div
                className="absolute -inset-[1px] rounded-lg bg-gradient-to-r from-red-500 via-white to-red-500"
                style={{
                  backgroundSize: '200% 100%'
                }}
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              
              {/* Main button */}
              <button 
                className="relative w-auto px-8 py-4 rounded-lg bg-black text-white flex items-center justify-center gap-2 border border-transparent"
              >
                <span className="font-bold text-lg">Join as Creator</span>
              </button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 md:mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {[
            { icon: <Users className="h-6 w-6 text-blue-400" />, label: "Creators", value: "10,000+", trend: "+24%" },
            { icon: <Eye className="h-6 w-6 text-purple-400" />, label: "Monthly Views", value: "280M+", trend: "+35%" },
            { icon: <DollarSign className="h-6 w-6 text-green-400" />, label: "Creator Payouts", value: "$4.2M+", trend: "+47%" },
            { icon: <Building className="h-6 w-6 text-red-400" />, label: "Brand Partners", value: "120+", trend: "+18%" }
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="border p-6 rounded-lg relative overflow-hidden backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02, borderColor: i === 0 ? '#4287f5' : i === 1 ? '#b026ff' : i === 2 ? '#31a952' : '#FF4444' }}
            >
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl" />
              
              <div className="flex items-center gap-3 mb-4">
                {stat.icon}
                <span className="text-sm opacity-70">{stat.label}</span>
              </div>
              <div className="flex justify-between items-end">
                <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
                <div className="text-sm flex items-center gap-1 text-green-400">
                  <TrendingUp className="h-4 w-4" />
                  <span>{stat.trend}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* How It Works */}
        <motion.div
          className="border p-4 md:p-8 rounded-lg mb-8 md:mb-12 relative overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl" />
          
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">HOW IT WORKS_</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { 
                color: '#4287f5',
                bgClass: 'bg-blue-500 bg-opacity-10',
                borderClass: 'border-blue-400',
                icon: <Eye className="h-8 w-8 text-blue-400" />, 
                title: "Connect Platforms", 
                desc: "Link your TikTok, Instagram, YouTube, and X accounts. No minimum metric requirements." 
              },
              { 
                color: '#FFD700',
                bgClass: 'bg-yellow-500 bg-opacity-10',
                borderClass: 'border-yellow-400',
                icon: <Zap className="h-8 w-8 text-yellow-400" />, 
                title: "Choose Campaigns", 
                desc: "Browse available campaigns, create content following simple guidelines, and post with campaign hashtags." 
              },
              { 
                color: '#31a952',
                bgClass: 'bg-green-500 bg-opacity-10',
                borderClass: 'border-green-400',
                icon: <DollarSign className="h-8 w-8 text-green-400" />, 
                title: "Earn Per View", 
                desc: "Get paid based on your views. Minimum thresholds start at 100K views. Quick monthly payouts." 
              }
            ].map((step, i) => (
              <motion.div 
                key={i}
                className="space-y-4 relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
              >
                {/* Fixed icon animation to prevent glitching */}
                <div className="relative mb-4 h-16 w-16">
                  <motion.div 
                    className={`absolute inset-0 ${step.bgClass} rounded-lg`}
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div 
                    className={`absolute inset-0 border ${step.borderClass} rounded-lg flex items-center justify-center`}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "tween", duration: 0.2 }}
                  >
                    {step.icon}
                  </motion.div>
                </div>
                
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="text-sm md:text-base">{step.desc}</p>
                
                <motion.div
                  className="mt-2 pt-2 border-t border-dashed flex items-center gap-2 text-sm"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 0.7 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 + 0.3 }}
                >
                  {i < 2 && (
                    <motion.div
                      animate={{ x: [0, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </motion.div>
                  )}
                  {i === 0 && <span>No minimum follower count required</span>}
                  {i === 1 && <span>Simple guidelines with creative freedom</span>}
                  {i === 2 && <span>Payments sent directly to your account</span>}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Example Campaigns */}
        <motion.div
          className="mb-8 md:mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">EXAMPLE CAMPAIGNS_</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {exampleCampaigns.map((campaign, i) => (
              <motion.div
                key={i}
                className="border p-6 rounded-lg cursor-pointer relative overflow-hidden backdrop-blur-sm"
                whileHover={{ scale: 1.05, borderColor: '#FF4444' }}
                onClick={() => setSelectedCampaign(campaign)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="absolute -right-20 -top-20 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl" />
                <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                  <h3 className="text-xl font-bold mb-2 md:mb-0">{campaign.title}</h3>
                  <span className="border px-3 py-1 rounded text-sm">
                    {campaign.payout}
                  </span>
                </div>
                <p className="text-sm mb-2 opacity-70">Minimum views required</p>
                <p className="text-2xl font-bold mb-4">{campaign.minViews}</p>
                <div className="flex flex-wrap gap-2">
                  {campaign.platforms.map((platform, idx) => (
                    <motion.span 
                      key={platform} 
                      className="text-sm border px-2 py-1 rounded"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * idx + 0.1 * i }}
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                    >
                      {platform}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Graph */}
        <motion.div
          className="border p-4 md:p-8 rounded-lg mb-8 md:mb-12 relative overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          whileHover={{ borderColor: '#4287f5' }}
        >
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl" />
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <Eye className="h-6 w-6 text-blue-400" />
              MONTHLY VIEWS IN MILLIONS_
            </h2>
            <motion.div
              className="flex items-center gap-2 border px-3 py-1 rounded"
              whileHover={{ scale: 1.05 }}
            >
              <Calendar className="h-4 w-4" />
              <select className="bg-transparent border-none outline-none text-sm">
                <option value="6M">Last 6 Months</option>
                <option value="1Y">Last Year</option>
                <option value="ALL">All Time</option>
              </select>
            </motion.div>
          </div>
          
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4287f5" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4287f5" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="month" 
                  stroke="#FFFFFF"
                  tick={{ fill: '#FFFFFF' }}
                />
                <YAxis 
                  stroke="#FFFFFF"
                  tick={{ fill: '#FFFFFF' }}
                  label={{ 
                    value: 'Million Views', 
                    angle: -90,
                    position: 'insideLeft',
                    fill: '#FFFFFF'
                  }}
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
        </motion.div>

        {/* Success Metrics Section (replacing testimonials) */}
        <motion.div
          className="mb-8 md:mb-12 border p-8 rounded-lg relative overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          whileHover={{ borderColor: '#4287f5' }}
        >
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl" />
          
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 flex items-center gap-2">
            <Zap className="h-6 w-6 text-yellow-400" />
            CREATOR SUCCESS_
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <motion.div 
                className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  backgroundSize: '200% 100%'
                }}
              >
                93%
              </motion.div>
              <p className="text-xl">of creators earn within their first 30 days</p>
            </motion.div>
            
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <motion.div 
                className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-500 mb-2"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  backgroundSize: '200% 100%'
                }}
              >
                $2,400
              </motion.div>
              <p className="text-xl">average monthly creator earnings</p>
            </motion.div>
            
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <motion.div 
                className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500 mb-2"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  backgroundSize: '200% 100%'
                }}
              >
                72hrs
              </motion.div>
              <p className="text-xl">average payout speed after campaign completion</p>
            </motion.div>
          </div>
          
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <motion.button 
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-red-500 rounded-full font-bold text-white border-none inline-flex items-center gap-2"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 20px rgba(255,68,68,0.5)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Zap className="h-5 w-5" />
              Become a Creator
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Enhanced Footer */}
        <motion.footer
          className="border-t mt-8 md:mt-16 pt-6 md:pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div>
              <motion.h3 
                className="text-xl font-bold mb-4"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                CREATE_OS
              </motion.h3>
              <p className="opacity-70 text-sm md:text-base">
                The no-nonsense platform for creator monetization.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Supported Platforms</h3>
              <div className="flex flex-wrap gap-3">
                {['TikTok', 'Instagram', 'YouTube', 'X'].map((platform, i) => (
                  <motion.div
                    key={platform}
                    className="p-2 border rounded text-sm"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
                  >
                    {platform}
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <motion.p 
                className="opacity-70 text-sm md:text-base"
                whileHover={{ scale: 1.02 }}
              >
                creators@create-os.com<br />
                partnerships@create-os.com
              </motion.p>
            </div>
          </div>
          <div className="text-center mt-6 md:mt-8 pt-6 md:pt-8 border-t opacity-70 text-sm">
            © 2025 CREATE_OS. All rights reserved.
          </div>
        </motion.footer>
      </div>

      {/* Login Modal */}
      <AnimatePresence>
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      </AnimatePresence>

      {/* Campaign Modal */}
      <AnimatePresence>
        {selectedCampaign && (
          <CampaignModal
            campaign={selectedCampaign}
            onClose={() => setSelectedCampaign(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}