import { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { toParagraphs } from '@/lib/content';
import { normalizeQuillHtml, syncListMarkers } from '@/lib/quillContent';

const FONT_SIZES = ['12px', '14px', '16px', '18px', '24px', '32px'];
const FORMATS = ['header', 'size', 'bold', 'italic', 'underline', 'strike', 'list', 'link'];

// Inline px sizes instead of Quill's default small/large/huge classes, so the
// stored HTML carries the exact size the author picked (and the purifier keeps it).
// `false` gives both pickers a "Normal" entry; their labels live in app.css
// because Quill only ships English ones.
const SizeStyle = Quill.import('attributors/style/size');
SizeStyle.whitelist = FONT_SIZES;
Quill.register(SizeStyle, true);

const TOOLBAR = [
    [{ header: [2, 3, 4, false] }, { size: [false, ...FONT_SIZES] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'clean'],
];

/** Loads stored HTML through Quill's parser, which rebuilds lists and their markers. */
function loadHtml(quill, html) {
    quill.setContents(quill.clipboard.convert({ html }), 'api');
    syncListMarkers(quill.root);
}

/**
 * Quill wrapper that talks to Inertia forms through `value`/`onChange` like a textarea would.
 * The editor owns its DOM after mount; React never re-renders inside it.
 * `compact` shrinks the writing area for short fields; `variant` mirrors the public look
 * of special blocks (`callout`, `quote`) so authors recognise what they are writing.
 */
export default function RichTextEditor({
    value = '',
    onChange,
    error,
    label,
    placeholder = 'Tulis di sini...',
    compact = false,
    variant = null,
}) {
    const hostRef = useRef(null);
    const quillRef = useRef(null);
    const lastEmitted = useRef(toParagraphs(value));
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    useEffect(() => {
        const quill = new Quill(hostRef.current, {
            theme: 'snow',
            placeholder,
            modules: { toolbar: TOOLBAR },
            formats: FORMATS,
        });

        quillRef.current = quill;

        if (lastEmitted.current) {
            loadHtml(quill, lastEmitted.current);
        }

        quill.on('text-change', (delta, oldDelta, source) => {
            if (source !== 'user') {
                return;
            }

            // Markers are drawn from the <li> itself, so item formatting is lifted there first.
            syncListMarkers(quill.root);

            // Quill keeps an empty line as <p><br></p>; report a truly empty string
            // so the backend `required` rule still fires on untouched posts.
            const html =
                quill.getText().trim() === '' ? '' : normalizeQuillHtml(quill.root.innerHTML);

            if (html !== lastEmitted.current) {
                lastEmitted.current = html;
                onChangeRef.current?.(html);
            }
        });

        return () => {
            quill.off('text-change');
            // React Strict Mode mounts twice in dev; a proper cleanup prevents double editors.
            const container = hostRef.current;
            if (container) {
                container.innerHTML = '';
            }
            quillRef.current = null;
        };
    }, []);

    // Only react to values pushed from outside (e.g. a form reset after save).
    useEffect(() => {
        const quill = quillRef.current;
        const next = toParagraphs(value);

        if (!quill || next === lastEmitted.current) {
            return;
        }

        lastEmitted.current = next;
        loadHtml(quill, next);
    }, [value]);

    return (
        <div>
            {label && <label className="block text-sm font-medium text-slate-700">{label}</label>}
            <div
                className={[
                    'rich-text-editor',
                    compact ? 'rich-text-editor--compact' : '',
                    variant ? `rich-text-editor--${variant}` : '',
                    'mt-1 overflow-hidden rounded-lg border border-slate-300 bg-white',
                ].join(' ')}
            >
                <div ref={hostRef} />
            </div>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}
