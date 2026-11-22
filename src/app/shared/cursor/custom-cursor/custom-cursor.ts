import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  NgZone,
  PLATFORM_ID,
  viewChild,
} from '@angular/core';

const INTERACTIVE_SELECTOR = 'a, button, [data-cursor="hover"]';
const ENABLE_QUERY =
  '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';
const DEFAULT_LAG = 0.15;

/**
 * Decorative custom cursor: a thin ring that sticks to the pointer and a small
 * dot that follows it with a lerp delay (factor read from --cursor-lag).
 *
 * - The native cursor stays visible.
 * - Runs entirely outside Angular (rAF loop + DOM class toggles): no change detection.
 * - Only on fine pointers without reduced motion; re-evaluated if the media query changes.
 * - SSR-safe: nothing touches window/document outside the browser.
 */
@Component({
  selector: 'app-custom-cursor',
  templateUrl: './custom-cursor.html',
  styleUrl: './custom-cursor.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomCursor {
  private readonly ring = viewChild.required<ElementRef<HTMLElement>>('ring');
  private readonly dot = viewChild.required<ElementRef<HTMLElement>>('dot');

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly document = inject(DOCUMENT);
  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private stop: (() => void) | null = null;

  constructor() {
    afterNextRender(() => {
      if (!this.isBrowser) return;
      const view = this.document.defaultView;
      if (!view || typeof view.matchMedia !== 'function') return;

      const query = view.matchMedia(ENABLE_QUERY);
      const sync = () => {
        this.stop?.();
        this.stop = query.matches ? this.zone.runOutsideAngular(() => this.start(view)) : null;
      };

      sync();
      query.addEventListener('change', sync);
      this.destroyRef.onDestroy(() => {
        query.removeEventListener('change', sync);
        this.stop?.();
      });
    });
  }

  /** Starts listeners + rAF loop. Returns a teardown function. */
  private start(view: Window): () => void {
    const host = this.host.nativeElement;
    const ring = this.ring().nativeElement;
    const dot = this.dot().nativeElement;

    const lagValue = parseFloat(view.getComputedStyle(host).getPropertyValue('--cursor-lag'));
    const lag = lagValue > 0 && lagValue <= 1 ? lagValue : DEFAULT_LAG;

    const mouse = { x: 0, y: 0 };
    const dotPos = { x: 0, y: 0 };
    let hasPosition = false;
    let frame = 0;

    // The rAF loop only runs while the dot is catching up: it stops once settled
    // and is restarted by the next pointer move (no idle 60fps work).
    const render = () => {
      dotPos.x += (mouse.x - dotPos.x) * lag;
      dotPos.y += (mouse.y - dotPos.y) * lag;
      const settled = Math.abs(mouse.x - dotPos.x) < 0.1 && Math.abs(mouse.y - dotPos.y) < 0.1;
      if (settled) {
        dotPos.x = mouse.x;
        dotPos.y = mouse.y;
      }
      ring.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
      dot.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0)`;
      frame = settled ? 0 : view.requestAnimationFrame(render);
    };

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!hasPosition) {
        // First event: snap the dot to avoid a slide from the top-left corner.
        dotPos.x = mouse.x;
        dotPos.y = mouse.y;
        hasPosition = true;
      }
      host.classList.add('is-visible');
      if (!frame) frame = view.requestAnimationFrame(render);
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target instanceof Element ? e.target : null;
      host.classList.toggle('is-hover', !!target?.closest(INTERACTIVE_SELECTOR));
    };

    const onDown = () => host.classList.add('is-pressed');
    const onUp = () => host.classList.remove('is-pressed');
    const onLeave = () => host.classList.remove('is-visible', 'is-pressed');

    const doc = this.document;
    const opts: AddEventListenerOptions = { passive: true };
    doc.addEventListener('pointermove', onMove, opts);
    doc.addEventListener('pointerover', onOver, opts);
    doc.addEventListener('pointerdown', onDown, opts);
    doc.addEventListener('pointerup', onUp, opts);
    doc.documentElement.addEventListener('pointerleave', onLeave, opts);
    view.addEventListener('blur', onLeave);

    return () => {
      view.cancelAnimationFrame(frame);
      doc.removeEventListener('pointermove', onMove);
      doc.removeEventListener('pointerover', onOver);
      doc.removeEventListener('pointerdown', onDown);
      doc.removeEventListener('pointerup', onUp);
      doc.documentElement.removeEventListener('pointerleave', onLeave);
      view.removeEventListener('blur', onLeave);
      host.classList.remove('is-visible', 'is-hover', 'is-pressed');
    };
  }
}
