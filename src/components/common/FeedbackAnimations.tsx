'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  successPulse,
  errorShake,
  bounce,
  toast,
  successCheckmark,
} from '@/lib/animations';

interface SuccessAnimationProps {
  message?: string;
  className?: string;
}

export function SuccessAnimation({ message, className }: SuccessAnimationProps) {
  return (
    <motion.div
      variants={successPulse}
      animate="animate"
      className={cn(
        'flex flex-col items-center justify-center space-y-4',
        className
      )}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="relative"
      >
        <CheckCircle className="w-16 h-16 text-green-500" />
        <motion.svg
          className="absolute inset-0 w-16 h-16"
          viewBox="0 0 24 24"
          initial="hidden"
          animate="visible"
        >
          <motion.path
            d="M5 13l4 4L19 7"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={successCheckmark}
          />
        </motion.svg>
      </motion.div>
      {message && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg font-medium text-gray-900"
        >
          {message}
        </motion.p>
      )}
    </motion.div>
  );
}

interface ErrorAnimationProps {
  message?: string;
  className?: string;
}

export function ErrorAnimation({ message, className }: ErrorAnimationProps) {
  return (
    <motion.div
      variants={errorShake}
      animate="animate"
      className={cn(
        'flex flex-col items-center justify-center space-y-4',
        className
      )}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        <XCircle className="w-16 h-16 text-red-500" />
      </motion.div>
      {message && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg font-medium text-gray-900"
        >
          {message}
        </motion.p>
      )}
    </motion.div>
  );
}

interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  show: boolean;
  onClose?: () => void;
}

export function Toast({ type, message, show, onClose }: ToastProps) {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          variants={toast}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={cn(
            'fixed bottom-4 right-4 z-50 flex items-center space-x-3 px-4 py-3 rounded-lg border shadow-lg',
            bgColors[type]
          )}
        >
          {icons[type]}
          <p className="text-sm font-medium text-gray-900">{message}</p>
          {onClose && (
            <button
              onClick={onClose}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface BounceIconProps {
  icon: React.ReactNode;
  className?: string;
}

export function BounceIcon({ icon, className }: BounceIconProps) {
  return (
    <motion.div variants={bounce} animate="animate" className={className}>
      {icon}
    </motion.div>
  );
}
