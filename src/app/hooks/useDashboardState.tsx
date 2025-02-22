// hooks/useDashboardState.ts
import { useState } from 'react';

export function useDashboardState() {
  const [timeFilter, setTimeFilter] = useState('6M');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New campaign available!', read: false },
    { id: 2, message: 'Payment processed.', read: true },
  ]);

  const markNotificationAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  return {
    timeFilter,
    setTimeFilter,
    searchTerm,
    setSearchTerm,
    selectedCampaign,
    setSelectedCampaign,
    isProfileOpen,
    setIsProfileOpen,
    notifications,
    markNotificationAsRead,
  };
}