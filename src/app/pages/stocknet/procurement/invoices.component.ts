import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoices.component.html',
})
export class InvoicesComponent implements OnInit {
  invoices = [
    { id: 'INV-1001', supplier: 'Bright Foods', amount: 1200, status: 'Pending' },
    { id: 'INV-1002', supplier: 'Green Supplies', amount: 4500, status: 'Verified' },
  ];

  ngOnInit(): void {}
}
