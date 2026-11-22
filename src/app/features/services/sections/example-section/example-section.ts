import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TranslatePipe } from '@core/pipes/translate-pipe';

/**
 * Services "Concrete example" (Samba app case): title + text, then the design journey
 * left → right: persona card (problem / hypothesis) → pencil sketches → final mockups,
 * linked by dashed curved arrows. Vertical on mobile (arrows point down).
 */
@Component({
  selector: 'app-example-section',
  imports: [NgOptimizedImage, TranslatePipe],
  templateUrl: './example-section.html',
  styleUrl: './example-section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleSection {}
