import { InjectionToken } from '@angular/core';

/**
 * Contact form delivery, without back-end: EmailJS (https://www.emailjs.com).
 * Setup guide + ready-to-paste email templates: `docs/emailjs-setup.md`.
 *
 * Two emails per submission:
 * 1. `ownerTemplateId`     → to the site owner (address configured in the EmailJS template,
 *                            NOT in this code), reply-to = the visitor.
 * 2. `autoReplyTemplateId` → acknowledgement to the visitor (`{{email}}`), in their language.
 *
 * These values are public by design (EmailJS public key): safe in the front-end bundle.
 * Protect the account with EmailJS "Allowed origins" (Account > Security) once deployed.
 */
export interface EmailJsConfig {
  readonly publicKey: string;
  readonly serviceId: string;
  readonly ownerTemplateId: string;
  /** Optional: leave empty to skip the visitor acknowledgement. */
  readonly autoReplyTemplateId: string;
}

/** TODO: fill after creating the EmailJS account (see docs/emailjs-setup.md). */
export const EMAILJS_CONFIG: EmailJsConfig = {
  publicKey: '',
  serviceId: '',
  ownerTemplateId: '',
  autoReplyTemplateId: '',
};

export const EMAILJS_ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send';

/** Injected config (overridable in tests). */
export const CONTACT_CONFIG = new InjectionToken<EmailJsConfig>('CONTACT_CONFIG', {
  providedIn: 'root',
  factory: () => EMAILJS_CONFIG,
});

/**
 * WhatsApp number in international format, digits only (e.g. 221771234567).
 * (From the CV: +221 77 378 29 56.) While empty, the WhatsApp button renders without a link.
 */
export const WHATSAPP_NUMBER = '221773782956';

/** wa.me link with a pre-filled message, or null while no number is set. */
export function whatsappUrl(message: string): string | null {
  return WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    : null;
}
