import {
  HttpClient,
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const httpClient = inject(HttpClient);
  const router = inject(Router);
  const authService = new AuthService(httpClient, router); // Pass it to AuthService
  const accessToken = localStorage.getItem('accessToken');

  if (req.url === 'http://localhost:8070/bff/login') {
    return next(req); // Skip token logic for login endpoint
  }

  if (accessToken) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (
        error.status === 401 &&
        error.error?.message?.includes('Expired access token')
      ) {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          authService.logout(); // Handle missing refresh token
          return throwError(() => error);
        }

        return authService.refreshToken().pipe(
          switchMap((response) => {
            localStorage.setItem('accessToken', response.accessToken);

            const clonedRequest = req.clone({
              setHeaders: {
                Authorization: `Bearer ${response.accessToken}`,
              },
            });
            return next(clonedRequest);
          }),
          catchError((refreshError) => {
            authService.logout(); // Handle refresh token failure
            return throwError(() => refreshError);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
