import { useEffect, useId, useRef, useState } from 'react';
import { useTheme } from '@/Contexts/ThemeContext';
import Icon from '@/Components/Icon';

const options = [
    { value: 'light', label: 'Mode terang', icon: 'sun' },
    { value: 'dark', label: 'Mode gelap', icon: 'moon' },
    { value: 'system', label: 'Ikuti sistem', icon: 'monitor' },
];

export default function ThemeToggle({ className = '' }) {
    const { theme, setTheme } = useTheme();
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);
    const buttonRef = useRef(null);
    const menuId = useId();
    const active = options.find((option) => option.value === theme) || options[2];

    useEffect(() => {
        if (!open) return;

        const closeOutside = (event) => {
            if (!containerRef.current?.contains(event.target)) setOpen(false);
        };
        const closeWithEscape = (event) => {
            if (event.key === 'Escape') {
                setOpen(false);
                buttonRef.current?.focus();
            }
        };

        document.addEventListener('pointerdown', closeOutside);
        document.addEventListener('keydown', closeWithEscape);

        return () => {
            document.removeEventListener('pointerdown', closeOutside);
            document.removeEventListener('keydown', closeWithEscape);
        };
    }, [open]);

    const selectTheme = (value) => {
        setTheme(value);
        setOpen(false);
        buttonRef.current?.focus();
    };

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            <button
                ref={buttonRef}
                type="button"
                onClick={() => setOpen((current) => !current)}
                aria-label={`Pilih tema, saat ini ${active.label}`}
                aria-haspopup="menu"
                aria-expanded={open}
                aria-controls={menuId}
                className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:text-slate-300 dark:hover:bg-slate-700"
            >
                <Icon name={active.icon} />
            </button>

            {open && (
                <div
                    id={menuId}
                    role="menu"
                    aria-label="Pilih tema tampilan"
                    className="absolute right-0 top-full z-[60] mt-2 w-48 overflow-hidden rounded-lg border border-slate-200 bg-white p-1.5 shadow-lg"
                >
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            role="menuitemradio"
                            aria-checked={theme === option.value}
                            onClick={() => selectTheme(option.value)}
                            className={`flex min-h-11 w-full items-center gap-3 rounded-md px-3 text-left text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                                theme === option.value
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-slate-700 hover:bg-slate-100'
                            }`}
                        >
                            <Icon name={option.icon} className="h-5 w-5 shrink-0" />
                            <span className="flex-1">{option.label}</span>
                            {theme === option.value && <Icon name="check" className="h-4 w-4 shrink-0" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
