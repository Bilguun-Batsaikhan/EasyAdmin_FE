import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormContainerComponent } from './login-page/form-container/form-container.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
//import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FormContainerComponent,
    ReactiveFormsModule,
    RouterModule,
    //CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'EasyAdminFE';
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  ngOnInit(): void {
    // Clear local storage on application start
    localStorage.clear();
  }
}
