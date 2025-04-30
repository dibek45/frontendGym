import { CommonModule } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-card-machine',
  standalone: true,
  templateUrl: './card-machine-component.component.html',
  styleUrls: ['./card-machine-component.component.scss'],
  imports: [CommonModule, MatIconModule, MatButtonModule]
})
export class CardMachineComponent {
  constructor(
    @Inject('membership') public machine: any,
    @Inject('edit') public onEdit: () => void,
    @Inject('delete') public onDelete: () => void,
    @Inject('addQr') public onAddQr: () => void
  ) {}
}