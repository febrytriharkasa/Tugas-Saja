import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import RichContent from '@/Components/RichContent';
import { blocksFromMetadata } from '@/lib/postBlocks';
import { router } from '@inertiajs/react';
import { useState } from 'react';

function youtubeEmbedUrl(url) {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

function MediaDisplay({ post }) {
    if (post.media_type === 'video' && post.video_url) {
        const embed = youtubeEmbedUrl(post.video_url);
        return embed ? (
            <div className="mb-6">
                <div className="aspect-video w-full overflow-hidden rounded-lg bg-slate-900">
                    <iframe src={embed} allowFullScreen className="h-full w-full border-0" title={post.title} />
                </div>
                <p className="mt-1 text-xs text-slate-500">{post.video_url}</p>
            </div>
        ) : (
            <div className="mb-6 rounded-lg bg-slate-100 p-4 text-xs text-slate-500">
                Link video tidak valid: {post.video_url}
            </div>
        );
    }
    if (post.featured_image) {
        return <img src={post.featured_image} alt={post.title} className="mb-6 max-h-96 w-full rounded-lg object-cover" />;
    }
    return null;
}

export default function PostShow({ post }) {
    const [updating, setUpdating] = useState(false);
    const blocks = blocksFromMetadata(post.metadata);
    const metadataEntries = post.metadata 
        ? Object.entries(post.metadata).filter(([key]) => key !== 'blocks') 
        : [];

    const handleStatusChange = (newStatus) => {
        setUpdating(true);
        router.patch(`/admin/posts/${post.id}/status`, { status: newStatus }, {
            preserveScroll: true,
            onFinish: () => setUpdating(false),
        });
    };

    return (
        <AdminLayout title="Detail Konten">
            <div className="mb-6 flex flex-wrap gap-3">
                <Button variant="outline" href="/admin/posts" icon="arrow-left">Kembali</Button>
                <Button href={`/admin/posts/${post.id}/edit`} icon="pencil">Edit Konten</Button>
            </div>

            <div className="grid items-start gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <Card className="p-6">
                        <MediaDisplay post={post} />
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{post.category?.name || 'Tanpa kategori'}</span>
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${post.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>{post.status === 'published' ? 'Terbit' : 'Draf'}</span>
                        </div>
                        <h1 className="mt-4 text-2xl font-bold text-slate-800">{post.title}</h1>
                        <p className="mt-2 text-sm text-slate-500">{post.user?.name || 'Tidak diketahui'} · {post.published_at ? new Date(post.published_at).toLocaleDateString('id-ID') : 'Belum diterbitkan'}</p>
                        
                        {metadataEntries.length > 0 && (
                            <dl className="mt-6 grid gap-3 rounded-lg bg-slate-50 p-4 sm:grid-cols-2">
                                {metadataEntries.map(([key, value]) => (
                                    <div key={key}>
                                        <dt className="text-xs font-semibold uppercase text-slate-500">{key}</dt>
                                        <dd className="mt-1 text-sm text-slate-800">{Array.isArray(value) ? `${value.length} baris tabel` : String(value)}</dd>
                                    </div>
                                ))}
                            </dl>
                        )}

                        <RichContent html={post.content} className="mt-6 text-slate-700" />

                        {blocks.map((block, index) =>
                            block.type === 'text' ? (
                                <RichContent key={index} html={block.content} className="mt-4 text-slate-700" />
                            ) : block.type === 'callout' ? (
                                <aside key={index} className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-900">
                                    <RichContent html={block.content} className="text-sm" />
                                </aside>
                            ) : block.type === 'blockquote' ? (
                                <blockquote key={index} className="mt-4 border-l-4 border-primary/40 pl-4 italic text-slate-600">
                                    <RichContent html={block.content} />
                                    {block.source && (
                                        <cite className="mt-2 block text-sm not-italic text-slate-500">— {block.source}</cite>
                                    )}
                                </blockquote>
                            ) : (
                                <div key={index} className="mt-4 rounded-lg border border-slate-200">
                                    <div className="border-b border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">{block.title || 'Tabel'}</div>
                                    {block.description && <p className="px-4 py-2 text-xs text-slate-500">{block.description}</p>}
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full text-left text-sm">
                                            <thead>
                                                <tr className="bg-slate-50 text-xs uppercase text-slate-500">
                                                    {(block.columns || []).map((column, columnIndex) => (
                                                        <th key={columnIndex} className="px-4 py-2">{column || `Kolom ${columnIndex + 1}`}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {(block.rows || []).map((row, rowIndex) => (
                                                    <tr key={rowIndex}>
                                                        {(block.columns || []).map((_, columnIndex) => (
                                                            <td key={columnIndex} className="px-4 py-2 text-slate-700">{row[columnIndex] || '-'}</td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )
                        )}
                    </Card>
                </div>

                <div className="space-y-6 lg:sticky lg:top-20">
                    <Card className="p-6">
                        <h2 className="text-base font-bold text-slate-800">Status Konten</h2>
                        <p className="mt-1 text-xs text-slate-500">Ubah langsung status konten tanpa perlu masuk form edit.</p>
                        <div className="mt-4">
                            <label htmlFor="change-post-status" className="block text-sm font-medium text-slate-700">Status</label>
                            <select
                                id="change-post-status"
                                value={post.status}
                                disabled={updating}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary disabled:opacity-50"
                            >
                                <option value="draft">Draf</option>
                                <option value="published">Terbit</option>
                            </select>
                            {updating && <p className="mt-2 text-xs text-slate-400">Memperbarui...</p>}
                        </div>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
