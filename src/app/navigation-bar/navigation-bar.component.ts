import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  imports: [RouterModule, MenubarModule, InputTextModule, ButtonModule],
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css'],
})
export class NavigationBarComponent implements OnInit {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-fw pi-home',
        routerLink: '/',
      },
      {
        label: 'Assets',
        icon: 'pi pi-fw pi-folder',
        routerLink: '/assets',
      },
      {
        label: 'Users',
        icon: 'pi pi-fw pi-users',
        routerLink: '/users',
      },
      {
        label: 'Dashboard',
        icon: 'pi pi-fw pi-chart-bar',
        routerLink: '/dashboard',
      },
    ];
  }
}
