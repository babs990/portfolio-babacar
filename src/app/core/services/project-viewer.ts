import { DOCUMENT, Location } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';

import { PROJECTS } from '@core/data/projects';
import { Project } from '@core/models';

/**
 * Behance-style project viewer state.
 *
 * - From a card (`open(slug)`): the viewer opens OVER the current page and the URL becomes
 *   `/projects/:slug` through `Location.go` (no router navigation, so the page underneath
 *   stays as is). Closing goes `back()` in history; the browser Back button closes it too.
 * - From a direct link (`/projects/:slug` route → `open(slug, false)`): the viewer opens
 *   over the Projects page; closing navigates to `/projects`.
 */
@Injectable({ providedIn: 'root' })
export class ProjectViewer {
  private readonly location = inject(Location);
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);

  readonly project = signal<Project | null>(null);

  /** True when `open()` pushed the URL (close must go back in history). */
  private pushed = false;

  constructor() {
    // Browser Back/Forward while open: close without touching history again.
    this.location.subscribe(() => {
      const current = this.project();
      if (current && this.location.path() !== this.pathOf(current)) this.reset();
    });
    // Any router navigation (e.g. "Contact me" inside the viewer) closes it.
    this.router.events.pipe(filter((e) => e instanceof NavigationStart)).subscribe(() => {
      if (this.project()) this.reset();
    });
  }

  /** Opens a project with a case study. Returns false if the slug is unknown. */
  open(slug: string, pushUrl = true): boolean {
    const project = PROJECTS.find((p) => p.slug === slug && p.caseStudy);
    if (!project) return false;
    this.project.set(project);
    this.pushed = pushUrl && this.location.path() !== this.pathOf(project);
    if (this.pushed) this.location.go(this.pathOf(project));
    return true;
  }

  close(): void {
    if (!this.project()) return;
    const pushed = this.pushed;
    this.reset();
    if (pushed) this.location.back();
    else void this.router.navigate(['/projects']);
  }

  /** Absolute, shareable URL of a project. */
  shareUrl(project: Project): string {
    const origin = this.document.location?.origin ?? '';
    return origin + this.location.prepareExternalUrl(this.pathOf(project));
  }

  private pathOf(project: Project): string {
    return `/projects/${project.slug}`;
  }

  private reset(): void {
    this.pushed = false;
    this.project.set(null);
  }
}
