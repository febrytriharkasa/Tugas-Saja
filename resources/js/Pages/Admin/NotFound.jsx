import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';

export default function NotFound() {
    return (
        <AdminLayout title="Halaman tidak ditemukan">
            <Card className="mx-auto max-w-xl px-6 py-16 text-center">
                <p className="text-5xl font-extrabold leading-none tracking-tight text-primary">404</p>
                <h1 className="mt-4 text-xl font-bold text-slate-800">Halaman admin tidak ditemukan</h1>
                <p className="mt-2 text-sm text-slate-600">
                    Alamat yang Anda buka tidak ada atau sudah dipindah.
                </p>
                <div className="mt-6 flex justify-center">
                    <Button href="/admin/dashboard" icon="arrow-left">
                        Kembali ke Dashboard
                    </Button>
                </div>
            </Card>
        </AdminLayout>
    );
}
