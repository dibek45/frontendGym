import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routine } from 'src/app/state/routines/routines.model';

@Component({
  selector: 'app-card-routine',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-routine.component.html',
  styleUrls: ['./card-routine.component.scss']
})
export class CardRoutineComponent {
deleteExercise(arg0: Routine) {
throw new Error('Method not implemented.');
}
editExercise(arg0: Routine) {
throw new Error('Method not implemented.');
}
  @Input() routine!: Routine;

  @Output() edit = new EventEmitter<Routine>();
  @Output() delete = new EventEmitter<Routine>();

  onEdit() {
    this.edit.emit(this.routine);
  }

  onDelete() {
    this.delete.emit(this.routine);
  }
}
