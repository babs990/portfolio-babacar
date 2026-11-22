export type Lang = 'en' | 'fr';

export interface Language {
  readonly code: Lang;
  /** i18n key of the short label displayed in the switch (EN / FR). */
  readonly labelKey: string;
}
