import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import { Link } from '@inertiajs/react';
import { blocksFromMetadata } from '@/lib/postBlocks';

export default function PageShow({ page }) {
    const blocks = blocksFromMetadata(page.metadata);

    return (
        <AdminLayout title="Detail Laman">
            <div className="mb-6 flex flex-wrap gap-3"><Button variant="outline" href="/admin/pages">Kembali</Button><Button href={`/admin/pages/${page.id}/edit`}>Edit Laman</Button></div>
            <Card className="max-w-3xl p-6">
                <div className="flex flex-wrap gap-3"><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{page.group === 'tentang' ? 'Tentang Kami' : page.group === 'arsip' ? 'Arsip Kustom' : 'Laman Kustom'}</span><span className={`rounded-full px-3 py-1 text-xs font-semibold ${page.is_published ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>{page.is_published ? 'Terbit' : 'Draft'}</span></div>
                <h1 className="mt-4 text-2xl font-bold text-slate-800">{page.title}</h1>
                <p className="mt-2 text-sm text-slate-500">/laman/{page.slug}</p>
                {page.display_type === 'category' ? (
                    <p className="mt-6 text-slate-700">Menampilkan post kategori: <span className="font-semibold">{page.category?.name || '-'}</span></p>
                ) : (
                    <>
                        {page.image && (
                            <img src={page.image} alt={page.title} className="mt-6 max-h-96 w-full rounded-lg border border-slate-200 object-cover" />
                        )}
                        <div className="mt-6 whitespace-pre-wrap text-slate-700">{page.content}</div>
                        {blocks.map((block, index) =>
                            block.type === 'text' ? (
                                <div key={index} className="mt-4 whitespace-pre-wrap text-slate-700">{block.content}</div>
                            ) : block.type === 'callout' ? (
                                <aside key={index} className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 whitespace-pre-line">
                                    {block.content}
                                </aside>
                            ) : block.type === 'blockquote' ? (
                                <blockquote key={index} className="mt-4 border-l-4 border-primary/40 pl-4 italic text-slate-600 whitespace-pre-line">
                                    {block.content}
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
                    </>
                )}
                <Link href={`/admin/pages/${page.id}/edit`} className="mt-6 inline-block text-sm font-semibold text-primary hover:underline">Edit laman</Link>
            </Card>
        </AdminLayout>
    );
}
