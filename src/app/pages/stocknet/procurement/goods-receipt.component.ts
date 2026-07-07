import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-goods-receipt',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './goods-receipt.component.html',
})
export class GoodsReceiptComponent implements OnInit {
  receipts = [
    { id: 'GR-001', po: 'PO-001', received_on: '2026-09-11', status: 'Verified' },
    { id: 'GR-002', po: 'PO-002', received_on: '2026-09-12', status: 'Pending' },
  ];

  ngOnInit(): void {}
}
