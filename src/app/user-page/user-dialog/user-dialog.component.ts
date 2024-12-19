import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogModule } from 'primeng/dialog';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputMaskModule } from 'primeng/inputmask';
import { User } from '../../users';
import { userRoleEnum } from '../../userRoleEnum';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    ConfirmPopupModule,
    DialogModule,
    PasswordModule,
    FloatLabelModule,
    InputMaskModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
  ],
  templateUrl: './user-dialog.component.html',
  styleUrl: './user-dialog.component.css',
})
export class UserDialogComponent {
  @Input() visible: boolean = false;
  @Input() editMode: boolean = false;
  @Input() userToBeInserted: User = {
    username: '',
    password: '',
    email: '',
    phoneNumber: '',
    role: userRoleEnum.USER,
    firstname: '',
    surname: '',
    birthdate: null,
  };

  roles = [
    { role: userRoleEnum.USER, name: 'User' },
    { role: userRoleEnum.SUPER_ADMIN, name: 'Super Admin' },
    { role: userRoleEnum.SYSTEM_ADMIN, name: 'System Admin' },
  ];

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<any>();

  onCancel(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  onSave(): void {
    this.save.emit({ user: this.userToBeInserted, editMode: this.editMode });
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  showDialog() {
    this.resetUserForm();
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
}
