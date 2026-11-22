import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Services } from './services';

describe('Services page', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ imports: [Services], providers: [provideRouter([])] });
  });

  it('renders the header (single h1 + "My process" link) and the services band without "See more"', async () => {
    const fixture = TestBed.createComponent(Services);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelectorAll('h1').length).toBe(1);
    expect(el.querySelector('h1')?.textContent).toContain('I don’t start by drawing.');
    expect(el.querySelector('#intro a[appbutton]')?.getAttribute('href')).toBe('/services#method');

    const band = el.querySelector('app-services-preview-section')!;
    expect(band.querySelectorAll('.service-card').length).toBe(4);
    expect(band.querySelector('a[href="/services"]')).toBeNull();

    const ids = Array.from(el.querySelectorAll('section[id]')).map((s) => s.id);
    expect(ids).toEqual(['intro', 'services-preview', 'method', 'example', 'contact-cta']);
  });
});
