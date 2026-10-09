import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import ConfirmDeleteModal from '@/Components/ConfirmDeleteModal';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function CategoryIndex({ categories }) {
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [processing, setProcessing] = useState(false);
    const confirmDelete = () => { setProcessing(true); router.delete(`/admin/categories/${deleteTarget.id}`, { onFinish: () => { setProcessing(false); setDeleteTarget(null); } }); };
    return <AdminLayout title="Kelola Kategori"><div className="mb-6 flex justify-end"><Button href="/admin/categories/create">Tambah Kategori</Button></div><Card className="overflow-x-auto"><table className="w-full min-w-[640px] text-left text-sm"><thead className="border-b border-slate-200 bg-slate-50 text-slate-600"><tr><th className="p-4">Nama</th><th className="p-4">Slug</th><th className="p-4">Jumlah Konten</th><th className="p-4 text-right">Aksi</th></tr></thead><tbody className="divide-y divide-slate-100">{categories.map(category => <tr key={category.id} className="hover:bg-slate-50"><td className="p-4 font-semibold text-slate-800">{category.name}</td><td className="p-4 text-slate-500">{category.slug}</td><td className="p-4 text-slate-500">{category.posts_count}</td><td className="p-4 text-right space-x-3"><Link href={`/admin/categories/${category.id}`} className="text-slate-600 hover:underline">Lihat</Link><Link href={`/admin/categories/${category.id}/edit`} className="text-primary hover:underline">Edit</Link><button onClick={() => setDeleteTarget(category)} className="text-red-600 hover:underline">Hapus</button></td></tr>)}{categories.length === 0 && <tr><td colSpan="4" className="p-8 text-center text-slate-500">Belum ada kategori.</td></tr>}</tbody></table></Card><ConfirmDeleteModal show={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={confirmDelete} processing={processing} itemName={deleteTarget?.name} /></AdminLayout>;
}
