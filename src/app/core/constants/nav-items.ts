import { PROJECTS } from '@core/data/projects';
import { NavItem } from '@core/models';

export const NAV_ITEMS: readonly NavItem[] = [
  { labelKey: 'nav.home', path: '/', exact: true },
  { labelKey: 'nav.about', path: '/about' },
  { labelKey: 'nav.services', path: '/services' },
  {
    labelKey: 'nav.projects',
    path: '/projects',
    // Dropdown = one entry per project (fed by core/data/projects.ts).
    children: PROJECTS.map((project) => ({
      labelKey: project.titleKey,
      path: `/projects/${project.slug}`,
    })),
  },
];
