import { Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import ChatWidget from '@/Components/ChatWidget';
import { blocksFromMetadata } from '@/lib/postBlocks';

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
                                <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
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

function Breadcrumbs({ page }) {
    return (
        <section className="w-full bg-slate-50 py-2 border-b border-slate-200/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex items-center flex-wrap gap-1.5 text-xs text-slate-500 font-medium">
                    <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                        Beranda
                    </Link>
                    <span className="text-slate-300">/</span>
                    <span className="text-primary font-semibold line-clamp-1 max-w-xs md:max-w-md">{page.title}</span>
                </nav>
            </div>
        </section>
    );
}

export default function Page({ page }) {
    const blocks = blocksFromMetadata(page.metadata);

    return (
        <PublicLayout>
            <Breadcrumbs page={page} />
            <div className="block w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-4">
                    <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-secondary">Tentang Kami</p>
                </div>

                <article className="w-full bg-white rounded-xl p-8 border border-slate-200/80 shadow-card space-y-6">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
                        {page.title}
                    </h1>

                    {page.image && (
                        <img
                            src={page.image}
                            alt={page.title}
                            className="w-full max-h-[28rem] rounded-xl object-cover border border-slate-200"
                        />
                    )}

                    <div className="prose max-w-none text-slate-700 leading-relaxed space-y-4 whitespace-pre-line">
                        {page.content}
                    </div>

                    {blocks.map((block, index) => {
                        if (block.type === 'text') {
                            return (
                                <div key={index} className="prose max-w-none text-slate-700 leading-relaxed whitespace-pre-line">
                                    {block.content}
                                </div>
                            );
                        }
                        if (block.type === 'table') {
                            return (
                                <DataTable
                                    key={index}
                                    title={block.title}
                                    description={block.description}
                                    columns={block.columns}
                                    rows={block.rows}
                                />
                            );
                        }
                        if (block.type === 'callout') {
                            return (
                                <aside
                                    key={index}
                                    className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900 leading-relaxed whitespace-pre-line"
                                >
                                    {block.content}
                                </aside>
                            );
                        }
                        if (block.type === 'blockquote') {
                            return (
                                <blockquote
                                    key={index}
                                    className="border-l-4 border-primary/40 pl-4 text-base italic text-slate-600 leading-relaxed whitespace-pre-line"
                                >
                                    {block.content}
                                </blockquote>
                            );
                        }

                        return null;
                    })}
                </article>
            </div>

            <ChatWidget />
        </PublicLayout>
    );
}
