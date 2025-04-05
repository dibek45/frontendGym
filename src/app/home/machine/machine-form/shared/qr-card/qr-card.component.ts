import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { QRCodeModule } from 'angularx-qrcode';

@Component({
  selector: 'app-qr-card',
  templateUrl: './qr-card.component.html',
  styleUrls: ['./qr-card.component.scss'],
  standalone:true,
  imports:[
    CommonModule,
    QRCodeModule,
    ReactiveFormsModule,
    MatIconModule
   ]
})
export class QrCardComponent {
@Input() qrForm!: FormGroup;
  @Input() index!: number;

  @Output() remove = new EventEmitter<number>();
  @Output() accept = new EventEmitter<void>();

  editing: boolean = false;

  startEdit() {
    this.editing = true;
    alert("click")
  }

  stopEdit() {
    this.editing = false;
  }

  eliminar(index:number){
    alert("Eliminar")
    this.remove.emit(index)
  }
}
