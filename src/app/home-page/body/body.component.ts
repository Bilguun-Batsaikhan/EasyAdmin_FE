import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [RouterModule, ButtonModule, CommonModule],
  templateUrl: './body.component.html',
  styleUrl: './body.component.css',
})
export class BodyComponent {
  isLoggedIn(): boolean {
    return localStorage.length > 0;
  }
}
