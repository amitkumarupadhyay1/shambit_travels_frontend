import { Metadata } from 'next';
import { apiService } from '@/lib/api';
import ArticleDetailClient from '@/components/articles/ArticleDetailClient';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {
        const { slug } = await params;
        const article = await apiService.getArticle(slug);

        return {
            title: `${article.title} | Shambit`,
            description: article.meta_description || article.excerpt,
            openGraph: {
                title: article.meta_title || article.title,
                description: article.meta_description || article.excerpt,
                images: article.featured_image ? [article.featured_image] : [],
            },
        };
    } catch {
        return {
            title: 'Article Not Found | Shambit',
            description: 'The requested article could not be found.',
        };
    }
}

export default async function ArticleDetailPage({ params }: Props) {
    const { slug } = await params;
    return <ArticleDetailClient slug={slug} />;
}
