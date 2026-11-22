import { SearchEntry } from '@core/models';

/**
 * Keyword search index. Pages first (they are the default suggestions), then sections.
 * Titles and keywords live in i18n under `search.entries.*` / `search.keywords.*`.
 * Fragments must match the section ids (`id="<file name without -section>"`).
 */
export const SEARCH_INDEX: readonly SearchEntry[] = [
  // Pages
  {
    id: 'home',
    path: '/',
    titleKey: 'nav.home',
    pageKey: 'nav.home',
    keywordsKey: 'search.keywords.home',
  },
  {
    id: 'about',
    path: '/about',
    titleKey: 'nav.about',
    pageKey: 'nav.about',
    keywordsKey: 'search.keywords.about',
  },
  {
    id: 'services',
    path: '/services',
    titleKey: 'nav.services',
    pageKey: 'nav.services',
    keywordsKey: 'search.keywords.services',
  },
  {
    id: 'projects',
    path: '/projects',
    titleKey: 'nav.projects',
    pageKey: 'nav.projects',
    keywordsKey: 'search.keywords.projects',
  },
  {
    id: 'contact',
    path: '/contact',
    titleKey: 'nav.contact',
    pageKey: 'nav.contact',
    keywordsKey: 'search.keywords.contact',
  },
  {
    id: 'articles',
    path: '/articles',
    titleKey: 'nav.articles',
    pageKey: 'nav.articles',
    keywordsKey: 'search.keywords.articles',
  },

  // About sections
  {
    id: 'experience',
    path: '/about',
    fragment: 'experience',
    titleKey: 'search.entries.experience',
    pageKey: 'nav.about',
    keywordsKey: 'search.keywords.experience',
  },
  {
    id: 'awards',
    path: '/about',
    fragment: 'awards',
    titleKey: 'search.entries.awards',
    pageKey: 'nav.about',
    keywordsKey: 'search.keywords.awards',
  },

  // Home sections
  {
    id: 'about-preview',
    path: '/',
    fragment: 'about-preview',
    titleKey: 'search.entries.aboutPreview',
    pageKey: 'nav.home',
    keywordsKey: 'search.keywords.aboutPreview',
  },
  {
    id: 'services-preview',
    path: '/',
    fragment: 'services-preview',
    titleKey: 'search.entries.servicesPreview',
    pageKey: 'nav.home',
    keywordsKey: 'search.keywords.servicesPreview',
  },
  {
    id: 'skills',
    path: '/',
    fragment: 'skills-marquee',
    titleKey: 'search.entries.skills',
    pageKey: 'nav.home',
    keywordsKey: 'search.keywords.skills',
  },
  {
    id: 'selected-projects',
    path: '/',
    fragment: 'selected-projects',
    titleKey: 'search.entries.selectedProjects',
    pageKey: 'nav.home',
    keywordsKey: 'search.keywords.selectedProjects',
  },
  {
    id: 'gallery',
    path: '/',
    fragment: 'gallery',
    titleKey: 'search.entries.gallery',
    pageKey: 'nav.home',
    keywordsKey: 'search.keywords.gallery',
  },
  {
    id: 'contact-cta',
    path: '/',
    fragment: 'contact-cta',
    titleKey: 'search.entries.contactCta',
    pageKey: 'nav.home',
    keywordsKey: 'search.keywords.contactCta',
  },

  // Services sections
  {
    id: 'method',
    path: '/services',
    fragment: 'method',
    titleKey: 'search.entries.method',
    pageKey: 'nav.services',
    keywordsKey: 'search.keywords.method',
  },
  {
    id: 'example',
    path: '/services',
    fragment: 'example',
    titleKey: 'search.entries.example',
    pageKey: 'nav.services',
    keywordsKey: 'search.keywords.example',
  },
];
