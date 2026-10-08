import PublicLayout from '@/Layouts/PublicLayout';
import Card from '@/Components/Card';
import Badge from '@/Components/Badge';
import Button from '@/Components/Button';
import ChatWidget from '@/Components/ChatWidget';
import { Link } from '@inertiajs/react';

export default function PostDetail({ post, relatedPosts = [] }) {
    return (
        <PublicLayout>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Button href="/" variant="outline" size="sm" className="mb-6">
                    ← Kembali ke Beranda
                </Button>

                <article className="bg-white rounded-xl p-8 border border-slate-200/80 shadow-card space-y-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Badge variant="primary">{post.category?.name || 'Berita'}</Badge>
                            <span className="text-sm text-slate-500">
                                {post.published_at ? new Date(post.published_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
                            {post.title}
                        </h1>
                        <p className="text-sm text-slate-500">
                            Penulis: <span className="font-semibold text-slate-700">{post.user?.name || 'Humas SMALISKA'}</span>
                        </p>
                    </div>

                    {post.featured_image && (
                        <img 
                            src={post.featured_image} 
                            alt={post.title} 
                            className="w-full h-80 object-cover rounded-lg"
                        />
                    )}

                    <div className="prose max-w-none text-slate-700 leading-relaxed space-y-4 whitespace-pre-line">
                        {post.content}
                    </div>
                </article>

                {relatedPosts.length > 0 && (
                    <div className="mt-12 space-y-6">
                        <h3 className="text-xl font-bold text-slate-900">Berita Terkait</h3>
                        <div className="grid md:grid-cols-3 gap-6">
                            {relatedPosts.map((rel) => (
                                <Card key={rel.id} hover className="p-4 flex flex-col justify-between">
                                    <div>
                                        <Badge variant="secondary" className="mb-2">{rel.category?.name}</Badge>
                                        <h4 className="font-bold text-slate-900 hover:text-primary transition line-clamp-2">
                                            <Link href={`/berita/${rel.slug}`}>{rel.title}</Link>
                                        </h4>
                                    </div>
                                    <Link href={`/berita/${rel.slug}`} className="text-xs font-semibold text-primary mt-4 block">
                                        Baca Artikel →
                                    </Link>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <ChatWidget />
        </PublicLayout>
    );
}
