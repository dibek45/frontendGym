import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckinCardComponent } from '../checkin-card/checkin-card.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-checkin-list',
  standalone: true,
  imports: [CommonModule, CheckinCardComponent,
     CommonModule,
  FormsModule,
  MatFormFieldModule,
  MatInputModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatButtonModule,
  CheckinCardComponent,
  ],
  templateUrl: './checkin-list.component.html'
})
export class CheckinListComponent {
  selectedDate: Date = new Date();

  checkins = [
  {
    name: 'David García',
    photo: 'https://randomuser.me/api/portraits/men/32.jpg',
    time: '12:00 PM',
    inside: true,
    date: '2024-04-24'
  },
  {
    name: 'Ana Gómez',
    photo: 'https://randomuser.me/api/portraits/women/44.jpg',
    time: '12:15 PM',
    inside: false,
    date: '2024-04-24'
  },
  {
    name: 'Luis Martínez',
    photo: 'https://randomuser.me/api/portraits/men/76.jpg',
    time: '12:30 PM',
    inside: true,
    date: '2024-04-25'
  },
  {
    name: 'Sofía López',
    photo: 'https://randomuser.me/api/portraits/women/15.jpg',
    time: '1:15 PM',
    inside: false,
    date: '2024-04-25'
  },
  {
    name: 'Carlos Sánchez',
    photo: 'https://randomuser.me/api/portraits/men/11.jpg',
    time: '1:45 PM',
    inside: true,
    date: '2024-04-25'
  }
];


  filteredCheckins = [...this.checkins];

  filterCheckins() {
    const selected = this.selectedDate.toISOString().split('T')[0];
    this.filteredCheckins = this.checkins.filter(c => c.date === selected);
  }
}
