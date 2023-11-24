import { TaskHttpServiceService } from '../../Services/task-http-service.service';
import { Task } from '../../Interfaces/task';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TaskRedactComponent } from '../task-redact/task-redact.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements AfterViewInit {

  tasks!: Task[]

  constructor
    (
      private http: TaskHttpServiceService,
      private _liveAnnouncer: LiveAnnouncer,
      private dialog: MatDialog

    ) { }

  ngAfterViewInit() {
    this.getData()
  }

  displayedColumns: string[] = ['id', 'name', 'author', 'cathegory', 'priority', 'date', 'delete'];
  dataSource = new MatTableDataSource(this.tasks);
  @ViewChild(MatSort)
  sort: MatSort = new MatSort;
  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  getData() {
    this.http.getTasks().subscribe({
      next: (newTasks: Task[]) => {
        this.dataSource = new MatTableDataSource(newTasks);
        this.dataSource.sort = this.sort;
      },
      error: (e) => console.error(e),
      complete: () => {
        console.log(this.tasks)
        console.log(this.dataSource)
      }
    })
  }
  goToPost(id: number) {
    this.openRedactDIalog("0ms", "oms", id)
  }
  deleteTask(id: number) {
    console.log(id)
    if (confirm("Are you sure to delete " + id)) {
      this.http.deleteTask(id).subscribe({
        next: () => console.log(id),
        error: (e) => console.log(e),
        complete: () => this.ngAfterViewInit()
      })
    }
  }

  filterTasks(type: string) {
    let newTaskList
    switch (type) {
      case "author":
        newTaskList = this.tasks.filter(
          (task) => task.author.includes(task.author)
        )
        break;

      default:
        newTaskList = this.tasks
        break;
    }
    this.dataSource = new MatTableDataSource(newTaskList);
    this.ngAfterViewInit()
  }

  resetFilter() {
    this.dataSource = new MatTableDataSource(this.tasks)
    this.ngAfterViewInit()
  }

  openRedactDIalog(enterAnimationDuration: string, exitAnimationDuration: string, taskId: number): void {
    const dialogRedact = this.dialog.open(TaskRedactComponent, {
      data: taskId,
      width: "auto",
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }
}
