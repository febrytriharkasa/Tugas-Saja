import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import BlocksEditor from '@/Components/BlocksEditor';
import Icon from '@/Components/Icon';
import { blocksFromMetadata } from '@/lib/postBlocks';
import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function PageForm({ page }) {
    const isEdit = !!page;
    const [imagePreview, setImagePreview] = useState(page?.image || null);
    const [imagePreviewError, setImagePreviewError] = useState(false);
    const { data, setData, post, processing, errors, transform } = useForm({
        title: page?.title || '',
        content: page?.content || '',
        image: null,
        remove_image: false,
        is_published: page ? page.is_published : true,
        meta: { blocks: blocksFromMetadata(page?.metadata) },
    });

    useEffect(() => {
        return () => {
            if (imagePreview && !imagePreview.startsWith('/storage') && !imagePreview.startsWith('http')) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const handleImageChange = (e) => {
        const file = e.target.files[0] || null;
        setData('image', file);
        if (file) {
            setData('remove_image', false);
        }
        setImagePreviewError(false);
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        } else {
            setImagePreview(page?.image || null);
        }
    };

    const handleImageRemove = () => {
        setData('image', null);
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
        post(isEdit ? `/admin/pages/${page.id}` : '/admin/pages', {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Laman' : 'Tambah Laman'}>
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
                        <label className="block text-sm font-medium text-slate-700">Gambar (Opsional)</label>
                        {imagePreview && !imagePreviewError ? (
                            <div className="relative mt-2 mb-2 inline-block">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    onError={() => setImagePreviewError(true)}
                                    className="h-auto max-h-96 w-auto max-w-full rounded-lg border border-slate-200"
                                />
                                <button
                                    type="button"
                                    onClick={handleImageRemove}
                                    className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white shadow-sm transition hover:bg-red-700"
                                    aria-label="Hapus gambar"
                                >
                                    <Icon name="x" className="h-4 w-4" />
                                </button>
                            </div>
                        ) : isEdit && page?.image ? (
                            <div className="mt-2 mb-2 rounded-lg border border-dashed border-amber-300 bg-amber-50 p-3 text-xs text-amber-700">
                                Gambar tersimpan ({page.image}) tidak dapat dimuat.
                                Pastikan symlink <code>public/storage</code> aktif dan file masih ada.
                            </div>
                        ) : null}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="mt-1 block w-full rounded-lg border border-slate-300 text-sm file:mr-4 file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-slate-700"
                        />
                        {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                    </div>

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

                    <BlocksEditor
                        blocks={blocks}
                        onChange={setBlocks}
                        errors={errors}
                        types={['text', 'table']}
                    />

                            </div>
                        </Card>
                    </div>

                    <div className="space-y-6 lg:sticky lg:top-20">
                        <Card className="p-6">
                            <h2 className="text-base font-bold text-slate-800">Status Laman</h2>
                            <p className="mt-1 text-xs text-slate-500">Laman draf tidak tampil di menu publik.</p>
                            <div className="mt-4">
                                <label htmlFor="page-status" className="block text-sm font-medium text-slate-700">Status</label>
                                <select
                                    id="page-status"
                                    value={data.is_published ? 'published' : 'draft'}
                                    onChange={(e) => setData('is_published', e.target.value === 'published')}
                                    className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                                >
                                    <option value="draft">Draf</option>
                                    <option value="published">Terbit</option>
                                </select>
                            </div>
                        </Card>

                        <div className="flex flex-col gap-3">
                            <Button type="submit" disabled={processing} icon="save">
                                {processing ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                            <Button variant="outline" href="/admin/pages" icon="arrow-left">Batal</Button>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
