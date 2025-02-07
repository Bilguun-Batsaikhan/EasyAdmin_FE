import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl: string = 'http://localhost:8070/bff';
  urlLogin: string = '/auth/login';

  constructor(private http: HttpClient, private router: Router) {}

  login(identifier: string, password: string): Observable<any> {
    const loginData = identifier.includes('@')
      ? { email: identifier, password }
      : { username: identifier, password };
    // console.log('Login Data:', loginData);

    return this.http
      .post<any>(`${this.baseUrl}${this.urlLogin}`, loginData)
      .pipe(
        tap((response) => {
          console.log('Login response:', response);
        })
      );
  }

  recoverPassword(emailRecovery: string): Observable<string> {
    return this.http
      .post<any>(`${this.baseUrl}/auth/recovery`, { email: emailRecovery })
      .pipe(
        tap((response) => {
          console.log('Recovery response:', response);
        })
      );
  }

  resetPassword(newPassword: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/reset`, {
      password: newPassword,
    });
  }
  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken = localStorage.getItem('accessToken');

    const headers = {
      Authorization: `Bearer ${accessToken}`, // Access token-ийг header-т нэмнэ
    };

    return this.http.post<any>(
      `${this.baseUrl}${this.urlLogin}/refresh`,
      { refreshToken: refreshToken },
      { headers: headers } // Headers-ийг тохиргоонд нэмэх
    );
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
  }

  isAuthenticatedToUsers(): boolean {
    return localStorage.getItem('role') === 'SUPER_ADMIN';
  }
}
