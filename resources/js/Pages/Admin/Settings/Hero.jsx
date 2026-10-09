import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import { useForm } from '@inertiajs/react';

export default function HeroSettings({ settings }) {
    const rawSettings = Object.values(settings).flat().reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {});

    const { data, setData, post, processing, recentlySuccessful } = useForm({
        hero_background: rawSettings.hero_background || '#065F46',
        hero_slide_1_tag: rawSettings.hero_slide_1_tag || '',
        hero_slide_1_title: rawSettings.hero_slide_1_title || '',
        hero_slide_1_subtitle: rawSettings.hero_slide_1_subtitle || '',
        hero_slide_1_btn_text: rawSettings.hero_slide_1_btn_text || '',
        hero_slide_1_btn_url: rawSettings.hero_slide_1_btn_url || '',
        hero_slide_1_file: null,
        hero_slide_2_tag: rawSettings.hero_slide_2_tag || '',
        hero_slide_2_title: rawSettings.hero_slide_2_title || '',
        hero_slide_2_subtitle: rawSettings.hero_slide_2_subtitle || '',
        hero_slide_2_btn_text: rawSettings.hero_slide_2_btn_text || '',
        hero_slide_2_btn_url: rawSettings.hero_slide_2_btn_url || '',
        hero_slide_2_file: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/settings/hero');
    };

    return (
        <AdminLayout title="Pengaturan Hero Carousel Banner">
            <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
                {recentlySuccessful && (
                    <div className="p-4 bg-emerald-50 text-emerald-700 rounded-lg text-sm">
                        Pengaturan berhasil disimpan.
                    </div>
                )}

                <Card className="p-6">
                    <h2 className="text-base font-bold text-slate-800 mb-4">Hero Carousel Banner</h2>
                    
                    <div className="space-y-6">
                        <div className="border border-slate-200 rounded-lg p-4 space-y-3 bg-slate-50">
                            <h3 className="text-sm font-bold text-slate-700">Slide 1 (Default / Utama)</h3>
                            <div>
                                <label className="block text-xs font-medium text-slate-600">Tag / Kategori Atas</label>
                                <input
                                    type="text"
                                    value={data.hero_slide_1_tag}
                                    onChange={(e) => setData('hero_slide_1_tag', e.target.value)}
                                    placeholder="Contoh: Portal resmi SMALISKA"
                                    className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-600">Judul Utama</label>
                                <input
                                    type="text"
                                    value={data.hero_slide_1_title}
                                    onChange={(e) => setData('hero_slide_1_title', e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-600">Sub-Judul / Deskripsi</label>
                                <textarea
                                    rows={2}
                                    value={data.hero_slide_1_subtitle}
                                    onChange={(e) => setData('hero_slide_1_subtitle', e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-600">Teks Tombol</label>
                                    <input
                                        type="text"
                                        value={data.hero_slide_1_btn_text}
                                        onChange={(e) => setData('hero_slide_1_btn_text', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-600">Link Tombol</label>
                                    <input
                                        type="text"
                                        value={data.hero_slide_1_btn_url}
                                        onChange={(e) => setData('hero_slide_1_btn_url', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-600">Ganti Gambar Latar Slide 1 (Opsional)</label>
                                <input
                                    type="file"
                                    onChange={(e) => setData('hero_slide_1_file', e.target.files[0])}
                                    className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                />
                            </div>
                        </div>

                        <div className="border border-slate-200 rounded-lg p-4 space-y-3 bg-slate-50">
                            <h3 className="text-sm font-bold text-slate-700">Slide 2 (Pendaftaran / Informasi Tambahan)</h3>
                            <div>
                                <label className="block text-xs font-medium text-slate-600">Tag / Kategori Atas</label>
                                <input
                                    type="text"
                                    value={data.hero_slide_2_tag}
                                    onChange={(e) => setData('hero_slide_2_tag', e.target.value)}
                                    placeholder="Contoh: PPDB Online 2025/2026"
                                    className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-600">Judul Utama</label>
                                <input
                                    type="text"
                                    value={data.hero_slide_2_title}
                                    onChange={(e) => setData('hero_slide_2_title', e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-600">Sub-Judul / Deskripsi</label>
                                <textarea
                                    rows={2}
                                    value={data.hero_slide_2_subtitle}
                                    onChange={(e) => setData('hero_slide_2_subtitle', e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-600">Teks Tombol</label>
                                    <input
                                        type="text"
                                        value={data.hero_slide_2_btn_text}
                                        onChange={(e) => setData('hero_slide_2_btn_text', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-600">Link Tombol</label>
                                    <input
                                        type="text"
                                        value={data.hero_slide_2_btn_url}
                                        onChange={(e) => setData('hero_slide_2_btn_url', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-600">Ganti Gambar Latar Slide 2 (Opsional)</label>
                                <input
                                    type="file"
                                    onChange={(e) => setData('hero_slide_2_file', e.target.files[0])}
                                    className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Warna Background Hero (Fallback jika gambar kosong)</label>
                            <div className="flex gap-3 items-center mt-1">
                                <input
                                    type="color"
                                    value={data.hero_background}
                                    onChange={(e) => setData('hero_background', e.target.value)}
                                    className="h-9 w-12 rounded border border-slate-300 p-0.5 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={data.hero_background}
                                    onChange={(e) => setData('hero_background', e.target.value)}
                                    className="block w-36 rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="flex gap-3">
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
}
