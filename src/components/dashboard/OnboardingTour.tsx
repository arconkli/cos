// components/dashboard/OnboardingTour.tsx
import { useState } from 'react';
import { Info, X } from 'lucide-react';

export function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white text-black p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Welcome to Create OS!</h3>
        <button onClick={() => setIsOpen(false)}>
          <X className="h-4 w-4" />
        </button>
      </div>
      <p className="text-sm">
        Click on the <Info className="inline h-4 w-4" /> icons to learn more about each section.
      </p>
    </div>
  );
}