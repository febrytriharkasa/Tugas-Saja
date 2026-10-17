import { router } from '@inertiajs/react';
import Icon from '@/Components/Icon';

export default function SearchInput({ href, filters = {}, placeholder = 'Cari...', className = '' }) {
    return (
        <div className={`relative ${className}`}>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Icon name="search" className="h-4 w-4 text-slate-400" />
            </div>
            <input
                type="text"
                placeholder={placeholder}
                aria-label={placeholder}
                enterKeyHint="search"
                defaultValue={filters.search || ''}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                        router.get(href, { ...filters, search: event.target.value }, { preserveState: true });
                    }
                }}
                className="w-full rounded-lg border-slate-300 py-2 pl-10 pr-4 text-sm placeholder:text-slate-400 focus:border-primary focus:ring-primary sm:w-64"
            />
        </div>
    );
}
