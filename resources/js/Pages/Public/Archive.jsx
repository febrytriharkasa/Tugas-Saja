import PublicLayout from '@/Layouts/PublicLayout';
import Card from '@/Components/Card';
import Badge from '@/Components/Badge';
import ChatWidget from '@/Components/ChatWidget';
import { Link } from '@inertiajs/react';

export default function Archive({ title, type, items }) {
    const renderItems = () => {
        if (
            type === 'posts' ||
            type === 'berita' ||
            type === 'pengumuman' ||
            type === 'fasilitas' ||
            type === 'kerjasama' ||
            type === 'guru-tendik' ||
            type === 'gtk'
        ) {
            return (
                <div className="grid md:grid-cols-3 gap-6">
                    {items.data.map((post) => (
                        <Card key={post.id} hover className="flex flex-col overflow-hidden h-full">
                            <div className="h-48 w-full bg-slate-100 shrink-0 flex items-center justify-center">
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
                            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Badge variant="primary">{post.category?.name || title}</Badge>
                                        <span className="text-xs text-slate-400">
                                            {post.published_at ? new Date(post.published_at).toLocaleDateString('id-ID') : '-'}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-900 hover:text-primary transition line-clamp-2">
                                        <Link href={`/berita/${post.slug}`}>{post.title}</Link>
                                    </h3>
                                </div>
                                <Link href={`/berita/${post.slug}`} className="text-sm font-semibold text-primary hover:underline">
                                    Baca Selengkapnya →
                                </Link>
                            </div>
                        </Card>
                    ))}
                </div>
            );
        }

        if (type === 'agenda') {
            return (
                <div className="grid md:grid-cols-3 gap-6">
                    {items.data.map((agenda) => {
                        const dateVal = agenda.metadata?.event_date || agenda.published_at;
                        return (
                            <Card key={agenda.id} hover className="flex flex-col overflow-hidden h-full">
                                <div className="h-48 w-full bg-slate-100 shrink-0 flex items-center justify-center">
                                    {agenda.featured_image ? (
                                        <img src={agenda.featured_image} alt={agenda.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-xs text-slate-400 font-medium">Gambar tidak tersedia</span>
                                    )}
                                </div>
                                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <Badge variant="secondary">{agenda.category?.name || 'Agenda'}</Badge>
                                            <span className="text-xs text-slate-400">
                                                {dateVal ? new Date(dateVal).toLocaleDateString('id-ID') : '-'}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-lg text-slate-900 hover:text-primary transition line-clamp-2">
                                            <Link href={`/berita/${agenda.slug}`}>{agenda.title}</Link>
                                        </h3>
                                        {agenda.metadata && Object.keys(agenda.metadata).length > 0 && (
                                            <div className="mt-3 flex flex-wrap gap-1.5 text-xs text-slate-500">
                                                {Object.entries(agenda.metadata).map(([k, v]) => (
                                                    <span key={k} className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{String(v)}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <Link href={`/berita/${agenda.slug}`} className="text-sm font-semibold text-primary hover:underline">
                                        Baca Selengkapnya →
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
                <div className="grid md:grid-cols-3 gap-6">
                    {items.data.map((ach) => (
                        <Card key={ach.id} hover className="overflow-hidden flex flex-col h-full">
                            <div className="h-48 w-full bg-slate-100 shrink-0 flex items-center justify-center">
                                {ach.featured_image ? (
                                    <img src={ach.featured_image} alt={ach.title} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-xs text-slate-400 font-medium">Gambar tidak tersedia</span>
                                )}
                            </div>
                            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                                <div>
                                    <Badge variant="tertiary" className="mb-2">{ach.category?.name || 'Prestasi'}</Badge>
                                    <h3 className="font-bold text-slate-900 text-sm mb-1">
                                        <Link href={`/berita/${ach.slug}`} className="hover:text-primary transition">{ach.title}</Link>
                                    </h3>
                                    {ach.metadata && (
                                        <div className="mt-2 flex flex-wrap gap-1.5 text-xs text-slate-600">
                                            {Object.entries(ach.metadata).map(([k, v]) => (
                                                <span key={k} className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{String(v)}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <Link href={`/berita/${ach.slug}`} className="text-sm font-semibold text-primary hover:underline">
                                    Baca Selengkapnya →
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Badge variant="secondary" className="mb-4">Arsip</Badge>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-10">{title}</h1>

                {renderItems()}

                {items.data.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                        Belum ada data {title.toLowerCase()}.
                    </div>
                )}
            </div>

            <ChatWidget />
        </PublicLayout>
    );
}
