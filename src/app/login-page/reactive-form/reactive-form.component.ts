import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../users.service';
import { AuthService } from '../../auth.service';
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
  ],
  templateUrl: './reactive-form.component.html',
  styleUrls: ['./reactive-form.component.css'],
})
export class ReactiveFormComponent {
  loginForm: FormGroup;
  usersService: UsersService = inject(UsersService);
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Email:', this.loginForm.value.email);
      console.log('Password:', this.loginForm.value.password);

      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;
      this.usersService.login(email, password).subscribe(
        (response) => {
          console.log('Login successful', response);
          this.authService.setAccessToken(response.accessToken);
          this.router.navigate(['/users']);
        },
        (error) => {
          console.error('Login failed!', error);
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
}
