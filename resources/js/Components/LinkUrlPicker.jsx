import { useEffect, useId, useMemo, useRef, useState } from 'react';
import Icon from '@/Components/Icon';

export const plainLabel = (label) => label?.replace(/^(Laman|Kategori): /, '') ?? label;

export default function LinkUrlPicker({ options = [], value = '', onChange }) {
    const searchInputId = useId();
    const knownUrls = useMemo(() => new Set(options.map((o) => o.url)), [options]);
    const selectedOption = useMemo(() => options.find((o) => o.url === value), [options, value]);

    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [customMode, setCustomMode] = useState(false);
    const [draft, setDraft] = useState('');
    const [highlightIndex, setHighlightIndex] = useState(0);
    const [rect, setRect] = useState(null);

    const containerRef = useRef(null);
    const searchInputRef = useRef(null);
    const listRef = useRef(null);

    const isCustomValue = Boolean(value && !knownUrls.has(value));

    const filteredOptions = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return options;
        return options.filter((o) =>
            o.label.toLowerCase().includes(q) || o.url.toLowerCase().includes(q)
        );
    }, [options, search]);

    useEffect(() => {
        if (!open) {
            setSearch('');
            setHighlightIndex(0);
            return;
        }
        const timer = setTimeout(() => searchInputRef.current?.focus(), 10);
        return () => clearTimeout(timer);
    }, [open]);

    useEffect(() => {
        setHighlightIndex(0);
    }, [search]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        const handleReposition = () => {
            if (!containerRef.current) return;
            const r = containerRef.current.getBoundingClientRect();
            setRect({ top: r.bottom, left: r.left, width: r.width });
        };
        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('scroll', handleReposition, true);
        window.addEventListener('resize', handleReposition);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleReposition, true);
            window.removeEventListener('resize', handleReposition);
        };
    }, []);

    const toggleOpen = () => {
        setOpen((prev) => {
            const next = !prev;
            if (next && containerRef.current) {
                const r = containerRef.current.getBoundingClientRect();
                setRect({ top: r.bottom, left: r.left, width: r.width });
            }
            return next;
        });
    };

    const commitCustom = (url) => {
        setCustomMode(false);
        setDraft('');
        onChange(url);
    };

    const selectOption = (opt) => {
        setOpen(false);
        onChange(opt.url);
    };

    const handleKeyDown = (e) => {
        if (!open) {
            if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setOpen(true);
            }
            return;
        }

        const totalItems = filteredOptions.length + 1;

        if (e.key === 'Escape') {
            e.preventDefault();
            setOpen(false);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightIndex((prev) => (prev + 1) % totalItems);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightIndex((prev) => (prev - 1 + totalItems) % totalItems);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (highlightIndex === 0) {
                setOpen(false);
                setCustomMode(true);
                setDraft(value);
            } else if (filteredOptions[highlightIndex - 1]) {
                selectOption(filteredOptions[highlightIndex - 1]);
            }
        }
    };

    if (customMode || isCustomValue) {
        return (
            <div className="flex gap-2">
                <input
                    type="text"
                    value={draft !== '' ? draft : value}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            commitCustom((draft !== '' ? draft : value).trim());
                        } else if (e.key === 'Escape') {
                            setCustomMode(false);
                            setDraft('');
                        }
                    }}
                    placeholder="https://contoh.com atau /xyz"
                    className="block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                />
                <button
                    type="button"
                    onClick={() => commitCustom((draft !== '' ? draft : value).trim())}
                    className="shrink-0 rounded-lg bg-primary/10 px-3 text-xs font-semibold text-primary transition hover:bg-primary/20"
                >
                    OK
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setCustomMode(false);
                        setDraft('');
                        onChange('');
                    }}
                    className="shrink-0 rounded-lg px-2 text-xs text-slate-500 transition hover:bg-slate-100"
                    title="Pilih dari daftar"
                >
                    ✕
                </button>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="relative" onKeyDown={handleKeyDown}>
            <button
                type="button"
                onClick={toggleOpen}
                className="flex w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-3 py-2 text-left text-sm transition hover:border-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                <span className={`block truncate ${selectedOption ? 'text-slate-800' : 'text-slate-400'}`}>
                    {selectedOption ? selectedOption.label : 'Pilih halaman tujuan...'}
                </span>
                <svg
                    className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {open && (
                <div
                    style={rect ? {
                        position: 'fixed',
                        top: `${rect.top + 4}px`,
                        left: `${rect.left}px`,
                        width: `${rect.width}px`,
                    } : undefined}
                    className={`${rect ? '' : 'absolute left-0 top-full mt-1 w-full'} z-[9999] rounded-lg border border-slate-200 bg-white shadow-xl`}
                >
                    <div className="p-2 border-b border-slate-100">
                        <div className="relative">
                            <label htmlFor={searchInputId} className="sr-only">Cari tujuan</label>
                            <span className="pointer-events-none absolute inset-y-0 left-2.5 flex items-center text-slate-400">
                                <Icon name="search" className="h-4 w-4" />
                            </span>
                            <input
                                id={searchInputId}
                                ref={searchInputRef}
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari halaman, kategori, atau URL..."
                                className="block w-full rounded-md border-slate-200 pl-8 pr-2 py-1.5 text-xs focus:border-primary focus:ring-primary"
                            />
                        </div>
                    </div>

                    <div ref={listRef} role="listbox" className="max-h-60 overflow-y-auto p-1 text-sm">
                        {/* Option 0: URL lain (isi manual) - paling atas */}
                        <button
                            type="button"
                            role="option"
                            aria-selected={false}
                            onClick={() => {
                                setOpen(false);
                                setCustomMode(true);
                                setDraft(value);
                            }}
                            onMouseEnter={() => setHighlightIndex(0)}
                            className={`flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-xs font-medium transition ${
                                highlightIndex === 0
                                    ? 'bg-slate-100 text-primary'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-primary'
                            }`}
                        >
                            <Icon name="pencil" className="h-3.5 w-3.5 shrink-0 text-primary" />
                            <span className="font-semibold text-primary">URL lain (isi manual)...</span>
                        </button>

                        <div className="border-t border-slate-100 my-1" />

                        {filteredOptions.length === 0 ? (
                            <div className="px-3 py-2 text-xs text-slate-400 text-center">
                                Tidak ada hasil untuk "{search}"
                            </div>
                        ) : (
                            filteredOptions.map((opt, idx) => {
                                const optionIndex = idx + 1;
                                const isSelected = opt.url === value;
                                const isHighlighted = optionIndex === highlightIndex;
                                return (
                                    <button
                                        key={opt.url}
                                        type="button"
                                        role="option"
                                        aria-selected={isSelected}
                                        onClick={() => selectOption(opt)}
                                        onMouseEnter={() => setHighlightIndex(optionIndex)}
                                        className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-xs transition ${
                                            isHighlighted
                                                ? 'bg-slate-100 text-slate-900'
                                                : 'text-slate-700 hover:bg-slate-50'
                                        } ${isSelected ? 'font-semibold text-primary' : ''}`}
                                    >
                                        <div className="min-w-0 flex-1 pr-2">
                                            <p className="truncate">{opt.label}</p>
                                            <p className="truncate font-mono text-[10px] text-slate-400">{opt.url}</p>
                                        </div>
                                        {isSelected && (
                                            <Icon name="check" className="h-4 w-4 shrink-0 text-primary" />
                                        )}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
