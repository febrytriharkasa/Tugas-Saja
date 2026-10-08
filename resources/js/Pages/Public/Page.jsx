import PublicLayout from '@/Layouts/PublicLayout';
import Card from '@/Components/Card';
import Badge from '@/Components/Badge';
import ChatWidget from '@/Components/ChatWidget';

export default function Page({ page }) {
    return (
        <PublicLayout>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Badge variant="primary" className="mb-4">
                    {page.group === 'tentang' ? 'Tentang Kami' : 'Laman'}
                </Badge>
                
                <article className="bg-white rounded-xl p-8 border border-slate-200/80 shadow-card space-y-6">
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
