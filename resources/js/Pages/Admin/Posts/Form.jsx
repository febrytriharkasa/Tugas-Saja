import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import { blocksFromMetadata, createTableBlock } from '@/lib/postBlocks';
import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

function buildInitialMeta(categories, categoryId, existingMetadata) {
    const cat = categories.find((c) => String(c.id) === String(categoryId));
    const schema = Array.isArray(cat?.metadata_schema)
        ? cat.metadata_schema
        : Array.isArray(cat?.metadata)
          ? cat.metadata
          : [];
    const meta = Object.fromEntries(
        Object.entries(existingMetadata || {}).filter(
            ([key]) => key !== 'blocks' && key !== 'tables' && key !== 'achievement_table',
        ),
    );
    schema.forEach((field) => {
        if (field.key) {
            meta[field.key] = existingMetadata?.[field.key] ?? '';
        }
    });

    const blocks = blocksFromMetadata(existingMetadata);
    if (blocks.length) {
        meta.blocks = blocks;
    }

    return meta;
}

function TextBlock({ block, onChange }) {
    return (
        <div>
            <label className="block text-xs font-semibold text-slate-600">Teks</label>
            <textarea
                rows={4}
                value={block.content || ''}
                onChange={(e) => onChange({ ...block, content: e.target.value })}
                placeholder="Tulis deskripsi atau keterangan di sini..."
                className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
            />
        </div>
    );
}

function TableBlock({ block, onChange }) {
    const columns = block.columns || [];
    const rows = block.rows || [];

    const updateColumn = (columnIndex, value) =>
        onChange({ ...block, columns: columns.map((column, index) => (index === columnIndex ? value : column)) });

    const addColumn = () =>
        onChange({
            ...block,
            columns: [...columns, `Kolom ${columns.length + 1}`],
            rows: rows.map((row) => [...row, '']),
        });

    const removeColumn = (columnIndex) =>
        onChange({
            ...block,
            columns: columns.filter((_, index) => index !== columnIndex),
            rows: rows.map((row) => row.filter((_, index) => index !== columnIndex)),
        });

    const updateCell = (rowIndex, columnIndex, value) =>
        onChange({
            ...block,
            rows: rows.map((row, index) =>
                index === rowIndex ? row.map((cell, cellIndex) => (cellIndex === columnIndex ? value : cell)) : row,
            ),
        });

    const addRow = () => onChange({ ...block, rows: [...rows, columns.map(() => '')] });

    const removeRow = (rowIndex) => onChange({ ...block, rows: rows.filter((_, index) => index !== rowIndex) });

    return (
        <div className="space-y-3">
            <div>
                <label className="block text-xs font-semibold text-slate-600">Judul Tabel (Opsional)</label>
                <input
                    type="text"
                    value={block.title || ''}
                    onChange={(e) => onChange({ ...block, title: e.target.value })}
                    placeholder="Contoh: Rundown Acara"
                    className="mt-1 block w-full rounded-lg border-slate-300 text-sm"
                />
            </div>
            <div>
                <label className="block text-xs font-semibold text-slate-600">Deskripsi Tabel (Opsional)</label>
                <textarea
                    rows={2}
                    value={block.description || ''}
                    onChange={(e) => onChange({ ...block, description: e.target.value })}
                    placeholder="Contoh: Susunan acara peringatan hari santri."
                    className="mt-1 block w-full rounded-lg border-slate-300 text-sm"
                />
            </div>

            <div className="space-y-2">
                <span className="block text-xs font-semibold text-slate-600">Kolom</span>
                <div className="space-y-2">
                    {columns.map((column, columnIndex) => (
                        <div key={columnIndex} className="flex items-center gap-2">
                            <input
                                type="text"
                                value={column}
                                onChange={(e) => updateColumn(columnIndex, e.target.value)}
                                aria-label={`Nama kolom ${columnIndex + 1}`}
                                className="min-w-0 flex-1 rounded-lg border-slate-300 text-sm"
                            />
                            <button
                                type="button"
                                disabled={columns.length <= 1}
                                onClick={() => removeColumn(columnIndex)}
                                className="min-h-11 shrink-0 px-2 text-sm font-semibold text-red-600 hover:underline disabled:cursor-not-allowed disabled:opacity-30"
                            >
                                Hapus
                            </button>
                        </div>
                    ))}
                </div>
                <button type="button" onClick={addColumn} className="text-sm font-semibold text-primary hover:underline">
                    + Tambah Kolom
                </button>
            </div>

            <div className="space-y-2">
                <span className="block text-xs font-semibold text-slate-600">Isi Tabel</span>
                {rows.map((row, rowIndex) => (
                    <div
                        key={rowIndex}
                        className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 sm:p-0 border sm:border-0 border-slate-200 rounded-lg sm:rounded-none"
                    >
                        <div className="flex flex-1 flex-col sm:flex-row sm:flex-wrap gap-2">
                            {columns.map((column, columnIndex) => (
                                <input
                                    key={columnIndex}
                                    type="text"
                                    value={row[columnIndex] ?? ''}
                                    onChange={(e) => updateCell(rowIndex, columnIndex, e.target.value)}
                                    placeholder={column || `Kolom ${columnIndex + 1}`}
                                    aria-label={`${column || `Kolom ${columnIndex + 1}`} baris ${rowIndex + 1}`}
                                    className="min-w-0 flex-1 sm:min-w-[10rem] rounded-lg border-slate-300 text-sm"
                                />
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => removeRow(rowIndex)}
                            className="min-h-11 shrink-0 px-2 text-sm font-semibold text-red-600 hover:underline"
                        >
                            Hapus
                        </button>
                    </div>
                ))}
                <button type="button" onClick={addRow} className="text-sm font-semibold text-primary hover:underline">
                    + Tambah Baris
                </button>
            </div>
        </div>
    );
}

function Block({ block, index, total, onChange, onRemove, onMoveUp, onMoveDown }) {
    return (
        <div className="rounded-lg border border-slate-200 bg-white p-3 space-y-3">
            <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase text-slate-500">
                    {block.type === 'text' ? `Teks ${index + 1}` : `Tabel ${index + 1}`}
                </span>
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        disabled={index === 0}
                        onClick={onMoveUp}
                        className="px-2 py-1 text-xs font-semibold text-slate-500 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Geser ke atas"
                    >
                        ▲
                    </button>
                    <button
                        type="button"
                        disabled={index === total - 1}
                        onClick={onMoveDown}
                        className="px-2 py-1 text-xs font-semibold text-slate-500 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Geser ke bawah"
                    >
                        ▼
                    </button>
                    <button
                        type="button"
                        onClick={onRemove}
                        className="px-2 py-1 text-sm font-semibold text-red-600 hover:underline"
                    >
                        Hapus
                    </button>
                </div>
            </div>

            {block.type === 'text' ? (
                <TextBlock block={block} onChange={onChange} />
            ) : (
                <TableBlock block={block} onChange={onChange} />
            )}
        </div>
    );
}

export default function PostForm({ post, categories }) {
    const isEdit = !!post;
    const initialCategory = post?.category_id || categories[0]?.id || '';
    const [imagePreview, setImagePreview] = useState(post?.featured_image || null);
    const [imagePreviewError, setImagePreviewError] = useState(false);

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

    const blocks = Array.isArray(data.meta.blocks) ? data.meta.blocks : [];

    const setBlocks = (next) => setData('meta', { ...data.meta, blocks: next });

    const addBlock = (type) => {
        const block = type === 'text' ? { type: 'text', content: '' } : createTableBlock();
        setBlocks([...blocks, block]);
    };

    const updateBlock = (index, next) => setBlocks(blocks.map((b, i) => (i === index ? next : b)));

    const removeBlock = (index) => setBlocks(blocks.filter((_, i) => i !== index));

    const moveBlock = (index, direction) => {
        const next = [...blocks];
        const target = index + direction;
        if (target < 0 || target >= next.length) {
            return;
        }
        [next[index], next[target]] = [next[target], next[index]];
        setBlocks(next);
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
                        <div className="flex items-center justify-between gap-2">
                            <div>
                                <label className="text-sm font-semibold text-slate-700">Blok Tambahan (Opsional)</label>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Tambah teks atau tabel sesuai kebutuhan. Urutan bisa diatur dengan tombol ▲▼.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => addBlock('text')}
                                    className="text-sm font-semibold text-primary hover:underline whitespace-nowrap"
                                >
                                    + Teks
                                </button>
                                <button
                                    type="button"
                                    onClick={() => addBlock('table')}
                                    className="text-sm font-semibold text-primary hover:underline whitespace-nowrap"
                                >
                                    + Tabel
                                </button>
                            </div>
                        </div>

                        {blocks.map((block, index) => (
                            <Block
                                key={index}
                                block={block}
                                index={index}
                                total={blocks.length}
                                onChange={(next) => updateBlock(index, next)}
                                onRemove={() => removeBlock(index)}
                                onMoveUp={() => moveBlock(index, -1)}
                                onMoveDown={() => moveBlock(index, 1)}
                            />
                        ))}

                        {Object.keys(errors).some((k) => k.startsWith('meta.blocks')) && (
                            <p className="text-red-500 text-xs">Lengkapi nama kolom dan isi setiap baris tabel.</p>
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
