import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import ConfirmDeleteModal from '@/Components/ConfirmDeleteModal';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function PageIndex({ pages }) {
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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold text-slate-800">Daftar Laman</h1>
                <Button href="/admin/pages/create">Tambah Laman</Button>
            </div>

            <Card className="overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-600">
                        <tr>
                            <th className="p-4">Judul</th>
                            <th className="p-4">Slug</th>
                            <th className="p-4">Grup</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {pages.map((p) => (
                            <tr key={p.id} className="hover:bg-slate-50">
                                <td className="p-4 font-medium text-slate-800">{p.title}</td>
                                <td className="p-4 text-slate-500">/laman/{p.slug}</td>
                                <td className="p-4 text-slate-500">
                                    {p.group === 'tentang' ? 'Tentang Kami' : p.group === 'arsip' ? 'Arsip Kustom' : 'Laman Kustom'}
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                                        p.is_published ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
                                    }`}>
                                        {p.is_published ? 'Terbit' : 'Draft'}
                                    </span>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    <Link href={`/admin/pages/${p.id}`} className="text-slate-600 hover:underline">
                                        Lihat
                                    </Link>
                                    <Link href={`/admin/pages/${p.id}/edit`} className="text-primary hover:underline">
                                        Edit
                                    </Link>
                                    <button onClick={() => setDeleteTarget(p)} className="text-red-600 hover:underline">
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
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
