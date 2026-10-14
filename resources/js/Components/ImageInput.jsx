export default function ImageInput({ preview, onSelect, onRemove, inputClassName = '' }) {
    return (
        <>
            {preview && (
                <div className="relative mt-2 mb-2 inline-block">
                    <img
                        src={preview}
                        alt="Preview gambar"
                        className="h-auto max-h-80 w-auto max-w-full rounded-lg border border-slate-200 bg-white object-contain"
                    />
                    <button
                        type="button"
                        onClick={onRemove}
                        className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white shadow-sm transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                        aria-label="Hapus gambar"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}
            <input
                type="file"
                accept="image/*"
                onChange={(e) => onSelect(e.target.files[0] || null)}
                className={inputClassName}
            />
        </>
    );
}
