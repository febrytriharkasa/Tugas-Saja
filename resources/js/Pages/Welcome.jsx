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
                <p className={`text-xs font-bold uppercase tracking-[0.14em] ${dark ? 'text-emerald-200' : 'text-secondary'}`}>{eyebrow}</p>
                <h2 className={`mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl ${dark ? 'text-white' : 'text-slate-900'}`}>{title}</h2>
            </div>
            {href && <ArrowLink href={href}>{linkLabel}</ArrowLink>}
        </div>
    );
}

function EmptyState({ children }) {
    return <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-sm text-slate-600">{children}</div>;
}

export default function Welcome({ settings = {}, posts = [], announcements = [], agendas = [], achievements = [], galleries = [], facilities = [], staff = [], testimonials = [] }) {
    const heroTitle = settings.hero_title || 'Membentuk Generasi Rabbani dan Berprestasi';
    const heroSubtitle = settings.hero_subtitle || 'Portal resmi SMA Al Islam Krian untuk informasi sekolah, kegiatan, prestasi, dan PPDB.';
    const principalName = settings.principal_name || 'Kepala SMA Al Islam Krian';
    const heroImage = settings.hero_background_image || null;

    return (
        <PublicLayout settings={settings}>
            <section className="relative isolate overflow-hidden bg-slate-850 text-white">
                {heroImage && <img src={heroImage} alt="Lingkungan SMA Al Islam Krian" className="absolute inset-0 -z-20 h-full w-full object-cover object-center" />}
                <div className={`absolute inset-0 -z-10 ${heroImage ? 'bg-slate-950/75' : 'bg-primary'}`} />
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/90 via-primary/75 to-primary/35" />
                <div className="mx-auto grid min-h-[560px] max-w-7xl items-end gap-10 px-4 pb-16 pt-20 sm:px-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)] lg:px-8 lg:pb-20">
                    <div className="max-w-3xl">
                        <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">Portal resmi SMALISKA</p>
                        <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">{heroTitle}</h1>
                        <p className="mt-6 max-w-2xl text-base leading-7 text-emerald-50/90 sm:text-lg">{heroSubtitle}</p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <a href={settings.ppdb_link || '#'} className="inline-flex min-h-12 items-center justify-center rounded-lg bg-emerald-200 px-5 py-3 text-sm font-bold text-emerald-950 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary">Daftar PPDB Online</a>
                            <a href="#sambutan" className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/60 px-5 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary">Sambutan Kepala Sekolah</a>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-200">Informasi sekolah</p>
                        <div className="mt-5 grid grid-cols-2 gap-4">
                            {[
                                ['Siswa', settings.total_students || '850+'],
                                ['Guru', settings.total_teachers || '45'],
                                ['Tendik', settings.total_staff || '18'],
                                ['Berdiri', settings.year_founded || '1978'],
                            ].map(([label, value]) => <div key={label} className="border-l border-emerald-200/50 pl-3"><p className="text-2xl font-extrabold text-white">{value}</p><p className="mt-1 text-xs text-emerald-100">{label}</p></div>)}
                        </div>
                    </div>
                </div>
            </section>

            <section id="sambutan" className="border-b border-slate-200 bg-white py-16 sm:py-20">
                <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 md:grid-cols-[0.8fr_1.2fr] lg:px-8">
                    <div className="order-2 md:order-1">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-secondary">Sambutan</p>
                        <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">Pendidikan dengan adab dan daya juang</h2>
                        <p className="mt-5 leading-7 text-slate-600">{settings.welcome_message || "Assalamu'alaikum Wr. Wb. Selamat datang di website resmi SMA Al Islam Krian."}</p>
                        <p className="mt-5 font-bold text-primary">{principalName}</p>
                        <p className="text-sm text-slate-600">Kepala SMA Al Islam Krian</p>
                    </div>
                    <div className="order-1 overflow-hidden rounded-2xl bg-slate-100 md:order-2">
                        {heroImage ? <img src={heroImage} alt="Gedung SMA Al Islam Krian" className="aspect-[16/8] w-full object-cover object-center" /> : <div className="flex aspect-[16/8] items-center justify-center bg-primary text-sm font-semibold text-emerald-100">Gambar sambutan belum tersedia</div>}
                    </div>
                </div>
            </section>

            <section id="berita" className="bg-slate-50 py-16 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <SectionHeading eyebrow="Kabar terbaru" title="Berita sekolah" href="/berita" />
                    {posts.length ? <div className="grid gap-6 md:grid-cols-3">{posts.slice(0, 3).map((post) => <Card key={post.id} hover className="flex flex-col"><div className="aspect-[16/9] bg-slate-100">{post.featured_image && <img src={post.featured_image} alt={post.title} className="h-full w-full object-cover" />}</div><div className="flex flex-1 flex-col p-5"><div className="flex items-center gap-2 text-xs text-slate-600"><span className="font-bold text-primary">{post.category?.name || 'Berita'}</span><span>{post.published_at ? new Date(post.published_at).toLocaleDateString('id-ID') : '-'}</span></div><h3 className="mt-3 line-clamp-2 text-lg font-bold text-slate-900"><Link href={`/berita/${post.slug}`} className="hover:text-primary">{post.title}</Link></h3><p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-slate-600">{post.content}</p><ArrowLink href={`/berita/${post.slug}`}>Baca selengkapnya</ArrowLink></div></Card>)}</div> : <EmptyState>Belum ada berita yang diterbitkan.</EmptyState>}
                </div>
            </section>

            <section id="pengumuman" className="bg-white py-16 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <SectionHeading eyebrow="Informasi penting" title="Pengumuman" href="/arsip/pengumuman" />
                    {announcements.length ? <div className="grid gap-4 md:grid-cols-2">{announcements.slice(0, 4).map((item) => <Card key={item.id} hover className="p-5"><div className="flex gap-4"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-amber-100 font-bold text-tertiary">!</div><div><h3 className="font-bold text-slate-900"><Link href={`/berita/${item.slug}`} className="hover:text-primary">{item.title}</Link></h3><p className="mt-1 text-xs text-slate-600">{item.published_at ? new Date(item.published_at).toLocaleDateString('id-ID') : '-'}</p></div></div></Card>)}</div> : <EmptyState>Belum ada pengumuman.</EmptyState>}
                </div>
            </section>

            <section id="agenda" className="bg-slate-50 py-16 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <SectionHeading eyebrow="Jadwal kegiatan" title="Agenda sekolah" href="/arsip/agenda" />
                    {agendas.length ? <div className="space-y-4">{agendas.slice(0, 5).map((agenda) => { const dateVal = agenda.metadata?.event_date || agenda.published_at; return <Card key={agenda.id} hover className="flex gap-4 p-5 sm:gap-6"><div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-primary text-center text-white"><span className="text-2xl font-extrabold">{dateVal ? new Date(dateVal).getDate() : '-'}</span><span className="text-xs uppercase">{dateVal ? new Date(dateVal).toLocaleDateString('id-ID', { month: 'short' }) : ''}</span></div><div className="min-w-0"><h3 className="font-bold text-slate-900"><Link href={`/berita/${agenda.slug}`} className="hover:text-primary">{agenda.title}</Link></h3><p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">{agenda.content}</p>{agenda.metadata?.location && <p className="mt-2 text-xs font-semibold text-secondary">{agenda.metadata.location}</p>}</div></Card>; })}</div> : <EmptyState>Belum ada agenda sekolah.</EmptyState>}
                </div>
            </section>

            <section id="prestasi" className="bg-white py-16 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <SectionHeading eyebrow="Kebanggaan sekolah" title="Prestasi terbaru" href="/arsip/prestasi" />
                    {achievements.length ? <div className="grid gap-6 md:grid-cols-3">{achievements.slice(0, 6).map((ach) => <Card key={ach.id} hover className="p-6"><p className="text-xs font-bold uppercase tracking-wide text-tertiary">{ach.metadata?.rank || 'Prestasi'}</p><h3 className="mt-3 font-bold text-slate-900"><Link href={`/berita/${ach.slug}`} className="hover:text-primary">{ach.title}</Link></h3><p className="mt-2 text-sm text-slate-600">{ach.metadata?.participant_name || ''}</p><p className="mt-4 text-xs font-semibold text-slate-500">{ach.metadata?.year || '-'}</p></Card>)}</div> : <EmptyState>Belum ada prestasi yang diterbitkan.</EmptyState>}
                </div>
            </section>

            <section id="galeri" className="bg-slate-50 py-16 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <SectionHeading eyebrow="Dokumentasi" title="Galeri aktivitas" href="/arsip/galeri" />
                    {galleries.length ? <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">{galleries.slice(0, 8).map((item) => <Card key={item.id} className="overflow-hidden"><div className="flex aspect-square items-end bg-slate-200 p-3"><span className="line-clamp-2 text-xs font-bold text-slate-700">{item.title}</span></div></Card>)}</div> : <EmptyState>Belum ada dokumentasi galeri.</EmptyState>}
                </div>
            </section>

            <section id="fasilitas" className="bg-white py-16 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <SectionHeading eyebrow="Infrastruktur" title="Fasilitas sekolah" href="/laman/fasilitas" />
                    {facilities.length ? <div className="grid gap-6 md:grid-cols-3">{facilities.slice(0, 6).map((facility) => <Card key={facility.id} hover className="overflow-hidden">{facility.featured_image && <img src={facility.featured_image} alt={facility.title} className="aspect-[16/9] w-full object-cover" />}<div className="p-5"><h3 className="font-bold text-slate-900">{facility.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{facility.content}</p></div></Card>)}</div> : <EmptyState>Belum ada data fasilitas.</EmptyState>}
                </div>
            </section>

            <section id="gtk" className="bg-slate-50 py-16 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <SectionHeading eyebrow="Pendidik berdedikasi" title="Guru dan tenaga kependidikan" href="/laman/guru-tendik" />
                    {staff.length ? <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">{staff.slice(0, 8).map((person) => <Card key={person.id} hover className="p-4 text-center"><div className="mx-auto mb-3 grid h-20 w-20 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">{person.name.charAt(0)}</div><h3 className="text-sm font-bold text-slate-900">{person.name}</h3><p className="mt-1 text-xs leading-5 text-slate-600">{person.role}</p></Card>)}</div> : <EmptyState>Belum ada data Guru dan Tendik.</EmptyState>}
                </div>
            </section>

            <section id="alumni" className="bg-primary py-16 text-white sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <SectionHeading eyebrow="Kisah alumni" title="Cerita dari alumni SMALISKA" dark />
                    <div className="grid gap-6 md:grid-cols-2">{testimonials.length ? testimonials.slice(0, 4).map((testi) => <Card key={testi.id} hover className="bg-white p-6"><p className="text-sm italic leading-7 text-slate-600">“{testi.content}”</p><p className="mt-5 font-bold text-slate-900">{testi.title}</p><p className="mt-1 text-xs text-slate-600">Alumni {testi.metadata?.graduation_year || '-'} · {testi.metadata?.current_profession || 'Profesi belum diisi'}</p></Card>) : <div className="md:col-span-2"><EmptyState>Belum ada cerita alumni.</EmptyState></div>}</div>
                </div>
            </section>

            <ChatWidget />
        </PublicLayout>
    );
}
