import { TestBed } from '@angular/core/testing';

import { About } from './about';

describe('About page', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ imports: [About] });
  });

  it('renders the name as the single h1, the intro, the CV button and the gallery', async () => {
    const fixture = TestBed.createComponent(About);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelectorAll('h1').length).toBe(1);
    expect(el.querySelector('h1')?.textContent).toContain('Serigne Khalifa Ababacar Sy Nguirane');
    expect(el.querySelector('#about-intro p')?.textContent).toContain('Product UX/UI designer');
    const cv = el.querySelector('a[appbutton]');
    expect(cv?.textContent).toContain('My CV');
    expect(cv?.getAttribute('href')).toBe(
      'assets/documents/cv-serigne-khalifa-ababacar-sy-nguirane.pdf',
    );
    expect(cv?.getAttribute('target')).toBe('_blank');
    expect(el.querySelector('app-gallery-section #gallery')).toBeTruthy();
    expect(el.querySelector('app-contact-cta-section form')).toBeTruthy();
  });
});
