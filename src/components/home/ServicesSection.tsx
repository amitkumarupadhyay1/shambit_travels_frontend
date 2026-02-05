'use client';

import { motion } from 'framer-motion';
import { Hotel, Car, Users, Camera, MapPin, Utensils } from 'lucide-react';
import { cn, sacredStyles } from '@/lib/utils';

const ServicesSection = () => {
  const services = [
    {
      icon: Hotel,
      title: 'Sacred Accommodations',
      description: 'Handpicked hotels and guesthouses that honor the spiritual essence of each destination.',
      features: ['Temple proximity', 'Spiritual ambiance', 'Traditional architecture']
    },
    {
      icon: Car,
      title: 'Comfortable Transport',
      description: 'Reliable and comfortable transportation options for your spiritual journey.',
      features: ['AC vehicles', 'Experienced drivers', 'Flexible schedules']
    },
    {
      icon: Users,
      title: 'Expert Guides',
      description: 'Knowledgeable local guides who understand the cultural and spiritual significance.',
      features: ['Cultural insights', 'Historical knowledge', 'Spiritual guidance']
    },
    {
      icon: Camera,
      title: 'Curated Experiences',
      description: 'Unique spiritual and cultural experiences tailored to your interests.',
      features: ['Temple visits', 'Cultural immersion', 'Spiritual practices']
    },
    {
      icon: Utensils,
      title: 'Authentic Cuisine',
      description: 'Taste the authentic flavors of each region with carefully selected dining experiences.',
      features: ['Local specialties', 'Vegetarian options', 'Sacred food traditions']
    },
    {
      icon: MapPin,
      title: 'Custom Itineraries',
      description: 'Personalized travel plans designed around your spiritual and cultural interests.',
      features: ['Flexible planning', 'Personal preferences', 'Sacred timing']
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
            Our <span className="gold-gradient bg-clip-text text-transparent">Services</span>
          </h2>
          <p className={cn(sacredStyles.text.body, "max-w-2xl mx-auto")}>
            Comprehensive travel services designed to create meaningful and transformative spiritual journeys
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className={cn(sacredStyles.card, "text-center hover:shadow-xl transition-all duration-300 group-hover:scale-105")}>
                  {/* Icon */}
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary-saffron to-primary-gold rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className={cn(sacredStyles.heading.h4, "mb-4 group-hover:text-primary-saffron transition-colors")}>
                    {service.title}
                  </h3>
                  
                  <p className={cn(sacredStyles.text.body, "mb-6")}>
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center justify-center text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-primary-gold rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
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
          <div className={cn(sacredStyles.card, "max-w-2xl mx-auto text-center")}>
            <h3 className={cn(sacredStyles.heading.h3, "mb-4")}>
              Ready to Begin Your <span className="gold-gradient bg-clip-text text-transparent">Sacred Journey</span>?
            </h3>
            <p className={cn(sacredStyles.text.body, "mb-6")}>
              Let us craft a personalized spiritual experience that resonates with your soul and creates lasting memories.
            </p>
            <button className={cn(sacredStyles.button.primary, "text-lg")}>
              Start Planning Today
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;