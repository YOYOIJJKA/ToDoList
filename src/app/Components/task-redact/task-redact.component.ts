import { Component } from '@angular/core';
import { TaskComponent } from '../task/task.component';
import { Task } from '../../Interfaces/task';
import { forkJoin, tap } from 'rxjs';
import { TASK } from '../../constants';

@Component({
  selector: 'app-task-redact',
  templateUrl: './task-redact.component.html',
  styleUrl: './task-redact.component.scss',
})
export class TaskRedactComponent extends TaskComponent {
  task?: Task;
  cathegoryId?: number;
  priorityId?: number;
  id = 0;

  override ngOnInit(): void {
    this.id = this.data;
    this.getData();
  }
  ///////////////один компонент, тип передается в зависимости от редактирования/создания
  getData() {
    const subsTask = this.http.getTask(this.id);
    const subsCath = this.http.getCathegories();
    const subsPrior = this.http.getPriorities();

    forkJoin([subsCath, subsPrior, subsTask])
      .pipe(
        tap(([res1, res2, res3]) => {
          this.cathegories = res1;
          this.priorities = res2;
          this.task = res3;
        })
      )
      .subscribe({
        complete: () => {
          this.getTaskData();
        },
      });
  }
  getTaskData() {
    if (this.task && this.task.id) this.id = this.task.id;
    let cathegoriesSelectId, prioritySelectId;
    let termCath, termPrior: String | null;
    if (this.task && this.task.priority && this.priorities) {
      let priorArray = this.priorities.filter(
        (priority) => priority.id.toString() == this.task?.priority
      );
      if (priorArray != undefined) {
        termPrior = priorArray[0].name;
      } else termPrior = null;
    }

    ///////////////// привести к одному методу
    if (this.cathegories && this.task && this.task.cathegory) {
      let priorArray = this.cathegories.filter(
        (cathegory) => cathegory.id.toString() == this.task?.cathegory
      );
      if (priorArray != undefined && priorArray.length != 0) {
        termCath = priorArray[0].name;
      } else termCath = null;
    }
    prioritySelectId = this.priorities?.findIndex(
      (prior) => prior.name == termPrior
    );


    cathegoriesSelectId = this.cathegories?.findIndex(
      (cathegory) => cathegory.name == termCath!
    );
    this.patch(cathegoriesSelectId, prioritySelectId);
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
}
