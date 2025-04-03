import { Component, OnInit, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      seller: [false]
    });
  }

  ngOnInit(): void {
    document.body.style.overflow = 'hidden';
  }

  @HostListener('window:beforeunload')
  ngOnDestroy() {
    document.body.style.overflow = 'auto';
  }

  async onSubmit() {
    if (this.loginForm.invalid) return;
    const { email, password, seller } = this.loginForm.value;
    const role = seller ? 'seller' : 'client';
    try {
      await this.authService.login(email, password, role);
    } catch (error: any) {
      this.errorMessage = error.message;
    }
  }

  async onGoogleLogin() {
    const role = this.loginForm.value.seller ? 'seller' : 'client';
    try {
      await this.authService.googleLogin(role);
    } catch (error: any) {
      this.errorMessage = error.message;
    }
  }
}
