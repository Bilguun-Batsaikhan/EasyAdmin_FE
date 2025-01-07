import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { CommonService } from '../../services/common.service';
import { AssetHistoryService } from '../../services/asset-history.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-asset-history-table',
  templateUrl: './asset-history-table.component.html',
  styleUrls: ['./asset-history-table.component.css'],
  standalone: true,
  imports: [
    TableModule,
    CommonModule,
    TagModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    MultiSelectModule,
  ],
  providers: [CommonService, MessageService, ConfirmationService],
})
export class AssetHistoryTableComponent {
  assetHistoryList: any[] = [];
  pageNo: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 0;
  activeFilters: { field: string; value: any }[] = [];
  givenAssetHistoryLoad: boolean = true;

  statusOptions = [
    { label: 'AVAILABLE', value: 'AVAILABLE' },
    { label: 'UNAVAILABLE', value: 'UNAVAILABLE' },
    { label: 'ASSIGNED', value: 'ASSIGNED' },
  ];

  actionOptions = [
    { label: 'CREATED', value: 'CREATED' },
    { label: 'UPDATED', value: 'UPDATED' },
    { label: 'DELETED', value: 'DELETED' },
  ];

  selectedStatus: string[] = [];
  selectedAction: string[] = [];
  assetId: string | undefined;
  constructor(
    private route: ActivatedRoute,
    private assetHistoryService: AssetHistoryService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    protected commonService: CommonService
  ) {}
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.assetId = params['assetId'];
      if (this.assetId) {
        const filters = {
          assetId: this.assetId,
          assetIdMatchMode: 'equals',
        };

        this.commonService
          .loadData(
            this.assetHistoryService,
            this.pageNo,
            this.pageSize,
            filters
          )
          .subscribe(
            (response) => {
              this.assetHistoryList = response.data;
              this.totalElements = response.totalElements;
              this.totalPages = response.totalPages;
            },
            (error) => {
              console.error('There was an error!', error);
              this.givenAssetHistoryLoad = false; // Set the flag to false even if there's an error
            }
          );
      } else {
        this.givenAssetHistoryLoad = false; // Set the flag to false if no assetId is provided
      }
    });
  }

  onPageChange(event: any): void {
    this.pageNo = event.first / event.rows;
    this.pageSize = event.rows;
    if (this.givenAssetHistoryLoad) {
      if (this.assetId) {
        const filters = {
          assetId: this.assetId,
          assetIdMatchMode: 'equals',
        };
        this.commonService
          .loadData(
            this.assetHistoryService,
            this.pageNo,
            this.pageSize,
            filters
          )
          .subscribe(
            (response) => {
              this.assetHistoryList = response.data;
              this.totalElements = response.totalElements;
              this.totalPages = response.totalPages;
            },
            (error) => {
              console.error('There was an error!', error);
            }
          );
      }
    } else {
      const filters = this.applyFilters(event.filters);

      console.log('Extracted Filters:', filters);
      console.log('Pagination:', this.pageSize);

      this.commonService
        .loadData(this.assetHistoryService, this.pageNo, this.pageSize, filters)
        .subscribe(
          (response) => {
            this.assetHistoryList = response.data;
            this.totalElements = response.totalElements;
            this.totalPages = response.totalPages;
          },
          (error) => {
            console.error('There was an error!', error);
          }
        );
    }
  }

  applyFilters(eventFilters: any): any {
    const filters: any = {};

    for (const field in eventFilters) {
      if (eventFilters[field]) {
        const filterMeta = eventFilters[field][0];
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

    return filters;
  }

  onFilterApplied(event: any): void {
    this.activeFilters = [];
    const filters = event.filters;

    Object.keys(filters).forEach((field) => {
      const filterArray = filters[field];
      if (filterArray?.length) {
        const filterValue = filterArray[0]?.value;
        if (filterValue) {
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

  clear(table: Table) {
    table.clear();
    this.activeFilters = [];
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
      case 'CREATED':
        return 'success';

      case 'ASSIGNED':
      case 'UPDATED':
        return 'info';

      case 'UNAVAILABLE':
      case 'DELETED':
        return 'danger';

      default:
        return undefined;
    }
  }
}
