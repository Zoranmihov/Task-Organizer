import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DashboardLogic {
  constructor(
    private router: Router,
  ) {}

  public openModel(modal: any) {
    modal.style.display = 'block';
  }

  public closeModel(modal: any, form:any) {
    modal.style.display = 'none';
    form.reset()
  }

  toProject(id:any){
    this.router.navigate([`project/${id}`])
  }

}
