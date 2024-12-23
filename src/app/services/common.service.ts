import { Injectable } from '@angular/core';
import { User } from '../interfaces/users';
import { Asset } from '../interfaces/assets';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(private messageService: MessageService) {}

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

  removeTableRow<T extends { id?: number }>(itemId: number, data: T[]): T[] {
    return data.filter((item) => item.id !== itemId);
  }

  isArray(value: any): boolean {
    return Array.isArray(value);
  }
}
