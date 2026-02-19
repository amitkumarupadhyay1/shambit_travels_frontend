import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { apiService } from '@/lib/api';
import PackageDetailClient from '@/components/packages/PackageDetailClient';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface PackageDetailPageProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PackageDetailPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const packageData = await apiService.getPackage(slug);
    
    return {
      title: `${packageData.name} - ShamBit`,
      description: packageData.description.substring(0, 160),
    };
  } catch {
    return {
      title: 'Package Not Found - ShamBit',
    };
  }
}

export default async function PackageDetailPage({ params }: PackageDetailPageProps) {
  const { slug } = await params;
  const packageData = await apiService.getPackage(slug);
  
  if (!packageData) {
    notFound();
  }
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50/30 to-white">
      <Header />
      <PackageDetailClient packageData={packageData} />
      <Footer />
    </main>
  );
}
