import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../Services/user.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.sass'],
})
export class VerifyComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private router: Router,
    private user: UserService
  ) {}

  @ViewChild('res') res!: ElementRef;

  verifyForm = new FormGroup({
    code: new FormControl(''),
  });

  verify() {
    this.http
      .post('/api/verify', this.verifyForm.getRawValue(), {
        withCredentials: true,
      })
      .subscribe(
        (res: any) => {
          this.router.navigate(['dashboard']);
        },
        (err) => {
          alert("Invalid code please try again")
        }
      );
  }

  resendCode() {
    this.http.get('/api/resend', { withCredentials: true }).subscribe(
      (res: any) => {
        console.log(res);
        this.res.nativeElement.innerHTML = res.message;
        this.res.nativeElement.setAttribute('style', 'color: #30aa14;');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
      (err) => {
        this.res.nativeElement.innerHTML =
          'Something went wrong please try again';
        this.res.nativeElement.setAttribute('style', 'color: red;');
        this.verifyForm.reset();
      }
    );
  }

  ngOnInit(): void {
    this.user.presentUser.subscribe((user: any) => {
      if (user.verified === 1) {
        this.router.navigate(['dashboard']);
      }
    });
  }
}
