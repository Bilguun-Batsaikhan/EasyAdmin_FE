import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationBarComponent } from '../../navigation-bar/navigation-bar.component';
import { FooterComponent } from '../../home-page/footer/footer.component';
import { ButtonModule } from 'primeng/button';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { TicketType } from '../../enumeration/TicketType';
import { TicketPriority } from '../../enumeration/TicketPriority';
import { CreateTicket } from '../../interfaces/createTicket';
import { Asset } from '../../interfaces/assets';
import { AssetsService } from '../../services/assets.service';
import { TicketsService } from '../../services/tickets.service';
import { CommonService } from '../../services/common.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ticket-open',
  standalone: true,
  imports: [
    CommonModule,
    NavigationBarComponent,
    FooterComponent,
    ButtonModule,
    ReactiveFormsModule,
    ConfirmPopupModule,
    ToastModule,
  ],
  templateUrl: './ticket-open.component.html',
  styleUrl: './ticket-open.component.css',
  providers: [CommonService, MessageService, ConfirmationService],
})
export class TicketOpenComponent implements OnInit {
  loading: boolean = false;
  formSubmitted: boolean = false;
  width: string | undefined;

  TicketPriority = {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH',
  };

  TicketType = {
    REQUEST: 'REQUEST',
    FAULT: 'FAULT',
  };

  assets: Asset[] = []; // Store the assets

  form: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    context: new FormControl('', Validators.required),
    ticketType: new FormControl(TicketType.REQUEST, Validators.required),
    priority: new FormControl(TicketPriority.LOW, Validators.required),
    assetId: new FormControl(null, Validators.required),
  });

  constructor(
    private assetService: AssetsService,
    private ticketService: TicketsService,
    private commonService: CommonService,
    private router: Router
  ) {} // Inject the service

  ngOnInit() {
    this.formSubmitted = false;
    this.assetService.getAssets().subscribe((assets) => {
      this.assets = assets.data;
    });
  }

  onSave() {
    this.formSubmitted = true;
    console.log('Form submitted ', this.formSubmitted);
    console.log('Form invalid ', this.form.get('title')?.invalid);
    if (this.form.valid) {
      this.loading = true;
      const ticketToBeInserted: CreateTicket = this.form.value;
      this.ticketService.postTicket(ticketToBeInserted).subscribe({
        next: (response) => {
          this.commonService.successMessage('Ticket created successfully');
          setTimeout(() => {
            this.commonService.successMessage('Redirecting to dashboard');
          }, 3000);
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
            this.loading = false;
          }, 6000);
        },
        error: (error) => {
          this.commonService.errorMessage('Failed to create ticket');
        },
      });
    }
  }

  ngOnChanges() {
    this.form.reset();
  }
}
