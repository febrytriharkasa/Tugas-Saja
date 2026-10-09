import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import ConfirmDeleteModal from '@/Components/ConfirmDeleteModal';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function GalleryIndex({ galleries }) {
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [processing, setProcessing] = useState(false);
    const confirmDelete = () => { setProcessing(true); router.delete(`/admin/galleries/${deleteTarget.id}`, { onFinish: () => { setProcessing(false); setDeleteTarget(null); } }); };
    return <AdminLayout title="Kelola Galeri"><div className="mb-6 flex justify-end"><Button href="/admin/galleries/create">Unggah Media</Button></div><div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{galleries.data.map(item => <Card key={item.id}><div className="aspect-video bg-slate-100">{item.media_type === 'video' ? <video src={item.file_path} className="h-full w-full object-cover" /> : <img src={item.file_path} alt={item.title} className="h-full w-full object-cover" />}</div><div className="p-4"><p className="truncate font-semibold text-slate-800">{item.title}</p><div className="mt-3 flex gap-3 text-sm"><Link href={`/admin/galleries/${item.id}`} className="text-slate-600 hover:underline">Lihat</Link><Link href={`/admin/galleries/${item.id}/edit`} className="text-primary hover:underline">Edit</Link><button onClick={() => setDeleteTarget(item)} className="text-red-600 hover:underline">Hapus</button></div></div></Card>)}{galleries.data.length === 0 && <p className="col-span-full py-12 text-center text-slate-500">Belum ada media galeri.</p>}</div><ConfirmDeleteModal show={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={confirmDelete} processing={processing} itemName={deleteTarget?.title} /></AdminLayout>;
}
