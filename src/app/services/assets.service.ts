import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Asset } from '../interfaces/assets';

@Injectable({
  providedIn: 'root',
})
export class AssetsService {
  baseUrl: string = 'http://localhost:8070/bff';
  urlAssets: string = '/assets';

  constructor(private http: HttpClient) {}

  getAssets(
    page: number = 0,
    pageSize: number = 10,
    filters?: { [key: string]: any }
  ): Observable<{ data: Asset[]; totalElements: number; totalPages: number }> {
    let queryParams = `page=${page}&pageSize=${pageSize}`;

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

    const requestUrl = `${this.baseUrl}${this.urlAssets}?${queryParams}`;
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

  postAsset(asset: Asset): Observable<string> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http
      .post(`${this.baseUrl}${this.urlAssets}`, asset, {
        headers,
        responseType: 'text',
      })
      .pipe(catchError(this.handleError));
  }

  patchAsset(asset: Asset): Observable<string> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const patchReqUrl = `${this.baseUrl}${this.urlAssets}/${asset.id}`;

    // Create a copy of the asset object without the id field
    const { id, ...assetWithoutId } = asset;

    return this.http
      .patch(patchReqUrl, assetWithoutId, {
        headers,
        responseType: 'text',
      })
      .pipe(catchError(this.handleError));
  }

  deleteAsset(id: number): Observable<string> {
    const deleteReqUrl = `${this.baseUrl}${this.urlAssets}/${id}`;
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

      if (error.status === 409) {
        try {
          const errorBody = JSON.parse(error.error);
          const errorMessage = JSON.parse(errorBody.message);
          if (errorMessage.code === 1451) {
            return throwError(
              'Foreign key constraint violation. Please ensure there are no related records before deleting.'
            );
          }
        } catch (e) {
          console.error('Error parsing error response:', e);
        }
      }
    }
    return throwError('Something bad happened; please try again later.');
  }
}
