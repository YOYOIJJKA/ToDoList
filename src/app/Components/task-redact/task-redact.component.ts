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

import { Task } from '../../Interfaces/task';
import { forkJoin, tap } from 'rxjs';
import { TASKCONTROLS, TASK } from '../../constants';

@Component({
  selector: 'app-task-redact',
  templateUrl: './task-redact.component.html',
  styleUrl: './task-redact.component.scss',
})
export class TaskRedactComponent implements OnInit {
  task?: Task;
  cathegoryId?: number;
  priorityId?: number;
  id = 0;
  taskForm: FormGroup;
  cathegories?: Cathegory[];
  priorities?: Priority[];
  cathegoriesObs$?: Observable<Cathegory[]>;
  prioritiesObs$?: Observable<Priority[]>;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: number; redact: boolean },
    public formBuilder: FormBuilder,
    public router: Router,
    public http: TaskHttpServiceService,
    public dialog: MatDialog,
    public storage: StorageService
  ) {
    this.taskForm = this.formBuilder.group(TASKCONTROLS);
  }

  ngOnInit(): void {
    this.id = this.data.id;
    console.log('ID = ' + this.data.id);
    this.getData();
  }
  ///////////////один компонент, тип передается в зависимости от редактирования/создания
  getData() {
    const subsTask$ = this.http.getTask(this.id);
    const subsCath$ = this.http.getCathegories();
    const subsPrior$ = this.http.getPriorities();
    forkJoin([subsCath$, subsPrior$, subsTask$])
      .pipe(
        tap(([termCath$, termPrior$, termTask$]) => {
          this.cathegories = termCath$;
          this.priorities = termPrior$;
          this.task = termTask$;
        })
      )
      .subscribe({
        complete: () => {
          this.getTaskData();
        },
      });
  }

  getNewAttribute(
    attributeArray: Cathegory[] | Priority[] | undefined,
    attribute: string
  ): number | undefined {
    let newAttribute: String | null;

    if (this.task && this.task.id) this.id = this.task.id;

    if (this.task && this.task[attribute as keyof Task] && attributeArray) {
      let filteredArray = attributeArray.filter(
        (element) =>
          element.id.toString() == this.task![attribute as keyof Task]
      );
      if (filteredArray != undefined) {
        newAttribute = filteredArray[0].name;
      } else newAttribute = null;
    }
    if (attributeArray)
      return attributeArray.findIndex(
        (element) => element.name == newAttribute
      );
    else return undefined;
  }

  getTaskData() {
    // let cathegoriesSelectId, prioritySelectId;
    // let termCath, termArray: String | null;

    // if (this.task && this.task.id) this.id = this.task.id;

    // if (this.task && this.task.priority && this.priorities) {
    //   let filteredArray = this.priorities.filter(
    //     (priority) => priority.id.toString() == this.task?.priority
    //   );
    //   if (filteredArray != undefined) {
    //     termArray = filteredArray[0].name;
    //   } else termArray = null;
    // }

    // prioritySelectId = this.priorities?.findIndex(
    //   (prior) => prior.name == termArray
    // );

    // ///////////////// привести к одному методу
    // if (this.cathegories && this.task && this.task.cathegory) {
    //   let priorArray = this.cathegories.filter(
    //     (cathegory) => cathegory.id.toString() == this.task?.cathegory
    //   );
    //   if (priorArray != undefined && priorArray.length != 0) {
    //     termCath = priorArray[0].name;
    //   } else termCath = null;
    // }

    // cathegoriesSelectId = this.cathegories?.findIndex(
    //   (cathegory) => cathegory.name == termCath!
    // );

    this.patch(
      this.getNewAttribute(this.cathegories, TASK.cathegory),
      this.getNewAttribute(this.priorities, TASK.priority)
    );
  }

  patch(
    cathegoriesSelectId: number | undefined,
    prioritySelectId: number | undefined
  ) {
    if (this.task) {
      let termTask = {};
      if (this.task.name) {
        termTask = {
          ...termTask,
          name: this.task.name,
        };
      }
      if (this.task.date)
        termTask = {
          ...termTask,
          date: this.task.date,
        };
      if (
        (prioritySelectId == 0 || prioritySelectId) &&
        prioritySelectId != -1 &&
        this.priorities
      ) {
        termTask = {
          ...termTask,
          priority: this.priorities[prioritySelectId].id.toString(),
        };
      }
      if (
        (cathegoriesSelectId || cathegoriesSelectId == 0) &&
        cathegoriesSelectId != -1 &&
        this.cathegories
      )
        termTask = {
          ...termTask,
          cathegory: this.cathegories[cathegoriesSelectId].id.toString(),
        };
      this.taskForm.patchValue(termTask);
    }
  }

  putTask() {
    if (this.taskForm.valid) {
      const task: Task = this.taskForm.value;
      task.id = this.id;
      task.author = this.storage.getLogin();
      this.http.putTask(task).subscribe({
        error: (e) => console.error(e),
        complete: () => {
          console.log('posted');
        },
      });
      this.closeModal();
    } else {
      console.log('invalid');
    }
  }
  closeModal() {
    this.dialog.closeAll();
  }

  postTask(): void {
    if (this.taskForm.valid) {
      console.log('TRYING TO POST');
      const task = this.taskForm.value;
      task.author = this.storage.getLogin();
      this.http.postTask(task).subscribe();
      this.closeModal();
    } else {
      console.log('invalid');
    }
  }
}
