import { inject, Injectable, signal } from '@angular/core';

import { SEARCH_INDEX } from '@core/constants/search-index';
import { SearchEntry } from '@core/models';
import { I18n } from '@core/services/i18n';

const DEFAULT_LIMIT = 8;

/**
 * Keyword search over SEARCH_INDEX (no full-text): suggests pages/sections whose
 * title or keywords match every typed term. Case- and accent-insensitive, and
 * keywords are matched in all languages.
 */
@Injectable({ providedIn: 'root' })
export class Search {
  private readonly i18n = inject(I18n);

  /** Search dialog visibility (opened from the header or with Ctrl/Cmd+K). */
  readonly isOpen = signal(false);

  open(): void {
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }

  toggle(): void {
    this.isOpen.update((open) => !open);
  }

  /** Ranked entries for `query`. Empty query → the pages, as default suggestions. */
  find(query: string, limit = DEFAULT_LIMIT): readonly SearchEntry[] {
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    if (!terms.length) return SEARCH_INDEX.filter((e) => !e.fragment).slice(0, limit);

    return SEARCH_INDEX.map((entry) => ({ entry, score: this.score(entry, terms) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((r) => r.entry);
  }

  /** 0 if any term is missing, otherwise higher for title and prefix matches. */
  private score(entry: SearchEntry, terms: string[]): number {
    const title = normalize(this.i18n.t(entry.titleKey));
    const keywords = this.i18n
      .tAll(entry.keywordsKey)
      .flatMap((list) => list.split(','))
      .map(normalize)
      .filter(Boolean);

    let total = 0;
    for (const term of terms) {
      let best = 0;
      if (title.startsWith(term)) best = 4;
      else if (title.includes(term)) best = 3;
      for (const keyword of keywords) {
        if (best >= 2) break;
        if (keyword.startsWith(term) || keyword.includes(' ' + term)) best = 2;
        else if (keyword.includes(term)) best = 1;
      }
      if (!best) return 0;
      total += best;
    }
    return total;
  }
}

/** Lowercase, trimmed, without diacritics ("À propos" → "a propos"). */
export function normalize(value: string): string {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}
