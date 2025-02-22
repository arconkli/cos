// components/dashboard/NotificationBell.tsx
import { useState } from 'react';
import { Bell } from 'lucide-react';

interface Notification {
  id: number;
  message: string;
  read: boolean;
}

interface NotificationBellProps {
  notifications: Notification[];
  onMarkAsRead: (id: number) => void;
}

export function NotificationBell({ notifications, onMarkAsRead }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Notifications, ${unreadCount} unread`}
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1 text-xs">
            {unreadCount}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white text-black rounded-lg shadow-lg p-4">
          <h3 className="font-bold mb-2">Notifications</h3>
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-2 ${notif.read ? 'opacity-50' : ''}`}
              onClick={() => onMarkAsRead(notif.id)}
            >
              {notif.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}