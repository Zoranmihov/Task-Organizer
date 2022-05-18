import { UserService } from './../Services/user.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
})
export class LoginComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private router: Router,
    private user: UserService
  ) {}

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  @ViewChild('resError') resError!: ElementRef;

  login = () => {
    this.http
      .post('/api/login', this.loginForm.getRawValue(), {
        withCredentials: true,
      })
      .subscribe(
        (res: any) => {
          this.user.initUser();
          this.router.navigate(['dashboard']);
        },
        (err) => {
          this.resError.nativeElement.innerHTML = err.error.message;
          this.loginForm.reset();
        }
      );
  };

  ngOnInit(): void {}
}
