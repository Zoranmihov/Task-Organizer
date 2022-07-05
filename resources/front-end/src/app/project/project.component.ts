import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Pusher from 'pusher-js';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.sass'],
})
export class ProjectComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  @ViewChild('taskModal') taskModal!: ElementRef;
  logData(){
    console.log(this.project)
  }

  project: any;
  taskForm = new FormGroup({
    description: new FormControl(''),
  });

  openModel(modal: any) {
    modal.style.display = 'block';
  }

  closeModel(modal: any, form:FormGroup) {
    modal.style.display = 'none';
    form.reset()
  }

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
    });
  }
}
