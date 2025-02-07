import { Component } from '@angular/core';
import { NavigationBarComponent } from '../../navigation-bar/navigation-bar.component';
import { FooterComponent } from '../../home-page/footer/footer.component';
import { ButtonModule } from 'primeng/button';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonService } from '../../services/common.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    NavigationBarComponent,
    FooterComponent,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ConfirmPopupModule,
    ToastModule,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
  providers: [ConfirmationService, MessageService, CommonService],
})
export class ResetPasswordComponent {
  resetForm: FormGroup;
  confirmPassword: string = '';
  token: string | null = null;
  loading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private commonService: CommonService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.resetForm = this.fb.group({
      passRecovery: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Get the token from the query parameters
    this.token = this.route.snapshot.queryParamMap.get('token');
    console.log('Token:', this.token);
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.resetForm.valid) {
      this.handleReset();
    }
  }

  handleReset() {
    if (this.resetForm.get('passRecovery')!.value === this.confirmPassword) {
      this.loading = true;
      if (this.token) {
        localStorage.setItem('accessToken', this.token);
      }
      this.authService
        .resetPassword(this.resetForm.get('passRecovery')!.value)
        .subscribe({
          next: (response) => {
            console.log('Password reset:', response);
            this.commonService.successMessage('Password reset successfully');
            this.token = null;
            localStorage.removeItem('accessToken');
            setTimeout(() => {
              this.loading = false;
              this.commonService.successMessage('Redirecting to login');
            }, 3000);
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 6000);
          },
          error: (error) => {
            console.error('Error resetting password:', error);

            if (error.status === 401) {
              this.commonService.errorMessage(
                'Session expired. Redirecting to login...'
              );
              setTimeout(() => {
                this.authService.logout();
                this.router.navigate(['/login']);
              }, 3000);
            } else {
              this.commonService.errorMessage('Error resetting password');
              setTimeout(() => {
                this.loading = false;
                this.commonService.errorMessage('Redirecting to login');
                this.router.navigate(['/login']);
              }, 3000);
            }
          },
        });
    }
  }
}
