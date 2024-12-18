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
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { PasswordModule } from 'primeng/password';
import { userRoleEnum } from '../../userRoleEnum';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputMaskModule } from 'primeng/inputmask';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';

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
    ButtonModule,
    ConfirmPopupModule,
    ToastModule,
    DialogModule,
    PasswordModule,
    FloatLabelModule,
    InputMaskModule,
    UserDialogComponent,
  ],
  providers: [UsersService, ConfirmationService, MessageService],
})
export class UserTableComponent implements OnInit {
  constructor(
    private usersService: UsersService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  selectedSize: { class: string } = { class: 'default-class' };
  users: User[] = [];

  userToBeInserted: User = {
    username: '',
    password: '',
    email: '',
    phoneNumber: '',
    role: userRoleEnum.USER,
    firstname: '',
    surname: '',
    birthdate: null,
  };

  pageNo: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 0;
  loading: boolean = true;
  usernameFilter: string = '';
  searchValue: string = '';
  visible: boolean = false;
  editMode: boolean = false;

  roles = [
    { label: 'SUPER_ADMIN', value: 'super_admin' },
    { label: 'USER', value: 'user' },
    { label: 'SYSTEM_ADMIN', value: 'system_admin' },
  ];
  selectedRoles: any[] = [];

  ngOnInit(): void {
    this.loading = false;
  }

  clear(table: Table) {
    table.clear();
    this.searchValue = '';
  }

  showDialog(user: any = null): void {
    if (user) {
      this.editMode = true;
      this.userToBeInserted = { ...user };
    } else {
      this.editMode = false;
      this.resetUserForm();
    }
    this.visible = true;
  }

  resetUserForm(): void {
    this.userToBeInserted = {
      username: '',
      password: '',
      email: '',
      phoneNumber: '',
      role: userRoleEnum.USER,
      firstname: '',
      surname: '',
      birthdate: null,
    };
  }

  loadUsers(filters?: { [key: string]: any }): void {
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

  onPageChange(event: any): void {
    this.pageNo = event.first / event.rows;
    this.pageSize = event.rows;

    const filters: any = {};

    // Extract filters from the event (loop over the filters object)
    for (const field in event.filters) {
      if (event.filters[field]) {
        // fields are defined in <p-columnFilter> as an object with the field name as the key
        const filterMeta = event.filters[field][0]; // Access the first filter meta
        const filterValue = filterMeta.value;
        const matchMode = filterMeta.matchMode;

        // Only add the filter to the filters object if a value is present
        if (filterValue !== undefined && filterValue !== null) {
          filters[field] = filterValue; // Store the filter value
          if (matchMode) {
            filters[`${field}MatchMode`] = matchMode; // Store the matchMode for the specific field
          }
        }
      }
    }

    console.log('Extracted Filters:', filters);
    console.log('Pagination:', this.pageNo, this.pageSize);

    // Call loadUsers with the extracted filters and pagination
    this.loadUsers(filters);
  }

  deleteUserRow(event: Event) {
    console.log('delete button clicked');
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this record?',
      icon: 'pi pi-info-circle',
      //acceptButtonStyleClass: 'p-button-danger p-button-sm',
      accept: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Record deleted',
          life: 3000,
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
          life: 3000,
        });
      },
    });
  }

  onSave(user: any, edit: boolean): void {
    if (edit) {
      console.log('Edit user:', user);
    } else {
      console.log('Save user:', user);
    }
  }
}
