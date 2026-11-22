export type SocialPlatform = 'linkedin' | 'dribbble' | 'behance' | 'instagram' | 'github' | 'x';

/** A social profile link (icon button). The label is an i18n key used as aria-label. */
export interface SocialLink {
  readonly platform: SocialPlatform;
  readonly url: string;
  readonly labelKey: string;
}
