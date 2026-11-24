import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { I18n } from '@core/services/i18n';
import { ProjectList } from './project-list';

describe('Projects page', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ imports: [ProjectList], providers: [provideRouter([])] });
  });

  it('lists every real project once, with tag filters and a count', async () => {
    TestBed.inject(I18n).setLang('fr');
    const fixture = TestBed.createComponent(ProjectList);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelectorAll('h1').length).toBe(1);
    expect(el.querySelector('h1')?.textContent).toContain('Mes projets');

    const cards = el.querySelectorAll('app-project-card');
    expect(cards.length).toBe(4);
    expect(Array.from(cards, (c) => c.querySelector('a')?.getAttribute('href'))).toEqual([
      '/projects/samba-app',
      '/projects/sengame-app',
      '/projects/doctor-app',
      '/projects/waterflow',
    ]);

    const chips = Array.from(el.querySelectorAll<HTMLButtonElement>('.chip'));
    expect(chips.map((c) => c.textContent?.trim())).toEqual([
      'Tous',
      'Design mobile',
      'UX Design',
      'Recherche',
      'Vision produit',
    ]);
    expect(chips[0].getAttribute('aria-pressed')).toBe('true');
    expect(el.querySelector('[aria-live]')?.textContent?.trim()).toBe('4 projets');

    // Only SenGame and Waterflow are tagged "Recherche".
    chips[3].click();
    await fixture.whenStable();
    expect(chips[3].getAttribute('aria-pressed')).toBe('true');
    expect(chips[0].getAttribute('aria-pressed')).toBe('false');
    const filtered = el.querySelectorAll('app-project-card');
    expect(Array.from(filtered, (c) => c.querySelector('a')?.getAttribute('href'))).toEqual([
      '/projects/sengame-app',
      '/projects/waterflow',
    ]);
    expect(el.querySelector('app-contact-cta-section form')).toBeTruthy();
  });
});
