import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormContainerComponent } from './login-page/form-container/form-container.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FormContainerComponent,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'login';
}
