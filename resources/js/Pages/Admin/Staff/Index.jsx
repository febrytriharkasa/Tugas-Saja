import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import ActionIcon from '@/Components/ActionIcon';
import Pagination from '@/Components/Pagination';
import ConfirmDeleteModal from '@/Components/ConfirmDeleteModal';
import { router } from '@inertiajs/react';
import { useState } from 'react';

const typeLabels = { guru: 'Guru', tendik: 'Tendik', gtk: 'GTK' };

export default function StaffIndex({ staff }) {
    const staffItems = Array.isArray(staff) ? staff : (staff?.data || []);
    const staffLinks = Array.isArray(staff) ? null : staff?.links;
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
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-bold text-slate-800">Data Guru & Tenaga Kependidikan</h1>
                    <p className="mt-1 text-sm text-slate-500">Kelola profil pengajar dan tenaga kependidikan sekolah</p>
                </div>
                <Button href="/admin/staff/create" icon="plus">
                    Tambah Guru/Tendik
                </Button>
            </div>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            <tr>
                                <th className="px-4 py-3">Nama</th>
                                <th className="px-4 py-3">Jabatan</th>
                                <th className="px-4 py-3">Tipe</th>
                                <th className="px-4 py-3">Kontak</th>
                                <th className="px-4 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {staffItems.map((person) => (
                                <tr key={person.id} className="transition hover:bg-slate-50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            {person.photo ? (
                                                <img src={person.photo} alt={person.name} className="h-9 w-9 shrink-0 rounded-full border border-slate-200 object-cover" />
                                            ) : (
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                                                    {person.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                                </div>
                                            )}
                                            <span className="font-semibold text-slate-800">{person.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">{person.role}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                            person.type === 'guru' ? 'bg-tertiary/10 text-tertiary' : 'bg-secondary/10 text-secondary'
                                        }`}>
                                            {typeLabels[person.type] || person.type}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-slate-500">{person.email || person.phone || '—'}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            <ActionIcon icon="eye" label="Lihat detail" href={`/admin/staff/${person.id}`} color="slate" />
                                            <ActionIcon icon="pencil" label="Edit data" href={`/admin/staff/${person.id}/edit`} color="primary" />
                                            <ActionIcon icon="trash" label="Hapus data" onClick={() => setDeleteTarget(person)} color="red" />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {staffItems.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-4 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                            </div>
                                            <p className="text-sm font-medium text-slate-500">Belum ada data guru atau tendik</p>
                                            <p className="text-xs text-slate-400">Tambah profil pengajar dan staf sekolah</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination links={staffLinks} />
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
