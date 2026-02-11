'use client';

import { cn } from '@/lib/utils';
import { Sparkles, TrendingUp, Clock } from 'lucide-react';

export type BadgeType = 'popular' | 'new' | 'limited';

interface BadgeProps {
  type: BadgeType;
  className?: string;
}

const badgeConfig = {
  popular: {
    icon: TrendingUp,
    label: 'Popular',
    className: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
  },
  new: {
    icon: Sparkles,
    label: 'New',
    className: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
  },
  limited: {
    icon: Clock,
    label: 'Limited',
    className: 'bg-gradient-to-r from-orange-500 to-red-500 text-white',
  },
};

export function Badge({ type, className }: BadgeProps) {
  const config = badgeConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold',
        'shadow-md backdrop-blur-sm',
        'animate-in fade-in slide-in-from-top-2 duration-300',
        config.className,
        className
      )}
    >
      <Icon className="w-3 h-3" />
      <span>{config.label}</span>
    </div>
  );
}

// Helper function to determine which badge to show
export function getExperienceBadge(experience: {
  created_at: string;
  base_price: number;
  max_participants: number;
}): BadgeType | null {
  // Check if new (created within last 30 days)
  const createdDate = new Date(experience.created_at);
  const daysSinceCreated = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceCreated <= 30) {
    return 'new';
  }

  // Check if limited (low max participants)
  if (experience.max_participants <= 10) {
    return 'limited';
  }

  // Check if popular (high price point - premium experiences)
  if (experience.base_price >= 3000) {
    return 'popular';
  }

  return null;
}
