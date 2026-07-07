import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-deliveries',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './deliveries.component.html',
})
export class DeliveriesComponent implements OnInit {
  deliveries = [
    { id: 'DL-001', supplier: 'Fresh Farms', expected: '2026-09-10', status: 'Arriving' },
    { id: 'DL-002', supplier: 'Camp Logistics', expected: '2026-09-12', status: 'Received' },
  ];

  ngOnInit(): void {}
}
