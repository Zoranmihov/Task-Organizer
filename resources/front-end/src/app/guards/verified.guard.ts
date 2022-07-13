import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../Services/user.service';

@Injectable({
  providedIn: 'root'
})
export class VerifiedGuard implements CanActivate {
  constructor( private user:UserService, private router: Router){}
  answer: any
  canActivate() {
    this.user.presentUser.subscribe(res => {
      this.answer = res
    })
    if(this.answer.verified){
      return true
    } else {
      this.router.navigate(['verify'])
      return false
    }
  }
}
