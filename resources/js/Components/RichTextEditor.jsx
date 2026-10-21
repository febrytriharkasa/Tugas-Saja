import { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import '../../css/quill-editor.css';
import { toParagraphs } from '@/lib/content';
import { normalizeQuillHtml, syncListMarkers } from '@/lib/quillContent';

const FORMATS = ['bold', 'italic', 'underline', 'strike', 'list', 'indent', 'link', 'listStyle'];

const Parchment = Quill.import('parchment');

// Ordered-marker types the author can pick. Plain CSS keywords, so the editor,
// the saved HTML and the published page all carry the same `list-style-type`.
const LIST_STYLES = ['decimal', 'lower-alpha', 'lower-roman'];

// BLOCK scope puts the value on the `<li>` itself. An item without one keeps
// Quill's own rotation by depth (1. / a. / i.).
const ListStyle = new Parchment.StyleAttributor('listStyle', 'list-style-type', {
    scope: Parchment.Scope.BLOCK,
    whitelist: LIST_STYLES,
});
Quill.register(ListStyle, true);

const TOOLBAR = [
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    [{ listStyle: [false, ...LIST_STYLES] }],
    ['link', 'clean'],
];

// The marker picker belongs to numbered items: on a bullet or plain line the pick
// is ignored, so a published bullet list never turns into a lettered one.
function listStyle(value) {
    const range = this.quill.getSelection();
    const formats = range == null ? {} : this.quill.getFormat(range);

    if (formats.list !== 'ordered') {
        return;
    }

    this.quill.format('listStyle', value, Quill.sources.USER);
}

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
            modules: {
                toolbar: { container: TOOLBAR, handlers: { listStyle } },
            },
            formats: FORMATS,
        });

        quillRef.current = quill;

        // Preserve inline formats (size/bold/italic/underline/strike) across Enter.
        // Quill's default handleEnter only copies block formats (list/indent).
        const keyboard = quill.getModule('keyboard');
        keyboard.addBinding({ key: 'Enter', shiftKey: null }, function (range, context) {
            const formats = quill.getFormat(range);
            const inline = {};
            Object.keys(formats).forEach((name) => {
                if (!quill.scroll.query(name, Scope.BLOCK) && !Array.isArray(formats[name])) {
                    inline[name] = formats[name];
                }
            });

            // Default handleEnter inserts \n with block formats. Let it run.
            const handled = this.quill.keyboard.bindings.Enter.find(
                (b) => b.handler.name === 'handleEnter'
            )?.handler.call(this, range, context);

            // Apply inline formats to new empty line as pending formats for next typed char.
            if (Object.keys(inline).length > 0) {
                Object.keys(inline).forEach((name) => quill.format(name, inline[name]));
            }

            return handled;
        });

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
                    // overflow-hidden would clip Quill's dropdown when it is taller
                    // than the writing area; the rounded corners live on the toolbar
                    // and container instead (see app.css).
                    'mt-1 rounded-lg border border-slate-300 bg-white',
                ].join(' ')}
            >
                <div ref={hostRef} />
            </div>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}
