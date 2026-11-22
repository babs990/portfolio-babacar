import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { SocialLink } from '@core/models';
import { TranslatePipe } from '@core/pipes/translate-pipe';

export type SocialIconSize = 'md' | 'sm';

/**
 * Round social button with the platform glyph; opens the profile in a new tab.
 * - `size="md"` (default): 52px filled primary (hero).
 * - `size="sm"`: 40px outlined (contact section, footer).
 */
@Component({
  selector: 'app-social-icon-button',
  imports: [TranslatePipe],
  templateUrl: './social-icon-button.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex' },
})
export class SocialIconButton {
  readonly link = input.required<SocialLink>();
  readonly size = input<SocialIconSize>('md');
}
