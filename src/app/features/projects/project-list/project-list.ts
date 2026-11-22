import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { PROJECTS } from '@core/data/projects';
import { TranslatePipe } from '@core/pipes/translate-pipe';
import { ContactCtaSection } from '@features/home/sections/contact-cta-section/contact-cta-section';
import { ProjectCard } from '@shared/ui/project-card/project-card';

/**
 * Projects page: header, skill filter chips (built from the projects' tags), the full
 * list of real projects (each shown ONCE, unlike the home grid which fills 4 slots)
 * and the shared contact section.
 */
@Component({
  selector: 'app-project-list',
  imports: [TranslatePipe, ProjectCard, ContactCtaSection],
  templateUrl: './project-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectList {
  /** Distinct tag keys across all projects, in first-seen order. */
  protected readonly tags: readonly string[] = [...new Set(PROJECTS.flatMap((p) => p.tagKeys))];

  /** Selected tag key, or null for "All". */
  protected readonly filter = signal<string | null>(null);

  protected readonly visible = computed(() => {
    const tag = this.filter();
    return tag ? PROJECTS.filter((p) => p.tagKeys.includes(tag)) : PROJECTS;
  });

  protected readonly countKey = computed(() =>
    this.visible().length === 1 ? 'projects.list.countOne' : 'projects.list.countOther',
  );

  protected select(tag: string | null): void {
    this.filter.set(tag);
  }
}
