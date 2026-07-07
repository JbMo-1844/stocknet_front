import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService, UserRole } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const allowedRoles = (route.data['roles'] as Array<UserRole | string>) ?? [];
    if (this.authService.canAccess(allowedRoles)) {
      return true;
    }

    this.router.navigate(['/signin']);
    return false;
  }
}
