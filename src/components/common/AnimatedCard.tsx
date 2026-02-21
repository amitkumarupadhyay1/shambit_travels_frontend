'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode;
  hoverEffect?: 'default' | 'subtle' | 'bold' | 'none';
  clickable?: boolean;
}

export function AnimatedCard({
  children,
  hoverEffect = 'default',
  clickable = false,
  className,
  ...props
}: AnimatedCardProps) {
  const hoverEffects = {
    default: { y: -4, scale: 1.02 },
    subtle: { y: -2, scale: 1.01 },
    bold: { y: -8, scale: 1.05 },
    none: undefined,
  };

  return (
    <motion.div
      initial={{ y: 0, scale: 1 }}
      whileHover={hoverEffects[hoverEffect]}
      transition={{ duration: 0.2 }}
      className={cn(
        'bg-white rounded-2xl temple-shadow sacred-border p-6 lg:p-8',
        clickable && 'cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
