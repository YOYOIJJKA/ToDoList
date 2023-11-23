import { Component, Input, Inject} from '@angular/core';
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
    console.log("transfered ID"+this.data)
    this.id=this.data
    this.getCathegories()
    this.getPriorities()
    this.getFormData()
    // id = this.router.getCurrentNavigation()
    this.getTaskData()
  }

  getTaskData() {
    this.http.getTask(this.id).subscribe(
      {
        next: (newTask: Task) => {
          this.task = newTask;
        },
        error: (e) => console.error(e),
        complete: () => {
          if (this.task.id)
          this.id=this.task.id
          let cathegoriesSelectId, prioritySelectId

          if (this.task.priority)
          prioritySelectId = this.priorities.findIndex(x => x.name == this.task.priority)
          if (this.task.cathegory)
          cathegoriesSelectId = this.cathegories.findIndex(x=> x.name == this.task.cathegory)
          // let termTaskForm = {
          //   name: this.task.name ? this.task.name :"",
          //   date: this.task.date ? this.task.date :"",
          //   priority: this.priorities[prioritySelectId].name 
          //   ? this.priorities[prioritySelectId].name :"", 
          //   cathegory: this.cathegories[cathegoriesSelectId].name
          //   ? this.cathegories[cathegoriesSelectId].name :""
          // }
          if (this.task.name)
          this.taskForm.patchValue({name: this.task.name})

          if (this.task.date)
          this.taskForm.patchValue({Date: this.task.date})

          if (prioritySelectId)
          this.taskForm.patchValue({priority: this.priorities[prioritySelectId]})

          if (cathegoriesSelectId)
          this.taskForm.patchValue({cathegory: this.cathegories[cathegoriesSelectId]})
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
    task.author="thats me *edited*"//AUTHORIZED USER CREATE PULL HERE
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
