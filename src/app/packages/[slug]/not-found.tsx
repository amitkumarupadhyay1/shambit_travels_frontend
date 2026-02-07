import Link from 'next/link';
import { cn, sacredStyles } from '@/lib/utils';
import { PackageX } from 'lucide-react';

export default function PackageNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50/30 to-white">
      <div className="text-center px-4">
        <PackageX className="w-24 h-24 text-orange-600/40 mx-auto mb-6" />
        <h1 className={cn(sacredStyles.heading.h2, "mb-4")}>
          Package Not Found
        </h1>
        <p className={cn(sacredStyles.text.body, "mb-8 max-w-md mx-auto")}>
          The package you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/packages" className={sacredStyles.button.primary}>
            Browse All Packages
          </Link>
          <Link href="/" className={sacredStyles.button.secondary}>
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
