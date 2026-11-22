import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  PLATFORM_ID,
} from '@angular/core';

import { TranslatePipe } from '@core/pipes/translate-pipe';

interface Pillar {
  /** Display number ("01"). */
  readonly n: string;
  /** Key under `services.method.items`. */
  readonly id: string;
}

/** Left column: 01, 02 — right column: 03, 04 (Figma). */
const LEFT: readonly Pillar[] = [
  { n: '01', id: 'understand' },
  { n: '02', id: 'listen' },
];
const RIGHT: readonly Pillar[] = [
  { n: '03', id: 'test' },
  { n: '04', id: 'build' },
];

/**
 * Services "4 essential pillars" (id `method`, target of the header "My process ↓" button):
 * circular portrait in the middle, two pillars on each side, each linked to the circle by
 * a dashed arrow. The arrows draw themselves from the circle once the section is in view.
 */
@Component({
  selector: 'app-method-section',
  imports: [NgOptimizedImage, TranslatePipe],
  templateUrl: './method-section.html',
  styleUrl: './method-section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class MethodSection {
  protected readonly left = LEFT;
  protected readonly right = RIGHT;

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
    const destroyRef = inject(DestroyRef);

    // Reveal once (adds `is-revealed`); without IntersectionObserver, show immediately.
    afterNextRender(() => {
      if (!isBrowser) return;
      if (typeof IntersectionObserver === 'undefined') {
        host.classList.add('is-revealed');
        return;
      }
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          host.classList.add('is-revealed');
          observer.disconnect();
        },
        { rootMargin: '0px 0px -15% 0px' },
      );
      observer.observe(host);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
