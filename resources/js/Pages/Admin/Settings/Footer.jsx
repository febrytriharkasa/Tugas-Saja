import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import LinkUrlPicker, { plainLabel } from '@/Components/LinkUrlPicker';
import Icon from '@/Components/Icon';
import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function FooterSettings({ groupedSettings, linkOptions = [] }) {
    const rawSettings = Object.values(groupedSettings).flat().reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {});

    let parsedGroups = [];
    try {
        parsedGroups = JSON.parse(rawSettings.footer_groups || '[]');
    } catch {
        parsedGroups = [];
    }

    const savedSchoolLogo = rawSettings.site_logo || null;
    const savedWebsiteLogo = rawSettings.site_website_logo || null;
    const [schoolLogoPreview, setSchoolLogoPreview] = useState(savedSchoolLogo);
    const [websiteLogoPreview, setWebsiteLogoPreview] = useState(savedWebsiteLogo);

    const { data, setData, post, processing, recentlySuccessful, errors } = useForm({
        site_name: rawSettings.site_name || '',
        site_portal_text: rawSettings.site_portal_text || '',
        site_logo_file: null,
        remove_site_logo: false,
        site_website_logo_file: null,
        remove_site_website_logo: false,
        footer_about: rawSettings.footer_about || '',
        footer_groups: Array.isArray(parsedGroups) && parsedGroups.length > 0 ? parsedGroups : [],
    });

    useEffect(() => () => {
        if (schoolLogoPreview?.startsWith('blob:')) {
            URL.revokeObjectURL(schoolLogoPreview);
        }
    }, [schoolLogoPreview]);

    useEffect(() => () => {
        if (websiteLogoPreview?.startsWith('blob:')) {
            URL.revokeObjectURL(websiteLogoPreview);
        }
    }, [websiteLogoPreview]);

    const handleSchoolLogoChange = (file) => {
        setData('site_logo_file', file || null);
        if (file) {
            setData('remove_site_logo', false);
        }
        setSchoolLogoPreview(file ? URL.createObjectURL(file) : savedSchoolLogo);
    };

    const handleSchoolLogoRemove = () => {
        setData('site_logo_file', null);
        setData('remove_site_logo', true);
        setSchoolLogoPreview(null);
    };

    const handleWebsiteLogoChange = (file) => {
        setData('site_website_logo_file', file || null);
        if (file) {
            setData('remove_site_website_logo', false);
        }
        setWebsiteLogoPreview(file ? URL.createObjectURL(file) : savedWebsiteLogo);
    };

    const handleWebsiteLogoRemove = () => {
        setData('site_website_logo_file', null);
        setData('remove_site_website_logo', true);
        setWebsiteLogoPreview(null);
    };

    const addGroup = () => {
        setData('footer_groups', [...data.footer_groups, { title: '', links: [{ label: '', url: '' }] }]);
    };

    const removeGroup = (groupIndex) => {
        setData('footer_groups', data.footer_groups.filter((_, i) => i !== groupIndex));
    };

    const updateGroupTitle = (groupIndex, value) => {
        setData('footer_groups', data.footer_groups.map((group, i) => (i === groupIndex ? { ...group, title: value } : group)));
    };

    const addLink = (groupIndex) => {
        setData('footer_groups', data.footer_groups.map((group, i) => 
            i === groupIndex ? { ...group, links: [...group.links, { label: '', url: '' }] } : group
        ));
    };

    const removeLink = (groupIndex, linkIndex) => {
        setData('footer_groups', data.footer_groups.map((group, i) => 
            i === groupIndex ? { ...group, links: group.links.filter((_, j) => j !== linkIndex) } : group
        ));
    };

    const updateLink = (groupIndex, linkIndex, field, value) => {
        setData('footer_groups', data.footer_groups.map((group, i) => 
            i === groupIndex ? { 
                ...group, 
                links: group.links.map((link, j) => j === linkIndex ? { ...link, [field]: value } : link) 
            } : group
        ));
    };

    const selectPage = (groupIndex, linkIndex, url) => {
        const option = linkOptions.find((o) => o.url === url);
        setData('footer_groups', data.footer_groups.map((group, i) =>
            i === groupIndex ? {
                ...group,
                links: group.links.map((link, j) => j === linkIndex
                    ? { ...link, url, label: plainLabel(option?.label) || link.label }
                    : link)
            } : group
        ));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/settings/footer', { forceFormData: true });
    };

    return (
        <AdminLayout title="Identitas Situs (Navbar & Footer)">
            <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
                {recentlySuccessful && (
                    <div className="p-4 bg-emerald-50 text-emerald-700 rounded-lg text-sm">
                        Pengaturan identitas situs dan footer berhasil disimpan.
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
                    <h2 className="text-base font-bold text-slate-800 mb-4">Identitas Situs (Navbar & Footer)</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-600">Logo Sekolah</label>
                            {schoolLogoPreview && (
                                <div className="relative mt-2 inline-block">
                                    <img
                                        src={schoolLogoPreview}
                                        alt="Logo sekolah"
                                        className="h-20 w-auto rounded-lg border border-slate-200 bg-white object-contain p-1"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleSchoolLogoRemove}
                                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow-sm transition hover:bg-red-700"
                                        aria-label="Hapus logo sekolah"
                                    >
                                        <Icon name="x" className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleSchoolLogoChange(e.target.files[0])}
                                className="mt-1 block w-full rounded-lg border border-slate-300 text-sm file:mr-4 file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-slate-700"
                            />
                            <p className="mt-1 text-xs text-slate-500">
                                Dipakai untuk identitas sekolah: SEO, dashboard admin, dan halaman masuk. Format PNG/JPG/SVG, maksimal 2MB.
                            </p>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-600">Logo Website (Navbar &amp; Footer)</label>
                            {websiteLogoPreview && (
                                <div className="relative mt-2 inline-block">
                                    <img
                                        src={websiteLogoPreview}
                                        alt="Logo website"
                                        className="h-20 w-auto rounded-lg border border-slate-200 bg-white object-contain p-1"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleWebsiteLogoRemove}
                                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow-sm transition hover:bg-red-700"
                                        aria-label="Hapus logo website"
                                    >
                                        <Icon name="x" className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleWebsiteLogoChange(e.target.files[0])}
                                className="mt-1 block w-full rounded-lg border border-slate-300 text-sm file:mr-4 file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-slate-700"
                            />
                            <p className="mt-1 text-xs text-slate-500">
                                Tampil di navbar dan footer. Jika kosong, logo website memakai Logo Sekolah. Format PNG/JPG/SVG, maksimal 2MB.
                            </p>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-600">Nama Sekolah / Situs</label>
                            <input
                                type="text"
                                value={data.site_name}
                                onChange={(e) => setData('site_name', e.target.value)}
                                placeholder="Contoh: SMA XYZ"
                                className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-600">Teks Portal (di bawah nama pada navbar)</label>
                            <input
                                type="text"
                                value={data.site_portal_text}
                                onChange={(e) => setData('site_portal_text', e.target.value)}
                                placeholder="Contoh: Portal resmi SMA XYZ"
                                className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-600">
                                Penjelasan Singkat (ditampilkan di footer)
                            </label>
                            <textarea
                                rows={3}
                                value={data.footer_about}
                                onChange={(e) => setData('footer_about', e.target.value)}
                                placeholder="Contoh: SMA XYZ adalah sekolah menengah atas yang berkomitmen mencetak generasi unggul..."
                                className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                            />
                        </div>
                    </div>
                </Card>

                <Card className="p-6" overflow="visible">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-base font-bold text-slate-800">Kolom Tautan Footer</h2>
                            <p className="text-xs text-slate-500 mt-1">Maksimal 3 kolom. Setiap kolom berisi judul dan daftar tautan. Untuk URL, pilih dari daftar halaman yang tersedia; label terisi otomatis.</p>
                        </div>
                        {data.footer_groups.length < 3 && (
                            <button
                                type="button"
                                onClick={addGroup}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary transition hover:bg-primary/20"
                            >
                                <Icon name="plus" className="h-4 w-4" />
                                Tambah Kolom
                            </button>
                        )}
                    </div>

                    {data.footer_groups.length >= 3 && (
                        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                            <strong>Maksimal 3 kolom tercapai.</strong> Hapus salah satu kolom untuk menambah yang baru.
                        </div>
                    )}

                    {data.footer_groups.length === 0 ? (
                        <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                            Belum ada kolom tautan. Klik "Tambah Kolom" untuk membuat kolom pertama.<br />
                            <span className="text-xs">Contoh: Kolom "Halaman" berisi tautan Visi Misi, Sejarah, dll.</span>
                        </p>
                    ) : (
                        <div className="space-y-6">
                            {data.footer_groups.map((group, groupIndex) => (
                                <div key={groupIndex} className="border-2 border-slate-200 rounded-xl p-5 space-y-4 bg-white shadow-sm">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                                Judul Kolom {groupIndex + 1}
                                            </label>
                                            <input
                                                type="text"
                                                value={group.title}
                                                onChange={(e) => updateGroupTitle(groupIndex, e.target.value)}
                                                placeholder="Contoh: Halaman, Arsip, Lainnya"
                                                className="block w-full rounded-lg border-slate-300 text-sm font-semibold focus:border-primary focus:ring-primary"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeGroup(groupIndex)}
                                            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                                        >
                                            <Icon name="trash" className="h-4 w-4" />
                                            Hapus Kolom
                                        </button>
                                    </div>

                                    <div className="border-t border-slate-200 pt-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Daftar Tautan</p>
                                            <button
                                                type="button"
                                                onClick={() => addLink(groupIndex)}
                                                className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                                            >
                                                <Icon name="plus" className="h-3.5 w-3.5" />
                                                Tambah Tautan
                                            </button>
                                        </div>

                                        <div className="space-y-3">
                                            {group.links.map((link, linkIndex) => (
                                                <div key={linkIndex} className="flex gap-3 items-start bg-slate-50 rounded-lg p-3 border border-slate-200">
                                                    <div className="flex-1 grid grid-cols-2 gap-3">
                                                        <div>
                                                            <label className="block text-xs font-medium text-slate-600 mb-1">Label Tautan</label>
                                                            <input
                                                                type="text"
                                                                value={link.label}
                                                                onChange={(e) => updateLink(groupIndex, linkIndex, 'label', e.target.value)}
                                                                placeholder="Misal: Visi Misi"
                                                                className="block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-medium text-slate-600 mb-1">URL Tujuan</label>
                                                            <LinkUrlPicker
                                                                options={linkOptions}
                                                                value={link.url || ''}
                                                                onChange={(url) => selectPage(groupIndex, linkIndex, url)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeLink(groupIndex, linkIndex)}
                                                        className="shrink-0 p-2 rounded-lg text-red-600 transition hover:bg-red-50"
                                                        aria-label="Hapus tautan"
                                                    >
                                                        <Icon name="x" className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
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
