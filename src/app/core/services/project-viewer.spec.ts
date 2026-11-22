import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { ProjectViewer } from '@core/services/project-viewer';

describe('ProjectViewer', () => {
  let viewer: ProjectViewer;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    viewer = TestBed.inject(ProjectViewer);
    location = TestBed.inject(Location);
  });

  it('opens a project over the page and pushes its URL; closing goes back', () => {
    const back = vi.spyOn(location, 'back');
    expect(viewer.open('samba-app')).toBe(true);
    expect(viewer.project()?.slug).toBe('samba-app');
    expect(location.path()).toBe('/projects/samba-app');
    expect(viewer.project()?.caseStudy?.slides.length).toBe(19);

    viewer.close();
    expect(viewer.project()).toBeNull();
    expect(back).toHaveBeenCalled();
  });

  it('refuses unknown projects', () => {
    expect(viewer.open('nope')).toBe(false);
    expect(viewer.project()).toBeNull();
  });

  it('from a direct link (no push), closing navigates to /projects', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    viewer.open('samba-app', false);
    viewer.close();
    expect(navigate).toHaveBeenCalledWith(['/projects']);
  });

  it('builds an absolute share URL', () => {
    viewer.open('samba-app');
    expect(viewer.shareUrl(viewer.project()!)).toMatch(/^https?:\/\/.+\/projects\/samba-app$/);
  });
});
