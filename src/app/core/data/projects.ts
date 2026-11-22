import { Project } from '@core/models';

/** Portfolio projects. Copy lives in i18n (`projects.items.*`), images in `assets/images/projects/`. */
export const PROJECTS: readonly Project[] = [
  {
    slug: 'samba-app',
    titleKey: 'projects.items.samba.title',
    summaryKey: 'projects.items.samba.summary',
    cover: 'projects/samba-app.png',
    coverAltKey: 'projects.items.samba.coverAlt',
    tagKeys: ['skills.mobileDesign', 'skills.uxDesign'],
    year: 2026,
    featured: true,
    caseStudy: {
      roleKey: 'projects.items.samba.role',
      fieldKey: 'projects.items.samba.field',
      // 19 slides, 2400px wide WebP (converted from the 5760px Figma exports).
      slides: [
        {
          src: 'projects/samba-app/slide-01.webp',
          width: 2400,
          height: 1429,
          altKey: 'projects.items.samba.slides.s1',
        },
        {
          src: 'projects/samba-app/slide-02.webp',
          width: 2400,
          height: 1606,
          altKey: 'projects.items.samba.slides.s2',
        },
        {
          src: 'projects/samba-app/slide-03.webp',
          width: 2400,
          height: 1606,
          altKey: 'projects.items.samba.slides.s3',
        },
        {
          src: 'projects/samba-app/slide-04.webp',
          width: 2400,
          height: 3660,
          altKey: 'projects.items.samba.slides.s4',
        },
        {
          src: 'projects/samba-app/slide-05.webp',
          width: 2400,
          height: 1606,
          altKey: 'projects.items.samba.slides.s5',
        },
        {
          src: 'projects/samba-app/slide-06.webp',
          width: 2400,
          height: 1606,
          altKey: 'projects.items.samba.slides.s6',
        },
        {
          src: 'projects/samba-app/slide-07.webp',
          width: 2400,
          height: 1606,
          altKey: 'projects.items.samba.slides.s7',
        },
        {
          src: 'projects/samba-app/slide-08.webp',
          width: 2400,
          height: 1606,
          altKey: 'projects.items.samba.slides.s8',
        },
        {
          src: 'projects/samba-app/slide-09.webp',
          width: 2400,
          height: 1606,
          altKey: 'projects.items.samba.slides.s9',
        },
        {
          src: 'projects/samba-app/slide-10.webp',
          width: 2400,
          height: 1606,
          altKey: 'projects.items.samba.slides.s10',
        },
        {
          src: 'projects/samba-app/slide-11.webp',
          width: 2400,
          height: 1606,
          altKey: 'projects.items.samba.slides.s11',
        },
        {
          src: 'projects/samba-app/slide-12.webp',
          width: 2400,
          height: 1606,
          altKey: 'projects.items.samba.slides.s12',
        },
        {
          src: 'projects/samba-app/slide-13.webp',
          width: 2400,
          height: 1606,
          altKey: 'projects.items.samba.slides.s13',
        },
        {
          src: 'projects/samba-app/slide-14.webp',
          width: 2400,
          height: 1606,
          altKey: 'projects.items.samba.slides.s14',
        },
        {
          src: 'projects/samba-app/slide-15.webp',
          width: 2400,
          height: 1606,
          altKey: 'projects.items.samba.slides.s15',
        },
        {
          src: 'projects/samba-app/slide-16.webp',
          width: 2400,
          height: 1606,
          altKey: 'projects.items.samba.slides.s16',
        },
        {
          src: 'projects/samba-app/slide-17.webp',
          width: 2400,
          height: 1606,
          altKey: 'projects.items.samba.slides.s17',
        },
        {
          src: 'projects/samba-app/slide-18.webp',
          width: 2400,
          height: 1606,
          altKey: 'projects.items.samba.slides.s18',
        },
        {
          src: 'projects/samba-app/slide-19.webp',
          width: 2400,
          height: 1429,
          altKey: 'projects.items.samba.slides.s19',
        },
      ],
    },
  },
];
