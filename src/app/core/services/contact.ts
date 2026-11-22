import { inject, Injectable } from '@angular/core';

import { CONTACT_CONFIG, EMAILJS_ENDPOINT, EmailJsConfig } from '@core/constants/contact';
import { I18n } from '@core/services/i18n';

export interface ContactMessage {
  readonly name: string;
  readonly email: string;
  readonly subject: string;
  readonly message: string;
}

/**
 * Sends the contact form through the EmailJS REST API (see `core/constants/contact.ts`):
 * 1. the message to the site owner (must succeed),
 * 2. an acknowledgement to the visitor, in their current language (best effort: a failure
 *    is logged but does not fail the submission, the owner already has the message).
 * Uses `fetch`: no SDK, no HttpClient.
 */
@Injectable({ providedIn: 'root' })
export class Contact {
  private readonly i18n = inject(I18n);
  private readonly config = inject(CONTACT_CONFIG);

  get isConfigured(): boolean {
    const { publicKey, serviceId, ownerTemplateId } = this.config;
    return !!(publicKey && serviceId && ownerTemplateId);
  }

  async send(message: ContactMessage): Promise<void> {
    if (!this.isConfigured) {
      throw new Error(
        'Contact form not configured: fill EMAILJS_CONFIG in core/constants/contact.ts (see docs/emailjs-setup.md).',
      );
    }

    const params = { name: message.name };
    const templateParams = {
      name: message.name,
      email: message.email,
      subject: message.subject || '—',
      message: message.message,
      language: this.i18n.lang(),
      owner_subject: this.i18n.t('contact.mail.ownerSubject', params),
      reply_subject: this.i18n.t('contact.mail.replySubject', params),
      reply_message: this.i18n.t('contact.mail.autoresponse', params),
    };

    await this.post(this.config, this.config.ownerTemplateId, templateParams);

    if (this.config.autoReplyTemplateId) {
      try {
        await this.post(this.config, this.config.autoReplyTemplateId, templateParams);
      } catch (error) {
        console.warn('[Contact] Visitor acknowledgement failed:', error);
      }
    }
  }

  private async post(
    config: EmailJsConfig,
    templateId: string,
    templateParams: Record<string, string>,
  ): Promise<void> {
    const response = await fetch(EMAILJS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: config.serviceId,
        template_id: templateId,
        user_id: config.publicKey,
        template_params: templateParams,
      }),
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      throw new Error(`EmailJS ${response.status}: ${detail}`);
    }
  }
}
