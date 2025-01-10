import { Component } from '@angular/core';
import { AssetsService } from '../../services/assets.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Asset } from '../../interfaces/assets';
import { AssetStatus } from '../../enumeration/AssetStatus';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { PasswordModule } from 'primeng/password';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { CommonService } from '../../services/common.service';
import { AssetDialogComponent } from '../asset-dialog/asset-dialog.component';
import { Router } from '@angular/router';
import { User } from '../../interfaces/users';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-asset-table',
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
    AssetDialogComponent,
  ],
  templateUrl: './asset-table.component.html',
  styleUrl: './asset-table.component.css',
  providers: [ConfirmationService, MessageService, CommonService],
})
export class AssetTableComponent {
  // Services
  constructor(
    private assetsService: AssetsService,
    private usersService: UsersService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    protected commonService: CommonService,
    private router: Router
  ) {}
  // Pagination properties
  pageNo: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 0;
  // Dialog properties
  visible: boolean = false;
  editMode: boolean = false;
  // Asset status options
  statusOptions = [
    { label: 'AVAILABLE', value: 'AVAILABLE' },
    { label: 'UNAVAILABLE', value: 'UNAVAILABLE' },
    { label: 'ASSIGNED', value: 'ASSIGNED' },
  ];
  selectedStatus: string[] = [];
  activeFilters: { field: string; value: any }[] = [];
  // Table properties
  assets: Asset[] = [];
  /*
  id: number;
    modelName: string;
    type: string;
    status: AssetStatus;
    cost: number;
    username: number;
  */
  assetToBeinserted: Asset = {
    modelName: '',
    type: '',
    status: AssetStatus.AVAILABLE,
    cost: 0,
    username: '',
  };

  resetAssetForm(): void {
    this.assetToBeinserted = {
      modelName: '',
      type: '',
      status: AssetStatus.AVAILABLE,
      cost: 0,
      username: '',
    };
  }

  clear(table: Table) {
    table.clear();
    this.activeFilters = [];
  }

  loadAssets(filters?: { [key: string]: any }) {
    this.assetsService.getAssets(this.pageNo, this.pageSize, filters).subscribe(
      (response) => {
        this.assets = response.data;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
      },
      (error) => {
        console.error('There was an error!', error);
      }
    );
  }
  // This can be moved to shared service
  onPageChange(event: any): void {
    this.pageNo = event.first / event.rows;
    this.pageSize = event.rows;

    const filters: any = {};

    for (const field in event.filters) {
      if (event.filters[field]) {
        const filterMeta = event.filters[field][0];
        let filterValue = filterMeta.value;
        const matchMode = filterMeta.matchMode;

        if (filterValue !== undefined && filterValue !== null) {
          filters[field] = filterValue;
          if (matchMode) {
            filters[`${field}MatchMode`] = matchMode;
          }
        }
      }
    }

    console.log('Extracted Filters:', filters);
    console.log('Pagination:', this.pageNo, this.pageSize);

    this.loadAssets(filters);
  }

  //This can be moved to shared service
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

  deleteAssetRow(event: Event, assetId: any): void {
    this.commonService.confirmAction(
      'Do you want to delete this record?',
      () => {
        this.commonService.deleteRow<Asset>(
          assetId,
          this.assets,
          this.assetsService.deleteAsset.bind(this.assetsService), // Pass the service method
          (updatedData) => (this.assets = updatedData) // Update the assets array
        );
      },
      () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
          life: 3000,
        });
      },
      event.target as EventTarget
    );
  }

  showDialog(asset: any = null): void {
    if (asset) {
      this.editMode = true;
      this.assetToBeinserted = { ...asset };
      console.log('Editing asset:', this.assetToBeinserted);
    } else {
      this.editMode = false;
      this.resetAssetForm();
      console.log('Adding new asset:', this.assetToBeinserted);
    }
    // Open the dialog
    this.visible = true;
  }

  convertAssetForServer(asset: any): any {
    const formattedAsset = {
      ...asset,
      status: asset.status.name || asset.status,
    };

    // Exclude the nested 'user' field if it exists
    if (formattedAsset.user) {
      delete formattedAsset.user;
    }

    // Filter out properties with undefined, null, empty string values, and exclude 'username' and 'deleted'
    const filteredAsset = Object.keys(formattedAsset).reduce(
      (acc: { [key: string]: any }, key: string) => {
        if (
          key !== 'username' &&
          key !== 'deleted' &&
          formattedAsset[key] !== undefined &&
          formattedAsset[key] !== null &&
          formattedAsset[key] !== ''
        ) {
          acc[key] = formattedAsset[key];
        }
        return acc;
      },
      {}
    );

    return filteredAsset;
  }

  onSave(asset: any, edit: boolean): void {
    console.log('Before conversion:', asset);
    asset = this.convertAssetForServer(asset);
    console.log('After conversion:', asset);
    if (edit) {
      console.log('Edit asset:', asset);
      this.assetsService.patchAsset(asset).subscribe(
        (updatedAsset: Asset) => {
          if (updatedAsset.userID) {
            // Fetch the username if userID exists
            this.usersService.getUser(updatedAsset.userID).subscribe(
              (user: User) => {
                updatedAsset.username = user.username;
                this.updateTableRow(updatedAsset); // Update the specific row in the table with the returned asset
                this.commonService.successMessage('Asset updated successfully');
                this.visible = false; // Close the dialog
              },
              (error) => {
                this.commonService.errorMessage(error);
              }
            );
          } else {
            this.updateTableRow(updatedAsset); // Update the specific row in the table without fetching username
            this.commonService.successMessage('Asset updated successfully');
            this.visible = false; // Close the dialog
          }
        },
        (error) => {
          this.commonService.errorMessage(error);
        }
      );
    } else {
      console.log('Save user:', asset);
      this.assetsService.postAsset(asset).subscribe(
        (response: string) => {
          this.addTableRow(asset); // Add a new row to the table
          this.commonService.successMessage(response);
          this.visible = false; // Close the dialog
        },
        (error) => {
          this.commonService.errorMessage(error);
        }
      );
    }
  }

  updateTableRow(updatedAsset: any): void {
    const index = this.assets.findIndex(
      (asset) => asset.id === updatedAsset.id
    );
    if (index !== -1) {
      this.assets[index] = { ...updatedAsset };
    }
  }

  addTableRow(newAsset: any): void {
    this.assets.push(newAsset);
  }

  viewAssetHistory(assetId: any): void {
    console.log('Viewing asset history:', assetId);
    this.router.navigate(['/assets-history'], {
      queryParams: { assetId: assetId },
    });
  }

  getSeverity(
    status: string
  ):
    | 'success'
    | 'secondary'
    | 'info'
    | 'warning'
    | 'danger'
    | 'contrast'
    | undefined {
    switch (status) {
      case 'AVAILABLE':
        return 'success';

      case 'ASSIGNED':
        return 'info';

      case 'UNAVAILABLE':
        return 'danger';

      default:
        return undefined;
    }
  }
}
