import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl: string = 'http://localhost:8070/bff';
  urlLogin: string = '/auth/login';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const loginData = { email, password };
    console.log(loginData);

    return this.http
      .post<any>(`${this.baseUrl}${this.urlLogin}`, loginData)
      .pipe(
        tap((response) => {
          console.log('Login response:', response);
        })
      );
  }

  isAuthenticatedToUsers(): boolean {
    return localStorage.getItem('role') === 'SUPER_ADMIN';
  }
}
