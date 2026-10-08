import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

function Chevron({ open = false }) {
    return (
        <svg className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
        </svg>
    );
}

export default function PublicLayout({ children, settings = {} }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openMenu, setOpenMenu] = useState(null);
    const { aboutPages = [], customPages = [], settings: sharedSettings = {} } = usePage().props;
    const siteSettings = { ...sharedSettings, ...settings };

    const toggleMenu = (name) => setOpenMenu(openMenu === name ? null : name);
    const closeMenus = () => {
        setOpenMenu(null);
        setMobileMenuOpen(false);
    };

    const pageLinks = (pages) => pages.map((page) => (
        <Link
            key={page.slug}
            href={`/laman/${page.slug}`}
            onClick={closeMenus}
            className="block rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-emerald-50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
            {page.title}
        </Link>
    ));

    const archiveLinks = [
        ['Pengumuman', '/arsip/pengumuman'],
        ['Agenda', '/arsip/agenda'],
        ['Prestasi', '/arsip/prestasi'],
        ['Galeri', '/arsip/galeri'],
    ];

    return (
        <div className="min-h-screen bg-canvas text-slate-900">
            <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-md">
                <div className="bg-slate-850 text-white">
                    <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-xs sm:px-6 lg:px-8">
                        <div className="flex min-w-0 items-center gap-4">
                            <span className="truncate">{siteSettings.contact_phone || '(031) 8971234'}</span>
                            <span className="hidden truncate sm:inline">{siteSettings.contact_email || 'info@smaliska.sch.id'}</span>
                        </div>
                        <a href={siteSettings.ppdb_link || '#'} className="min-h-8 shrink-0 rounded bg-secondary px-3 py-1.5 font-semibold text-white transition hover:bg-secondary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-850">
                            Daftar PPDB
                        </a>
                    </div>
                </div>

                <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Navigasi utama">
                    <div className="flex min-h-16 items-center justify-between gap-4">
                        <Link href="/" className="flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-sm font-extrabold text-white shadow-sm">SA</span>
                            <span className="min-w-0">
                                <span className="block truncate text-sm font-extrabold tracking-tight text-primary sm:text-base">{siteSettings.site_name || 'SMA Al Islam Krian'}</span>
                                <span className="hidden text-xs text-slate-600 sm:block">Portal resmi SMALISKA</span>
                            </span>
                        </Link>

                        <div className="hidden items-center gap-1 lg:flex">
                            <Link href="/" className="rounded-lg px-3 py-2 text-sm font-semibold text-primary transition hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Beranda</Link>
                            <div className="relative">
                                <button type="button" onClick={() => toggleMenu('about')} aria-expanded={openMenu === 'about'} className="flex min-h-11 items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                                    Tentang Kami <Chevron open={openMenu === 'about'} />
                                </button>
                                {openMenu === 'about' && <div className="absolute left-0 top-full mt-2 w-60 rounded-xl border border-slate-200 bg-white p-2 shadow-card">{pageLinks(aboutPages)}</div>}
                            </div>
                            <Link href="/berita" className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Berita</Link>
                            <div className="relative">
                                <button type="button" onClick={() => toggleMenu('pages')} aria-expanded={openMenu === 'pages'} className="flex min-h-11 items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                                    Laman <Chevron open={openMenu === 'pages'} />
                                </button>
                                {openMenu === 'pages' && <div className="absolute left-0 top-full mt-2 w-60 rounded-xl border border-slate-200 bg-white p-2 shadow-card">{pageLinks(customPages)}</div>}
                            </div>
                            <div className="relative">
                                <button type="button" onClick={() => toggleMenu('archive')} aria-expanded={openMenu === 'archive'} className="flex min-h-11 items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                                    Arsip <Chevron open={openMenu === 'archive'} />
                                </button>
                                {openMenu === 'archive' && <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-card">{archiveLinks.map(([label, href]) => <Link key={href} href={href} onClick={closeMenus} className="block rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-emerald-50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">{label}</Link>)}</div>}
                            </div>
                            <Link href="/statistik" className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Statistik</Link>
                        </div>

                        <button type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-expanded={mobileMenuOpen} aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'} className="grid h-11 w-11 place-items-center rounded-lg text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:hidden">
                            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path strokeLinecap="round" d={mobileMenuOpen ? 'M6 6l12 12M18 6 6 18' : 'M4 6h16M4 12h16M4 18h16'} /></svg>
                        </button>
                    </div>

                    {mobileMenuOpen && (
                        <div className="border-t border-slate-100 py-3 lg:hidden">
                            <Link href="/" onClick={closeMenus} className="block min-h-11 rounded-lg px-3 py-2.5 text-sm font-semibold text-primary">Beranda</Link>
                            {[
                                ['about', 'Tentang Kami', aboutPages],
                                ['pages', 'Laman', customPages],
                            ].map(([name, label, pages]) => (
                                <div key={name}>
                                    <button type="button" onClick={() => toggleMenu(name)} aria-expanded={openMenu === name} className="flex min-h-11 w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                                        {label} <Chevron open={openMenu === name} />
                                    </button>
                                    {openMenu === name && <div className="ml-3 border-l border-slate-200 pl-2">{pageLinks(pages)}</div>}
                                </div>
                            ))}
                            <Link href="/berita" onClick={closeMenus} className="block min-h-11 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700">Berita</Link>
                            <div>
                                <button type="button" onClick={() => toggleMenu('archive')} aria-expanded={openMenu === 'archive'} className="flex min-h-11 w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Arsip <Chevron open={openMenu === 'archive'} /></button>
                                {openMenu === 'archive' && <div className="ml-3 border-l border-slate-200 pl-2">{archiveLinks.map(([label, href]) => <Link key={href} href={href} onClick={closeMenus} className="block min-h-11 rounded-lg px-3 py-2.5 text-sm text-slate-700">{label}</Link>)}</div>}
                            </div>
                            <Link href="/statistik" onClick={closeMenus} className="block min-h-11 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700">Statistik</Link>
                        </div>
                    )}
                </nav>
            </header>

            <main>{children}</main>

            <footer className="mt-16 bg-slate-850 text-white">
                <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
                    <div>
                        <p className="text-lg font-extrabold">{siteSettings.site_name || 'SMA Al Islam Krian'}</p>
                        <p className="mt-3 max-w-sm text-sm leading-6 text-slate-300">{siteSettings.site_tagline || 'Berakhlak Mulia, Berprestasi Tinggi, Berwawasan Global'}</p>
                    </div>
                    <div>
                        <p className="font-bold">Kontak</p>
                        <div className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                            <p>{siteSettings.contact_address || 'Jl. Kyai Mojo No. 1, Krian, Sidoarjo'}</p>
                            <p>{siteSettings.contact_phone || '(031) 8971234'}</p>
                            <p>{siteSettings.contact_email || 'info@smaliska.sch.id'}</p>
                        </div>
                    </div>
                    <div>
                        <p className="font-bold">Tautan</p>
                        <div className="mt-3 space-y-2 text-sm text-slate-300">
                            <a href={siteSettings.ppdb_link || '#'} className="block transition hover:text-white">Pendaftaran PPDB</a>
                            <Link href="/login" className="block transition hover:text-white">Login Admin</Link>
                        </div>
                    </div>
                </div>
                <div className="border-t border-slate-700 px-4 py-5 text-center text-xs text-slate-400">© {new Date().getFullYear()} {siteSettings.site_name || 'SMA Al Islam Krian'}. Hak Cipta Dilindungi.</div>
            </footer>
        </div>
    );
}
