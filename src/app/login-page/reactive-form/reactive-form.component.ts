import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../services/users.service';
import { AuthService } from '../../services/auth.service';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import jwt_decode, { jwtDecode } from 'jwt-decode';
import { CommonService } from '../../services/common.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

@Component({
  selector: 'app-reactive-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    DividerModule,
    ButtonModule,
    ConfirmPopupModule,
    ToastModule,
  ],
  templateUrl: './reactive-form.component.html',
  styleUrls: ['./reactive-form.component.css'],
  providers: [ConfirmationService, MessageService, CommonService],
})
export class ReactiveFormComponent {
  loginForm: FormGroup;
  recoveryForm: FormGroup;
  usersService: UsersService = inject(UsersService);
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  loginFailed: boolean = false;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
    this.recoveryForm = this.fb.group({
      emailRecovery: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(event: Event, buttonType: string): void {
    event.preventDefault();
    if (buttonType === 'signIn') {
      this.handleSignIn();
    } else if (buttonType === 'recover') {
      this.handleRecover();
    }
  }

  handleSignIn() {
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;
      this.authService.login(email, password).subscribe(
        (response) => {
          const { accessToken, refreshToken } = response;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);

          // Decode the accessToken to extract the role
          const decodedToken: any = jwtDecode(accessToken);
          const role = decodedToken.role;
          const username = decodedToken.username;

          localStorage.setItem('username', username);
          localStorage.setItem('role', role);
          if (role === 'SUPER_ADMIN') {
            this.router.navigate(['/users']);
          } else {
            this.router.navigate(['/assets']);
          }
        },
        (error) => {
          this.loginFailed = true;
          console.error('Login failed!', error);
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }

  handleRecover(): void {
    // Handle password recovery logic here
    console.log('Recover button clicked');
    console.log('Email:', this.loginForm.value.email);
    this.loading = true;
    this.authService
      .recoverPassword(this.recoveryForm.value.emailRecovery)
      .subscribe({
        next: (response) => {
          console.log('Recovery successful:', response);
          this.commonService.successMessage(
            'An email has been sent to your email address with further instructions.'
          );
          this.loading = false;
        },
        error: (error) => {
          this.commonService.errorMessage(
            'An error occurred while trying to recover your password. Please try again later.'
          );
          console.error('Recovery failed:', error);
        },
      });
  }
}
