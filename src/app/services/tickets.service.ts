import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Ticket } from '../interfaces/tickets';
import { CreateTicket } from '../interfaces/createTicket';

@Injectable({
  providedIn: 'root',
})
export class TicketsService {
  baseUrl: string = 'http://localhost:8070/bff';
  urlTickets: string = '/tickets';

  constructor(private http: HttpClient) {}

  getTickets(
    page: number = 0,
    pageSize: number = 10,
    filters?: { [key: string]: any }
  ): Observable<{ data: Ticket[]; totalElements: number; totalPages: number }> {
    console.log('Filters', filters);
    let queryParams = `page=${page}&pageSize=${pageSize}`;

    if (filters) {
      for (const key in filters) {
        if (filters[key] !== undefined && filters[key] !== null) {
          // encodeURIComponent(...): This is a built-in JavaScript function that encodes a URI component. It replaces each instance of certain characters by one, two, three, or four escape sequences representing the UTF-8 encoding of the character. This is useful for encoding query parameters in URLs to ensure they are properly formatted and transmitted.
          const value = encodeURIComponent(filters[key]);
          // This line ensures that the first letter of the key is in lowercase. This might be needed if the API expects query parameter keys to start with a lowercase letter.
          const firstLetterLowerKey =
            key.charAt(0).toLowerCase() + key.slice(1);
          queryParams += `&${firstLetterLowerKey}=${value}`;
        }
      }
    }
    const requestUrl = `${this.baseUrl}${this.urlTickets}?${queryParams}`;
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

  postTicket(ticket: CreateTicket): Observable<string> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http
      .post(`${this.baseUrl}${this.urlTickets}`, ticket, {
        headers,
        responseType: 'text',
      })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      console.error('An error occurred:', error.error.message);
    } else {
      // Backend returned an unsuccessful response code
      console.error(
        `Backend returned code ${error.status}, body was: ${error.error}`
      );

      if (error.status === 409 || error.status === 400) {
        try {
          const errorBody = JSON.parse(error.error);
          const errorMessage = JSON.parse(errorBody.message);
          if (errorMessage.code === 1451) {
            return throwError(
              'Foreign key constraint violation. Please ensure there are no related records before deleting.'
            );
          } else if (errorMessage.code === 422) {
            return throwError(errorMessage.message);
          }
        } catch (e) {
          console.error('Error parsing error response:', e);
        }
      }
    }
    return throwError('Something bad happened; please try again later.');
  }
}
