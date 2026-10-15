import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/Card';
import { Link, usePage, router } from '@inertiajs/react';
import ActionIcon from '@/Components/ActionIcon';

function StatCard({ label, value, sub, icon, tone, href }) {
    const tones = {
        primary: 'bg-primary/10 text-primary',
        secondary: 'bg-secondary/10 text-secondary',
        tertiary: 'bg-tertiary/10 text-tertiary',
        slate: 'bg-slate-100 text-slate-600',
    };

    return (
        <Link
            href={href}
            className="group block rounded-lg border border-slate-200 bg-white p-5 shadow-card transition hover:shadow-card-hover hover:border-primary/30"
        >
            <div className="flex items-start justify-between">
                <div className={`flex h-11 w-11 items-center justify-center rounded-md ${tones[tone]}`}>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                    </svg>
                </div>
                <svg className="h-4 w-4 text-slate-300 transition group-hover:text-primary" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
            </div>
            <p className="mt-4 text-3xl font-extrabold text-slate-800">{value}</p>
            <p className="text-sm font-medium text-slate-500">{label}</p>
            {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
        </Link>
    );
}

function QuickAction({ label, href, icon }) {
    return (
        <Link
            href={href}
            className="flex flex-col items-center gap-2 rounded-md border border-slate-200 bg-white p-4 text-center transition hover:border-primary/30 hover:bg-primary/5"
        >
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                </svg>
            </div>
            <span className="text-xs font-medium text-slate-700">{label}</span>
        </Link>
    );
}

export default function Dashboard({ metrics, latestPosts, latestPages, siteInfo, chatEnabled }) {
    const { auth } = usePage().props;
    const userName = auth?.user?.name || 'Admin';

    const hour = new Date().getHours();
    const greeting = hour < 11 ? 'Selamat Pagi' : hour < 15 ? 'Selamat Siang' : hour < 18 ? 'Selamat Sore' : 'Selamat Malam';
    const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    const staffTotal = metrics.total_guru + metrics.total_tendik || 1;
    const guruPct = Math.round((metrics.total_guru / staffTotal) * 100);
    const tendikPct = 100 - guruPct;

    return (
        <AdminLayout title="Dashboard">
            <div className="mb-6 overflow-hidden rounded-lg bg-gradient-to-br from-primary to-secondary p-6 sm:p-8 text-white shadow-card">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="text-sm text-white/70">{today}</p>
                        <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">
                            {greeting}, {userName}!
                        </h1>
                        <p className="mt-2 max-w-xl text-sm text-white/80">
                            Ringkasan aktivitas {siteInfo.site_name}. Kelola konten, personel, dan tampilan situs dari satu tempat.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href="/admin/posts/create"
                            className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-primary shadow-sm transition hover:bg-white/90"
                        >
                            + Tulis Konten
                        </Link>
                        <Link
                            href="/admin/pages/create"
                            className="rounded-md border border-white/40 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                        >
                            + Tambah Laman
                        </Link>
                    </div>
                </div>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    label="Berita & Artikel"
                    value={metrics.total_posts}
                    sub={`${metrics.published_posts} terbit · ${metrics.draft_posts} draf`}
                    href="/admin/posts"
                    tone="primary"
                    icon="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
                <StatCard
                    label="Halaman Statis"
                    value={metrics.total_pages}
                    sub={`${metrics.published_pages} tayang`}
                    href="/admin/pages"
                    tone="secondary"
                    icon="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
                <StatCard
                    label="Guru & Tendik"
                    value={metrics.total_staff}
                    sub={`${metrics.total_guru} guru · ${metrics.total_tendik} tendik`}
                    href="/admin/staff"
                    tone="tertiary"
                    icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
                <StatCard
                    label="Kategori Konten"
                    value={metrics.total_categories}
                    sub={`${metrics.total_galleries} media galeri`}
                    href="/admin/categories"
                    tone="slate"
                    icon="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <Card className="p-6">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-base font-bold text-slate-800">Konten Terbaru</h2>
                            <Link href="/admin/posts" className="text-sm font-semibold text-primary hover:underline">
                                Lihat Semua
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            {/* Tambahkan table-fixed di sini */}
                            <table className="w-full table-fixed border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        <th className="py-3 w-[350px]">Judul</th>
                                        <th className="py-3 w-[120px]">Kategori</th>
                                        <th className="py-3">Status</th>
                                        <th className="py-3">Diperbarui</th>
                                        <th className="py-3 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {latestPosts.map((post) => (
                                        <tr key={post.id} className="transition hover:bg-slate-50">
                                            <td className="py-3 pr-3">
                                                <div className="flex items-center gap-3">
                                                    {post.featured_image ? (
                                                        <img src={post.featured_image} alt="" className="h-10 w-10 shrink-0 rounded-md border border-slate-200 object-cover" />
                                                    ) : (
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-400">
                                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                    <span className="font-medium text-slate-800 truncate">{post.title}</span>
                                                </div>
                                            </td>
                                            <td className="hidden py-3 text-slate-500 sm:table-cell">{post.category?.name || '-'}</td>
                                            <td className="py-3">
                                                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                                    post.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                                }`}>
                                                    {post.status === 'published' ? 'Terbit' : 'Draf'}
                                                </span>
                                            </td>
                                            <td className="hidden py-3 text-slate-500 md:table-cell">
                                                {new Date(post.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="py-3 text-right">
                                                <ActionIcon icon="pencil" label="Edit laman" href={`/admin/posts/${post.id}/edit`}color="primary" />
                                            </td>
                                        </tr>
                                    ))}
                                    {latestPosts.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="py-8 text-center text-sm text-slate-400">Belum ada berita.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-base font-bold text-slate-800">Halaman Terakhir Diperbarui</h2>
                            <Link href="/admin/pages" className="text-sm font-semibold text-primary hover:underline">
                                Lihat Semua
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full table-fixed border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        <th className="py-3 w-[350px]">Judul</th>
                                        <th className="py-3">Status</th>
                                        <th className="py-3 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {latestPages.map((page) => (
                                        <tr key={page.id} className="transition hover:bg-slate-50">
                                            <td className="py-3 pr-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary/10 text-secondary">
                                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-800">{page.title}</p>
                                                        <p className="text-xs text-slate-400">/{page.slug}</p>
                                                    </div>
                                                </div>
                                            </td>
                    
                                            <td className="py-3">
                                                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                                    page.is_published ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                    {page.is_published ? 'Tayang' : 'Draf'}
                                                </span>
                                            </td>

                                            <td className="py-3 text-right">
                                                <ActionIcon icon="pencil" label="Edit laman" href={`/admin/pages/${page.id}/edit`} color="primary" />
                                            </td>
                                        </tr>
                                    ))}
                                    {latestPages.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="py-8 text-center text-sm text-slate-400">Belum ada Laman.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="p-6">
                        <h2 className="mb-4 text-base font-bold text-slate-800">Aksi Cepat</h2>
                        <div className="grid grid-cols-2 gap-3">
                            <QuickAction label="Banner Beranda" href="/admin/settings/hero" icon="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" />
                            <QuickAction label="Menu Navbar" href="/admin/settings/navigation" icon="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            <QuickAction label="Kontak & PPDB" href="/admin/settings/contact" icon="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                            <QuickAction label="Media Sosial" href="/admin/settings/social-media" icon="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h2 className="mb-4 text-base font-bold text-slate-800">Komposisi SDM</h2>
                        <div className="space-y-4">
                            <div>
                                <div className="mb-1 flex items-center justify-between text-sm">
                                    <span className="font-medium text-slate-700">Guru</span>
                                    <span className="font-semibold text-primary">{metrics.total_guru}</span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                                    <div className="h-full rounded-full bg-primary" style={{ width: `${guruPct}%` }} />
                                </div>
                            </div>
                            <div>
                                <div className="mb-1 flex items-center justify-between text-sm">
                                    <span className="font-medium text-slate-700">Tendik</span>
                                    <span className="font-semibold text-secondary">{metrics.total_tendik}</span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                                    <div className="h-full rounded-full bg-secondary" style={{ width: `${tendikPct}%` }} />
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h2 className="mb-4 text-base font-bold text-slate-800">Identitas Website</h2>
                        <div className="flex items-center gap-3">
                            {siteInfo.site_logo ? (
                                <img src={siteInfo.site_logo} alt={siteInfo.site_name} className="h-12 w-12 rounded-md border border-slate-200 bg-white object-contain p-1" />
                            ) : (
                                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-lg font-bold text-primary">
                                    {siteInfo.site_name.slice(0, 2).toUpperCase()}
                                </div>
                            )}
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-slate-800">{siteInfo.site_name}</p>
                                <p className="text-xs text-slate-400">{siteInfo.site_logo ? 'Logo terpasang' : 'Belum ada logo'}</p>
                            </div>
                        </div>
                        <Link href="/admin/settings/footer" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">
                            Ubah Identitas →
                        </Link>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-start justify-between">
                            <h2 className="text-base font-bold text-slate-800">Asisten AI</h2>
                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${chatEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                                {chatEnabled ? 'Aktif' : 'Nonaktif'}
                            </span>
                        </div>
                        <p className="mt-2 text-3xl font-extrabold text-slate-800">{metrics.total_chat_sessions}</p>
                        <p className="text-sm text-slate-500">Sesi percakapan pengunjung</p>
                        <button
                            type="button"
                            onClick={() => router.post('/admin/dashboard/toggle-chat', {}, { preserveScroll: true })}
                            className={`mt-4 w-full rounded-lg px-4 py-2 text-sm font-semibold transition ${chatEnabled ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
                        >
                            {chatEnabled ? 'Matikan Chat' : 'Aktifkan Chat'}
                        </button>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
