import { createBlockquoteBlock, createCalloutBlock, createTableBlock } from '@/lib/postBlocks';

const BLOCK_LABELS = {
    text: 'Teks',
    table: 'Tabel',
    callout: 'Callout',
    blockquote: 'Blockquote',
};

const BLOCK_FACTORIES = {
    text: () => ({ type: 'text', content: '' }),
    table: createTableBlock,
    callout: createCalloutBlock,
    blockquote: createBlockquoteBlock,
};

function TextBlock({ block, onChange }) {
    return (
        <div>
            <label className="block text-xs font-semibold text-slate-600">Teks</label>
            <textarea
                rows={4}
                value={block.content || ''}
                onChange={(e) => onChange({ ...block, content: e.target.value })}
                placeholder="Tulis deskripsi atau keterangan di sini..."
                className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
            />
        </div>
    );
}

function CalloutBlock({ block, onChange }) {
    return (
        <div>
            <label className="block text-xs font-semibold text-slate-600">Callout (Callout Box)</label>
            <textarea
                rows={4}
                value={block.content || ''}
                onChange={(e) => onChange({ ...block, content: e.target.value })}
                placeholder="Tulis isi callout di sini..."
                className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
            />
        </div>
    );
}

function BlockquoteBlock({ block, onChange }) {
    return (
        <div>
            <label className="block text-xs font-semibold text-slate-600">Blockquote (Kutipan)</label>
            <textarea
                rows={4}
                value={block.content || ''}
                onChange={(e) => onChange({ ...block, content: e.target.value })}
                placeholder="Tulis isi kutipan di sini..."
                className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
            />
        </div>
    );
}

function TableBlock({ block, onChange }) {
    const columns = block.columns || [];
    const rows = block.rows || [];

    const updateColumn = (columnIndex, value) =>
        onChange({ ...block, columns: columns.map((column, index) => (index === columnIndex ? value : column)) });

    const addColumn = () =>
        onChange({
            ...block,
            columns: [...columns, `Kolom ${columns.length + 1}`],
            rows: rows.map((row) => [...row, '']),
        });

    const removeColumn = (columnIndex) =>
        onChange({
            ...block,
            columns: columns.filter((_, index) => index !== columnIndex),
            rows: rows.map((row) => row.filter((_, index) => index !== columnIndex)),
        });

    const updateCell = (rowIndex, columnIndex, value) =>
        onChange({
            ...block,
            rows: rows.map((row, index) =>
                index === rowIndex ? row.map((cell, cellIndex) => (cellIndex === columnIndex ? value : cell)) : row,
            ),
        });

    const addRow = () => onChange({ ...block, rows: [...rows, columns.map(() => '')] });

    const removeRow = (rowIndex) => onChange({ ...block, rows: rows.filter((_, index) => index !== rowIndex) });

    return (
        <div className="space-y-3">
            <div>
                <label className="block text-xs font-semibold text-slate-600">Judul Tabel (Opsional)</label>
                <input
                    type="text"
                    value={block.title || ''}
                    onChange={(e) => onChange({ ...block, title: e.target.value })}
                    placeholder="Contoh: Rundown Acara"
                    className="mt-1 block w-full rounded-lg border-slate-300 text-sm"
                />
            </div>
            <div>
                <label className="block text-xs font-semibold text-slate-600">Deskripsi Tabel (Opsional)</label>
                <textarea
                    rows={2}
                    value={block.description || ''}
                    onChange={(e) => onChange({ ...block, description: e.target.value })}
                    placeholder="Contoh: Susunan acara peringatan hari santri."
                    className="mt-1 block w-full rounded-lg border-slate-300 text-sm"
                />
            </div>

            <div className="space-y-2">
                <span className="block text-xs font-semibold text-slate-600">Kolom</span>
                <div className="space-y-2">
                    {columns.map((column, columnIndex) => (
                        <div key={columnIndex} className="flex items-center gap-2">
                            <input
                                type="text"
                                value={column}
                                onChange={(e) => updateColumn(columnIndex, e.target.value)}
                                aria-label={`Nama kolom ${columnIndex + 1}`}
                                className="min-w-0 flex-1 rounded-lg border-slate-300 text-sm"
                            />
                            <button
                                type="button"
                                disabled={columns.length <= 1}
                                onClick={() => removeColumn(columnIndex)}
                                className="min-h-11 shrink-0 px-2 text-sm font-semibold text-red-600 hover:underline disabled:cursor-not-allowed disabled:opacity-30"
                            >
                                Hapus
                            </button>
                        </div>
                    ))}
                </div>
                <button type="button" onClick={addColumn} className="text-sm font-semibold text-primary hover:underline">
                    + Tambah Kolom
                </button>
            </div>

            <div className="space-y-2">
                <span className="block text-xs font-semibold text-slate-600">Isi Tabel</span>
                {rows.map((row, rowIndex) => (
                    <div
                        key={rowIndex}
                        className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 sm:p-0 border sm:border-0 border-slate-200 rounded-lg sm:rounded-none"
                    >
                        <div className="flex flex-1 flex-col sm:flex-row sm:flex-wrap gap-2">
                            {columns.map((column, columnIndex) => (
                                <input
                                    key={columnIndex}
                                    type="text"
                                    value={row[columnIndex] ?? ''}
                                    onChange={(e) => updateCell(rowIndex, columnIndex, e.target.value)}
                                    placeholder={column || `Kolom ${columnIndex + 1}`}
                                    aria-label={`${column || `Kolom ${columnIndex + 1}`} baris ${rowIndex + 1}`}
                                    className="min-w-0 flex-1 sm:min-w-[10rem] rounded-lg border-slate-300 text-sm"
                                />
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => removeRow(rowIndex)}
                            className="min-h-11 shrink-0 px-2 text-sm font-semibold text-red-600 hover:underline"
                        >
                            Hapus
                        </button>
                    </div>
                ))}
                <button type="button" onClick={addRow} className="text-sm font-semibold text-primary hover:underline">
                    + Tambah Baris
                </button>
            </div>
        </div>
    );
}

function Block({ block, index, total, onChange, onRemove, onMoveUp, onMoveDown }) {
    return (
        <div className="rounded-lg border border-slate-200 bg-white p-3 space-y-3">
            <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase text-slate-500">
                    {BLOCK_LABELS[block.type] || 'Blok'} {index + 1}
                </span>
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        disabled={index === 0}
                        onClick={onMoveUp}
                        className="px-2 py-1 text-xs font-semibold text-slate-500 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Geser ke atas"
                    >
                        ▲
                    </button>
                    <button
                        type="button"
                        disabled={index === total - 1}
                        onClick={onMoveDown}
                        className="px-2 py-1 text-xs font-semibold text-slate-500 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Geser ke bawah"
                    >
                        ▼
                    </button>
                    <button
                        type="button"
                        onClick={onRemove}
                        className="px-2 py-1 text-sm font-semibold text-red-600 hover:underline"
                    >
                        Hapus
                    </button>
                </div>
            </div>

            {block.type === 'callout' ? (
                <CalloutBlock block={block} onChange={onChange} />
            ) : block.type === 'blockquote' ? (
                <BlockquoteBlock block={block} onChange={onChange} />
            ) : block.type === 'table' ? (
                <TableBlock block={block} onChange={onChange} />
            ) : (
                <TextBlock block={block} onChange={onChange} />
            )}
        </div>
    );
}

/**
 * Editor for the metadata blocks, shared by the post and page forms.
 * The parent owns the array; this component only emits the next array.
 * `types` limits which block kinds the form can add, so a form whose backend
 * only accepts some kinds never offers the others.
 */
export default function BlocksEditor({
    blocks = [],
    onChange,
    errors = {},
    errorPrefix = 'meta.blocks',
    types = ['text', 'table', 'callout', 'blockquote'],
}) {
    const addBlock = (type) => onChange([...blocks, BLOCK_FACTORIES[type]()]);
    const updateBlock = (index, next) => onChange(blocks.map((block, i) => (i === index ? next : block)));
    const removeBlock = (index) => onChange(blocks.filter((_, i) => i !== index));
    const moveBlock = (index, direction) => {
        const target = index + direction;
        if (target < 0 || target >= blocks.length) {
            return;
        }
        const next = [...blocks];
        [next[index], next[target]] = [next[target], next[index]];
        onChange(next);
    };

    const hasBlockError = Object.keys(errors).some((key) => key.startsWith(errorPrefix));

    return (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
                <div>
                    <label className="text-sm font-semibold text-slate-700">Blok Tambahan (Opsional)</label>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Tambah blok sesuai kebutuhan. Urutan bisa diatur dengan tombol ▲▼.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 shrink-0">
                    {types.map((type) => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => addBlock(type)}
                            className="min-h-11 text-sm font-semibold text-primary hover:underline whitespace-nowrap"
                        >
                            + {BLOCK_LABELS[type]}
                        </button>
                    ))}
                </div>
            </div>

            {blocks.map((block, index) => (
                <Block
                    key={index}
                    block={block}
                    index={index}
                    total={blocks.length}
                    onChange={(next) => updateBlock(index, next)}
                    onRemove={() => removeBlock(index)}
                    onMoveUp={() => moveBlock(index, -1)}
                    onMoveDown={() => moveBlock(index, 1)}
                />
            ))}

            {hasBlockError && (
                <p className="text-red-500 text-xs">Lengkapi nama kolom dan isi setiap baris tabel.</p>
            )}
        </div>
    );
}
