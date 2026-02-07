'use client';

import { useComparison } from '@/contexts/ComparisonContext';
import { cn, sacredStyles, formatCurrency } from '@/lib/utils';
import { ArrowLeft, Check, X as XIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PackageComparePage() {
  const router = useRouter();
  const { packages, removePackage, clearAll } = useComparison();

  // Redirect if no packages to compare
  useEffect(() => {
    if (packages.length === 0) {
      router.push('/packages');
    }
  }, [packages.length, router]);

  if (packages.length === 0) {
    return null;
  }

  return (
    <main className={cn(sacredStyles.container, "py-24 md:py-32")}>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/packages"
          className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Packages
        </Link>
        
        <div className="flex items-center justify-between">
          <h1 className={sacredStyles.heading.h1}>
            Compare Packages
          </h1>
          <button
            onClick={clearAll}
            className="text-sm text-gray-600 hover:text-gray-900 underline"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="sticky left-0 bg-white z-10 p-4 text-left font-semibold text-gray-900 border-b-2 border-gray-200">
                Feature
              </th>
              {packages.map(pkg => (
                <th
                  key={pkg.id}
                  className="p-4 text-left border-b-2 border-gray-200 min-w-[280px]"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-lg text-gray-900">
                        {pkg.name}
                      </h3>
                      <button
                        onClick={() => removePackage(pkg.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <XIcon className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">{pkg.city_name}</p>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* Price Range */}
            <tr className="border-b border-gray-200">
              <td className="sticky left-0 bg-white z-10 p-4 font-medium text-gray-900">
                Price Range
              </td>
              {packages.map(pkg => (
                <td key={pkg.id} className="p-4">
                  <div className="text-2xl font-bold text-orange-600">
                    {pkg.experiences.length > 0
                      ? `From ${formatCurrency(Math.min(...pkg.experiences.map(e => e.base_price)))}`
                      : 'Custom'}
                  </div>
                </td>
              ))}
            </tr>

            {/* Number of Experiences */}
            <tr className="border-b border-gray-200 bg-gray-50">
              <td className="sticky left-0 bg-gray-50 z-10 p-4 font-medium text-gray-900">
                Experiences Included
              </td>
              {packages.map(pkg => (
                <td key={pkg.id} className="p-4">
                  <span className="text-lg font-semibold">
                    {pkg.experiences.length} experiences
                  </span>
                </td>
              ))}
            </tr>

            {/* Experiences List */}
            <tr className="border-b border-gray-200">
              <td className="sticky left-0 bg-white z-10 p-4 font-medium text-gray-900">
                Available Experiences
              </td>
              {packages.map(pkg => (
                <td key={pkg.id} className="p-4">
                  <ul className="space-y-2">
                    {pkg.experiences.slice(0, 5).map(exp => (
                      <li key={exp.id} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{exp.name}</span>
                      </li>
                    ))}
                    {pkg.experiences.length > 5 && (
                      <li className="text-sm text-gray-500">
                        +{pkg.experiences.length - 5} more
                      </li>
                    )}
                  </ul>
                </td>
              ))}
            </tr>

            {/* Hotel Options */}
            <tr className="border-b border-gray-200 bg-gray-50">
              <td className="sticky left-0 bg-gray-50 z-10 p-4 font-medium text-gray-900">
                Hotel Options
              </td>
              {packages.map(pkg => (
                <td key={pkg.id} className="p-4">
                  <div className="space-y-1">
                    {pkg.hotel_tiers.map(tier => (
                      <div key={tier.id} className="text-sm">
                        <span className="font-medium">{tier.name}</span>
                        <span className="text-gray-500"> ({tier.price_multiplier}x)</span>
                      </div>
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            {/* Transport Options */}
            <tr className="border-b border-gray-200">
              <td className="sticky left-0 bg-white z-10 p-4 font-medium text-gray-900">
                Transport Options
              </td>
              {packages.map(pkg => (
                <td key={pkg.id} className="p-4">
                  <div className="space-y-1">
                    {pkg.transport_options.map(transport => (
                      <div key={transport.id} className="text-sm">
                        <span className="font-medium">{transport.name}</span>
                        <span className="text-gray-500">
                          {' '}({formatCurrency(transport.base_price)})
                        </span>
                      </div>
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            {/* Description */}
            <tr className="border-b border-gray-200 bg-gray-50">
              <td className="sticky left-0 bg-gray-50 z-10 p-4 font-medium text-gray-900">
                Description
              </td>
              {packages.map(pkg => (
                <td key={pkg.id} className="p-4">
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {pkg.description}
                  </p>
                </td>
              ))}
            </tr>

            {/* Action Buttons */}
            <tr>
              <td className="sticky left-0 bg-white z-10 p-4"></td>
              {packages.map(pkg => (
                <td key={pkg.id} className="p-4">
                  <Link
                    href={`/packages/${pkg.slug}`}
                    className={cn(sacredStyles.button.primary, "w-full text-center block")}
                  >
                    Select This Package
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mobile Warning */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg md:hidden">
        <p className="text-sm text-blue-900">
          💡 Tip: For better comparison experience, try viewing this page on a larger screen.
        </p>
      </div>
    </main>
  );
}
