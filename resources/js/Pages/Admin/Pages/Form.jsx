import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import { useForm } from '@inertiajs/react';

export default function PageForm({ page, categories }) {
    const isEdit = !!page;
    const { data, setData, post, put, processing, errors } = useForm({
        title: page?.title || '',
        group: page?.group || 'tentang',
        display_type: page?.display_type || 'text',
        category_id: page?.category_id || '',
        content: page?.content || '',
        is_published: page ? page.is_published : true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(`/admin/pages/${page.id}`);
        } else {
            post('/admin/pages');
        }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Laman' : 'Tambah Laman'}>
            <Card className="p-6 max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Judul</label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                        />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Grup Menu</label>
                        <select
                            value={data.group}
                            onChange={(e) => setData('group', e.target.value)}
                            className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                        >
                            <option value="tentang">Tentang Kami</option>
                            <option value="laman">Laman Kustom</option>
                            <option value="arsip">Arsip Kustom</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Tipe Tampilan</label>
                        <select
                            value={data.display_type}
                            onChange={(e) => setData('display_type', e.target.value)}
                            className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                        >
                            <option value="text">Teks Statis</option>
                            <option value="category">Daftar Post Kategori</option>
                        </select>
                    </div>

                    {data.display_type === 'category' && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Kategori</label>
                            <select
                                value={data.category_id || ''}
                                onChange={(e) => setData('category_id', e.target.value)}
                                className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                            >
                                <option value="">-- Pilih Kategori --</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id}</p>}
                        </div>
                    )}

                    {data.display_type === 'text' && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Konten</label>
                            <textarea
                                rows={10}
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                            />
                            {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="is_published"
                            checked={data.is_published}
                            onChange={(e) => setData('is_published', e.target.checked)}
                            className="rounded border-slate-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor="is_published" className="text-sm text-slate-700">Terbitkan langsung</label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline" href="/admin/pages">Batal</Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </div>
                </form>
            </Card>
        </AdminLayout>
    );
}
