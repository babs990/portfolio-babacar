import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ContactCtaSection } from '@features/home/sections/contact-cta-section/contact-cta-section';
import { ServicesPreviewSection } from '@features/home/sections/services-preview-section/services-preview-section';

import { ExampleSection } from './sections/example-section/example-section';
import { IntroSection } from './sections/intro-section/intro-section';
import { MethodSection } from './sections/method-section/method-section';

/**
 * Services page: header → services band (home, without "See more") → 4 pillars
 * → concrete example → contact (home section).
 */
@Component({
  selector: 'app-services',
  imports: [IntroSection, ServicesPreviewSection, MethodSection, ExampleSection, ContactCtaSection],
  templateUrl: './services.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Services {}
