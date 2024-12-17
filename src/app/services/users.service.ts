import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../users';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  baseUrl: string = 'http://localhost:8070/bff';
  urlUsers: string = '/users';

  constructor(private http: HttpClient) {}

  getUsers(
    page: number = 0,
    pageSize: number = 10,
    filters?: { username?: string }
  ): Observable<{ data: User[]; totalElements: number; totalPages: number }> {
    let requestUrl = `${this.baseUrl}${this.urlUsers}?page=${page}&pageSize=${pageSize}`;

    if (filters?.username) {
      requestUrl += `&username=${encodeURIComponent(filters.username)}`;
    }

    console.log('Request URL:', requestUrl);

    return this.http.get<any>(requestUrl).pipe(
      map((response) => ({
        data: response.data,
        totalElements: response.totalElements,
        totalPages: response.totalPages,
      })),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    return throwError('Something bad happened; please try again later.');
  }
}
