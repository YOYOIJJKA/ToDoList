import { TaskHttpServiceService } from '../../Services/task-http-service.service';
import { Task } from '../../Interfaces/task';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TaskRedactComponent } from '../task-redact/task-redact.component';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Cathegory } from '../../Interfaces/cathegory';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatFormField } from '@angular/material/form-field';
import { Priority } from '../../Interfaces/priority';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements AfterViewInit {

  tasks!: Task[];
  cathegories!: Cathegory[];
  priorities!:Priority[];
  defaultCath = 'No Cathegory';
  defaultPrior = 'No priority'

  types = ["Author","Priority","Cathegory","Name"]
  filterForm = new FormGroup({
    param: new FormControl(''),
    typeSelect: new FormControl(''),
});

  constructor
    (
      private http: TaskHttpServiceService,
      private _liveAnnouncer: LiveAnnouncer,
      private dialog: MatDialog,
      private formBuilder: FormBuilder
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
        this.tasks = newTasks
        this.dataSource = new MatTableDataSource(newTasks);
        this.dataSource.sort = this.sort;
      },
      error: (e) => console.error(e),
      complete: () => {
        console.log(this.tasks)
        console.log(this.dataSource)

        this.http.getCathegories().subscribe({
          next:(cath:Cathegory[]) =>
          {
            this.cathegories = cath;
            this.tasks.forEach(task => {
              var cathArray= this.cathegories.filter( (cathegory) => cathegory.id.toString() == task.cathegory );
              console.log("Cath array: " + cathArray)
              if (cathArray != undefined && cathArray.length != 0) {
              task.cathegory=cathArray[0].name;
              }
              else 
              task.cathegory=this.defaultCath;
            });

            this.http.getPriorities().subscribe ({
              next:(prior:Priority[]) =>
              {
                this.priorities = prior;
                this.tasks.forEach(task => {
                  var priorArray= this.priorities.filter( (priority) => priority.id.toString() == task.priority);
                  if (priorArray !=undefined && priorArray.length != 0)
                  {
                  console.log(priorArray)
                  task.priority=priorArray[0].name;
                  }
                  else
                  task.priority = this.defaultPrior
                })
              },
              error: (err) => 
              {console.log(err)}
            });

          },
          error: (err) => {
            console.log(err)
          }
        })
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

  filterTasks() {
    let newTaskList;
    let type;
    var filterParam; 
    type = this.filterForm.get('typeSelect')?.value
    filterParam = this.filterForm.get('param')?.value
    // this.filterForm.get(param) ? this.filterForm.controls.param : ""
    console.log("param string: " + filterParam)
    console.log ("type string: " + type)
    switch (type) {
      case "Author":
        if (this.tasks.filter(
          (task) => task.author.includes(filterParam!))) {
          newTaskList = this.tasks.filter((task) => task.author.includes(filterParam!)) }
        break;
      case "Name":
        if (this.tasks.filter((task) => task.name.includes(filterParam!)))
          newTaskList = this.tasks.filter(
            (task) => task.name.includes(filterParam!))
          break;
      case "Cathegory":
        if (this.tasks.filter((task) => task.cathegory!.includes(filterParam!)))
            newTaskList = this.tasks.filter(
              (task) => task.cathegory!.includes(filterParam!))
            break;
      case "Priority":
        if(this.tasks.filter((task) => task.priority!.includes(filterParam!)))
              newTaskList = this.tasks.filter(
                (task) => task.priority!.includes(filterParam!))
              break;
      default:
        newTaskList = this.tasks
        break;
    }
    this.dataSource = new MatTableDataSource(newTaskList);
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
