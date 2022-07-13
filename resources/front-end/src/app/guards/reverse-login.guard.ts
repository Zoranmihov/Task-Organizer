import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { UserService } from '../Services/user.service';


@Injectable({
  providedIn: 'root'
})
export class ReverseLoginGuard implements CanActivate {
  constructor( private user:UserService, private router: Router){}
  answer: any
  canActivate() {
    this.user.isOnline$.subscribe(res => {
      this.answer = res
    })
    if(this.answer){
      this.router.navigate(['home'])
      return false
    } else {
      return true
    }
  }
}

