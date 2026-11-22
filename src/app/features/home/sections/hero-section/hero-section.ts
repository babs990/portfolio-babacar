import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SOCIAL_LINKS } from '@core/constants/social-links';
import { TranslatePipe } from '@core/pipes/translate-pipe';
import { Button } from '@shared/ui/button/button';
import { SocialIconButton } from '@shared/ui/social-icon-button/social-icon-button';

@Component({
  selector: 'app-hero-section',
  imports: [NgOptimizedImage, RouterLink, TranslatePipe, Button, SocialIconButton],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroSection {
  protected readonly socialLinks = SOCIAL_LINKS;
}
