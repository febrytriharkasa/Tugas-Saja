import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import BlocksEditor from '@/Components/BlocksEditor';
import RichTextEditor from '@/Components/RichTextEditor';
import Icon from '@/Components/Icon';
import { blocksFromMetadata } from '@/lib/postBlocks';
import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function PageForm({ page, navDropdowns = [], navPlacement = {} }) {
    const isEdit = !!page;
    const [imagePreview, setImagePreview] = useState(page?.image || null);
    const [imagePreviewError, setImagePreviewError] = useState(false);

    const initialMenu = navPlacement.placement === 'top'
        ? 'top'
        : navPlacement.placement === 'dropdown'
            ? `dropdown:${navPlacement.parent_label || navDropdowns[0]?.label || ''}`
            : 'none';

    const [menu, setMenu] = useState(initialMenu);
    const [menuLabel, setMenuLabel] = useState(navPlacement.label || '');

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
        transform((d) => {
            const separator = menu.indexOf(':');
            const kind = separator === -1 ? menu : menu.slice(0, separator);
            const parentLabel = separator === -1 ? '' : menu.slice(separator + 1);
            return {
                ...d,
                nav_placement: kind,
                nav_parent_label: kind === 'dropdown' ? parentLabel : '',
                nav_label: menu === 'none' ? '' : menuLabel,
                ...(isEdit ? { _method: 'put' } : {}),
            };
        });
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

                    <RichTextEditor
                        label="Konten"
                        value={data.content}
                        onChange={(html) => setData('content', html)}
                        error={errors.content}
                        placeholder="Tulis isi laman di sini. Gunakan toolbar untuk menebalkan, memiringkan, membuat daftar, atau mengubah ukuran huruf."
                    />

                    <BlocksEditor
                        blocks={blocks}
                        onChange={setBlocks}
                        errors={errors}
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
                            {isEdit && !data.is_published && (
                                <a
                                    href={`/${page.slug}?preview=1`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                                >
                                    <Icon name="external-link" className="h-3.5 w-3.5" />
                                    Pratinjau draf
                                </a>
                            )}
                        </Card>

                        <Card className="p-6">
                            <h2 className="text-base font-bold text-slate-800">Menu Navigasi</h2>
                            <p className="mt-1 text-xs text-slate-500">Tempat laman ini muncul di navbar situs.</p>
                            <div className="mt-4 space-y-4">
                                <div>
                                    <label htmlFor="page-menu" className="block text-sm font-medium text-slate-700">Posisi</label>
                                    <select
                                        id="page-menu"
                                        value={menu}
                                        onChange={(e) => setMenu(e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                                    >
                                        <option value="none">Tidak tampil di navbar</option>
                                        <option value="top">Item utama</option>
                                        {navDropdowns.map((dropdown, index) => (
                                            <option key={`${dropdown.label}-${index}`} value={`dropdown:${dropdown.label}`}>
                                                Anak dropdown: {dropdown.label}
                                            </option>
                                        ))}
                                    </select>
                                    {navDropdowns.length === 0 && (
                                        <p className="mt-1 text-xs text-slate-500">
                                            Belum ada dropdown di navbar. Buat dulu di Pengaturan Menu Navigasi.
                                        </p>
                                    )}
                                    {errors.nav_parent_label && <p className="mt-1 text-xs text-red-500">{errors.nav_parent_label}</p>}
                                </div>

                                {menu !== 'none' && (
                                    <div>
                                        <label htmlFor="page-menu-label" className="block text-sm font-medium text-slate-700">Label menu</label>
                                        <input
                                            id="page-menu-label"
                                            type="text"
                                            value={menuLabel}
                                            onChange={(e) => setMenuLabel(e.target.value)}
                                            placeholder={data.title || 'Judul laman'}
                                            className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                                        />
                                        {errors.nav_label && <p className="mt-1 text-xs text-red-500">{errors.nav_label}</p>}
                                    </div>
                                )}

                                {menu !== 'none' && !data.is_published && (
                                    <p className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-700">
                                        Laman masih draf: tautannya ikut disimpan, tapi baru tampil di navbar setelah diterbitkan.
                                    </p>
                                )}
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
