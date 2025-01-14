import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const role = localStorage.getItem('role');
  const router = inject(Router);
  const allowedRoles = route.data?.['roles'] as string[];

  if (allowedRoles && role && allowedRoles.includes(role)) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
