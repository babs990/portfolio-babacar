import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { FOOTER_LINKS } from '@core/constants/footer-links';
import { TranslatePipe } from '@core/pipes/translate-pipe';
import { Logo } from '@shared/ui/logo/logo';

/** Site footer (Figma): hairline on top, logo + links on the left, copyright on the right. */
@Component({
  selector: 'app-footer',
  imports: [RouterLink, RouterLinkActive, TranslatePipe, Logo],
  templateUrl: './footer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  protected readonly links = FOOTER_LINKS;
  protected readonly year = new Date().getFullYear();
}
