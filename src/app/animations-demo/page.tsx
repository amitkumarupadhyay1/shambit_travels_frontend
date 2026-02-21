'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { sacredStyles, cn } from '@/lib/utils';
import { AnimatedButton } from '@/components/common/AnimatedButton';
import { AnimatedCard } from '@/components/common/AnimatedCard';
import {
  LoadingSpinner,
  LoadingDots,
  LoadingPulse,
  Skeleton,
  ButtonLoading,
} from '@/components/common/LoadingStates';
import {
  SuccessAnimation,
  ErrorAnimation,
  Toast,
} from '@/components/common/FeedbackAnimations';
import {
  AnimatedInput,
  AnimatedTextarea,
  AnimatedSelect,
  AnimatedCheckbox,
} from '@/components/common/FormAnimations';
import {
  staggerContainer,
  staggerItem,
} from '@/lib/animations';

export default function AnimationsDemoPage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning' | 'info'>('success');
  const [loading, setLoading] = useState(false);
  const [inputError, setInputError] = useState('');
  const [inputSuccess, setInputSuccess] = useState(false);

  const handleButtonClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 2000);
  };

  const handleToast = (type: typeof toastType) => {
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length < 3) {
      setInputError('Must be at least 3 characters');
      setInputSuccess(false);
    } else {
      setInputError('');
      setInputSuccess(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gradient-to-b from-orange-50 to-white"
    >
      <div className={cn(sacredStyles.container, sacredStyles.spacing.page.both)}>
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className={sacredStyles.heading.h1}>
            Micro-interactions & Animations
          </h1>
          <p className={cn(sacredStyles.text.body, 'mt-4')}>
            Explore all the beautiful animations and interactions
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-16"
        >
          {/* Button Animations */}
          <motion.section variants={staggerItem}>
            <h2 className={cn(sacredStyles.heading.h3, 'mb-6')}>
              Button Animations with Ripple Effect
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <AnimatedButton className={sacredStyles.button.primary}>
                Primary Button
              </AnimatedButton>
              <AnimatedButton className={sacredStyles.button.secondary}>
                Secondary Button
              </AnimatedButton>
              <AnimatedButton className={sacredStyles.button.cta}>
                CTA Button
              </AnimatedButton>
              <AnimatedButton
                className={sacredStyles.button.primary}
                loading={loading}
                onClick={handleButtonClick}
              >
                {loading ? 'Loading...' : 'Click Me'}
              </AnimatedButton>
            </div>
          </motion.section>

          {/* Card Hover Effects */}
          <motion.section variants={staggerItem}>
            <h2 className={cn(sacredStyles.heading.h3, 'mb-6')}>
              Card Hover Effects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <AnimatedCard hoverEffect="subtle">
                <h3 className="text-xl font-semibold mb-2">Subtle Hover</h3>
                <p className="text-gray-600">
                  Gentle elevation and scale on hover
                </p>
              </AnimatedCard>
              <AnimatedCard hoverEffect="default">
                <h3 className="text-xl font-semibold mb-2">Default Hover</h3>
                <p className="text-gray-600">
                  Moderate elevation and scale on hover
                </p>
              </AnimatedCard>
              <AnimatedCard hoverEffect="bold">
                <h3 className="text-xl font-semibold mb-2">Bold Hover</h3>
                <p className="text-gray-600">
                  Strong elevation and scale on hover
                </p>
              </AnimatedCard>
            </div>
          </motion.section>

          {/* Loading States */}
          <motion.section variants={staggerItem}>
            <h2 className={cn(sacredStyles.heading.h3, 'mb-6')}>
              Loading State Animations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="flex flex-col items-center space-y-4">
                <LoadingSpinner size="lg" />
                <p className="text-sm text-gray-600">Spinner</p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <LoadingDots />
                <p className="text-sm text-gray-600">Dots</p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <LoadingPulse />
                <p className="text-sm text-gray-600">Pulse</p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <ButtonLoading />
                <p className="text-sm text-gray-600">Button Loading</p>
              </div>
            </div>
            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-semibold">Skeleton Loaders</h3>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex items-center space-x-4">
                <Skeleton variant="circular" className="w-12 h-12" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            </div>
          </motion.section>

          {/* Success/Error Feedback */}
          <motion.section variants={staggerItem}>
            <h2 className={cn(sacredStyles.heading.h3, 'mb-6')}>
              Success & Error Feedback
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                {showSuccess ? (
                  <SuccessAnimation message="Operation Successful!" />
                ) : (
                  <button
                    onClick={() => {
                      setShowSuccess(true);
                      setTimeout(() => setShowSuccess(false), 3000);
                    }}
                    className={sacredStyles.button.primary}
                  >
                    Show Success
                  </button>
                )}
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                {showError ? (
                  <ErrorAnimation message="Something went wrong!" />
                ) : (
                  <button
                    onClick={() => {
                      setShowError(true);
                      setTimeout(() => setShowError(false), 3000);
                    }}
                    className={sacredStyles.button.secondary}
                  >
                    Show Error
                  </button>
                )}
              </div>
            </div>
          </motion.section>

          {/* Toast Notifications */}
          <motion.section variants={staggerItem}>
            <h2 className={cn(sacredStyles.heading.h3, 'mb-6')}>
              Toast Notifications
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => handleToast('success')}
                className={sacredStyles.button.primary}
              >
                Success Toast
              </button>
              <button
                onClick={() => handleToast('error')}
                className={sacredStyles.button.secondary}
              >
                Error Toast
              </button>
              <button
                onClick={() => handleToast('warning')}
                className={sacredStyles.button.secondary}
              >
                Warning Toast
              </button>
              <button
                onClick={() => handleToast('info')}
                className={sacredStyles.button.secondary}
              >
                Info Toast
              </button>
            </div>
          </motion.section>

          {/* Form Validation Animations */}
          <motion.section variants={staggerItem}>
            <h2 className={cn(sacredStyles.heading.h3, 'mb-6')}>
              Form Validation Animations
            </h2>
            <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl">
              <div className="space-y-6">
                <AnimatedInput
                  label="Username"
                  placeholder="Enter username"
                  error={inputError}
                  success={inputSuccess}
                  onChange={handleInputChange}
                />
                <AnimatedTextarea
                  label="Message"
                  placeholder="Enter your message"
                  rows={4}
                />
                <AnimatedSelect
                  label="Country"
                  options={[
                    { value: '', label: 'Select a country' },
                    { value: 'india', label: 'India' },
                    { value: 'usa', label: 'United States' },
                    { value: 'uk', label: 'United Kingdom' },
                  ]}
                />
                <AnimatedCheckbox
                  label="I agree to the terms and conditions"
                />
              </div>
            </div>
          </motion.section>
        </motion.div>
      </div>

      {/* Toast Component */}
      <Toast
        type={toastType}
        message={`This is a ${toastType} toast notification!`}
        show={showToast}
        onClose={() => setShowToast(false)}
      />
    </motion.div>
  );
}
