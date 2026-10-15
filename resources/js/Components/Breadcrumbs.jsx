import { Fragment } from 'react';
import { Link } from '@inertiajs/react';

export default function Breadcrumbs({ items = [] }) {
    const trail = items.filter((item) => item?.label);

    if (trail.length === 0) {
        return null;
    }

    return (
        <section className="w-full bg-slate-50 py-2 border-b border-slate-200/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5 text-xs text-slate-500 font-medium">
                    {trail.map((item, index) => {
                        const isLast = index === trail.length - 1;

                        return (
                            <Fragment key={index}>
                                {index > 0 && <span aria-hidden="true" className="text-slate-300">/</span>}
                                {item.href ? (
                                    <Link href={item.href} className="hover:text-primary transition-colors">{item.label}</Link>
                                ) : (
                                    <span
                                        aria-current={isLast ? 'page' : undefined}
                                        className={
                                            item.muted
                                                ? 'text-slate-600 line-clamp-1 max-w-xs'
                                                : 'text-primary font-semibold line-clamp-1 max-w-xs md:max-w-md'
                                        }
                                    >
                                        {item.label}
                                    </span>
                                )}
                            </Fragment>
                        );
                    })}
                </nav>
            </div>
        </section>
    );
}