import PublicLayout from '@/Layouts/PublicLayout';
import Seo from '@/Components/Seo';
import Card from '@/Components/Card';
import Breadcrumbs from '@/Components/Breadcrumbs';
import ChatWidget from '@/Components/ChatWidget';
import MediaPreviewModal from '@/Components/MediaPreviewModal';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { youtubeThumbnailUrl } from '@/lib/postBlocks';
import { postUrl } from '@/lib/postUrl';

function Pagination({ links }) {
    if (!links || links.length <= 3) return null;

    const label = (raw) =>
        raw
            .replace('&laquo;', '«')
            .replace('&raquo;', '»')
            .replace('Previous', '')
            .replace('Next', '');

    return (
        <nav className="mt-10 flex flex-wrap items-center justify-center gap-1.5" aria-label="Navigasi halaman">
            {links.map((link, index) =>
                link.url ? (
                    <Link
                        key={index}
                        href={link.url}
                        aria-current={link.active ? 'page' : undefined}
                        className={`inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-semibold transition ${
                            link.active
                                ? 'border-primary bg-primary text-white'
                                : 'border-slate-200 bg-white text-slate-700 hover:border-primary hover:text-primary'
                        }`}
                    >
                        <span dangerouslySetInnerHTML={{ __html: label(link.label) }} />
                    </Link>
                ) : (
                    <span
                        key={index}
                        aria-disabled="true"
                        className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-300"
                    >
                        <span dangerouslySetInnerHTML={{ __html: label(link.label) }} />
                    </span>
                ),
            )}
        </nav>
    );
}


function MediaCard({ item, onPreview }) {
    const thumb = item.media_type === 'video' && item.video_url ? youtubeThumbnailUrl(item.video_url) : item.featured_image;
    const hasMedia = item.media_type === 'video' ? Boolean(item.video_url) : Boolean(item.featured_image);
    return (
        <Card key={item.id} className="overflow-hidden group flex flex-col h-full bg-white">
            {hasMedia ? (
                <button
                    type="button"
                    onClick={() => onPreview(item)}
                    className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-zoom-in"
                    aria-label={`Preview: ${item.title}`}
                >
                    {item.media_type === 'video' && item.video_url ? (
                        <div className="relative w-full h-full bg-slate-800">
                            {thumb ? (
                                <img src={thumb} alt={item.title} loading="lazy" decoding="async" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                            ) : null}
                            <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                                <svg className="w-10 h-10 text-white drop-shadow" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </span>
                        </div>
                    ) : item.featured_image ? (
                        <div className="relative h-full w-full">
                            <img src={item.featured_image} alt={item.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            <span className="absolute bottom-2 right-2 rounded-md bg-slate-900/60 p-1.5 text-white opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16zm-3-8h6m-3-3v6" />
                                </svg>
                            </span>
                        </div>
                    ) : (
                        <span className="flex h-full w-full items-center justify-center p-2 text-center text-xs text-slate-500 font-medium">Gambar tidak tersedia</span>
                    )}
                </button>
            ) : (
                <Link href={postUrl(item)} className="block">
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 flex items-center justify-center">
                        <span className="text-xs text-slate-500 font-medium">Gambar tidak tersedia</span>
                    </div>
                </Link>
            )}
            <div className="flex flex-1 items-center bg-white p-3">
                <Link
                    href={postUrl(item)}
                    className="line-clamp-2 break-words text-xs font-bold text-slate-800 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded sm:text-sm"
                    title={`Buka detail: ${item.title}`}
                >
                    {item.title}
                </Link>
            </div>
        </Card>
    );
}

function StandardCard({ post }) {
    const thumbnail = post.media_type === 'video' ? youtubeThumbnailUrl(post.video_url) : post.featured_image;
    const hasMedia = post.media_type === 'video' ? Boolean(post.video_url) : Boolean(post.featured_image);
    return (
        <Card key={post.id} hover className="flex flex-col overflow-hidden h-full">
            {hasMedia ? (
                <Link href={postUrl(post)} className="block shrink-0">
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 flex items-center justify-center group">
                        {thumbnail ? (
                            <div className="relative h-full w-full">
                                <img src={thumbnail} alt={post.title} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                {post.media_type === 'video' && (
                                    <span className="absolute inset-0 flex items-center justify-center bg-slate-900/35" aria-hidden="true">
                                        <svg className="h-9 w-9 text-white drop-shadow" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </span>
                                )}
                            </div>
                        ) : (
                            <span className="text-xs text-slate-500 font-medium">Gambar tidak tersedia</span>
                        )}
                    </div>
                </Link>
            ) : (
                <Link href={postUrl(post)} className="block shrink-0">
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 flex items-center justify-center">
                        <span className="text-xs text-slate-500 font-medium">Gambar tidak tersedia</span>
                    </div>
                </Link>
            )}
            <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                <div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600">
                        {post.category && (
                            <span className="font-bold text-primary">{post.category.name}</span>
                        )}
                        <span>
                            {post.published_at ? new Date(post.published_at).toLocaleDateString('id-ID') : '-'}
                        </span>
                    </div>
                    <h3 className="mt-2 line-clamp-2 break-words text-base font-bold text-slate-900 sm:mt-3 sm:text-lg">
                        <Link href={postUrl(post)} className="hover:text-primary">{post.title}</Link>
                    </h3>
                    {post.category?.name?.toLowerCase() === 'berita' && post.user?.name && (
                        <p className="mt-1 break-words text-xs text-slate-500 sm:mt-2">
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
}

export default function Search({ keyword = '', items }) {
    const [searchVal, setSearchVal] = useState(keyword);
    const [previewItem, setPreviewItem] = useState(null);
    const [viewMode, setViewMode] = useState('standard');

    const handleSearch = (e) => {
        e.preventDefault();
        const trimmed = searchVal.trim();
        router.get('/cari', trimmed ? { q: trimmed } : {});
    };

    return (
        <PublicLayout>
            <Seo
                title={keyword ? `Pencarian: ${keyword}` : 'Pencarian'}
                description="Cari berita, agenda, prestasi, dan galeri kegiatan sekolah."
                robots="noindex, follow"
            />
            <Breadcrumbs
                items={[
                    { label: 'Beranda', href: '/' },
                    { label: 'Pencarian' },
                    ...(keyword ? [{ label: `“${keyword}”`, muted: true }] : []),
                ]}
            />
            <section className="bg-slate-50 py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                                {keyword ? `Hasil Pencarian: "${keyword}"` : 'Pencarian Informasi'}
                            </h1>
                            <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-secondary">
                                Ditemukan {items.total ?? items.data?.length ?? 0} data
                            </p>
                        </div>

                        <form onSubmit={handleSearch} className="flex gap-2 max-w-md w-full sm:w-auto">
                            <input
                                type="text"
                                value={searchVal}
                                onChange={(e) => setSearchVal(e.target.value)}
                                placeholder="Ketik kata kunci..."
                                className="flex-1 min-w-[200px] rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary bg-white shadow-sm"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors shadow-sm shrink-0"
                            >
                                Cari
                            </button>
                        </form>
                    </div>

                    <div className="mb-6 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-slate-700">Tampilan:</span>
                            <div className="inline-flex rounded-lg bg-white p-1 shadow-sm" role="radiogroup" aria-label="Pilih mode tampilan">
                                <button
                                    type="button"
                                    onClick={() => setViewMode('standard')}
                                    aria-pressed={viewMode === 'standard'}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition ${viewMode === 'standard' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
                                    Daftar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setViewMode('media')}
                                    aria-pressed={viewMode === 'media'}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition ${viewMode === 'media' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                                    Galeri
                                </button>
                            </div>
                        </div>
                    </div>

                    {items.data && items.data.length > 0 ? (
                        viewMode === 'media' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                                {items.data.map((item) => (
                                    <MediaCard key={item.id} item={item} onPreview={setPreviewItem} />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                                {items.data.map((post) => (
                                    <StandardCard key={post.id} post={post} />
                                ))}
                            </div>
                        )
                    ) : (
                        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-sm text-slate-600">
                            Tidak ditemukan hasil untuk kata kunci &ldquo;{keyword}&rdquo;.
                        </div>
                    )}

                    <Pagination links={items.links} />
                </div>
            </section>

            <ChatWidget />
            <MediaPreviewModal item={previewItem} onClose={() => setPreviewItem(null)} />
        </PublicLayout>
    );
}
