
import { Component } from '@angular/core';
import { LabelComponent } from '../../form/label/label.component';
import { CheckboxComponent } from '../../form/input/checkbox.component';
import { InputFieldComponent } from '../../form/input/input-field.component';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService, UserRole } from '../../../services/auth.service';

@Component({
  selector: 'app-signup-form',
  imports: [
    LabelComponent,
    CheckboxComponent,
    InputFieldComponent,
    RouterModule,
    FormsModule,
  ],
  templateUrl: './signup-form.component.html',
  styles: ``,
})
export class SignupFormComponent {
  showPassword = false;
  isChecked = false;
  isSubmitting = false;
  notification: { type: 'success' | 'error' | 'info'; message: string } | null = null;

  fname = '';
  lname = '';
  email = '';
  password = '';
  role: UserRole = 'storekeeper';

  constructor(private authService: AuthService, private router: Router) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  private validateForm(): string | null {
    if (!this.fname.trim()) {
      return 'Please enter your first name.';
    }

    if (!this.lname.trim()) {
      return 'Please enter your last name.';
    }

    if (!this.email.trim()) {
      return 'Please enter your email address.';
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.email.trim())) {
      return 'Please enter a valid email address.';
    }

    if (!this.password) {
      return 'Please enter a password.';
    }

    if (this.password.length < 6) {
      return 'Password must be at least 6 characters long.';
    }

    return null;
  }

  async onSignUp() {
    this.notification = null;

    const validationMessage = this.validateForm();
    if (validationMessage) {
      this.notification = { type: 'error', message: validationMessage };
      return;
    }

    this.isSubmitting = true;
    const result = await this.authService.register({
      name: `${this.fname.trim()} ${this.lname.trim()}`,
      email: this.email.trim(),
      password: this.password,
      role: this.role,
    });
    this.isSubmitting = false;

    if (result.user) {
      this.notification = { type: 'success', message: 'Your account was created successfully. Welcome aboard!' };
      this.router.navigate(['/']);
      return;
    }

    this.notification = {
      type: 'error',
      message: result.message || 'We could not create your account right now. Please try again.',
    };
  }
}
