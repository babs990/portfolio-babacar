import { TestBed } from '@angular/core/testing';

import { I18n } from '@core/services/i18n';
import { MethodSection } from './method-section';

describe('MethodSection (4 pillars)', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ imports: [MethodSection] });
  });

  it('renders the 4 numbered pillars, 01-02 on the left and 03-04 on the right', async () => {
    TestBed.inject(I18n).setLang('fr');
    const fixture = TestBed.createComponent(MethodSection);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const titles = (side: string) =>
      Array.from(el.querySelectorAll(`.pillars__side--${side} h3`)).map((h) =>
        h.textContent?.trim(),
      );

    expect(el.querySelector('#method h2')?.textContent).toContain('4 piliers essentiels');
    expect(titles('left')).toEqual(['01 – Comprendre', '02 – Écouter']);
    expect(titles('right')).toEqual(['03 – Tester', '04 – Réaliser']);
    expect(el.querySelectorAll('.pillar__line').length).toBe(4);
    expect(el.querySelector('img')?.getAttribute('alt')).toContain('pensif');
  });
});
