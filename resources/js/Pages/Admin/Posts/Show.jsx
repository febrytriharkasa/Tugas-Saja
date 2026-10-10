import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import { Link } from '@inertiajs/react';

export default function PostShow({ post }) {
    return (
        <AdminLayout title="Detail Konten">
            <div className="mb-6 flex flex-wrap gap-3">
                <Button variant="outline" href="/admin/posts">Kembali</Button>
                <Button href={`/admin/posts/${post.id}/edit`}>Edit Konten</Button>
            </div>
            <Card className="max-w-3xl p-6">
                {post.featured_image && <img src={post.featured_image} alt={post.title} className="mb-6 max-h-96 w-full rounded-lg object-cover" />}
                <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{post.category?.name || 'Tanpa kategori'}</span>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${post.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>{post.status}</span>
                </div>
                <h1 className="mt-4 text-2xl font-bold text-slate-800">{post.title}</h1>
                <p className="mt-2 text-sm text-slate-500">{post.user?.name || 'Tidak diketahui'} · {post.published_at ? new Date(post.published_at).toLocaleDateString('id-ID') : 'Belum diterbitkan'}</p>
                {post.metadata && Object.keys(post.metadata).length > 0 && <dl className="mt-6 grid gap-3 rounded-lg bg-slate-50 p-4 sm:grid-cols-2">{Object.entries(post.metadata).map(([key, value]) => <div key={key}><dt className="text-xs font-semibold uppercase text-slate-500">{key}</dt><dd className="mt-1 text-sm text-slate-800">{Array.isArray(value) ? `${value.length} baris tabel` : String(value)}</dd></div>)}</dl>}
                <div className="mt-6 whitespace-pre-wrap text-slate-700">{post.content}</div>
                <Link href={`/admin/posts/${post.id}/edit`} className="mt-6 inline-block text-sm font-semibold text-primary hover:underline">Edit konten</Link>
            </Card>
        </AdminLayout>
    );
}
