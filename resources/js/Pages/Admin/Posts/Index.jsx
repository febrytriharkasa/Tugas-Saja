import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import ConfirmDeleteModal from '@/Components/ConfirmDeleteModal';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function PostIndex({ posts, categories, filters }) {
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [processing, setProcessing] = useState(false);

    const confirmDelete = () => {
        setProcessing(true);
        router.delete(`/admin/posts/${deleteTarget.id}`, {
            onFinish: () => {
                setProcessing(false);
                setDeleteTarget(null);
            },
        });
    };

    return (
        <AdminLayout title="Kelola Konten (Berita, Pengumuman, Agenda, Prestasi)">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Cari judul..."
                        defaultValue={filters?.search || ''}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                router.get('/admin/posts', { ...filters, search: e.target.value }, { preserveState: true });
                            }
                        }}
                        className="rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                    />
                    <select
                        defaultValue={filters?.category_id || ''}
                        onChange={(e) => router.get('/admin/posts', { ...filters, category_id: e.target.value || undefined }, { preserveState: true })}
                        className="rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                    >
                        <option value="">Semua Kategori</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>
                <Button href="/admin/posts/create">Tambah Konten</Button>
            </div>

            <Card className="overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-600">
                        <tr>
                            <th className="p-4">Judul</th>
                            <th className="p-4">Kategori</th>
                            <th className="p-4">Metadata</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Tanggal</th>
                            <th className="p-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {posts.data.map((post) => (
                            <tr key={post.id} className="hover:bg-slate-50">
                                <td className="p-4 font-medium text-slate-800">{post.title}</td>
                                <td className="p-4 text-slate-500">
                                    <span className="px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-700">
                                        {post.category?.name || '-'}
                                    </span>
                                </td>
                                <td className="p-4 text-xs text-slate-500 max-w-xs truncate">
                                    {post.metadata && Object.keys(post.metadata).length > 0 ? (
                                        <div className="space-y-0.5">
                                            {Object.entries(post.metadata).map(([k, v]) => (
                                                <div key={k}>
                                                    <span className="font-semibold text-slate-600">{k}:</span> {v}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        '-'
                                    )}
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                                        post.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
                                    }`}>
                                        {post.status}
                                    </span>
                                </td>
                                <td className="p-4 text-slate-500">
                                    {post.published_at ? new Date(post.published_at).toLocaleDateString('id-ID') : '-'}
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    <Link href={`/admin/posts/${post.id}`} className="text-slate-600 hover:underline">
                                        Lihat
                                    </Link>
                                    <Link href={`/admin/posts/${post.id}/edit`} className="text-primary hover:underline">
                                        Edit
                                    </Link>
                                    <button onClick={() => setDeleteTarget(post)} className="text-red-600 hover:underline">
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {posts.data.length === 0 && (
                            <tr>
                                <td colSpan="6" className="p-4 text-center text-slate-400">Belum ada konten.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </Card>

            <ConfirmDeleteModal
                show={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
                processing={processing}
                itemName={deleteTarget?.title}
            />
        </AdminLayout>
    );
}
