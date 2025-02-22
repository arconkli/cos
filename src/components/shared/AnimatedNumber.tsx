// components/shared/AnimatedNumber.tsx
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedNumberProps {
  value: number | string;
  label: string;
  icon?: ReactNode;
}

export function AnimatedNumber({ value, label, icon }: AnimatedNumberProps) {
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
        transition={{ type: 'spring', stiffness: 100 }}
      >
        {value}
      </motion.p>
      <p className="text-sm opacity-70">{label}</p>
      {icon}
    </motion.div>
  );
}