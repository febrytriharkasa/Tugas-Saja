import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import { useForm } from '@inertiajs/react';

export default function QuickLinksSettings({ settings }) {
    const rawSettings = Object.values(settings).flat().reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {});

    const { data, setData, post, processing, recentlySuccessful } = useForm({
        quick_link_1_title: rawSettings.quick_link_1_title || '',
        quick_link_1_desc: rawSettings.quick_link_1_desc || '',
        quick_link_1_url: rawSettings.quick_link_1_url || '',
        quick_link_2_title: rawSettings.quick_link_2_title || '',
        quick_link_2_desc: rawSettings.quick_link_2_desc || '',
        quick_link_2_url: rawSettings.quick_link_2_url || '',
        quick_link_3_title: rawSettings.quick_link_3_title || '',
        quick_link_3_desc: rawSettings.quick_link_3_desc || '',
        quick_link_3_url: rawSettings.quick_link_3_url || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/settings/quick-links');
    };

    return (
        <AdminLayout title="Layanan Pintas Beranda">
            <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
                {recentlySuccessful && (
                    <div className="p-4 bg-emerald-50 text-emerald-700 rounded-lg text-sm">
                        Pengaturan berhasil disimpan.
                    </div>
                )}

                <Card className="p-6">
                    <h2 className="text-base font-bold text-slate-800 mb-4">Layanan Pintas Beranda (3 Card Tanpa Gambar)</h2>
                    <div className="space-y-6">
                        <div className="border border-slate-200 rounded-lg p-4 space-y-3 bg-slate-50">
                            <h3 className="text-sm font-bold text-slate-700">Card 1</h3>
                            <div>
                                <label className="block text-xs font-medium text-slate-600">Judul</label>
                                <input
                                    type="text"
                                    value={data.quick_link_1_title}
                                    onChange={(e) => setData('quick_link_1_title', e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-600">Deskripsi Singkat</label>
                                <input
                                    type="text"
                                    value={data.quick_link_1_desc}
                                    onChange={(e) => setData('quick_link_1_desc', e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-600">URL / Link Tujuan</label>
                                <input
                                    type="text"
                                    value={data.quick_link_1_url}
                                    onChange={(e) => setData('quick_link_1_url', e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                                />
                            </div>
                        </div>

                        <div className="border border-slate-200 rounded-lg p-4 space-y-3 bg-slate-50">
                            <h3 className="text-sm font-bold text-slate-700">Card 2</h3>
                            <div>
                                <label className="block text-xs font-medium text-slate-600">Judul</label>
                                <input
                                    type="text"
                                    value={data.quick_link_2_title}
                                    onChange={(e) => setData('quick_link_2_title', e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-600">Deskripsi Singkat</label>
                                <input
                                    type="text"
                                    value={data.quick_link_2_desc}
                                    onChange={(e) => setData('quick_link_2_desc', e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-600">URL / Link Tujuan</label>
                                <input
                                    type="text"
                                    value={data.quick_link_2_url}
                                    onChange={(e) => setData('quick_link_2_url', e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                                />
                            </div>
                        </div>

                        <div className="border border-slate-200 rounded-lg p-4 space-y-3 bg-slate-50">
                            <h3 className="text-sm font-bold text-slate-700">Card 3</h3>
                            <div>
                                <label className="block text-xs font-medium text-slate-600">Judul</label>
                                <input
                                    type="text"
                                    value={data.quick_link_3_title}
                                    onChange={(e) => setData('quick_link_3_title', e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-600">Deskripsi Singkat</label>
                                <input
                                    type="text"
                                    value={data.quick_link_3_desc}
                                    onChange={(e) => setData('quick_link_3_desc', e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-600">URL / Link Tujuan</label>
                                <input
                                    type="text"
                                    value={data.quick_link_3_url}
                                    onChange={(e) => setData('quick_link_3_url', e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="flex gap-3">
                    <Button type="submit" disabled={processing} icon="save">
                        {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
}
