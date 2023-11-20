import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { TaskHttpServiceService } from '../../Services/task-http-service.service';
import { Task } from '../../Interfaces/task';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent implements OnInit {

  taskForm!:FormGroup;
  cathegories = [("One"),("Two")];//write pull request  
  
 public constructor 
  (
    public formBuilder: FormBuilder,
    public router: Router,
    public http:TaskHttpServiceService
  )
  {}

  ngOnInit():void
  {
    this.getFormData();
  }
  getFormData():void
  {
    this.taskForm=this.formBuilder.group({      
      name: [null, [Validators.required, Validators.pattern("[A-Za-zА-Яа-яЁё]*")]],
      priority: [null, [Validators.required]],
      date: [null, [Validators.required]],
      cathegory: [null, [Validators.required]]
    })
  }
  postTask():void
  {
    const task: Task = this.taskForm.value;
    task.author="thats me"//AUTHORIZED USER CREATE PULL HERE
    this.http.postTask(task).subscribe(
      {
        error: (e) => console.error(e),
        complete: () => console.log("posted")
      }
    )
    this.router.navigate([""]) ///CLOSE MODAL
  }
}

