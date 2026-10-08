import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import { useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function CategoryIndex({ categories }) {
    const [editing, setEditing] = useState(null);
    const { data, setData, post, put, reset, processing, errors } = useForm({
        name: '',
    });

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
                                                    setData('name', cat.name);
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
