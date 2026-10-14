import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '@/Components/ThemeToggle';

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
    const { url, props } = usePage();
    const { aboutPages = [], customPages = [], archivePages = [], settings: sharedSettings = {} } = props;
    const siteSettings = { ...sharedSettings, ...settings };

    let navItems = [];
    try {
        navItems = siteSettings.nav_items ? JSON.parse(siteSettings.nav_items) : [];
    } catch {
        navItems = [];
    }

    const useDefaultNav = navItems.length === 0;

    const currentUrl = url.split('?')[0];
    const matches = (href) => currentUrl === href || currentUrl.startsWith(`${href}/`);
    
    const isActive = (item) => {
        if (item.type === 'single') {
            return matches(item.url);
        }
        return (item.children || []).some((child) => matches(child.url));
    };

    const isHome = currentUrl === '/';
    const isNews = matches('/berita');
    const isStats = matches('/statistik');
    const isAbout = aboutPages.some((page) => matches(`/laman/${page.slug}`));
    const isCustom = customPages.some((page) => matches(`/laman/${page.slug}`));
    const isArchive = matches('/arsip') || archivePages.some((page) => matches(`/laman/${page.slug}`));

    const navClass = (active) =>
        `rounded-lg px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
            active ? 'bg-emerald-50 text-primary' : 'text-slate-700 hover:bg-slate-50 hover:text-primary'
        }`;

    const toggleMenu = (name) => setOpenMenu(openMenu === name ? null : name);
    const closeMenus = () => {
        setOpenMenu(null);
        setMobileMenuOpen(false);
    };

    const mobileNavClass = (active) =>
        `block min-h-11 rounded-lg px-3 py-2.5 text-sm font-semibold ${
            active ? 'bg-emerald-50 text-primary' : 'text-slate-700'
        }`;

    const pageLinks = (pages) => pages.map((page) => {
        const href = `/laman/${page.slug}`;
        const active = matches(href);

        return (
            <Link
                key={page.slug}
                href={href}
                onClick={closeMenus}
                aria-current={active ? 'page' : undefined}
                className={`block rounded-lg px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    active ? 'bg-emerald-50 font-semibold text-primary' : 'text-slate-700 hover:bg-emerald-50 hover:text-primary'
                }`}
            >
                {page.title}
            </Link>
        );
    });

    const archiveLinks = [
        ['Pengumuman', '/arsip/pengumuman'],
        ['Agenda', '/arsip/agenda'],
        ['Prestasi', '/arsip/prestasi'],
        ['Galeri', '/arsip/galeri'],
    ];

    return (
        <div className="flex min-h-screen flex-col bg-canvas text-slate-900">
            <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-md">
                <div className="bg-slate-850 text-white">
                    <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-xs sm:px-6 lg:px-8">
                        <div className="flex min-w-0 items-center gap-4">
                            <span className="truncate">{siteSettings.contact_phone || '(031) 8971234'}</span>
                            <span className="hidden truncate sm:inline">{siteSettings.contact_email || 'info@smaxyz.sch.id'}</span>
                        </div>
                        <a href={siteSettings.ppdb_link || '#'} className="min-h-8 shrink-0 rounded bg-secondary px-3 py-1.5 font-semibold text-white transition hover:bg-secondary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-850">
                            Daftar PPDB
                        </a>
                    </div>
                </div>

                <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Navigasi utama">
                    <div className="flex min-h-16 items-center justify-between gap-4">
                        <Link href="/" className="flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                            {siteSettings.site_logo ? (
                                <img src={siteSettings.site_logo} alt={siteSettings.site_name || 'SMA XYZ'} className="h-10 w-10 shrink-0 rounded-xl object-contain" />
                            ) : (
                                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-sm font-extrabold text-white shadow-sm">{(siteSettings.site_name || 'SMA XYZ').slice(0, 2).toUpperCase()}</span>
                            )}
                            <span className="min-w-0">
                                <span className="block truncate text-sm font-extrabold tracking-tight text-primary sm:text-base">{siteSettings.site_name || 'SMA XYZ'}</span>
                                <span className="hidden text-xs text-slate-600 sm:block">{siteSettings.site_portal_text || 'Portal resmi SMA XYZ'}</span>
                            </span>
                        </Link>

                        <div className="hidden items-center gap-1 lg:flex">
                            {useDefaultNav ? (
                                <>
                                    <Link href="/" aria-current={isHome ? 'page' : undefined} className={navClass(isHome)}>Beranda</Link>
                                    <div className="relative">
                                        <button type="button" onClick={() => toggleMenu('about')} aria-expanded={openMenu === 'about'} className={`flex min-h-11 items-center gap-1 ${navClass(isAbout)}`}>
                                            Tentang Kami <Chevron open={openMenu === 'about'} />
                                        </button>
                                        {openMenu === 'about' && <div className="absolute left-0 top-full mt-2 w-60 rounded-xl border border-slate-200 bg-white p-2 shadow-card">{pageLinks(aboutPages)}</div>}
                                    </div>
                                    <Link href="/berita" aria-current={isNews ? 'page' : undefined} className={navClass(isNews)}>Berita</Link>
                                    <div className="relative">
                                        <button type="button" onClick={() => toggleMenu('pages')} aria-expanded={openMenu === 'pages'} className={`flex min-h-11 items-center gap-1 ${navClass(isCustom)}`}>
                                            Laman <Chevron open={openMenu === 'pages'} />
                                        </button>
                                        {openMenu === 'pages' && <div className="absolute left-0 top-full mt-2 w-60 rounded-xl border border-slate-200 bg-white p-2 shadow-card">{pageLinks(customPages)}</div>}
                                    </div>
                                    <div className="relative">
                                        <button type="button" onClick={() => toggleMenu('archive')} aria-expanded={openMenu === 'archive'} className={`flex min-h-11 items-center gap-1 ${navClass(isArchive)}`}>
                                            Arsip <Chevron open={openMenu === 'archive'} />
                                        </button>
                                        {openMenu === 'archive' && <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-card">{archiveLinks.map(([label, href]) => <Link key={href} href={href} onClick={closeMenus} aria-current={matches(href) ? 'page' : undefined} className={`block rounded-lg px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${matches(href) ? 'bg-emerald-50 font-semibold text-primary' : 'text-slate-700 hover:bg-emerald-50 hover:text-primary'}`}>{label}</Link>)}{archivePages.length > 0 && <div>{pageLinks(archivePages)}</div>}</div>}
                                    </div>
                                    <Link href="/statistik" aria-current={isStats ? 'page' : undefined} className={navClass(isStats)}>Statistik</Link>
                                </>
                            ) : (
                                navItems.map((item, idx) => (
                                    item.type === 'single' ? (
                                        <Link key={idx} href={item.url} aria-current={isActive(item) ? 'page' : undefined} className={navClass(isActive(item))}>
                                            {item.label}
                                        </Link>
                                    ) : (
                                        <div key={idx} className="relative">
                                            <button type="button" onClick={() => toggleMenu(`custom-${idx}`)} aria-expanded={openMenu === `custom-${idx}`} className={`flex min-h-11 items-center gap-1 ${navClass(isActive(item))}`}>
                                                {item.label} <Chevron open={openMenu === `custom-${idx}`} />
                                            </button>
                                            {openMenu === `custom-${idx}` && (
                                                <div className="absolute left-0 top-full mt-2 w-60 rounded-xl border border-slate-200 bg-white p-2 shadow-card">
                                                    {(item.children || []).map((child, childIdx) => (
                                                        <Link
                                                            key={childIdx}
                                                            href={child.url}
                                                            onClick={closeMenus}
                                                            aria-current={matches(child.url) ? 'page' : undefined}
                                                            className={`block rounded-lg px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${matches(child.url) ? 'bg-emerald-50 font-semibold text-primary' : 'text-slate-700 hover:bg-emerald-50 hover:text-primary'}`}
                                                        >
                                                            {child.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )
                                ))
                            )}
                        </div>

                        <div className="flex items-center gap-1">
                            <ThemeToggle />
                            <button type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-expanded={mobileMenuOpen} aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'} className="grid h-11 w-11 place-items-center rounded-lg text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:hidden">
                                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path strokeLinecap="round" d={mobileMenuOpen ? 'M6 6l12 12M18 6 6 18' : 'M4 6h16M4 12h16M4 18h16'} /></svg>
                            </button>
                        </div>
                    </div>

                    {mobileMenuOpen && (
                        <div className="border-t border-slate-100 py-3 lg:hidden">
                            {useDefaultNav ? (
                                <>
                                    <Link href="/" onClick={closeMenus} className={mobileNavClass(isHome)}>Beranda</Link>
                                    {[
                                        ['about', 'Tentang Kami', aboutPages, isAbout],
                                        ['pages', 'Laman', customPages, isCustom],
                                    ].map(([name, label, pages, active]) => (
                                        <div key={name}>
                                            <button type="button" onClick={() => toggleMenu(name)} aria-expanded={openMenu === name} className={`flex min-h-11 w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${active ? 'bg-emerald-50 text-primary' : 'text-slate-700'}`}>
                                                {label} <Chevron open={openMenu === name} />
                                            </button>
                                            {openMenu === name && <div className="ml-3 border-l border-slate-200 pl-2">{pageLinks(pages)}</div>}
                                        </div>
                                    ))}
                                    <Link href="/berita" onClick={closeMenus} className={mobileNavClass(isNews)}>Berita</Link>
                                    <div>
                                        <button type="button" onClick={() => toggleMenu('archive')} aria-expanded={openMenu === 'archive'} className={`flex min-h-11 w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${isArchive ? 'bg-emerald-50 text-primary' : 'text-slate-700'}`}>Arsip <Chevron open={openMenu === 'archive'} /></button>
                                        {openMenu === 'archive' && <div className="ml-3 border-l border-slate-200 pl-2">{archiveLinks.map(([label, href]) => <Link key={href} href={href} onClick={closeMenus} aria-current={matches(href) ? 'page' : undefined} className={`block min-h-11 rounded-lg px-3 py-2.5 text-sm ${matches(href) ? 'bg-emerald-50 font-semibold text-primary' : 'text-slate-700'}`}>{label}</Link>)}{archivePages.length > 0 && <div className="my-2 border-t border-slate-200 pt-2">{pageLinks(archivePages)}</div>}</div>}
                                    </div>
                                    <Link href="/statistik" onClick={closeMenus} className={mobileNavClass(isStats)}>Statistik</Link>
                                </>
                            ) : (
                                navItems.map((item, idx) => (
                                    item.type === 'single' ? (
                                        <Link key={idx} href={item.url} onClick={closeMenus} className={mobileNavClass(isActive(item))}>
                                            {item.label}
                                        </Link>
                                    ) : (
                                        <div key={idx}>
                                            <button type="button" onClick={() => toggleMenu(`custom-${idx}`)} aria-expanded={openMenu === `custom-${idx}`} className={`flex min-h-11 w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${isActive(item) ? 'bg-emerald-50 text-primary' : 'text-slate-700'}`}>
                                                {item.label} <Chevron open={openMenu === `custom-${idx}`} />
                                            </button>
                                            {openMenu === `custom-${idx}` && (
                                                <div className="ml-3 border-l border-slate-200 pl-2">
                                                    {(item.children || []).map((child, childIdx) => (
                                                        <Link
                                                            key={childIdx}
                                                            href={child.url}
                                                            onClick={closeMenus}
                                                            aria-current={matches(child.url) ? 'page' : undefined}
                                                            className={`block min-h-11 rounded-lg px-3 py-2.5 text-sm ${matches(child.url) ? 'bg-emerald-50 font-semibold text-primary' : 'text-slate-700'}`}
                                                        >
                                                            {child.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )
                                ))
                            )}
                        </div>
                    )}
                </nav>
            </header>

            <main className="flex-1 flex flex-col">
                <motion.div
                    className="flex-1 flex flex-col"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                >
                    {children}
                </motion.div>
            </main>

            <footer className="mt-auto bg-slate-850 text-white">
                <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
                    <div className="md:col-span-1 space-y-6">
                        <div>
                            <p className="text-xl font-extrabold">{siteSettings.site_name || 'SMA XYZ'}</p>
                            <p className="mt-2 max-w-md text-sm leading-6 text-slate-300">
                                {siteSettings.footer_about || siteSettings.site_tagline || 'Berakhlak Mulia, Berprestasi Tinggi, Berwawasan Global'}
                            </p>
                        </div>

                        <div>
                            <p className="font-bold text-sm text-slate-200">Kontak</p>
                            <div className="mt-2 space-y-1 text-sm text-slate-300">
                                <p>{siteSettings.contact_address || 'Jl. Kyai Mojo No. 1, Krian, Sidoarjo'}</p>
                                <p>{siteSettings.contact_phone || '(031) 8971234'}</p>
                                <p>{siteSettings.contact_email || 'info@smaxyz.sch.id'}</p>
                            </div>
                        </div>
                        {(siteSettings.social_instagram || siteSettings.social_facebook || siteSettings.social_youtube || siteSettings.social_tiktok || siteSettings.social_whatsapp || siteSettings.social_twitter || siteSettings.social_linkedin) && (
                            <div>
                                <p className="font-bold text-sm text-slate-200 mb-3">Media Sosial</p>
                                <div className="flex flex-wrap gap-3">
                                    {siteSettings.social_instagram && (
                                        <a href={siteSettings.social_instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-750 text-slate-200 transition hover:bg-primary hover:text-white">
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                                        </a>
                                    )}
                                    {siteSettings.social_facebook && (
                                        <a href={siteSettings.social_facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-750 text-slate-200 transition hover:bg-primary hover:text-white">
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
                                        </a>
                                    )}
                                    {siteSettings.social_youtube && (
                                        <a href={siteSettings.social_youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-750 text-slate-200 transition hover:bg-primary hover:text-white">
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                                        </a>
                                    )}
                                    {siteSettings.social_tiktok && (
                                        <a href={siteSettings.social_tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-750 text-slate-200 transition hover:bg-primary hover:text-white">
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.82.57-1.33 1.54-1.34 2.54-.01.95.42 1.9 1.17 2.48.86.66 2.05.8 3.06.46 1.04-.33 1.83-1.22 2.05-2.28.11-.64.08-1.3.08-1.95V.02z"/></svg>
                                        </a>
                                    )}
                                    {siteSettings.social_whatsapp && (
                                        <a href={siteSettings.social_whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-750 text-slate-200 transition hover:bg-primary hover:text-white">
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                                        </a>
                                    )}
                                    {siteSettings.social_twitter && (
                                        <a href={siteSettings.social_twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter / X" className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-750 text-slate-200 transition hover:bg-primary hover:text-white">
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                                        </a>
                                    )}
                                    {siteSettings.social_linkedin && (
                                        <a href={siteSettings.social_linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-750 text-slate-200 transition hover:bg-primary hover:text-white">
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {(() => {
                        let groups = [];
                        try {
                            groups = JSON.parse(siteSettings.footer_groups || '[]');
                        } catch {
                            groups = [];
                        }
                        return Array.isArray(groups) && groups.length > 0 ? groups.slice(0, 3).filter((g) => g?.title && Array.isArray(g?.links)).map((group, i) => (
                            <div key={i}>
                                <p className="font-bold">{group.title}</p>
                                <div className="mt-3 space-y-2 text-sm text-slate-300">
                                    {group.links.filter((l) => l?.label && l?.url).map((link, j) => (
                                        <a key={j} href={link.url} className="block transition hover:text-white">{link.label}</a>
                                    ))}
                                </div>
                            </div>
                        )) : null;
                    })()}
                </div>
                <div className="border-t border-slate-700 px-4 py-5 text-center text-xs text-slate-400">© {new Date().getFullYear()} {siteSettings.site_name || 'SMA XYZ'}. Hak Cipta Dilindungi.</div>
            </footer>
        </div>
    );
}
