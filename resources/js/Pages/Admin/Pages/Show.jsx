import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import { Link } from '@inertiajs/react';

export default function PageShow({ page }) {
    return (
        <AdminLayout title="Detail Laman">
            <div className="mb-6 flex flex-wrap gap-3"><Button variant="outline" href="/admin/pages">Kembali</Button><Button href={`/admin/pages/${page.id}/edit`}>Edit Laman</Button></div>
            <Card className="max-w-3xl p-6">
                <div className="flex flex-wrap gap-3"><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{page.group === 'tentang' ? 'Tentang Kami' : page.group === 'arsip' ? 'Arsip Kustom' : 'Laman Kustom'}</span><span className={`rounded-full px-3 py-1 text-xs font-semibold ${page.is_published ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>{page.is_published ? 'Terbit' : 'Draft'}</span></div>
                <h1 className="mt-4 text-2xl font-bold text-slate-800">{page.title}</h1>
                <p className="mt-2 text-sm text-slate-500">/laman/{page.slug}</p>
                {page.display_type === 'category' ? <p className="mt-6 text-slate-700">Menampilkan post kategori: <span className="font-semibold">{page.category?.name || '-'}</span></p> : <div className="mt-6 whitespace-pre-wrap text-slate-700">{page.content}</div>}
                <Link href={`/admin/pages/${page.id}/edit`} className="mt-6 inline-block text-sm font-semibold text-primary hover:underline">Edit laman</Link>
            </Card>
        </AdminLayout>
    );
}
