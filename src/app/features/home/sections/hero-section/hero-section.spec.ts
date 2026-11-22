import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { I18n } from '@core/services/i18n';
import { HeroSection } from './hero-section';

describe('HeroSection', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ imports: [HeroSection], providers: [provideRouter([])] });
  });

  it('renders the name as the single h1, the CTA to /contact and the social buttons', async () => {
    const fixture = TestBed.createComponent(HeroSection);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelectorAll('h1').length).toBe(1);
    expect(el.querySelector('h1')?.textContent).toContain('Serigne Khalifa Ababacar Sy Nguirane');
    expect(el.querySelector('a[href="/contact"]')?.textContent).toContain('Contact me');
    expect(el.querySelectorAll('app-social-icon-button').length).toBe(2);
    expect(el.querySelector('img')?.getAttribute('alt')).not.toBe('TODO');
  });

  it('switches its copy to French', async () => {
    const fixture = TestBed.createComponent(HeroSection);
    TestBed.inject(I18n).setLang('fr');
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Contactez-moi');
  });
});
