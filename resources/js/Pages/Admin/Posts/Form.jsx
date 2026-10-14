import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import BlocksEditor from '@/Components/BlocksEditor';
import Icon from '@/Components/Icon';
import { blocksFromMetadata } from '@/lib/postBlocks';
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

export default function PostForm({ post, categories, initialCategoryId }) {
    const isEdit = !!post;
    const initialCategory = post?.category_id || initialCategoryId || categories[0]?.id || '';
    const [imagePreview, setImagePreview] = useState(post?.media_type !== 'video' ? post?.featured_image || null : null);
    const [imagePreviewError, setImagePreviewError] = useState(false);

    const { data, setData, post: submit, processing, errors, transform } = useForm({
        title: post?.title || '',
        category_id: initialCategory,
        content: post?.content || '',
        status: post?.status || 'draft',
        featured_image: null,
        remove_image: false,
        media_type: post?.media_type || 'image',
        video_url: post?.video_url || '',
        meta: buildInitialMeta(categories, initialCategory, post?.metadata),
    });

    function youtubeEmbedUrl(url) {
        if (!url) return null;
        const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
        return match ? `https://www.youtube.com/embed/${match[1]}` : null;
    }

    const embedPreview = data.media_type === 'video' && data.video_url ? youtubeEmbedUrl(data.video_url) : null;

    useEffect(() => {
        return () => {
            if (imagePreview && !imagePreview.startsWith('/storage') && !imagePreview.startsWith('http')) {
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
        if (file) {
            setData('remove_image', false);
        }
        setImagePreviewError(false);
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        } else {
            setImagePreview(post?.featured_image || null);
        }
    };

    const handleImageRemove = () => {
        setData('featured_image', null);
        setData('remove_image', true);
        setImagePreview(null);
    };

    const blocks = Array.isArray(data.meta.blocks) ? data.meta.blocks : [];

    const setBlocks = (next) => setData('meta', { ...data.meta, blocks: next });

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
            <form onSubmit={handleSubmit}>
                <div className="grid items-start gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <Card className="p-6">
                            <div className="space-y-4">
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
                        <label className="block text-sm font-medium text-slate-700">Tipe Media</label>
                        <select
                            value={data.media_type}
                            onChange={(e) => {
                                const nextType = e.target.value;
                                setData((prev) => ({
                                    ...prev,
                                    media_type: nextType,
                                    video_url: nextType === 'video' ? prev.video_url : '',
                                    featured_image: null,
                                }));
                                setImagePreviewError(false);
                                setImagePreview(nextType === 'image' && post?.media_type !== 'video' ? post?.featured_image || null : null);
                            }}
                            className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                        >
                            <option value="image">Gambar</option>
                            <option value="video">Video</option>
                        </select>
                        {errors.media_type && <p className="text-red-500 text-xs mt-1">{errors.media_type}</p>}
                    </div>

                    {data.media_type === 'video' ? (
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Link Video</label>
                            <input
                                type="url"
                                value={data.video_url}
                                onChange={(e) => setData('video_url', e.target.value)}
                                placeholder="https://www.youtube.com/watch?v=..."
                                className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                            />
                            <p className="mt-1 text-xs text-slate-500">Masukkan link video YouTube.</p>
                            {errors.video_url && <p className="text-red-500 text-xs mt-1">{errors.video_url}</p>}

                            {embedPreview && (
                                <div className="mt-2">
                                    <div className="aspect-video w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-900">
                                        <iframe src={embedPreview} allowFullScreen className="h-full w-full border-0" title="YouTube preview" />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Preview video YouTube.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Gambar</label>
                            {imagePreview && !imagePreviewError ? (
                                <div className="relative mt-2 mb-2 inline-block">
                                    <img src={imagePreview} alt="Preview" onError={() => setImagePreviewError(true)} className="h-auto max-h-96 w-auto max-w-full rounded-lg border border-slate-200" />
                                    <button
                                        type="button"
                                        onClick={handleImageRemove}
                                        className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white shadow-sm transition hover:bg-red-700"
                                        aria-label="Hapus gambar"
                                    >
                                        <Icon name="x" className="h-4 w-4" />
                                    </button>
                                </div>
                            ) : isEdit && post?.featured_image ? (
                                <div className="mt-2 mb-2 rounded-lg border border-dashed border-amber-300 bg-amber-50 p-3 text-xs text-amber-700">
                                    Gambar tersimpan ({post.featured_image}) tidak dapat dimuat.
                                    Pastikan symlink <code>public/storage</code> aktif dan file masih ada.
                                </div>
                            ) : null}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="mt-1 block w-full rounded-lg border border-slate-300 text-sm file:mr-4 file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-slate-700"
                            />
                            {errors.featured_image && <p className="text-red-500 text-xs mt-1">{errors.featured_image}</p>}
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

                    <BlocksEditor blocks={blocks} onChange={setBlocks} errors={errors} />
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-6 lg:sticky lg:top-20">
                        <Card className="p-6">
                            <h2 className="text-base font-bold text-slate-800">Status Konten</h2>
                            <p className="mt-1 text-xs text-slate-500">Konten draf tidak tampil di halaman publik.</p>
                            <div className="mt-4">
                                <label htmlFor="post-status" className="block text-sm font-medium text-slate-700">Status</label>
                                <select
                                    id="post-status"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                                >
                                    <option value="draft">Draf</option>
                                    <option value="published">Terbit</option>
                                </select>
                                {errors.status && <p className="mt-1 text-xs text-red-500">{errors.status}</p>}
                            </div>
                        </Card>

                        <div className="flex flex-col gap-3">
                            <Button type="submit" disabled={processing} icon="save">
                                {processing ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                            <Button variant="outline" href="/admin/posts" icon="arrow-left">Batal</Button>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
