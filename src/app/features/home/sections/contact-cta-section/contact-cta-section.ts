import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  Injector,
  signal,
} from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { whatsappUrl } from '@core/constants/contact';
import { SOCIAL_LINKS } from '@core/constants/social-links';
import { TranslatePipe } from '@core/pipes/translate-pipe';
import { Contact } from '@core/services/contact';
import { I18n } from '@core/services/i18n';
import { Button } from '@shared/ui/button/button';
import { SocialIconButton } from '@shared/ui/social-icon-button/social-icon-button';

type FieldName = 'name' | 'email' | 'subject' | 'message';
type Status = 'idle' | 'sending' | 'success' | 'error';

/** Error keys in display priority (`contact.form.errors.<key>`). */
const ERROR_ORDER = ['required', 'email', 'minlength', 'maxlength'] as const;

/**
 * Home contact section: intro + WhatsApp + small social links on the left,
 * contact form on the right. The form emails the owner and auto-replies to the
 * visitor through EmailJS (`Contact` service), no back-end needed.
 */
@Component({
  selector: 'app-contact-cta-section',
  imports: [ReactiveFormsModule, TranslatePipe, Button, SocialIconButton],
  templateUrl: './contact-cta-section.html',
  styleUrl: './contact-cta-section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactCtaSection {
  private readonly contact = inject(Contact);
  private readonly i18n = inject(I18n);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly injector = inject(Injector);

  protected readonly socialLinks = SOCIAL_LINKS;
  /** wa.me link with a pre-filled message in the current language (null until a number is set). */
  protected readonly whatsappHref = computed(() =>
    whatsappUrl(this.i18n.t('contact.section.whatsappMessage')),
  );

  protected readonly status = signal<Status>('idle');
  protected readonly submitted = signal(false);
  /** First name shown in the success message. */
  protected readonly sentName = signal('');

  protected readonly form = inject(NonNullableFormBuilder).group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(200)]],
    subject: ['', [Validators.maxLength(150)]],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(5000)]],
    /** Honeypot: hidden from humans, bots fill it. */
    website: [''],
  });

  /** An error is shown once the field was left, or after a submit attempt. */
  protected showError(field: FieldName): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || this.submitted());
  }

  protected errorKey(field: FieldName): string {
    const errors = this.form.controls[field].errors ?? {};
    const key = ERROR_ORDER.find((k) => k in errors) ?? 'required';
    return `contact.form.errors.${key}`;
  }

  protected async submit(): Promise<void> {
    if (this.status() === 'sending') return;
    this.submitted.set(true);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.focusFirstInvalid();
      return;
    }

    const value = this.form.getRawValue();
    const name = value.name.trim();
    this.status.set('sending');
    try {
      // Bots filling the honeypot get a fake success and nothing is sent.
      if (!value.website) {
        await this.contact.send({
          name,
          email: value.email.trim(),
          subject: value.subject.trim(),
          message: value.message.trim(),
        });
      }
      this.sentName.set(name);
      this.status.set('success');
      this.form.reset();
      this.submitted.set(false);
      this.focusAfterRender('#contact-success-title');
    } catch (error) {
      console.error('[Contact] Sending failed:', error);
      this.status.set('error');
    }
  }

  protected sendAnother(): void {
    this.status.set('idle');
    this.focusAfterRender('#contact-name');
  }

  private focusFirstInvalid(): void {
    this.focusAfterRender('.field__input.ng-invalid');
  }

  private focusAfterRender(selector: string): void {
    afterNextRender(() => this.host.querySelector<HTMLElement>(selector)?.focus(), {
      injector: this.injector,
    });
  }
}
