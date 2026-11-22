import { Award } from '@core/models';

/** Awards and event participations, most recent first. Copy lives in `about.awards.items.*`. */
export const AWARDS: readonly Award[] = [
  {
    id: 'edacy-major',
    titleKey: 'about.awards.items.edacyMajor.title',
    descriptionKey: 'about.awards.items.edacyMajor.description',
    issuerKey: 'about.awards.items.edacyMajor.issuer',
    date: '2025-10',
    image: {
      src: 'awards/edacy-major-2025.webp',
      width: 800,
      height: 1066,
      altKey: 'about.awards.items.edacyMajor.imageAlt',
    },
  },
];
