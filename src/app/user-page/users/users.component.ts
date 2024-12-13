import { Component } from '@angular/core';
import { NavigationBarComponent } from '../../navigation-bar/navigation-bar.component';
import { FooterComponent } from '../../home-page/footer/footer.component';
import { UsersBodyComponent } from '../users-body/users-body.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [NavigationBarComponent, FooterComponent, UsersBodyComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent {}
