import { UserService } from './../Services/user.service';
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
    private userService: UserService,
    public projectLogic: ProjectLogic
  ) {}

  // Modals
  @ViewChild('taskModal') taskModal!: ElementRef;
  @ViewChild('membersModal') membersModal!: ElementRef;

  //Res tags
  @ViewChild('memberResError') memberResError!: ElementRef;

  logData(){
    console.log(this.project.chat)
  }

  eventData: any;
  user: any;
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


  ngOnInit(): void {
    this.userService.presentUser.subscribe(result => {
      this.user = result;
    })
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

}
