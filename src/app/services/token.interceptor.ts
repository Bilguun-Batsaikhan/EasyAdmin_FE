import {
  HttpClient,
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError, Observable, finalize } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

let isRefreshing = false; // Prevent multiple refresh attempts
let pendingRequests: Array<(token: string) => void> = []; // Stores pending requests during a refresh

function processPendingRequests(token: string) {
  pendingRequests.forEach((cb) => cb(token));
  pendingRequests = [];
}

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const accessToken = localStorage.getItem('accessToken');

  if (req.url === 'http://localhost:8070/bff/login') {
    return next(req); // Skip token logic for login endpoint
  }

  // Attach the access token if it exists
  if (accessToken) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log('HTTP Error:', error);

      // Parse error message
      let errorMessage = '';
      try {
        // Backend returns a JSON string, so we parse it
        const parsedError = JSON.parse(error.error);
        errorMessage = parsedError.message || '';
      } catch (e) {
        errorMessage = error.error?.message || 'Unknown error';
      }

      // Handle 401 and expired token errors
      if (
        error.status === 401 &&
        errorMessage.includes('Expired access token')
      ) {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          console.log('No refresh token found, logging out');
          authService.logout();
          return throwError(() => error);
        }

        // Prevent multiple refresh attempts
        if (isRefreshing) {
          return new Observable((observer) => {
            pendingRequests.push((newToken) => {
              observer.next(newToken);
              observer.complete();
            });
          }).pipe(
            switchMap((newToken) => {
              const clonedRequest = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`,
                },
              });
              return next(clonedRequest);
            })
          );
        }

        isRefreshing = true;

        return authService.refreshToken().pipe(
          switchMap((response) => {
            console.log(
              'Refresh token successful, new access token:',
              response.accessToken
            );
            localStorage.setItem('accessToken', response.accessToken);

            // Process pending requests
            processPendingRequests(response.accessToken);

            // Retry the original request with the new token
            const clonedRequest = req.clone({
              setHeaders: {
                Authorization: `Bearer ${response.accessToken}`,
              },
            });
            return next(clonedRequest);
          }),
          catchError((refreshError) => {
            console.log('Refresh token failed, logging out');
            authService.logout();
            return throwError(() => refreshError);
          }),
          finalize(() => {
            isRefreshing = false; // Reset the flag
          })
        );
      }

      // Handle other errors
      if (error.status === 403) {
        console.log('Forbidden access, redirecting to login...');
        authService.logout();
      } else if (error.status >= 500) {
        console.error('Server error:', error.message);
      }

      return throwError(() => error);
    })
  );
};
