import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { computed, effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

import { DEFAULT_LANG, LANG_STORAGE_KEY, LANGUAGES } from '@core/constants/languages';
import { Lang } from '@core/models';
import en from '@assets/i18n/en.json';
import fr from '@assets/i18n/fr.json';

export type TranslateParams = Readonly<Record<string, string | number>>;

type Dictionary = { readonly [key: string]: string | Dictionary };

const DICTIONARIES: Record<Lang, Dictionary> = { en, fr };

/**
 * Minimal signal-based i18n (no dependency).
 * - `lang` is the current language; `setLang` switches it.
 * - `t('nav.home')` resolves a dotted key; falls back to English, then to the key itself.
 * - The choice is persisted in localStorage and mirrored on <html lang>.
 */
@Injectable({ providedIn: 'root' })
export class I18n {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly _lang = signal<Lang>(this.readStoredLang());

  readonly lang = this._lang.asReadonly();
  readonly languages = LANGUAGES;
  private readonly dictionary = computed(() => DICTIONARIES[this._lang()]);

  constructor() {
    effect(() => {
      const lang = this._lang();
      this.document.documentElement.lang = lang;
      if (this.isBrowser) {
        try {
          localStorage.setItem(LANG_STORAGE_KEY, lang);
        } catch {
          // Storage unavailable (private mode, blocked cookies): ignore.
        }
      }
    });
  }

  setLang(lang: Lang): void {
    this._lang.set(lang);
  }

  /** Resolves a dotted key. `{name}` placeholders are replaced by `params.name`. */
  t(key: string, params?: TranslateParams): string {
    const value = lookup(this.dictionary(), key) ?? lookup(DICTIONARIES[DEFAULT_LANG], key) ?? key;
    return params ? interpolate(value, params) : value;
  }

  /** Value of a key in every language (e.g. search keywords matched in EN and FR). */
  tAll(key: string): string[] {
    return LANGUAGES.map((l) => lookup(DICTIONARIES[l.code], key)).filter(
      (v): v is string => v !== undefined,
    );
  }

  private readStoredLang(): Lang {
    if (!this.isBrowser) return DEFAULT_LANG;
    try {
      const stored = localStorage.getItem(LANG_STORAGE_KEY);
      return isLang(stored) ? stored : DEFAULT_LANG;
    } catch {
      return DEFAULT_LANG;
    }
  }
}

function interpolate(value: string, params: TranslateParams): string {
  return value.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match,
  );
}

function isLang(value: unknown): value is Lang {
  return LANGUAGES.some((l) => l.code === value);
}

function lookup(dict: Dictionary, key: string): string | undefined {
  let node: string | Dictionary | undefined = dict;
  for (const part of key.split('.')) {
    if (typeof node !== 'object') return undefined;
    node = node[part];
  }
  return typeof node === 'string' ? node : undefined;
}
