import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Pusher from 'pusher-js';
import { ProjectLogic } from './project-logic';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.sass'],
})
export class ProjectComponent implements OnInit {
  constructor(
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    public projectLogic: ProjectLogic
  ) {}

  @ViewChild('taskModal') taskModal!: ElementRef;
  @ViewChild('membersModal') membersModal!: ElementRef;

  logData(){
    console.log(this.project.chat)
  }

  eventData: any;
  project: any;
  toDo: any[] = [];
  doing: any[] =[];
  done: any[] = [];

  taskForm = new FormGroup({
    description: new FormControl(''),
  });

   messageForm = new FormGroup({
    message: new FormControl(''),
  });

  memberForm = new FormGroup({
    email: new FormControl(''),
  });


  createTask() {
    this.http.post(
      '/api/new-task',
      {
        id: this.activatedRoute.snapshot.paramMap.get('id'),
        task: this.taskForm.get("description")?.value,
      },
      { withCredentials: true }
    ).subscribe(res => {
      console.log(res)
    });
  }


  sortTaks(tasks: any){
    this.toDo = [];
    this.doing = [];
    this.done = [];
    tasks.forEach((task: any) => {
      switch(task.stage){
        case 'To do':
          this.toDo.push(task);
          break
          case 'Doing':
            this.doing.push(task);
            break
          case 'Done':
            this.done.push(task);
            break
      }
    });
  }

  addUser() {
    this.http.post(
      '/api/add-user',
      {
        id: this.activatedRoute.snapshot.paramMap.get('id'),
        email: this.memberForm.get("email")?.value,
      },
      { withCredentials: true }
    ).subscribe(res => {
      console.log(res)
    });
  }


  sendMessage() {
    this.http.post(
      '/api/new-message',
      {
        id: this.activatedRoute.snapshot.paramMap.get('id'),
        message: this.messageForm.get("message")?.value,
      },
      { withCredentials: true }
    ).subscribe(res => console.log(res))
  }

  ngOnInit(): void {
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    this.http.post('/api/project', { id }, { withCredentials: true }).subscribe(
      (res) => {
        console.log('Connection established');
      },
      (err) => {
        alert('Something went wrong, going back to dashboard');
        this.router.navigate(['dashboard']);
      }
    );

    const pusher = new Pusher('c06818a9c9f0dbe56d7f', {
      cluster: 'eu',
      forceTLS: true,
    });
    const channel = pusher.subscribe(`project${id}`);

    channel.bind('ProjectEvent', (data: any) => {
      this.project = data.project;
      this.sortTaks(data.project.tasks)

    });
  }

  drop(event: CdkDragDrop<any[]>) {
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
      this.http.put('/api/update-task', {task, id:this.activatedRoute.snapshot.paramMap.get('id')}, { withCredentials: true }).subscribe(res => console.log(res), err => console.log(err))
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
