import { useMemo, useState } from 'react';

export const plainLabel = (label) => label?.replace(/^(Laman|Kategori): /, '') ?? label;

export default function LinkUrlPicker({ options = [], value = '', onChange }) {
    const knownUrls = useMemo(() => new Set(options.map((o) => o.url)), [options]);
    const [customOpen, setCustomOpen] = useState(false);
    const [draft, setDraft] = useState('');

    const commit = (url) => {
        setCustomOpen(false);
        setDraft('');
        onChange(url);
    };

    if (customOpen || (value && !knownUrls.has(value))) {
        return (
            <div className="flex gap-2">
                <input
                    type="text"
                    value={draft || value}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            commit(e.target.value.trim());
                        }
                    }}
                    placeholder="https://contoh.com atau /laman/xyz"
                    className="block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                />
                <button
                    type="button"
                    onClick={() => commit((draft || value).trim())}
                    className="shrink-0 rounded-lg bg-primary/10 px-3 text-xs font-semibold text-primary transition hover:bg-primary/20"
                >
                    OK
                </button>
            </div>
        );
    }

    return (
        <select
            value={value || ''}
            onChange={(e) => {
                if (e.target.value === '__custom__') {
                    setCustomOpen(true);
                } else {
                    onChange(e.target.value);
                }
            }}
            className="block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
        >
            <option value="">Pilih halaman tujuan...</option>
            {options.map((option) => (
                <option key={option.url} value={option.url}>{option.label}</option>
            ))}
            <option value="__custom__">URL lain (isi manual)...</option>
        </select>
    );
}
