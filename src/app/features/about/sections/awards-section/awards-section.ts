import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { AWARDS } from '@core/data/awards';
import { Award } from '@core/models';
import { TranslatePipe } from '@core/pipes/translate-pipe';
import { I18n } from '@core/services/i18n';

/** Number of cards in the row (Figma: 3). */
const SLOTS = 3;

interface AwardCard extends Award {
  /** Localized "Month YYYY". */
  readonly when: string;
}

/**
 * About page "Awards & events": a row of photo cards where ONE card is expanded
 * (title + text visible). The first is open by default; hovering, focusing or tapping
 * another card expands it and collapses the previous one. Mobile: stacked, all open.
 */
@Component({
  selector: 'app-awards-section',
  imports: [NgOptimizedImage, TranslatePipe],
  templateUrl: './awards-section.html',
  styleUrl: './awards-section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AwardsSection {
  private readonly i18n = inject(I18n);

  protected readonly active = signal(0);

  /**
   * TEMPORARY: while fewer than 3 awards exist, they are repeated to fill the row
   * (only the EDACY valedictorian award today). Real awards take the slots once added.
   */
  protected readonly cards = computed<readonly AwardCard[]>(() => {
    const format = new Intl.DateTimeFormat(this.i18n.lang() === 'fr' ? 'fr-FR' : 'en-GB', {
      month: 'long',
      year: 'numeric',
    });
    return fillSlots(AWARDS, SLOTS).map((award) => {
      const when = format.format(new Date(`${award.date}-01T00:00:00`));
      return { ...award, when: when.charAt(0).toLocaleUpperCase() + when.slice(1) };
    });
  });

  protected open(index: number): void {
    if (this.active() !== index) this.active.set(index);
  }
}

function fillSlots(awards: readonly Award[], slots: number): readonly Award[] {
  if (!awards.length) return [];
  return Array.from(
    { length: Math.max(slots, awards.length) },
    (_, i) => awards[i % awards.length],
  );
}
