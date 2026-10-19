import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function CategoryForm({ category, navDropdowns = [], navPlacement = {} }) {
    const isEdit = !!category;

    const initialMenu = navPlacement.placement === 'top'
        ? 'top'
        : navPlacement.placement === 'dropdown'
            ? `dropdown:${navPlacement.parent_label || navDropdowns[0]?.label || ''}`
            : 'none';

    const [menu, setMenu] = useState(initialMenu);
    const [menuLabel, setMenuLabel] = useState(navPlacement.label || '');

    const { data, setData, post, put, processing, errors, transform } = useForm({
        name: category?.name || '',
        preview_mode: category?.preview_mode || 'standard',
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

    const submit = (event) => {
        event.preventDefault();
        transform((form) => {
            const separator = menu.indexOf(':');
            const kind = separator === -1 ? menu : menu.slice(0, separator);
            const parentLabel = separator === -1 ? '' : menu.slice(separator + 1);
            return {
                ...form,
                nav_placement: kind,
                nav_parent_label: kind === 'dropdown' ? parentLabel : '',
                nav_label: menu === 'none' ? '' : menuLabel,
            };
        });
        (isEdit ? put : post)(isEdit ? `/admin/categories/${category.id}` : '/admin/categories');
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Kategori' : 'Tambah Kategori'}>
            <form onSubmit={submit} className="max-w-2xl space-y-6">
                <Card className="p-6">
                    <div className="space-y-5">
                        <div>
                            <label htmlFor="category-name" className="block text-sm font-semibold text-slate-700">Nama Kategori</label>
                            <input id="category-name" value={data.name} onChange={event => setData('name', event.target.value)} className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary" />
                            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                        </div>

                        <div>
                            <label htmlFor="category-preview-mode" className="block text-sm font-semibold text-slate-700">Mode Pratinjau Halaman</label>
                            <select
                                id="category-preview-mode"
                                value={data.preview_mode}
                                onChange={(event) => setData('preview_mode', event.target.value)}
                                className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                            >
                                <option value="standard">Standar (daftar artikel)</option>
                                <option value="media">Galeri media (pratinjau gambar &amp; video)</option>
                            </select>
                            <p className="mt-1 text-xs text-slate-500">
                                Pilih &quot;Galeri media&quot; untuk kategori seperti dokumentasi video atau YouTube sekolah agar publik bisa melihat lightbox gambar/video langsung.
                            </p>
                            {errors.preview_mode && <p className="mt-1 text-xs text-red-600">{errors.preview_mode}</p>}
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
                    </div>
                </Card>

                <Card className="p-6">
                    <h2 className="text-base font-bold text-slate-800">Menu Navigasi</h2>
                    <p className="mt-1 text-xs text-slate-500">Tempat tautan kategori ini muncul di navbar situs.</p>
                    <div className="mt-4 space-y-4">
                        <div>
                            <label htmlFor="category-menu" className="block text-sm font-medium text-slate-700">Posisi</label>
                            <select
                                id="category-menu"
                                value={menu}
                                onChange={(event) => setMenu(event.target.value)}
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
                            {errors.nav_parent_label && <p className="mt-1 text-xs text-red-600">{errors.nav_parent_label}</p>}
                        </div>

                        {menu !== 'none' && (
                            <div>
                                <label htmlFor="category-menu-label" className="block text-sm font-medium text-slate-700">Label menu</label>
                                <input
                                    id="category-menu-label"
                                    type="text"
                                    value={menuLabel}
                                    onChange={(event) => setMenuLabel(event.target.value)}
                                    placeholder={data.name || 'Nama kategori'}
                                    className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                                />
                                {errors.nav_label && <p className="mt-1 text-xs text-red-600">{errors.nav_label}</p>}
                            </div>
                        )}
                    </div>
                </Card>

                <div className="flex justify-end gap-3">
                    <Button variant="outline" href="/admin/categories" icon="arrow-left">Batal</Button>
                    <Button type="submit" disabled={processing} icon="save">{processing ? 'Menyimpan...' : 'Simpan'}</Button>
                </div>
            </form>
        </AdminLayout>
    );
}
