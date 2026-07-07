import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-award-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './award-management.component.html',
})
export class AwardManagementComponent implements OnInit {
  ngOnInit(): void {}
}
