import { TaskHttpServiceService } from '../../Services/task-http-service.service';
import { Task } from '../../Interfaces/task';
import { Component, ViewChild, signal, effect } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TaskRedactComponent } from '../task-redact/task-redact.component';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { Cathegory } from '../../Interfaces/cathegory';
import { Priority } from '../../Interfaces/priority';
import {
  ENTERANIMATIONDURATION,
  EXITANIMATIONDURATION,
  TYPES,
  TASK,
  DISPLAYEDCOLUMNS,
  DEFAULTCATH,
  DEFAULTPRIOR,
} from '../../constants';
import { forkJoin, tap } from 'rxjs';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent {
  tasks: Task[] = [];
  cathegories: Cathegory[] = [];
  priorities: Priority[] = [];

  dataSource = new MatTableDataSource(this.tasks);
  readonly DISPLAYEDCOLUMNS = DISPLAYEDCOLUMNS;
  readonly defaultCath = DEFAULTCATH;
  readonly defaultPrior = DEFAULTPRIOR;
  readonly types = [TYPES.author, TYPES.cathegory, TYPES.name, TYPES.priority]; ////// Object.value не работает
  public filterParam = signal<string>('');
  public counter = signal<number>(0);

  filterForm = new FormGroup({
    param: new FormControl(''),
    typeSelect: new FormControl(''),
  });

  constructor(private http: TaskHttpServiceService, private dialog: MatDialog) {
    effect(() => {
      console.log('Effect Appeared, filter param = ' + this.filterParam());
    });
    this.getData();
  }

  @ViewChild(MatSort)
  sort: MatSort = new MatSort();

  modifyData(sourceArray: Cathegory[] | Priority[], attribute: keyof Task) {
    this.tasks.forEach((task: Task) => {
      if (sourceArray != undefined && sourceArray.length != 0) {
        let filteredArray = sourceArray.filter(
          (element) => element.id.toString() == task[attribute]
        );
        if (
          filteredArray != undefined &&
          filteredArray.length != 0 &&
          (attribute == TASK.priority || attribute == TASK.cathegory)
        ) {
          task[attribute] = filteredArray[0].name;
        } else if (attribute == TASK.cathegory)
          task[attribute] = this.defaultCath;
        else if (attribute == TASK.priority)
          task[attribute] = this.defaultPrior;
      } else {
        if (attribute == TASK.cathegory) task[attribute] = this.defaultCath;
        else if (attribute == TASK.priority)
          task[attribute] = this.defaultPrior;
      }
    });
  }
  getData() {
    const tasks$ = this.http.getTasks();
    const cathegories$ = this.http.getCathegories();
    const priorities$ = this.http.getPriorities();

    forkJoin([tasks$, cathegories$, priorities$])
      .pipe(
        tap(([tasksTerm$, cathegoriesTerm$, prioritiesTerm$]) => {
          this.tasks = tasksTerm$;
          this.cathegories = cathegoriesTerm$;
          this.priorities = prioritiesTerm$;
          this.counter.update((value) => (value = tasksTerm$.length));
        })
      )
      .subscribe({
        complete: () => {
          this.modifyData(this.cathegories, TASK.cathegory);
          this.modifyData(this.priorities, TASK.priority);
          this.dataSource = new MatTableDataSource(this.tasks);
        },
      });
  }

  goToPost(taskId: number) {
    console.log('TRANSFERED ID = ' + taskId);
    this.openRedactDIalog(
      ENTERANIMATIONDURATION,
      EXITANIMATIONDURATION,
      taskId
    );
  }

  deleteTask(id: number) {
    console.log(id);
    if (confirm('Are you sure to delete ' + id)) {
      this.http.deleteTask(id).subscribe({
        next: () => console.log(id),
        error: (e) => console.log(e),
        complete: () => this.getData(),
      });
    }
  }

  filterByType(type: string) {
    let newTaskList;
    if (this.tasks)
      if (
        this.tasks.filter((task) =>
          (task[type as keyof Task] as string).includes(this.filterParam())
        )
      ) {
        newTaskList = this.tasks.filter((task) =>
          (task[type as keyof Task] as string).includes(this.filterParam())
        );
      }
    this.dataSource = new MatTableDataSource(newTaskList);
  }

  filterTasks() {
    let type;
    if (
      this.filterForm.get('typeSelect')?.value &&
      this.filterForm.get('param')?.value
    ) {
      type = this.filterForm.get('typeSelect')?.value;
      this.filterParam.update(
        (param) => (param = this.filterForm.get('param')?.value!)
      );
    }
    switch (type) {
      case TYPES.author:
        this.filterByType(TASK.author);
        break;
      case TYPES.name:
        this.filterByType(TASK.name);
        break;
      case TYPES.cathegory:
        this.filterByType(TASK.cathegory);
        break;
      case TYPES.priority:
        this.filterByType(TASK.priority);
        break;
      default:
        this.dataSource = new MatTableDataSource(this.tasks);
        break;
    }
  }

  resetFilter() {
    this.getData();
  }

  openRedactDIalog(
    enterAnimationDuration: string,
    exitAnimationDuration: string,
    taskId: number
  ): void {
    const dialogRedact = this.dialog.open(TaskRedactComponent, {
      data: {
        id: taskId,
        redact: true,
      },
      width: 'auto',
      enterAnimationDuration,
      exitAnimationDuration,
    });
    dialogRedact.afterClosed().subscribe({
      complete: () => {
        this.getData();
      },
    });
  }
}
