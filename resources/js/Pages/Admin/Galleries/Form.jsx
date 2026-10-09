import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function GalleryForm({ gallery }) {
    const isEdit = !!gallery;
    const [preview, setPreview] = useState(gallery?.file_path || null);
    const { data, setData, post, processing, errors, transform } = useForm({ title: gallery?.title || '', media_type: gallery?.media_type || 'image', file: null });
    useEffect(() => () => { if (preview && preview !== gallery?.file_path) URL.revokeObjectURL(preview); }, [preview, gallery?.file_path]);
    const selectFile = event => { const file = event.target.files[0] || null; setData('file', file); setPreview(file ? URL.createObjectURL(file) : gallery?.file_path || null); };
    const submit = event => { event.preventDefault(); transform(values => ({ ...values, ...(isEdit ? { _method: 'put' } : {}) })); post(isEdit ? `/admin/galleries/${gallery.id}` : '/admin/galleries', { forceFormData: true }); };
    return <AdminLayout title={isEdit ? 'Edit Media Galeri' : 'Unggah Media Galeri'}><Card className="max-w-2xl p-6"><form onSubmit={submit} className="space-y-5"><div><label className="block text-sm font-semibold text-slate-700">Judul Media</label><input value={data.title} onChange={event => setData('title', event.target.value)} className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary" />{errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}</div><div><label className="block text-sm font-semibold text-slate-700">Tipe Media</label><select value={data.media_type} onChange={event => setData('media_type', event.target.value)} className="mt-1 block w-full rounded-lg border-slate-300 text-sm"><option value="image">Gambar</option><option value="video">Video</option></select></div><div><label className="block text-sm font-semibold text-slate-700">File {isEdit && '(opsional)'}</label>{preview && (data.media_type === 'video' ? <video src={preview} controls className="my-3 max-h-80 w-full rounded-lg bg-slate-100" /> : <img src={preview} alt="Preview media" className="my-3 max-h-80 w-full rounded-lg object-contain bg-slate-100" />)}<input type="file" accept={data.media_type === 'video' ? 'video/*' : 'image/*'} onChange={selectFile} className="mt-1 block w-full text-sm" />{errors.file && <p className="mt-1 text-xs text-red-600">{errors.file}</p>}</div><div className="flex justify-end gap-3"><Button variant="outline" href="/admin/galleries">Batal</Button><Button type="submit" disabled={processing}>{processing ? 'Menyimpan...' : 'Simpan'}</Button></div></form></Card></AdminLayout>;
}
