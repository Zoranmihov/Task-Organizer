import { Router } from '@angular/router';
import { UserService } from './../Services/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass'],
})
export class HomeComponent implements OnInit {
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
      }
    })
  }
}
