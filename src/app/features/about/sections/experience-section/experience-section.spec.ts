import { TestBed } from '@angular/core/testing';

import { I18n } from '@core/services/i18n';
import { ExperienceSection } from './experience-section';

describe('ExperienceSection', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ imports: [ExperienceSection] });
  });

  const render = async () => {
    const fixture = TestBed.createComponent(ExperienceSection);
    await fixture.whenStable();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  };

  it('lists the experiences oldest → current, alternating left / right of the branch', async () => {
    const { el } = await render();
    const items = el.querySelectorAll('.xp');
    expect(items.length).toBe(4);
    expect(items[0].querySelector('h3')?.textContent).toContain('Web Developer');
    expect(items[3].querySelector('h3 + p')?.textContent).toContain('Jant Tech');
    expect(items[0].classList.contains('xp--left')).toBe(true);
    expect(items[1].classList.contains('xp--left')).toBe(false);
    expect(el.querySelectorAll('.xp__node.is-current').length).toBe(1);
    expect(el.querySelectorAll('.xp li, .xp ul').length).toBe(0); // no description bullets
  });

  it('formats periods in the current language, with "Present" for the ongoing role', async () => {
    const { fixture, el } = await render();
    expect(el.querySelector('time')?.textContent).toBe('November 2024 – December 2024');
    expect(el.querySelectorAll('time')[3].textContent).toBe('January 2026 – Present');

    TestBed.inject(I18n).setLang('fr');
    await fixture.whenStable();
    expect(el.querySelector('time')?.textContent).toBe('Novembre 2024 – Décembre 2024');
    expect(el.querySelectorAll('time')[3].textContent).toBe('Janvier 2026 – Aujourd’hui');
  });
});
