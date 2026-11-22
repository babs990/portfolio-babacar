import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Articles {}
