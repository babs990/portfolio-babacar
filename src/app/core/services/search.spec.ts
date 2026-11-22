import { TestBed } from '@angular/core/testing';

import { I18n } from '@core/services/i18n';
import { normalize, Search } from '@core/services/search';

describe('Search', () => {
  let search: Search;

  beforeEach(() => {
    localStorage.clear();
    search = TestBed.inject(Search);
  });

  it('suggests the pages when the query is empty', () => {
    const ids = search.find('').map((e) => e.id);
    expect(ids).toEqual(['home', 'about', 'services', 'projects', 'contact', 'articles']);
  });

  it('finds a section by keyword, ignoring case and accents', () => {
    expect(search.find('PROTOTYPAGE').map((e) => e.id)).toContain('skills');
    expect(search.find('methode')[0]?.id).toBe('method');
  });

  it('matches keywords of every language', () => {
    TestBed.inject(I18n).setLang('fr');
    expect(search.find('understand')[0]?.id).toBe('method');
  });

  it('requires every term to match', () => {
    expect(search.find('pillars xyzunknown')).toEqual([]);
  });

  it('normalizes accents', () => {
    expect(normalize('  À Propos ')).toBe('a propos');
  });
});
