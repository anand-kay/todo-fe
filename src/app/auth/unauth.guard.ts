import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class UnauthGuard implements CanActivate {

    constructor(private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        if ( localStorage.getItem('token') ) {
            this.router.navigate(['/home']);
            return false;
        }
        else {
            return true;
        }

    }

}