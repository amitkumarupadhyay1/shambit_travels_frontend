'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Article, MediaItem, apiService } from '@/lib/api';
import {
    ChevronLeft,
    Share2,
    Bookmark,
    Type,
    X,
    Heart
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ArticleDetailClientProps {
    slug: string;
}

type Theme = 'light' | 'sepia' | 'dark';
type FontFamily = 'serif' | 'sans';

export default function ArticleDetailClient({ slug }: ArticleDetailClientProps) {
    // Data State
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [adjacentArticles, setAdjacentArticles] = useState<{ next: Article | null; prev: Article | null }>({ next: null, prev: null });
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);

    // Appearance State
    const [theme, setTheme] = useState<Theme>('light');
    const [fontSize, setFontSize] = useState(18);
    const [fontFamily, setFontFamily] = useState<FontFamily>('serif');
    const [showAppearanceMenu, setShowAppearanceMenu] = useState(false);
    const [showHeader, setShowHeader] = useState(true);

    // Scroll handling for header visibility
    const { scrollY } = useScroll();
    const lastScrollY = useRef(0);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const currentScrollY = latest;
        if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
            setShowHeader(false); // Hide on scroll down
        } else {
            setShowHeader(true); // Show on scroll up
        }
        lastScrollY.current = currentScrollY;
    });

    useEffect(() => {
        const fetchArticleData = async () => {
            setLoading(true);
            try {
                const data = await apiService.getArticle(slug);
                setArticle(data);

                const allArticles = await apiService.getArticles();
                const currentIndex = allArticles.findIndex(a => a.id === data.id);

                if (currentIndex !== -1) {
                    setAdjacentArticles({
                        prev: currentIndex > 0 ? allArticles[currentIndex - 1] : null,
                        next: currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null
                    });
                }

                // Fetch attached media
                try {
                    const media = await apiService.getMediaForObject('articles.article', data.id);
                    setMediaItems(media);
                } catch (mediaErr) {
                    console.error('Failed to load media:', mediaErr);
                    // Don't fail the whole page if media fails
                }
            } catch (err) {
                console.error('Failed to load article:', err);
                setError('Failed to load article.');
            } finally {
                setLoading(false);
            }
        };

        fetchArticleData();
    }, [slug]);

    // Theme Styles
    const themeStyles = {
        light: "bg-white text-gray-900 selection:bg-orange-100 selection:text-orange-900",
        sepia: "bg-[#F8F4E6] text-[#433422] selection:bg-[#E6D4B5]",  // Kindle Sepia
        dark: "bg-[#1a1a1a] text-[#e0e0e0] selection:bg-[#404040]"    // Apple Dark
    };

    if (loading) {
        return (
            <div className={cn("min-h-screen flex items-center justify-center transition-colors duration-500", themeStyles[theme])}>
                <div className="w-full max-w-2xl px-6 space-y-8">
                    {/* Engaging Skeleton Loader */}
                    <div className="space-y-4 animate-pulse">
                        {/* Title Skeleton with Gradient Shimmer */}
                        <div className="h-12 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg w-3/4 mx-auto relative overflow-hidden">
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                            />
                        </div>

                        {/* Meta Info Skeleton */}
                        <div className="flex justify-center gap-4">
                            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                        </div>

                        {/* Image Skeleton */}
                        <div className="aspect-[16/9] bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl relative overflow-hidden shadow-sm">
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-30">
                                <div className="w-16 h-16 rounded-full bg-white/50" />
                            </div>
                        </div>

                        {/* Content Skeleton Lines - Staggered */}
                        <div className="space-y-3 pt-4">
                            {[85, 92, 78, 88, 65, 75].map((width, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0.5 }}
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
                                    className="h-4 bg-gray-200 rounded"
                                    style={{ width: `${width}%` }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4"
                >
                    <Bookmark className="w-8 h-8" />
                </motion.div>
                <p className="text-gray-900 text-lg font-medium mb-2">Article not found</p>
                <p className="text-gray-500 mb-8 text-center max-w-xs">The story you are looking for might have been moved or doesn&apos;t exist.</p>
                <Link
                    href="/articles"
                    className="px-6 py-2.5 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all hover:scale-105 active:scale-95 text-sm font-medium flex items-center gap-2 shadow-lg shadow-gray-200"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Library
                </Link>
            </div>
        );
    }

    const wordCount = article.content ? article.content.split(/\s+/).length : 0;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    return (
        <div className={cn("min-h-screen transition-colors duration-300", themeStyles[theme])}>
            {/* Minimal Header */}
            <motion.nav
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 px-4 h-14 flex items-center justify-between border-b transition-colors duration-300",
                    theme === 'dark' ? "bg-[#1a1a1a]/95 border-white/10" : theme === 'sepia' ? "bg-[#F8F4E6]/95 border-[#433422]/10" : "bg-white/95 border-gray-200"
                )}
                initial={{ y: 0 }}
                animate={{ y: showHeader ? 0 : -100 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                <div className="flex items-center gap-4">
                    <Link
                        href="/articles"
                        className={cn(
                            "p-2 -ml-2 rounded-full transition-colors",
                            theme === 'dark' ? "hover:bg-white/10 text-gray-300" : "hover:bg-black/5 text-gray-600"
                        )}
                        aria-label="Back"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Link>

                    <Link href="/" className="flex items-center gap-1 group">
                        <div className="text-xl font-playfair font-bold tracking-tight">
                            <span className={theme === 'dark' ? "text-white" : "midnight-blue-gradient-text"}>Sham</span>
                            <span className="sacred-gradient-text">Bit</span>
                        </div>
                    </Link>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setShowAppearanceMenu(!showAppearanceMenu)}
                        className={cn(
                            "p-2 rounded-full transition-colors relative",
                            theme === 'dark' ? "hover:bg-white/10 text-gray-300" : "hover:bg-orange-50 text-gray-600 hover:text-orange-600",
                            showAppearanceMenu && (theme === 'dark' ? "bg-white/10 text-orange-400" : "bg-orange-50 text-orange-600")
                        )}
                        aria-label="Appearance Settings"
                    >
                        <Type className="w-4 h-4" />
                    </button>
                    <button
                        className={cn(
                            "p-2 rounded-full transition-colors",
                            theme === 'dark' ? "hover:bg-white/10 text-gray-300 hover:text-orange-400" : "hover:bg-orange-50 text-gray-600 hover:text-orange-600"
                        )}
                        aria-label="Save"
                    >
                        <Bookmark className="w-4 h-4" />
                    </button>
                    <button
                        className={cn(
                            "p-2 -mr-2 rounded-full transition-colors",
                            theme === 'dark' ? "hover:bg-white/10 text-gray-300" : "hover:bg-orange-50 text-gray-600 hover:text-orange-600"
                        )}
                        aria-label="Share"
                    >
                        <Share2 className="w-4 h-4" />
                    </button>
                </div>
            </motion.nav>

            {/* Appearance Menu Popover */}
            <AnimatePresence>
                {showAppearanceMenu && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                            "fixed top-16 right-4 z-50 w-72 rounded-xl shadow-2xl border p-4",
                            theme === 'dark' ? "bg-[#252525] border-white/10 text-white" : "bg-white border-gray-200 text-gray-900"
                        )}
                    >
                        <div className="flex items-center justify-between pb-4 border-b border-gray-200/50">
                            <span className="text-xs font-semibold tracking-wider uppercase opacity-60">Appearance</span>
                            <button onClick={() => setShowAppearanceMenu(false)} className="opacity-60 hover:opacity-100">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Theme Selection */}
                        <div className="flex gap-2 py-4">
                            <button
                                onClick={() => setTheme('light')}
                                className={cn(
                                    "flex-1 h-20 rounded-lg border-2 flex flex-col items-center justify-center gap-2 text-sm font-medium transition-all",
                                    "bg-white text-gray-900",
                                    theme === 'light' ? "border-orange-500 shadow-sm ring-1 ring-orange-200" : "border-gray-100 hover:border-gray-200"
                                )}
                            >
                                <div className="w-6 h-6 rounded-full border border-gray-200 bg-white" />
                                Light
                            </button>
                            <button
                                onClick={() => setTheme('sepia')}
                                className={cn(
                                    "flex-1 h-20 rounded-lg border-2 flex flex-col items-center justify-center gap-2 text-sm font-medium transition-all",
                                    "bg-[#F8F4E6] text-[#433422]",
                                    theme === 'sepia' ? "border-orange-500 shadow-sm ring-1 ring-orange-200" : "border-[#E6D4B5] hover:border-[#d4c2a3]"
                                )}
                            >
                                <div className="w-6 h-6 rounded-full border border-[#d4c2a3] bg-[#F8F4E6]" />
                                Sepia
                            </button>
                            <button
                                onClick={() => setTheme('dark')}
                                className={cn(
                                    "flex-1 h-20 rounded-lg border-2 flex flex-col items-center justify-center gap-2 text-sm font-medium transition-all",
                                    "bg-[#1a1a1a] text-gray-200",
                                    theme === 'dark' ? "border-orange-500 shadow-sm ring-1 ring-orange-200" : "border-[#333] hover:border-[#444]"
                                )}
                            >
                                <div className="w-6 h-6 rounded-full border border-[#444] bg-[#1a1a1a]" />
                                Dark
                            </button>
                        </div>

                        {/* Font Size & Family */}
                        <div className="space-y-4 pt-2">
                            <div className={cn(
                                "flex items-center justify-between p-2 rounded-lg",
                                theme === 'dark' ? "bg-white/5" : "bg-gray-100"
                            )}>
                                <button
                                    onClick={() => setFontSize(Math.max(14, fontSize - 2))}
                                    className="p-2 opacity-70 hover:opacity-100"
                                    aria-label="Decrease font size"
                                >
                                    <span className="text-xs font-bold">A</span>
                                </button>
                                <span className="text-xs font-medium opacity-50">{fontSize}px</span>
                                <button
                                    onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                                    className="p-2 opacity-70 hover:opacity-100"
                                    aria-label="Increase font size"
                                >
                                    <span className="text-lg font-bold">A</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => setFontFamily('sans')}
                                    className={cn(
                                        "py-2 px-3 rounded-lg text-sm font-sans transition-colors",
                                        fontFamily === 'sans'
                                            ? (theme === 'dark' ? "bg-white/20" : "bg-gray-200")
                                            : (theme === 'dark' ? "hover:bg-white/10" : "hover:bg-gray-100")
                                    )}
                                >
                                    Sans-Serif
                                </button>
                                <button
                                    onClick={() => setFontFamily('serif')}
                                    className={cn(
                                        "py-2 px-3 rounded-lg text-sm font-serif transition-colors",
                                        fontFamily === 'serif'
                                            ? (theme === 'dark' ? "bg-white/20" : "bg-gray-200")
                                            : (theme === 'dark' ? "hover:bg-white/10" : "hover:bg-gray-100")
                                    )}
                                >
                                    Serif
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main className="pt-20 pb-32">
                <article className="max-w-2xl mx-auto px-6 sm:px-8">
                    {/* Header Info */}
                    <header className="mb-10 sm:mb-14">
                        <h1 className={cn(
                            "text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6 tracking-tight",
                            fontFamily === 'serif' ? "font-playfair" : "font-inter"
                        )}>
                            {article.title}
                        </h1>

                        <div className={cn(
                            "flex items-center gap-4 text-sm",
                            theme === 'dark' ? "text-gray-400" : "text-gray-500"
                        )}>
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-inherit">{article.author}</span>
                            </div>
                            <span>•</span>
                            <span>{new Date(article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            <span>•</span>
                            <span>{readingTime} min read</span>
                        </div>
                    </header>

                    {/* Standard Hero Image (Optional/Standard Size) */}
                    {article.featured_image && (
                        <div className="mb-10 sm:mb-14 rounded-lg overflow-hidden relative aspect-[16/9] bg-gray-100">
                            <Image
                                src={article.featured_image}
                                alt={article.title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div
                        className={cn(
                            "prose max-w-none transition-all duration-300",
                            theme === 'dark' ? "prose-invert" : "prose-gray",
                            fontFamily === 'serif' ? "font-source-serif" : "font-inter"
                        )}
                        style={{ fontSize: `${fontSize}px` }}
                        dangerouslySetInnerHTML={{ __html: article.content || '' }}
                    />

                    {/* Media Gallery */}
                    {mediaItems.length > 0 && (
                        <div className="mt-12 mb-8">
                            <h2 className={cn(
                                "text-2xl font-bold mb-6",
                                fontFamily === 'serif' ? "font-playfair" : "font-inter"
                            )}>
                                Gallery
                            </h2>
                            <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar snap-x">
                                {mediaItems.map((item) => (
                                    <div key={item.id} className="relative flex-none w-72 aspect-[4/3] rounded-xl overflow-hidden shrink-0 snap-center shadow-sm">
                                        <Image
                                            src={item.file_url}
                                            alt={item.alt_text || item.title || "Gallery image"}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Article Actions */}
                    <div className="mt-16 pt-8 border-t border-gray-200/20 flex items-center justify-between">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            whileHover={{ scale: 1.05 }}
                            className={cn(
                                "flex items-center gap-2 px-6 py-2.5 rounded-full transition-all text-sm font-medium shadow-sm",
                                theme === 'dark'
                                    ? "bg-white/10 hover:bg-white/20 text-white"
                                    : "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-md hover:shadow-orange-200"
                            )}
                        >
                            <Heart className="w-4 h-4 fill-white/20" />
                            <span>Like Story</span>
                        </motion.button>

                        <div className={cn(
                            "text-sm",
                            theme === 'dark' ? "text-gray-500" : "text-gray-400"
                        )}>
                            1.2k reads
                        </div>
                    </div>

                    <div className="mt-16 pt-8 border-t border-gray-200/10 text-center">
                        <p className={cn("text-xs font-medium uppercase tracking-widest opacity-40 mb-4", theme === 'dark' ? "text-white" : "text-gray-900")}>Read more on</p>
                        <Link href="/" className="inline-flex items-center justify-center gap-1 opacity-80 hover:opacity-100 transition-opacity">
                            <div className="text-2xl font-playfair font-bold tracking-tight">
                                <span className={theme === 'dark' ? "text-white" : "midnight-blue-gradient-text"}>Sham</span>
                                <span className="sacred-gradient-text">Bit</span>
                            </div>
                        </Link>
                    </div>
                </article>
            </main>

            {/* Footer Navigation */}
            <div className={cn(
                "border-t py-12",
                theme === 'dark' ? "border-white/10 bg-[#1a1a1a]" : theme === 'sepia' ? "border-[#433422]/10 bg-[#F8F4E6]" : "border-gray-100 bg-gray-50"
            )}>
                <div className="max-w-2xl mx-auto px-6">
                    <p className={cn("text-xs font-semibold uppercase tracking-wider mb-8 opacity-50")}>Up Next</p>

                    <div className="grid gap-6">
                        {adjacentArticles.next && (
                            <Link href={`/articles/${adjacentArticles.next.slug}`} className="group block">
                                <h3 className={cn(
                                    "text-xl font-bold mb-2 group-hover:underline decoration-2 underline-offset-4",
                                    fontFamily === 'serif' ? "font-playfair" : "font-inter"
                                )}>
                                    {adjacentArticles.next.title}
                                </h3>
                                <p className={cn("text-sm opacity-60 line-clamp-2")}>
                                    {adjacentArticles.next.excerpt || "Read the next chapter in this journey..."}
                                </p>
                            </Link>
                        )}

                        {adjacentArticles.prev && (
                            <Link href={`/articles/${adjacentArticles.prev.slug}`} className="group block opacity-60 hover:opacity-100 transition-opacity mt-4 text-sm">
                                <span className="flex items-center gap-1">
                                    <ChevronLeft className="w-3 h-3" />
                                    Previous: {adjacentArticles.prev.title}
                                </span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
