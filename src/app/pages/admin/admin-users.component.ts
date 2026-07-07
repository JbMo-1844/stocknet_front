import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../shared/services/admin.service';

interface AdminUser {
  id?: number;
  name: string;
  email: string;
  role: 'admin' | 'procurement-officer' | 'storekeeper' | 'stock-keeper';
  password?: string;
}

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.component.html',
})
export class AdminUsersComponent implements OnInit {
  users: AdminUser[] = [];
  form: AdminUser = { name: '', email: '', role: 'storekeeper', password: '' };
  editingId: number | null = null;
  notification: { type: 'success' | 'error'; message: string } | null = null;
  isSubmitting = false;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.adminService.getUsers().subscribe({
      next: (users) => (this.users = users),
      error: () => this.showMessage('error', 'Unable to load users right now.'),
    });
  }

  submit(): void {
    if (!this.form.name || !this.form.email || (!this.editingId && !this.form.password)) {
      this.showMessage('error', 'Please fill in the required fields.');
      return;
    }

    this.isSubmitting = true;
    const payload = {
      name: this.form.name,
      email: this.form.email,
      role: this.form.role,
      password: this.form.password || undefined,
      performed_by: 'Admin',
    };

    const request = this.editingId
      ? this.adminService.updateUser(this.editingId, payload)
      : this.adminService.createUser(payload);

    request.subscribe({
      next: () => {
        this.showMessage('success', this.editingId ? 'User updated successfully.' : 'User created successfully.');
        this.resetForm();
        this.loadUsers();
      },
      error: () => this.showMessage('error', 'The request could not be completed.'),
      complete: () => (this.isSubmitting = false),
    });
  }

  editUser(user: AdminUser): void {
    this.editingId = user.id ?? null;
    this.form = { ...user, password: '' };
  }

  deleteUser(id?: number): void {
    if (!id) {
      return;
    }

    this.adminService.deleteUser(id, { performed_by: 'Admin' }).subscribe({
      next: () => {
        this.showMessage('success', 'User deleted successfully.');
        this.loadUsers();
      },
      error: () => this.showMessage('error', 'Unable to delete user.'),
    });
  }

  resetForm(): void {
    this.form = { name: '', email: '', role: 'storekeeper', password: '' };
    this.editingId = null;
  }

  private showMessage(type: 'success' | 'error', message: string): void {
    this.notification = { type, message };
    this.isSubmitting = false;
  }
}
