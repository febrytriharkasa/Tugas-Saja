import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PublicLayout from '@/Layouts/PublicLayout';
import Card from '@/Components/Card';
import ChatWidget from '@/Components/ChatWidget';
import { Link } from '@inertiajs/react';

function ArrowLink({ href, children }) {
    return <Link href={href} className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-bold text-primary transition hover:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">{children}<span aria-hidden="true">→</span></Link>;
}

function SectionHeading({ eyebrow, title, href, linkLabel = 'Lihat semua', dark = false }) {
    return (
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <h2 className={`mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl ${dark ? 'text-white' : 'text-slate-900'}`}>{title}</h2>
                <p className={`mt-2 text-xs font-bold uppercase tracking-[0.14em] ${dark ? 'text-emerald-200' : 'text-secondary'}`}>{eyebrow}</p>
            </div>
            {href && <ArrowLink href={href}>{linkLabel}</ArrowLink>}
        </div>
    );
}

function EmptyState({ children }) {
    return <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-sm text-slate-600">{children}</div>;
}

export default function Welcome({ settings = {}, posts = [], announcements = [], agendas = [], achievements = [], galleries = [], facilities = [], staff = [], testimonials = [] }) {
    const slides = [
        {
            tag: settings.hero_slide_1_tag || 'Portal resmi SMALISKA',
            title: settings.hero_slide_1_title || settings.hero_title || 'Membentuk Generasi Rabbani & Berprestasi',
            subtitle: settings.hero_slide_1_subtitle || settings.hero_subtitle || 'Selamat Datang di Portal Resmi SMA Al Islam Krian (SMALISKA). Pendidikan Islam modern berbasis teknologi & akhlakul karimah di Sidoarjo.',
            btnText: settings.hero_slide_1_btn_text || 'Sambutan Kepala Sekolah',
            btnUrl: settings.hero_slide_1_btn_url || '#sambutan',
            image: settings.hero_slide_1_image || settings.hero_background_image || null,
        },
        {
            tag: settings.hero_slide_2_tag || 'Penerimaan Siswa Baru',
            title: settings.hero_slide_2_title || 'Pendaftaran Peserta Didik Baru',
            subtitle: settings.hero_slide_2_subtitle || 'Buka peluang masa depan terbaikmu bersama SMALISKA. Bergabunglah dengan pendidikan Islam modern berwawasan global.',
            btnText: settings.hero_slide_2_btn_text || 'Daftar Sekarang',
            btnUrl: settings.hero_slide_2_btn_url || settings.ppdb_link || 'https://ppdb.smaliska.sch.id',
            image: settings.hero_slide_2_image || null,
        },
    ];

    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const activeSlide = slides[currentSlide];

    return (
        <PublicLayout settings={settings}>
            <section className="relative isolate overflow-hidden bg-slate-850 text-white min-h-[800px] flex items-center">
                {/* Background Images with smooth fade */}
                {slides.map((s, idx) => (
                    s.image ? (
                        <img
                            key={idx}
                            src={s.image}
                            alt={s.title}
                            className={`absolute inset-0 -z-20 h-full w-full object-cover object-center transition-opacity duration-1000 ${idx === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                        />
                    ) : null
                ))}
                
                <div className={`absolute inset-0 -z-10 transition-colors duration-1000 ${activeSlide.image ? 'bg-slate-950/75' : 'bg-primary'}`} />
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/90 via-primary/75 to-primary/35" />

                <div className="mx-auto grid min-h-[800px] max-w-7xl items-center gap-10 px-4 pt-20 sm:px-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)] lg:px-8 lg:pb-20 w-full relative z-10">
                    <div className="max-w-3xl">
                        <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-emerald-200 transition-all duration-700">
                            {activeSlide.tag}
                        </p>
                        <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl transition-all duration-700">
                            {activeSlide.title}
                        </h1>
                        <p className="mt-6 max-w-2xl text-base leading-7 text-emerald-50/90 sm:text-lg transition-all duration-700">
                            {activeSlide.subtitle}
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3 items-center">
                            {activeSlide.btnUrl.startsWith('/') || activeSlide.btnUrl.startsWith('#') ? (
                                <a
                                    href={activeSlide.btnUrl}
                                    className="inline-flex min-h-12 items-center justify-center rounded-lg bg-emerald-200 px-6 py-3 text-sm font-bold text-emerald-950 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary shadow-lg"
                                >
                                    {activeSlide.btnText}
                                </a>
                            ) : (
                                <a
                                    href={activeSlide.btnUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex min-h-12 items-center justify-center rounded-lg bg-emerald-200 px-6 py-3 text-sm font-bold text-emerald-950 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary shadow-lg"
                                >
                                    {activeSlide.btnText}
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Carousel Controls (Arrows and Indicators) */}
                <div className="absolute bottom-16 right-4 sm:right-8 z-20 flex items-center gap-3 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                    <button
                        type="button"
                        onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition text-sm font-bold"
                        aria-label="Slide sebelumnya"
                    >
                        ‹
                    </button>

                    <div className="flex gap-1.5 items-center">
                        {slides.map((_, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => setCurrentSlide(idx)}
                                className={`h-2.5 rounded-full transition-all ${idx === currentSlide ? 'w-6 bg-emerald-300' : 'w-2.5 bg-white/40 hover:bg-white/70'}`}
                                aria-label={`Ke slide ${idx + 1}`}
                            />
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition text-sm font-bold"
                        aria-label="Slide berikutnya"
                    >
                        ›
                    </button>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[{ title: settings.quick_link_1_title || 'Pendaftaran', url: settings.quick_link_1_url || 'https://ppdb.smaliska.sch.id', desc: settings.quick_link_1_desc || 'Portal Resmi Pendaftaran PPDB Online' },
                        { title: settings.quick_link_2_title || 'Yapalis via mobile', url: settings.quick_link_2_url || 'https://mobile.yapalis.or.id', desc: settings.quick_link_2_desc || 'Aplikasi Layanan Mobile Yapalis' },
                        { title: settings.quick_link_3_title || 'Perpustakaan Yapalis', url: settings.quick_link_3_url || 'https://perpus.yapalis.or.id', desc: settings.quick_link_3_desc || 'Layanan Perpustakaan Digital' },
                    ].map((link, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 25 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: idx * 0.1 }}
                        >
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="block group h-full">
                                <Card hover className="p-6 h-full flex flex-col justify-between border-slate-200/80 group-hover:border-primary transition">
                                    <div>
                                        <span className="text-xs font-bold uppercase tracking-wider text-primary">Layanan Pintas</span>
                                        <h3 className="mt-2 text-xl font-extrabold text-slate-900 group-hover:text-primary transition">{link.title}</h3>
                                        <p className="mt-2 text-sm text-slate-600">{link.desc}</p>
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
            </section>

            <section id="berita" className="bg-slate-50 py-16 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <SectionHeading eyebrow="Update terkini seputar sekolah" title="Berita sekolah" href="/berita" />
                    {posts.length ? (
                        <div className="grid gap-6 md:grid-cols-3">
                            {posts.slice(0, 3).map((post, idx) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 25 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                                >
                                    <Card hover className="flex flex-col overflow-hidden h-full">
                                        <Link href={`/berita/${post.slug}`} className="block">
                                            <div className="h-48 w-full bg-slate-100 shrink-0">
                                                {post.featured_image ? <img src={post.featured_image} alt={post.title} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-xs text-slate-400 font-medium">Gambar tidak tersedia</div>}
                                            </div>
                                        </Link>
                                        <div className="flex flex-1 flex-col p-5 justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                                    <span className="font-bold text-primary">{post.category?.name || 'Berita'}</span>
                                                    <span>{post.published_at ? new Date(post.published_at).toLocaleDateString('id-ID') : '-'}</span>
                                                </div>
                                                <h3 className="mt-3 line-clamp-2 text-lg font-bold text-slate-900">
                                                    <Link href={`/berita/${post.slug}`} className="hover:text-primary">{post.title}</Link>
                                                </h3>
                                            </div>
                                            <div className="mt-4">
                                                <ArrowLink href={`/berita/${post.slug}`}>Baca selengkapnya</ArrowLink>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    ) : <EmptyState>Belum ada berita yang diterbitkan.</EmptyState>}
                </div>
            </section>

            <section id="pengumuman" className="bg-white py-16 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <SectionHeading eyebrow="Informasi penting terkini" title="Pengumuman" href="/arsip/pengumuman" />
                    {announcements.length ? (
                        <div className="grid gap-6 md:grid-cols-3">
                            {announcements.slice(0, 3).map((item, idx) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 25 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                                >
                                    <Card hover className="flex flex-col overflow-hidden h-full">
                                        <Link href={`/berita/${item.slug}`} className="block">
                                            <div className="h-48 w-full bg-slate-100 shrink-0">
                                                {item.featured_image ? <img src={item.featured_image} alt={item.title} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-xs text-slate-400 font-medium">Gambar tidak tersedia</div>}
                                            </div>
                                        </Link>
                                        <div className="flex flex-1 flex-col p-5 justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                                    <span className="font-bold text-tertiary">{item.category?.name || 'Pengumuman'}</span>
                                                    <span>{item.published_at ? new Date(item.published_at).toLocaleDateString('id-ID') : '-'}</span>
                                                </div>
                                                <h3 className="mt-3 line-clamp-2 text-lg font-bold text-slate-900">
                                                    <Link href={`/berita/${item.slug}`} className="hover:text-primary">{item.title}</Link>
                                                </h3>
                                            </div>
                                            <div className="mt-4">
                                                <ArrowLink href={`/berita/${item.slug}`}>Baca selengkapnya</ArrowLink>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    ) : <EmptyState>Belum ada pengumuman.</EmptyState>}
                </div>
            </section>

            <section id="agenda" className="bg-slate-50 py-16 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <SectionHeading eyebrow="Jadwal kegiatan terkini" title="Agenda sekolah" href="/arsip/agenda" />
                    {agendas.length ? (
                        <div className="grid gap-6 md:grid-cols-3">
                            {agendas.slice(0, 3).map((agenda, idx) => {
                                const dateVal = agenda.metadata?.event_date || agenda.published_at;
                                return (
                                    <motion.div
                                        key={agenda.id}
                                        initial={{ opacity: 0, y: 25 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: idx * 0.1 }}
                                    >
                                        <Card hover className="flex flex-col overflow-hidden h-full">
                                            <Link href={`/berita/${agenda.slug}`} className="block">
                                                <div className="h-48 w-full bg-slate-100 shrink-0">
                                                    {agenda.featured_image ? <img src={agenda.featured_image} alt={agenda.title} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-xs text-slate-400 font-medium">Gambar tidak tersedia</div>}
                                                </div>
                                            </Link>
                                            <div className="flex flex-1 flex-col p-5 justify-between">
                                                <div>
                                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                                        <span className="font-bold text-secondary">{agenda.category?.name || 'Agenda'}</span>
                                                        <span>{dateVal ? new Date(dateVal).toLocaleDateString('id-ID') : '-'}</span>
                                                    </div>
                                                    <h3 className="mt-3 line-clamp-2 text-lg font-bold text-slate-900">
                                                        <Link href={`/berita/${agenda.slug}`} className="hover:text-primary">{agenda.title}</Link>
                                                    </h3>
                                                    {agenda.metadata && Object.keys(agenda.metadata).length > 0 && (
                                                        <div className="mt-3 flex flex-wrap gap-1.5 text-xs text-slate-500">
                                                            {Object.entries(agenda.metadata).map(([k, v]) => (
                                                                <span key={k} className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{String(v)}</span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="mt-4">
                                                    <ArrowLink href={`/berita/${agenda.slug}`}>Baca selengkapnya</ArrowLink>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ) : <EmptyState>Belum ada agenda sekolah.</EmptyState>}
                </div>
            </section>

            <section id="prestasi" className="bg-white py-16 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <SectionHeading eyebrow="Prestasi terbaru yang berhasil kami raih" title="Prestasi terbaru" href="/arsip/prestasi" />
                    {achievements.length ? (
                        <div className="grid gap-6 md:grid-cols-3">
                            {achievements.slice(0, 6).map((ach, idx) => (
                                <motion.div
                                    key={ach.id}
                                    initial={{ opacity: 0, y: 25 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                                >
                                    <Card hover className="flex flex-col overflow-hidden h-full">
                                        <Link href={`/berita/${ach.slug}`} className="block">
                                            <div className="h-48 w-full bg-slate-100 shrink-0">
                                                {ach.featured_image ? <img src={ach.featured_image} alt={ach.title} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-xs text-slate-400 font-medium">Gambar tidak tersedia</div>}
                                            </div>
                                        </Link>
                                        <div className="flex flex-1 flex-col p-5 justify-between">
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-wide text-tertiary">{ach.category?.name || 'Prestasi'}</p>
                                                <h3 className="mt-2 line-clamp-2 text-lg font-bold text-slate-900">
                                                    <Link href={`/berita/${ach.slug}`} className="hover:text-primary">{ach.title}</Link>
                                                </h3>
                                                {ach.metadata && Object.keys(ach.metadata).length > 0 && (
                                                    <div className="mt-3 flex flex-wrap gap-1.5 text-xs text-slate-600">
                                                        {Object.entries(ach.metadata).map(([k, v]) => (
                                                            <span key={k} className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{String(v)}</span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="mt-4">
                                                <ArrowLink href={`/berita/${ach.slug}`}>Baca selengkapnya</ArrowLink>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    ) : <EmptyState>Belum ada prestasi yang diterbitkan.</EmptyState>}
                </div>
            </section>

            <section id="galeri" className="bg-slate-50 py-16 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <SectionHeading eyebrow="Lihat kegiatan kami ketika di sekolah" title="Galeri aktivitas" href="/arsip/galeri" />
                    {galleries.length ? (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            {galleries.slice(0, 8).map((item, idx) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                                >
                                    <Card className="overflow-hidden">
                                        <div className="flex aspect-square items-end bg-slate-200 p-3">
                                            <span className="line-clamp-2 text-xs font-bold text-slate-700">{item.title}</span>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    ) : <EmptyState>Belum ada dokumentasi galeri.</EmptyState>}
                </div>
            </section>

            <section id="fasilitas" className="bg-white py-16 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <SectionHeading eyebrow="Untuk menunjang kegiatan belajar mengajar" title="Fasilitas sekolah" href="/laman/fasilitas" />
                    {facilities.length ? (
                        <div className="grid gap-6 md:grid-cols-3">
                            {facilities.slice(0, 6).map((facility, idx) => (
                                <motion.div
                                    key={facility.id}
                                    initial={{ opacity: 0, y: 25 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                                >
                                    <Card hover className="overflow-hidden flex flex-col h-full">
                                        <Link href={`/berita/${facility.slug}`} className="block">
                                            <div className="aspect-[16/9] bg-slate-100">
                                                {facility.featured_image ? <img src={facility.featured_image} alt={facility.title} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-xs text-slate-400 font-medium">Gambar tidak tersedia</div>}
                                            </div>
                                        </Link>
                                        <div className="p-5 flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="font-bold text-slate-900">
                                                    <Link href={`/berita/${facility.slug}`} className="hover:text-primary">{facility.title}</Link>
                                                </h3>
                                            </div>
                                            <div className="mt-3">
                                                <ArrowLink href={`/berita/${facility.slug}`}>Lihat detail</ArrowLink>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    ) : <EmptyState>Belum ada data fasilitas.</EmptyState>}
                </div>
            </section>

            <section id="gtk" className="bg-slate-50 py-16 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <SectionHeading eyebrow="Tenaga pendidik profesional" title="Guru dan tenaga kependidikan" href="/laman/guru-tendik" />
                    {staff.length ? (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            {staff.slice(0, 8).map((person, idx) => (
                                <motion.div
                                    key={person.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.35, delay: idx * 0.05 }}
                                >
                                    <Card hover className="p-4 text-center h-full">
                                        <div className="mx-auto mb-3 grid h-20 w-20 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                                            {person.name.charAt(0)}
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-900">{person.name}</h3>
                                        <p className="mt-1 text-xs leading-5 text-slate-600">{person.role}</p>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    ) : <EmptyState>Belum ada data Guru dan Tendik.</EmptyState>}
                </div>
            </section>

            <section id="alumni" className="bg-primary py-16 text-white sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <SectionHeading eyebrow="Kisah alumni" title="Cerita dari alumni SMALISKA" dark />
                    <div className="grid gap-6 md:grid-cols-2">
                        {testimonials.length ? (
                            testimonials.slice(0, 4).map((testi, idx) => (
                                <motion.div
                                    key={testi.id}
                                    initial={{ opacity: 0, y: 25 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                                >
                                    <Card hover className="bg-white p-6 h-full">
                                        <p className="text-sm italic leading-7 text-slate-600">“{testi.content}”</p>
                                        <p className="mt-5 font-bold text-slate-900">{testi.title}</p>
                                        <p className="mt-1 text-xs text-slate-600">Alumni {testi.metadata?.graduation_year || '-'} · {testi.metadata?.current_profession || 'Profesi belum diisi'}</p>
                                    </Card>
                                </motion.div>
                            ))
                        ) : <div className="md:col-span-2"><EmptyState>Belum ada cerita alumni.</EmptyState></div>}
                    </div>
                </div>
            </section>

            <ChatWidget />
        </PublicLayout>
    );
}
