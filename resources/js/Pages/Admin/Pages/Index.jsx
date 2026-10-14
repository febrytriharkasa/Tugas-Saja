import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import ActionIcon from '@/Components/ActionIcon';
import Pagination from '@/Components/Pagination';
import ConfirmDeleteModal from '@/Components/ConfirmDeleteModal';
import { router } from '@inertiajs/react';
import { useState } from 'react';

const groupLabels = {
    tentang: 'Tentang Kami',
    arsip: 'Arsip Kustom',
    laman: 'Laman Kustom',
};

export default function PageIndex({ pages }) {
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
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-bold text-slate-800">Halaman Statis</h1>
                    <p className="mt-1 text-sm text-slate-500">Kelola laman Tentang, Arsip, dan halaman kustom lainnya</p>
                </div>
                <Button href="/admin/pages/create" icon="plus">
                    Tambah Laman
                </Button>
            </div>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] border-collapse text-left">
                        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            <tr>
                                <th className="px-4 py-3">Judul</th>
                                <th className="px-4 py-3">Slug</th>
                                <th className="px-4 py-3">Grup</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {pageItems.map((p) => (
                                <tr key={p.id} className="transition hover:bg-slate-50">
                                    <td className="px-4 py-3 font-medium text-slate-800">{p.title}</td>
                                    <td className="px-4 py-3 font-mono text-xs text-slate-500">/laman/{p.slug}</td>
                                    <td className="px-4 py-3">
                                        <span className="inline-flex rounded-full bg-secondary/10 px-2.5 py-0.5 text-xs font-medium text-secondary">
                                            {groupLabels[p.group] || p.group}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                            p.is_published ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                                        }`}>
                                            {p.is_published ? 'Tayang' : 'Draf'}
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
                                            <p className="text-sm font-medium text-slate-500">Belum ada laman</p>
                                            <p className="text-xs text-slate-400">Tambah laman statis seperti Visi Misi, Sejarah, dll.</p>
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
