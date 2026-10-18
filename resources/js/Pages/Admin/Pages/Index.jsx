import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import ActionIcon from '@/Components/ActionIcon';
import Pagination from '@/Components/Pagination';
import ConfirmDeleteModal from '@/Components/ConfirmDeleteModal';
import SearchInput from '@/Components/SearchInput';
import { router } from '@inertiajs/react';
import { useState } from 'react';

export default function PageIndex({ pages, filters = {} }) {
    const pageItems = Array.isArray(pages) ? pages : (pages?.data || []);
    const pageLinks = Array.isArray(pages) ? null : pages?.links;
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [processing, setProcessing] = useState(false);

    const confirmDelete = () => {
        setProcessing(true);
        router.delete(`/admin/pages/${deleteTarget.id}`, {
            onFinish: () => {
                setProcessing(false);
                setDeleteTarget(null);
            },
        });
    };

    return (
        <AdminLayout title="Kelola Laman">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-lg font-bold text-slate-800">Halaman Statis</h1>
                    <p className="mt-1 text-sm text-slate-500">Kelola konten halaman statis sekolah</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <SearchInput href="/admin/pages" filters={filters} placeholder="Cari laman..." />
                    <select
                        defaultValue={filters?.status || ''}
                        onChange={(e) => router.get('/admin/pages', { ...filters, status: e.target.value || undefined }, { preserveState: true })}
                        aria-label="Filter status laman"
                        className="rounded-lg border-slate-300 py-2 pl-3 pr-10 text-sm focus:border-primary focus:ring-primary"
                    >
                        <option value="">Semua Status</option>
                        <option value="published">Terbit</option>
                        <option value="draft">Draf</option>
                    </select>
                    <Button href="/admin/pages/create" icon="plus">
                        Tambah Laman
                    </Button>
                </div>
            </div>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] border-collapse text-left">
                        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            <tr>
                                <th className="px-4 py-3">Judul</th>
                                <th className="px-4 py-3">Slug</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Navbar</th>
                                <th className="px-4 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {pageItems.map((p) => (
                                <tr key={p.id} className="transition hover:bg-slate-50">
                                    <td className="px-4 py-3 font-medium text-slate-800">{p.title}</td>
                                    <td className="px-4 py-3 font-mono text-xs text-slate-500">/{p.slug}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                            p.is_published ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                                        }`}>
                                            {p.is_published ? 'Terbit' : 'Draf'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                            p.in_nav ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                                        }`}>
                                            {p.in_nav ? 'Sudah' : 'Belum'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            <ActionIcon icon="eye" label="Lihat detail" href={`/admin/pages/${p.id}`} color="slate" />
                                            <ActionIcon icon="pencil" label="Edit laman" href={`/admin/pages/${p.id}/edit`} color="primary" />
                                            <ActionIcon icon="trash" label="Hapus laman" onClick={() => setDeleteTarget(p)} color="red" />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {pageItems.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-4 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            {filters?.search || filters?.status ? (
                                                <>
                                                    <p className="text-sm font-medium text-slate-500">
                                                        {filters.search ? `Tidak ada laman yang cocok dengan "${filters.search}"` : 'Tidak ada laman dengan status ini'}
                                                    </p>
                                                    <Button variant="ghost" size="sm" href="/admin/pages">
                                                        Hapus filter
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <p className="text-sm font-medium text-slate-500">Belum ada laman</p>
                                                    <p className="text-xs text-slate-400">Tambah laman statis seperti Visi Misi, Sejarah, dll.</p>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination links={pageLinks} />
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
