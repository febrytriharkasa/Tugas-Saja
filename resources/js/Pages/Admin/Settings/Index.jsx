import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import { useForm } from '@inertiajs/react';

export default function SettingsIndex({ settings }) {
    const rawSettings = Object.values(settings).flat().reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {});

    const { data, setData, post, processing, recentlySuccessful } = useForm({
        ...rawSettings,
        hero_background_file: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/settings');
    };

    return (
        <AdminLayout title="Pengaturan Tampilan & Situs">
            <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
                {recentlySuccessful && (
                    <div className="p-4 bg-emerald-50 text-emerald-700 rounded-lg text-sm">
                        Pengaturan berhasil disimpan.
                    </div>
                )}

                <Card className="p-6">
                    <h2 className="text-base font-bold text-slate-800 mb-4">Pengaturan Hero Banner</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Judul Utama (Hero Title)</label>
                            <input
                                type="text"
                                value={data.hero_title || ''}
                                onChange={(e) => setData('hero_title', e.target.value)}
                                className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Sub-Judul (Hero Subtitle)</label>
                            <textarea
                                rows={3}
                                value={data.hero_subtitle || ''}
                                onChange={(e) => setData('hero_subtitle', e.target.value)}
                                className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Warna Background Hero (Hex)</label>
                            <div className="flex gap-3 items-center mt-1">
                                <input
                                    type="color"
                                    value={data.hero_background || '#065F46'}
                                    onChange={(e) => setData('hero_background', e.target.value)}
                                    className="h-9 w-12 rounded border border-slate-300 p-0.5 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={data.hero_background || '#065F46'}
                                    onChange={(e) => setData('hero_background', e.target.value)}
                                    className="block w-36 rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Gambar Latar Hero (Opsional)</label>
                            <input
                                type="file"
                                onChange={(e) => setData('hero_background_file', e.target.files[0])}
                                className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                            />
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <h2 className="text-base font-bold text-slate-800 mb-4">Informasi Kontak & Tautan</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Nomor Telepon</label>
                            <input
                                type="text"
                                value={data.contact_phone || ''}
                                onChange={(e) => setData('contact_phone', e.target.value)}
                                className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Email Sekolah</label>
                            <input
                                type="email"
                                value={data.contact_email || ''}
                                onChange={(e) => setData('contact_email', e.target.value)}
                                className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Alamat Lengkap</label>
                            <textarea
                                rows={2}
                                value={data.contact_address || ''}
                                onChange={(e) => setData('contact_address', e.target.value)}
                                className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Link Pendaftaran PPDB</label>
                            <input
                                type="text"
                                value={data.ppdb_link || ''}
                                onChange={(e) => setData('ppdb_link', e.target.value)}
                                className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                            />
                        </div>
                    </div>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Menyimpan...' : 'Simpan Semua Pengaturan'}
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
}
