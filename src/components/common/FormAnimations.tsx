'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  formFieldError,
  formFieldSuccess,
  validationMessage,
} from '@/lib/animations';

interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  success?: boolean;
  label?: string;
}

export function AnimatedInput({
  error,
  success,
  label,
  className,
  ...props
}: AnimatedInputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <motion.div
        variants={error ? formFieldError : success ? formFieldSuccess : undefined}
        animate={error ? 'animate' : success ? 'animate' : undefined}
        initial="initial"
      >
        <input
          className={cn(
            'w-full px-4 py-2 border rounded-lg transition-colors duration-200',
            'focus:outline-none focus:ring-2',
            error
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : success
              ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
              : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500',
            className
          )}
          {...props}
        />
      </motion.div>
      <AnimatePresence>
        {error && (
          <motion.div
            variants={validationMessage}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex items-center space-x-2 text-red-600 text-sm"
          >
            <XCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
        {success && !error && (
          <motion.div
            variants={validationMessage}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex items-center space-x-2 text-green-600 text-sm"
          >
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>Looks good!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface AnimatedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  success?: boolean;
  label?: string;
}

export function AnimatedTextarea({
  error,
  success,
  label,
  className,
  ...props
}: AnimatedTextareaProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <motion.div
        variants={error ? formFieldError : success ? formFieldSuccess : undefined}
        animate={error ? 'animate' : success ? 'animate' : undefined}
        initial="initial"
      >
        <textarea
          className={cn(
            'w-full px-4 py-2 border rounded-lg transition-colors duration-200',
            'focus:outline-none focus:ring-2',
            error
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : success
              ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
              : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500',
            className
          )}
          {...props}
        />
      </motion.div>
      <AnimatePresence>
        {error && (
          <motion.div
            variants={validationMessage}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex items-center space-x-2 text-red-600 text-sm"
          >
            <XCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface AnimatedSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  success?: boolean;
  label?: string;
  options: { value: string; label: string }[];
}

export function AnimatedSelect({
  error,
  success,
  label,
  options,
  className,
  ...props
}: AnimatedSelectProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <motion.div
        variants={error ? formFieldError : success ? formFieldSuccess : undefined}
        animate={error ? 'animate' : success ? 'animate' : undefined}
        initial="initial"
      >
        <select
          className={cn(
            'w-full px-4 py-2 border rounded-lg transition-colors duration-200',
            'focus:outline-none focus:ring-2',
            error
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : success
              ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
              : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500',
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </motion.div>
      <AnimatePresence>
        {error && (
          <motion.div
            variants={validationMessage}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex items-center space-x-2 text-red-600 text-sm"
          >
            <XCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface AnimatedCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function AnimatedCheckbox({
  label,
  error,
  className,
  ...props
}: AnimatedCheckboxProps) {
  return (
    <div className="space-y-2">
      <motion.div
        variants={error ? formFieldError : undefined}
        animate={error ? 'animate' : undefined}
        initial="initial"
        className="flex items-center space-x-2"
      >
        <input
          type="checkbox"
          className={cn(
            'w-4 h-4 text-orange-600 border-gray-300 rounded',
            'focus:ring-2 focus:ring-orange-500',
            error && 'border-red-500',
            className
          )}
          {...props}
        />
        <label className="text-sm text-gray-700">{label}</label>
      </motion.div>
      <AnimatePresence>
        {error && (
          <motion.div
            variants={validationMessage}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex items-center space-x-2 text-red-600 text-sm"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
