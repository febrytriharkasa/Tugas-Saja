/**
 * Quill list plumbing.
 *
 * Quill keeps every list inside one `<ol>` container: each `<li>` carries a
 * `data-list` attribute and a `.ql-ui` span whose pseudo-element draws the
 * marker. The marker only inherits styling from its `<li>`, so formatting that
 * lives on the spans inside the item (size, bold, italic) never reaches it.
 *
 * Two jobs live here:
 * - `syncListMarkers()` mirrors uniform item formatting onto the live `<li>`
 *   while editing, so markers match the text.
 * - `normalizeQuillHtml()` converts editor markup to plain semantic lists
 *   before saving (`<ul>` for bullets), dropping the editor-only plumbing.
 */

// Base font size of `.rich-text-editor .ql-editor`; "growing" to it changes nothing.
const DEFAULT_SIZE = '14px';

const BOLD_TAGS = ['STRONG', 'B'];
const ITALIC_TAGS = ['EM', 'I'];

/** Text-bearing elements inside the item, with whitespace and the marker skipped. */
function textRuns(li) {
    const runs = [];
    const walker = document.createTreeWalker(li, NodeFilter.SHOW_TEXT);

    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        if (node.textContent.trim() !== '' && !node.parentElement.closest('.ql-ui')) {
            runs.push(node.parentElement);
        }
    }

    return runs;
}

function chainHasTag(element, li, tags) {
    for (let node = element; node && node !== li; node = node.parentElement) {
        if (tags.includes(node.tagName)) {
            return true;
        }
    }

    return false;
}

/** Author-picked inline size on the run, ignoring anything inherited from the `<li>`. */
function runSize(element, li) {
    for (let node = element; node && node !== li; node = node.parentElement) {
        if (node.style.fontSize) {
            return node.style.fontSize;
        }
    }

    return null;
}

/**
 * Copies item formatting onto the `<li>` itself so the marker follows it.
 * Only uniform formatting is lifted: with mixed runs on one item the copy
 * would bleed size/weight onto the runs that were left plain.
 */
function applyMarkerStyles(li) {
    const runs = textRuns(li);

    const sizes = runs.map((run) => runSize(run, li));
    const uniformSize =
        sizes.length > 0 && sizes.every((size) => size !== null && size === sizes[0])
            ? sizes[0]
            : null;

    const bold = runs.length > 0 && runs.every((run) => chainHasTag(run, li, BOLD_TAGS));
    const italic = runs.length > 0 && runs.every((run) => chainHasTag(run, li, ITALIC_TAGS));

    if (uniformSize && uniformSize !== DEFAULT_SIZE) {
        li.style.fontSize = uniformSize;
    } else {
        li.style.removeProperty('font-size');
    }

    if (bold) {
        li.style.fontWeight = '700';
    } else {
        li.style.removeProperty('font-weight');
    }

    if (italic) {
        li.style.fontStyle = 'italic';
    } else {
        li.style.removeProperty('font-style');
    }
}

/** Keeps markers in step with the text while the editor is open. */
export function syncListMarkers(root) {
    root.querySelectorAll('li[data-list]').forEach(applyMarkerStyles);
}

/** Rewrites Quill lists as semantic `<ul>`/`<ol>` and strips editor-only markup. */
export function normalizeQuillHtml(html) {
    const host = document.createElement('div');
    host.innerHTML = html;

    host.querySelectorAll('span.ql-ui').forEach((span) => span.remove());
    regroupLists(host);

    return host.innerHTML;
}

function regroupLists(host) {
    host.querySelectorAll('ol, ul').forEach((list) => {
        const items = Array.from(list.children).filter((child) => child.tagName === 'LI');

        if (!items.some((item) => item.hasAttribute('data-list'))) {
            return;
        }

        // Consecutive items of one kind share a container, so a list that mixes
        // bullets and numbers becomes separate <ul>/<ol> siblings.
        const groups = [];
        items.forEach((item) => {
            const tag = item.getAttribute('data-list') === 'bullet' ? 'UL' : 'OL';
            const last = groups[groups.length - 1];

            if (!last || last.tagName !== tag) {
                groups.push(document.createElement(tag));
            }

            const group = groups[groups.length - 1];
            applyMarkerStyles(item);
            item.removeAttribute('data-list');
            item.removeAttribute('class');
            group.appendChild(item);
        });

        groups.forEach((group) => list.parentNode.insertBefore(group, list));
        list.remove();
    });
}
