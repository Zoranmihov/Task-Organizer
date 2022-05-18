import { UserService } from './../Services/user.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.sass'],
})
export class NavComponent implements OnInit {
  constructor(public user: UserService) {}

  @ViewChild('bar') bar!: ElementRef;

  ngOnInit(): void {
   this.user.isOnline$.subscribe(online => {
    if(!online) {
      setTimeout(() => (this.bar.nativeElement.style.opacity = 0), 2000);
    }
   })
  }
}
