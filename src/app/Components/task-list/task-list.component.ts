import { TaskHttpServiceService } from '../../Services/task-http-service.service';
import { Task } from '../../Interfaces/task';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ViewChild, signal, effect } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
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
  readonly types = [TYPES.author, TYPES.cathegory, TYPES.name, TYPES.priority];

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
  public filterParam = signal<string>('');

  @ViewChild(MatSort)
  sort: MatSort = new MatSort();
  ///live announcer read

  public counter = signal<number>(0);
  getData() {
    ///forkJoin
    //вынести все операции с данными в отдельный метод
    this.http.getTasks().subscribe({
      next: (newTasks: Task[]) => {
        this.tasks = newTasks;
        this.dataSource = new MatTableDataSource(newTasks);
        this.dataSource.sort = this.sort;
        this.counter.update((value) => (value = newTasks.length));
      },
      error: (e) => console.error(e),
      complete: () => {
        console.log('ТАСКИ С СЕРВЕРА ' + this.tasks);
        console.log(this.dataSource);
        this.http.getCathegories().subscribe({
          next: (cath: Cathegory[]) => {
            this.cathegories = cath;
            this.tasks.forEach((task) => {
              if (
                this.cathegories != undefined &&
                this.cathegories.length != 0
              ) {
                let cathArray = this.cathegories.filter(
                  (cathegory) => cathegory.id.toString() == task.cathegory
                );
                console.log('Cath array: ' + cathArray);
                if (cathArray != undefined && cathArray.length != 0) {
                  task.cathegory = cathArray[0].name;
                } else task.cathegory = this.defaultCath;
              } else {
                task.cathegory = this.defaultCath;
              }
            });

            this.http.getPriorities().subscribe({
              next: (prior: Priority[]) => {
                this.priorities = prior;
                this.tasks.forEach((task) => {
                  if (
                    this.priorities != undefined &&
                    this.priorities.length != 0
                  ) {
                    let priorArray = this.priorities.filter(
                      (priority) => priority.id.toString() == task.priority
                    );
                    if (priorArray != undefined && priorArray.length != 0) {
                      console.log(priorArray);
                      task.priority = priorArray[0].name;
                    } else task.priority = this.defaultPrior;
                  } else {
                    task.priority = this.defaultPrior;
                  }
                });
              },
              error: (err) => {
                console.log(err);
              },
            });
          },
          error: (err) => {
            console.log(err);
          },
        });
      },
    });
  }
  goToPost(id: number) {
    this.openRedactDIalog(ENTERANIMATIONDURATION, EXITANIMATIONDURATION, id);
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
    this.dataSource = new MatTableDataSource(this.tasks);
    this.getData();
  }

  openRedactDIalog(
    enterAnimationDuration: string,
    exitAnimationDuration: string,
    taskId: number
  ): void {
    const dialogRedact = this.dialog.open(TaskRedactComponent, {
      data: taskId,
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
