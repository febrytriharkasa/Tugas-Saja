/**
 * Build the public URL for a post based on its category slug.
 *
 * Result: /{category_slug}/{post_slug}
 * Fallback: /berita/{post_slug} when no category is loaded.
 */
export function postUrl(post) {
    const prefix = post.category?.slug;
    return `/${prefix}/${post.slug}`;
}
