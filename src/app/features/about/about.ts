import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CV_URL } from '@core/constants/cv';
import { TranslatePipe } from '@core/pipes/translate-pipe';
import { ContactCtaSection } from '@features/home/sections/contact-cta-section/contact-cta-section';
import { GallerySection } from '@features/home/sections/gallery-section/gallery-section';
import { Button } from '@shared/ui/button/button';
import { AwardsSection } from './sections/awards-section/awards-section';
import { ExperienceSection } from './sections/experience-section/experience-section';

/**
 * About page (Figma): centered intro (name as the page h1, bio, "My CV" button),
 * then the same auto-scrolling photo gallery as the home page, then the experience timeline, the awards cards and the home contact section.
 */
@Component({
  selector: 'app-about',
  imports: [
    TranslatePipe,
    Button,
    GallerySection,
    ExperienceSection,
    AwardsSection,
    ContactCtaSection,
  ],
  templateUrl: './about.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {
  protected readonly cvUrl = CV_URL;
}
