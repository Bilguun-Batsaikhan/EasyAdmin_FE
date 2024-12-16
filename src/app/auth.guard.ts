import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const role = localStorage.getItem('role');
  const router = inject(Router);

  if (role === 'SUPER_ADMIN') {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
