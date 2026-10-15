import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import LinkUrlPicker, { plainLabel } from '@/Components/LinkUrlPicker';
import { useForm } from '@inertiajs/react';

const MAX_LINKS = 4;

export default function TopbarSettings({ groupedSettings, linkOptions }) {
    const rawSettings = Object.values(groupedSettings).flat().reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {});

    let parsedLinks = [];
    try {
        parsedLinks = JSON.parse(rawSettings.topbar_links || '[]');
    } catch {
        parsedLinks = [];
    }

    const { data, setData, post, processing, recentlySuccessful } = useForm({
        topbar_links: Array.isArray(parsedLinks) ? parsedLinks : [],
    });

    const addLink = () => {
        if (data.topbar_links.length >= MAX_LINKS) return;
        setData('topbar_links', [...data.topbar_links, { label: '', url: '' }]);
    };

    const removeLink = (index) => {
        setData('topbar_links', data.topbar_links.filter((_, i) => i !== index));
    };

    const updateLink = (index, field, value) => {
        setData('topbar_links', data.topbar_links.map((link, i) =>
            i === index ? { ...link, [field]: value } : link
        ));
    };

    const selectUrl = (index, url) => {
        const option = linkOptions.find((o) => o.url === url);
        setData('topbar_links', data.topbar_links.map((link, i) =>
            i === index ? {
                ...link,
                url,
                label: plainLabel(option?.label) || link.label,
            } : link
        ));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/settings/topbar');
    };

    return (
        <AdminLayout title="Link Topbar">
            <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
                {recentlySuccessful && (
                    <div className="p-4 bg-emerald-50 text-emerald-700 rounded-lg text-sm">
                        Pengaturan berhasil disimpan.
                    </div>
                )}

                <Card className="p-6" overflow="visible">
                    <h2 className="text-base font-bold text-slate-800 mb-2">Link Topbar (Bar Atas Navbar)</h2>
                    <p className="text-xs text-slate-500 mb-4">
                        Atur hingga {MAX_LINKS} link di bar utilitas atas (misal PPDB, E-Learning). Gunakan pilihan halaman internal atau URL eksternal.
                    </p>

                    <div className="space-y-4">
                        {data.topbar_links.length === 0 && (
                            <div className="text-center py-6 text-sm text-slate-400 border border-dashed border-slate-200 rounded-lg">
                                Belum ada link topbar. Klik tombol "Tambah Link" di bawah.
                            </div>
                        )}

                        {data.topbar_links.map((link, index) => (
                            <div key={index} className="border border-slate-200 rounded-lg p-4 space-y-3 bg-slate-50">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-sm font-bold text-slate-700">Link {index + 1}</h3>
                                    <button
                                        type="button"
                                        onClick={() => removeLink(index)}
                                        className="text-xs text-red-600 font-semibold hover:text-red-700 transition"
                                    >
                                        Hapus
                                    </button>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-600">Label / Teks Link</label>
                                    <input
                                        type="text"
                                        value={link.label}
                                        onChange={(e) => updateLink(index, 'label', e.target.value)}
                                        placeholder="Misal: Daftar PPDB"
                                        className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">URL Tujuan</label>
                                    <LinkUrlPicker
                                        options={linkOptions}
                                        value={link.url || ''}
                                        onChange={(url) => selectUrl(index, url)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4">
                        <Button
                            type="button"
                            variant="outline"
                            icon="plus"
                            onClick={addLink}
                            disabled={data.topbar_links.length >= MAX_LINKS}
                        >
                            Tambah Link
                        </Button>
                        {data.topbar_links.length >= MAX_LINKS && (
                            <p className="mt-2 text-xs text-slate-500">Maksimal {MAX_LINKS} link.</p>
                        )}
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