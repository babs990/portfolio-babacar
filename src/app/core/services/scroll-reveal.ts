import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

/** Sections animated on scroll (every page). Opt out with `data-reveal="off"`. */
const SELECTOR = 'main section:not([data-reveal])';

/**
 * Global "appear on scroll" for page sections, built to stay cheap:
 * - ONE IntersectionObserver for the whole site; each section is unobserved once revealed.
 * - A MutationObserver on <main> picks up sections rendered later (route changes, @if,
 *   filters), batched in one rAF → nothing to add when creating new pages or sections.
 * - Sections already in the viewport when found are shown at once (no flash, no layout
 *   shift); the others get `.reveal` (hidden) and `.is-revealed` when they enter.
 * - The animation itself is CSS (opacity + transform only: compositor-friendly).
 * - Disabled with prefers-reduced-motion, without IntersectionObserver, or on the server.
 */
@Injectable({ providedIn: 'root' })
export class ScrollReveal {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private started = false;

  start(): void {
    const view = this.document.defaultView;
    if (this.started || !this.isBrowser || !view || typeof IntersectionObserver === 'undefined') {
      return;
    }
    if (view.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    this.started = true;

    const intersection = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-revealed');
          intersection.unobserve(entry.target);
        }
      },
      // Fires when a section is ~10% inside the viewport (fast, but not at the very edge).
      { rootMargin: '0px 0px -10% 0px' },
    );

    const scan = () => {
      const limit = view.innerHeight;
      for (const section of Array.from(this.document.querySelectorAll<HTMLElement>(SELECTOR))) {
        section.dataset['reveal'] = 'on';
        // Already visible (top of the page): leave it as is, it has its own entrance.
        if (section.getBoundingClientRect().top < limit * 0.9) continue;
        section.classList.add('reveal');
        intersection.observe(section);
      }
    };

    let frame = 0;
    const schedule = () => {
      if (!frame) {
        frame = view.requestAnimationFrame(() => {
          frame = 0;
          scan();
        });
      }
    };

    const main = this.document.querySelector('main');
    if (main) new MutationObserver(schedule).observe(main, { childList: true, subtree: true });
    schedule();
  }
}
