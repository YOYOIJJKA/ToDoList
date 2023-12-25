import { Component } from '@angular/core';
import { TaskComponent } from '../task/task.component';
import { Task } from '../../Interfaces/task';
import { forkJoin, tap } from 'rxjs';

@Component({
  selector: 'app-task-redact',
  templateUrl: './task-redact.component.html',
  styleUrl: './task-redact.component.scss'
})
export class TaskRedactComponent extends TaskComponent {
  task?: Task;
  cathegoryId?: number;
  priorityId?: number;
  id = 0;


  override ngOnInit(): void {
    console.log("transfered ID" + this.data)
    this.getData()
  }

  getData() {
    const subsTask = this.http.getTask(this.id)
    // .subscribe(
    //   {
    //     next: (newTask: Task) => {
    //       this.task = newTask;
    //       this.getCathegories();
    //     },
    //     error: (e) => console.error(e),
    //     complete: () => {
    //       this.getTaskData()
    //      } 
    //   })

    const subsCath = this.http.getCathegories()
    // .subscribe(
    //   {
    //     next: (newCathegories: Cathegory[]) => {
    //       this.cathegories = newCathegories
    //     },
    //     error: (e) => console.error(e),
    //     complete: () => { }
    //   })

    const subsPrior = this.http.getPriorities()
    // .subscribe(
    //   {
    //     next: (newPriority: Priority[]) => {
    //       this.priorities = newPriority
    //     },
    //     error: (e) => console.error(e),
    //     complete: () => {}
    //   })

    const fork = forkJoin([subsCath, subsPrior, subsTask]).pipe(
      tap(([res1, res2, res3]) => {
        this.cathegories = res1;
        this.priorities = res2;
        this.task = res3;
      })
    ).subscribe({
      complete: () => {
        console.log("everything pulled")
        this.getTaskData()
        fork.unsubscribe()
      }
    })
  }
  getTaskData() {
    if (this.task)
      if (this.task.id)
        this.id = this.task.id

    let cathegoriesSelectId, prioritySelectId
    let termCath, termPrior: String | null

    if (this.task)
      if (this.task.priority && this.priorities) {
        var priorArray = this.priorities.filter((priority) => priority.id.toString() == this.task?.priority);
        console.log("FilteredArray: " + priorArray[0])
        if (priorArray != undefined) {
          console.log("workingPriorArrayIs " + priorArray[0].name)
          termPrior = priorArray[0].name;
        }
        else {
          console.log("False")
          termPrior = null
        }
      }
    if (this.cathegories && this.task)
      if (this.task.cathegory) {
        var priorArray = this.cathegories.filter((cathegory) => cathegory.id.toString() == this.task?.cathegory);
        if (priorArray != undefined && priorArray.length != 0) {
          console.log("true")
          console.log(priorArray)
          termCath = priorArray[0].name;
        }
        else
          termCath = null
      }

    console.log("Priority Before ID " + termPrior!)
    console.log("Cathegory Before ID " + termCath)

    // if (termPrior! && this.priorities.findIndex(x => x.name == termPrior))

    prioritySelectId = this.priorities?.findIndex(x => x.name == termPrior)
    console.log(prioritySelectId)
    //   if (termCath && this.cathegories.findIndex(x => x.name == termCath!))
    cathegoriesSelectId = this.cathegories?.findIndex(x => x.name == termCath!)
    // let termTaskForm = {
    //   name: this.task.name ? this.task.name :"",
    //   date: this.task.date ? this.task.date :"",
    //   priority: this.priorities[prioritySelectId].name 
    //   ? this.priorities[prioritySelectId].name :"", 
    //   cathegory: this.cathegories[cathegoriesSelectId].name
    //   ? this.cathegories[cathegoriesSelectId].name :""
    // }
    if (this.task) {
      if (this.task.name) {
        console.log("Try to patch name")
        this.taskForm.patchValue({ name: this.task.name })
        console.log("NAME PATCHED")
      }
      if (this.task.date)
        this.taskForm.patchValue({ date: this.task.date })

      if ((prioritySelectId == 0 || prioritySelectId) && prioritySelectId != -1 && this.priorities) {
        console.log("TRY TO PATCH VALUE")
        this.taskForm.patchValue({ priority: this.priorities[prioritySelectId].id.toString() })
        console.log("Priority Patched")
      }

      if ((cathegoriesSelectId || cathegoriesSelectId == 0) && cathegoriesSelectId != -1 && this.cathegories)
        this.taskForm.patchValue({ cathegory: this.cathegories[cathegoriesSelectId].id.toString() })
    }
  }
  putTask() {
    if (this.taskForm.valid) {
      const task: Task = this.taskForm.value;
      task.id = this.id;
      task.author = this.storage.getLogin()
      var putTaskSubscribe = this.http.putTask(task).subscribe(
        {
          error: (e) => console.error(e),
          complete: () => {
            console.log("posted");
            putTaskSubscribe.unsubscribe()
          }
        }
      )
      this.closeModal();

    }
    else { console.log("invalid") }
  }
}
