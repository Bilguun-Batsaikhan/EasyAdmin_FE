import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogModule } from 'primeng/dialog';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputMaskModule } from 'primeng/inputmask';
import { User } from '../../interfaces/users';
import { userRoleEnum } from '../../enumeration/userRoleEnum';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    ConfirmPopupModule,
    DialogModule,
    PasswordModule,
    FloatLabelModule,
    InputMaskModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    CommonModule,
  ],
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.css'],
})
export class UserDialogComponent implements OnChanges {
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

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<any>();

  roles = [
    { role: userRoleEnum.USER, name: 'User' },
    { role: userRoleEnum.SUPER_ADMIN, name: 'Super Admin' },
    { role: userRoleEnum.SYSTEM_ADMIN, name: 'System Admin' },
  ];

  // Reactive form setup
  form: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl('', Validators.required),
    role: new FormControl(userRoleEnum.USER, Validators.required),
    firstname: new FormControl('', Validators.required),
    surname: new FormControl('', Validators.required),
    birthdate: new FormControl(null, Validators.required),
  });

  formSubmitted: boolean = false;

  ngOnChanges(): void {
    if (this.editMode && this.userToBeInserted) {
      this.form.patchValue(this.userToBeInserted);
    } else {
      this.resetUserForm();
    }
  }

  onCancel(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  onSave(): void {
    this.formSubmitted = true;
    if (this.form.valid) {
      this.save.emit({
        user: { ...this.userToBeInserted, ...this.form.value },
        editMode: this.editMode,
      });
      this.visible = false;
      this.visibleChange.emit(this.visible);
    } else {
      this.form.markAllAsTouched();
    }
  }

  resetUserForm(): void {
    this.form.reset({
      username: '',
      password: '',
      email: '',
      phoneNumber: '',
      role: userRoleEnum.USER,
      firstname: '',
      surname: '',
      birthdate: null,
    });
    this.formSubmitted = false;
  }
}
