import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-purchase-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './purchase-orders.component.html',
})
export class PurchaseOrdersComponent implements OnInit {
  orders = [
    { id: 'PO-001', supplier: 'Bright Foods', total: 1200, status: 'Pending' },
    { id: 'PO-002', supplier: 'Green Supplies', total: 4500, status: 'Sent' },
  ];

  ngOnInit(): void {}
}
