/**
 * Quill list plumbing.
 *
 * Quill keeps every list flat inside one `<ol>` container: each `<li>` carries
 * a `data-list` attribute, a `ql-indent-N` class for its depth, and a `.ql-ui`
 * span whose pseudo-element draws the marker. The marker only inherits styling
 * from its `<li>`, so formatting that lives on the spans inside the item
 * (size, bold, italic) never reaches it.
 *
 * Three jobs live here:
 * - `syncListMarkers()` mirrors uniform item formatting onto the live `<li>`
 *   while editing, so markers match the text.
 * - `normalizeQuillHtml()` converts editor markup to plain nested lists before
 *   saving (`<ul>` for bullets), dropping the editor-only plumbing. Indent
 *   depth becomes real nesting, so the published page numbers and shifts
 *   exactly like the editor instead of renumbering a flat list.
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
 *
 * A nested item sits inside the `<li>` of the item above it, so a property left
 * unset here would inherit the parent item's size, weight and style. Nested
 * items therefore always carry theirs explicitly, or they 'grow' into the
 * formatting of the item above.
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
    const nested = /\bql-indent-[1-8]\b/.test(li.className || '');

    if (uniformSize && uniformSize !== DEFAULT_SIZE) {
        li.style.fontSize = uniformSize;
    } else if (nested) {
        li.style.fontSize = DEFAULT_SIZE;
    } else {
        li.style.removeProperty('font-size');
    }

    if (bold) {
        li.style.fontWeight = '700';
    } else if (nested) {
        li.style.fontWeight = '400';
    } else {
        li.style.removeProperty('font-weight');
    }

    if (italic) {
        li.style.fontStyle = 'italic';
    } else if (nested) {
        li.style.fontStyle = 'normal';
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
        // bullets and numbers becomes separate <ul>/<ol> siblings. Indent depth
        // becomes a sub-list tucked inside the item above it, which is how the
        // published page shifts and numbers exactly like the editor instead of
        // renumbering a flat list (Word behaviour).
        const root = document.createElement(items[0].getAttribute('data-list') === 'bullet' ? 'UL' : 'OL');
        const owners = [root];

        // One quirk of Quill's flat model: a mixed list can put an indented item
        // of one kind straight after top-level items of the other kind. Depth is
        // tracked per level, and a kind change at a level opens a sibling list
        // there instead of nesting the other kind inside this one.
        const firstList = document.createElement(items[0].getAttribute('data-list') === 'bullet' ? 'UL' : 'OL');
        const containers = [firstList];

        items.forEach((item) => {
            const tag = item.getAttribute('data-list') === 'bullet' ? 'UL' : 'OL';
            let depth = Math.max(indentLevel(item), 0);

            while (containers.length < depth + 1) {
                const owner = containers[containers.length - 1].lastElementChild;

                if (!owner || owner.tagName !== 'LI') {
                    break;
                }

                const nested = document.createElement(tag);
                owner.appendChild(nested);
                containers.push(nested);
            }

            depth = Math.min(depth, containers.length - 1);
            containers.length = depth + 1;

            if (containers[depth].tagName !== tag) {
                const sibling = document.createElement(tag);
                containers[depth].parentNode.insertBefore(sibling, containers[depth].nextSibling);
                containers[depth] = sibling;
            }

            applyMarkerStyles(item);
            item.removeAttribute('data-list');
            item.removeAttribute('class');
            containers[depth].appendChild(item);
        });

        list.parentNode.insertBefore(firstList, list);
        list.remove();
    });
}

/** Depth from Quill's `ql-indent-N` class; items without one sit at the top. */
function indentLevel(item) {
    const level = item.className.match(/(?:^|\s)ql-indent-(\d+)(?=\s|$)/);
    return level ? parseInt(level[1], 10) : 0;
}
