import { Experience } from '@core/models';

const item = (id: string, start: string, end: string | null): Experience => ({
  id,
  start,
  end,
  roleKey: `about.experience.items.${id}.role`,
  companyKey: `about.experience.items.${id}.company`,
});

/** Experiences from the CV, in chronological order (oldest at the top of the branch). */
export const EXPERIENCES: readonly Experience[] = [
  item('mtn', '2024-11', '2024-12'),
  item('niane', '2025-03', '2025-07'),
  item('etp4', '2026-01', '2026-09'),
  item('jant', '2026-01', null),
];
