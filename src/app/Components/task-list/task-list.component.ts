import { TaskHttpServiceService } from '../../Services/task-http-service.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Task } from '../../Interfaces/task';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements AfterViewInit {
  

  tasks!:Task[]


  constructor
  (
    private http: TaskHttpServiceService,
    private formBuilder: FormBuilder,
    private router: Router,
    private _liveAnnouncer: LiveAnnouncer
     
  )
  { }

    displayedColumns: string[] = ['id', 'name', 'author', 'cathegory', 'priority','date'];
    dataSource = new MatTableDataSource(this.tasks);
    @ViewChild(MatSort) 
  sort: MatSort = new MatSort;
  
    ngAfterViewInit() {
      this.getData()
      this.dataSource.sort = this.sort;
    }
  
    /** Announce the change in sort state for assistive technology. */
    announceSortChange(sortState: Sort) {
      if (sortState.direction) {
        this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
      } else {
        this._liveAnnouncer.announce('Sorting cleared');
      }
    }


  getData()
  {
    this.http.getTasks().subscribe({
      next: (newTasks:Task[]) =>
      {
        this.tasks=newTasks;
      },
      error:(e) => console.error(e),
      complete: () => 
      {
        console.log(this.tasks)
      }
    })
  }

}
