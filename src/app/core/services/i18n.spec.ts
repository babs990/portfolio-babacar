import { TestBed } from '@angular/core/testing';

import { I18n } from '@core/services/i18n';

describe('I18n', () => {
  let i18n: I18n;

  beforeEach(() => {
    localStorage.clear();
    i18n = TestBed.inject(I18n);
  });

  it('interpolates {params} in the current language', () => {
    expect(i18n.t('home.gallery.goTo', { n: 2, total: 5 })).toBe('Go to position 2 of 5');
    i18n.setLang('fr');
    expect(i18n.t('home.gallery.goTo', { n: 2, total: 5 })).toBe('Aller à la position 2 sur 5');
  });

  it('leaves unknown placeholders untouched and falls back to the key', () => {
    expect(i18n.t('home.gallery.goTo', { n: 1 })).toBe('Go to position 1 of {total}');
    expect(i18n.t('does.not.exist')).toBe('does.not.exist');
  });
});
