import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  imports: [RouterModule, MenubarModule, InputTextModule, ButtonModule],
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css'],
})
export class NavigationBarComponent implements OnInit {
  menuItems: MenuItem[] | undefined;
  router: Router = inject(Router);
  role = localStorage.getItem('role');
  ngOnInit() {
    console.log('Role:', this.role);

    this.menuItems = [
      {
        label: 'Home',
        icon: 'pi pi-fw pi-home',
        routerLink: '/home',
        roles: [],
      },
      {
        label: 'Assets',
        icon: 'pi pi-fw pi-folder',
        routerLink: '/assets',
        roles: ['SUPER_ADMIN', 'SYSTEM_ADMIN'],
      },
      {
        label: 'Users',
        icon: 'pi pi-fw pi-users',
        routerLink: '/users',
        roles: ['SUPER_ADMIN'],
      },
      {
        label: 'Dashboard',
        icon: 'pi pi-fw pi-chart-bar',
        routerLink: '/dashboard',
        roles: ['SUPER_ADMIN', 'SYSTEM_ADMIN'],
      },
    ];

    // Filter menu items based on the user's role
    this.menuItems = this.menuItems.filter(
      (item) => item['roles'].length === 0 || item['roles'].includes(this.role)
    );
  }

  onSignOut() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }
}
