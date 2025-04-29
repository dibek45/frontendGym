import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DataPerDay {
  date: string;
  amount: number;
  tickets: number;
  extra?: number;
}

export interface WeekDayData {
  label: string;
  amount: number;
  tickets: number;
  extra: number;
}

@Component({
  selector: 'app-summary-weekly',
  standalone: true,
  templateUrl: './summary-weekly.component.html',
  styleUrls: ['./summary-weekly.component.scss'],
  imports: [CommonModule],
})
export class SummaryWeeklyComponent implements OnChanges {
  @Input() weekStartDate!: Date;
  @Input() dataPerDay: DataPerDay[] = [];
  @Input() title: string = '';
  @Input() totalLabel: string = '';
  @Input() extraLabel: string = '';
  selectedDay: WeekDayData | null = null;

  totalExtra: number = 0;
  
  weekDays: WeekDayData[] = [];
  @Output() seeActivity = new EventEmitter<void>();

  selectedRange: string = '';
  totalAmount: number = 0;
  totalTickets: number = 0;
  bestDay: string = '';
  maxAmount: number = 0;
  maxHeight: number = 120; // Altura máxima para las barras

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataPerDay'] || changes['weekStartDate']) {
      this.calculateWeek();
    }
  }

  previousWeek() {
    const previous = new Date(this.weekStartDate);
    previous.setDate(this.weekStartDate.getDate() - 7);
    this.weekStartDate = previous;
    this.calculateWeek();
  }

  nextWeek() {
    const next = new Date(this.weekStartDate);
    next.setDate(this.weekStartDate.getDate() + 7);
    this.weekStartDate = next;
    this.calculateWeek();
  }

  calculateWeek() {
    const diasSemana = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    this.weekDays = [];
    this.totalAmount = 0;
    this.totalTickets = 0;
    this.totalExtra = 0; // 🔵 no lo reseteabas antes
    let bestDayValue = 0;
    let bestDayTemp = '';
  
    for (let i = 0; i < 7; i++) {
      const date = new Date(this.weekStartDate);
      date.setDate(this.weekStartDate.getDate() + i);
  
      const dateString = date.toISOString().split('T')[0];
      const record = this.dataPerDay.find(v => v.date === dateString);
  
      const amount = record?.amount ?? 0;
      const tickets = record?.tickets ?? 0;
      const extra = record?.extra ?? 0;
  
      this.weekDays.push({
        label: `${diasSemana[i]} ${date.getDate()}`,
        amount,
        tickets,
        extra
      });
  
      this.totalAmount += amount;
      this.totalTickets += tickets;
      this.totalExtra += extra; // 🔵 sumar extras también
  
      // 🔵 Aquí actualizar bien el día más fuerte
      if (amount > bestDayValue) {
        bestDayValue = amount;
        bestDayTemp = `${diasSemana[i]} ${date.getDate()}`;
      }
    }
  
    this.maxAmount = Math.max(...this.weekDays.map(d => d.amount)) || 1;
    this.bestDay = bestDayTemp || '—';
    this.selectedRange = this.formatRange(this.weekStartDate);
  }
  

  formatRange(start: Date): string {
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return `${this.getMonthName(start)} ${start.getDate()} - ${this.getMonthName(end)} ${end.getDate()}`;
  }

  getMonthName(date: Date): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[date.getMonth()];
  }

  selectDay(day: WeekDayData) {
    this.selectedDay = day;
  }
  onSeeActivity() {
    this.seeActivity.emit();
  }
  
  
}

