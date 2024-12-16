import { Component, OnInit } from '@angular/core';
import { User } from '../../users';
import { UsersService } from '../../services/users.service';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { Table } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-table',
  templateUrl: 'user-table.component.html',
  standalone: true,
  imports: [
    TableModule,
    CommonModule,
    SelectButtonModule,
    TagModule,
    MultiSelectModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    FormsModule,
  ],
  providers: [UsersService],
})
export class UserTableComponent implements OnInit {
  selectedSize: { class: string } = { class: 'default-class' };
  users: User[] = [];

  pageNo: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 0;
  loading: boolean = true;
  roles = [
    { label: 'SUPER_ADMIN', value: 'super_admin' },
    { label: 'User', value: 'user' },
    { label: 'SYSTEM_ADMIN', value: 'system_admin' },
  ];
  selectedRoles: any[] = [];

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.loading = false;
  }

  loadUsers(): void {
    this.usersService.getUsers(this.pageNo, this.pageSize).subscribe(
      (response) => {
        this.users = response.data;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;

        this.users.forEach(
          (user) => (user.birthdate = new Date(<Date>user.birthdate))
        );
      },
      (error) => {
        console.error('There was an error!', error);
      }
    );
  }
  getInputValue(event: Event): string {
    return (event.target as HTMLInputElement).value || '';
  }

  onPageChange(event: any): void {
    this.pageNo = event.first / event.rows;
    this.pageSize = event.rows;
    this.loadUsers();
  }
  clear(table: Table) {
    table.clear();
  }
}
