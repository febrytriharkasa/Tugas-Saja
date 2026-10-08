import PublicLayout from '@/Layouts/PublicLayout';
import Card from '@/Components/Card';
import Badge from '@/Components/Badge';
import ChatWidget from '@/Components/ChatWidget';
import { Link } from '@inertiajs/react';

export default function Archive({ title, type, items }) {
    const renderItems = () => {
        if (type === 'posts' || type === 'berita' || type === 'pengumuman') {
            return (
                <div className="grid md:grid-cols-3 gap-6">
                    {items.data.map((post) => (
                        <Card key={post.id} hover className="flex flex-col">
                            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Badge variant="primary">{post.category?.name || 'Umum'}</Badge>
                                        <span className="text-xs text-slate-400">
                                            {post.published_at ? new Date(post.published_at).toLocaleDateString('id-ID') : '-'}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-900 hover:text-primary transition line-clamp-2">
                                        <Link href={`/berita/${post.slug}`}>{post.title}</Link>
                                    </h3>
                                    <p className="text-sm text-slate-600 mt-2 line-clamp-3">{post.content}</p>
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
                <div className="space-y-4">
                    {items.data.map((agenda) => {
                        const dateVal = agenda.metadata?.event_date || agenda.published_at;
                        return (
                            <Card key={agenda.id} hover className="p-6 flex gap-6">
                                <div className="w-16 h-16 bg-cyan-100 text-secondary rounded-lg flex flex-col items-center justify-center flex-shrink-0">
                                    <span className="text-2xl font-bold">
                                        {dateVal ? new Date(dateVal).getDate() : '-'}
                                    </span>
                                    <span className="text-xs uppercase">
                                        {dateVal ? new Date(dateVal).toLocaleDateString('id-ID', { month: 'short' }) : ''}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg text-slate-900">
                                        <Link href={`/berita/${agenda.slug}`} className="hover:text-primary transition">{agenda.title}</Link>
                                    </h3>
                                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">{agenda.content}</p>
                                    {agenda.metadata?.location && (
                                        <p className="text-xs text-slate-400 mt-2">📍 {agenda.metadata.location}</p>
                                    )}
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
                        <Card key={ach.id} hover className="p-6 text-center">
                            <div className="w-16 h-16 mx-auto bg-amber-100 text-tertiary rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                            </div>
                            <Badge variant="tertiary" className="mb-2">{ach.category?.name || 'Prestasi'}</Badge>
                            <h3 className="font-bold text-slate-900 text-sm mb-1">
                                <Link href={`/berita/${ach.slug}`} className="hover:text-primary transition">{ach.title}</Link>
                            </h3>
                            {ach.metadata?.participant_name && (
                                <p className="text-xs text-slate-600 mb-1">{ach.metadata.participant_name}</p>
                            )}
                            <p className="text-xs text-slate-500">
                                {ach.metadata?.rank || 'Juara'} • {ach.metadata?.year || (ach.published_at ? new Date(ach.published_at).getFullYear() : '-')}
                            </p>
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
                            <div className="aspect-square bg-slate-200 flex items-center justify-center text-slate-400 text-xs">
                                [Foto {item.title}]
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
