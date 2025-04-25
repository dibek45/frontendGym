import { Component, Input, Output, EventEmitter, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-membership-card',
  templateUrl: './membership-card.component.html',
  styleUrls: ['./membership-card.component.scss'],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class MembershipCardComponent {
  constructor(
    @Inject('membership') public membership: any,
    @Inject('edit') public editClicked: () => void,
    @Inject('delete') public deleteClicked: () => void
  ) {}
}
 





