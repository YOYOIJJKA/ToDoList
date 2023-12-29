import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskHttpServiceService } from '../../Services/task-http-service.service';
import { Cathegory } from '../../Interfaces/cathegory';
import { Priority } from '../../Interfaces/priority';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StorageService } from '../../Services/storage.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent implements OnInit {
  taskForm: FormGroup;
  cathegories?: Cathegory[];
  priorities?: Priority[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public formBuilder: FormBuilder,
    public router: Router,
    public http: TaskHttpServiceService,
    public dialog: MatDialog,
    public storage: StorageService
  ) {
    this.taskForm = this.formBuilder.group({
      name: [
        null,
        [Validators.required, Validators.pattern('[A-Za-zА-Яа-яЁё]*')],
      ],
      priority: [null, []],
      date: [null, [Validators.required]],
      cathegory: [null, []],
    });
  }

  cathegoriesObs$?: Observable<Cathegory[]>;
  getCathegories() {
    this.cathegoriesObs$ = this.http.getCathegories();
  }

  prioritiesObs$?: Observable<Priority[]>;
  getPriorities() {
    this.prioritiesObs$ = this.http.getPriorities();
  }
  ngOnInit(): void {
    this.getCathegories();
    this.getPriorities();
  }
  postTask(): void {
    if (this.taskForm.valid) {
      console.log("TRYING TO POST")
      const task = this.taskForm.value;
      task.author = this.storage.getLogin();
      this.http.postTask(task).subscribe();
      this.closeModal();
    } else {
      console.log('invalid');
    }
  }

  closeModal() {
    this.dialog.closeAll();
  }
}
