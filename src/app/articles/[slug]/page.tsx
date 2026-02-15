import { Metadata } from 'next';
import Script from 'next/script';
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
    return (
        <>
            {/* Google Translate Container (Visible but off-screen to ensure init) */}
            <div
                id="google_translate_element"
                style={{
                    position: 'absolute',
                    left: '-9999px',
                    top: '-9999px',
                    visibility: 'hidden'
                }}
            ></div>

            {/* 1. Global Init Function (Must be ready before script loads) */}
            <Script id="google-translate-config" strategy="beforeInteractive">
                {`
                    window.googleTranslateElementInit = function() {
                        try {
                            if (window.google && window.google.translate) {
                                new google.translate.TranslateElement({
                                    pageLanguage: 'en',
                                    includedLanguages: 'en,hi,ta,te,gu,ml,mr,kn,bn,pa,es,fr,de,zh-CN,ja,ar,pt,ru,it,ko,tr,nl,pl,sv,id,th,vi',
                                    layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                                    autoDisplay: false
                                }, 'google_translate_element');
                            }
                        } catch (e) {
                            // Silently fail in production post-polish
                        }
                    }
                `}
            </Script>

            {/* CSS to hide Google Translate branding for a professional look */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .goog-te-banner-frame.skiptranslate, 
                .goog-te-gadget-icon,
                .goog-te-gadget-simple img,
                .goog-te-menu-value span:nth-child(2),
                .goog-te-menu-value span:nth-child(3),
                .goog-te-menu-value span:nth-child(5) {
                    display: none !important;
                }
                .goog-te-gadget {
                    font-family: inherit !important;
                    font-size: 0 !important;
                }
                .goog-te-gadget .goog-te-combo {
                    display: none !important;
                }
                /* Hide the cookie info tooltip and banner */
                body {
                    top: 0 !important;
                }
                iframe.goog-te-banner-frame {
                    display: none !important;
                }
                .goog-logo-link {
                    display: none !important;
                }
                .goog-te-gadget span {
                    display: none !important;
                }
            `}} />

            {/* 2. Google Translate Library */}
            <Script
                src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
                strategy="afterInteractive"
            />

            <ArticleDetailClient slug={slug} />
        </>
    );
}
