import { Component } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss']
})
export class AgendaComponent {

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth', // Comienza en vista mensual
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    selectable: true,
    nowIndicator: true,
    dateClick: this.handleDateClick.bind(this), // Aquí manejas el click en el mes
    select: this.handleDateSelect.bind(this),   // Selección de rangos (opcional)
    eventDidMount: this.handleEventMount.bind(this),
    events: [] // Tus eventos aquí
  };
  
  currentEvents: EventApi[] = [];



  // Al hacer click sobre un evento
  handleEventMount(info: any) {
    // Escucha el evento de click derecho
    info.el.addEventListener('contextmenu', (mouseEvent: MouseEvent) => {
      mouseEvent.preventDefault(); // Evita el menú contextual del navegador
      this.confirmDelete(info.event);
    });
  }
  confirmDelete(event: EventApi) {
    if (confirm(`¿Eliminar "${event.title}"?`)) {
      event.remove();
    }
  }
  
  handleDateClick(arg: any) {
    const calendarApi = arg.view.calendar;
  
    // Cambia a la vista "timeGridDay" y navega a la fecha seleccionada
    calendarApi.changeView('timeGridDay', arg.dateStr);
  }
  

  // Opcional: mantiene la lista de eventos actualizada
  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }
  handleDateSelect(selectInfo: DateSelectArg) {
    const calendarApi = selectInfo.view.calendar;
    const currentView = selectInfo.view.type;
  
    console.log('Vista actual:', currentView);
  
    calendarApi.unselect(); // Limpia la selección después del click
  
    if (currentView === 'timeGridDay') {
      // Aquí es donde abrirías tu modal (o prompt en este ejemplo)
      const title = prompt('Escribe el nombre de la clase o reserva:');
  
      if (title) {
        calendarApi.addEvent({
          id: String(new Date().getTime()),
          title,
          start: selectInfo.startStr,
          end: selectInfo.endStr,
          allDay: selectInfo.allDay
        });
      }
    } else {
      console.log('No se puede agendar desde esta vista.');
    }
  }
  
}
