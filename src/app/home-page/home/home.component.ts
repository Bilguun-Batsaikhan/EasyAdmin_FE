import { Component } from '@angular/core';
import { NavigationBarComponent } from '../../navigation-bar/navigation-bar.component';
import { BodyComponent } from '../body/body.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavigationBarComponent, BodyComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
