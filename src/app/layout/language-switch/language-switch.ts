import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { TranslatePipe } from '@core/pipes/translate-pipe';
import { I18n } from '@core/services/i18n';

@Component({
  selector: 'app-language-switch',
  imports: [TranslatePipe],
  templateUrl: './language-switch.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitch {
  protected readonly i18n = inject(I18n);
}
