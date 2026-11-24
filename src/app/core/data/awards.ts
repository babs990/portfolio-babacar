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
  {
    id: 'google-ux-design',
    titleKey: 'about.awards.items.googleUx.title',
    descriptionKey: 'about.awards.items.googleUx.description',
    issuerKey: 'about.awards.items.googleUx.issuer',
    date: '2025-04',
    image: {
      src: 'awards/google-ux-design-portrait.webp',
      width: 800,
      height: 1096,
      altKey: 'about.awards.items.googleUx.imageAlt',
    },
    url: 'https://coursera.org/verify/professional-cert/TVEEXDOMFVZL',
  },
  {
    id: 'docsen-hackathon',
    titleKey: 'about.awards.items.docsenHackathon.title',
    descriptionKey: 'about.awards.items.docsenHackathon.description',
    issuerKey: 'about.awards.items.docsenHackathon.issuer',
    // TODO: date (YYYY-MM) to be provided by the owner.
    image: {
      src: 'awards/docsen-hackathon-esante.webp',
      width: 1200,
      height: 900,
      altKey: 'about.awards.items.docsenHackathon.imageAlt',
    },
  },
];
