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
      this.authService.login(email, password).subscribe(
        (response) => {
          const { accessToken, refreshToken } = response;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);

          // Decode the accessToken to extract the role
          const decodedToken: any = jwtDecode(accessToken);
          const role = decodedToken.role;
          localStorage.setItem('role', role);
          if (role === 'SUPER_ADMIN') {
            this.router.navigate(['/users']);
          } else {
            //change it later
            console.error('Unauthorized access!');
          }
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
