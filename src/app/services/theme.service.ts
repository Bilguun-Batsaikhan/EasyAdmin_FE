import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  switchTheme(theme: string) {
    let themeLink = this.document.getElementById(
      'app-theme'
    ) as HTMLLinkElement;

    if (themeLink) {
      themeLink.href = `assets/themes/${theme}/theme.css`;
    } else {
      themeLink = this.document.createElement('link');
      themeLink.id = 'app-theme';
      themeLink.rel = 'stylesheet';
      themeLink.href = `assets/themes/${theme}/theme.css`;
      this.document.head.appendChild(themeLink);
    }
  }
}
