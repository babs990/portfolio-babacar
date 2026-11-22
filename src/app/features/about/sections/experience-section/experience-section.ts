import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  PLATFORM_ID,
} from '@angular/core';

import { EXPERIENCES } from '@core/data/experiences';
import { Experience } from '@core/models';
import { TranslatePipe } from '@core/pipes/translate-pipe';
import { I18n } from '@core/services/i18n';

interface TimelineItem extends Experience {
  /** Localized "Month YYYY – Month YYYY | Present". */
  readonly period: string;
  readonly current: boolean;
}

/**
 * About page experience timeline: a vertical "branch" (oldest at the top → current role
 * at the bottom). Desktop: cards alternate left / right of a centered rail; mobile: rail on the left.
 * The branch draws itself once the section scrolls into view (CSS transitions only).
 */
@Component({
  selector: 'app-experience-section',
  imports: [TranslatePipe],
  templateUrl: './experience-section.html',
  styleUrl: './experience-section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class ExperienceSection {
  private readonly i18n = inject(I18n);

  /** Periods are formatted in the current UI language ("Novembre 2024" / "November 2024"). */
  protected readonly items = computed<readonly TimelineItem[]>(() => {
    const lang = this.i18n.lang();
    const format = new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-GB', {
      month: 'long',
      year: 'numeric',
    });
    const month = (ym: string) => capitalize(format.format(new Date(`${ym}-01T00:00:00`)));
    const present = this.i18n.t('about.experience.present');
    return EXPERIENCES.map((xp) => ({
      ...xp,
      period: `${month(xp.start)} – ${xp.end ? month(xp.end) : present}`,
      current: xp.end === null,
    }));
  });

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
    const destroyRef = inject(DestroyRef);

    // Reveal once (adds `is-revealed`); without IntersectionObserver, show immediately.
    afterNextRender(() => {
      if (!isBrowser) return;
      if (typeof IntersectionObserver === 'undefined') {
        host.classList.add('is-revealed');
        return;
      }
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          host.classList.add('is-revealed');
          observer.disconnect();
        },
        // Fires as soon as the top of the section is 15% inside the viewport (works for tall sections).
        { rootMargin: '0px 0px -15% 0px' },
      );
      observer.observe(host);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}

function capitalize(value: string): string {
  return value.charAt(0).toLocaleUpperCase() + value.slice(1);
}
