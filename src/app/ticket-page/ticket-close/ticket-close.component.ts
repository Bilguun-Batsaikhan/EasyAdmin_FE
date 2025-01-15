import { Component } from '@angular/core';
import { NavigationBarComponent } from '../../navigation-bar/navigation-bar.component';
import { FooterComponent } from '../../home-page/footer/footer.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-ticket-close',
  standalone: true,
  imports: [
    NavigationBarComponent,
    FooterComponent,
    ConfirmPopupModule,
    ToastModule,
    ButtonModule,
  ],
  templateUrl: './ticket-close.component.html',
  styleUrl: './ticket-close.component.css',
  providers: [MessageService, ConfirmationService],
})
export class TicketCloseComponent {
  loading: boolean = false;
}
