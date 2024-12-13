import { Component } from '@angular/core';
import { BodyComponent } from '../../home-page/body/body.component';
import { UserTableComponent } from '../user-table/user-table.component';

@Component({
  selector: 'app-users-body',
  standalone: true,
  imports: [BodyComponent, UserTableComponent],
  templateUrl: './users-body.component.html',
  styleUrl: './users-body.component.css',
})
export class UsersBodyComponent {}
