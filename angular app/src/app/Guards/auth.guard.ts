import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from '../Services/auth-service.service';
import { DesignUtilityService } from '../Services/design-utility.service';

export const authGuard: CanActivateFn = (route, state) => {
  const service = inject(AuthServiceService)
  const router = inject(Router)
  const snack = inject(DesignUtilityService)
  if(service.isLoggedIn() === true ){
    return true;
  }else{
    snack.openSnackBar("Login First!!!","ok")
    router.navigate(['login'])
    return false;
  }
};
