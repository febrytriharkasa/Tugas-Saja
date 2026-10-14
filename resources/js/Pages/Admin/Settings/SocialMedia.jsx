import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import { useForm } from '@inertiajs/react';

export default function SocialMediaSettings({ settings }) {
    const rawSettings = Object.values(settings).flat().reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {});

    const { data, setData, post, processing, recentlySuccessful } = useForm({
        social_facebook: rawSettings.social_facebook || '',
        social_instagram: rawSettings.social_instagram || '',
        social_twitter: rawSettings.social_twitter || '',
        social_youtube: rawSettings.social_youtube || '',
        social_linkedin: rawSettings.social_linkedin || '',
        social_whatsapp: rawSettings.social_whatsapp || '',
        social_tiktok: rawSettings.social_tiktok || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/settings/social-media');
    };

    return (
        <AdminLayout title="Media Sosial">
            <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
                {recentlySuccessful && (
                    <div className="p-4 bg-emerald-50 text-emerald-700 rounded-lg text-sm">
                        Pengaturan berhasil disimpan.
                    </div>
                )}

                <Card className="p-6">
                    <h2 className="text-base font-bold text-slate-800 mb-4">Media Sosial</h2>
                    <p className="text-sm text-slate-600 mb-4">Masukkan URL lengkap untuk setiap media sosial. Kosongkan jika tidak digunakan.</p>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Facebook</label>
                            <input
                                type="text"
                                value={data.social_facebook}
                                onChange={(e) => setData('social_facebook', e.target.value)}
                                placeholder="https://facebook.com/..."
                                className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Instagram</label>
                            <input
                                type="text"
                                value={data.social_instagram}
                                onChange={(e) => setData('social_instagram', e.target.value)}
                                placeholder="https://instagram.com/..."
                                className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Twitter / X</label>
                            <input
                                type="text"
                                value={data.social_twitter}
                                onChange={(e) => setData('social_twitter', e.target.value)}
                                placeholder="https://twitter.com/... atau https://x.com/..."
                                className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">YouTube</label>
                            <input
                                type="text"
                                value={data.social_youtube}
                                onChange={(e) => setData('social_youtube', e.target.value)}
                                placeholder="https://youtube.com/..."
                                className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">LinkedIn</label>
                            <input
                                type="text"
                                value={data.social_linkedin}
                                onChange={(e) => setData('social_linkedin', e.target.value)}
                                placeholder="https://linkedin.com/..."
                                className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">WhatsApp</label>
                            <input
                                type="text"
                                value={data.social_whatsapp}
                                onChange={(e) => setData('social_whatsapp', e.target.value)}
                                placeholder="https://wa.me/..."
                                className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">TikTok</label>
                            <input
                                type="text"
                                value={data.social_tiktok}
                                onChange={(e) => setData('social_tiktok', e.target.value)}
                                placeholder="https://tiktok.com/..."
                                className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                            />
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
