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

  ngAfterViewInit() {
    this.getData()

  }

  displayedColumns: string[] = ['id', 'name', 'author', 'cathegory', 'priority','date', 'delete'];
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
  getData()
  {
    this.http.getTasks().subscribe({
      next: (newTasks:Task[]) =>
      {
        this.dataSource=new MatTableDataSource (newTasks);
        this.dataSource.sort = this.sort;
      },
      error:(e) => console.error(e),
      complete: () => 
      {
        console.log(this.tasks)
        console.log (this.dataSource)
      }
    })
  }
  goToPost(id:number)
  {
    this.router.navigate(['http://localhost:3000/tasks/',id])
  }
  deleteTask(id:number)
  {
    console.log(id)
    if(confirm("Are you sure to delete "+id))
    {
      this.http.deleteTask(id).subscribe({
        next: () =>console.log(id),
        error: (e) => console.log(e),
        complete: () =>console.log("deleted")
      })
    }
    this.ngAfterViewInit()
  }
}
