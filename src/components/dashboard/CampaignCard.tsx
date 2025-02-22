// components/dashboard/CampaignCard.tsx
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface Campaign {
    id: number;
    title: string;
    platform: string;
    pendingPayout?: number;
    progress?: number;
    deadline?: string; // Optional to accommodate available campaigns
    requirements?: {
      totalBudget: number;
      contentType: string;
    };
  }
  
interface CampaignCardProps {
  campaign: Campaign;
  onClick: () => void;
  showProgressBar?: boolean;
  showFeaturedBadge?: boolean;
  platformIcon?: ReactNode;
}

export function CampaignCard({
  campaign,
  onClick,
  showProgressBar = false,
  showFeaturedBadge = false,
  platformIcon,
}: CampaignCardProps) {
  return (
    <motion.div
      className="border p-6 rounded-lg cursor-pointer relative"
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
    >
      {showFeaturedBadge && (
        <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
          Featured
        </span>
      )}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold">{campaign.title}</h3>
        {platformIcon && <div className="text-2xl">{platformIcon}</div>}
      </div>
      <p className="text-sm opacity-70">Platform: {campaign.platform}</p>
      {showProgressBar && (
        <div className="mt-4">
          <p className="text-sm opacity-70">Progress: {campaign.progress}%</p>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-white h-2.5 rounded-full"
              style={{ width: `${campaign.progress}%` }}
            ></div>
          </div>
        </div>
      )}
      <p className="mt-2 text-sm opacity-70">Deadline: {campaign.deadline}</p>
    </motion.div>
  );
}