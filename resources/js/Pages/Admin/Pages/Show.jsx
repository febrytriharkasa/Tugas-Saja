import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import RichContent from '@/Components/RichContent';
import { blocksFromMetadata } from '@/lib/postBlocks';
import { router } from '@inertiajs/react';
import { useState } from 'react';

export default function PageShow({ page }) {
    const [updating, setUpdating] = useState(false);
    const blocks = blocksFromMetadata(page.metadata);

    const handleStatusChange = (newPublished) => {
        setUpdating(true);
        router.patch(`/admin/pages/${page.id}/status`, { is_published: newPublished }, {
            preserveScroll: true,
            onFinish: () => setUpdating(false),
        });
    };

    return (
        <AdminLayout title="Detail Laman">
            <div className="mb-6 flex flex-wrap gap-3">
                <Button variant="outline" href="/admin/pages" icon="arrow-left">Kembali</Button>
                <Button href={`/admin/pages/${page.id}/edit`} icon="pencil">Edit Laman</Button>
            </div>

            <div className="grid items-start gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <Card className="p-6">
                        <div className="flex flex-wrap gap-3">
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${page.is_published ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>
                                {page.is_published ? 'Terbit' : 'Draf'}
                            </span>
                        </div>
                        <h1 className="mt-4 text-2xl font-bold text-slate-800">{page.title}</h1>
                        <p className="mt-2 text-sm text-slate-500">/{page.slug}</p>
                        {page.image && (
                            <img src={page.image} alt={page.title} className="mt-6 max-h-96 w-full rounded-lg border border-slate-200 object-cover" />
                        )}
                        <RichContent html={page.content} className="mt-6 text-slate-700" />
                        {blocks.map((block, index) =>
                            block.type === 'text' ? (
                                <RichContent key={index} html={block.content} className="mt-4 text-slate-700" />
                            ) : block.type === 'callout' ? (
                                <aside key={index} className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-900">
                                    <RichContent html={block.content} className="text-sm" />
                                </aside>
                            ) : block.type === 'blockquote' ? (
                                <blockquote key={index} className="mt-4 border-l-4 border-primary/40 pl-4 italic text-slate-600">
                                    <RichContent html={block.content} />
                                    {block.source && (
                                        <cite className="mt-2 block text-sm not-italic text-slate-500">— {block.source}</cite>
                                    )}
                                </blockquote>
                            ) : (
                                <div key={index} className="mt-4 rounded-lg border border-slate-200">
                                    <div className="border-b border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">{block.title || 'Tabel'}</div>
                                    {block.description && <p className="px-4 py-2 text-xs text-slate-500">{block.description}</p>}
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full text-left text-sm">
                                            <thead>
                                                <tr className="bg-slate-50 text-xs uppercase text-slate-500">
                                                    {(block.columns || []).map((column, columnIndex) => (
                                                        <th key={columnIndex} className="px-4 py-2">{column || `Kolom ${columnIndex + 1}`}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {(block.rows || []).map((row, rowIndex) => (
                                                    <tr key={rowIndex}>
                                                        {(block.columns || []).map((_, columnIndex) => (
                                                            <td key={columnIndex} className="px-4 py-2 text-slate-700">{row[columnIndex] || '-'}</td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )
                        )}
                    </Card>
                </div>

                <div className="space-y-6 lg:sticky lg:top-20">
                    <Card className="p-6">
                        <h2 className="text-base font-bold text-slate-800">Status Laman</h2>
                        <p className="mt-1 text-xs text-slate-500">Ubah langsung status laman tanpa perlu masuk form edit.</p>
                        <div className="mt-4">
                            <label htmlFor="change-page-status" className="block text-sm font-medium text-slate-700">Status</label>
                            <select
                                id="change-page-status"
                                value={page.is_published ? 'published' : 'draft'}
                                disabled={updating}
                                onChange={(e) => handleStatusChange(e.target.value === 'published')}
                                className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary disabled:opacity-50"
                            >
                                <option value="draft">Draf</option>
                                <option value="published">Terbit</option>
                            </select>
                            {updating && <p className="mt-2 text-xs text-slate-400">Memperbarui...</p>}
                        </div>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
