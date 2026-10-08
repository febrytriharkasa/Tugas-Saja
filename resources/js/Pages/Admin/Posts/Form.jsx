import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import { useForm } from '@inertiajs/react';

export default function PostForm({ post, categories }) {
    const isEdit = !!post;
    const initialCategory = post?.category_id || categories[0]?.id || '';
    const initialCategoryObj = categories.find((c) => String(c.id) === String(initialCategory));

    const { data, setData, post: submitPost, put, processing, errors } = useForm({
        title: post?.title || '',
        category_id: initialCategory,
        content: post?.content || '',
        status: post?.status || 'draft',
        featured_image: null,
        event_date: post?.metadata?.event_date || '',
        location: post?.metadata?.location || '',
        participant_name: post?.metadata?.participant_name || '',
        rank: post?.metadata?.rank || '',
        year: post?.metadata?.year || new Date().getFullYear(),
        graduation_year: post?.metadata?.graduation_year || '',
        current_profession: post?.metadata?.current_profession || '',
    });

    const activeCategory = categories.find((c) => String(c.id) === String(data.category_id)) || initialCategoryObj;
    const categorySlug = activeCategory?.slug || '';

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(`/admin/posts/${post.id}`);
        } else {
            submitPost('/admin/posts');
        }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Konten' : 'Tambah Konten'}>
            <Card className="p-6 max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Judul</label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                        />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Kategori</label>
                        <select
                            value={data.category_id}
                            onChange={(e) => setData('category_id', e.target.value)}
                            className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                        >
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                        {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id}</p>}
                    </div>

                    {categorySlug === 'agenda' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600">Tanggal Agenda</label>
                                <input
                                    type="date"
                                    value={data.event_date}
                                    onChange={(e) => setData('event_date', e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-slate-300 text-sm"
                                />
                                {errors.event_date && <p className="text-red-500 text-xs mt-1">{errors.event_date}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600">Lokasi Pelaksanaan</label>
                                <input
                                    type="text"
                                    value={data.location}
                                    placeholder="cth: Aula Utama"
                                    onChange={(e) => setData('location', e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-slate-300 text-sm"
                                />
                                {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                            </div>
                        </div>
                    )}

                    {categorySlug === 'prestasi' && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600">Nama Siswa / Tim</label>
                                <input
                                    type="text"
                                    value={data.participant_name}
                                    placeholder="cth: Ahmad Zaki"
                                    onChange={(e) => setData('participant_name', e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-slate-300 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600">Peringkat / Capaian</label>
                                <input
                                    type="text"
                                    value={data.rank}
                                    placeholder="cth: Juara 1 Nasional"
                                    onChange={(e) => setData('rank', e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-slate-300 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600">Tahun</label>
                                <input
                                    type="number"
                                    value={data.year}
                                    onChange={(e) => setData('year', e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-slate-300 text-sm"
                                />
                            </div>
                        </div>
                    )}

                    {categorySlug === 'cerita-alumni' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600">Tahun Lulus</label>
                                <input
                                    type="number"
                                    value={data.graduation_year}
                                    onChange={(e) => setData('graduation_year', e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-slate-300 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600">Profesi Saat Ini</label>
                                <input
                                    type="text"
                                    value={data.current_profession}
                                    placeholder="cth: Dokter"
                                    onChange={(e) => setData('current_profession', e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-slate-300 text-sm"
                                />
                            </div>
                        </div>
                    )}

                    {categorySlug === 'fasilitas' && (
                        <p className="text-xs text-slate-500 p-3 bg-slate-50 rounded-lg border border-slate-200">
                            Gunakan judul sebagai nama fasilitas dan konten sebagai deskripsi.
                        </p>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Konten / Keterangan</label>
                        <textarea
                            rows={8}
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                            className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                        />
                        {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Gambar (Opsional)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData('featured_image', e.target.files[0] || null)}
                            className="mt-1 block w-full rounded-lg border border-slate-300 text-sm file:mr-4 file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-slate-700"
                        />
                        {post?.featured_image && (
                            <p className="text-xs text-slate-500 mt-1">Gambar lama tetap dipakai jika tidak memilih file baru.</p>
                        )}
                        {errors.featured_image && <p className="text-red-500 text-xs mt-1">{errors.featured_image}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Status</label>
                        <select
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                            className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Terbit (Published)</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline" href="/admin/posts">Batal</Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </div>
                </form>
            </Card>
        </AdminLayout>
    );
}
