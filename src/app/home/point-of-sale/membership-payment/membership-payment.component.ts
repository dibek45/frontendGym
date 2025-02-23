import { Component } from '@angular/core';

export interface MembershipPaymentModel {
  id: number; // ID único del pago
  memberId: number; // ID del miembro asociado
  memberName: string; // Nombre del miembro
  amount: number; // Monto del pago
  paymentMethod: string; // Método de pago (e.g., "cash", "credit")
  paymentDate: string; // Fecha del pago en formato ISO
  membershipType: string; // Tipo de membresía (e.g., "monthly", "annual")
  duration: string; // Duración de la membresía (e.g., "1 month", "1 year")
  cashierId: number; // ID del cajero que procesó el pago
}

@Component({
  selector: 'app-membership-payment',
  templateUrl: './membership-payment.component.html',
  styleUrls: ['./membership-payment.component.scss']
})
export class MembershipPaymentComponent {

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
    },
    {
      id: 3,
      memberId: 103,
      memberName: "Alice Brown",
      amount: 50.00,
      paymentMethod: "debit",
      paymentDate: "2024-11-03T14:15:00.000Z",
      membershipType: "monthly",
      duration: "1 month",
      cashierId: 1
    }
  ];
  
}
