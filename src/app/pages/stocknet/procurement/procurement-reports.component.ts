import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-procurement-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './procurement-reports.component.html',
})
export class ProcurementReportsComponent implements OnInit {
  ngOnInit(): void {}
}
