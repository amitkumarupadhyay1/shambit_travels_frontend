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
    Heart,
    Copy,
    Check,
    ThumbsDown,
    Languages
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

    // Interaction State
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);
    const [showLikeAnimation, setShowLikeAnimation] = useState(false);
    const [showDislikeAnimation, setShowDislikeAnimation] = useState(false);

    // Translation State
    const [showLanguageMenu, setShowLanguageMenu] = useState(false);
    const [currentLanguage, setCurrentLanguage] = useState('en');

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

    // Load static states and apply translation on mount
    useEffect(() => {
        if (article) {
            const likedArticles = JSON.parse(localStorage.getItem('likedArticles') || '[]');
            const dislikedArticles = JSON.parse(localStorage.getItem('dislikedArticles') || '[]');
            const bookmarkedArticles = JSON.parse(localStorage.getItem('bookmarkedArticles') || '[]');

            setIsLiked(likedArticles.includes(article.id));
            setIsDisliked(dislikedArticles.includes(article.id));
            setIsBookmarked(bookmarkedArticles.includes(article.id));

            // Apply saved translation
            const savedLang = localStorage.getItem('preferredLanguage');
            if (savedLang && savedLang !== 'en') {
                setCurrentLanguage(savedLang);
                const cookieValue = `/en/${savedLang}`;
                document.cookie = `googtrans=${cookieValue}; path=/`;

                if (window.location.hostname !== 'localhost') {
                    document.cookie = `googtrans=${cookieValue}; path=/; domain=${window.location.hostname}`;
                }
            }
        }
    }, [article]);

    // Save like state to localStorage whenever it changes
    useEffect(() => {
        if (article) {
            const likedArticles = JSON.parse(localStorage.getItem('likedArticles') || '[]');

            if (isLiked && !likedArticles.includes(article.id)) {
                likedArticles.push(article.id);
                localStorage.setItem('likedArticles', JSON.stringify(likedArticles));
            } else if (!isLiked && likedArticles.includes(article.id)) {
                const filtered = likedArticles.filter((id: number) => id !== article.id);
                localStorage.setItem('likedArticles', JSON.stringify(filtered));
            }
        }
    }, [isLiked, article]);

    // Save bookmark state to localStorage whenever it changes
    useEffect(() => {
        if (article) {
            const bookmarkedArticles = JSON.parse(localStorage.getItem('bookmarkedArticles') || '[]');

            if (isBookmarked && !bookmarkedArticles.includes(article.id)) {
                bookmarkedArticles.push(article.id);
                localStorage.setItem('bookmarkedArticles', JSON.stringify(bookmarkedArticles));
            } else if (!isBookmarked && bookmarkedArticles.includes(article.id)) {
                const filtered = bookmarkedArticles.filter((id: number) => id !== article.id);
                localStorage.setItem('bookmarkedArticles', JSON.stringify(filtered));
            }
        }
    }, [isBookmarked, article]);

    // Save dislike state to localStorage whenever it changes
    useEffect(() => {
        if (article) {
            const dislikedArticles = JSON.parse(localStorage.getItem('dislikedArticles') || '[]');

            if (isDisliked && !dislikedArticles.includes(article.id)) {
                dislikedArticles.push(article.id);
                localStorage.setItem('dislikedArticles', JSON.stringify(dislikedArticles));
            } else if (!isDisliked && dislikedArticles.includes(article.id)) {
                const filtered = dislikedArticles.filter((id: number) => id !== article.id);
                localStorage.setItem('dislikedArticles', JSON.stringify(filtered));
            }
        }
    }, [isDisliked, article]);

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
                        <div className="h-12 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg w-3/4 mx-auto relative overflow-hidden">
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                            />
                        </div>
                        <div className="flex justify-center gap-4">
                            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                        </div>
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
                        onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                        className={cn(
                            "p-2 rounded-full transition-colors relative",
                            theme === 'dark' ? "hover:bg-white/10 text-gray-300" : "hover:bg-orange-50 text-gray-600 hover:text-orange-600",
                            showLanguageMenu && (theme === 'dark' ? "bg-white/10 text-orange-400" : "bg-orange-50 text-orange-600")
                        )}
                        aria-label="Translate"
                    >
                        <Languages className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setIsBookmarked(!isBookmarked)}
                        className={cn(
                            "p-2 rounded-full transition-colors",
                            theme === 'dark' ? "hover:bg-white/10 text-gray-300 hover:text-orange-400" : "hover:bg-orange-50 text-gray-600 hover:text-orange-600",
                            isBookmarked && "text-orange-500"
                        )}
                        aria-label="Save"
                    >
                        <Bookmark className={cn("w-4 h-4", isBookmarked && "fill-current")} />
                    </button>
                    <button
                        onClick={() => setShowShareMenu(!showShareMenu)}
                        className={cn(
                            "p-2 -mr-2 rounded-full transition-colors relative",
                            theme === 'dark' ? "hover:bg-white/10 text-gray-300" : "hover:bg-orange-50 text-gray-600 hover:text-orange-600",
                            showShareMenu && "text-orange-500"
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

            {/* Share Menu Popover */}
            <AnimatePresence>
                {showShareMenu && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                            "fixed top-16 right-4 z-50 w-64 rounded-xl shadow-2xl border p-3",
                            theme === 'dark' ? "bg-[#252525] border-white/10 text-white" : "bg-white border-gray-200 text-gray-900"
                        )}
                    >
                        <div className="flex items-center justify-between pb-3 border-b border-gray-200/50 mb-3">
                            <span className="text-xs font-semibold tracking-wider uppercase opacity-60">Share</span>
                            <button onClick={() => setShowShareMenu(false)} className="opacity-60 hover:opacity-100">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <button
                            onClick={() => {
                                if (article) {
                                    navigator.clipboard.writeText(window.location.href);
                                    setLinkCopied(true);
                                    setTimeout(() => setLinkCopied(false), 2000);
                                }
                            }}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                theme === 'dark' ? "hover:bg-white/10" : "hover:bg-gray-100"
                            )}
                        >
                            {linkCopied ? (
                                <Check className="w-4 h-4 text-green-500" />
                            ) : (
                                <Copy className="w-4 h-4" />
                            )}
                            <span>{linkCopied ? "Link copied!" : "Copy link"}</span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Language Menu Popover */}
            <AnimatePresence>
                {showLanguageMenu && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                            "fixed top-16 right-4 z-40 p-4 rounded-2xl shadow-2xl border backdrop-blur-xl",
                            theme === 'dark'
                                ? "bg-[#1a1a1a]/95 border-white/10"
                                : "bg-white/95 border-gray-200"
                        )}
                        style={{ width: '280px' }}
                    >
                        <div className="space-y-3">
                            <div className={cn(
                                "text-sm font-semibold mb-3",
                                theme === 'dark' ? "text-gray-300" : "text-gray-700"
                            )}>
                                Translate Article
                            </div>

                            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto custom-scrollbar">
                                {[
                                    { code: 'en', name: 'English' },
                                    { code: 'hi', name: 'Hindi' },
                                    { code: 'ta', name: 'Tamil' },
                                    { code: 'te', name: 'Telugu' },
                                    { code: 'gu', name: 'Gujarati' },
                                    { code: 'ml', name: 'Malayalam' },
                                    { code: 'mr', name: 'Marathi' },
                                    { code: 'kn', name: 'Kannada' },
                                    { code: 'bn', name: 'Bengali' },
                                    { code: 'pa', name: 'Punjabi' },
                                    { code: 'es', name: 'Spanish' },
                                    { code: 'fr', name: 'French' },
                                    { code: 'de', name: 'German' },
                                    { code: 'zh-CN', name: 'Chinese' },
                                    { code: 'ja', name: 'Japanese' },
                                    { code: 'ar', name: 'Arabic' },
                                    { code: 'pt', name: 'Portuguese' },
                                    { code: 'ru', name: 'Russian' },
                                    { code: 'it', name: 'Italian' },
                                    { code: 'ko', name: 'Korean' },
                                    { code: 'tr', name: 'Turkish' },
                                    { code: 'nl', name: 'Dutch' },
                                    { code: 'pl', name: 'Polish' },
                                    { code: 'sv', name: 'Swedish' },
                                    { code: 'id', name: 'Indonesian' },
                                    { code: 'th', name: 'Thai' },
                                    { code: 'vi', name: 'Vietnamese' },
                                ].map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => {
                                            const langCode = lang.code;
                                            console.log(`[Shambit] User selected language: ${lang.name} (${langCode})`);
                                            setCurrentLanguage(langCode);
                                            localStorage.setItem('preferredLanguage', langCode);

                                            // 1. Set the googtrans cookie
                                            const cookieValue = `/en/${langCode}`;
                                            document.cookie = `googtrans=${cookieValue}; path=/`;

                                            if (window.location.hostname !== 'localhost') {
                                                document.cookie = `googtrans=${cookieValue}; path=/; domain=${window.location.hostname}`;
                                            }

                                            // 2. Trigger via DOM
                                            const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
                                            if (select) {
                                                select.value = langCode;
                                                select.dispatchEvent(new Event('change'));
                                            } else {
                                                // If we set the cookie, a reload will often force the translation
                                                if (langCode !== 'en') {
                                                    window.location.reload();
                                                }
                                            }

                                            setShowLanguageMenu(false);
                                        }}
                                        className={cn(
                                            "py-2 px-3 rounded-lg text-sm transition-colors text-left",
                                            currentLanguage === lang.code
                                                ? (theme === 'dark' ? "bg-orange-500/20 text-orange-400" : "bg-orange-100 text-orange-600")
                                                : (theme === 'dark' ? "hover:bg-white/10 text-gray-300" : "hover:bg-gray-100 text-gray-700")
                                        )}
                                    >
                                        {lang.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main className="pt-20 pb-32">
                <article className="max-w-2xl mx-auto px-6 sm:px-8">
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

                    <div
                        className={cn(
                            "prose max-w-none transition-all duration-300",
                            theme === 'dark' ? "prose-invert" : "prose-gray",
                            fontFamily === 'serif' ? "font-source-serif" : "font-inter"
                        )}
                        style={{ fontSize: `${fontSize}px` }}
                        dangerouslySetInnerHTML={{ __html: article.content || '' }}
                    />

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

                    <div className="mt-16 pt-8 border-t border-gray-200/20 flex items-center justify-center gap-4">
                        <motion.button
                            onClick={() => {
                                if (!isLiked) {
                                    setIsLiked(true);
                                    setIsDisliked(false);
                                    setShowLikeAnimation(true);
                                    setTimeout(() => setShowLikeAnimation(false), 1000);
                                } else {
                                    setIsLiked(false);
                                }
                            }}
                            whileTap={{ scale: 0.85 }}
                            whileHover={{ scale: 1.1 }}
                            animate={showLikeAnimation ? {
                                scale: [1, 1.3, 1],
                                rotate: [0, -10, 10, -10, 0],
                            } : {}}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className={cn(
                                "relative p-3 rounded-full transition-all duration-300",
                                isLiked
                                    ? "text-red-500 bg-red-50 shadow-lg shadow-red-200/50"
                                    : theme === 'dark'
                                        ? "text-gray-400 hover:text-red-400 hover:bg-red-950/20"
                                        : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                            )}
                            aria-label={isLiked ? "Unlike" : "Like"}
                        >
                            <AnimatePresence>
                                {showLikeAnimation && (
                                    <>
                                        {[...Array(8)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                                                animate={{
                                                    opacity: [1, 1, 0],
                                                    scale: [0, 1, 0.5],
                                                    x: Math.cos((i * Math.PI * 2) / 8) * 40,
                                                    y: Math.sin((i * Math.PI * 2) / 8) * 40,
                                                }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.6, ease: "easeOut" }}
                                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                                            >
                                                <Heart className="w-3 h-3 fill-red-500 text-red-500" />
                                            </motion.div>
                                        ))}
                                    </>
                                )}
                            </AnimatePresence>
                            <Heart className={cn("w-6 h-6 z-10", isLiked && "fill-current")} />
                        </motion.button>

                        <motion.button
                            onClick={() => {
                                if (!isDisliked) {
                                    setIsDisliked(true);
                                    setIsLiked(false);
                                    setShowDislikeAnimation(true);
                                    setTimeout(() => setShowDislikeAnimation(false), 600);
                                } else {
                                    setIsDisliked(false);
                                }
                            }}
                            whileTap={{ scale: 0.85 }}
                            whileHover={{ scale: 1.1 }}
                            animate={showDislikeAnimation ? { x: [-5, 5, -5, 5, 0], opacity: [1, 0.6, 1] } : {}}
                            transition={{ duration: 0.4 }}
                            className={cn(
                                "p-3 rounded-full transition-all duration-300",
                                isDisliked
                                    ? "text-blue-500 bg-blue-50 shadow-lg shadow-blue-200/50"
                                    : theme === 'dark'
                                        ? "text-gray-400 hover:text-blue-400 hover:bg-blue-950/20"
                                        : "text-gray-400 hover:text-blue-500 hover:bg-blue-50"
                            )}
                            aria-label={isDisliked ? "Remove dislike" : "Dislike"}
                        >
                            <ThumbsDown className={cn("w-6 h-6", isDisliked && "fill-current")} />
                        </motion.button>
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
