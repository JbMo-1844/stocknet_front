import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export type UserRole = 'admin' | 'procurement-officer' | 'storekeeper' | 'stock-keeper';

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthUser {
  name: string;
  email: string;
  role: UserRole;
}

interface AuthResult {
  user: AuthUser | null;
  message: string | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storageKey = 'stocknet-user';
  private readonly apiBaseUrl = `${environment.apiBaseUrl?.trim() || ''}/api/auth`;

  private currentUserSubject = new BehaviorSubject<AuthUser | null>(this.getStoredUser());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  async register(request: RegisterRequest): Promise<AuthResult> {
    try {
      const authUser = await firstValueFrom(this.http.post<AuthUser>(`${this.apiBaseUrl}/register/`, request));
      this.persistUser(authUser);
      return { user: authUser, message: null };
    } catch (error) {
      return { user: null, message: this.getErrorMessage(error) };
    }
  }

  async login(email: string, password: string): Promise<AuthResult> {
    try {
      const authUser = await firstValueFrom(this.http.post<AuthUser>(`${this.apiBaseUrl}/login/`, { email, password }));
      this.persistUser(authUser);
      return { user: authUser, message: null };
    } catch (error) {
      return { user: null, message: this.getErrorMessage(error) };
    }
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value ?? this.getStoredUser();
  }

  isAuthenticated(): boolean {
    return Boolean(this.getCurrentUser());
  }

  canAccess(roles: Array<UserRole | string>): boolean {
    const userRole = this.getCurrentUser()?.role;
    return Boolean(userRole && roles.includes(userRole));
  }

  private persistUser(user: AuthUser | null): void {
    if (!user) {
      localStorage.removeItem(this.storageKey);
      this.currentUserSubject.next(null);
      return;
    }

    localStorage.setItem(this.storageKey, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private getErrorMessage(error: unknown): string {
    const httpError = error as HttpErrorResponse;
    const detail = httpError?.error?.detail || httpError?.error?.message || httpError?.error?.error;

    if (httpError?.status === 401) {
      return 'The email or password you entered is incorrect. Please try again.';
    }

    if (httpError?.status === 409) {
      return 'An account with this email already exists.';
    }

    if (httpError?.status === 400) {
      return detail || 'Please check your details and try again.';
    }

    return detail || 'We could not complete that request right now. Please try again in a moment.';
  }

  private getStoredUser(): AuthUser | null {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }
}
