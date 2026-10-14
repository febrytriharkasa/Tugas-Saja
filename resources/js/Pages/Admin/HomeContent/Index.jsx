import AdminLayout from '@/Layouts/AdminLayout';
import Button from '@/Components/Button';
import Card from '@/Components/Card';
import { Link, useForm, usePage } from '@inertiajs/react';

const fixedSections = [
    { name: 'Hero carousel', description: 'Banner utama beranda', href: '/admin/settings/hero', action: 'Atur hero' },
    { name: 'Layanan pintas', description: 'Tautan layanan sekolah', href: '/admin/settings/quick-links', action: 'Atur layanan' },
    { name: 'Berita', description: 'Berita sekolah terbaru', href: '/admin/posts', action: 'Kelola konten' },
    { name: 'Galeri aktivitas', description: 'Dokumentasi kegiatan sekolah', href: '/admin/galleries', action: 'Kelola galeri' },
    { name: 'Guru dan tenaga kependidikan', description: 'Profil guru dan tenaga kependidikan', href: '/admin/staff', action: 'Kelola data' },
];

export default function HomeContentIndex({ categories = [] }) {
    const { flash = {} } = usePage().props;
    const adjustableCategories = categories.filter((category) => !category.is_fixed_on_home);
    const { data, setData, put, processing, errors } = useForm({
        categories: adjustableCategories.map((category) => ({
            id: category.id,
            show_on_home: category.show_on_home,
        })),
    });

    const submit = (event) => {
        event.preventDefault();
        put('/admin/home-content', { preserveScroll: true });
    };

    const setCategoryVisibility = (id, showOnHome) => {
        setData('categories', data.categories.map((category) => (
            category.id === id ? { ...category, show_on_home: showOnHome } : category
        )));
    };

    return (
        <AdminLayout title="Konten Beranda">
            <div className="mx-auto max-w-5xl space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Atur konten beranda</h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                            Pilih kategori yang tampil di halaman depan. Pengaturan nama dan metadata kategori tetap tersedia di menu Kategori.
                        </p>
                    </div>
                    <Button href="/" variant="outline" target="_blank" rel="noreferrer" icon="external-link">Lihat beranda</Button>
                </div>

                {flash.success && (
                    <div role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                        {flash.success}
                    </div>
                )}

                <Card>
                    <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
                        <h2 className="font-bold text-slate-900">Bagian tetap</h2>
                        <p className="mt-1 text-sm text-slate-600">Bagian ini selalu tampil. Gunakan tautan berikut untuk mengelola isinya.</p>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {fixedSections.map((section) => (
                            <div key={section.name} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">{section.name}</p>
                                    <p className="mt-1 text-xs text-slate-600">{section.description}</p>
                                </div>
                                <Link href={section.href} className="inline-flex min-h-11 items-center text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                                    {section.action}
                                </Link>
                            </div>
                        ))}
                    </div>
                </Card>

                <form onSubmit={submit}>
                    <Card>
                        <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
                            <h2 className="font-bold text-slate-900">Kategori tambahan</h2>
                            <p className="mt-1 text-sm text-slate-600">Kategori terpilih tampil setelah Berita dan sebelum Galeri aktivitas.</p>
                        </div>

                        {errors.categories && (
                            <div role="alert" className="border-b border-red-200 bg-red-50 px-5 py-3 text-sm font-medium text-red-800 sm:px-6">
                                {errors.categories}
                            </div>
                        )}

                        <div className="divide-y divide-slate-100">
                            {adjustableCategories.map((category) => {
                                const formCategory = data.categories.find((item) => item.id === category.id);
                                const isVisible = formCategory?.show_on_home ?? false;

                                return (
                                    <label key={category.id} htmlFor={`home-category-${category.id}`} className="flex min-h-16 cursor-pointer items-center gap-4 px-5 py-4 hover:bg-slate-50 sm:px-6">
                                        <input
                                            id={`home-category-${category.id}`}
                                            type="checkbox"
                                            checked={isVisible}
                                            onChange={(event) => setCategoryVisibility(category.id, event.target.checked)}
                                            className="h-5 w-5 shrink-0 rounded border-slate-300 text-primary focus:ring-primary"
                                        />
                                        <span className="min-w-0 flex-1">
                                            <span className="block text-sm font-semibold text-slate-900">{category.name}</span>
                                            <span className="mt-1 block text-xs text-slate-600">{category.published_posts_count} konten terbit</span>
                                        </span>
                                        <span className={`text-xs font-semibold ${isVisible ? 'text-emerald-700' : 'text-slate-600'}`}>
                                            {isVisible ? 'Tampil' : 'Tidak tampil'}
                                        </span>
                                    </label>
                                );
                            })}

                            {adjustableCategories.length === 0 && (
                                <div className="px-5 py-8 text-center sm:px-6">
                                    <p className="text-sm text-slate-600">Belum ada kategori tambahan.</p>
                                    <Link href="/admin/categories/create" className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                                        Tambah kategori
                                    </Link>
                                </div>
                            )}
                        </div>

                        {adjustableCategories.length > 0 && (
                            <div className="flex justify-end border-t border-slate-200 px-5 py-4 sm:px-6">
                                <Button type="submit" disabled={processing} icon="save">
                                    {processing ? 'Menyimpan...' : 'Simpan tampilan beranda'}
                                </Button>
                            </div>
                        )}
                    </Card>
                </form>
            </div>
        </AdminLayout>
    );
}
