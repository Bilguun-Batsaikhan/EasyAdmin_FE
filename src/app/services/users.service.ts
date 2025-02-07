import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../interfaces/users';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  baseUrl: string = 'http://localhost:8070/bff';
  urlUsers: string = '/users';

  constructor(private http: HttpClient) {}

  getUser(userId?: number): Observable<User> {
    if (!userId) {
      return throwError('User ID is required.');
    }
    const requestUrl = `${this.baseUrl}${this.urlUsers}/${userId}`;
    return this.http.get<User>(requestUrl).pipe(catchError(this.handleError));
  }

  getUsers(
    page: number = 0,
    pageSize: number = 10,
    filters?: { [key: string]: any }
  ): Observable<{ data: User[]; totalElements: number; totalPages: number }> {
    // Base query parameters for pagination
    let queryParams = `page=${page}&pageSize=${pageSize}`;

    // Append filters dynamically to the query parameters
    if (filters) {
      for (const key in filters) {
        if (filters[key] !== undefined && filters[key] !== null) {
          const value = encodeURIComponent(filters[key]);
          const firstLetterLowerKey =
            key.charAt(0).toLowerCase() + key.slice(1);
          queryParams += `&${firstLetterLowerKey}=${value}`;
        }
      }
    }

    const requestUrl = `${this.baseUrl}${this.urlUsers}?${queryParams}`;
    console.log('Request URL:', requestUrl);

    // Make the HTTP GET request and map the response
    return this.http.get<any>(requestUrl).pipe(
      map((response) => ({
        data: response.data,
        totalElements: response.totalElements,
        totalPages: response.totalPages,
      })),
      catchError(this.handleError)
    );
  }

  getAllUsers(page: number = 0, pageSize: number = 50): Observable<any> {
    const requestUrl = `${this.baseUrl}/users?page=${page}&pageSize=${pageSize}`;
    console.log('Request URL:', requestUrl);
    return this.http.get<any>(requestUrl);
  }

  postUser(user: User): Observable<string> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http
      .post(`${this.baseUrl}${this.urlUsers}`, user, {
        headers,
        responseType: 'text',
      })
      .pipe(catchError(this.handleError));
  }

  patchUser(user: User): Observable<string> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const patchReqUrl = `${this.baseUrl}${this.urlUsers}/${user.id}`;
    return this.http
      .patch(patchReqUrl, user, {
        headers,
        responseType: 'text',
      })
      .pipe(catchError(this.handleError));
  }

  deleteUser(id: number): Observable<string> {
    const deleteReqUrl = `${this.baseUrl}${this.urlUsers}/${id}`;
    return this.http
      .delete(deleteReqUrl, { responseType: 'text' })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: ${error.error}`
      );

      if (error.status === 409 || error.status === 401) {
        try {
          const errorBody = JSON.parse(error.error);
          const errorMessage = JSON.parse(errorBody.message);
          switch (errorMessage.code) {
            case 1451:
              return throwError(
                'Foreign key constraint violation. Please ensure there are no related records before deleting.'
              );
            case 1062:
              return throwError(
                'User with the same username or email already exists.'
              );
            default:
              return throwError('An unknown error occurred.');
          }
        } catch (e) {
          console.error('Error parsing error response:', e);
        }
      }
    }
    return throwError('Something bad happened; please try again later.');
  }
}
