import { Component } from '@angular/core';
import { ReactiveFormComponent } from '../reactive-form/reactive-form.component';
import { FooterComponent } from '../../home-page/footer/footer.component';
import { NavigationBarComponent } from '../../navigation-bar/navigation-bar.component';

@Component({
  selector: 'app-form-container',
  standalone: true,
  imports: [ReactiveFormComponent, FooterComponent, NavigationBarComponent],
  templateUrl: './form-container.component.html',
  styleUrl: './form-container.component.css',
})
export class FormContainerComponent {}
