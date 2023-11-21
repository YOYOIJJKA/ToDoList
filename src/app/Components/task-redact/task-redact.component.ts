import { Component } from '@angular/core';
import { TaskComponent } from '../task/task.component';
import { Task } from '../../Interfaces/task';

@Component({
  selector: 'app-task-redact',
  templateUrl: './task-redact.component.html',
  styleUrl: './task-redact.component.scss'
})
export class TaskRedactComponent extends TaskComponent {
  task!: Task;
  cathegoryId!:number;
  priorityId!:number;
  id!:number;

  override ngOnInit(): void {
    this.getFormData()
    // id = this.router.getCurrentNavigation()
    this.getTaskData(13)
  }

  getTaskData(id: number) {
    this.http.getTask(id).subscribe(
      {
        next: (newTask: Task) => {
          this.task = newTask;
        },
        error: (e) => console.error(e),
        complete: () => {
          if (this.task.id)
          this.id=this.task.id
          this.taskForm.patchValue(
            {
              name: this.task.name,
              date: this.task.date,
              priority: this.priorities[this.priorities.findIndex(x => x === this.task.priority)], 
              cathegory: this.cathegories[this.cathegories.findIndex(x => x === this.task.cathegory)]
            }
          )
        }
      }
    )
  }
  putTask ()
  {
    if (this.taskForm.valid)
     {
    const task: Task = this.taskForm.value;
    task.id = this.id;
    task.author="thats me"//AUTHORIZED USER CREATE PULL HERE
    this.http.putTask(task).subscribe(
      {
        error: (e) => console.error(e),
        complete: () => console.log("posted")
      }
    )
    this.router.navigate([""]) ///CLOSE MODAL
  }
  else
  {console.log("invalid")}
}
}
