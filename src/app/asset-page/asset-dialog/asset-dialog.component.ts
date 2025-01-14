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
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { Asset } from '../../interfaces/assets';
import { AssetStatus } from '../../enumeration/AssetStatus';
import { FloatLabelModule } from 'primeng/floatlabel';

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
export class AssetDialogComponent implements OnChanges {
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

  // Reactive form setup
  form: FormGroup = new FormGroup({
    modelName: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
    status: new FormControl(AssetStatus.AVAILABLE, Validators.required),
    cost: new FormControl(null, Validators.required),
    userID: new FormControl(null),
  });

  formSubmitted: boolean = false;

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

      // Check if 'status' is empty, and if so, retain the current status value
      // console.log('formValues:', formValues);
      // console.log('formValues.status:', formValues.status);
      // console.log(
      //   'this.assetToBeInserted.status:',
      //   this.assetToBeInserted.status
      // );

      const updatedAsset = {
        ...this.assetToBeInserted,
        ...formValues,
        status: formValues.status || this.assetToBeInserted.status,
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
      userID: null,
    });
    this.formSubmitted = false;
  }
}
