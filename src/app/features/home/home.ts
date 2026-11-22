import { ChangeDetectionStrategy, Component } from '@angular/core';

import { HeroSection } from './sections/hero-section/hero-section';
import { SkillsMarqueeSection } from './sections/skills-marquee-section/skills-marquee-section';
import { ServicesPreviewSection } from './sections/services-preview-section/services-preview-section';
import { SelectedProjectsSection } from './sections/selected-projects-section/selected-projects-section';
import { AboutPreviewSection } from './sections/about-preview-section/about-preview-section';
import { GallerySection } from './sections/gallery-section/gallery-section';
import { ContactCtaSection } from './sections/contact-cta-section/contact-cta-section';

@Component({
  selector: 'app-home',
  imports: [
    HeroSection,
    SkillsMarqueeSection,
    ServicesPreviewSection,
    SelectedProjectsSection,
    GallerySection,
    AboutPreviewSection,
    ContactCtaSection,
  ],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {}
