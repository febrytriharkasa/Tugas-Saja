import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import ActionIcon from '@/Components/ActionIcon';
import Pagination from '@/Components/Pagination';
import ConfirmDeleteModal from '@/Components/ConfirmDeleteModal';
import SearchInput from '@/Components/SearchInput';
import { router } from '@inertiajs/react';
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
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-3">
                    <SearchInput href="/admin/posts" filters={filters} placeholder="Cari judul konten..." />
                    <select
                        defaultValue={filters?.category_id || ''}
                        onChange={(e) => router.get('/admin/posts', { ...filters, category_id: e.target.value || undefined }, { preserveState: true })}
                        className="rounded-lg border-slate-300 py-2 pl-3 pr-10 text-sm focus:border-primary focus:ring-primary"
                    >
                        <option value="">Semua Kategori</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>
                <Button href="/admin/posts/create" icon="plus">
                    Tambah Konten
                </Button>
            </div>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px] border-collapse text-left">
                        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            <tr>
                                <th className="px-4 py-3">Judul</th>
                                <th className="px-4 py-3">Kategori</th>
                                <th className="px-4 py-3">Metadata</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Tanggal</th>
                                <th className="px-4 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {posts.data.map((post) => (
                                <tr key={post.id} className="transition hover:bg-slate-50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            {post.featured_image ? (
                                                <img 
                                                    src={post.featured_image} 
                                                    alt="" 
                                                    className="h-10 w-10 shrink-0 rounded-md border border-slate-200 object-cover" 
                                                />
                                            ) : (
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-400">
                                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                                    </svg>
                                                </div>
                                            )}
                                            <span className="font-medium text-slate-800">{post.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                                            {post.category?.name || '-'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-slate-500">
                                        {post.metadata && Object.keys(post.metadata).filter((k) => k !== 'achievement_table' && k !== 'blocks').length > 0 ? (
                                            <div className="max-w-xs space-y-0.5">
                                                {Object.entries(post.metadata).filter(([k]) => k !== 'achievement_table' && k !== 'blocks').map(([k, v]) => (
                                                    <div key={k} className="truncate">
                                                        <span className="font-semibold text-slate-600">{k}:</span> {Array.isArray(v) ? `${v.length} baris` : String(v)}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : post.metadata?.achievement_table?.length ? (
                                            <span>{post.metadata.achievement_table.length} baris tabel</span>
                                        ) : (
                                            <span className="text-slate-400">—</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                            post.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                        }`}>
                                            {post.status === 'published' ? 'Terbit' : 'Draf'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-slate-500">
                                        {post.published_at ? new Date(post.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            <ActionIcon icon="eye" label="Lihat detail" href={`/admin/posts/${post.id}`} color="slate" />
                                            <ActionIcon icon="pencil" label="Edit konten" href={`/admin/posts/${post.id}/edit`} color="primary" />
                                            <ActionIcon icon="trash" label="Hapus konten" onClick={() => setDeleteTarget(post)} color="red" />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {posts.data.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-4 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                                </svg>
                                            </div>
                                            {filters?.search || filters?.category_id ? (
                                                <>
                                                    <p className="text-sm font-medium text-slate-500">
                                                        {filters.search ? `Tidak ada konten yang cocok dengan "${filters.search}"` : 'Tidak ada konten di kategori ini'}
                                                    </p>
                                                    <Button variant="ghost" size="sm" href="/admin/posts">
                                                        Hapus filter
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <p className="text-sm font-medium text-slate-500">Belum ada konten</p>
                                                    <p className="text-xs text-slate-400">Mulai tambah konten baru untuk sekolah</p>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination links={posts.links} />
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
