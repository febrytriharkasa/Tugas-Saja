import { Link, usePage } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    const { settings = {} } = usePage().props;
    const siteName = settings.site_name || 'SMA XYZ';
    const siteLogo = settings.site_logo;
    const portalText = settings.site_portal_text || `Portal resmi ${siteName}`;
    const initials = siteName
        .split(/\s+/)
        .map((word) => word[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
    const contactAddress = settings.contact_address;

    const brandMark = siteLogo ? (
        <img src={siteLogo} alt={siteName} className="h-12 w-12 rounded-lg object-contain" />
    ) : (
        <span className="grid h-12 w-12 place-items-center rounded-lg bg-white text-lg font-extrabold text-primary">{initials}</span>
    );

    return (
        <main className="min-h-screen bg-canvas lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(28rem,0.95fr)]">
            <section className="relative hidden overflow-hidden bg-primary lg:flex lg:min-h-screen lg:flex-col lg:justify-between lg:p-12 xl:p-16">
                <div className="absolute inset-y-0 right-0 w-px bg-white/20" />
                <Link href="/" className="relative inline-flex w-fit items-center gap-4 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-primary">
                    {brandMark}
                    <span>
                        <span className="block text-lg font-bold tracking-tight text-white">{siteName}</span>
                        <span className="block text-sm text-emerald-100">{portalText}</span>
                    </span>
                </Link>

                <div className="relative max-w-xl pb-8">
                    <p className="mb-5 text-sm font-bold tracking-wide text-emerald-100">AKSES PORTAL SEKOLAH</p>
                    <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white xl:text-5xl">
                        Kelola informasi sekolah dalam satu ruang kerja.
                    </h1>
                    <p className="mt-6 max-w-lg text-base leading-7 text-emerald-50/90">
                        Masuk untuk mengelola berita, agenda, prestasi, fasilitas, cerita alumni, dan data sekolah.
                    </p>
                </div>

                <p className="relative text-xs text-emerald-100/80">{siteName}, {contactAddress}</p>
            </section>

            <section className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-8 lg:px-12">
                <div className="w-full max-w-md">
                    <Link href="/" className="mb-10 inline-flex items-center gap-3 rounded-lg lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                        {siteLogo ? (
                            <img src={siteLogo} alt={siteName} className="h-11 w-11 rounded-lg object-contain" />
                        ) : (
                            <span className="grid h-11 w-11 place-items-center rounded-lg bg-primary text-base font-extrabold text-white">{initials}</span>
                        )}
                        <span>
                            <span className="block font-bold tracking-tight text-slate-900">{siteName}</span>
                            <span className="block text-xs text-slate-600">{portalText}</span>
                        </span>
                    </Link>

                    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-card sm:p-8">
                        {children}
                    </div>

                    <p className="mt-6 text-center text-xs leading-5 text-slate-600">
                        Dengan melanjutkan, Anda menyetujui penggunaan akun sesuai kebijakan sekolah.
                    </p>
                </div>
            </section>
        </main>
    );
}
