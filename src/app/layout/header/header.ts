import { ChangeDetectionStrategy, Component, ElementRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';

import { NAV_ITEMS } from '@core/constants/nav-items';
import { TranslatePipe } from '@core/pipes/translate-pipe';
import { Search } from '@core/services/search';
import { LanguageSwitch } from '@layout/language-switch/language-switch';
import { Logo } from '@shared/ui/logo/logo';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, TranslatePipe, LanguageSwitch, Logo],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'closeAll()',
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class Header {
  protected readonly navItems = NAV_ITEMS;
  /** Mobile menu (below lg). */
  protected readonly menuOpen = signal(false);
  /** Path of the open desktop dropdown (Projects), or null. */
  protected readonly openSubmenu = signal<string | null>(null);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly search = inject(Search);

  constructor() {
    // Close menus after every navigation.
    inject(Router)
      .events.pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.closeAll());
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected toggleSubmenu(path: string): void {
    this.openSubmenu.update((current) => (current === path ? null : path));
  }

  protected closeAll(): void {
    this.menuOpen.set(false);
    this.openSubmenu.set(null);
  }

  protected onDocumentClick(event: MouseEvent): void {
    if (this.openSubmenu() && !this.host.nativeElement.contains(event.target as Node)) {
      this.openSubmenu.set(null);
    }
  }

  protected openSearch(): void {
    this.closeAll();
    this.search.open();
  }
}
