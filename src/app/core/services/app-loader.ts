import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, Router } from '@angular/router';
import { filter, firstValueFrom, take } from 'rxjs';

/** Never keep the splash longer than this, even on a slow network. */
const MAX_WAIT_MS = 5000;

/**
 * Lifts the splash screen (`#app-loader` in index.html, styles/loader.css) once the
 * first page is really ready: first route rendered (lazy chunk), web fonts loaded
 * and the priority (LCP) images decoded. Avoids the half-laid-out first paint
 * (header + footer stacked while the lazy page is still loading).
 */
@Injectable({ providedIn: 'root' })
export class AppLoader {
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /** Called once from `App` (constructor). */
  async hideWhenReady(): Promise<void> {
    if (!this.isBrowser) return;
    await Promise.race([this.ready(), wait(MAX_WAIT_MS)]);
    this.hide();
  }

  private async ready(): Promise<void> {
    await firstValueFrom(
      this.router.events.pipe(
        filter(
          (e) =>
            e instanceof NavigationEnd ||
            e instanceof NavigationCancel ||
            e instanceof NavigationError,
        ),
        take(1),
      ),
    );
    // Let the routed page render its first frame.
    await nextFrame();
    const images = Array.from(
      this.document.querySelectorAll<HTMLImageElement>('main img[fetchpriority="high"]'),
    );
    await Promise.all([
      this.document.fonts?.ready,
      ...images.map((img) => img.decode().catch(() => undefined)),
    ]);
  }

  private hide(): void {
    const loader = this.document.getElementById('app-loader');
    this.document.documentElement.classList.remove('is-loading');
    if (!loader) return;
    loader.classList.add('is-done');
    loader.addEventListener('transitionend', () => loader.remove(), { once: true });
    // Fallback when transitions are disabled (reduced motion, hidden tab).
    setTimeout(() => loader.remove(), 1000);
  }
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function nextFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}
