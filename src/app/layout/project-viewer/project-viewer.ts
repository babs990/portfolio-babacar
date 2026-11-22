import { DOCUMENT, NgOptimizedImage } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  Injector,
  untracked,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { TranslatePipe } from '@core/pipes/translate-pipe';
import { ProjectViewer } from '@core/services/project-viewer';
import { Button } from '@shared/ui/button/button';
import { ShareMenu } from '@shared/ui/share-menu/share-menu';

/**
 * Behance-style project viewer (mounted once in app.html, driven by `ProjectViewer`):
 * dark backdrop, close button, a paper sheet with the project header (title, author, role,
 * field, year, share), the case-study slides stacked edge to edge, then an end block
 * (share + contact). The whole overlay scrolls; a thin progress bar follows the reading.
 */
@Component({
  selector: 'app-project-viewer',
  imports: [NgOptimizedImage, RouterLink, TranslatePipe, Button, ShareMenu],
  templateUrl: './project-viewer.html',
  styleUrl: './project-viewer.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectViewerOverlay {
  protected readonly viewer = inject(ProjectViewer);

  private readonly scroller = viewChild<ElementRef<HTMLElement>>('scroller');
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private previousFocus: HTMLElement | null = null;

  constructor() {
    effect(() => {
      const open = !!this.viewer.project();
      untracked(() => (open ? this.onOpen() : this.onClose()));
    });
  }

  protected close(): void {
    this.viewer.close();
  }

  /** Clicking the dark area around the sheet closes the viewer (like Behance). */
  protected onBackdropClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.hasAttribute('data-viewer-dismiss')) this.close();
  }

  private onOpen(): void {
    const active = this.document.activeElement;
    this.previousFocus = active instanceof HTMLElement ? active : null;
    this.document.documentElement.classList.add('overflow-hidden');
    afterNextRender(
      () => {
        const el = this.scroller()?.nativeElement;
        if (!el) return;
        el.scrollTop = 0;
        el.focus({ preventScroll: true }); // arrows / space scroll the case study
      },
      { injector: this.injector },
    );
  }

  private onClose(): void {
    this.document.documentElement.classList.remove('overflow-hidden');
    this.previousFocus?.focus({ preventScroll: true });
    this.previousFocus = null;
  }
}
