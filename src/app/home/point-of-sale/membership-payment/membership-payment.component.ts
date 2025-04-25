import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';import { SearchCreateListComponent } from '../components/search-create-list/search-create-list.component';
import { ExpenseCardComponent } from '../components/expense-card/expense-card.component';
import { MembershipCardComponent } from '../components/membership-card/membership-card.component';
//'src/shared/standalone/components/card-list/components/membership-card/membership-card.component';

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

@Component({
  selector: 'app-membership-payment',
  templateUrl: './membership-payment.component.html',
  styleUrls: ['./membership-payment.component.scss'],
  standalone: true,
  imports: [CommonModule, SearchCreateListComponent],
})

export class MembershipPaymentComponent {

  cardComponent = MembershipCardComponent;

  viewMode: 'table' | 'card' = 'card';

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
  filteredData: MembershipPaymentModel[] = [];

  toggleView() {
    this.viewMode = this.viewMode === 'table' ? 'card' : 'table';
  }

  edit(item: MembershipPaymentModel) {
    console.log('Edit:', item);
  }

  delete(item: MembershipPaymentModel) {
    console.log('Delete:', item);
  }

  applySearch(searchValue: string) {
    const term = searchValue.toLowerCase().trim();
  
    this.filteredData = this.data.filter(item =>
      item.memberName.toLowerCase().includes(term) ||
      item.membershipType.toLowerCase().includes(term) ||
      item.paymentMethod.toLowerCase().includes(term)
    );
  }
  
  onCreate() {
    alert('create:');
    // Aquí podrías navegar o abrir modal
    // this.router.navigate(['/ruta/nuevo']);
  }
  
  onEdit(item: any) {
    alert('Eliminar:'+item);
    // Puedes abrir modal o ir a una ruta con ID
    // this.router.navigate(['/ruta/editar', item.id]);
  }
  
  onDelete(item: any) {
    alert('Eliminar:'+item);
    // Aquí puedes abrir un diálogo de confirmación
    // if (confirm('¿Seguro que deseas eliminar?')) {
    //   this.deleteItem(item.id);
    // }
  }
  
}
