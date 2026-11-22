import { Lang, Language } from '@core/models';

export const DEFAULT_LANG: Lang = 'en';

export const LANG_STORAGE_KEY = 'portfolio.lang';

export const LANGUAGES: readonly Language[] = [
  { code: 'en', labelKey: 'common.languages.en' },
  { code: 'fr', labelKey: 'common.languages.fr' },
];
