import { isHtml } from '@/lib/content';

/**
 * Renders post/page content, whether it is rich text from the editor or the
 * plain text written before the editor existed. Plain text keeps its line
 * breaks; HTML is injected after the server-side purifier has cleaned it.
 */
export default function RichContent({ html, className = '' }) {
    if (!html) {
        return null;
    }

    if (!isHtml(html)) {
        return <div className={`whitespace-pre-line ${className}`}>{html}</div>;
    }

    return <div className={`rich-text ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}
