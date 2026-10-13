import PublicLayout from '@/Layouts/PublicLayout';
import Card from '@/Components/Card';
import ChatWidget from '@/Components/ChatWidget';
import MediaPreviewModal from '@/Components/MediaPreviewModal';
import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { youtubeThumbnailUrl } from '@/lib/postBlocks';
import { postUrl } from '@/lib/postUrl';

function Breadcrumbs({ post, title }) {
    return (
        <section className="w-full bg-slate-50 py-2 border-b border-slate-200/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex items-center flex-wrap gap-1.5 text-xs text-slate-500 font-medium">
                    <Link href="/" className="hover:text-primary transition-colors">
                        Beranda
                    </Link>
                    <span className="text-slate-300">/</span>
                    <span className="text-primary font-semibold">{post?.category?.name || title}</span>
                </nav>
            </div>
        </section>
    );
}
export default function Archive({ title, type, items }) {
    const [previewItem, setPreviewItem] = useState(null);
    const post = items.data?.[0] ?? null;

    const renderItems = () => {
        if (!['agenda', 'prestasi', 'galeri'].includes(type)) {
            return (
                <div className="grid gap-6 md:grid-cols-3">
                    
                    {items.data.map((post) => {
                        const thumbnail = post.media_type === 'video' ? youtubeThumbnailUrl(post.video_url) : post.featured_image;
                        return (
                            <Card key={post.id} hover className="flex flex-col overflow-hidden h-full">
                                <Link href={postUrl(post)} className="block shrink-0">
                                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 flex items-center justify-center">
                                        {thumbnail ? (
                                            <div className="relative h-full w-full">
                                                <img
                                                    src={thumbnail}
                                                    alt={post.title}
                                                    className="h-full w-full object-cover"
                                                />
                                                {post.media_type === 'video' && (
                                                    <span className="absolute inset-0 flex items-center justify-center bg-slate-900/35" aria-hidden="true">
                                                        <svg className="h-9 w-9 text-white drop-shadow" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M8 5v14l11-7z" />
                                                        </svg>
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-slate-400 font-medium">Gambar tidak tersedia</span>
                                        )}
                                    </div>
                                </Link>
                                <div className="flex flex-1 flex-col justify-between p-5">
                                    <div>
                                        <div className="flex items-center gap-2 text-xs text-slate-600">
                                            <span className="font-bold text-primary">{post.category?.name || title}</span>
                                            <span>
                                                {post.published_at ? new Date(post.published_at).toLocaleDateString('id-ID') : '-'}
                                            </span>
                                        </div>
                                        <h3 className="mt-3 line-clamp-2 text-lg font-bold text-slate-900">
                                            <Link href={postUrl(post)} className="hover:text-primary">{post.title}</Link>
                                        </h3>
                                        {post.user?.name && (
                                            <p className="mt-2 text-xs text-slate-500">
                                                <span className="font-semibold text-slate-700">{post.user.name}</span>
                                            </p>
                                        )}
                                    </div>
                                    <Link href={postUrl(post)} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-bold text-primary transition hover:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                                        Baca selengkapnya <span aria-hidden="true">→</span>
                                    </Link>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            );
        }

        if (type === 'agenda') {
            return (
                <div className="grid gap-6 md:grid-cols-3">
                    {items.data.map((agenda) => {
                        const dateVal = agenda.metadata?.event_date || agenda.metadata?.tanggal_agenda || agenda.published_at;
                        return (
                            <Card key={agenda.id} hover className="flex flex-col overflow-hidden h-full">
                                <Link href={postUrl(agenda)} className="block shrink-0">
                                    <div className="h-48 w-full bg-slate-100 flex items-center justify-center">
                                        {agenda.featured_image ? (
                                            <img src={agenda.featured_image} alt={agenda.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-xs text-slate-400 font-medium">Gambar tidak tersedia</span>
                                        )}
                                    </div>
                                </Link>
                                <div className="flex flex-1 flex-col justify-between p-5">
                                    <div>
                                        <div className="flex items-center gap-2 text-xs text-slate-600">
                                            <span className="font-bold text-secondary">{agenda.category?.name || 'Agenda'}</span>
                                            <span>
                                                {dateVal ? new Date(dateVal).toLocaleDateString('id-ID') : '-'}
                                            </span>
                                        </div>
                                        <h3 className="mt-3 line-clamp-2 text-lg font-bold text-slate-900">
                                            <Link href={postUrl(agenda)} className="hover:text-primary">{agenda.title}</Link>
                                        </h3>
                                    </div>
                                    <Link href={postUrl(agenda)} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-bold text-primary transition hover:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                                        Baca selengkapnya <span aria-hidden="true">→</span>
                                    </Link>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            );
        }

        if (type === 'prestasi') {
            return (
                <div className="grid gap-6 md:grid-cols-3">
                    {items.data.map((ach) => (
                        <Card key={ach.id} hover className="overflow-hidden flex flex-col h-full">
                            <Link href={postUrl(ach)} className="block shrink-0">
                                <div className="h-48 w-full bg-slate-100 flex items-center justify-center">
                                    {ach.featured_image ? (
                                        <img src={ach.featured_image} alt={ach.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-xs text-slate-400 font-medium">Gambar tidak tersedia</span>
                                    )}
                                </div>
                            </Link>
                            <div className="flex flex-1 flex-col justify-between p-5">
                                <div>
                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                        <p className="text-xs font-bold uppercase tracking-wide text-tertiary">{ach.category?.name || 'Prestasi'}</p>
                                        <span>{ach.published_at ? new Date(ach.published_at).toLocaleDateString('id-ID') : '-'}</span>
                                    </div>
                                    <h3 className="mt-2 line-clamp-2 text-lg font-bold text-slate-900">
                                        <Link href={postUrl(ach)} className="hover:text-primary">{ach.title}</Link>
                                    </h3>
                                </div>
                                <Link href={postUrl(ach)} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-bold text-primary transition hover:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                                    Baca selengkapnya <span aria-hidden="true">→</span>
                                </Link>
                            </div>
                        </Card>
                    ))}
                </div>
            );
        }

        if (type === 'galeri') {
            return (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {items.data.map((item) => {
                        const thumb = item.media_type === 'video' && item.video_url ? youtubeThumbnailUrl(item.video_url) : item.featured_image;
                        return (
                            <Card key={item.id} className="overflow-hidden group flex flex-col h-full bg-white">
                                <button
                                    type="button"
                                    onClick={() => setPreviewItem(item)}
                                    className="relative aspect-square w-full bg-slate-100 overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-zoom-in"
                                    aria-label={`Lihat gambar penuh: ${item.title}`}
                                >
                                    {item.media_type === 'video' && item.video_url ? (() => {
                                        const videoThumb = youtubeThumbnailUrl(item.video_url);
                                        return (
                                            <div className="relative w-full h-full bg-slate-800">
                                                {videoThumb ? (
                                                    <img src={videoThumb} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                                ) : item.featured_image ? (
                                                    <img src={item.featured_image} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                                ) : null}
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <svg className="w-10 h-10 text-white drop-shadow" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                        <path d="M8 5v14l11-7z"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        );
                                    })() : item.featured_image ? (
                                        <div className="relative h-full w-full">
                                            <img src={item.featured_image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                            <span className="absolute bottom-2 right-2 rounded-md bg-slate-900/60 p-1.5 text-white opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16zm-3-8h6m-3-3v6" />
                                                </svg>
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="flex h-full w-full items-center justify-center p-2 text-center text-xs text-slate-400 font-medium">Gambar tidak tersedia</span>
                                    )}
                                </button>
                                <div className="p-3 bg-white flex-1 flex items-center">
                                    <Link
                                        href={postUrl(item)}
                                        className="line-clamp-2 text-xs font-bold text-slate-800 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                                        title={`Buka detail: ${item.title}`}
                                    >
                                        {item.title}
                                    </Link>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            );
        }

        return null;
    };

    return (
        <PublicLayout>
            <Breadcrumbs post={post} title={title} />
            <section className="bg-slate-50 py-12">
                
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
                            <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-secondary">Arsip informasi sekolah</p>
                        </div>
                    </div>

                    {renderItems()}

                    {items.data.length === 0 && (
                        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-sm text-slate-600">
                            Belum ada data {title.toLowerCase()}.
                        </div>
                    )}
                </div>
            </section>

            <ChatWidget />
            <MediaPreviewModal item={previewItem} onClose={() => setPreviewItem(null)} />
        </PublicLayout>
    );
}
