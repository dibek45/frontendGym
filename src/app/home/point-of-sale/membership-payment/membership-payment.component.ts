import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SearchCreateListComponent } from '../components/search-create-list/search-create-list.component';
import { SummaryWeeklyComponent } from '../components/earnings-summary/summary-weekly.component';
import { MembershipCardComponent } from '../components/membership-card/membership-card.component';

export interface MembershipPaymentModel {
  id: number;
  memberId: number;
  memberName: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  membershipType: string;
  duration: string;
  cashierId: number;
}

export interface DataPerDay {
  date: string;
  amount: number;
  tickets: number;
}

@Component({
  selector: 'app-membership-payment',
  templateUrl: './membership-payment.component.html',
  styleUrls: ['./membership-payment.component.scss'],
  standalone: true,
  imports: [CommonModule, SearchCreateListComponent, SummaryWeeklyComponent],
})
export class MembershipPaymentComponent {
  cardComponent = MembershipCardComponent;

  showActivityList = false;

  data: MembershipPaymentModel[] = [
    {
      id: 1,
      memberId: 101,
      memberName: "John Doe",
      amount: 50.00,
      paymentMethod: "cash",
      paymentDate: "2024-11-01T08:30:00.000Z",
      membershipType: "monthly",
      duration: "1 month",
      cashierId: 1
    },
    {
      id: 2,
      memberId: 102,
      memberName: "Jane Smith",
      amount: 500.00,
      paymentMethod: "credit",
      paymentDate: "2024-11-02T10:00:00.000Z",
      membershipType: "annual",
      duration: "1 year",
      cashierId: 2
    }
  ];

  displayedColumns: string[] = [
    'id', 'memberName', 'amount', 'paymentMethod',
    'paymentDate', 'membershipType', 'duration', 'actions'
  ];

  startOfWeek = new Date('2024-10-28');

  paymentsSemana: DataPerDay[] = this.data.map(payment => ({
    date: payment.paymentDate.split('T')[0],
    amount: payment.amount,
    tickets: 1
  }));

  handleSeeActivity() {
    this.showActivityList = true;
  }

  handleBackToSummary() {
    this.showActivityList = false;
  }

  onCreate() {
    alert('create:');
  }

  onEdit(item: any) {
    alert('Editar: ' + item);
  }

  onDelete(item: any) {
    alert('Eliminar: ' + item);
  }
}
