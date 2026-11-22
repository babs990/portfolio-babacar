/**
 * A search target: typing one of its keywords suggests it, choosing it
 * redirects to `path#fragment`.
 * Text is i18n-driven: `keywordsKey` resolves to a comma-separated keyword list
 * in each language (both languages are matched, whatever the UI language).
 */
export interface SearchEntry {
  readonly id: string;
  /** Label shown in the suggestions list. */
  readonly titleKey: string;
  /** Label of the destination page, shown next to the title. */
  readonly pageKey: string;
  /** i18n key whose value is a comma-separated list of keywords. */
  readonly keywordsKey: string;
  readonly path: string;
  /** Section id on the target page (sections expose `id="<name>"`). No fragment = whole page. */
  readonly fragment?: string;
}
