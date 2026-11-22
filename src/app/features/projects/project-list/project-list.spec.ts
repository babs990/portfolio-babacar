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
    expect(cards.length).toBe(1);
    expect(cards[0].querySelector('a')?.getAttribute('href')).toBe('/projects/samba-app');

    const chips = Array.from(el.querySelectorAll<HTMLButtonElement>('.chip'));
    expect(chips.map((c) => c.textContent?.trim())).toEqual(['Tous', 'Design mobile', 'UX Design']);
    expect(chips[0].getAttribute('aria-pressed')).toBe('true');
    expect(el.querySelector('[aria-live]')?.textContent?.trim()).toBe('1 projet');

    chips[1].click();
    await fixture.whenStable();
    expect(chips[1].getAttribute('aria-pressed')).toBe('true');
    expect(chips[0].getAttribute('aria-pressed')).toBe('false');
    expect(el.querySelectorAll('app-project-card').length).toBe(1);
    expect(el.querySelector('app-contact-cta-section form')).toBeTruthy();
  });
});
