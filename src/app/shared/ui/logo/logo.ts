import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * TEMPORARY text wordmark of the "bndigit" logo (Outfit, two colors).
 * To be replaced by the official SVG once provided.
 * The brand name is not translated, so it is the one allowed literal.
 */
@Component({
  selector: 'app-logo',
  templateUrl: './logo.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex' },
})
export class Logo {}
