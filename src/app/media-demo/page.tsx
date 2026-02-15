import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { MediaGallery } from '@/components/media/MediaGallery';
import { sacredStyles, cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Media Gallery Demo - ShamBit',
  description: 'Test page for media gallery integration',
};

export default function MediaDemoPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50/30 to-white">
      <Header />
      
      <div className={cn(sacredStyles.container, "pt-32 pb-24 md:pt-40 md:pb-32")}>
        <h1 className={cn(sacredStyles.heading.h1, "mb-8")}>
          Media Gallery Demo
        </h1>
        
        <p className={cn(sacredStyles.text.body, "mb-12 max-w-3xl")}>
          This page demonstrates the dynamic media gallery integration. 
          Upload images through the Django admin panel and they will appear here automatically.
          Changes made in the admin (edit, delete) will reflect within 30 seconds.
        </p>

        {/* Example: City Media Gallery */}
        <section className="mb-16">
          <h2 className={cn(sacredStyles.heading.h3, "mb-6")}>
            City Gallery Example (City ID: 1)
          </h2>
          <MediaGallery 
            contentType="cities.city" 
            objectId={1}
            columns={3}
            showTitle={true}
          />
        </section>

        {/* Example: Package Media Gallery */}
        <section className="mb-16">
          <h2 className={cn(sacredStyles.heading.h3, "mb-6")}>
            Package Gallery Example (Package ID: 1)
          </h2>
          <MediaGallery 
            contentType="packages.package" 
            objectId={1}
            columns={4}
            showTitle={false}
          />
        </section>

        {/* Instructions */}
        <section className={cn(sacredStyles.card, "mt-16")}>
          <h3 className={cn(sacredStyles.heading.h4, "mb-4")}>
            How to Test
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Go to Django Admin: <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:8000/admin/</code></li>
            <li>Navigate to Media Library section</li>
            <li>Upload images and attach them to a City or Package</li>
            <li>Return to this page - images will appear automatically</li>
            <li>Edit or delete images in admin - changes reflect within 30 seconds</li>
          </ol>
        </section>
      </div>

      <Footer />
    </main>
  );
}
