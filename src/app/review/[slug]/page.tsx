import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { apiService } from '@/lib/api';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ReviewPageClient from '@/components/review/ReviewPageClient';

interface ReviewPageProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ReviewPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const packageData = await apiService.getPackage(slug);
    
    return {
      title: `Review Booking - ${packageData.name} | ShamBit`,
      description: `Review your booking details for ${packageData.name} in ${packageData.city_name}`,
      robots: 'noindex, nofollow', // Private page
    };
  } catch {
    return {
      title: 'Review Booking - ShamBit',
      description: 'Review your travel booking details',
      robots: 'noindex, nofollow',
    };
  }
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  // Check authentication
  const session = await auth();
  
  if (!session) {
    redirect('/login?returnUrl=/packages');
  }

  const { slug } = await params;

  // Fetch package details
  let packageData;
  try {
    packageData = await apiService.getPackage(slug);
  } catch (error) {
    console.error('Failed to fetch package:', error);
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50/30 to-white">
      <Header />
      <div className="pt-[120px] md:pt-[140px] pb-24">
        <ReviewPageClient packageData={packageData} slug={slug} />
      </div>
      <Footer />
    </main>
  );
}
