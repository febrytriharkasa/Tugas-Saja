import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PublicLayout from '@/Layouts/PublicLayout';
import Card from '@/Components/Card';
import ChatWidget from '@/Components/ChatWidget';
import MediaPreviewModal from '@/Components/MediaPreviewModal';
import { Link } from '@inertiajs/react';
import { youtubeThumbnailUrl } from '@/lib/postBlocks';
import { postUrl } from '@/lib/postUrl';

function ArrowLink({ href, children }) {
    return <Link href={href} className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-bold text-primary transition hover:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">{children}<span aria-hidden="true">→</span></Link>;
}

function SectionHeading({ eyebrow, title, href, linkLabel = 'Lihat semua', dark = false }) {
    return (
        <div className="mb-8 flex items-end justify-between gap-4">
            <div className="flex-1">
                <h2 className={`mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl ${dark ? 'text-white' : 'text-slate-900'}`}>{title}</h2>
                {eyebrow && <p className={`mt-2 text-xs font-bold uppercase tracking-[0.14em] ${dark ? 'text-emerald-200' : 'text-secondary'}`}>{eyebrow}</p>}
            </div>
            {href && (
                <>
                    <Link href={href} className="sm:hidden inline-flex items-center justify-center w-10 h-10 shrink-0 rounded-lg border border-slate-300 bg-white text-lg font-bold text-slate-600 hover:border-primary hover:text-primary transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                        →
                    </Link>
                    <span className="hidden sm:inline-flex">
                        <ArrowLink href={href}>{linkLabel}</ArrowLink>
                    </span>
                </>
            )}
        </div>
    );
}

function EmptyState({ children }) {
    return <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-sm text-slate-600">{children}</div>;
}

export function HorizontalRail({ label, children }) {
    const railRef = useRef(null);

    const scrollRail = (direction) => {
        const rail = railRef.current;
        if (rail) {
            rail.scrollBy({ left: direction * rail.clientWidth, behavior: 'smooth' });
        }
    };

    return (
        <div>
            <div
                ref={railRef}
                role="region"
                aria-label={label}
                tabIndex={0}
                className="flex snap-x snap-mandatory gap-6 overflow-x-auto overflow-y-hidden pb-2 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
                {children}
            </div>
            <div className="mt-4 flex justify-end gap-2">
                <button
                    type="button"
                    onClick={() => scrollRail(-1)}
                    aria-label={`Geser ${label} ke kiri`}
                    className="grid h-11 w-11 place-items-center rounded-lg border border-slate-300 bg-white text-lg font-bold text-slate-700 transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                    ‹
                </button>
                <button
                    type="button"
                    onClick={() => scrollRail(1)}
                    aria-label={`Geser ${label} ke kanan`}
                    className="grid h-11 w-11 place-items-center rounded-lg border border-slate-300 bg-white text-lg font-bold text-slate-700 transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                    ›
                </button>
            </div>
        </div>
    );
}

function formatPostDate(post) {
    const value = post.metadata?.event_date || post.metadata?.tanggal_agenda || post.published_at;
    return value ? new Date(value).toLocaleDateString('id-ID') : '-';
}

function PostCard({ post, delay = 0 }) {
    const thumbnail = post.media_type === 'video' ? youtubeThumbnailUrl(post.video_url) : post.featured_image;

    return (
        <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay }}
        >
            <Card hover className="flex flex-col overflow-hidden h-full">
                <Link href={postUrl(post)} className="block">
                    <div className="relative aspect-[16/9] sm:aspect-[16/10] overflow-hidden bg-slate-100 shrink-0">
                        {thumbnail ? (
                            <div className="relative h-full w-full">
                                <img src={thumbnail} alt={post.title} className="h-full w-full object-cover" />
                                {post.media_type === 'video' && (
                                    <span className="absolute inset-0 flex items-center justify-center bg-slate-900/35" aria-hidden="true">
                                        <svg className="h-9 w-9 text-white drop-shadow" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </span>
                                )}
                            </div>
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-slate-400 font-medium">Gambar tidak tersedia</div>
                        )}
                    </div>
                </Link>
                <div className="flex flex-1 flex-col p-3.5 justify-between sm:p-5">
                    <div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-600 sm:text-xs">
                            <span className="font-bold text-primary">{post.category?.name || 'Konten'}</span>
                            <span>{formatPostDate(post)}</span>
                        </div>
                        <h3 className="mt-1.5 line-clamp-2 break-words text-sm font-bold text-slate-900 sm:mt-3 sm:text-lg">
                            <Link href={postUrl(post)} className="hover:text-primary">{post.title}</Link>
                        </h3>
                        {post.user?.name && (
                            <p className="mt-1 break-words text-[10px] text-slate-500 sm:mt-2 sm:text-xs">
                                <span className="font-semibold text-slate-700">{post.user.name}</span>
                            </p>
                        )}
                    </div>
                    <div className="mt-3 sm:mt-4">
                        <ArrowLink href={postUrl(post)}>Baca selengkapnya</ArrowLink>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}

function PostSection({ id, eyebrow, title, href, posts, tone = 'plain' }) {
    return (
        <section id={id} className={tone === 'muted' ? 'bg-slate-50 py-12 sm:py-20' : 'bg-white py-12 sm:py-20'}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <SectionHeading eyebrow={eyebrow} title={title} href={href} />
                {posts.length ? (
                    <HorizontalRail label={title}>
                        {posts.slice(0, 8).map((post, idx) => (
                            <div key={post.id} className="w-full shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)] xl:w-[calc((100%-4.5rem)/4)]">
                                <PostCard post={post} delay={idx * 0.1} />
                            </div>
                        ))}
                    </HorizontalRail>
                ) : <EmptyState>Belum ada konten pada kategori ini.</EmptyState>}
            </div>
        </section>
    );
}

function AlumniSection({ id, title, href, posts }) {
    return (
        <section id={id} className="bg-primary py-16 text-white sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <SectionHeading eyebrow="Kisah alumni" title={title} href={href} dark />
                <div>
                    {posts.length ? (
                        <HorizontalRail label={title}>
                        {posts.slice(0, 8).map((testi, idx) => (
                            <motion.div
                                key={testi.id}
                                className="w-full shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)] xl:w-[calc((100%-4.5rem)/4)]"
                                initial={{ opacity: 0, y: 25 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: idx * 0.1 }}
                            >
                                <Card hover className="bg-white p-4 h-full sm:p-6">
                                    <p className="break-words text-xs italic leading-6 text-slate-600 sm:text-sm sm:leading-7">“{testi.content}”</p>
                                    <p className="mt-3 break-words text-sm font-bold text-slate-900 sm:mt-5 sm:text-base">{testi.title}</p>
                                    <p className="mt-1 break-words text-[11px] text-slate-600 sm:text-xs">Alumni {testi.metadata?.graduation_year || '-'} · {testi.metadata?.current_profession || 'Profesi belum diisi'}</p>
                                </Card>
                            </motion.div>
                        ))}
                        </HorizontalRail>
                    ) : <EmptyState>Belum ada cerita alumni.</EmptyState>}
                </div>
            </div>
        </section>
    );
}

export default function Welcome({ settings = {}, posts = [], homeSections = [], galleries = [], staff = [] }) {
    const slides = [
        {
            tag: settings.hero_slide_1_tag || 'Portal resmi SMA XYZ',
            title: settings.hero_slide_1_title || settings.hero_title || 'Membentuk Generasi Rabbani & Berprestasi',
            btnText: settings.hero_slide_1_btn_text || 'Sambutan Kepala Sekolah',
            btnUrl: settings.hero_slide_1_btn_url || '#sambutan',
            image: settings.hero_slide_1_image || settings.hero_background_image || null,
        },
        {
            tag: settings.hero_slide_2_tag || 'Penerimaan Siswa Baru',
            title: settings.hero_slide_2_title || 'Pendaftaran Peserta Didik Baru',
            btnText: settings.hero_slide_2_btn_text || 'Daftar Sekarang',
            btnUrl: settings.hero_slide_2_btn_url || settings.ppdb_link || 'https://ppdb.smaxyz.sch.id',
            image: settings.hero_slide_2_image || null,
        },
    ];

    const [currentSlide, setCurrentSlide] = useState(0);
    const [previewItem, setPreviewItem] = useState(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const activeSlide = slides[currentSlide];

    const toneFor = (index) => (index % 2 === 0 ? 'muted' : 'plain');
    const galeriIndex = homeSections.length + 1;
    const gtkIndex = homeSections.length + 2;

    return (
        <PublicLayout settings={settings}>
            {/* Hero section dibuat lebih compact: aspect-[4/3] di mobile agar lebih pendek, padding dan min-h dikurangi di tablet/desktop */}
            <section className="relative isolate overflow-hidden bg-slate-900 text-white flex items-center w-full aspect-[4/3] sm:aspect-[16/7] sm:py-10 lg:py-16 sm:min-h-[24rem] lg:min-h-[30rem]">
                
                {/* Background Images with smooth fade */}
                {slides.map((s, idx) => (
                    s.image ? (
                        <img
                            key={idx}
                            src={s.image}
                            alt={s.title}
                            // object-cover akan mengisi pas kotak aspect-[4/3] tanpa memanjangkan gambar berlebihan
                            className={`absolute inset-0 -z-20 h-full w-full object-cover object-center transition-opacity duration-1000 ${
                                idx === currentSlide ? 'opacity-100' : 'opacity-0'
                            }`}
                        />
                    ) : null
                ))}

                {/* Gelap transparan overlay */}
                <div className={`absolute inset-0 -z-10 transition-colors duration-1000 ${activeSlide.image ? 'bg-slate-950/70' : 'bg-primary'}`} />

                {/* HAPUS padding atas/bawah (pt-16, pb-12) yang besar di mobile agar teks terpusat rapi di kotak yang lebih kecil */}
                <div className="mx-auto grid w-full max-w-7xl items-center gap-4 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)] relative z-10">
                    <div className="max-w-3xl flex items-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSlide}
                                className="w-full"
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={{
                                    hidden: {},
                                    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
                                    exit: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
                                }}
                            >
                                <motion.p
                                    variants={{
                                        hidden: { opacity: 0, x: -50 },
                                        visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
                                        exit: { opacity: 0, x: 50, transition: { duration: 0.3, ease: 'easeIn' } },
                                    }}
                                    // Jarak margin diperkecil (mb-3 menjadi mb-1.5 di mobile)
                                    className="mb-1.5 sm:mb-3 text-[9px] sm:text-xs font-bold uppercase tracking-[0.18em] text-emerald-200"
                                >
                                    {activeSlide.tag}
                                </motion.p>
                                <motion.h1
                                    variants={{
                                        hidden: { opacity: 0, x: -60 },
                                        visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: 'easeOut' } },
                                        exit: { opacity: 0, y: -40, transition: { duration: 0.3, ease: 'easeIn' } },
                                    }}
                                    // Ukuran font disesuaikan agar tidak memakan terlalu banyak baris
                                    className="max-w-3xl break-words text-xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl"
                                >
                                    {activeSlide.title}
                                </motion.h1>
                                <motion.p
                                    variants={{
                                        hidden: { opacity: 0, x: -50 },
                                        visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: 'easeOut' } },
                                        exit: { opacity: 0, y: 35, transition: { duration: 0.3, ease: 'easeIn' } },
                                    }}
                                    // Margin top diperkecil
                                    className="mt-2 sm:mt-4 max-w-2xl break-words text-[13px] leading-snug text-emerald-50/90 sm:text-lg sm:leading-6"
                                >
                                    {activeSlide.subtitle}
                                </motion.p>
                                <motion.div
                                    variants={{
                                        hidden: { opacity: 0, y: 40 },
                                        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
                                        exit: { opacity: 0, x: 50, transition: { duration: 0.3, ease: 'easeIn' } },
                                    }}
                                    className="mt-4 sm:mt-6 flex flex-wrap gap-3 items-center"
                                >
                                    <a
                                        href={activeSlide.btnUrl}
                                        target={activeSlide.btnUrl.startsWith('/') ? "_self" : "_blank"}
                                        rel={activeSlide.btnUrl.startsWith('/') ? "" : "noopener noreferrer"}
                                        className="inline-flex min-h-9 sm:min-h-12 items-center justify-center rounded-lg bg-emerald-200 px-4 py-2 sm:px-6 sm:py-3 text-[11px] sm:text-sm font-bold text-emerald-950 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary shadow-lg"
                                    >
                                        {activeSlide.btnText}
                                    </a>
                                </motion.div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Carousel Controls - Posisi disesuaikan agar tidak nabrak di HP */}
                <div className="absolute bottom-3 sm:bottom-16 right-3 sm:right-8 z-20 flex items-center gap-2 sm:gap-3 bg-black/30 px-2 py-1 sm:px-4 sm:py-2 rounded-full border border-white/10">
                    <button
                        type="button"
                        onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                        className="w-6 h-6 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition text-xs font-bold"
                    >
                        ‹
                    </button>

                    <div className="flex gap-1 sm:gap-1.5 items-center">
                        {slides.map((_, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => setCurrentSlide(idx)}
                                className={`h-1.5 sm:h-2 rounded-full transition-all ${idx === currentSlide ? 'w-4 sm:w-6 bg-emerald-300' : 'w-1.5 sm:w-2 bg-white/40 hover:bg-white/70'}`}
                            />
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                        className="w-6 h-6 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition text-xs font-bold"
                    >
                        ›
                    </button>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 relative z-20">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-card">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[{ title: settings.quick_link_1_title || 'Pendaftaran', url: settings.quick_link_1_url || 'https://ppdb.smaxyz.sch.id', desc: settings.quick_link_1_desc || 'Portal Resmi Pendaftaran PPDB Online' },
                        { title: settings.quick_link_2_title || 'SMA XYZ via mobile', url: settings.quick_link_2_url || 'https://mobile.smaxyz.or.id', desc: settings.quick_link_2_desc || 'Aplikasi Layanan Mobile SMA XYZ' },
                        { title: settings.quick_link_3_title || 'Perpustakaan SMA XYZ', url: settings.quick_link_3_url || 'https://perpus.smaxyz.or.id', desc: settings.quick_link_3_desc || 'Layanan Perpustakaan Digital' },
                    ].map((link, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 25 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: idx * 0.1 }}
                        >
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="block group h-full">
                                <Card hover className="p-4 h-full flex flex-col justify-between border-slate-200/80 transition bg-surface-container-low sm:p-6">
                                    <div>
                                        <span className="text-xs font-bold uppercase tracking-wider text-primary">Layanan Pintas</span>
                                        <h3 className="mt-2 break-words text-lg font-extrabold text-slate-900 transition group-hover:text-primary sm:text-xl">{link.title}</h3>
                                        <p className="mt-2 break-words text-sm text-slate-600">{link.desc}</p>
                                    </div>
                                    <div className="mt-4 flex items-center text-sm font-bold text-primary gap-1 group-hover:gap-2 transition-all">
                                        <span>Akses Layanan</span>
                                        <span aria-hidden="true">→</span>
                                    </div>
                                </Card>
                            </a>
                        </motion.div>
                     ))}
                    </div>
                </div>
            </section>

            {/* Berita is permanent: it always leads the home page. */}
            <PostSection
                id="berita"
                eyebrow="Update terkini seputar berita"
                title="Berita Sekolah"
                href="/berita"
                posts={posts}
                tone={toneFor(0)}
            />

            {/* Sections the editor enabled per category, in the order set in Kategori. */}
            {homeSections.map((section, idx) => (
                section.slug === 'cerita-alumni' ? (
                    <AlumniSection
                        key={section.id}
                        id={section.slug}
                        title={section.name}
                        href={`/arsip/${section.slug}`}
                        posts={section.posts}
                    />
                ) : (
                    <PostSection
                        key={section.id}
                        eyebrow={`Update terkini ${section.name}`}
                        id={section.slug}
                        title={section.name}
                        href={`/arsip/${section.slug}`}
                        posts={section.posts}
                        tone={toneFor(idx + 1)}
                    />
                )
            ))}

            {/* Galeri aktivitas and Guru & Tendik are permanent, after the adjustable sections. */}
            <section id="galeri" className={toneFor(galeriIndex) === 'muted' ? 'bg-slate-50 py-12 sm:py-20' : 'bg-white py-12 sm:py-20'}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <SectionHeading eyebrow="Lihat kegiatan kami ketika di sekolah" title="Galeri aktivitas" href="/arsip/galeri" />
                    {galleries.length ? (
                        <HorizontalRail label="Galeri aktivitas">
                            {galleries.slice(0, 8).map((item, idx) => {
                                const thumb = item.media_type === 'video' ? youtubeThumbnailUrl(item.video_url) : item.featured_image;
                                return (
                                <motion.div
                                    key={item.id}
                                    className="w-full shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)] xl:w-[calc((100%-4.5rem)/4)]"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                                >
                                    <Card className="overflow-hidden flex flex-col h-full bg-white group">
                                        <button
                                            type="button"
                                            onClick={() => setPreviewItem(item)}
                                            className="relative aspect-[16/9] sm:aspect-[16/10] w-full bg-slate-100 overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-zoom-in"
                                            aria-label={`Lihat gambar penuh: ${item.title}`}
                                        >
                                            {thumb ? (
                                                <div className="relative h-full w-full">
                                                    <img
                                                        src={thumb}
                                                        alt={item.title}
                                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    />
                                                    {item.media_type === 'video' ? (
                                                        <span className="absolute inset-0 flex items-center justify-center bg-slate-900/35" aria-hidden="true">
                                                            <svg className="h-9 w-9 text-white drop-shadow" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                                        </span>
                                                    ) : (
                                                        <span className="absolute bottom-2 right-2 rounded-md bg-slate-900/60 p-1.5 text-white opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">
                                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16zm-3-8h6m-3-3v6" />
                                                            </svg>
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-xs text-slate-400 font-medium">Gambar tidak tersedia</div>
                                            )}
                                        </button>
                                        <div className="flex flex-1 items-center bg-white p-3">
                                            <Link
                                                href={postUrl(item)}
                                                className="line-clamp-2 break-words text-xs font-bold text-slate-800 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded sm:text-sm"
                                                title={`Buka detail: ${item.title}`}
                                            >
                                                {item.title}
                                            </Link>
                                        </div>
                                    </Card>
                                </motion.div>
                                );
                            })}
                        </HorizontalRail>
                    ) : <EmptyState>Belum ada dokumentasi galeri.</EmptyState>}
                </div>
            </section>

            <section id="gtk" className={toneFor(gtkIndex) === 'muted' ? 'bg-slate-50 py-12 sm:py-20' : 'bg-white py-12 sm:py-20'}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <SectionHeading eyebrow="Tenaga pendidik profesional" title="Guru dan tenaga kependidikan" href="/laman/guru-tendik" />
                    {staff.length ? (
                        <HorizontalRail label="Guru dan tenaga kependidikan">
                            {staff.slice(0, 8).map((person, idx) => (
                                <motion.div
                                    key={person.id}
                                    className="w-full shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)] xl:w-[calc((100%-4.5rem)/4)]"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.35, delay: idx * 0.05 }}
                                >
                                    <Card hover className="p-3 text-center h-full sm:p-4">
                                        <div className="mx-auto mb-2 grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary sm:mb-3 sm:h-20 sm:w-20 sm:text-sm">
                                            {person.name.charAt(0)}
                                        </div>
                                        <h3 className="break-words text-xs font-bold text-slate-900 sm:text-sm">{person.name}</h3>
                                        <p className="mt-0.5 break-words text-[10px] leading-4 text-slate-600 sm:mt-1 sm:text-xs sm:leading-5">{person.role}</p>
                                    </Card>
                                </motion.div>
                            ))}
                        </HorizontalRail>
                    ) : <EmptyState>Belum ada data Guru dan Tendik.</EmptyState>}
                </div>
            </section>

            <ChatWidget />
            <MediaPreviewModal item={previewItem} onClose={() => setPreviewItem(null)} />
        </PublicLayout>
    );
}
