import PublicLayout from '@/Layouts/PublicLayout';
import Card from '@/Components/Card';
import ChatWidget from '@/Components/ChatWidget';
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
            .replace('Previous', 'Sebelumnya')
            .replace('Next', 'Berikutnya');

    return (
        <nav className="mt-10 flex flex-wrap items-center justify-center gap-1.5" aria-label="Navigasi halaman">
            {links.map((link, index) =>
                link.url ? (
                    <Link
                        key={index}
                        href={link.url}
                        preserveScroll
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

function Breadcrumbs({ keyword }) {
    return (
        <section className="w-full bg-slate-50 py-2 border-b border-slate-200/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex items-center flex-wrap gap-1.5 text-xs text-slate-500 font-medium">
                    <Link href="/" className="hover:text-primary transition-colors">
                        Beranda
                    </Link>
                    <span className="text-slate-300">/</span>
                    <span className="text-primary font-semibold">Pencarian</span>
                    {keyword && (
                        <>
                            <span className="text-slate-300">/</span>
                            <span className="text-slate-600 line-clamp-1 max-w-xs">&ldquo;{keyword}&rdquo;</span>
                        </>
                    )}
                </nav>
            </div>
        </section>
    );
}

export default function Search({ keyword = '', items }) {
    const [searchVal, setSearchVal] = useState(keyword);

    const handleSearch = (e) => {
        e.preventDefault();
        const trimmed = searchVal.trim();
        router.get('/cari', trimmed ? { q: trimmed } : {});
    };

    return (
        <PublicLayout>
            <Breadcrumbs keyword={keyword} />
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

                    {items.data && items.data.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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
                                        <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                                            <div>
                                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-600 sm:text-xs">
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
                                                {post.user?.name && (
                                                    <p className="mt-2 break-words text-[11px] text-slate-500 sm:text-xs">
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
                    ) : (
                        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-sm text-slate-600">
                            Tidak ditemukan hasil untuk kata kunci &ldquo;{keyword}&rdquo;.
                        </div>
                    )}

                    <Pagination links={items.links} />
                </div>
            </section>

            <ChatWidget />
        </PublicLayout>
    );
}
