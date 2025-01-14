import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
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
import {
  Table,
  TableFilterEvent,
  TableLazyLoadEvent,
  TableModule,
} from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { CommonService } from '../../services/common.service';
import { Ticket } from '../../interfaces/tickets';
import { TicketType } from '../../enumeration/TicketType';
import { TicketStatus } from '../../enumeration/TicketStatus';
import { TicketPriority } from '../../enumeration/TicketPriority';
import { TicketsService } from '../../services/tickets.service';
import { TicketsToBeDisplayed } from '../../interfaces/ticketsToBeDisplayed';
import { Router } from '@angular/router';
@Component({
  selector: 'app-ticket-table',
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
  ],

  providers: [
    ConfirmationService,
    MessageService,
    CommonService,
    TicketsService,
  ],
  templateUrl: './ticket-table.component.html',
  styleUrl: './ticket-table.component.css',
})
export class TicketTableComponent {
  constructor(
    private router: Router,
    private ticketService: TicketsService,
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
  selectedStatus: string[] = [];
  selectedPriority: string[] = [];
  activeFilters: { field: string; value: any }[] = [];
  tickets: Ticket[] = [];
  ticketsToBeDisplayed: TicketsToBeDisplayed[] = [];

  // Ticket status options
  statusOptions = [
    { label: 'OPEN', value: 'OPEN' },
    { label: 'CLOSED', value: 'CLOSED' },
  ];

  // Ticket priority options
  priorityOptions = [
    { label: 'LOW', value: 'LOW' },
    { label: 'MEDIUM', value: 'MEDIUM' },
    { label: 'HIGH', value: 'HIGH' },
  ];

  ticketToBeInserted: Ticket = {
    id: 0,
    modelName: '',
    username: '',
    title: '',
    context: '',
    ticketType: TicketType.REQUEST,
    status: TicketStatus.OPEN,
    priority: TicketPriority.MEDIUM,
    issuedAt: null,
    closedAt: null,
    resolutionDetails: '',
    lastUpdatedAt: null,
  };

  ngOnInit() {
    this.loadTickets();
  }

  onFilterApplied(event: any): void {
    this.commonService.onFilterApplied(event, this.activeFilters);
  }

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

    this.loadTickets(filters);
  }

  loadTickets(filters?: { [key: string]: any }) {
    this.ticketService
      .getTickets(this.pageNo, this.pageSize, filters)
      .subscribe({
        next: (response) => {
          this.tickets = response.data;
          this.totalElements = response.totalElements;
          this.totalPages = response.totalPages;
          this.populateTicketsToBeDisplayed();
        },
        error: (error) => {
          console.error('Error:', error);
        },
      });
  }

  clear(table: Table) {
    table.clear();
    this.activeFilters = [];
  }

  isUser(): boolean {
    return localStorage.getItem('role') === 'USER';
  }

  showDialog(ticket: any = null): void {
    console.log('Ticket:', ticket);
    if (ticket) {
      this.editMode = true;
      this.ticketToBeInserted = { ...ticket };
    } else {
      console.log('Insert Mode');
      this.editMode = false;
      this.resetTicketForm();
      this.router.navigate(['/ticket-open']);
    }
    this.visible = true;
  }

  resetTicketForm(): void {
    this.ticketToBeInserted = {
      id: 0,
      modelName: '',
      username: '',
      title: '',
      context: '',
      ticketType: TicketType.REQUEST,
      status: TicketStatus.OPEN,
      priority: TicketPriority.MEDIUM,
      issuedAt: null,
      closedAt: null,
      resolutionDetails: '',
      lastUpdatedAt: null,
    };
  }

  populateTicketsToBeDisplayed() {
    this.ticketsToBeDisplayed = this.tickets.map((ticket) => ({
      id: ticket.id,
      modelName: ticket.modelName,
      username: ticket.username,
      title: ticket.title,
      status: ticket.status,
      priority: ticket.priority,
      issuedAt: ticket.issuedAt,
    }));
  }

  hasAdminRole(): boolean {
    const role = localStorage.getItem('role');
    return role === 'SYSTEM_ADMIN' || role === 'SUPER_ADMIN';
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
      case 'CLOSED':
      case 'LOW':
        return 'success';

      case 'OPEN':
      case 'MEDIUM':
        return 'info';

      case 'HIGH':
        return 'danger';

      default:
        return undefined;
    }
  }
}
