import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import LinkUrlPicker, { plainLabel } from '@/Components/LinkUrlPicker';
import Icon from '@/Components/Icon';
import { useForm, usePage } from '@inertiajs/react';

export default function NavigationSettings({ groupedSettings, linkOptions = [] }) {
    const { draftPageSlugs = [] } = usePage().props;

    const isDraftUrl = (url) => typeof url === 'string' && draftPageSlugs.includes(url.replace(/^\//, ''));
    const rawSettings = Object.values(groupedSettings).flat().reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {});

    let parsedItems = [];
    try {
        parsedItems = JSON.parse(rawSettings.nav_items || '[]');
    } catch {
        parsedItems = [];
    }

    const { data, setData, post, processing, recentlySuccessful, errors } = useForm({
        nav_items: Array.isArray(parsedItems) && parsedItems.length > 0 ? parsedItems : [],
    });

    const addItem = () => {
        setData('nav_items', [...data.nav_items, { type: 'single', label: '', url: '' }]);
    };

    const removeItem = (index) => {
        setData('nav_items', data.nav_items.filter((_, i) => i !== index));
    };

    const updateItem = (index, field, value) => {
        setData('nav_items', data.nav_items.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
    };

    const addChild = (itemIndex) => {
        setData('nav_items', data.nav_items.map((item, i) =>
            i === itemIndex ? { ...item, children: [...(item.children || []), { label: '', url: '' }] } : item
        ));
    };

    const removeChild = (itemIndex, childIndex) => {
        setData('nav_items', data.nav_items.map((item, i) =>
            i === itemIndex ? { ...item, children: (item.children || []).filter((_, j) => j !== childIndex) } : item
        ));
    };

    const updateChild = (itemIndex, childIndex, field, value) => {
        setData('nav_items', data.nav_items.map((item, i) =>
            i === itemIndex ? {
                ...item,
                children: (item.children || []).map((child, j) => j === childIndex ? { ...child, [field]: value } : child)
            } : item
        ));
    };

    const selectUrl = (itemIndex, url) => {
        const option = linkOptions.find((o) => o.url === url);
        setData('nav_items', data.nav_items.map((item, i) =>
            i === itemIndex ? { ...item, url, label: plainLabel(option?.label) || item.label } : item
        ));
    };

    const selectChildUrl = (itemIndex, childIndex, url) => {
        const option = linkOptions.find((o) => o.url === url);
        setData('nav_items', data.nav_items.map((item, i) =>
            i === itemIndex ? {
                ...item,
                children: (item.children || []).map((child, j) => j === childIndex
                    ? { ...child, url, label: plainLabel(option?.label) || child.label }
                    : child)
            } : item
        ));
    };

    // Parked dropdowns (no label / no submenu) are skipped by the public navbar.
    const dropdownNotice = (item) => {
        if (item.type !== 'dropdown') {
            return null;
        }
        if (!String(item.label || '').trim()) {
            return 'Dropdown tanpa label tidak tampil di navbar publik.';
        }
        if ((item.children || []).length === 0) {
            return 'Dropdown tanpa submenu tidak tampil di navbar publik.';
        }

        return null;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/settings/navigation');
    };

    return (
        <AdminLayout title="Pengaturan Menu Navigasi">
            <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
                {recentlySuccessful && (
                    <div className="p-4 bg-emerald-50 text-emerald-700 rounded-lg text-sm">
                        Pengaturan menu navigasi berhasil disimpan.
                    </div>
                )}

                {Object.keys(errors).length > 0 && (
                    <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">
                        <p className="font-semibold mb-2">Terdapat kesalahan:</p>
                        <ul className="list-disc list-inside space-y-1">
                            {Object.values(errors).map((error, i) => (
                                <li key={i}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <Card className="p-6" overflow="visible">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-base font-bold text-slate-800">Item Menu Navigasi</h2>
                            <p className="text-xs text-slate-500 mt-1">Menu akan tampil sesuai urutan di bawah. Tautan tunggal langsung terbuka, dropdown punya submenu.</p>
                            <p className="text-xs text-slate-500 mt-1">Laman juga bisa menaruh dirinya ke sini lewat form Laman.</p>
                        </div>
                        <button
                            type="button"
                            onClick={addItem}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary transition hover:bg-primary/20"
                        >
                            <Icon name="plus" className="h-4 w-4" />
                            Tambah Item
                        </button>
                    </div>

                    {data.nav_items.length === 0 ? (
                        <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                            Belum ada item menu. Klik "Tambah Item" untuk membuat item pertama.<br />
                            <span className="text-xs">Kosongkan untuk pakai menu bawaan (Beranda, Tentang Kami, Berita, dll).</span>
                        </p>
                    ) : (
                        <div className="space-y-6">
                            {data.nav_items.map((item, itemIndex) => (
                                <div key={itemIndex} className="border-2 border-slate-200 rounded-xl p-5 space-y-4 bg-white shadow-sm">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 space-y-4">
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-600 mb-1">Jenis Item</label>
                                                    <select
                                                        value={item.type}
                                                        onChange={(e) => {
                                                            const newType = e.target.value;
                                                            updateItem(itemIndex, 'type', newType);
                                                            if (newType === 'dropdown' && !item.children) {
                                                                updateItem(itemIndex, 'children', [{ label: '', url: '' }]);
                                                            }
                                                        }}
                                                        className="block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                                                    >
                                                        <option value="single">Tautan Tunggal</option>
                                                        <option value="dropdown">Dropdown</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-medium text-slate-600 mb-1">Label Menu</label>
                                                    <input
                                                        type="text"
                                                        value={item.label || ''}
                                                        onChange={(e) => updateItem(itemIndex, 'label', e.target.value)}
                                                        placeholder="Misal: Beranda, Tentang Kami"
                                                        className="block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                                                    />
                                                </div>
                                            </div>

                                            {item.type === 'single' && (
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-600 mb-1">URL Tujuan</label>
                                                    <LinkUrlPicker
                                                        options={linkOptions}
                                                        value={item.url || ''}
                                                        onChange={(url) => selectUrl(itemIndex, url)}
                                                    />
                                                    {isDraftUrl(item.url) && (
                                                        <p className="mt-1.5 text-xs font-semibold text-amber-700">
                                                            Laman draf: disembunyikan dari navbar publik sampai diterbitkan.
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            {item.type === 'dropdown' && (
                                                <div className="border-t border-slate-200 pt-4">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Submenu</p>
                                                        <button
                                                            type="button"
                                                            onClick={() => addChild(itemIndex)}
                                                            className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                                                        >
                                                            <Icon name="plus" className="h-3.5 w-3.5" />
                                                            Tambah Submenu
                                                        </button>
                                                    </div>

                                                    <div className="space-y-3">
                                                        {(item.children || []).map((child, childIndex) => (
                                                            <div key={childIndex} className="flex gap-3 items-start bg-slate-50 rounded-lg p-3 border border-slate-200">
                                                                <div className="flex-1 grid grid-cols-2 gap-3">
                                                                    <div>
                                                                        <label className="block text-xs font-medium text-slate-600 mb-1">Label Submenu</label>
                                                                        <input
                                                                            type="text"
                                                                            value={child.label || ''}
                                                                            onChange={(e) => updateChild(itemIndex, childIndex, 'label', e.target.value)}
                                                                            placeholder="Misal: Visi Misi"
                                                                            className="block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-xs font-medium text-slate-600 mb-1">URL Tujuan</label>
                                                                        <LinkUrlPicker
                                                                            options={linkOptions}
                                                                            value={child.url || ''}
                                                                            onChange={(url) => selectChildUrl(itemIndex, childIndex, url)}
                                                                        />
                                                                        {isDraftUrl(child.url) && (
                                                                            <p className="mt-1.5 text-xs font-semibold text-amber-700">
                                                                                Laman draf: disembunyikan dari navbar publik.
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeChild(itemIndex, childIndex)}
                                                                    className="shrink-0 p-2 rounded-lg text-red-600 transition hover:bg-red-50"
                                                                    aria-label="Hapus submenu"
                                                                >
                                                                    <Icon name="x" className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {dropdownNotice(item) && (
                                                        <p className="mt-3 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                                                            {dropdownNotice(item)}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => removeItem(itemIndex)}
                                            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                                        >
                                            <Icon name="trash" className="h-4 w-4" />
                                            Hapus Item
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
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
