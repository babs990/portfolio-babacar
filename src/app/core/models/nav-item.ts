/** A header navigation entry. Labels are i18n keys, never raw text. */
export interface NavItem {
  readonly labelKey: string;
  readonly path: string;
  /** Exact-match active state (true for the home link). */
  readonly exact?: boolean;
  /** Optional submenu (e.g. Projects). */
  readonly children?: readonly NavItem[];
}
