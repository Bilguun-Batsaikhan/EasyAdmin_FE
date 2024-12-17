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
  usernameFilter: string = '';

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
  // pass username filter and modify the method
  loadUsers(filters?: { username?: string }): void {
    this.loading = true;

    this.usersService.getUsers(this.pageNo, this.pageSize, filters).subscribe(
      (response) => {
        this.users = response.data;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;

        // Convert birthdates to Date objects
        this.users.forEach(
          (user) => (user.birthdate = new Date(<Date>user.birthdate))
        );

        this.loading = false;
      },
      (error) => {
        console.error('There was an error!', error);
        this.loading = false;
      }
    );
  }

  getInputValue(event: Event): string {
    return (event.target as HTMLInputElement).value || '';
  }

  // Whenever page changes, this method will be called
  onPageChange(event: any): void {
    this.pageNo = event.first / event.rows;
    this.pageSize = event.rows;

    // Extract filters
    const usernameFilter = event.filters?.['username']?.value || '';

    console.log('Filters:', event.filters);
    console.log('Username Filter Value:', usernameFilter);

    // Reload data with filters
    this.loadUsers({ username: usernameFilter });
  }
}
