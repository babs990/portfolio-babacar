import { NavItem } from '@core/models';

/** Footer navigation (Figma: About, Projects, Articles). */
export const FOOTER_LINKS: readonly NavItem[] = [
  { labelKey: 'nav.about', path: '/about' },
  { labelKey: 'nav.projects', path: '/projects' },
  { labelKey: 'nav.articles', path: '/articles' },
];
