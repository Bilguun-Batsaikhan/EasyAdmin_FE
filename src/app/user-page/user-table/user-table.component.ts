import { Component, OnInit } from '@angular/core';
import { User } from '../../users';
import { AuthService } from '../../auth.service';
import { UsersService } from '../../users.service';
import { TableModule } from 'primeng/table';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-table',
  templateUrl: 'user-table.component.html',
  standalone: true,
  imports: [TableModule, CommonModule, SelectButtonModule],
  providers: [UsersService],
})
export class UserTableComponent implements OnInit {
  selectedSize: { class: string } = { class: 'default-class' };
  users: User[] = [];
  //backend will throw an error when substring on empty string, fix it later
  accessToken: string = 'asdadadsdsadsadad';
  pageNo: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 0;

  constructor(
    private usersService: UsersService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.accessToken = this.authService.getAccessToken();
    this.loadUsers();
  }

  loadUsers(): void {
    this.usersService
      .getUsers(this.accessToken, this.pageNo, this.pageSize)
      .subscribe(
        (response) => {
          this.users = response.data;
          this.totalElements = response.totalElements;
          this.totalPages = response.totalPages;
        },
        (error) => {
          console.error('There was an error!', error);
        }
      );
  }
  onPageChange(event: any): void {
    this.pageNo = event.first / event.rows;
    this.pageSize = event.rows;
    this.loadUsers();
  }
}
