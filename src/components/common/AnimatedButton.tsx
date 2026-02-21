'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { buttonRipple } from '@/lib/animations';

interface RippleEffect {
  x: number;
  y: number;
  size: number;
  id: number;
}

interface AnimatedButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  ripple?: boolean;
  loading?: boolean;
}

export function AnimatedButton({
  children,
  ripple = true,
  loading = false,
  className,
  onClick,
  disabled,
  ...props
}: AnimatedButtonProps) {
  const [ripples, setRipples] = useState<RippleEffect[]>();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (ripple && !disabled && !loading) {
      const button = buttonRef.current;
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      const newRipple: RippleEffect = {
        x,
        y,
        size,
        id: Date.now(),
      };

      setRipples((prev) => [...(prev || []), newRipple]);

      // Remove ripple after animation
      setTimeout(() => {
        setRipples((prev) => prev?.filter((r) => r.id !== newRipple.id));
      }, 600);
    }

    onClick?.(e);
  };

  return (
    <motion.button
      ref={buttonRef}
      variants={buttonRipple}
      initial="rest"
      whileHover={!disabled && !loading ? "hover" : undefined}
      whileTap={!disabled && !loading ? "tap" : undefined}
      className={cn(
        'relative overflow-hidden',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {/* Ripple effects */}
      {ripple && ripples?.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 pointer-events-none animate-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
          }}
        />
      ))}

      {/* Loading spinner */}
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center bg-inherit">
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </span>
      )}

      {/* Button content */}
      <span className={cn('relative z-10', loading && 'invisible')}>
        {children}
      </span>
    </motion.button>
  );
}
