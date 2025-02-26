// src/app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XIcon, ArrowUpRight, Zap, Eye, DollarSign, 
  Building, Calendar, ChevronDown, Users, TrendingUp, 
  Twitter, Youtube, Instagram, Clock
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Navigation from '@/components/Navigation';
import LoginModal from '@/components/LoginModal';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/components/OnboardingProvider';

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
  const router = useRouter();
  
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
  
  const handleApply = () => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (isLoggedIn) {
      // Redirect to dashboard if logged in
      router.push('/dashboard');
    } else {
      // Close the modal and open login
      onClose();
      // This should be handled by the parent component
      // which should open the login modal
      document.dispatchEvent(new CustomEvent('openLogin'));
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose} // Close when clicking outside
      >
        <motion.div
          className="border p-6 rounded-lg w-full max-w-md relative bg-black"
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
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
            onClick={handleApply}
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

// Main HomePage component
export default function HomePage() {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const router = useRouter();
  const { resetOnboarding } = useOnboarding();
  
  // Check login status on component mount
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in from localStorage
    const loginStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loginStatus);
    
    // Listen for custom event to open login modal from campaign modal
    const handleOpenLogin = () => setShowLogin(true);
    document.addEventListener('openLogin', handleOpenLogin);
    
    return () => {
      document.removeEventListener('openLogin', handleOpenLogin);
    };
  }, []);
  
  const handleJoinCreator = () => {
    if (isLoggedIn) {
      router.push('/dashboard');
    } else {
      resetOnboarding();
    }
  };

  return (
    <div className="min-h-screen bg-black relative">
      <BackgroundPattern />
      
      {/* Navigation */}
      <Navigation isLoggedIn={isLoggedIn} />
      
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
            onClick={() => router.push('/dashboard')}
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
          id="hero"
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
                onClick={handleJoinCreator}
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
          id="how-it-works"
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
                {/* Fixed static icon container with no animations */}
                <div className="relative mb-4 h-16 w-16">
                  <div className={`absolute inset-0 ${step.bgClass} rounded-lg opacity-60`} />
                  <div className={`absolute inset-0 border ${step.borderClass} rounded-lg flex items-center justify-center`}>
                    {step.icon}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="text-sm md:text-base">{step.desc}</p>
                
                <motion.div
                  className="mt-2 pt-2 border-t border-dashed flex items-center gap-2 text-sm"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 0.6 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 + 0.3 }}
                >
                  {i < 3 && (
                    <div className="text-gray-400">
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  )}
                  {i === 0 && <span className="text-gray-400">No minimum follower count required</span>}
                  {i === 1 && <span className="text-gray-400">Simple guidelines with creative freedom</span>}
                  {i === 2 && <span className="text-gray-400">Payments sent directly to your account</span>}
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
          id="campaigns"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">EXAMPLE CAMPAIGNS_</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {exampleCampaigns.map((campaign, i) => (
              <motion.div
                key={i}
                className="border p-6 rounded-lg cursor-pointer relative overflow-hidden backdrop-blur-sm"
                whileHover={{ scale: 1.05, borderColor: i === 0 ? '#FF4444' : i === 1 ? '#4287f5' : '#31a952' }}
                onClick={() => setSelectedCampaign(campaign)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl" />
                
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{campaign.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-2 py-0.5 bg-white bg-opacity-10 rounded-full text-xs">
                        {campaign.type}
                      </span>
                      <span className="px-2 py-0.5 bg-white bg-opacity-10 rounded-full text-xs text-green-400">
                        Active
                      </span>
                    </div>
                  </div>
                  <span className="border px-3 py-1 rounded text-sm bg-white bg-opacity-5">
                    {campaign.payout}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm opacity-70">Min. Views</p>
                    <p className="text-2xl font-bold">{campaign.minViews}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-70">Campaign Brief</p>
                    <p className="text-sm opacity-90 line-clamp-2">{campaign.description.substring(0, 50)}...</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm opacity-70 mb-2">Platforms</p>
                  <div className="flex flex-wrap gap-2">
                    {campaign.platforms.map((platform, idx) => (
                      <motion.span 
                        key={platform} 
                        className="text-sm border px-2 py-1 rounded"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * idx + 0.1 * i }}
                        whileHover={{ 
                          scale: 1.05, 
                          backgroundColor: "rgba(255,255,255,0.1)",
                          borderColor: platform === 'YouTube' ? '#FF0000' : 
                                      platform === 'Instagram' ? '#E1306C' : 
                                      platform === 'TikTok' ? '#69C9D0' : '#1DA1F2'
                        }}
                      >
                        {platform}
                      </motion.span>
                    ))}
                  </div>
                </div>
                
                <motion.button
                  className="w-full mt-4 flex items-center justify-center gap-2 p-2 border-2 border-dashed text-sm"
                  whileHover={{ borderStyle: "solid", backgroundColor: "rgba(255,255,255,0.05)" }}
                >
                  <span>View Details</span>
                  <ArrowUpRight className="h-4 w-4" />
                </motion.button>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <motion.button
              className="px-6 py-3 border rounded-full inline-flex items-center gap-2"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => isLoggedIn ? router.push('/dashboard') : setShowLogin(true)}
            >
              Browse All Campaigns <ArrowUpRight className="h-4 w-4" />
            </motion.button>
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

        {/* Enhanced CTA Section */}
        <motion.div
          className="mb-8 md:mb-12 relative overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          id="cta"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-900 to-blue-900 opacity-20 rounded-lg"></div>
          <div className="border border-red-500 rounded-lg relative z-10 overflow-hidden">
            {/* Abstract background elements */}
            <div className="absolute -right-10 top-10 w-64 h-64 bg-red-500 opacity-10 rounded-full blur-3xl"></div>
            <div className="absolute left-10 -bottom-20 w-64 h-64 bg-blue-500 opacity-10 rounded-full blur-3xl"></div>
            
            <div className="p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div>
                  <motion.h2 
                    className="text-3xl md:text-5xl font-bold mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    START EARNING <br/>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-300">
                      RIGHT NOW_
                    </span>
                  </motion.h2>
                  
                  <motion.div 
                    className="space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-red-500 bg-opacity-10 rounded-lg mt-1">
                        <DollarSign className="h-5 w-5 text-red-400" />
                      </div>
                      <div>
                        <p className="font-bold text-lg">Get Paid For Your Content</p>
                        <p className="opacity-80">Monetize across TikTok, Instagram, YouTube, and X with no follower requirements</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-red-500 bg-opacity-10 rounded-lg mt-1">
                        <Zap className="h-5 w-5 text-red-400" />
                      </div>
                      <div>
                        <p className="font-bold text-lg">Simple Payout Structure</p>
                        <p className="opacity-80">Earn based on views, with transparent rates and fast monthly payments</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-red-500 bg-opacity-10 rounded-lg mt-1">
                        <Eye className="h-5 w-5 text-red-400" />
                      </div>
                      <div>
                        <p className="font-bold text-lg">Creative Freedom</p>
                        <p className="opacity-80">Create authentic content that aligns with your personal brand and audience</p>
                      </div>
                    </div>
                  </motion.div>
                  
                  <div className="mt-8 grid grid-cols-2 gap-4">
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
                        className="relative w-full px-6 py-3 rounded-lg bg-black text-white flex items-center justify-center gap-2 border border-transparent"
                        onClick={handleJoinCreator}
                      >
                        <span className="font-bold text-lg">Join For Free</span>
                      </button>
                    </motion.div>
                    
                    <motion.button
                      className="px-6 py-3 border border-white border-opacity-30 rounded-lg flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => isLoggedIn ? router.push('/dashboard') : setShowLogin(true)}
                    >
                      Browse Campaigns <ArrowUpRight className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="border-t border-l border-white border-opacity-20 p-6 md:p-8 bg-black bg-opacity-60 rounded-lg relative">
                    <div className="absolute -right-4 -top-4 p-2 bg-black border border-red-500 rounded-md">
                      <DollarSign className="h-6 w-6 text-red-400" />
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-6">CREATOR EARNINGS_</h3>
                    
                    <div className="space-y-6">
                      <div className="flex justify-between items-center border-b border-white border-opacity-10 pb-4">
                        <div>
                          <p className="font-bold">1M Views</p>
                          <p className="text-sm opacity-70">Average Payout</p>
                        </div>
                        <p className="text-2xl font-bold text-red-400">$500</p>
                      </div>
                      
                      <div className="flex justify-between items-center border-b border-white border-opacity-10 pb-4">
                        <div>
                          <p className="font-bold">Top 10% Creators</p>
                          <p className="text-sm opacity-70">Monthly Average</p>
                        </div>
                        <p className="text-2xl font-bold text-red-400">$2,450</p>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-bold">Total Paid Out</p>
                          <p className="text-sm opacity-70">This Year</p>
                        </div>
                        <p className="text-2xl font-bold text-red-400">$4.2M+</p>
                      </div>
                    </div>
                    
                    <div className="mt-8 flex items-center justify-between pt-4 border-t border-white border-opacity-10">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Next payout: 15th of month</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-red-400" />
                        <span className="text-sm">72hr processing</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute -z-10 -bottom-4 -right-4 w-full h-full border border-red-500 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
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