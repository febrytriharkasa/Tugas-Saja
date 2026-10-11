import { Link, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { blocksFromMetadata } from '@/lib/postBlocks';

function Breadcrumbs({ post }) {
    return (
        <section className="w-full bg-slate-50 py-2 border-b border-slate-200/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex items-center flex-wrap gap-1.5 text-xs text-slate-500 font-medium">
                    <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                        Beranda
                    </Link>
                    {post.category && (
                        <Link href={`/arsip/${post.category.slug}`} className="hover:text-primary transition-colors flex items-center gap-1">
                            <span className="text-slate-300">/</span>
                            <span className="hover:text-primary transition-colors">{post.category.name}</span>
                        </Link>
                    )}
                    <span className="text-slate-300">/</span>
                    <span className="text-primary font-semibold line-clamp-1 max-w-xs md:max-w-md">{post.title}</span>
                </nav>
            </div>
        </section>
    );
}

function MetaChip({ label, value, accentClass = 'bg-emerald-50 text-emerald-700' }) {
    if (!value) {
        return null;
    }
    return (
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${accentClass}`}>
            {label && <span className="opacity-70">{label}:</span>}
            {value}
        </span>
    );
}

function DataTable({ title, description, columns, rows }) {
    if (!Array.isArray(columns) || columns.length === 0 || !Array.isArray(rows) || rows.length === 0) {
        return null;
    }
    return (
        <div className="mt-8">
            {description && (
                <p className="mb-3 text-sm italic text-slate-600 border-l-4 border-primary/40 pl-3">{description}</p>
            )}
            <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
                <div className="bg-primary px-5 py-3">
                    <h3 className="text-sm font-bold text-white">{title || 'Daftar Data'}</h3>
                </div>
                <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                            <th className="px-5 py-3 w-10">#</th>
                            {columns.map((column, index) => (
                                <th key={index} className="whitespace-nowrap px-5 py-3">{column || `Kolom ${index + 1}`}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {rows.map((row, rowIndex) => (
                            <tr key={rowIndex} className={`transition-colors ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-emerald-50/40`}>
                                <td className="px-5 py-3 text-slate-400 font-medium">{rowIndex + 1}</td>
                                {columns.map((_, columnIndex) => (
                                    <td key={columnIndex} className="px-5 py-3 text-slate-700">
                                        {row[columnIndex] || '-'}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    );
}

function FlatMetadata({ metadata, schema }) {
    const labels = Object.fromEntries(
        (Array.isArray(schema) ? schema : [])
            .filter((field) => field?.key && field?.label)
            .map((field) => [field.key, field.label]),
    );
    const flat = Object.entries(metadata || {}).filter(
        ([key, val]) => key !== 'achievement_table' && key !== 'tables' && key !== 'blocks' && val !== null && val !== '',
    );
    if (flat.length === 0) {
        return null;
    }
    return (
        <div className="mt-6 flex flex-wrap gap-2">
            {flat.map(([k, v]) => (
                <MetaChip key={k} label={labels[k] || k} value={String(v)} accentClass="bg-slate-100 text-slate-600" />
            ))}
        </div>
    );
}

export default function PostDetail({ post, relatedPosts = [] }) {
    const publishedDate = post.published_at
        ? new Date(post.published_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
        : null;

    const readingMinutes = Math.max(1, Math.round((post.content || '').split(/\s+/).length / 200));

    const blocks = blocksFromMetadata(post.metadata);

    return (
        <PublicLayout>
            <Breadcrumbs post={post} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    <article className="lg:col-span-8 flex flex-col">
                        <header className="flex flex-col gap-4 pb-6">
                            <div className="flex flex-wrap items-center gap-2">
                                {post.category && (
                                    <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-secondary">{post.category.name}</p>
                                )}
                            </div>

                            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">
                                {post.title}
                            </h1>

                            <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                                        {(post.user?.name || 'H').charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-800">{post.user?.name || 'Humas SMA XYZ'}</span>
                                        <span className="text-xs text-slate-500">Tim Media &amp; Publikasi</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                                    {publishedDate && (
                                        <span className="flex items-center gap-1">
                                            <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                                            {publishedDate}
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                                        {readingMinutes} Menit Baca
                                    </span>
                                </div>
                            </div>
                        </header>

                        {post.featured_image && (
                            <figure className="mb-6">
                                <div className="w-full rounded-2xl overflow-hidden shadow-md bg-slate-100">
                                    <img
                                        src={post.featured_image}
                                        alt={post.title}
                                        className="w-full h-72 sm:h-96 object-cover"
                                    />
                                </div>
                                <figcaption className="mt-2 text-xs text-slate-500 italic px-2">
                                    Dokumentasi — {post.category?.name || 'SMA XYZ'}
                                </figcaption>
                            </figure>
                        )}

                        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-line text-base">
                            {post.content}
                        </div>

                        {blocks.map((block, idx) => {
                            if (block.type === 'text') {
                                return (
                                    <div key={idx} className="mt-6 prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-line text-base">
                                        {block.content}
                                    </div>
                                );
                            }
                            if (block.type === 'table') {
                                return (
                                    <DataTable
                                        key={idx}
                                        title={block.title}
                                        description={block.description}
                                        columns={block.columns}
                                        rows={block.rows}
                                    />
                                );
                            }
                            return null;
                        })}

                        <FlatMetadata metadata={post.metadata} schema={post.category?.metadata_schema} />

                        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50 rounded-2xl p-4">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-bold text-slate-600">Bagikan:</span>
                                {[['WhatsApp', '#'], ['Facebook', '#'], ['Salin Tautan', '#']].map(([label, href]) => (
                                    <a
                                        key={label}
                                        href={href}
                                        className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-primary hover:text-white hover:border-primary transition-colors text-slate-700 text-xs font-medium shadow-sm"
                                    >
                                        {label}
                                    </a>
                                ))}
                            </div>
                            {post.category && (
                                <span className="text-xs text-slate-400">#{post.category.name?.replace(/\s/g, '')}</span>
                            )}
                        </div>

                        {relatedPosts.length > 0 && (
                            <div className="mt-10">
                                <h3 className="text-lg font-bold text-slate-900 mb-4">Artikel Terkait</h3>
                                <div className="grid sm:grid-cols-3 gap-4">
                                    {relatedPosts.map((rel) => (
                                        <Link
                                            key={rel.id}
                                            href={`/berita/${rel.slug}`}
                                            className="group rounded-xl border border-slate-200 bg-white hover:border-primary hover:shadow-md transition-all overflow-hidden flex flex-col"
                                        >
                                            {rel.featured_image ? (
                                                <img src={rel.featured_image} alt={rel.title} className="h-36 w-full object-cover" />
                                            ) : (
                                                <div className="h-36 w-full bg-slate-100 flex items-center justify-center text-xs text-slate-400">Tidak ada gambar</div>
                                            )}
                                            <div className="p-4 flex flex-col gap-1.5 flex-1">
                                                {rel.category && (
                                                    <span className="text-xs font-bold text-primary">{rel.category.name}</span>
                                                )}
                                                <h4 className="text-sm font-bold text-slate-800 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                                                    {rel.title}
                                                </h4>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </article>

                    <aside className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-28">
                        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col gap-4 p-5">
                            <span className="font-bold text-slate-800 text-sm">Cari Informasi</span>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Ketik kata kunci..."
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && e.target.value.trim()) {
                                            router.get('/berita', { search: e.target.value.trim() });
                                        }
                                    }}
                                    className="flex-1 rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                                />
                                <button className="px-4 py-2 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors">
                                    Cari
                                </button>
                            </div>
                        </div>

                        {relatedPosts.length > 0 && (
                            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col gap-4 p-5">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-slate-800 text-sm">Berita Terkait</span>
                                    <Link href="/berita" className="text-xs font-bold text-primary hover:underline">Lihat Semua</Link>
                                </div>
                                <div className="flex flex-col gap-4">
                                    {relatedPosts.map((rel) => (
                                        <Link key={rel.id} href={`/berita/${rel.slug}`} className="flex items-center gap-3 group">
                                            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                                                {rel.featured_image ? (
                                                    <img src={rel.featured_image} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">-</div>
                                                )}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                {rel.published_at && (
                                                    <span className="text-xs text-slate-400">{new Date(rel.published_at).toLocaleDateString('id-ID')}</span>
                                                )}
                                                <span className="text-sm font-semibold text-slate-800 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                                                    {rel.title}
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="rounded-2xl bg-primary text-white shadow-md flex flex-col gap-3 p-5 relative overflow-hidden">
                            <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />
                            <span className="text-xs font-bold text-emerald-200 uppercase tracking-wide">PPDB 2026 / 2027</span>
                            <h4 className="font-bold text-lg leading-tight">Bergabung Bersama Generasi Unggul SMA XYZ</h4>
                            <p className="text-sm text-white/80">Pendaftaran Gelombang 1 telah dibuka. Dapatkan jalur beasiswa tahfidz dan prestasi akademik.</p>
                            <a
                                href="#"
                                className="mt-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-primary font-bold text-sm hover:bg-slate-100 transition-colors shadow-sm"
                            >
                                Daftar Sekarang →
                            </a>
                        </div>
                    </aside>
                </div>
            </div>
        </PublicLayout>
    );
}
