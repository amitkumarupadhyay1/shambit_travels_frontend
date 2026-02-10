'use client';

import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
    message: string;
    className?: string;
}

export default function ErrorMessage({ message, className }: ErrorMessageProps) {
    if (!message) return null;

    return (
        <div
            className={cn(
                'flex items-start gap-2 text-sm text-red-600 mt-1 animate-in fade-in slide-in-from-top-1 duration-200',
                className
            )}
            role="alert"
            aria-live="polite"
        >
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{message}</span>
        </div>
    );
}
