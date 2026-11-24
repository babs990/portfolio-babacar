/** An award, distinction or event participation (About page). Text fields are i18n keys. */
export interface Award {
  readonly id: string;
  readonly titleKey: string;
  readonly descriptionKey: string;
  /** Organizer / issuer (e.g. "EDACY · Talent 4 Startups"). */
  readonly issuerKey: string;
  /** Month of the award, `YYYY-MM`. Omitted while unknown (only the issuer is shown). */
  readonly date?: string;
  readonly image: {
    /** Path relative to `assets/images/`. */
    readonly src: string;
    readonly width: number;
    readonly height: number;
    readonly altKey: string;
  };
  readonly url?: string;
}
