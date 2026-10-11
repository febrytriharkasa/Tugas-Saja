import { Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import Card from '@/Components/Card';
import Badge from '@/Components/Badge';
import ChatWidget from '@/Components/ChatWidget';

function Breadcrumbs({ page }) {
    return (
        <section className="w-full bg-slate-50 py-2 border-b border-slate-200/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex items-center flex-wrap gap-1.5 text-xs text-slate-500 font-medium">
                    <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                        Beranda
                    </Link>
                    <span className="text-slate-300">/</span>
                    <span className="text-primary font-semibold line-clamp-1 max-w-xs md:max-w-md">{page.title}</span>
                </nav>
            </div>
        </section>
    );
}

export default function Page({ page }) {
    return (
        <PublicLayout>
            <Breadcrumbs page={page} />
            {/* 
              Menggunakan w-full dan max-w-7xl mx-auto agar container mengambil 
              lebar penuh dengan batas maksimal, tanpa flexbox yang bisa membuat elemen mengecil.
            */}
            <div className="block w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-4">
                    <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-secondary">Tentang Kami</p>
                </div>
                
                {/* 
                    w-full memastikan lebar card absolut membentang penuh mengisi max-w-7xl.
                    Karena tidak ada batasan h (tinggi), tinggi card otomatis menyesuaikan teks.
                */}
                <article className="w-full bg-white rounded-xl p-8 border border-slate-200/80 shadow-card space-y-6">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
                        {page.title}
                    </h1>

                    <div className="prose max-w-none text-slate-700 leading-relaxed space-y-4 whitespace-pre-line">
                        {page.content}
                    </div>
                </article>
            </div>

            <ChatWidget />
        </PublicLayout>
    );
}