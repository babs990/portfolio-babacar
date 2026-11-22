import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  untracked,
} from '@angular/core';
import { Router } from '@angular/router';

import { ProjectViewer } from '@core/services/project-viewer';
import { ProjectList } from '@features/projects/project-list/project-list';

/**
 * `/projects/:slug` (direct link / reload / shared URL): shows the Projects page with the
 * project viewer open over it, like Behance. Unknown slug → back to `/projects`.
 */
@Component({
  selector: 'app-project-detail',
  imports: [ProjectList],
  templateUrl: './project-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetail {
  /** Bound from the route param (withComponentInputBinding). */
  readonly slug = input.required<string>();

  constructor() {
    const viewer = inject(ProjectViewer);
    const router = inject(Router);
    effect(() => {
      const slug = this.slug();
      untracked(() => {
        if (!viewer.open(slug, false)) void router.navigate(['/projects'], { replaceUrl: true });
      });
    });
  }
}
