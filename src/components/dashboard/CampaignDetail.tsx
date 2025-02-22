// src/components/dashboard/CampaignDetail.tsx
import { motion } from 'framer-motion';
import { Campaign } from '../../types/campaign';

interface CampaignDetailProps {
  campaign: Campaign;
  onClose: () => void;
}

export default function CampaignDetail({ campaign, onClose }: CampaignDetailProps) {
  const isActiveCampaign = 'deadline' in campaign;
  const isAvailableCampaign = 'requirements' in campaign;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-white text-black p-6 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">{campaign.title}</h2>
        <p>Platform: {campaign.platform}</p>
        
        {/* Active Campaign Details */}
        {isActiveCampaign && (
          <>
            <p>Deadline: {campaign.deadline}</p>
            <p>Progress: {campaign.progress}%</p>
            <p>Pending Payout: ${campaign.pendingPayout}</p>
          </>
        )}

        {/* Available Campaign Details */}
        {isAvailableCampaign && (
          <>
            <p>Budget: ${campaign.requirements.totalBudget}</p>
            <p>Content Type: {campaign.requirements.contentType}</p>
          </>
        )}

        <button
          className="mt-4 border border-black px-4 py-2 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </motion.div>
  );
}