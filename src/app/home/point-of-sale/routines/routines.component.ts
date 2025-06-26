import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';
import {
  selectExerciseTypes,
  selectRoutinesByTypeId,
  selectExerciseTypeError,
  selectRoutineError,
  selectFilteredRoutinesByType,
} from 'src/app/state/routines/routines.selectors';
import {
  loadExerciseTypes,
  loadRoutinesByType,
  addRoutine,
  editRoutine,
  deleteRoutine,
  loadExerciseTypesSuccess,
} from 'src/app/state/routines/routines.actions';
import { Routine, ExerciseType } from 'src/app/state/routines/routines.model';
import { AddExerciseDialogComponent } from './add-exercise-dialog.component';
import { EditExerciseDialogComponent } from './edit-exercise-dialog.component';
import { HorizontalFilterButtonsComponent } from '../components/horizontal-filter-buttons-component/horizontal-filter-buttons-component.component';
import { CommonModule } from '@angular/common';
import { CtnCreateSearchComponent } from '../components/components/ctn-create-search/ctn-create-search.component';
import { CardRoutineComponent } from '../components/card-routine/card-routine.component';
import { RoutineService } from 'src/app/state/routines/routines.service';

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
this.addExercise() 
}
onSearch(term: string) {
  this.searchTerm = term;

  if (this.selectedType) {
    this.routines$ = this.store.select(
      selectFilteredRoutinesByType(this.selectedType.id, term)
    );
  }
}


  exerciseTypes$!: Observable<ExerciseType[]>; // Observable for exercise types
  exerciseTypeError$!: Observable<string | null>; // Observable for exercise type errors
  routines$!: Observable<Routine[]>; // Observable for routines
  routineError$!: Observable<string | null>; // Observable for routine errors
  selectedType: ExerciseType | null = null; // Currently selected exercise type

  constructor(private store: Store, private dialog: MatDialog,
      private routineService: RoutineService

  ) {}
ngOnInit() {
  console.log('🔁 Dispatch loadExerciseTypes');
  this.store.dispatch(loadExerciseTypes({ gymId: 1 }));

  this.exerciseTypes$ = this.store.select(selectExerciseTypes);
  this.exerciseTypeError$ = this.store.select(selectExerciseTypeError);

  this.exerciseTypes$.subscribe(types => {
    console.log('✅ Tipos de ejercicio recibidos en el componente:', types);
  });

  this.loadRoutinesFromCache(); // 👈 nuevo
}


async loadRoutinesFromCache() {
  const result = await this.routineService.getExerciseTypesWithCache();
  console.log('📦 Rutinas cargadas desde localforage:', result);
this.store.dispatch(loadExerciseTypesSuccess({ exerciseTypes: result.data }));
}


addExercise() {
  const dialogRef = this.dialog.open(AddExerciseDialogComponent, {
    width: '300px',
  });

  dialogRef.afterClosed().subscribe((result: Routine) => {
    if (result && this.selectedType) {
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

      // 🔁 Reasigna para forzar actualización de la vista
      this.routines$ = this.store.select(
        selectFilteredRoutinesByType(this.selectedType.id, this.searchTerm)
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



selectType(partial: { id: number; name: string }) {
  this.exerciseTypes$.subscribe(types => {
    const full = types.find(t => t.id === partial.id);
    if (full) {
      this.selectedType = full;
      this.routines$ = this.store.select(
        selectFilteredRoutinesByType(full.id, this.searchTerm)
      );
    }
  });
}

  
  
}
