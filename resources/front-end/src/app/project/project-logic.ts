import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ProjectLogic {
  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {}

  public openModel(modal: any) {
    modal.style.display = 'block';
  }

  public closeModel(modal: any, form:any) {
    modal.style.display = 'none';
    form.reset()
  }

  public deleteTask(taskId: string, projectId: any){
    this.http.post('/api/delete-task', {taskId, projectId}, {withCredentials: true}).subscribe(res => {});
  }

  public removeUser(email: string, id: any){
    this.http.post('/api/remove-user', {email, id}, {withCredentials: true}).subscribe(res => {}, err => alert(err.message));
  }

  public leaveProject(id:any){
    this.http.post('/api/leave-project', {id}, {withCredentials: true}).subscribe(res => {
      this.router.navigate(['dashboard']);
    });
  }

  public deleteProject(id: any){
    if(confirm("Are you sure to delete this project")) {
      this.http.post('/api/delete-project', {id}, {withCredentials:true}).subscribe(res => {
        this.router.navigate(['dashboard'])
      }, err => alert(err.message))
    }
  }

}
