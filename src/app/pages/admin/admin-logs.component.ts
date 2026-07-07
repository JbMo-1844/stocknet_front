import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../shared/services/admin.service';

interface AuditLog {
  id?: number;
  actor: string;
  action: string;
  details: string;
  created_at: string;
}

@Component({
  selector: 'app-admin-logs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-logs.component.html',
})
export class AdminLogsComponent implements OnInit {
  logs: AuditLog[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getLogs().subscribe({
      next: (logs) => (this.logs = logs),
      error: () => (this.logs = []),
    });
  }
}
