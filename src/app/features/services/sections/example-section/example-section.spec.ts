import { TestBed } from '@angular/core/testing';

import { ExampleSection } from './example-section';

describe('ExampleSection (concrete example)', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ imports: [ExampleSection] });
  });

  it('renders the journey persona → sketches → screens with 2 arrows and described images', async () => {
    const fixture = TestBed.createComponent(ExampleSection);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('#example h2')?.textContent).toContain('A concrete example');
    const steps = Array.from(el.querySelectorAll('.journey__step img'));
    expect(steps.map((i) => i.getAttribute('src')?.split('/').pop())).toEqual([
      'example-persona.webp',
      'example-sketches.webp',
      'example-screens.webp',
    ]);
    expect(el.querySelectorAll('.journey__arrow').length).toBe(2);
    // The persona text (in the image) is exposed through the alt text.
    expect(steps[0].getAttribute('alt')).toContain('Hypothesis');
  });
});
