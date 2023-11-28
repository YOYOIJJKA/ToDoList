import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { TaskHttpServiceService } from '../../Services/task-http-service.service';
import { Task } from '../../Interfaces/task';
import { Cathegory } from '../../Interfaces/cathegory';
import { Priority } from '../../Interfaces/priority';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StorageService } from '../../Services/storage.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent implements OnInit {

  taskForm!: FormGroup;
  cathegories!: Cathegory[];//write pull request  
  priorities!: Priority[];

  constructor
    (
      @Inject(MAT_DIALOG_DATA) public data: any,
      public formBuilder: FormBuilder,
      public router: Router,
      public http: TaskHttpServiceService,
      public dialog: MatDialog,
      public storage: StorageService
    ) { }


  getCathegories() {
    this.http.getCathegories().subscribe(
      {
        next: (newCathegories: Cathegory[]) => {
          this.cathegories = newCathegories
        },
        error: (e) => console.error(e),
        complete: () => { }
      })
  }
  getPriorities() {
    this.http.getPriorities().subscribe(
      {
        next: (newPriority: Priority[]) => {
          this.priorities = newPriority
        },
        error: (e) => console.error(e),
        complete: () => { }
      })
  }

  ngOnInit(): void {
    this.getCathegories();
    this.getPriorities();
    this.getFormData();
  }
  getFormData(): void {
    this.taskForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern("[A-Za-zА-Яа-яЁё]*")]],
      priority: [null, [Validators.required]],
      date: [null, [Validators.required]],
      cathegory: [null, [Validators.required]]
    })
  }
  postTask(): void {
    
    if (this.taskForm.valid) {
      const task: Task = this.taskForm.value;
      task.author = this.storage.getLogin()
      this.http.postTask(task).subscribe(
        {
          error: (e) => console.error(e),
          complete: () => 
          {
            let newCath = this.cathegories.filter((cathegory)=> cathegory.name == task.cathegory);
            console.log('filtered:'+newCath[0].name + ' id: '+ newCath[0].id)
        }
        }
      )
      this.closeModal()
    }
    else { console.log("invalid") }
  }
  closeModal() {
    this.dialog.closeAll()
  }
}

