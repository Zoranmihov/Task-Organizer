import { ProjectService } from './../Services/project.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {

  constructor(private http: HttpClient, public router: Router, private projectService: ProjectService) {}

  @ViewChild('modal') modal!: ElementRef;
  @ViewChild('resError') resError!: ElementRef;

  projectForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl('')
  });

  data: any

  createProject() {
    this.http.post('/api/create-project', this.projectForm.getRawValue(), {
      withCredentials: true
    }).subscribe(
      (res) => {
        window.location.reload();
      },
      (err) => {
        this.resError.nativeElement.innerHTML = err.error.message;
        this.projectForm.reset();
      }
    );
  };

  toProject(id:number){
    this.router.navigate([`project/${id}`])
  }

  openModel(){
    this.modal.nativeElement.style.display = 'block'
  }

  closeModel() {
    this.modal.nativeElement.style.display = 'none';
  }

  ngOnInit(): void {
    this.projectService.getProjects().subscribe((res: any) => {
      if(res.projects) {
        this.data = res.projects
      } else {
        this.data = false
      }
    })
  }

}
