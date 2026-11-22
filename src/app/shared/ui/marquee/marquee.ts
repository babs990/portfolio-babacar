import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  PLATFORM_ID,
} from '@angular/core';

import { TranslatePipe } from '@core/pipes/translate-pipe';

/** Copies of the item list in the track. The track slides by -50% (= 2 copies). */
const COPIES = [0, 1, 2, 3] as const;

/**
 * Infinite horizontal scroller, built for performance:
 * - Pure CSS animation of `transform` only → runs on the compositor (GPU), no JS per frame,
 *   no layout/paint while scrolling.
 * - Seamless loop: the list is rendered 4 times and the track moves by exactly 2 copies.
 * - Paused while off-screen (IntersectionObserver), static with prefers-reduced-motion.
 * - Only the first copy is exposed to assistive tech.
 * Speed: `--duration-marquee` (one loop). Spacing: `--marquee-gap`.
 */
@Component({
  selector: 'app-marquee',
  imports: [TranslatePipe],
  templateUrl: './marquee.html',
  styleUrl: './marquee.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Marquee {
  /** i18n keys of the items. */
  readonly items = input.required<readonly string[]>();

  protected readonly copies = COPIES;

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (!isBrowser || typeof IntersectionObserver === 'undefined') return;
      // Direct class toggle: no signal, no change detection.
      const observer = new IntersectionObserver(([entry]) =>
        host.classList.toggle('is-paused', !entry?.isIntersecting),
      );
      observer.observe(host);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
