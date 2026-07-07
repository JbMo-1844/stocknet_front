import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payments.component.html',
})
export class PaymentsComponent implements OnInit {
  payments = [
    { id: 'PAY-001', invoice: 'INV-1001', amount: 1200, status: 'Approved' },
    { id: 'PAY-002', invoice: 'INV-1002', amount: 4500, status: 'Pending' },
  ];

  ngOnInit(): void {}
}
