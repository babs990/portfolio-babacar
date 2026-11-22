import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';

import { TranslatePipe } from '@core/pipes/translate-pipe';

export type ShareMenuPlacement = 'down' | 'up' | 'left';

/**
 * "Share" button + menu: native share sheet (when available), copy link, LinkedIn,
 * WhatsApp and e-mail. Closes on outside click / Escape; "Link copied!" feedback.
 */
@Component({
  selector: 'app-share-menu',
  imports: [TranslatePipe],
  templateUrl: './share-menu.html',
  styleUrl: './share-menu.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'relative inline-flex',
    '(document:click)': 'onDocumentClick($event)',
    '(keydown.escape)': 'open.set(false)',
  },
})
export class ShareMenu {
  readonly url = input.required<string>();
  readonly title = input.required<string>();
  /** Message placed before the link (WhatsApp, e-mail, native share). */
  readonly text = input('');
  /** Icon-only round button (side rail). */
  readonly compact = input(false);
  readonly placement = input<ShareMenuPlacement>('down');
  /** `outline` on light backgrounds, `light` (cream fill) on dark ones. */
  readonly variant = input<'outline' | 'light'>('outline');

  protected readonly open = signal(false);
  protected readonly copied = signal(false);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly navigator = inject(DOCUMENT).defaultView?.navigator;
  protected readonly canNativeShare = typeof this.navigator?.share === 'function';
  private copiedTimer: ReturnType<typeof setTimeout> | undefined;

  protected readonly linkedinUrl = computed(
    () => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(this.url())}`,
  );
  protected readonly whatsappUrl = computed(
    () => `https://wa.me/?text=${encodeURIComponent(`${this.text()} ${this.url()}`.trim())}`,
  );
  protected readonly mailUrl = computed(
    () =>
      `mailto:?subject=${encodeURIComponent(this.title())}&body=${encodeURIComponent(
        `${this.text()}\n\n${this.url()}`.trim(),
      )}`,
  );

  protected toggle(): void {
    this.open.update((o) => !o);
  }

  protected async nativeShare(): Promise<void> {
    this.open.set(false);
    try {
      await this.navigator?.share({ title: this.title(), text: this.text(), url: this.url() });
    } catch {
      // Cancelled by the user: nothing to do.
    }
  }

  protected async copyLink(): Promise<void> {
    try {
      await this.navigator?.clipboard.writeText(this.url());
    } catch {
      this.legacyCopy(this.url());
    }
    this.open.set(false);
    this.copied.set(true);
    clearTimeout(this.copiedTimer);
    this.copiedTimer = setTimeout(() => this.copied.set(false), 2200);
  }

  protected onDocumentClick(event: MouseEvent): void {
    if (this.open() && !this.host.contains(event.target as Node)) this.open.set(false);
  }

  /** Fallback for browsers without the async Clipboard API (or insecure contexts). */
  private legacyCopy(value: string): void {
    const doc = this.host.ownerDocument;
    const area = doc.createElement('textarea');
    area.value = value;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    doc.body.appendChild(area);
    area.select();
    doc.execCommand('copy');
    area.remove();
  }
}
