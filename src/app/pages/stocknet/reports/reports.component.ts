import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { StocknetApiService } from '../../../shared/services/stocknet-api.service';

interface MenuAlert {
  item: string;
  required_quantity: number;
  available_quantity: number;
  day: string;
  meal_type: string;
  cell: string;
}

interface ReleaseLog {
  type: string;
  description: string;
  performed_by: string;
  target: string;
  timestamp: number;
  day?: string;
  meal_type?: string;
  category?: string;
  quantity?: number;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
})
export class ReportsComponent implements OnInit {
  alerts: MenuAlert[] = [];
  logs: ReleaseLog[] = [];

  constructor(private api: StocknetApiService) {}

  ngOnInit(): void {
    this.api.getMenuAlerts().subscribe((entries) => {
      this.alerts = entries;
    });

    this.api.getReleaseLogs().subscribe((entries) => {
      this.logs = entries;
    });
  }
}
