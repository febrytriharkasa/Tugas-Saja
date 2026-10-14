import { Link } from '@inertiajs/react';
import Icon from '@/Components/Icon';

const colors = {
    slate: 'text-slate-600 hover:text-slate-800 hover:bg-slate-100 focus-visible:ring-slate-500',
    primary: 'text-primary hover:text-primary-container hover:bg-emerald-50 focus-visible:ring-primary',
    red: 'text-red-600 hover:text-red-700 hover:bg-red-50 focus-visible:ring-red-500',
    emerald: 'text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100 focus-visible:ring-emerald-600',
};

export default function ActionIcon({
    icon,
    label,
    href,
    onClick,
    color = 'slate',
    className = '',
    disabled = false,
    type = 'button',
}) {
    const colorClass = colors[color] || colors.slate;

    const baseClass = `inline-flex h-9 w-9 items-center justify-center rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${colorClass} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;

    if (href && !disabled) {
        return (
            <Link href={href} className={baseClass} title={label} aria-label={label}>
                <Icon name={icon} />
            </Link>
        );
    }

    return (
        <button
            type={type}
            onClick={onClick}
            className={baseClass}
            title={label}
            aria-label={label}
            disabled={disabled}
        >
            <Icon name={icon} />
        </button>
    );
}
