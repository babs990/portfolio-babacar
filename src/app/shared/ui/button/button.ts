import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type ButtonVariant = 'primary' | 'light';

/**
 * Pill button, 52px tall, semibold 14px, smooth hover (see `btn-primary` / `btn-light`).
 * Attribute component: `<a appButton routerLink="/contact">` or `<button appButton type="button">`.
 * - `variant="primary"` (default): burgundy fill, for cream backgrounds.
 * - `variant="light"`: cream fill + burgundy text, for burgundy backgrounds.
 * Width comes from content + padding; add e.g. `class="min-w-[12.875rem]"` at the call site.
 */
@Component({
  selector: 'a[appButton], button[appButton]',
  templateUrl: './button.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'inline-flex h-13 items-center justify-center gap-2.5 rounded-pill px-7 text-sm font-semibold',
    '[class.btn-primary]': "variant() === 'primary'",
    '[class.btn-light]': "variant() === 'light'",
  },
})
export class Button {
  readonly variant = input<ButtonVariant>('primary');
}
