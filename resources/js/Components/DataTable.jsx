export default function DataTable({ title, description, columns, rows }) {
    if (!Array.isArray(columns) || columns.length === 0 || !Array.isArray(rows) || rows.length === 0) {
        return null;
    }

    return (
        <div className="mt-8">
            {description && (
                <p className="mb-3 text-sm italic text-slate-600 border-l-4 border-primary/40 pl-3">{description}</p>
            )}
            {/* The stripe row is translucent, so the table pins its own surface: otherwise it blends with the white card on Pages and the canvas on PostDetail. */}
            <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-canvas">
                <div className="bg-primary px-5 py-3">
                    <h3 className="text-sm font-bold text-white">{title || 'Daftar Data'}</h3>
                </div>
                <table className="w-full table-fixed text-xs text-left border-collapse sm:text-sm">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                            <th className="w-8 px-2 py-2 sm:px-5 sm:py-3">#</th>
                            {columns.map((column, index) => (
                                <th key={index} className="px-2 py-2 sm:px-5 sm:py-3">{column || `Kolom ${index + 1}`}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {rows.map((row, rowIndex) => (
                            <tr key={rowIndex} className={`transition-colors ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-emerald-50/40`}>
                                <td className="px-2 py-2 sm:px-5 sm:py-3 text-slate-400 font-medium">{rowIndex + 1}</td>
                                {columns.map((_, columnIndex) => (
                                    <td key={columnIndex} className="px-2 py-2 sm:px-5 sm:py-3 text-slate-700">
                                        {row[columnIndex] || '-'}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
