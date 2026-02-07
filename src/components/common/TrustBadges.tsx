import { Shield, Clock, Award, HeadphonesIcon, CheckCircle, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrustBadgesProps {
  variant?: 'default' | 'compact';
}

export default function TrustBadges({ variant = 'default' }: TrustBadgesProps) {
  const badges = [
    {
      icon: Shield,
      title: 'Secure Payment',
      description: '100% secure transactions',
    },
    {
      icon: Clock,
      title: 'Instant Confirmation',
      description: 'Immediate booking confirmation',
    },
    {
      icon: Award,
      title: 'Verified Experiences',
      description: 'Quality assured activities',
    },
    {
      icon: HeadphonesIcon,
      title: '24/7 Support',
      description: 'Always here to help',
    },
    {
      icon: CheckCircle,
      title: 'Best Price Guarantee',
      description: 'Competitive pricing',
    },
    {
      icon: Star,
      title: 'Trusted by Thousands',
      description: '10,000+ happy travelers',
    },
  ];

  if (variant === 'compact') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6">
        {badges.slice(0, 4).map((badge, index) => (
          <div key={index} className="text-center">
            <badge.icon className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">{badge.title}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
      {badges.map((badge, index) => (
        <div
          key={index}
          className={cn(
            "flex items-start gap-4 p-4 rounded-lg",
            "bg-gradient-to-br from-orange-50 to-yellow-50",
            "border border-orange-100"
          )}
        >
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center">
              <badge.icon className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">{badge.title}</h3>
            <p className="text-sm text-gray-600">{badge.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
