import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.sass']
})
export class ProjectComponent implements OnInit {

  constructor(private http: HttpClient) { }

  getInfo(){
    this.http.get('/api/test', {withCredentials: true}).subscribe((res:any) => {
      console.log(res.message)
    })
  }

  ngOnInit(): void {
    let a = "Hur"
  }

}
