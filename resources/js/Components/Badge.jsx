export default function Badge({ children, variant = 'primary', className = '' }) {
    const variants = {
        primary: 'bg-emerald-50 text-emerald-700',
        secondary: 'bg-cyan-50 text-cyan-700',
        tertiary: 'bg-amber-50 text-amber-700',
        neutral: 'bg-slate-100 text-slate-700',
    };
    
    return (
        <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
}
