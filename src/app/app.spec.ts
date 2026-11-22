import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { App } from './app';
import { I18n } from '@core/services/i18n';

describe('App', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the layout landmarks', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('header')).toBeTruthy();
    expect(el.querySelector('main')).toBeTruthy();
    expect(el.querySelector('footer')).toBeTruthy();
  });

  it('should translate the navigation and switch language', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const nav = () => (fixture.nativeElement as HTMLElement).querySelector('nav')?.textContent;
    expect(nav()).toContain('Home');

    TestBed.inject(I18n).setLang('fr');
    await fixture.whenStable();
    expect(nav()).toContain('Accueil');
    expect(document.documentElement.lang).toBe('fr');
    expect(localStorage.getItem('portfolio.lang')).toBe('fr');
  });
});
