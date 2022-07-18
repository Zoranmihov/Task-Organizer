import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../Services/user.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.sass']
})
export class NotFoundComponent implements OnInit {

  constructor(public user: UserService, private router: Router) {}

  ngOnInit(): void {
    this.user.isOnline$.subscribe(result => {
      if(result){
        this.user.presentUser.subscribe((user: any) => {
          if (user.verified === 1) {
            this.router.navigate(['dashboard']);
          } else {
            this.router.navigate(['verify']);
          }
      });
      } else {
        this.router.navigate(['home']);
      }
    })
  }

}
