import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';

export default function GalleryShow({ gallery }) {
    return <AdminLayout title="Detail Media Galeri"><div className="mb-6 flex gap-3"><Button variant="outline" href="/admin/galleries">Kembali</Button><Button href={`/admin/galleries/${gallery.id}/edit`}>Edit Media</Button></div><Card className="max-w-3xl p-6">{gallery.media_type === 'video' ? <video src={gallery.file_path} controls className="max-h-[32rem] w-full rounded-lg bg-slate-100" /> : <img src={gallery.file_path} alt={gallery.title} className="max-h-[32rem] w-full rounded-lg object-contain bg-slate-100" />}<h1 className="mt-5 text-2xl font-bold text-slate-800">{gallery.title}</h1><p className="mt-1 text-sm capitalize text-slate-500">{gallery.media_type}</p></Card></AdminLayout>;
}
