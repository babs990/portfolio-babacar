/** One full-width image of a case study (Behance-style module). */
export interface ProjectSlide {
  /** Path relative to `assets/images/`. */
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly altKey: string;
}

/** Case study shown in the project viewer (stacked slides + meta). */
export interface ProjectCaseStudy {
  readonly roleKey: string;
  readonly fieldKey: string;
  readonly slides: readonly ProjectSlide[];
}

/** A portfolio case study. Text fields are i18n keys. */
export interface Project {
  /** URL segment used by the `projects/:slug` route. */
  readonly slug: string;
  readonly titleKey: string;
  readonly summaryKey: string;
  /** Path relative to `assets/images/`. */
  readonly cover: string;
  readonly coverAltKey: string;
  /** i18n keys of the disciplines involved (e.g. `skills.uxDesign`). */
  readonly tagKeys: readonly string[];
  /** Year of the project (optional until provided). */
  readonly year?: number;
  /** Shown in the home "Selected projects" section. */
  readonly featured: boolean;
  /** Behance-style case study (opens in the project viewer). */
  readonly caseStudy?: ProjectCaseStudy;
}
