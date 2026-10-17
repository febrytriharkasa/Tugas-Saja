import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import ActionIcon from '@/Components/ActionIcon';
import Pagination from '@/Components/Pagination';
import ConfirmDeleteModal from '@/Components/ConfirmDeleteModal';
import SearchInput from '@/Components/SearchInput';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function CategoryIndex({ categories, filters = {} }) {
    const { flash = {} } = usePage().props;
    const categoryItems = Array.isArray(categories) ? categories : (categories?.data || []);
    const categoryLinks = Array.isArray(categories) ? null : categories?.links;
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [processing, setProcessing] = useState(false);
    
    const confirmDelete = () => {
        setProcessing(true);
        router.delete(`/admin/categories/${deleteTarget.id}`, {
            onFinish: () => {
                setProcessing(false);
                setDeleteTarget(null);
            },
        });
    };

    return (
        <AdminLayout title="Kelola Kategori">
            {flash.error && (
                <div role="alert" className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
                    {flash.error}
                </div>
            )}
            {flash.success && (
                <div role="status" className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                    {flash.success}
                </div>
            )}

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-lg font-bold text-slate-800">Kategori Konten</h1>
                    <p className="mt-1 text-sm text-slate-500">Kelola kategori berita, pengumuman, agenda, dan prestasi</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <SearchInput href="/admin/categories" filters={filters} placeholder="Cari kategori..." />
                    <select
                        defaultValue={filters?.show_on_home || ''}
                        onChange={(e) => router.get('/admin/categories', { ...filters, show_on_home: e.target.value || undefined }, { preserveState: true })}
                        aria-label="Filter tampil di beranda"
                        className="rounded-lg border-slate-300 py-2 pl-3 pr-10 text-sm focus:border-primary focus:ring-primary"
                    >
                        <option value="">Semua Tampilan</option>
                        <option value="shown">Tampil</option>
                        <option value="hidden">Tidak tampil</option>
                    </select>
                    <Button href="/admin/categories/create" icon="plus">
                        Tambah Kategori
                    </Button>
                </div>
            </div>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            <tr>
                                <th className="px-4 py-3">Nama</th>
                                <th className="px-4 py-3">Slug</th>
                                <th className="px-4 py-3">Tampil di Beranda</th>
                                <th className="px-4 py-3">Jumlah Konten</th>
                                <th className="px-4 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {categoryItems.map((category) => (
                                <tr key={category.id} className="transition hover:bg-slate-50">
                                    <td className="px-4 py-3 font-semibold text-slate-800">{category.name}</td>
                                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{category.slug}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                            category.is_fixed_on_home 
                                                ? 'bg-primary text-white' 
                                                : category.show_on_home 
                                                    ? 'bg-emerald-100 text-emerald-800' 
                                                    : 'bg-slate-100 text-slate-600'
                                        }`}>
                                            {category.is_fixed_on_home ? 'Permanen' : category.show_on_home ? 'Tampil' : 'Tidak tampil'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-slate-700">{category.posts_count}</span>
                                            <span className="text-slate-400">konten</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            <ActionIcon icon="eye" label="Lihat detail" href={`/admin/categories/${category.id}`} color="slate" />
                                            <ActionIcon icon="pencil" label="Edit kategori" href={`/admin/categories/${category.id}/edit`} color="primary" />
                                            {!category.is_fixed_on_home && (
                                                <ActionIcon icon="trash" label="Hapus kategori" onClick={() => setDeleteTarget(category)} color="red" />
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {categoryItems.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-4 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                </svg>
                                            </div>
                                            {filters?.search || filters?.show_on_home ? (
                                                <>
                                                    <p className="text-sm font-medium text-slate-500">
                                                        {filters.search ? `Tidak ada kategori yang cocok dengan "${filters.search}"` : 'Tidak ada kategori dengan tampilan ini'}
                                                    </p>
                                                    <Button variant="ghost" size="sm" href="/admin/categories">
                                                        Hapus filter
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <p className="text-sm font-medium text-slate-500">Belum ada kategori</p>
                                                    <p className="text-xs text-slate-400">Tambah kategori untuk mengorganisir konten</p>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination links={categoryLinks} />
            </Card>

            <ConfirmDeleteModal
                show={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
                processing={processing}
                itemName={deleteTarget?.name}
            />
        </AdminLayout>
    );
}
