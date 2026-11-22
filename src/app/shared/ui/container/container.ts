import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-container',
  templateUrl: './container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Container {}
