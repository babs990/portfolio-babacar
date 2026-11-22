import { DOCUMENT, ViewportScroller } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  Injector,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';

import { SearchEntry } from '@core/models';
import { TranslatePipe } from '@core/pipes/translate-pipe';
import { Search } from '@core/services/search';

/**
 * Search modal with live suggestions (combobox + listbox pattern).
 * - Opens from the header button or Ctrl/Cmd+K; closes on Esc, backdrop click or selection.
 * - ↑/↓ moves the active suggestion, Enter opens it (page + section anchor).
 * - Custom modal (not <dialog>.showModal()) so the custom cursor stays above it.
 */
@Component({
  selector: 'app-search-dialog',
  imports: [TranslatePipe],
  templateUrl: './search-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown)': 'onDocumentKeydown($event)' },
})
export class SearchDialog {
  protected readonly search = inject(Search);
  protected readonly query = signal('');
  protected readonly results = computed(() => this.search.find(this.query()));
  protected readonly activeIndex = signal(0);

  private readonly input = viewChild<ElementRef<HTMLInputElement>>('input');
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly scroller = inject(ViewportScroller);
  private readonly injector = inject(Injector);
  private previousFocus: HTMLElement | null = null;

  constructor() {
    effect(() => {
      const open = this.search.isOpen();
      untracked(() => (open ? this.onOpen() : this.onClose()));
    });
  }

  protected onInput(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
    this.activeIndex.set(0);
  }

  protected onInputKeydown(event: KeyboardEvent): void {
    const count = this.results().length;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (count) this.activeIndex.update((i) => (i + 1) % count);
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (count) this.activeIndex.update((i) => (i - 1 + count) % count);
        break;
      case 'Enter': {
        event.preventDefault();
        const entry = this.results()[this.activeIndex()];
        if (entry) this.go(entry);
        break;
      }
      case 'Tab':
        // Focus stays in the field: suggestions are reached with the arrows.
        event.preventDefault();
        break;
    }
  }

  protected onDocumentKeydown(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.search.toggle();
    } else if (event.key === 'Escape' && this.search.isOpen()) {
      this.search.close();
    }
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.search.close();
  }

  protected go(entry: SearchEntry): void {
    this.previousFocus = null; // Navigating: don't send focus back to the trigger.
    this.search.close();

    const tree = this.router.createUrlTree([entry.path], { fragment: entry.fragment });
    const alreadyThere = this.router.isActive(tree, {
      paths: 'exact',
      fragment: 'exact',
      queryParams: 'ignored',
      matrixParams: 'ignored',
    });
    // Same URL: the router ignores the navigation, so scroll ourselves.
    if (alreadyThere && entry.fragment) this.scroller.scrollToAnchor(entry.fragment);
    else void this.router.navigateByUrl(tree);
  }

  private onOpen(): void {
    const active = this.document.activeElement;
    this.previousFocus = active instanceof HTMLElement ? active : null;
    this.query.set('');
    this.activeIndex.set(0);
    this.document.documentElement.classList.add('overflow-hidden');
    afterNextRender(() => this.input()?.nativeElement.focus(), { injector: this.injector });
  }

  private onClose(): void {
    this.document.documentElement.classList.remove('overflow-hidden');
    this.previousFocus?.focus();
    this.previousFocus = null;
  }
}
