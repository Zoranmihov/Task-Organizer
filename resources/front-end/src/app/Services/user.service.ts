import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}
  private currentUser = new BehaviorSubject<Object>({});
  public presentUser = this.currentUser.asObservable()
  private isOnline = new BehaviorSubject<boolean>(false);
  public isOnline$ = this.isOnline.asObservable();

  public initUser() {
    this.http
      .get('/api/profile', {
        withCredentials: true,
      }).subscribe((res: any) => {
        this.currentUser.next(res)
        this.isOnline.next(true)
      }, err => {
        this.currentUser.next({});
        this.isOnline.next(false)
      })
      return Promise.resolve()
    }
}
