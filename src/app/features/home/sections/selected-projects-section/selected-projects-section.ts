import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PROJECTS } from '@core/data/projects';
import { Project } from '@core/models';
import { TranslatePipe } from '@core/pipes/translate-pipe';
import { ProjectCard } from '@shared/ui/project-card/project-card';

/** Number of cards in the home portfolio grid (Figma: 2 × 2). */
const SLOTS = 4;

@Component({
  selector: 'app-selected-projects-section',
  imports: [RouterLink, TranslatePipe, ProjectCard],
  templateUrl: './selected-projects-section.html',
  styleUrl: './selected-projects-section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectedProjectsSection {
  /**
   * Featured projects filling the 4 slots.
   * TEMPORARY: while fewer than 4 projects exist, they are repeated to fill the grid
   * (only Samba App today). Real projects take the slots as soon as they are added.
   */
  protected readonly projects: readonly Project[] = fillSlots(
    PROJECTS.filter((p) => p.featured),
    SLOTS,
  );
}

function fillSlots(projects: readonly Project[], slots: number): readonly Project[] {
  if (!projects.length) return [];
  return Array.from({ length: slots }, (_, i) => projects[i % projects.length]);
}
