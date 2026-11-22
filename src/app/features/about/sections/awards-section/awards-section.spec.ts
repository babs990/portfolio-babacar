import { TestBed } from '@angular/core/testing';

import { I18n } from '@core/services/i18n';
import { AwardsSection } from './awards-section';

describe('AwardsSection', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ imports: [AwardsSection] });
  });

  it('fills 3 cards, opens the first by default and expands the hovered one', async () => {
    const fixture = TestBed.createComponent(AwardsSection);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const cards = () => Array.from(el.querySelectorAll('.award'));
    const active = () => cards().findIndex((c) => c.classList.contains('is-active'));

    expect(cards().length).toBe(3);
    expect(active()).toBe(0);

    cards()[2].dispatchEvent(new Event('mouseenter'));
    await fixture.whenStable();
    expect(active()).toBe(2);
    expect(el.querySelectorAll('.award.is-active').length).toBe(1);
  });

  it('shows the award title, issuer and localized date', async () => {
    TestBed.inject(I18n).setLang('fr');
    const fixture = TestBed.createComponent(AwardsSection);
    await fixture.whenStable();
    const first = (fixture.nativeElement as HTMLElement).querySelector('.award')!;
    expect(first.querySelector('h3')?.textContent).toContain(
      'Major du programme Product UX/UI Design',
    );
    expect(first.querySelector('time')?.textContent).toBe('Octobre 2025');
    expect(first.textContent).toContain('EDACY');
  });
});
