import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import ConfirmDeleteModal from '@/Components/ConfirmDeleteModal';
import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function CategoryIndex({ categories }) {
    const { flash = {} } = usePage().props;
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [processing, setProcessing] = useState(false);
    const confirmDelete = () => { setProcessing(true); router.delete(`/admin/categories/${deleteTarget.id}`, { onFinish: () => { setProcessing(false); setDeleteTarget(null); } }); };

    return (
        <AdminLayout title="Kelola Kategori">
            {flash.error && <div role="alert" className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">{flash.error}</div>}
            {flash.success && <div role="status" className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{flash.success}</div>}
            <div className="mb-6 flex justify-end"><Button href="/admin/categories/create">Tambah Kategori</Button></div>
            <Card className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                    <thead className="border-b border-slate-200 bg-slate-50 text-slate-600"><tr><th className="p-4">Nama</th><th className="p-4">Slug</th><th className="p-4">Beranda</th><th className="p-4">Jumlah Konten</th><th className="p-4 text-right">Aksi</th></tr></thead>
                    <tbody className="divide-y divide-slate-100">
                        {categories.map(category => (
                            <tr key={category.id} className="hover:bg-slate-50">
                                <td className="p-4 font-semibold text-slate-800">{category.name}</td>
                                <td className="p-4 text-slate-500">{category.slug}</td>
                                <td className="p-4"><span className={`inline-flex rounded px-2 py-1 text-xs font-semibold ${category.is_fixed_on_home ? 'bg-primary text-white' : category.show_on_home ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>{category.is_fixed_on_home ? 'Permanen' : category.show_on_home ? 'Tampil' : 'Tidak tampil'}</span></td>
                                <td className="p-4 text-slate-500">{category.posts_count}</td>
                                <td className="p-4 text-right space-x-3">
                                    <Link href={`/admin/categories/${category.id}`} className="inline-flex min-h-11 items-center text-slate-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Lihat</Link>
                                    <Link href={`/admin/categories/${category.id}/edit`} className="inline-flex min-h-11 items-center text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Edit</Link>
                                    {!category.is_fixed_on_home && <button type="button" onClick={() => setDeleteTarget(category)} className="min-h-11 text-red-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600">Hapus</button>}
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-slate-500">Belum ada kategori.</td></tr>}
                    </tbody>
                </table>
            </Card>
            <ConfirmDeleteModal show={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={confirmDelete} processing={processing} itemName={deleteTarget?.name} />
        </AdminLayout>
    );
}
