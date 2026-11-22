import { Service } from '@core/models';

/** Services shown on the home preview (4 cards) and the Services page. Copy lives in i18n. */
export const SERVICES: readonly Service[] = [
  {
    id: 'mobile-app-design',
    icon: 'mobile',
    titleKey: 'services.items.mobile.title',
    descriptionKey: 'services.items.mobile.description',
  },
  {
    id: 'web-app-design',
    icon: 'web',
    titleKey: 'services.items.web.title',
    descriptionKey: 'services.items.web.description',
  },
  {
    id: 'ux-research',
    icon: 'research',
    titleKey: 'services.items.research.title',
    descriptionKey: 'services.items.research.description',
  },
  {
    id: 'prototyping',
    icon: 'prototype',
    titleKey: 'services.items.prototype.title',
    descriptionKey: 'services.items.prototype.description',
  },
];
