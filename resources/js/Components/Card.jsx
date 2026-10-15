export default function Card({ children, className = '', hover = false, overflow }) {
    return (
        <div
            style={overflow ? { overflow } : undefined}
            className={`
                bg-white rounded-xl border border-slate-200/80 
                shadow-card overflow-hidden
                ${hover ? 'transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5' : ''}
                ${className}
            `}
        >
            {children}
        </div>
    );
}
