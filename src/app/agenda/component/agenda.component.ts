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
  

  eventosTotales: EventoPersonalizado[] = [
    
  ];

  eventosFiltrados: EventoPersonalizado[] = [];
  mostrarCalendario = true;
  trackByEventoId(index: number, evento: EventoPersonalizado): string {
    return evento.id;
  }
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
    eventClick: (info:any) => {
      info.jsEvent.preventDefault(); // Previene cualquier clic directo en eventos
    },
    eventDisplay: 'none',
    dayCellContent: this.dayCellContent.bind(this),   
    eventDidMount: (info:any) => {
      // ✅ Desactiva el comportamiento del botón "+n más"
      if (info.el.classList.contains('fc-more')) {
        info.el.addEventListener('click', (e:any) => {
          e.preventDefault();
          e.stopPropagation();
        });
      }
    },
    eventContent: this.eventContent.bind(this)
  };
  
  private generarClasesYEventosDinamicos() {
    const hoy = new Date();
    const lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() - hoy.getDay() + 1); // lunes
  
    const horariosClases: { [key: string]: { dias: number[], start: string, end: string, instructor: string } } = {
      'Box': { dias: [0, 1, 2, 3, 4], start: '', end: '', instructor: 'Carlos' },
      'Zumba': { dias: [0, 1, 2, 3], start: '15:00:00', end: '16:00:00', instructor: 'Alejandra' },
      'Karate': { dias: [0, 1, 2], start: '12:00:00', end: '14:00:00', instructor: 'Luis' },
      'Spinning': { dias: [1, 3], start: '07:00:00', end: '08:00:00', instructor: 'Marco' }
    };
  
    const eventosEspeciales = [
      { subTipo: 'Evaluación Física', diaOffset: 3, start: '10:00:00', end: '11:00:00', instructor: 'Ana' },
      { subTipo: 'Taller de Nutrición', diaOffset: 5, start: '18:00:00', end: '19:00:00', instructor: 'Sofía' },
      { subTipo: 'Clase Muestra', diaOffset: 6, start: '11:00:00', end: '12:00:00', instructor: 'Pedro' },
      { subTipo: 'Bootcamp al Aire Libre', diaOffset: 0, start: '07:00:00', end: '09:00:00', instructor: 'Marco' }
    ];
  
    this.eventosTotales = [];
  
    // 🔥 Generar clases
    Object.keys(horariosClases).forEach(subTipo => {
      const config = horariosClases[subTipo];
  
      for (let i = 0; i <= 6; i++) { // De lunes a domingo
        if (!config.dias.includes(i)) continue;
  
        const fecha = new Date(lunes);
        fecha.setDate(lunes.getDate() + i);
  
        // Ajuste especial para Box
        let start = config.start;
        let end = config.end;
        if (subTipo === 'Box') {
          if (i <= 1) { // lunes, martes
            start = '06:00:00';
            end = '07:00:00';
          } else { // miércoles a viernes
            start = '08:00:00';
            end = '09:00:00';
          }
        }
  
        const fechaISO = fecha.toISOString().split('T')[0];
        this.eventosTotales.push({
          id: `${subTipo.toLowerCase()}-${i}`,
          title: `Clase de ${subTipo}`,
          tipo: 'Clases',
          subTipo,
          instructor: config.instructor,
          start: `${fechaISO}T${start}`,
          end: `${fechaISO}T${end}`
        });
      }
    });
  
    // 🔥 Generar eventos especiales
    eventosEspeciales.forEach(evento => {
      const fecha = new Date(lunes);
      fecha.setDate(lunes.getDate() + evento.diaOffset);
      const fechaISO = fecha.toISOString().split('T')[0];
  
      this.eventosTotales.push({
        id: `evento-${evento.subTipo.toLowerCase().replace(/\s+/g, '-')}`,
        title: evento.subTipo,
        tipo: 'Eventos',
        subTipo: evento.subTipo,
        instructor: evento.instructor,
        start: `${fechaISO}T${evento.start}`,
        end: `${fechaISO}T${evento.end}`
      });
    });
  }
  
  ngOnInit() {
    this.generarClasesYEventosDinamicos();

    
    this.route.paramMap.subscribe(params => {
      const categoria = params.get('categoria');
      this.filtroActivo = categoria ? this.capitalizar(categoria) : '';
      this.claseActiva = '';
      this.actualizarEventosFiltrados();
    });
  }

  ngAfterViewInit() {
    // Espera al render
    setTimeout(() => {
      const todayCell = document.querySelector('.fc-day-today');
      if (todayCell) {
        todayCell.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 200);
  }
  dayCellContent(arg: any) {
    const dateStr = arg.date.toISOString().split('T')[0];
  
    const cantidad = this.eventosFiltrados.filter(e =>
      e.start.startsWith(dateStr)
    ).length;
  
    const dayNumber = arg.dayNumberText; // ← Día del mes (1, 2, 3, etc.)
  
    const indicador = cantidad > 0
      ? `<div style="font-size:10px; color:#1976d2;">${cantidad} ${cantidad === 1 ? 'clase' : 'clases'}</div>`
      : '';
  
    return {
      html: `
        <div style="height: 100%; display: flex; flex-direction: column; justify-content: space-between; align-items: flex-end; padding: 2px;">
          <div style="font-size: 12px; font-weight: 600; color: #444;">${dayNumber}</div>
          ${indicador}
        </div>
      `
    };
  }
  
  
  seleccionarClase(clase: string) {
    this.claseActiva = clase;
  
    // Eliminar eventos del tipo actual
    this.eventosTotales = this.eventosTotales.filter(e => e.tipo !== this.filtroActivo);
  
    // Generar los nuevos
    if (this.filtroActivo === 'Clases') {
      this.generarClases(clase);
    } else if (this.filtroActivo === 'Eventos') {
      this.generarEventos(clase);
    }
  
    // 🔁 Forzar destrucción temporal del calendario para que se vuelva a renderizar limpio
    this.mostrarCalendario = false;
  
    // ✅ Volver a mostrarlo después de un ciclo
    setTimeout(() => {
      this.mostrarCalendario = true;
      this.actualizarEventosFiltrados();
    }, 0);
  }
  
  
  generarClases(subTipo: string) {
    const hoy = new Date();
    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - hoy.getDay() + 1); // lunes
  
    const horarios: {
      [key: string]: { dias: number[]; start: string; end: string; instructor: string };
    } = {
      'Box':      { dias: [0,1,2,3,4], start: '', end: '', instructor: 'Carlos' },
      'Zumba':    { dias: [0,1,2,3],   start: '15:00:00', end: '16:00:00', instructor: 'Alejandra' },
      'Karate':   { dias: [0,1,2],     start: '12:00:00', end: '14:00:00', instructor: 'Luis' },
      'Spinning': { dias: [1,3],       start: '07:00:00', end: '08:00:00', instructor: 'Marco' }
    };
  
    for (let i = 0; i < 5; i++) {
      if (!horarios[subTipo] || !horarios[subTipo].dias.includes(i)) continue;
  
      const fecha = new Date(inicioSemana);
      fecha.setDate(inicioSemana.getDate() + i);
      const fechaISO = fecha.toISOString().split('T')[0];
  
      // Box tiene horarios variables por día
      let start = horarios[subTipo].start;
      let end = horarios[subTipo].end;
  
      if (subTipo === 'Box') {
        if (i <= 1) { // lunes, martes
          start = '06:00:00';
          end = '07:00:00';
        } else {      // miércoles a viernes
          start = '08:00:00';
          end = '09:00:00';
        }
      }
  
      this.eventosTotales.push({
        id: `${subTipo.toLowerCase()}-${i}`,
        title: `Clase de ${subTipo}`,
        tipo: 'Clases',
        subTipo,
        instructor: horarios[subTipo].instructor,
        start: `${fechaISO}T${start}`,
        end: `${fechaISO}T${end}`
      });
    }
  }
  
  
  
  
  
  capitalizar(texto: string): string {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  seleccionarFiltro(categoria: string) {
    this.router.navigate(['/agenda', categoria.toLowerCase()]);
  }



  

  obtenerSubfiltros(): string[] {
    const filtro = this.filtrosCompletos.find(f => f.categoria === this.filtroActivo);
    return filtro ? filtro.subtipos : [];
  }
  getFechaSeleccionadaComoDate(): Date | null {
    return this.fechaSeleccionada ? new Date(this.fechaSeleccionada) : null;
  }
  
  actualizarEventosFiltrados() {
    const ahora = new Date();
  
    // Limpia eventos pasados de la fuente
    this.eventosTotales = this.eventosTotales.filter(e => {
      const fechaFin = new Date(e.end);
      return fechaFin.getTime() >= ahora.getTime();
    });
  
    // Filtra para visualización
    this.eventosFiltrados = this.eventosTotales.filter(e => {
      const coincideFiltro = !this.filtroActivo || e.tipo === this.filtroActivo;
      const coincideSubFiltro = !this.claseActiva || e.subTipo === this.claseActiva;
      const coincideFecha = true; // 👈 SIEMPRE incluir eventos del mes
      const coincideTexto =
        !this.textoBusqueda ||
        e.title.toLowerCase().includes(this.textoBusqueda.toLowerCase()) ||
        (e.instructor?.toLowerCase().includes(this.textoBusqueda.toLowerCase()));
  
      const fechaFinEvento = new Date(e.end);
      const aunNoPasa = fechaFinEvento.getTime() >= ahora.getTime();
  
      console.log('Ahora:', ahora.toISOString());
      console.log('Fin evento:', e.end, '->', fechaFinEvento.toISOString(), 'Incluido:', aunNoPasa);
  
      return coincideFiltro && coincideSubFiltro && coincideFecha && coincideTexto && aunNoPasa;
    });
  
    // Actualiza el calendario
    if (this.fullCalendar?.getApi) {
      const calendarApi = this.fullCalendar.getApi();
      calendarApi.removeAllEvents();
      calendarApi.addEventSource(this.eventosFiltrados);
      setTimeout(() => {
        const calendarApi = this.fullCalendar.getApi();
        calendarApi.render(); // 🔁 fuerza redibujado
      }, 50);
      
    }
  }
  
  
  
  
  
  

  handleDateClick(arg: any) {
    const calendarApi = arg.view.calendar;
    this.fechaSeleccionada = arg.dateStr; // YYYY-MM-DD
  
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

  verCalendario() {
    this.mostrarCalendario = true;
    this.fechaSeleccionada = '';
    this.actualizarEventosFiltrados();
  }
  confirmDelete(event: EventApi) {
    if (confirm(`¿Eliminar "${event.title}"?`)) {
      event.remove();
    }
  }
  getEventosDelDia(): EventoPersonalizado[] {
    if (!this.fechaSeleccionada) return [];
    return this.eventosFiltrados.filter(e =>
      e.start.startsWith(this.fechaSeleccionada)
    );
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

  eventContent(info: any) {
    // Contamos cuántos eventos hay en ese día
    const totalEventos = info.view.getCurrentData().eventStore.defs;
    const evento = info.event;
  
    // Solo renderizamos un conteo genérico
    const tipo = evento.extendedProps.tipo || 'Evento';
  
    return {
      html: `
        <div style="font-size: 11px; color: #333; text-align: center;">
          ${tipo === 'Clases' ? 'Clase' : 'Evento'}
        </div>
      `
    };
  }
  
  generarEventos(subTipo: string) {
    const hoy = new Date();
    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - hoy.getDay()); // Domingo
  
    const mapaEventos: {
      [key: string]: {
        diaOffset: number;
        horaInicio: string;
        horaFin: string;
        instructor: string;
      };
    } = {
      'Evaluación Física': {
        diaOffset: 3, // Miércoles
        horaInicio: '10:00:00',
        horaFin: '11:00:00',
        instructor: 'Ana'
      },
      'Taller de Nutrición': {
        diaOffset: 5, // Viernes
        horaInicio: '18:00:00',
        horaFin: '19:00:00',
        instructor: 'Sofía'
      },
      'Clase Muestra': {
        diaOffset: 6, // Sábado
        horaInicio: '11:00:00',
        horaFin: '12:00:00',
        instructor: 'Pedro'
      },
      'Bootcamp al Aire Libre': {
        diaOffset: 0, // Domingo
        horaInicio: '07:00:00',
        horaFin: '09:00:00',
        instructor: 'Marco'
      }
    };
  
    const config = mapaEventos[subTipo];
    if (!config) return;
  
    const fecha = new Date(inicioSemana);
    fecha.setDate(inicioSemana.getDate() + config.diaOffset);
    const fechaISO = fecha.toISOString().split('T')[0];
  
    this.eventosTotales.push({
      id: `evento-${subTipo.toLowerCase().replace(/\s+/g, '-')}`,
      title: subTipo,
      tipo: 'Eventos',
      subTipo,
      instructor: config.instructor,
      start: `${fechaISO}T${config.horaInicio}`,
      end: `${fechaISO}T${config.horaFin}`
    });
  }
    
goBack() {
  this.router.navigate(['home/main-screen']);
}
  
}
