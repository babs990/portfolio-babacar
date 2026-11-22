import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SKILL_KEYS } from '@core/constants/skills';
import { TranslatePipe } from '@core/pipes/translate-pipe';
import { Marquee } from '@shared/ui/marquee/marquee';

@Component({
  selector: 'app-skills-marquee-section',
  imports: [TranslatePipe, Marquee],
  templateUrl: './skills-marquee-section.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsMarqueeSection {
  protected readonly skills = SKILL_KEYS;
}
