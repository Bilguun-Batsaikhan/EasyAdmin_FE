import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  OnInit,
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
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { Asset } from '../../interfaces/assets';
import { AssetStatus } from '../../enumeration/AssetStatus';
import { FloatLabelModule } from 'primeng/floatlabel';
import { UsersService } from '../../services/users.service';
import { User } from '../../interfaces/users';

@Component({
  selector: 'app-asset-dialog',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    ConfirmPopupModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    CommonModule,
    FloatLabelModule,
  ],
  templateUrl: './asset-dialog.component.html',
  styleUrls: ['./asset-dialog.component.css'],
})
export class AssetDialogComponent implements OnChanges, OnInit {
  @Input() visible: boolean = false;
  @Input() editMode: boolean = false;
  @Input() assetToBeInserted: Asset = {
    modelName: '',
    type: '',
    status: AssetStatus.AVAILABLE,
    cost: null,
    username: '',
  };

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<any>();

  assetStatuses = [
    { status: AssetStatus.AVAILABLE, name: 'AVAILABLE' },
    { status: AssetStatus.UNAVAILABLE, name: 'UNAVAILABLE' },
    { status: AssetStatus.ASSIGNED, name: 'ASSIGNED' },
  ];

  users: User[] = []; // Store the users
  usernames: { label: string; value: string }[] = []; // Transform usernames

  // Reactive form setup
  form: FormGroup = new FormGroup({
    modelName: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
    status: new FormControl(AssetStatus.AVAILABLE, Validators.required),
    cost: new FormControl(null, Validators.required),
    username: new FormControl(null),
  });

  formSubmitted: boolean = false;

  constructor(private userService: UsersService) {} // Inject the UserService

  ngOnInit(): void {
    const role = localStorage.getItem('role');
    if (role === 'SUPER_ADMIN' || role === 'SYSTEM_ADMIN') {
      this.userService.getUsers().subscribe((users) => {
        this.users = users.data;
        this.usernames = this.users.map((user) => ({
          label: user.username,
          value: user.id?.toString() || '', // Convert the user ID to a string
        }));
        console.log('Usernames:', this.usernames);
      });
    }
  }

  ngOnChanges(): void {
    if (this.editMode && this.assetToBeInserted) {
      this.form.patchValue(this.assetToBeInserted);
    } else {
      this.resetAssetForm();
    }
  }

  onCancel(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  onSave(): void {
    this.formSubmitted = true;
    if (this.form.valid) {
      const formValues = this.form.value;

      console.log('Form values:', formValues.username);
      const selectedUser = this.usernames.find(
        (user) => user.label === formValues.username.label
      );
      console.log('Selected user:', selectedUser);
      const updatedAsset = {
        ...this.assetToBeInserted,
        ...formValues,
        status: formValues.status || this.assetToBeInserted.status,
        username: selectedUser ? selectedUser.label : null, // Use the username
        userID: selectedUser ? selectedUser.value : null, // Include the user ID
      };

      console.log('(dialog) updatedAsset:', updatedAsset);

      this.save.emit({
        asset: updatedAsset,
        editMode: this.editMode,
      });

      this.visible = false;
      this.visibleChange.emit(this.visible);
    } else {
      this.form.markAllAsTouched();
    }
  }

  resetAssetForm(): void {
    this.form.reset({
      modelName: '',
      type: '',
      status: AssetStatus.AVAILABLE,
      cost: null,
      username: null,
    });
    this.formSubmitted = false;
  }
}
