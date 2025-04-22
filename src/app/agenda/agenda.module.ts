import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgendaRoutingModule } from './agenda-routing.module';
import { AgendaComponent } from './component/agenda.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [
    AgendaComponent
  ],
  imports: [
    CommonModule,
    AgendaRoutingModule,
    FullCalendarModule,
    MatIconModule,
    MatCardModule
  ]
})
export class AgendaModule { }
