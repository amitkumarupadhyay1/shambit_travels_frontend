'use client';

import { ReactNode } from 'react';
import { cn, sacredStyles } from '@/lib/utils';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('text-center py-16 px-4', className)}>
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-orange-100 to-yellow-100 mb-6 animate-in zoom-in duration-500">
        <div className="text-orange-600">{icon}</div>
      </div>
      
      <h3 className={cn(sacredStyles.heading.h4, 'mb-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100')}>
        {title}
      </h3>
      
      <p className={cn(sacredStyles.text.body, 'text-gray-600 max-w-md mx-auto mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200')}>
        {description}
      </p>
      
      {action && (
        <button
          onClick={action.onClick}
          className={cn(
            sacredStyles.button.primary,
            'animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300'
          )}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
