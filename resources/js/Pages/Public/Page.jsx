import PublicLayout from '@/Layouts/PublicLayout';
import Breadcrumbs from '@/Components/Breadcrumbs';
import ChatWidget from '@/Components/ChatWidget';
import RichContent from '@/Components/RichContent';
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
                <table className="w-full table-fixed text-[10px] text-left border-collapse sm:text-sm">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-semibold text-slate-600 uppercase tracking-wide sm:text-xs">
                            <th className="w-8 px-2 py-2 sm:px-5 sm:py-3">#</th>
                            {columns.map((column, index) => (
                                <th key={index} className="px-2 py-2 sm:px-5 sm:py-3">{column || `Kolom ${index + 1}`}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {rows.map((row, rowIndex) => (
                            <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                                <td className="px-2 py-2 sm:px-5 sm:py-3 text-slate-400 font-medium">{rowIndex + 1}</td>
                                {columns.map((_, columnIndex) => (
                                    <td key={columnIndex} className="px-2 py-2 sm:px-5 sm:py-3 text-slate-700">
                                        {row[columnIndex] || '-'}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default function Page({ page }) {
    const blocks = blocksFromMetadata(page.metadata);

    return (
        <PublicLayout>
            <Breadcrumbs items={[{ label: 'Beranda', href: '/' }, { label: page.title }]} />
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

                    <RichContent
                        html={page.content}
                        className="text-slate-700 leading-relaxed space-y-4"
                    />

                    {blocks.map((block, index) => {
                        if (block.type === 'text') {
                            return (
                                <RichContent
                                    key={index}
                                    html={block.content}
                                    className="text-slate-700 leading-relaxed"
                                />
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
                                    className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-900"
                                >
                                    <RichContent html={block.content} className="text-sm leading-relaxed" />
                                </aside>
                            );
                        }
                        if (block.type === 'blockquote') {
                            return (
                                <blockquote
                                    key={index}
                                    className="border-l-4 border-primary/40 pl-4 text-base italic text-slate-600 leading-relaxed"
                                >
                                    <RichContent html={block.content} />
                                    {block.source && (
                                        <cite className="mt-2 block text-sm not-italic text-slate-500">— {block.source}</cite>
                                    )}
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
