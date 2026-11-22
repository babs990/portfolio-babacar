import { TestBed } from '@angular/core/testing';

import { CONTACT_CONFIG, EMAILJS_ENDPOINT, EmailJsConfig } from '@core/constants/contact';
import { I18n } from '@core/services/i18n';
import { ContactCtaSection } from './contact-cta-section';

const TEST_CONFIG: EmailJsConfig = {
  publicKey: 'pk_test',
  serviceId: 'service_test',
  ownerTemplateId: 'template_owner',
  autoReplyTemplateId: 'template_reply',
};

/** No real email is ever sent: `fetch` is mocked. */
describe('ContactCtaSection', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  const configure = (config: EmailJsConfig = TEST_CONFIG) =>
    TestBed.configureTestingModule({
      imports: [ContactCtaSection],
      providers: [{ provide: CONTACT_CONFIG, useValue: config }],
    });

  const setup = async () => {
    const fixture = TestBed.createComponent(ContactCtaSection);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const type = (selector: string, value: string) => {
      const input = el.querySelector<HTMLInputElement | HTMLTextAreaElement>(selector)!;
      input.value = value;
      input.dispatchEvent(new Event('input'));
    };
    const fillValid = () => {
      type('#contact-name', 'Awa Diop');
      type('#contact-email', 'awa@example.com');
      type('#contact-message', 'Bonjour, j’ai un projet d’application mobile.');
    };
    const submit = async () => {
      el.querySelector('form')!.dispatchEvent(new Event('submit'));
      await fixture.whenStable();
      await new Promise((r) => setTimeout(r));
      await fixture.whenStable();
    };
    return { el, type, fillValid, submit };
  };

  const bodyOf = (call: number) =>
    JSON.parse((fetchMock.mock.calls[call] as [string, RequestInit])[1].body as string);

  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    fetchMock = vi.fn().mockResolvedValue(new Response('OK', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('does not send an invalid form and shows field errors', async () => {
    configure();
    const { el, submit } = await setup();
    await submit();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(el.querySelectorAll('.field__error').length).toBe(3); // name, email, message
  });

  it('sends the owner email then the visitor acknowledgement (in the visitor language)', async () => {
    configure();
    TestBed.inject(I18n).setLang('fr');
    const { el, fillValid, submit } = await setup();
    fillValid();
    await submit();

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0][0]).toBe(EMAILJS_ENDPOINT);

    const owner = bodyOf(0);
    expect(owner).toMatchObject({
      service_id: 'service_test',
      template_id: 'template_owner',
      user_id: 'pk_test',
    });
    expect(owner.template_params).toMatchObject({
      name: 'Awa Diop',
      email: 'awa@example.com',
      language: 'fr',
      owner_subject: 'Nouveau message du portfolio : Awa Diop',
      reply_subject: 'Merci pour votre message, Awa Diop !',
    });
    expect(owner.template_params.reply_message).toContain('Bonjour Awa Diop');
    expect(bodyOf(1).template_id).toBe('template_reply');
    expect(el.querySelector('#contact-success-title')).toBeTruthy();
  });

  it('still succeeds when only the acknowledgement fails', async () => {
    configure();
    fetchMock
      .mockResolvedValueOnce(new Response('OK', { status: 200 }))
      .mockResolvedValueOnce(new Response('Bad template', { status: 400 }));
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { el, fillValid, submit } = await setup();
    fillValid();
    await submit();
    expect(el.querySelector('#contact-success-title')).toBeTruthy();
  });

  it('shows an error when the owner email fails', async () => {
    configure();
    fetchMock.mockResolvedValue(new Response('The Public Key is invalid', { status: 400 }));
    const { el, fillValid, submit } = await setup();
    fillValid();
    await submit();
    expect(el.querySelector('[role="alert"]')).toBeTruthy();
    expect(el.querySelector('form')).toBeTruthy();
  });

  it('shows an error (and sends nothing) while EmailJS is not configured', async () => {
    configure({ publicKey: '', serviceId: '', ownerTemplateId: '', autoReplyTemplateId: '' });
    const { el, fillValid, submit } = await setup();
    fillValid();
    await submit();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(el.querySelector('[role="alert"]')).toBeTruthy();
  });

  it('silently drops honeypot submissions', async () => {
    configure();
    const { el, fillValid, type, submit } = await setup();
    fillValid();
    type('input[formcontrolname="website"]', 'http://spam.example');
    await submit();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(el.querySelector('#contact-success-title')).toBeTruthy();
  });
});
