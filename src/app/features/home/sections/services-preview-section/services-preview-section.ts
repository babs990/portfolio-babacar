import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SERVICES } from '@core/data/services';
import { TranslatePipe } from '@core/pipes/translate-pipe';
import { Button } from '@shared/ui/button/button';

@Component({
  selector: 'app-services-preview-section',
  imports: [RouterLink, TranslatePipe, Button],
  templateUrl: './services-preview-section.html',
  styleUrl: './services-preview-section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesPreviewSection {
  /** The home preview shows the first 4 services. */
  protected readonly services = SERVICES.slice(0, 4);
  /** Show the "See more → /services" button (hidden on the Services page itself). */
  readonly showMore = input(true);
}
