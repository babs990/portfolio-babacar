import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TranslatePipe } from '@core/pipes/translate-pipe';
import { Button } from '@shared/ui/button/button';

@Component({
  selector: 'app-about-preview-section',
  imports: [NgOptimizedImage, RouterLink, TranslatePipe, Button],
  templateUrl: './about-preview-section.html',
  styleUrl: './about-preview-section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutPreviewSection {}
