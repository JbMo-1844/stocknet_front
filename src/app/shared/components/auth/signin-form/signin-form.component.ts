
import { Component } from '@angular/core';
import { LabelComponent } from '../../form/label/label.component';
import { CheckboxComponent } from '../../form/input/checkbox.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { InputFieldComponent } from '../../form/input/input-field.component';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-signin-form',
  imports: [
    LabelComponent,
    CheckboxComponent,
    ButtonComponent,
    InputFieldComponent,
    RouterModule,
    FormsModule
],
  templateUrl: './signin-form.component.html',
  styles: ``
})
export class SigninFormComponent {
  showPassword = false;
  isChecked = false;
  isSubmitting = false;
  notification: { type: 'success' | 'error' | 'info'; message: string } | null = null;

  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  private validateForm(): string | null {
    if (!this.email.trim()) {
      return 'Please enter your email address.';
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.email.trim())) {
      return 'Please enter a valid email address.';
    }

    if (!this.password) {
      return 'Please enter your password.';
    }

    if (this.password.length < 6) {
      return 'Password must be at least 6 characters long.';
    }

    return null;
  }

  async onSignIn() {
    this.notification = null;

    const validationMessage = this.validateForm();
    if (validationMessage) {
      this.notification = { type: 'error', message: validationMessage };
      return;
    }

    this.isSubmitting = true;
    const result = await this.authService.login(this.email.trim(), this.password);
    this.isSubmitting = false;

    if (result.user) {
      this.notification = { type: 'success', message: `Welcome back, ${result.user.name}!` };
      this.router.navigate(['/']);
      return;
    }

    this.notification = {
      type: 'error',
      message: result.message || 'We could not sign you in right now. Please try again.',
    };
  }
}
