import { Component } from '@angular/core';
import { NavigationBarComponent } from '../../navigation-bar/navigation-bar.component';
import { AssetHistoryTableComponent } from '../asset-history-table/asset-history-table.component';
import { FooterComponent } from '../../home-page/footer/footer.component';

@Component({
  selector: 'app-asset-history',
  standalone: true,
  imports: [
    NavigationBarComponent,
    AssetHistoryTableComponent,
    FooterComponent,
  ],
  templateUrl: './asset-history.component.html',
  styleUrl: './asset-history.component.css',
})
export class AssetHistoryComponent {}
