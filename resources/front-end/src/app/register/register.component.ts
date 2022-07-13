import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../Services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass'],
})
export class RegisterComponent {
  constructor(
    private http: HttpClient,
    private router: Router,
    private user: UserService
  ) {}

  registerForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl('', [
      Validators.pattern(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      ),
    ]),
    password: new FormControl('', [
      Validators.pattern(
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/
      ),
    ]),
  });

  @ViewChild('resError') resError!: ElementRef;

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  register = () => {
    this.http.post('/api/register', this.registerForm.getRawValue()).subscribe(
      (res) => {
        this.user.initUser();
        this.router.navigate(['verify']);
      },
      (err) => {
        this.resError.nativeElement.innerHTML = err.error.message;
        this.registerForm.reset();
      }
    );
  };
}
