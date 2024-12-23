import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/users';
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
import { userRoleEnum } from '../../enumeration/userRoleEnum';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputMaskModule } from 'primeng/inputmask';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { CommonService } from '../../services/common.service';

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
  providers: [UsersService, ConfirmationService, MessageService, CommonService],
})
export class UserTableComponent implements OnInit {
  // Inject the UsersService, ConfirmationService, and MessageService
  constructor(
    private usersService: UsersService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    protected commonService: CommonService
  ) {}

  pageNo: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 0;

  visible: boolean = false;
  editMode: boolean = false;

  roles = [
    { label: 'SUPER_ADMIN', value: 'super_admin' },
    { label: 'USER', value: 'user' },
    { label: 'SYSTEM_ADMIN', value: 'system_admin' },
  ];
  selectedRoles: any[] = [];

  activeFilters: { field: string; value: any }[] = [];

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

  ngOnInit(): void {}

  clear(table: Table) {
    table.clear();
    this.activeFilters = [];
  }

  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  showDialog(user: any = null): void {
    if (user) {
      this.editMode = true;
      //The ... operator in the code snippet is the spread operator. It is used to create a shallow copy of the user object.
      this.userToBeInserted = { ...user };
    } else {
      this.editMode = false;
      this.resetUserForm();
    }
    // Open the dialog
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
  /* Here is the example event.filters object that is passed to the loadUsers method when the user applies a filter:
  const event = {
  filters: {
    name: [
      { value: 'John', matchMode: 'contains' }
    ],
    age: [
      { value: 30, matchMode: 'equals' }
    ],
    birthdate: [
      { value: new Date('1990-01-01'), matchMode: 'equals' }
    ]
  },
  first: 0,
  rows: 10
};*/

  loadUsers(filters?: { [key: string]: any }): void {
    this.usersService.getUsers(this.pageNo, this.pageSize, filters).subscribe(
      (response) => {
        this.users = response.data; //response is an object with data, totalElements, and totalPages properties. Check back end and look for UserResPagination class
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;

        // Convert birthdates to Date objects
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
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  // Every time the user changes the page or the number of rows, this method is called
  onPageChange(event: any): void {
    this.pageNo = event.first / event.rows;
    this.pageSize = event.rows;

    const filters: any = {};

    // Extract filters from the event (loop over the filters object)
    for (const field in event.filters) {
      if (event.filters[field]) {
        // fields are defined in <p-columnFilter> as an object with the field name as the key
        /*
        for name field
        name: [
        this is the filter meta object
      { value: 'John', matchMode: 'contains' }
    ]*/
        const filterMeta = event.filters[field][0]; // Access the first filter meta
        let filterValue = filterMeta.value;
        const matchMode = filterMeta.matchMode;
        if (field === 'birthdate' && filterValue instanceof Date) {
          filterValue = this.formatDate(filterValue);
        }
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

  deleteUserRow(event: Event, userId: any): void {
    console.log('Delete button clicked');
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this record?',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.usersService.deleteUser(userId).subscribe(
          (response: string) => {
            this.users = this.commonService.removeTableRow<User>(
              userId as number,
              this.users
            );

            this.commonService.successMessage(response); // Show success message
            this.messageService.add({
              severity: 'info',
              summary: 'Confirmed',
              detail: 'Record deleted',
              life: 3000,
            });
          },
          (error) => {
            this.commonService.errorMessage(error);
          }
        );
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

  removeTableRow(userId: any): void {
    this.users = this.users.filter((user) => user.id !== userId);
  }

  convertUserForServer(user: any): any {
    const formattedUser = {
      ...user,
      role: user.role.role,
      birthdate: this.formatDate(new Date(user.birthdate)),
    };

    // Filter out properties with undefined or null values
    const filteredUser = Object.keys(formattedUser).reduce(
      (acc: { [key: string]: any }, key: string) => {
        if (formattedUser[key] !== undefined && formattedUser[key] !== null) {
          acc[key] = formattedUser[key];
        }
        return acc;
      },
      {}
    );

    return filteredUser;
  }

  onSave(user: any, edit: boolean): void {
    const convertedUser = this.convertUserForServer(user);

    if (edit) {
      console.log('Edit user:', convertedUser);
      this.usersService.patchUser(convertedUser).subscribe(
        (response: string) => {
          this.updateTableRow(convertedUser); // Update the specific row in the table
          this.commonService.successMessage(response);
          this.visible = false; // Close the dialog
        },
        (error) => {
          this.commonService.errorMessage(error);
        }
      );
    } else {
      console.log('Save user:', convertedUser);
      this.usersService.postUser(convertedUser).subscribe(
        (response: string) => {
          this.addTableRow(convertedUser); // Add a new row to the table
          this.commonService.successMessage(response);
          this.visible = false; // Close the dialog
        },
        (error) => {
          this.commonService.errorMessage(error);
        }
      );
    }
  }

  updateTableRow(updatedUser: any): void {
    const index = this.users.findIndex((user) => user.id === updatedUser.id);
    if (index !== -1) {
      this.users[index] = { ...updatedUser };
    }
  }

  addTableRow(newUser: any): void {
    this.users.push(newUser);
  }

  onFilterApplied(event: any): void {
    this.activeFilters = [];
    const filters = event.filters;

    Object.keys(filters).forEach((field) => {
      const filterArray = filters[field]; // Each filter field contains an array
      if (filterArray?.length) {
        const filterValue = filterArray[0]?.value; // Accessing the actual value of the filter
        if (filterValue) {
          // Check if the filter value is an object (for example, a date or an array)
          const valueToDisplay =
            filterValue instanceof Object
              ? JSON.stringify(filterValue)
              : filterValue;
          this.activeFilters.push({ field, value: valueToDisplay });
        }
      }
    });

    console.log('Active Filters:', this.activeFilters);
  }
}
