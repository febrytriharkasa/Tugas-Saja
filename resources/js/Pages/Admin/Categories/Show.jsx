import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';

export default function CategoryShow({ category }) {
    return <AdminLayout title="Detail Kategori"><div className="mb-6 flex gap-3"><Button variant="outline" href="/admin/categories">Kembali</Button><Button href={`/admin/categories/${category.id}/edit`}>Edit Kategori</Button></div><Card className="max-w-2xl p-6"><h1 className="text-2xl font-bold text-slate-800">{category.name}</h1><dl className="mt-6 grid gap-4 sm:grid-cols-2"><div><dt className="text-xs font-semibold uppercase text-slate-500">Slug</dt><dd className="mt-1 text-slate-800">{category.slug}</dd></div><div><dt className="text-xs font-semibold uppercase text-slate-500">Jumlah konten</dt><dd className="mt-1 text-slate-800">{category.posts_count}</dd></div></dl><h2 className="mt-8 text-base font-bold text-slate-800">Field Metadata</h2>{category.metadata_schema?.length ? <div className="mt-3 divide-y rounded-lg border border-slate-200">{category.metadata_schema.map(field => <div key={field.key} className="flex justify-between gap-4 p-3 text-sm"><span className="font-semibold text-slate-800">{field.label}</span><span className="text-slate-500">{field.key} · {field.type}</span></div>)}</div> : <p className="mt-3 text-sm text-slate-500">Tidak ada field metadata.</p>}</Card></AdminLayout>;
}
