import { HttpClient } from '@angular/common/http';
import { UserService } from './../Services/user.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.sass'],
})
export class NavComponent implements OnInit {
  constructor(public user: UserService, private http: HttpClient, private router: Router) {}

  @ViewChild('bar') bar!: ElementRef;

  logOut(){
    this.http.get('/api/logout', {withCredentials: true}).subscribe(res => {
      this.user.initUser();
    })
  }

  ngOnInit(): void {
   this.user.isOnline$.subscribe(online => {
    if(online == false) {
      setTimeout(() => (this.bar.nativeElement.style.opacity = 0), 2000);
    }
   })
  }
}
