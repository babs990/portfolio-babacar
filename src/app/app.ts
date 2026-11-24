import { afterNextRender, ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AppLoader } from '@core/services/app-loader';
import { ScrollReveal } from '@core/services/scroll-reveal';
import { Footer } from '@layout/footer/footer';
import { Header } from '@layout/header/header';
import { ProjectViewerOverlay } from '@layout/project-viewer/project-viewer';
import { SearchDialog } from '@layout/search-dialog/search-dialog';
import { CustomCursor } from '@shared/cursor/custom-cursor/custom-cursor';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, SearchDialog, ProjectViewerOverlay, CustomCursor],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  constructor() {
    // Splash screen until the first page, fonts and hero image are ready.
    void inject(AppLoader).hideWhenReady();
    const reveal = inject(ScrollReveal);
    // Sections of every page fade in on scroll (see core/services/scroll-reveal.ts).
    afterNextRender(() => reveal.start());
  }
}
