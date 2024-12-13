import { Routes } from '@angular/router';
import { FormContainerComponent } from './login-page/form-container/form-container.component';
import { HomeComponent } from './home-page/home/home.component';
import { UsersComponent } from './user-page/users/users.component';

const routeConfig: Routes = [
  {
    path: 'login',
    component: FormContainerComponent,
    title: 'Login Page',
  },
  {
    path: '',
    component: HomeComponent,
    title: 'Home Page',
  },
  {
    path: 'users',
    component: UsersComponent,
    title: 'Users Page',
  },
];
export default routeConfig;
