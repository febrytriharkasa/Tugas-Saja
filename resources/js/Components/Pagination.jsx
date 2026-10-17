import { Link } from '@inertiajs/react';

export default function Pagination({ links, className = '' }) {
    // Laravel adds prev/next wrapping links; hide when single page.
    if (!links || links.length <= 3) return null;

    return (
        <nav aria-label="Navigasi halaman" className={`flex flex-wrap items-center justify-end gap-1 border-t border-slate-100 px-4 py-3 ${className}`}>
            {links.map((link, index) => {
                const label = link.label
                    .replace('&laquo;', '‹')
                    .replace('&raquo;', '›')
                    .replace('Previous', '')
                    .replace('Next', '');

                if (!link.url) {
                    return (
                        <span
                            key={index}
                            aria-disabled="true"
                            className="inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm font-medium text-slate-300"
                            dangerouslySetInnerHTML={{ __html: label }}
                        />
                    );
                }

                return (
                    <Link
                        key={index}
                        href={link.url}
                        preserveScroll
                        aria-current={link.active ? 'page' : undefined}
                        className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm font-medium transition ${
                            link.active
                                ? 'bg-primary text-white'
                                : 'text-slate-600 hover:bg-slate-100'
                        }`}
                        dangerouslySetInnerHTML={{ __html: label }}
                    />
                );
            })}
        </nav>
    );
}
