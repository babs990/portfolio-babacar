/** A professional experience (About page timeline). Text fields are i18n keys. */
export interface Experience {
  readonly id: string;
  /** Start month, `YYYY-MM`. */
  readonly start: string;
  /** End month, `YYYY-MM`, or `null` while ongoing. */
  readonly end: string | null;
  readonly roleKey: string;
  readonly companyKey: string;
}
