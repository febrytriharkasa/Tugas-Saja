import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import ConfirmDeleteModal from '@/Components/ConfirmDeleteModal';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

const typeLabels = { guru: 'Guru', tendik: 'Tendik', gtk: 'GTK' };

export default function StaffIndex({ staff }) {
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [processing, setProcessing] = useState(false);

    const confirmDelete = () => {
        setProcessing(true);
        router.delete(`/admin/staff/${deleteTarget.id}`, {
            onFinish: () => {
                setProcessing(false);
                setDeleteTarget(null);
            },
        });
    };

    return (
        <AdminLayout title="Guru & Tendik">
            <div className="mb-6 flex justify-end">
                <Button href="/admin/staff/create">Tambah Guru/Tendik</Button>
            </div>

            <Card className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                    <thead className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-600">
                        <tr>
                            <th className="p-4">Nama</th>
                            <th className="p-4">Jabatan</th>
                            <th className="p-4">Tipe</th>
                            <th className="p-4">Kontak</th>
                            <th className="p-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {staff.map((person) => (
                            <tr key={person.id} className="hover:bg-slate-50">
                                <td className="p-4 font-semibold text-slate-800">{person.name}</td>
                                <td className="p-4 text-slate-600">{person.role}</td>
                                <td className="p-4 text-slate-600">{typeLabels[person.type] || person.type}</td>
                                <td className="p-4 text-slate-500">{person.email || person.phone || '-'}</td>
                                <td className="p-4 text-right space-x-3">
                                    <Link href={`/admin/staff/${person.id}`} className="text-slate-600 hover:underline">Lihat</Link>
                                    <Link href={`/admin/staff/${person.id}/edit`} className="text-primary hover:underline">Edit</Link>
                                    <button onClick={() => setDeleteTarget(person)} className="text-red-600 hover:underline">Hapus</button>
                                </td>
                            </tr>
                        ))}
                        {staff.length === 0 && (
                            <tr><td colSpan="5" className="p-8 text-center text-slate-500">Belum ada data guru atau tendik.</td></tr>
                        )}
                    </tbody>
                </table>
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
