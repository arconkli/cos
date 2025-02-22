// components/dashboard/ProfileMenu.tsx
import { ChevronDown, LogOut } from 'lucide-react';

interface ProfileMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function ProfileMenu({ isOpen, setIsOpen }: ProfileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg p-4">
      <div className="flex flex-col space-y-2">
        <button className="text-left">Profile</button>
        <button className="text-left">Settings</button>
        <button className="text-left flex items-center gap-2">
          <LogOut className="h-4 w-4" /> Log Out
        </button>
      </div>
    </div>
  );
}