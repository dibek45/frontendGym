import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CalendarOptions,
  DateSelectArg,
  EventApi
} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

interface EventoPersonalizado {
  id: string;
  title: string;
  tipo: string;
  subTipo?: string;
  start: string;
  end: string;
  instructor?: string;
}

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss']
})
export class AgendaComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}

  filtroActivo: string = '';
  claseActiva: string = '';
  textoBusqueda: string = '';
  fechaSeleccionada: string = '';

  filtrosCompletos = [
    {
      categoria: 'Clases',
      subtipos: ['Spinning', 'Box', 'Karate', 'Zumba']
    },
    {
      categoria: 'Citas',
      subtipos: ['Nutriólogo', 'Fisioterapeuta']
    },
    {
      categoria: 'Entrenadores',
      subtipos: ['Alberto', 'María', 'Juan']
    },
    {
      categoria: 'Otros',
      subtipos: ['Clase muestra', 'Evaluación']
    }
  ];

  eventosTotales: EventoPersonalizado[] = [
    {
      id: '1',
      title: 'Clase de Box',
      tipo: 'Clases',
      subTipo: 'Box',
      instructor: 'Carlos',
      start: '2025-04-22T10:00:00',
      end: '2025-04-22T11:00:00'
    },
    {
      id: '2',
      title: 'Consulta Nutricional',
      tipo: 'Citas',
      subTipo: 'Nutriólogo',
      instructor: 'Fernanda',
      start: '2025-04-22T13:00:00',
      end: '2025-04-22T14:00:00'
    }
  ];

  eventosFiltrados: EventoPersonalizado[] = [];

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    selectable: true,
    nowIndicator: true,
    events: [],
    dateClick: this.handleDateClick.bind(this),
    select: this.handleDateSelect.bind(this),
    eventDidMount: this.handleEventMount.bind(this)
  };

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const categoria = params.get('categoria');
      this.filtroActivo = categoria ? this.capitalizar(categoria) : '';
      this.claseActiva = '';
      this.actualizarEventosFiltrados();
    });
  }

  capitalizar(texto: string): string {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  seleccionarFiltro(categoria: string) {
    this.router.navigate(['/agenda', categoria.toLowerCase()]);
  }

  seleccionarClase(clase: string) {
    this.claseActiva = clase;
    this.actualizarEventosFiltrados();
  }

  obtenerSubfiltros(): string[] {
    const filtro = this.filtrosCompletos.find(f => f.categoria === this.filtroActivo);
    return filtro ? filtro.subtipos : [];
  }

  actualizarEventosFiltrados() {
    this.eventosFiltrados = this.eventosTotales.filter(e => {
      const coincideFiltro = !this.filtroActivo || e.tipo === this.filtroActivo;
      const coincideSubFiltro = !this.claseActiva || e.subTipo === this.claseActiva;
      const coincideTexto = !this.textoBusqueda || e.title.toLowerCase().includes(this.textoBusqueda.toLowerCase()) || (e.instructor?.toLowerCase().includes(this.textoBusqueda.toLowerCase()));
      return coincideFiltro && coincideSubFiltro && coincideTexto;
    });

    this.calendarOptions.events = [...this.eventosFiltrados];
  }

  handleDateClick(arg: any) {
    const calendarApi = arg.view.calendar;
    calendarApi.changeView('timeGridDay', arg.dateStr);
    this.fechaSeleccionada = arg.dateStr;
    this.actualizarEventosFiltrados();
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();

    const title = prompt('Nombre del evento:');
    if (title) {
      calendarApi.addEvent({
        id: String(new Date().getTime()),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });
    }
  }

  handleEventMount(info: any) {
    info.el.addEventListener('contextmenu', (mouseEvent: MouseEvent) => {
      mouseEvent.preventDefault();
      this.confirmDelete(info.event);
    });
  }

  confirmDelete(event: EventApi) {
    if (confirm(`¿Eliminar "${event.title}"?`)) {
      event.remove();
    }
  }

  volver() {
    this.router.navigate(['/agenda']);
  }


  resetFiltros() {
    this.filtroActivo = '';
    this.claseActiva = '';
    this.fechaSeleccionada = '';
    this.textoBusqueda = '';
    this.actualizarEventosFiltrados();
  }

}
