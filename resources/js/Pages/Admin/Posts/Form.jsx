import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

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
    if (existingMetadata?.achievement_table) {
        meta.achievement_table = existingMetadata.achievement_table;
    }
    return meta;
}

const emptyRow = { name: '', rank: '', event: '' };

export default function PostForm({ post, categories }) {
    const isEdit = !!post;
    const initialCategory = post?.category_id || categories[0]?.id || '';
    const [imagePreview, setImagePreview] = useState(post?.featured_image || null);
    const [imagePreviewError, setImagePreviewError] = useState(false);
    const [showTable, setShowTable] = useState(
        Array.isArray(post?.metadata?.achievement_table) && post.metadata.achievement_table.length > 0,
    );

    const { data, setData, post: submit, processing, errors, transform } = useForm({
        title: post?.title || '',
        category_id: initialCategory,
        content: post?.content || '',
        status: post?.status || 'draft',
        featured_image: null,
        meta: buildInitialMeta(categories, initialCategory, post?.metadata),
    });

    useEffect(() => {
        return () => {
            if (imagePreview && !imagePreview.startsWith('/storage')) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const activeCategory = categories.find((c) => String(c.id) === String(data.category_id));
    const rawSchema = Array.isArray(activeCategory?.metadata_schema)
        ? activeCategory.metadata_schema
        : Array.isArray(activeCategory?.metadata)
          ? activeCategory.metadata
          : [];
    const metaSchema = rawSchema.filter((f) => f.key && f.label);

    const handleCategoryChange = (newCategoryId) => {
        setData((prev) => ({
            ...prev,
            category_id: newCategoryId,
            meta: buildInitialMeta(categories, newCategoryId, post?.metadata),
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0] || null;
        setData('featured_image', file);
        setImagePreviewError(false);
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        } else {
            setImagePreview(post?.featured_image || null);
        }
    };

    const tableRows = Array.isArray(data.meta.achievement_table) ? data.meta.achievement_table : [];

    const setTableRows = (rows) => {
        setData('meta', { ...data.meta, achievement_table: rows });
    };

    const addRow = () => setTableRows([...tableRows, { ...emptyRow }]);

    const updateRow = (index, field, value) => {
        const updated = tableRows.map((row, i) => (i === index ? { ...row, [field]: value } : row));
        setTableRows(updated);
    };

    const removeRow = (index) => setTableRows(tableRows.filter((_, i) => i !== index));

    const toggleTable = () => {
        if (showTable) {
            const { achievement_table, ...rest } = data.meta;
            setData('meta', rest);
        } else {
            setData('meta', { ...data.meta, achievement_table: tableRows.length ? tableRows : [{ ...emptyRow }] });
        }
        setShowTable(!showTable);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        transform((d) => ({
            ...d,
            ...(isEdit ? { _method: 'put' } : {}),
        }));
        submit(isEdit ? `/admin/posts/${post.id}` : '/admin/posts', {
            forceFormData: true,
        });
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

                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-semibold text-slate-700">Tabel Data (Opsional)</label>
                            <button
                                type="button"
                                onClick={toggleTable}
                                className={`text-sm font-semibold ${showTable ? 'text-red-600 hover:underline' : 'text-primary hover:underline'}`}
                            >
                                {showTable ? 'Hapus Tabel' : 'Tambah Tabel'}
                            </button>
                        </div>
                        <p className="text-xs text-slate-500">
                            Gunakan tabel ini untuk daftar pemenang, peserta, atau data terstruktur lainnya.
                        </p>

                        {showTable && (
                            <div className="space-y-2">
                                <div className="hidden sm:grid grid-cols-[1fr_6rem_1fr_auto] gap-2 text-xs font-semibold text-slate-500 px-1">
                                    <span>Nama</span>
                                    <span>Peringkat</span>
                                    <span>Keterangan</span>
                                    <span></span>
                                </div>
                                {tableRows.map((row, idx) => (
                                    <div key={idx} className="flex flex-col sm:grid sm:grid-cols-[1fr_6rem_1fr_auto] gap-2 p-3 sm:p-0 border sm:border-0 border-slate-200 rounded-lg sm:rounded-none">
                                        <input
                                            type="text"
                                            value={row.name}
                                            onChange={(e) => updateRow(idx, 'name', e.target.value)}
                                            placeholder="Nama peserta / kelas"
                                            className="rounded-lg border-slate-300 text-sm"
                                        />
                                        <input
                                            type="text"
                                            value={row.rank}
                                            onChange={(e) => updateRow(idx, 'rank', e.target.value)}
                                            placeholder="Juara"
                                            className="rounded-lg border-slate-300 text-sm"
                                        />
                                        <input
                                            type="text"
                                            value={row.event}
                                            onChange={(e) => updateRow(idx, 'event', e.target.value)}
                                            placeholder="Lomba / keterangan"
                                            className="rounded-lg border-slate-300 text-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeRow(idx)}
                                            className="min-h-11 px-2 text-sm font-semibold text-red-600 hover:underline"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                ))}
                                {Object.keys(errors).filter((k) => k.startsWith('meta.achievement_table')).length > 0 && (
                                    <p className="text-red-500 text-xs">Lengkapi kolom Nama dan Peringkat pada setiap baris.</p>
                                )}
                                <button
                                    type="button"
                                    onClick={addRow}
                                    className="text-sm font-semibold text-primary hover:underline"
                                >
                                    + Tambah Baris
                                </button>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Gambar (Opsional)</label>
                        {imagePreview && !imagePreviewError ? (
                            <div className="mt-2 mb-2">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    onError={() => setImagePreviewError(true)}
                                    className="h-auto max-h-96 w-auto max-w-full rounded-lg border border-slate-200"
                                />
                                <p className="text-xs text-slate-500 mt-1">
                                    {data.featured_image ? 'Preview gambar baru.' : 'Gambar saat ini. Pilih file baru untuk mengganti.'}
                                </p>
                            </div>
                        ) : isEdit && post?.featured_image ? (
                            <div className="mt-2 mb-2 rounded-lg border border-dashed border-amber-300 bg-amber-50 p-3 text-xs text-amber-700">
                                Gambar tersimpan ({post.featured_image}) tidak dapat dimuat.
                                Pastikan symlink <code>public/storage</code> aktif dan file masih ada.
                            </div>
                        ) : isEdit ? (
                            <p className="mt-2 mb-2 text-xs text-slate-500">Belum ada gambar tersimpan untuk konten ini.</p>
                        ) : null}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="mt-1 block w-full rounded-lg border border-slate-300 text-sm file:mr-4 file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-slate-700"
                        />
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
