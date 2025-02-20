// page.tsx
'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { XIcon, ArrowUpRight, Zap, Eye, DollarSign, Building } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Sample data for the growth chart
const growthData = [
  { month: 'Jan', views: 2.1 },
  { month: 'Feb', views: 3.4 },
  { month: 'Mar', views: 4.2 },
  { month: 'Apr', views: 6.8 },
  { month: 'May', views: 8.5 },
  { month: 'Jun', views: 12.3 }
];

interface Campaign {
  title: string;
  type: string;
  payout: string;
  minViews: string;
  platforms: string[];
  description: string;
}

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

// Animated background pattern
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

// Animated numbers component
const AnimatedNumber = ({ value, label }: { value: string; label: string }) => {
  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
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

interface CampaignModalProps {
  campaign: Campaign;
  onClose: () => void;
}

function CampaignModal({ campaign, onClose }: CampaignModalProps) {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white p-6 rounded-lg w-full max-w-md relative"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      >
        <button 
          className="absolute top-2 right-2 p-2" 
          onClick={onClose}
        >
          <XIcon className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold mb-4">{campaign.title}</h2>
        <div className="space-y-4">
          <p><strong>Campaign Type:</strong> {campaign.type}</p>
          <p><strong>Payout:</strong> {campaign.payout}</p>
          <p><strong>Minimum Views:</strong> {campaign.minViews}</p>
          <p><strong>Eligible Platforms:</strong></p>
          <div className="flex flex-wrap gap-2">
            {campaign.platforms.map((platform) => (
              <span key={platform} className="px-2 py-1 border rounded text-sm">
                {platform}
              </span>
            ))}
          </div>
          <p className="text-sm">{campaign.description}</p>
        </div>
        <button
          className="mt-6 border px-6 py-2 rounded transition hover:bg-white hover:text-black w-full"
          onClick={onClose}
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function HomePage() {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="min-h-screen bg-black relative">
      <BackgroundPattern />
      
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-black border-b">
        <div className="flex justify-between items-center p-4">
          <motion.h1 
            className="text-2xl md:text-4xl font-bold"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            CREATE_OS
          </motion.h1>
          <button
            onClick={() => setShowLogin(true)}
            className="px-3 py-1 md:px-4 md:py-2 border rounded hover:bg-white hover:text-black transition flex items-center gap-2 text-sm md:text-base"
          >
            Login <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Business Campaign Banner */}
      <motion.div
        className="bg-gradient-to-r from-indigo-900 to-orange-900 p-4 md:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <Building className="h-6 w-6" />
            <p className="text-white font-medium">Looking to launch a campaign?</p>
          </div>
          <motion.button 
            className="px-6 py-2 bg-white text-black rounded-full font-medium flex items-center gap-2 w-full md:w-auto justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start a Campaign <ArrowUpRight className="h-4 w-4" />
          </motion.button>
        </div>
      </motion.div>

      <div className="p-4 md:p-12">
        {/* Hero Section */}
        <motion.div
          className="border p-6 md:p-12 rounded-lg mb-8 md:mb-12 bg-white relative overflow-hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
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

        {/* How It Works */}
        <motion.div
          className="border p-4 md:p-8 rounded-lg mb-8 md:mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">HOW IT WORKS_</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { icon: <Eye className="h-8 w-8" />, title: "Connect Platforms", desc: "Link your TikTok, Instagram, YouTube, and X accounts. No minimum metric requirements." },
              { icon: <Zap className="h-8 w-8" />, title: "Choose Campaigns", desc: "Browse available campaigns, create content following simple guidelines, and post with campaign hashtags." },
              { icon: <DollarSign className="h-8 w-8" />, title: "Earn Per View", desc: "Get paid based on your views. Minimum thresholds start at 100K views. Quick monthly payouts." }
            ].map((step, i) => (
              <motion.div 
                key={i}
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
              >
                <div className="p-4 border rounded-lg inline-block">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="text-sm md:text-base">{step.desc}</p>
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
                className="border p-6 rounded-lg cursor-pointer transition relative overflow-hidden"
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedCampaign(campaign)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute -right-20 -top-20 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl" />
                <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                  <h3 className="text-xl font-bold mb-2 md:mb-0">{campaign.title}</h3>
                  <span className="border px-3 py-1 rounded text-sm">
                    {campaign.payout}
                  </span>
                </div>
                <p className="text-sm mb-2">Minimum views required</p>
                <p className="text-2xl font-bold mb-4">{campaign.minViews}</p>
                <div className="flex flex-wrap gap-2">
                  {campaign.platforms.map((platform) => (
                    <span key={platform} className="text-sm border px-2 py-1 rounded">
                      {platform}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
            
          </div>
        </motion.div>

        {/* Graph */}
        <motion.div
          className="border p-4 md:p-8 rounded-lg mb-8 md:mb-12 relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">MONTHLY VIEWS IN MILLIONS_</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
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
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#111',
                    border: '1px solid #FFFFFF'
                  }}
                  formatter={(value) => [`${value}M`, 'Views']}
                />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#FFFFFF"
                  strokeWidth={2}
                  dot={{ fill: '#FFFFFF', r: 4 }}
                  activeDot={{ r: 6, fill: '#FFFFFF' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.footer
          className="border-t mt-8 md:mt-16 pt-6 md:pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">CREATE_OS</h3>
              <p className="opacity-70 text-sm md:text-base">
                The no-nonsense platform for creator monetization.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Supported Platforms</h3>
              <div className="flex flex-wrap gap-3">
                {['TikTok', 'Instagram', 'YouTube', 'X'].map((platform) => (
                  <motion.div
                    key={platform}
                    className="p-2 border rounded text-sm"
                    whileHover={{ scale: 1.1}}
                  >
                    {platform}
                  </motion.div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <p className="opacity-70 text-sm md:text-base">
                creators@create-os.com<br />
                partnerships@create-os.com
              </p>
            </div>
          </div>
          <div className="text-center mt-6 md:mt-8 pt-6 md:pt-8 border-t opacity-70 text-sm">
            © 2025 CREATE_OS. All rights reserved.
          </div>
        </motion.footer>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-6 md:p-8 rounded-lg w-full max-w-md relative overflow-hidden"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl" />
            <h2 className="text-2xl font-bold mb-6">Login to CREATE_OS</h2>
            <form className="space-y-4">
              <div>
                <label className="block mb-2 text-sm">Email</label>
                <input
                  type="email"
                  className="w-full p-2 border rounded bg-transparent"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm">Password</label>
                <input
                  type="password"
                  className="w-full p-2 border rounded bg-transparent"
                  placeholder="••••••••"
                />
              </div>
              <motion.button
                type="submit"
                className="w-full py-3 border rounded hover:bg-white hover:text-black transition flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Login <ArrowUpRight className="h-4 w-4" />
              </motion.button>
            </form>
            <div className="mt-4 flex justify-between items-center">
              <button
                className="text-sm hover:underline"
                onClick={() => setShowLogin(false)}
              >
                Cancel
              </button>
              <button className="text-sm hover:underline">
                Forgot Password?
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Campaign Modal */}
      {selectedCampaign && (
        <CampaignModal
          campaign={selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
        />
      )}
    </div>
  );
}
