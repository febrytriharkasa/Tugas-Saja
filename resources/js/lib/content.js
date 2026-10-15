/**
 * Rich text helpers for post/page content.
 *
 * Content written before the rich editor existed is plain text with newlines.
 * It must keep rendering as text (not HTML), so every consumer goes through
 * `isHtml()` first and only then decides between markup and pre-line text.
 */

const HTML_TAG = /<(p|br|strong|b|em|i|u|s|ol|ul|li|h[1-6]|blockquote|span|a|div)\b[^>]*>/i;

export function isHtml(value) {
    return typeof value === 'string' && HTML_TAG.test(value);
}

/** Tag-stripped version for excerpts, reading time and meta descriptions. */
export function plainText(value) {
    if (typeof value !== 'string') {
        return '';
    }

    return value
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/\s+/g, ' ')
        .trim();
}

/** Plain text converted to paragraphs, so the editor can load legacy content. */
export function toParagraphs(value) {
    if (typeof value !== 'string' || value.trim() === '') {
        return '';
    }

    if (isHtml(value)) {
        return value;
    }

    return value
        .split(/\r?\n\s*\r?\n/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
        .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
        .join('');
}

export function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
