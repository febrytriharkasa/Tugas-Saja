import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import { useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function CategoryIndex({ categories }) {
    const [editing, setEditing] = useState(null);
    const { data, setData, post, put, reset, processing, errors } = useForm({
        name: '',
        metadata_schema: [],
    });

    const addMetadata = () =>
        setData('metadata_schema', [...data.metadata_schema, { key: '', label: '', type: 'text' }]);

    const updateMetadataField = (index, field, value) => {
        const updated = data.metadata_schema.map((item, i) => {
            if (i !== index) return item;
            const newItem = { ...item, [field]: value };
            if (field === 'label' && !item.keyEdited) {
                newItem.key = value.toLowerCase().replace(/[^a-z0-9_]/g, '_');
            }
            if (field === 'key') {
                newItem.keyEdited = true;
            }
            return newItem;
        });
        setData('metadata_schema', updated);
    };
    const removeMetadata = (index) => setData(
        'metadata_schema',
        data.metadata_schema.filter((_, itemIndex) => itemIndex !== index),
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editing) {
            put(`/admin/categories/${editing.id}`, {
                onSuccess: () => {
                    setEditing(null);
                    reset();
                },
            });
        } else {
            post('/admin/categories', {
                onSuccess: () => reset(),
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus kategori ini?')) {
            router.delete(`/admin/categories/${id}`);
        }
    };

    return (
        <AdminLayout title="Kelola Kategori">
            <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6 h-fit">
                    <h2 className="text-base font-bold text-slate-800 mb-4">
                        {editing ? 'Edit Kategori' : 'Tambah Kategori'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Nama Kategori</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                                placeholder="Cth: Ekstrakurikuler"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Field Metadata Tambahan</label>
                            {data.metadata_schema.map((metaItem, metaIdx) => (
                                <div key={metaIdx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg mb-3 space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-semibold text-slate-600">Field #{metaIdx + 1}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeMetadata(metaIdx)}
                                            className="text-xs text-red-600 hover:underline"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-slate-500">Label Input</label>
                                        <input
                                            type="text"
                                            value={metaItem.label || ''}
                                            onChange={(e) => updateMetadataField(metaIdx, 'label', e.target.value)}
                                            className="mt-1 block w-full rounded border-slate-300 text-xs focus:border-primary focus:ring-primary"
                                            placeholder="cth: Tanggal Pelaksanaan / Lokasi"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-xs text-slate-500">Key Database</label>
                                            <input
                                                type="text"
                                                value={metaItem.key || ''}
                                                onChange={(e) => updateMetadataField(metaIdx, 'key', e.target.value)}
                                                className="mt-1 block w-full rounded border-slate-300 text-xs focus:border-primary focus:ring-primary font-mono"
                                                placeholder="cth: event_date"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-slate-500">Tipe Input</label>
                                            <select
                                                value={metaItem.type || 'text'}
                                                onChange={(e) => updateMetadataField(metaIdx, 'type', e.target.value)}
                                                className="mt-1 block w-full rounded border-slate-300 text-xs focus:border-primary focus:ring-primary"
                                            >
                                                <option value="text">Teks</option>
                                                <option value="date">Tanggal</option>
                                                <option value="number">Angka</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addMetadata}
                                className="text-sm font-semibold text-primary hover:underline"
                            >
                                + Tambah Field Metadata
                            </button>
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit" disabled={processing} className="w-full">
                                {editing ? 'Perbarui' : 'Simpan'}
                            </Button>
                            {editing && (
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setEditing(null);
                                        reset();
                                    }}
                                >
                                    Batal
                                </Button>
                            )}
                        </div>
                    </form>
                </Card>

                <div className="md:col-span-2">
                    <Card className="overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-600">
                                <tr>
                                    <th className="p-4">Nama</th>
                                    <th className="p-4">Slug</th>
                                    <th className="p-4">Jumlah Berita</th>
                                    <th className="p-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {categories.map((cat) => (
                                    <tr key={cat.id} className="hover:bg-slate-50">
                                        <td className="p-4 font-medium text-slate-800">{cat.name}</td>
                                        <td className="p-4 text-slate-500">{cat.slug}</td>
                                        <td className="p-4 text-slate-500">{cat.posts_count || 0}</td>
                                        <td className="p-4 text-right space-x-2">
                                            <button
                                onClick={() => {
                                    setEditing(cat);
                                    setData({
                                        name: cat.name,
                                        metadata_schema: Array.isArray(cat.metadata_schema)
                                            ? cat.metadata_schema
                                            : Array.isArray(cat.metadata)
                                              ? cat.metadata.map((m) =>
                                                    typeof m === 'string'
                                                        ? { key: m, label: m, type: 'text' }
                                                        : m
                                                )
                                              : [],
                                    });
                                }}
                                                className="text-primary hover:underline"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cat.id)}
                                                className="text-red-600 hover:underline"
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
