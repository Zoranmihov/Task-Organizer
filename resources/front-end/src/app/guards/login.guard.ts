import { UserService } from './../Services/user.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
// Todo reverse logic from this one for login and register guard
export class LoginGuard implements CanActivate {
  constructor( private user:UserService, private router: Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.user.isOnline$.pipe(tap(isOnline => {
      if(!isOnline){
        this.router.navigate(['login'])
      }
    }));
  }

}
