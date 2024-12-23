import { Component } from '@angular/core';
import { AssetTableComponent } from '../asset-table/asset-table.component';
import { NavigationBarComponent } from '../../navigation-bar/navigation-bar.component';
import { FooterComponent } from '../../home-page/footer/footer.component';

@Component({
  selector: 'app-assets',
  standalone: true,
  imports: [AssetTableComponent, NavigationBarComponent, FooterComponent],
  templateUrl: './assets.component.html',
  styleUrl: './assets.component.css',
})
export class AssetsComponent {}
