import PublicLayout from '@/Layouts/PublicLayout';
import Card from '@/Components/Card';
import ChatWidget from '@/Components/ChatWidget';
import { Link } from '@inertiajs/react';

export default function Archive({ title, type, items }) {
    const sectionBackground = ['pengumuman', 'prestasi'].includes(type) ? 'bg-white' : 'bg-slate-50';

    const renderItems = () => {
        if (!['agenda', 'prestasi', 'galeri'].includes(type)) {
            return (
                <div className="grid gap-6 md:grid-cols-3">
                    {items.data.map((post) => (
                        <Card key={post.id} hover className="flex flex-col overflow-hidden h-full">
                            <Link href={`/berita/${post.slug}`} className="block shrink-0">
                                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 flex items-center justify-center">
                                    {post.featured_image ? (
                                        <img
                                            src={post.featured_image}
                                            alt={post.title}
                                            className="h-full w-full object-cover"
                                        />
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
                                        <Link href={`/berita/${post.slug}`} className="hover:text-primary">{post.title}</Link>
                                    </h3>
                                </div>
                                <Link href={`/berita/${post.slug}`} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-bold text-primary transition hover:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                                    Baca selengkapnya <span aria-hidden="true">→</span>
                                </Link>
                            </div>
                        </Card>
                    ))}
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
                                <Link href={`/berita/${agenda.slug}`} className="block shrink-0">
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
                                            <Link href={`/berita/${agenda.slug}`} className="hover:text-primary">{agenda.title}</Link>
                                        </h3>
                                    </div>
                                    <Link href={`/berita/${agenda.slug}`} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-bold text-primary transition hover:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
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
                            <Link href={`/berita/${ach.slug}`} className="block shrink-0">
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
                                        <Link href={`/berita/${ach.slug}`} className="hover:text-primary">{ach.title}</Link>
                                    </h3>
                                </div>
                                <Link href={`/berita/${ach.slug}`} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-bold text-primary transition hover:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
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
                    {items.data.map((item) => (
                        <Card key={item.id} className="overflow-hidden group cursor-pointer">
                            <div className="aspect-square bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-medium">
                                {item.featured_image ? (
                                    <img src={item.featured_image} alt={item.title} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="p-2 text-center">Gambar tidak tersedia</span>
                                )}
                            </div>
                            <div className="p-2 text-center text-xs font-semibold text-slate-700 bg-white">
                                {item.title}
                            </div>
                        </Card>
                    ))}
                </div>
            );
        }

        return null;
    };

    return (
        <PublicLayout>
            <section className={`${sectionBackground} py-16 sm:py-20`}>
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
        </PublicLayout>
    );
}
