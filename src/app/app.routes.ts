import { Routes } from '@angular/router';

/** Every page is lazy loaded (one chunk per route). */
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('@features/home/home').then((m) => m.Home),
  },
  {
    path: 'about',
    loadComponent: () => import('@features/about/about').then((m) => m.About),
  },
  {
    path: 'services',
    loadComponent: () => import('@features/services/services').then((m) => m.Services),
  },
  {
    path: 'projects',
    loadComponent: () =>
      import('@features/projects/project-list/project-list').then((m) => m.ProjectList),
  },
  {
    path: 'projects/:slug',
    loadComponent: () =>
      import('@features/projects/project-detail/project-detail').then((m) => m.ProjectDetail),
  },
  {
    path: 'articles',
    loadComponent: () => import('@features/articles/articles').then((m) => m.Articles),
  },
  {
    path: 'contact',
    loadComponent: () => import('@features/contact/contact').then((m) => m.Contact),
  },
  {
    path: '**',
    loadComponent: () => import('@features/not-found/not-found').then((m) => m.NotFound),
  },
];
