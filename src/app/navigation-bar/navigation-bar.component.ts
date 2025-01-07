import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  imports: [
    RouterModule,
    MenubarModule,
    InputTextModule,
    ButtonModule,
    CommonModule,
  ],
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css'],
})
export class NavigationBarComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService
  ) {}

  menuItems: MenuItem[] | undefined;
  role = localStorage.getItem('role');
  username = localStorage.getItem('username');
  userToDisplay = `Welcome, ${this.username} (${this.role})`;

  ngOnInit() {
    this.menuItems = [
      {
        label: 'Home',
        icon: 'pi pi-fw pi-home',
        routerLink: '/home',
        roles: [],
      },
      {
        label: 'Users',
        icon: 'pi pi-fw pi-users',
        routerLink: '/users',
        roles: ['SUPER_ADMIN'],
      },
      {
        label: 'Assets',
        icon: 'pi pi-fw pi-folder',
        routerLink: '/assets',
        roles: ['SUPER_ADMIN', 'SYSTEM_ADMIN'],
      },
      {
        label: 'Assets History',
        icon: 'pi pi-fw pi-clock',
        routerLink: '/assets-history',
        roles: ['SUPER_ADMIN', 'SYSTEM_ADMIN'],
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
    this.authService.logout();
  }

  isLoggedIn(): boolean {
    return localStorage.length > 0;
  }

  switchTheme(theme: string) {
    this.themeService.switchTheme(theme);
  }
}
