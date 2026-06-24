import sanitizeHtml from 'sanitize-html';

/**
 * Allowlist tailored to parish blog content:
 *   - Paragraphs, headings (h2-h4), inline emphasis, lists, blockquotes
 *   - Links (http/https/mailto only, no javascript:)
 *   - Images (http/https only, no data:image/svg+xml — SVG can host scripts)
 *   - Line breaks
 *
 * Blocks: <script>, <style>, <iframe>, <object>, <embed>, event handlers
 * (onload, onclick…), CSS expressions, javascript: / data: URLs.
 *
 * Used in two places:
 *   1. Admin save (when the priest pastes/types HTML directly)
 *   2. AI rewriter output (model could be jailbroken to emit <script>
 *      via an attacker-controlled Facebook post)
 *
 * Both must sanitize — defense in depth.
 */
export function sanitizePostHtml(input: string): string {
  if (!input) return '';
  return sanitizeHtml(input, {
    allowedTags: [
      'p',
      'br',
      'strong',
      'b',
      'em',
      'i',
      'u',
      's',
      'sub',
      'sup',
      'mark',
      'small',
      'a',
      'ul',
      'ol',
      'li',
      'blockquote',
      'cite',
      'figure',
      'figcaption',
      'img',
      'h2',
      'h3',
      'h4',
      'hr',
      'span',
      'div',
    ],
    allowedAttributes: {
      a: ['href', 'title', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
      span: ['class'],
      div: ['class'],
      blockquote: ['cite'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesByTag: {
      img: ['http', 'https'],
    },
    allowProtocolRelative: false,
    transformTags: {
      // External links always open in new tab and never leak referrer.
      a: (tagName, attribs) => {
        const href = attribs.href || '';
        const isExternal = /^https?:\/\//i.test(href);
        return {
          tagName: 'a',
          attribs: isExternal
            ? { ...attribs, target: '_blank', rel: 'noopener noreferrer nofollow' }
            : attribs,
        };
      },
      // Force lazy + async loading on every image.
      img: (tagName, attribs) => ({
        tagName: 'img',
        attribs: { ...attribs, loading: 'lazy', decoding: 'async' },
      }),
    },
    // Strip empty tags except <br>, <hr>, <img>.
    exclusiveFilter: (frame) => {
      const SELF_CLOSING = new Set(['br', 'hr', 'img']);
      if (SELF_CLOSING.has(frame.tag)) return false;
      return !frame.text.trim() && !frame.mediaChildren.length;
    },
    disallowedTagsMode: 'discard',
  });
}

/**
 * For excerpts and short text fields: strip ALL tags. We never want HTML
 * in a meta description, OpenGraph excerpt, etc.
 */
export function sanitizeText(input: string): string {
  if (!input) return '';
  return sanitizeHtml(input, { allowedTags: [], allowedAttributes: {} }).trim();
}
