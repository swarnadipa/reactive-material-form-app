import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tab',
  styleUrls: ['./tab.component.scss'],
  templateUrl: './tab.component.html'
})
export class TabComponent {
  @Input('tabTitle') title: string;
  @Input() active = false;
  @Input() isCloseable = false;
  @Input() template;
  @Input() dataContext;
}
