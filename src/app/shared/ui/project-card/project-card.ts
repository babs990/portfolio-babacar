import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';

import { Project } from '@core/models';
import { TranslatePipe } from '@core/pipes/translate-pipe';
import { ProjectViewer } from '@core/services/project-viewer';

/**
 * Project card (Figma home portfolio). The whole card is a real link to `/projects/:slug`;
 * a plain click opens the Behance-style viewer OVER the current page instead of navigating
 * (Ctrl/⌘/Shift/middle click keep the browser's default: new tab / window).
 * Used by the home portfolio section and the Projects page.
 */
@Component({
  selector: 'app-project-card',
  imports: [NgOptimizedImage, TranslatePipe],
  templateUrl: './project-card.html',
  styleUrl: './project-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class ProjectCard {
  readonly project = input.required<Project>();

  private readonly viewer = inject(ProjectViewer);
  private readonly router = inject(Router);

  protected readonly href = computed(() => `/projects/${this.project().slug}`);

  protected onClick(event: MouseEvent): void {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    if (!this.viewer.open(this.project().slug)) void this.router.navigateByUrl(this.href());
  }
}
