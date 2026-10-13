import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { youtubeThumbnailUrl } from '@/lib/postBlocks';

function youtubeEmbedUrl(url) {
    if (!url) return null;
    const match = url.match(
        /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
    );
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : null;
}

export default function MediaPreviewModal({ item, onClose }) {
    useEffect(() => {
        if (!item) return;

        const onKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', onKeyDown);
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = originalOverflow;
        };
    }, [item, onClose]);

    if (!item) return null;

    const isVideo = item.media_type === 'video' && Boolean(item.video_url);
    const videoEmbed = isVideo ? youtubeEmbedUrl(item.video_url) : null;
    const imageSrc = item.featured_image || (!isVideo && item.video_url ? youtubeThumbnailUrl(item.video_url) : null);

    return (
        <AnimatePresence>
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10"
                role="dialog"
                aria-modal="true"
                aria-label={`Preview ${item.title}`}
            >
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm cursor-zoom-out"
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="relative z-10 flex max-h-full max-w-5xl w-full flex-col overflow-hidden rounded-2xl bg-slate-900 text-white shadow-2xl border border-white/10"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
                        <p className="line-clamp-1 text-sm font-semibold text-white/90">
                            {item.title}
                        </p>
                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                            aria-label="Tutup preview"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Media Display */}
                    <div className="flex items-center justify-center bg-black/50 p-2 sm:p-4 max-h-[75vh] overflow-hidden">
                        {isVideo && videoEmbed ? (
                            <div className="aspect-video w-full max-w-4xl overflow-hidden rounded-lg shadow-lg">
                                <iframe
                                    src={videoEmbed}
                                    title={item.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="h-full w-full border-0"
                                />
                            </div>
                        ) : imageSrc ? (
                            <img
                                src={imageSrc}
                                alt={item.title}
                                className="max-h-[70vh] w-auto max-w-full rounded-lg object-contain shadow-lg"
                            />
                        ) : (
                            <div className="py-20 text-sm text-slate-400">Media tidak tersedia</div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
