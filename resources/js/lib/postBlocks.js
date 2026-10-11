const LEGACY_COLUMNS = [
    { key: 'name', label: 'Nama / Kelas' },
    { key: 'rank', label: 'Peringkat' },
    { key: 'event', label: 'Keterangan' },
];

/**
 * Normalize a table block into { title, description, columns: string[], rows: string[][] }.
 * Legacy juara tables store rows as objects ({ name, rank, event }); they are converted to columns.
 */
export function normalizeTableBlock(block) {
    const rows = Array.isArray(block?.rows) ? block.rows : [];
    const isDynamic = Array.isArray(block?.columns) && rows.every((row) => Array.isArray(row));

    if (isDynamic) {
        return {
            type: 'table',
            title: block.title || '',
            description: block.description || '',
            columns: block.columns.map((column) => String(column ?? '')),
            rows: rows.map((row) => block.columns.map((_, index) => String(row[index] ?? ''))),
        };
    }

    const used = LEGACY_COLUMNS.filter((column) =>
        rows.some((row) => String(row?.[column.key] ?? '').trim() !== ''),
    );
    const selectedColumns = used.length ? used : LEGACY_COLUMNS.slice(0, 2);

    return {
        type: 'table',
        title: block?.title || '',
        description: block?.description || '',
        columns: selectedColumns.map((column) => column.label),
        rows: rows.map((row) => selectedColumns.map((column) => String(row?.[column.key] ?? ''))),
    };
}

export function normalizeBlock(block) {
    if (!block || block.type !== 'table') {
        return block;
    }

    return normalizeTableBlock(block);
}

/**
 * Read the blocks a post should render, supporting the current `blocks` key and the
 * legacy `tables` / `achievement_table` shapes.
 */
export function blocksFromMetadata(metadata) {
    if (Array.isArray(metadata?.blocks)) {
        return metadata.blocks.map(normalizeBlock);
    }

    if (Array.isArray(metadata?.tables)) {
        return metadata.tables.map((table) =>
            normalizeTableBlock({ type: 'table', description: table.description, rows: table.rows }),
        );
    }

    if (Array.isArray(metadata?.achievement_table)) {
        return [normalizeTableBlock({ type: 'table', rows: metadata.achievement_table })];
    }

    return [];
}

export function createTableBlock() {
    return {
        type: 'table',
        title: '',
        description: '',
        columns: ['Kolom 1', 'Kolom 2'],
        rows: [['', '']],
    };
}
