import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

interface AdminUserPayload {
  name: string;
  email: string;
  role: string;
  password?: string;
  performed_by?: string;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly baseUrl = `${environment.apiBaseUrl?.trim() || ''}/api`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/users/`);
  }

  createUser(payload: AdminUserPayload): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/users/`, payload);
  }

  updateUser(id: number, payload: AdminUserPayload): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/users/${id}/`, payload);
  }

  deleteUser(id: number, payload: { performed_by?: string } = {}): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/users/${id}/`, { body: payload });
  }

  getLogs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/audit-logs/`);
  }
}
