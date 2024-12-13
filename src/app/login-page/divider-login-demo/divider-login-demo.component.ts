import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-divider-login-demo',
  templateUrl: './divider-login-demo.component.html',
  standalone: true,
  imports: [DividerModule, ButtonModule, InputTextModule],
})
export class DividerLoginDemoComponent {}
