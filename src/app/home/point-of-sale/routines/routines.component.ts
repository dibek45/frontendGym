import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';
import {
  selectExerciseTypes,
  selectRoutinesByTypeId,
  selectExerciseTypeError,
  selectRoutineError,
} from 'src/app/state/point-of-sale/routines/routines.selectors';
import {
  loadExerciseTypes,
  loadRoutinesByType,
  addRoutine,
  editRoutine,
  deleteRoutine,
} from 'src/app/state/point-of-sale/routines/routines.actions';
import { Routine, ExerciseType } from 'src/app/state/point-of-sale/routines/routines.model';
import { AddExerciseDialogComponent } from './add-exercise-dialog.component';
import { EditExerciseDialogComponent } from './edit-exercise-dialog.component';
import { HorizontalFilterButtonsComponent } from '../components/horizontal-filter-buttons-component/horizontal-filter-buttons-component.component';
import { CommonModule } from '@angular/common';
import { CtnCreateSearchComponent } from '../components/components/ctn-create-search/ctn-create-search.component';
import { CardRoutineComponent } from '../components/card-routine/card-routine.component';

@Component({
  selector: 'app-routines',
  templateUrl: './routines.component.html',
  standalone:true,
  imports:[CommonModule, HorizontalFilterButtonsComponent,CtnCreateSearchComponent,CardRoutineComponent],
  styleUrls: ['./routines.component.scss'],
})
export class RoutinesComponent implements OnInit {
  searchTerm = '';

onCreateClick() {
throw new Error('Method not implemented.');
}
onSearch(term: string) {
  this.searchTerm = term;

  if (this.selectedType) {
    this.routines$ = this.store.select(selectRoutinesByTypeId(this.selectedType.id)).pipe(
      map(routines =>
        routines.filter(r =>
          r.name.toLowerCase().includes(term.toLowerCase())
        )
      )
    );
  }
}

  exerciseTypes$!: Observable<ExerciseType[]>; // Observable for exercise types
  exerciseTypeError$!: Observable<string | null>; // Observable for exercise type errors
  routines$!: Observable<Routine[]>; // Observable for routines
  routineError$!: Observable<string | null>; // Observable for routine errors
  selectedType: ExerciseType | null = null; // Currently selected exercise type

  constructor(private store: Store, private dialog: MatDialog) {}

  ngOnInit() {
    // Load exercise types on initialization
    this.store.dispatch(loadExerciseTypes({ gymId: 1 })); // Static gymId, replace if dynamic

    // Selectors for exercise types and errors
    this.exerciseTypes$ = this.store.select(selectExerciseTypes);
    this.exerciseTypeError$ = this.store.select(selectExerciseTypeError);
  }



  addExercise() {
    // Open dialog to add a new routine
    const dialogRef = this.dialog.open(AddExerciseDialogComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((result: Routine) => {
      if (result && this.selectedType) {
        // Dispatch action to add a routine
        this.store.dispatch(
          addRoutine({
            routine: {
              ...result,
              exerciseTypeId: this.selectedType.id,
              count: 0,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          })
        );
      }
    });
  }

  editExercise(routine: Routine) {
    // Open dialog to edit an existing routine
    const dialogRef = this.dialog.open(EditExerciseDialogComponent, {
      width: '300px',
      data: { ...routine },
    });

    dialogRef.afterClosed().subscribe((result: Routine) => {
      if (result) {
        // Dispatch action to edit the routine
        this.store.dispatch(editRoutine({ routine: result }));
      }
    });
  }

  deleteExercise(routine: Routine) {
    if (!this.selectedType) return;

    // Dispatch action to delete the routine
    this.store.dispatch(
      deleteRoutine({
        routineId: routine.id,
        exerciseTypeId: this.selectedType.id,
      })
    );
  }
  selectType(type: { id: number; name: string }) {
    this.exerciseTypes$.subscribe(types => {
      const found = types.find(t => t.id === type.id);
      if (found) {
        this.selectedType = found;
        this.store.dispatch(loadRoutinesByType({ exerciseTypeId: found.id }));
  
        this.routines$ = this.store.select(selectRoutinesByTypeId(found.id)).pipe(
          map(routines =>
            routines.filter(r =>
              r.name.toLowerCase().includes(this.searchTerm.toLowerCase())
            )
          )
        );
  
        this.routineError$ = this.store.select(selectRoutineError);
      }
    });
  }
  
  
}
