import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgendaRoutingModule } from './agenda-routing.module';
import { AgendaComponent } from './component/agenda.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    AgendaComponent
  ],
  imports: [
    CommonModule,
    AgendaRoutingModule,
    FullCalendarModule,
    MatIconModule
  ]
})
export class AgendaModule { }
