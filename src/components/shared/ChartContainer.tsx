// components/shared/ChartContainer.tsx
import { ReactNode } from 'react';

interface ChartContainerProps {
  title: string;
  children: ReactNode;
}

export function ChartContainer({ title, children }: ChartContainerProps) {
  return (
    <div className="border p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-6">{title}</h2>
      {children}
    </div>
  );
}