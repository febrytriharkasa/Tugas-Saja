import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import { useForm } from '@inertiajs/react';

export default function CategoryForm({ category }) {
    const isEdit = !!category;
    const { data, setData, post, put, processing, errors } = useForm({
        name: category?.name || '',
        metadata_schema: category?.metadata_schema || [],
    });
    
    const updateSchema = (index, field, value) => {
        const updatedSchema = data.metadata_schema.map((item, itemIndex) => {
            if (itemIndex === index) {
                const updated = { ...item, [field]: value };
                if (field === 'type') {
                    updated.key = value;
                }
                return updated;
            }
            return item;
        });
        setData('metadata_schema', updatedSchema);
    };
    
    const submit = (event) => { event.preventDefault(); (isEdit ? put : post)(isEdit ? `/admin/categories/${category.id}` : '/admin/categories'); };

    return (
        <AdminLayout title={isEdit ? 'Edit Kategori' : 'Tambah Kategori'}>
            <Card className="max-w-2xl p-6">
                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <label htmlFor="category-name" className="block text-sm font-semibold text-slate-700">Nama Kategori</label>
                        <input id="category-name" value={data.name} onChange={event => setData('name', event.target.value)} className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary" />
                        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                    </div>

                    <div>
                        <div className="flex items-center justify-between gap-4">
                            <label className="text-sm font-semibold text-slate-700">Field Metadata</label>
                            <button type="button" onClick={() => setData('metadata_schema', [...data.metadata_schema, { key: 'text', label: '', type: 'text' }])} className="min-h-11 text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Tambah Field</button>
                        </div>
                        <div className="mt-3 space-y-3">
                            {data.metadata_schema.map((field, index) => (
                                <div key={index} className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:grid-cols-[1fr_8rem_auto]">
                                    <input value={field.label} onChange={event => updateSchema(index, 'label', event.target.value)} placeholder="Label" aria-label={`Label metadata ${index + 1}`} className="rounded-lg border-slate-300 text-sm" />
                                    <select value={field.type} onChange={event => updateSchema(index, 'type', event.target.value)} aria-label={`Tipe metadata ${index + 1}`} className="rounded-lg border-slate-300 text-sm"><option value="text">Teks</option><option value="date">Tanggal</option><option value="number">Angka</option></select>
                                    <button type="button" onClick={() => setData('metadata_schema', data.metadata_schema.filter((_, itemIndex) => itemIndex !== index))} className="min-h-11 text-sm font-semibold text-red-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600">Hapus</button>
                                </div>
                            ))}
                        </div>
                        {errors.metadata_schema && <p className="mt-1 text-xs text-red-600">{errors.metadata_schema}</p>}
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button variant="outline" href="/admin/categories" icon="arrow-left">Batal</Button>
                        <Button type="submit" disabled={processing} icon="save">{processing ? 'Menyimpan...' : 'Simpan'}</Button>
                    </div>
                </form>
            </Card>
        </AdminLayout>
    );
}
