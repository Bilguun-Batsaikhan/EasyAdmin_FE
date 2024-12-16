import {
  bootstrapApplication,
  provideProtractorTestingSupport,
} from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import routeConfig from './app/routes';
import { tokenInterceptor } from './app/services/token.interceptor';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([tokenInterceptor])),
    provideProtractorTestingSupport(),
    provideRouter(routeConfig),
    importProvidersFrom([BrowserAnimationsModule]),
  ],
}).catch((err) => console.error(err));
