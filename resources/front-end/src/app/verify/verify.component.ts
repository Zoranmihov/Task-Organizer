import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../Services/user.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.sass']
})
export class VerifyComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router, private user: UserService) { }

  verifyForm = new FormGroup({
    code: new FormControl('')
  });

  verify(){
    this.http
    .post('/api/verify', this.verifyForm.getRawValue(), {
      withCredentials: true,
    })
    .subscribe(
      (res: any) => {
        this.router.navigate(['dashboard']);
      },
      (err) => {
        //TODO add error message and implement send a new code function
      }
    );
  };

  ngOnInit(): void {
    this.user.presentUser.subscribe((user: any) => {
      if(user.verified === 1) {
        this.router.navigate(['dashboard'])
      }
    })
  }

}
