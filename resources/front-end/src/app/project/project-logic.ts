import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
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

  public createTask(id:any, taskForm:any, modal:any) {
    let task = taskForm.get("description")?.value
    if(task.length < 1) {
      alert('Empty description is not allowed');
      return
    }
    this.http.post(
      '/api/new-task',
      {
        id,
        task
      },
      { withCredentials: true }
    ).subscribe(res => {
      modal.style.display = 'none';
      taskForm.reset()
    });
  }

  public deleteTask(taskId: string, projectId: any){
    this.http.post('/api/delete-task', {taskId, projectId}, {withCredentials: true}).subscribe(res => {});
  }

 public sendMessage(id:any, messageForm:any) {
  let message = messageForm.get("message")?.value
  if(message.length < 1) {
    alert('Empty messages are not allowed');
    return
  }
    this.http.post(
      '/api/new-message',
      {
        id,
        message
      },
      { withCredentials: true }
    ).subscribe(res => {
      messageForm.reset()
    })
  }

 public addUser(id:any, memberForm:any, errField:any) {
  let email = memberForm.get("email")?.value
  if(email.length < 1 || email == null) {
    alert('Empty email is not allowed');
    return
  }
    this.http.post(
      '/api/add-user',
      {
        id,
        email
      },
      { withCredentials: true }
    ).subscribe(res => {
      memberForm.reset();
    }, err => {
      memberForm.reset();
      errField.innerHTML = err.error.message
      setTimeout(() => {
        errField.innerHTML = ""
      }, 2500);
    });
  }

  public removeUser(email: string, id: any){
    this.http.post('/api/remove-user', {email, id}, {withCredentials: true}).subscribe(res => {}, err => alert(err.message));
  }

  public leaveProject(id:any){
    this.http.post('/api/leave-project', {id}, {withCredentials: true}).subscribe(res => {
      this.router.navigate(['dashboard']);
    }, err => alert(err.error.message));
  }

  public deleteProject(id: any){
    if(confirm("Are you sure to delete this project")) {
      this.http.post('/api/delete-project', {id}, {withCredentials:true}).subscribe(res => {
        this.router.navigate(['dashboard'])
      }, err => alert(err.message))
    }
  }

  public drop(event: CdkDragDrop<any[]>, id:any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      let container = event.container.id
      let task = event.item.data
      switch(container){
        case 'ToDoList':
          task.stage = 'To do'
          break
        case 'DoingList':
          task.stage = 'Doing'
          break
        case 'DoneList':
          task.stage = 'Done'
          break
        default:
          break
      }
      this.http.put('/api/update-task', {task, id}, { withCredentials: true }).subscribe(res => console.log(res), err => console.log(err))
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

}
