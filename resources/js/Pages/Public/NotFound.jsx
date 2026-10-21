import PublicLayout from '@/Layouts/PublicLayout';
import Seo from '@/Components/Seo';
import Button from '@/Components/Button';
import { Reveal } from '@/Components/Reveal';

export default function NotFound() {
    return (
        <PublicLayout>
            <Seo title="Halaman tidak ditemukan" robots="noindex, nofollow" />
            <Reveal>
            <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
                <p className="text-5xl font-extrabold leading-none tracking-tight text-primary sm:text-6xl">404</p>
                <h1 className="mt-5 text-2xl font-bold text-slate-900 sm:text-3xl">Halaman tidak ditemukan</h1>
                <p className="mt-3 max-w-lg text-sm text-slate-600 sm:text-base">
                    Alamat yang Anda buka tidak ada atau sudah dipindah. Cek kembali tautannya.
                </p>
                <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
                    <Button href="/" icon="arrow-left" className="w-full sm:w-auto">
                        Kembali ke Beranda
                    </Button>
                    <Button href="/berita" variant="outline" className="w-full sm:w-auto">
                        Lihat Berita
                    </Button>
                </div>
            </div>
            </Reveal>
        </PublicLayout>
    );
}
