"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Globe, Newspaper, Image as ImageIcon, Film, Loader2, Check, X, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useCallback } from "react";

export interface SearchResult {
    title: string;
    url: string;
    description?: string;
    source?: string;
    age?: string;
    thumbnail?: string;
}

interface SearchProgressProps {
    status: string;
    step?: 'searching' | 'complete' | 'thinking';
    progress?: { current: number; total: number };
}

// Get clean domain name
function getDomainName(url: string): string {
    try {
        return new URL(url).hostname.replace('www.', '');
    } catch {
        return url;
    }
}

// Get favicon
function getFaviconUrl(url: string): string {
    try {
        const domain = new URL(url).hostname;
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=16`;
    } catch {
        return '';
    }
}

// Clean, professional search status component
export function SearchProgress({ status, step, progress }: SearchProgressProps) {
    const isComplete = step === 'complete' || (status && status.includes('Found'));
    const isThinking = step === 'thinking';

    // Determine styling based on state
    const getStateStyles = () => {
        if (isComplete) return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
        if (isThinking) return 'bg-violet-50 text-violet-600 border border-violet-200';
        return 'bg-neutral-100 text-neutral-600 border border-neutral-200';
    };

    // Determine icon based on state
    const getIcon = () => {
        if (isComplete) return <Check className="w-3.5 h-3.5" />;
        if (isThinking) return (
            <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
            >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2a8 8 0 0 1 8 8c0 3.5-2.5 6.5-6 7.5V22h-4v-4.5c-3.5-1-6-4-6-7.5a8 8 0 0 1 8-8z" />
                    <path d="M9 10h.01M15 10h.01M9.5 15a3.5 3.5 0 0 0 5 0" />
                </svg>
            </motion.div>
        );
        return <Loader2 className="w-3.5 h-3.5 animate-spin text-pink-500" />;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4"
        >
            <div className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${getStateStyles()}`}>
                {getIcon()}
                <span>{status}</span>
                {progress && !isComplete && !isThinking && (
                    <span className="text-neutral-400">
                        ({progress.current}/{progress.total})
                    </span>
                )}
            </div>
        </motion.div>
    );
}

// Lightbox Modal Component
interface LightboxProps {
    items: SearchResult[];
    currentIndex: number;
    type: 'image' | 'video';
    onClose: () => void;
    onNavigate: (direction: 'prev' | 'next') => void;
}

function Lightbox({ items, currentIndex, type, onClose, onNavigate }: LightboxProps) {
    const current = items[currentIndex];
    if (!current) return null;

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
        if (e.key === 'ArrowLeft' && currentIndex > 0) onNavigate('prev');
        if (e.key === 'ArrowRight' && currentIndex < items.length - 1) onNavigate('next');
    }, [currentIndex, items.length, onClose, onNavigate]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={onClose}
            onKeyDown={handleKeyDown}
            tabIndex={0}
        >
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
                <X className="w-6 h-6" />
            </button>

            {/* Navigation arrows */}
            {currentIndex > 0 && (
                <button
                    onClick={(e) => { e.stopPropagation(); onNavigate('prev'); }}
                    className="absolute left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
            )}
            {currentIndex < items.length - 1 && (
                <button
                    onClick={(e) => { e.stopPropagation(); onNavigate('next'); }}
                    className="absolute right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            )}

            {/* Content */}
            <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-4xl max-h-[80vh] mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                {type === 'image' ? (
                    <img
                        src={current.thumbnail || current.url}
                        alt={current.title}
                        className="max-h-[70vh] w-auto rounded-lg shadow-2xl object-contain"
                    />
                ) : (
                    <div className="relative aspect-video w-full max-w-3xl bg-black rounded-lg overflow-hidden">
                        {/* For videos, show thumbnail with link to source */}
                        {current.thumbnail ? (
                            <img
                                src={current.thumbnail}
                                alt={current.title}
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-400">
                                <Film className="w-16 h-16" />
                            </div>
                        )}
                    </div>
                )}

                {/* Caption */}
                <div className="mt-4 text-center">
                    <p className="text-white text-sm font-medium line-clamp-2">{current.title}</p>
                    <a
                        href={current.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-2 text-xs text-neutral-400 hover:text-white transition-colors"
                    >
                        <ExternalLink className="w-3 h-3" />
                        Open in new tab
                    </a>
                </div>

                {/* Counter */}
                <div className="mt-2 text-center text-xs text-neutral-500">
                    {currentIndex + 1} / {items.length}
                </div>
            </motion.div>
        </motion.div>
    );
}

interface SearchResultsGridProps {
    results: { category: string; results: SearchResult[] }[];
}

export function SearchResultsGrid({ results }: SearchResultsGridProps) {
    const [lightbox, setLightbox] = useState<{
        type: 'image' | 'video';
        items: SearchResult[];
        index: number;
    } | null>(null);

    if (!results || results.length === 0) return null;

    // Flatten all web/news results
    const webNewsResults = results
        .filter(g => g.category === 'web' || g.category === 'news')
        .flatMap(g => g.results);

    const imageResults = results.find(g => g.category === 'images')?.results || [];
    const videoResults = results.find(g => g.category === 'videos')?.results || [];

    const openLightbox = (type: 'image' | 'video', items: SearchResult[], index: number) => {
        setLightbox({ type, items, index });
    };

    const closeLightbox = () => setLightbox(null);

    const navigateLightbox = (direction: 'prev' | 'next') => {
        if (!lightbox) return;
        const newIndex = direction === 'prev' ? lightbox.index - 1 : lightbox.index + 1;
        if (newIndex >= 0 && newIndex < lightbox.items.length) {
            setLightbox({ ...lightbox, index: newIndex });
        }
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 space-y-3"
            >
                {/* Sources - Compact horizontal chips */}
                {webNewsResults.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <Globe className="w-3.5 h-3.5 text-neutral-400" />
                            <span className="text-xs font-medium text-neutral-500">Sources</span>
                            <span className="text-[10px] text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded">
                                {webNewsResults.length}
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {webNewsResults.slice(0, 10).map((result, idx) => (
                                <motion.a
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.03 }}
                                    href={result.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={result.title}
                                    className="inline-flex items-center gap-1.5 px-2 py-1 text-[11px] bg-white hover:bg-neutral-50 border border-neutral-200 hover:border-pink-300 rounded-md text-neutral-600 hover:text-pink-600 transition-all shadow-sm group"
                                >
                                    <img
                                        src={getFaviconUrl(result.url)}
                                        alt=""
                                        className="w-3 h-3 rounded-sm"
                                        onError={(e) => { e.currentTarget.style.display = 'none' }}
                                    />
                                    <span className="max-w-[100px] truncate">{getDomainName(result.url)}</span>
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Images - With lightbox preview */}
                {imageResults.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <ImageIcon className="w-3.5 h-3.5 text-neutral-400" />
                            <span className="text-xs font-medium text-neutral-500">Images</span>
                            <span className="text-[10px] text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded">
                                {imageResults.length}
                            </span>
                        </div>
                        <div className="flex gap-1.5 overflow-x-auto pb-1">
                            {imageResults.slice(0, 5).map((result, idx) => (
                                <motion.button
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    onClick={() => openLightbox('image', imageResults.slice(0, 5), idx)}
                                    className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200 hover:border-pink-300 transition-all shadow-sm hover:shadow-md cursor-pointer"
                                >
                                    {result.thumbnail ? (
                                        <img
                                            src={result.thumbnail}
                                            alt={result.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-neutral-300">
                                            <ImageIcon className="w-4 h-4" />
                                        </div>
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Videos - With lightbox preview */}
                {videoResults.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <Film className="w-3.5 h-3.5 text-neutral-400" />
                            <span className="text-xs font-medium text-neutral-500">Videos</span>
                            <span className="text-[10px] text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded">
                                {videoResults.length}
                            </span>
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-1">
                            {videoResults.slice(0, 5).map((result, idx) => (
                                <motion.button
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    onClick={() => openLightbox('video', videoResults.slice(0, 5), idx)}
                                    className="flex-shrink-0 w-24 rounded-lg overflow-hidden bg-white border border-neutral-200 hover:border-pink-300 transition-all shadow-sm hover:shadow-md cursor-pointer text-left"
                                >
                                    <div className="relative aspect-video bg-neutral-100">
                                        {result.thumbnail ? (
                                            <img
                                                src={result.thumbnail}
                                                alt={result.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-neutral-300">
                                                <Film className="w-4 h-4" />
                                            </div>
                                        )}
                                        {/* Play icon */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-5 h-5 rounded-full bg-white/90 flex items-center justify-center shadow">
                                                <div className="w-0 h-0 border-t-[3px] border-t-transparent border-l-[5px] border-l-neutral-700 border-b-[3px] border-b-transparent ml-0.5" />
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-neutral-600 p-1.5 line-clamp-1">{result.title}</p>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </motion.div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {lightbox && (
                    <Lightbox
                        items={lightbox.items}
                        currentIndex={lightbox.index}
                        type={lightbox.type}
                        onClose={closeLightbox}
                        onNavigate={navigateLightbox}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
