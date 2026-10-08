import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import { useForm, router } from '@inertiajs/react';

export default function GalleryIndex({ galleries }) {
    const { data, setData, post, reset, processing, errors } = useForm({
        title: '',
        media_type: 'image',
        file: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/galleries', {
            onSuccess: () => reset(),
        });
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus media ini?')) {
            router.delete(`/admin/galleries/${id}`);
        }
    };

    return (
        <AdminLayout title="Kelola Galeri">
            <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6 h-fit">
                    <h2 className="text-base font-bold text-slate-800 mb-4">Unggah Media</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Judul Media</label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                                placeholder="Cth: Upacara Hari Santri"
                            />
                            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Tipe Media</label>
                            <select
                                value={data.media_type}
                                onChange={(e) => setData('media_type', e.target.value)}
                                className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                            >
                                <option value="image">Gambar</option>
                                <option value="video">Video</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">File</label>
                            <input
                                type="file"
                                onChange={(e) => setData('file', e.target.files[0])}
                                className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                            />
                            {errors.file && <p className="text-red-500 text-xs mt-1">{errors.file}</p>}
                        </div>

                        <Button type="submit" disabled={processing} className="w-full">
                            {processing ? 'Mengunggah...' : 'Unggah'}
                        </Button>
                    </form>
                </Card>

                <div className="md:col-span-2">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {galleries.data.map((item) => (
                            <Card key={item.id} className="relative group overflow-hidden">
                                <img
                                    src={item.file_path}
                                    alt={item.title}
                                    className="w-full h-36 object-cover"
                                />
                                <div className="p-3">
                                    <p className="text-xs font-semibold text-slate-800 truncate">{item.title}</p>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="mt-2 text-xs text-red-600 hover:underline"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </Card>
                        ))}
                        {galleries.data.length === 0 && (
                            <div className="col-span-full py-8 text-center text-slate-400">
                                Belum ada media galeri.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
