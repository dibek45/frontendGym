import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

interface SummaryData {
  totalAmount: number;
  label: string;
  buttonText: string;
}

@Component({
  selector: 'app-summary-weekly-bottom-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary-weekly-bottom-section.component.html',
  styleUrls: ['./summary-weekly-bottom-section.component.scss']
})
export class SummaryWeeklyBottomSectionComponent {
  @Input() data!: SummaryData;
  @Output() seeActivity = new EventEmitter<void>();

  onSeeActivity() {
    this.seeActivity.emit();
  }
}
