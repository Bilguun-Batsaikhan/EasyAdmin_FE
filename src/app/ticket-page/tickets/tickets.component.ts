import { Component } from '@angular/core';
import { NavigationBarComponent } from '../../navigation-bar/navigation-bar.component';
import { FooterComponent } from '../../home-page/footer/footer.component';
import { TicketTableComponent } from '../ticket-table/ticket-table.component';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [NavigationBarComponent, FooterComponent, TicketTableComponent],
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.css',
})
export class TicketsComponent {}
