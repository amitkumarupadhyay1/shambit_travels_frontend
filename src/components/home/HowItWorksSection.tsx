'use client';

import { motion } from 'framer-motion';
import { MapPin, Settings, Calendar } from 'lucide-react';
import { cn, sacredStyles } from '@/lib/utils';

const HowItWorksSection = () => {
  const steps = [
    {
      icon: MapPin,
      title: 'Choose Your Destination',
      description: 'Select from our curated list of sacred cities and spiritual destinations across India.',
      step: '01'
    },
    {
      icon: Settings,
      title: 'Customize Your Journey',
      description: 'Personalize your experience with hotels, activities, guides, and transport options.',
      step: '02'
    },
    {
      icon: Calendar,
      title: 'Book & Experience',
      description: 'Secure your booking and embark on a transformative journey of discovery.',
      step: '03'
    }
  ];

  return (
    <section className={cn(sacredStyles.section, "bg-white")}>
      <div className={sacredStyles.container}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className={cn(sacredStyles.heading.h2, "mb-6")}>
            How It <span className="sacred-gradient-text">Works</span>
          </h2>
          <p className={cn(sacredStyles.text.body, "max-w-2xl mx-auto")}>
            Three simple steps to create your perfect spiritual journey
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative text-center group"
              >
                {/* Step Number */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-600/10 rounded-full flex items-center justify-center">
                  <span className="font-playfair font-bold text-yellow-600 text-lg">
                    {step.step}
                  </span>
                </div>

                {/* Icon */}
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-orange-600 to-yellow-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-10 h-10 text-white" />
                </div>

                {/* Content */}
                <h3 className={cn(sacredStyles.heading.h4, "mb-4")}>
                  {step.title}
                </h3>
                <p className={sacredStyles.text.body}>
                  {step.description}
                </p>

                {/* Connector Line (except for last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-yellow-600 to-transparent transform translate-x-6"></div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <button className={cn(sacredStyles.button.secondary, "text-lg")}>
            Start Your Journey Today
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;