// components/dashboard/StatCard.tsx
import { ReactNode } from 'react';

interface StatCardProps {
  children: ReactNode;
}

export function StatCard({ children }: StatCardProps) {
  return <div className="border p-6 rounded-lg">{children}</div>;
}