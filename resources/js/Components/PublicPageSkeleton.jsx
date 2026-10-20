const PULSE = 'animate-pulse motion-reduce:animate-none';
const CARD_GRID = 'grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4';

function Block({ className = '', dark = false }) {
    return <span aria-hidden="true" className={`block rounded-md ${dark ? 'bg-white/15' : 'bg-slate-200/80'} ${className}`} />;
}

function TextLines({ lines = 3, className = '' }) {
    const widths = ['w-full', 'w-11/12', 'w-10/12', 'w-9/12', 'w-8/12'];

    return (
        <div className={`space-y-2.5 ${className}`}>
            {Array.from({ length: lines }).map((_, index) => (
                <Block key={index} className={`h-3.5 ${widths[index % widths.length]}`} />
            ))}
        </div>
    );
}

function BreadcrumbSkeleton() {
    return (
        <div className="w-full border-b border-slate-200/60 bg-slate-50 py-2">
            <div className="mx-auto flex max-w-7xl items-center gap-1.5 px-4 sm:px-6 lg:px-8">
                <Block className="h-3 w-14" />
                <Block className="h-3 w-2" />
                <Block className="h-3 w-24" />
            </div>
        </div>
    );
}

function PostCardSkeleton() {
    return (
        <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-card">
            <Block className="aspect-[16/10] w-full rounded-none" />
            <div className="space-y-3 p-4 sm:p-5">
                <div className="flex items-center gap-2">
                    <Block className="h-2.5 w-16" />
                    <Block className="h-2.5 w-12" />
                </div>
                <Block className="h-4 w-11/12" />
                <Block className="h-4 w-8/12" />
                <Block className="h-3 w-24" />
                <Block className="h-4 w-32" />
            </div>
        </div>
    );
}

function CardGrid({ count = 8 }) {
    return (
        <div className={CARD_GRID}>
            {Array.from({ length: count }).map((_, index) => (
                <PostCardSkeleton key={index} />
            ))}
        </div>
    );
}

function ArchiveSkeleton() {
    return (
        <>
            <BreadcrumbSkeleton />
            <section className="bg-slate-50 py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div className="space-y-3">
                            <Block className="h-8 w-48 sm:w-64" />
                            <Block className="h-3 w-40" />
                        </div>
                    </div>
                    <CardGrid />
                </div>
            </section>
        </>
    );
}

function SearchSkeleton() {
    return (
        <>
            <BreadcrumbSkeleton />
            <section className="bg-slate-50 py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div className="space-y-3">
                            <Block className="h-8 w-64 sm:w-80" />
                            <Block className="h-3 w-40" />
                        </div>
                        <div className="flex w-full max-w-md gap-2">
                            <Block className="h-11 flex-1 rounded-lg" />
                            <Block className="h-11 w-16 rounded-lg" />
                        </div>
                    </div>
                    <div className="mb-6 flex items-center gap-3">
                        <Block className="h-4 w-16" />
                        <Block className="h-9 w-44 rounded-lg" />
                    </div>
                    <CardGrid />
                </div>
            </section>
        </>
    );
}

function HomeSkeleton() {
    return (
        <>
            <section className="relative flex aspect-[4/3] w-full items-center overflow-hidden bg-slate-900 sm:aspect-[16/7] sm:min-h-[24rem] sm:py-10 lg:min-h-[30rem] lg:py-16">
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl space-y-4">
                        <Block dark className="h-2.5 w-32" />
                        <Block dark className="h-10 w-full max-w-xl sm:h-14" />
                        <Block dark className="h-10 w-10/12 max-w-lg sm:h-14" />
                        <div className="space-y-2 pt-2">
                            <Block dark className="h-3.5 w-full max-w-xl" />
                            <Block dark className="h-3.5 w-8/12 max-w-md" />
                        </div>
                        <Block dark className="mt-4 h-11 w-36 rounded-lg" />
                    </div>
                </div>
            </section>

            <section className="relative z-20 mx-auto -mt-14 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="rounded-2xl bg-white p-6 shadow-card">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="flex items-start gap-4 rounded-xl border border-slate-200/80 p-4">
                                <Block className="h-11 w-11 shrink-0 rounded-lg" />
                                <div className="w-full space-y-2.5">
                                    <Block className="h-4 w-8/12" />
                                    <Block className="h-3 w-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
                <div className="mb-8 flex items-end justify-between gap-4">
                    <div className="space-y-3">
                        <Block className="h-7 w-56 sm:h-8" />
                        <Block className="h-3 w-40" />
                    </div>
                    <Block className="h-9 w-24 rounded-lg" />
                </div>
                <CardGrid count={4} />
            </section>

            <section className="bg-slate-50 py-12 sm:py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 flex items-end justify-between gap-4">
                        <div className="space-y-3">
                            <Block className="h-7 w-48 sm:h-8" />
                            <Block className="h-3 w-36" />
                        </div>
                        <Block className="h-9 w-24 rounded-lg" />
                    </div>
                    <CardGrid count={4} />
                </div>
            </section>
        </>
    );
}

function PostSkeleton() {
    return (
        <>
            <BreadcrumbSkeleton />
            <div className="w-full max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-12">
                    <div className="lg:col-span-8">
                        <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-card sm:p-8">
                            <Block className="h-6 w-24 rounded-full" />
                            <div className="mt-4 space-y-3">
                                <Block className="h-8 w-full" />
                                <Block className="h-8 w-9/12" />
                            </div>
                            <div className="mt-4 flex flex-wrap gap-3">
                                <Block className="h-3 w-24" />
                                <Block className="h-3 w-20" />
                                <Block className="h-3 w-16" />
                            </div>
                            <Block className="mt-6 aspect-video w-full rounded-xl" />
                            <TextLines lines={8} className="mt-6" />
                        </div>
                    </div>
                    <aside className="flex flex-col gap-6 lg:col-span-4">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
                            <Block className="h-5 w-40" />
                            <div className="mt-4 flex gap-2">
                                <Block className="h-10 flex-1 rounded-lg" />
                                <Block className="h-10 w-16 rounded-lg" />
                            </div>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
                            <Block className="h-5 w-44" />
                            <div className="mt-4 space-y-4">
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <div key={index} className="flex gap-3">
                                        <Block className="h-20 w-24 shrink-0 rounded-xl" />
                                        <div className="flex-1 space-y-2.5 pt-1">
                                            <Block className="h-3.5 w-full" />
                                            <Block className="h-3.5 w-10/12" />
                                            <Block className="h-3 w-16" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </>
    );
}

function PageSkeleton() {
    return (
        <>
            <BreadcrumbSkeleton />
            <div className="w-full max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="mb-4">
                    <Block className="h-3 w-28" />
                </div>
                <div className="space-y-6 rounded-xl border border-slate-200/80 bg-white p-8 shadow-card">
                    <Block className="h-9 w-9/12" />
                    <Block className="aspect-[16/7] w-full rounded-xl" />
                    <TextLines lines={7} />
                </div>
            </div>
        </>
    );
}

function StatisticsSkeleton() {
    return (
        <>
            <BreadcrumbSkeleton />
            <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="space-y-3">
                    <Block className="h-8 w-64 sm:w-72" />
                    <Block className="h-3 w-56 sm:w-64" />
                </div>
                <div className="mt-6 grid gap-6 md:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div key={index} className="rounded-xl border border-slate-200/80 bg-white p-6 text-center shadow-card">
                            <Block className="mx-auto h-12 w-12 rounded-lg" />
                            <Block className="mx-auto mt-3 h-8 w-16" />
                            <Block className="mx-auto mt-2 h-3 w-24" />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

const VARIANTS = {
    home: HomeSkeleton,
    archive: ArchiveSkeleton,
    search: SearchSkeleton,
    post: PostSkeleton,
    page: PageSkeleton,
    statistics: StatisticsSkeleton,
};

export function publicSkeletonVariant(pathname, archiveSlugs = []) {
    const path = pathname.replace(/\/+$/, '') || '/';

    if (path === '/') return 'home';
    if (path === '/cari') return 'search';
    if (path === '/statistik') return 'statistics';
    if (path === '/berita' || path === '/pengumuman' || path === '/agenda' || path === '/prestasi' || path === '/galeri') return 'archive';
    if (archiveSlugs.includes(path)) return 'archive';
    if (path.split('/').filter(Boolean).length >= 2) return 'post';

    return 'page';
}

export default function PublicPageSkeleton({ variant = 'page' }) {
    const Variant = VARIANTS[variant] ?? PageSkeleton;

    return (
        <div className="flex-1" role="status" aria-live="polite">
            <span className="sr-only">Memuat halaman</span>
            <div className={`${PULSE} min-h-[60vh]`}>
                <Variant />
            </div>
        </div>
    );
}
