import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import { useForm } from '@inertiajs/react';

function buildInitialMeta(categories, categoryId, existingMetadata) {
    const cat = categories.find((c) => String(c.id) === String(categoryId));
    const schema = Array.isArray(cat?.metadata_schema)
        ? cat.metadata_schema
        : Array.isArray(cat?.metadata)
          ? cat.metadata
          : [];
    const meta = {};
    schema.forEach((field) => {
        if (field.key) {
            meta[field.key] = existingMetadata?.[field.key] ?? '';
        }
    });
    return meta;
}

export default function PostForm({ post, categories }) {
    const isEdit = !!post;
    const initialCategory = post?.category_id || categories[0]?.id || '';

    const { data, setData, post: submitPost, put, processing, errors } = useForm({
        title: post?.title || '',
        category_id: initialCategory,
        content: post?.content || '',
        status: post?.status || 'draft',
        featured_image: null,
        meta: buildInitialMeta(categories, initialCategory, post?.metadata),
    });

    const activeCategory = categories.find((c) => String(c.id) === String(data.category_id));
    const rawSchema = Array.isArray(activeCategory?.metadata_schema)
        ? activeCategory.metadata_schema
        : Array.isArray(activeCategory?.metadata)
          ? activeCategory.metadata
          : [];
    const metaSchema = rawSchema.filter((f) => f.key && f.label);

    const handleCategoryChange = (newCategoryId) => {
        setData({
            ...data,
            category_id: newCategoryId,
            meta: buildInitialMeta(categories, newCategoryId, post?.metadata),
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(`/admin/posts/${post.id}`);
        } else {
            submitPost('/admin/posts');
        }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Konten' : 'Tambah Konten'}>
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
                        <label className="block text-sm font-medium text-slate-700">Kategori</label>
                        <select
                            value={data.category_id}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                        >
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                        {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id}</p>}
                    </div>

                    {metaSchema.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                            {metaSchema.map((field) => (
                                <div key={field.key}>
                                    <label className="block text-xs font-semibold text-slate-600">{field.label}</label>
                                    <input
                                        type={field.type || 'text'}
                                        value={data.meta[field.key] ?? ''}
                                        onChange={(e) =>
                                            setData('meta', { ...data.meta, [field.key]: e.target.value })
                                        }
                                        className="mt-1 block w-full rounded-lg border-slate-300 text-sm"
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Konten / Keterangan</label>
                        <textarea
                            rows={8}
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                            className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                        />
                        {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Gambar (Opsional)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData('featured_image', e.target.files[0] || null)}
                            className="mt-1 block w-full rounded-lg border border-slate-300 text-sm file:mr-4 file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-slate-700"
                        />
                        {post?.featured_image && (
                            <p className="text-xs text-slate-500 mt-1">Gambar lama tetap dipakai jika tidak memilih file baru.</p>
                        )}
                        {errors.featured_image && <p className="text-red-500 text-xs mt-1">{errors.featured_image}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Status</label>
                        <select
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                            className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Terbit (Published)</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline" href="/admin/posts">Batal</Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </div>
                </form>
            </Card>
        </AdminLayout>
    );
}
