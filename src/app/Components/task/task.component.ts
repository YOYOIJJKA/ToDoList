import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { TaskHttpServiceService } from '../../Services/task-http-service.service';
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
  cathegories!: Cathegory[];
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
        complete: () => {
        }
      })
  }

  ngOnInit(): void {
    this.getCathegories()
    this.getPriorities();
    this.getFormData();
  }
  getFormData(): void {
    this.taskForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern("[A-Za-zА-Яа-яЁё]*")]],
      priority: [null, []],
      date: [null, [Validators.required]],
      cathegory: [null, []]
    })
  }

  postTask(): void {

    if (this.taskForm.valid) {
      const task = this.taskForm.value;
      // var newPriority:string = task.priority?.join(' ');
      // task.priority = newPriority;
      task.author = this.storage.getLogin()
      this.http.postTask(task).subscribe(
        {
          error: (e) => console.error(e),
          complete: () => console.log(this.taskForm.value)
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

