import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/Card';
import { Link } from '@inertiajs/react';

export default function Dashboard({ metrics, latestPosts }) {
    const statCards = [
        { name: 'Total Berita', value: metrics.total_posts, color: 'text-primary' },
        { name: 'Berita Terbit', value: metrics.published_posts, color: 'text-secondary' },
        { name: 'Kategori', value: metrics.total_categories, color: 'text-tertiary' },
        { name: 'Media Galeri', value: metrics.total_galleries, color: 'text-slate-700' },
    ];

    return (
        <AdminLayout title="Dashboard">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat) => (
                    <Card key={stat.name} className="p-6">
                        <p className="text-sm font-medium text-slate-500">{stat.name}</p>
                        <p className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
                    </Card>
                ))}
            </div>

            <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-slate-800">Berita Terbaru</h2>
                    <Link href="/admin/posts" className="text-sm font-semibold text-primary hover:underline">
                        Lihat Semua
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 text-sm font-semibold text-slate-600">
                                <th className="pb-3">Judul</th>
                                <th className="pb-3">Kategori</th>
                                <th className="pb-3">Status</th>
                                <th className="pb-3">Tanggal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {latestPosts.map((post) => (
                                <tr key={post.id} className="hover:bg-slate-50">
                                    <td className="py-3 font-medium text-slate-800">{post.title}</td>
                                    <td className="py-3 text-slate-500">{post.category?.name || '-'}</td>
                                    <td className="py-3">
                                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                                            post.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
                                        }`}>
                                            {post.status}
                                        </span>
                                    </td>
                                    <td className="py-3 text-slate-500">
                                        {post.published_at ? new Date(post.published_at).toLocaleDateString('id-ID') : '-'}
                                    </td>
                                </tr>
                            ))}
                            {latestPosts.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="py-4 text-center text-slate-400">Belum ada berita.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </AdminLayout>
    );
}
