import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-chip',
  templateUrl: './chip.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Chip {}
