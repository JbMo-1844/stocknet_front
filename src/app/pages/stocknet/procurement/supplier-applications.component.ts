import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-supplier-applications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './supplier-applications.component.html',
})
export class SupplierApplicationsComponent implements OnInit {
  ngOnInit(): void {}
}
