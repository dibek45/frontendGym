import { Component, OnInit, ViewChild } from '@angular/core';
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
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { FullCalendarComponent } from '@fullcalendar/angular';

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
  styleUrls: ['./agenda.component.scss'],
  animations: [
    trigger('eventosFade', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(10px)' }),
            stagger(100, [
              animate(
                '250ms ease-out',
                style({ opacity: 1, transform: 'translateY(0)' })
              )
            ])
          ],
          { optional: true }
        ),
        query(
          ':leave',
          [
            animate(
              '200ms ease-in',
              style({ opacity: 0, transform: 'translateY(-10px)' })
            )
          ],
          { optional: true }
        )
      ])
    ])
  ]
})
export class AgendaComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}

  @ViewChild('fullCalendar') fullCalendar!: FullCalendarComponent;

  filtroActivo: string = '';
  claseActiva: string = '';
  textoBusqueda: string = '';
  fechaSeleccionada: string = '';
  mostrarCalendario = true;

  eventosBase: EventoPersonalizado[] = [];
  eventosTotales: EventoPersonalizado[] = [];
  eventosFiltrados: EventoPersonalizado[] = [];

  filtrosCompletos = [
    {
      categoria: 'Clases',
      subtipos: ['Spinning', 'Box', 'Karate', 'Zumba']
    },
    {
      categoria: 'Eventos',
      subtipos: ['Evaluación Física', 'Taller de Nutrición', 'Clase Muestra', 'Bootcamp al Aire Libre']
    }
  ];

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth'
    },
    selectable: true,
    nowIndicator: true,
    dayMaxEvents: 3,
    events: [],
    dateClick: this.handleDateClick.bind(this),
    eventClick: (info: any) => {
      info.jsEvent.preventDefault();
    },
    eventDisplay: 'none',
    dayCellContent: this.dayCellContent.bind(this),
    eventDidMount: (info: any) => {
      if (info.el.classList.contains('fc-more')) {
        info.el.addEventListener('click', (e: any) => {
          e.preventDefault();
          e.stopPropagation();
        });
      }
    },
    eventContent: this.eventContent.bind(this)
  };

  ngOnInit() {
    this.generarClasesYEventosDinamicos();

    this.route.paramMap.subscribe(params => {
      const categoria = params.get('categoria');
      this.filtroActivo = categoria ? this.capitalizar(categoria) : '';
      this.claseActiva = '';
      this.actualizarEventosFiltrados();
    });
  }

  seleccionarClase(clase: string) {
    this.claseActiva = clase;

    if (this.filtroActivo === 'Clases') {
      this.eventosTotales = this.eventosBase.filter(e => e.tipo !== 'Clases');
      this.generarClases(clase);
    } else if (this.filtroActivo === 'Eventos') {
      this.eventosTotales = this.eventosBase.filter(e => e.tipo !== 'Eventos');
      this.generarEventos(clase);
    }

    this.mostrarCalendario = false;
    setTimeout(() => {
      this.mostrarCalendario = true;
      this.actualizarEventosFiltrados();
    });
  }

  generarClasesYEventosDinamicos() {
    // Aquí deberías generar los eventos y asignarlos a eventosBase y eventosTotales
    // Por ejemplo:
    const eventos: EventoPersonalizado[] = []; // ← Genera tus eventos aquí
    this.eventosBase = [...eventos];
    this.eventosTotales = [...eventos];
    this.actualizarEventosFiltrados();
  }

  actualizarEventosFiltrados() {
    const ahora = new Date();

    this.eventosFiltrados = this.eventosTotales.filter(e => {
      const fechaFinEvento = new Date(e.end);
      const coincideFiltro = !this.filtroActivo || e.tipo === this.filtroActivo;
      const coincideSubFiltro = !this.claseActiva || e.subTipo === this.claseActiva;
      const coincideTexto =
        !this.textoBusqueda ||
        e.title.toLowerCase().includes(this.textoBusqueda.toLowerCase()) ||
        (e.instructor?.toLowerCase().includes(this.textoBusqueda.toLowerCase()));
      return coincideFiltro && coincideSubFiltro && coincideTexto && fechaFinEvento >= ahora;
    });

    if (this.fullCalendar?.getApi) {
      const calendarApi = this.fullCalendar.getApi();
      calendarApi.removeAllEvents();
      calendarApi.addEventSource(this.eventosFiltrados);
      calendarApi.render();
    }
  }

  handleDateClick(arg: any) {
    this.fechaSeleccionada = arg.dateStr;
    this.actualizarEventosFiltrados();
  }

  capitalizar(texto: string): string {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  dayCellContent(arg: any) {
    const dateStr = arg.date.toISOString().split('T')[0];
    const cantidad = this.eventosFiltrados.filter(e => e.start.startsWith(dateStr)).length;
    const dayNumber = arg.dayNumberText;
    const indicador = cantidad > 0 ? `<div style="font-size:10px; color:#1976d2;">${cantidad} ${cantidad === 1 ? 'clase' : 'clases'}</div>` : '';
    return {
      html: `<div style="height: 100%; display: flex; flex-direction: column; justify-content: space-between; align-items: flex-end; padding: 2px;"><div style="font-size: 12px; font-weight: 600; color: #444;">${dayNumber}</div>${indicador}</div>`
    };
  }

  eventContent(info: any) {
    const tipo = info.event.extendedProps.tipo || 'Evento';
    return {
      html: `<div style="font-size: 11px; color: #333; text-align: center;">${tipo === 'Clases' ? 'Clase' : 'Evento'}</div>`
    };
  }

  getEventosDelDia(): EventoPersonalizado[] {
    if (!this.fechaSeleccionada) return [];
    return this.eventosFiltrados.filter(e => e.start.startsWith(this.fechaSeleccionada));
  }

  goBack() {
    this.router.navigate(['home/main-screen']);
  }

  regresar() {
    this.router.navigate(['/home/main-screen']);
  }

  resetFiltros() {
    this.filtroActivo = '';
    this.claseActiva = '';
    this.fechaSeleccionada = '';
    this.textoBusqueda = '';
    this.actualizarEventosFiltrados();
  }

  generarClases(subTipo: string) {
    // Lógica de generación de clases por subTipo (usa la misma lógica que ya tenías)
  }

  generarEventos(subTipo: string) {
    // Lógica de generación de eventos por subTipo (usa la misma lógica que ya tenías)
  }


  obtenerSubfiltros(): string[] {
  const filtro = this.filtrosCompletos.find(f => f.categoria === this.filtroActivo);
  return filtro ? filtro.subtipos : [];
}
getFechaSeleccionadaComoDate(): Date | null {
  return this.fechaSeleccionada ? new Date(this.fechaSeleccionada) : null;
}
trackByEventoId(index: number, evento: EventoPersonalizado): string {
  return evento.id;
}

}