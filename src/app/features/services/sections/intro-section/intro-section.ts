import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TranslatePipe } from '@core/pipes/translate-pipe';
import { Button } from '@shared/ui/button/button';

/**
 * Services page header (Figma): tilted user-flow card on the left, "My process" pill,
 * the page h1 on two lines, a short pitch and a "My process ↓" button that scrolls to
 * the method section.
 */
@Component({
  selector: 'app-intro-section',
  imports: [NgOptimizedImage, RouterLink, TranslatePipe, Button],
  templateUrl: './intro-section.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntroSection {}
