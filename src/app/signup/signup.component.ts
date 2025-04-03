import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private toastService:ToastService) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['user']
    });
  }

  async onSubmit() {
    if (this.signupForm.invalid) return;
    const { email, password, role } = this.signupForm.value;
    try {
      await this.authService.signup(email, password, role);
    } catch (error: any) {
      this.toastService.showToast(error.message, 'error');
    }
  }
}
