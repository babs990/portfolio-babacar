import { inject, Pipe, PipeTransform } from '@angular/core';

import { I18n, TranslateParams } from '@core/services/i18n';

/**
 * `{{ 'nav.home' | translate }}`, with params: `{{ 'a.b' | translate: { n: 3 } }}` (`{n}` in the value)
 * Impure so it re-evaluates on language change; the signal read inside `t()`
 * is tracked by the template, which also schedules change detection (zoneless).
 */
@Pipe({ name: 'translate', pure: false })
export class TranslatePipe implements PipeTransform {
  private readonly i18n = inject(I18n);

  transform(key: string, params?: TranslateParams): string {
    return this.i18n.t(key, params);
  }
}
