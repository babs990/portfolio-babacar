import { DOCUMENT, isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import {
  afterNextRender,
  computed,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  PLATFORM_ID,
  signal,
  viewChild,
} from '@angular/core';

import { GALLERY_PHOTOS } from '@core/constants/gallery';
import { TranslatePipe } from '@core/pipes/translate-pipe';

/** Auto-advance delay (Figma brief: "every 10 seconds"). */
const AUTOPLAY_MS = 10_000;
/** Natural width of the tilted photos: reference for the per-photo scale. */
const REFERENCE_WIDTH = 696;

/**
 * Home photo gallery: a full-bleed horizontal strip that advances one position every
 * 10s with native smooth scrolling, plus prev/next arrows and dots.
 * - Native scroll + scroll-snap: swipe/trackpad for free, no per-frame JS.
 * - "Stops" are computed from the real layout so the last photo ends flush right
 *   (no empty space), and are re-measured on resize.
 * - Autoplay pauses on hover/focus, off-screen, in a hidden tab and with reduced motion;
 *   the 10s timer restarts after any manual navigation.
 */
@Component({
  selector: 'app-gallery-section',
  imports: [NgOptimizedImage, TranslatePipe],
  templateUrl: './gallery-section.html',
  styleUrl: './gallery-section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GallerySection {
  protected readonly photos = GALLERY_PHOTOS;
  protected readonly referenceWidth = REFERENCE_WIDTH;
  /** Scroll positions the carousel can rest on (one dot each). */
  protected readonly stops = signal<readonly number[]>([0]);
  protected readonly active = signal(0);
  /** Arrows are strictly directional: ‹ disabled at the start, › disabled at the end. */
  protected readonly atStart = computed(() => this.active() === 0);
  protected readonly atEnd = computed(() => this.active() >= this.stops().length - 1);

  private readonly track = viewChild.required<ElementRef<HTMLElement>>('track');
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private timer: ReturnType<typeof setTimeout> | undefined;
  private visible = false;
  private hovering = false;
  private focused = false;
  private reducedMotion = false;
  /** True while a programmatic smooth scroll runs (dots must not flicker). */
  private programmatic = false;

  constructor() {
    afterNextRender(() => {
      if (this.isBrowser) this.setup();
    });
    this.destroyRef.onDestroy(() => this.clearTimer());
  }

  /** ‹ button: always moves back, never wraps. */
  protected previous(): void {
    if (!this.atStart()) this.goTo(this.active() - 1);
  }

  /** › button: always moves forward, never wraps. */
  protected next(): void {
    if (!this.atEnd()) this.goTo(this.active() + 1);
  }

  /** Autoplay: forward, then back to the first photo after the last one. */
  private advance(): void {
    this.goTo(this.atEnd() ? 0 : this.active() + 1);
  }

  /** Scrolls to a stop (index wrapped into range) and restarts the 10s timer. */
  protected goTo(index: number): void {
    const stops = this.stops();
    if (!stops.length) return;
    const i = (index + stops.length) % stops.length;
    this.active.set(i);
    this.programmatic = !this.reducedMotion;
    this.track().nativeElement.scrollTo({
      left: stops[i],
      behavior: this.reducedMotion ? 'auto' : 'smooth',
    });
    this.schedule();
  }

  protected setHovering(value: boolean): void {
    this.hovering = value;
    this.schedule();
  }

  /** Keyboard focus only (a mouse click on an arrow must not stop the autoplay). */
  protected onFocusIn(event: FocusEvent): void {
    const target = event.target;
    this.focused = target instanceof Element && target.matches(':focus-visible');
    this.schedule();
  }

  protected onFocusOut(): void {
    this.focused = false;
    this.schedule();
  }

  private setup(): void {
    const el = this.track().nativeElement;
    const view = this.document.defaultView;
    this.reducedMotion = !!view?.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    // Measure the reachable stops (and keep them right on resize).
    const measure = () => {
      const items = Array.from(el.children) as HTMLElement[];
      if (!items.length) return;
      const origin = items[0].offsetLeft;
      const max = Math.max(0, el.scrollWidth - el.clientWidth);
      const step = items.length > 1 ? items[1].offsetLeft - origin : el.clientWidth;
      const stops: number[] = [];
      for (const item of items) {
        const left = Math.min(item.offsetLeft - origin, max);
        const last = stops[stops.length - 1];
        if (last === undefined || left - last > step / 2) stops.push(left);
        else if (left === max) stops[stops.length - 1] = max; // snap the final stop to the end
        if (left >= max) break;
      }
      this.stops.set(stops);
      this.syncActive();
    };

    // Keep the active dot in sync with manual scrolling (rAF-throttled).
    let frame = 0;
    const onScroll = () => {
      if (this.programmatic || frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        this.syncActive();
      });
    };
    const onScrollEnd = () => {
      this.programmatic = false;
      this.syncActive();
      this.schedule();
    };
    const onVisibility = () => this.schedule();

    el.addEventListener('scroll', onScroll, { passive: true });
    el.addEventListener('scrollend', onScrollEnd);
    this.document.addEventListener('visibilitychange', onVisibility);

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(el);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      this.visible = !!entry?.isIntersecting;
      this.schedule();
    });
    intersectionObserver.observe(this.host);

    this.destroyRef.onDestroy(() => {
      cancelAnimationFrame(frame);
      el.removeEventListener('scroll', onScroll);
      el.removeEventListener('scrollend', onScrollEnd);
      this.document.removeEventListener('visibilitychange', onVisibility);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    });
  }

  /** Active dot = stop nearest to the current scroll position. */
  private syncActive(): void {
    const left = this.track().nativeElement.scrollLeft;
    const stops = this.stops();
    let nearest = 0;
    stops.forEach((stop, i) => {
      if (Math.abs(stop - left) < Math.abs(stops[nearest] - left)) nearest = i;
    });
    if (nearest !== this.active()) this.active.set(nearest);
  }

  /** (Re)starts the autoplay timer when every condition allows it. */
  private schedule(): void {
    this.clearTimer();
    const canPlay =
      !this.reducedMotion &&
      this.visible &&
      !this.hovering &&
      !this.focused &&
      !this.document.hidden &&
      this.stops().length > 1;
    if (canPlay) this.timer = setTimeout(() => this.advance(), AUTOPLAY_MS);
  }

  private clearTimer(): void {
    clearTimeout(this.timer);
    this.timer = undefined;
  }
}
