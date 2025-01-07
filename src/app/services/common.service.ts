import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Observable, catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  successMessage(message: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: message,
      life: 3000,
    });
  }
  errorMessage(message: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 3000,
    });
  }

  //   Explanation of the syntax in the following function:
  //   T extends { id?: number } - This is a generic type that extends an object with an optional id property of type number.
  //   data: T[] - This is an array of objects of type T.
  //   itemId: number - This is the id of the item to remove.
  //   The function returns an array of objects of type T.
  removeTableRow<T extends { id?: number }>(itemId: number, data: T[]): T[] {
    return data.filter((item) => item.id !== itemId);
  }

  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  confirmAction(
    message: string,
    acceptCallback: () => void,
    rejectCallback?: () => void,
    target?: EventTarget
  ): void {
    this.confirmationService.confirm({
      message,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      target, // Optional parameter for attaching to a UI element
      accept: acceptCallback,
      reject: rejectCallback,
    });
  }

  log(message: string, data?: any): void {
    console.log(`[CommonService Log]: ${message}`, data);
  }

  sortArray<T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
    return array.sort((a, b) => {
      if (a[key] < b[key]) {
        return order === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return order === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  deleteRow<T extends { id?: number }>(
    itemId: any,
    data: T[],
    deleteServiceMethod: (id: any) => Observable<string>,
    updateDataCallback: (updatedData: T[]) => void
  ): void {
    deleteServiceMethod(itemId).subscribe(
      (response: string) => {
        const updatedData = this.removeTableRow(itemId, data);
        updateDataCallback(updatedData); // Update the table data
        this.successMessage(response); // Show success message
      },
      (error) => {
        this.errorMessage(error); // Handle error
      }
    );
  }

  loadData<T>(
    service: any,
    pageNo: number,
    pageSize: number,
    filters?: { [key: string]: any }
  ): Observable<{ data: T[]; totalElements: number; totalPages: number }> {
    console.log('Loading Data with filters:', filters);
    return service.getAssetHistory(pageNo, pageSize, filters).pipe(
      map((response: any) => {
        if (response.data) {
          return {
            data: response.data,
            totalElements: response.totalElements,
            totalPages: response.totalPages,
          };
        } else {
          console.error('Data field is missing in the response:', response);
          throw new Error('Data field is missing in the response');
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('There was an error!', error);
        throw error;
      })
    );
  }
}
