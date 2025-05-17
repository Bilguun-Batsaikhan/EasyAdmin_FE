import { Injectable } from '@angular/core';
import { AssetHistory } from '../interfaces/asset-history';
import { Observable, map, throwError } from 'rxjs';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class AssetHistoryService {
  // baseUrl: string = 'http://localhost:8070/bff';
  baseUrl: string;
  urlAssetHistory: string = '/assets/history';
  constructor(private http: HttpClient) {
    this.baseUrl = API_CONFIG.baseUrl;
  }

  getAssetHistory(
    page: number = 0,
    pageSize: number = 10,
    filters?: { [key: string]: any }
  ): Observable<{
    data: AssetHistory[];
    totalElements: number;
    totalPages: number;
  }> {
    let queryParams = `page=${page}&pageSize=${pageSize}`;
    console.log('Filters', filters);
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

    const requestUrl = `${this.baseUrl}${this.urlAssetHistory}?${queryParams}`;
    console.log('Request URL:', requestUrl);
    return this.http.get<any>(requestUrl).pipe(
      map((response: any) => ({
        data: response.data,
        totalElements: response.totalElements,
        totalPages: response.totalPages,
      })),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(error);
  }
}
