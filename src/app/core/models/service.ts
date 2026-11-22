/** Line icon drawn inline by the services UI. */
export type ServiceIcon = 'mobile' | 'web' | 'research' | 'prototype';

/** A service offered (design, research...). Text fields are i18n keys. */
export interface Service {
  readonly id: string;
  readonly titleKey: string;
  readonly descriptionKey: string;
  readonly icon: ServiceIcon;
}
