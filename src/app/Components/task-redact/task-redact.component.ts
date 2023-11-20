import { Component } from '@angular/core';
import { TaskComponent } from '../task/task.component';
import { Task } from '../../Interfaces/task';

@Component({
  selector: 'app-task-redact',
  templateUrl: './task-redact.component.html',
  styleUrl: './task-redact.component.scss'
})
export class TaskRedactComponent extends TaskComponent {
  task!:Task;
  
  override ngOnInit(): void {
    this.getFormData()
  // id = this.router.getCurrentNavigation()
this.getTaskData(2)
  }
  getTaskData(id:number)
  {
  this.http.getTask(id).subscribe(
  {
    next: (newTask:Task) =>
    {
      this.task=newTask;
    },
    error:(e) => console.error(e),
    complete: () => 
    {
      this.taskForm.patchValue(
        {
          name: this.task.name,
          date: this.task.date,
          priority: this.task.priority, //NOT WORKING
          cathegory: this.task.cathegory
          
          //THIS ONE WORKING
          // set_country="";
 
          // setCountry() {
          //   const country = this.countries.find(el => el.name === this.set_country);
          //   if (country) {
          //     this.contactForm.get("country").patchValue(country.id);
          //   }
          // }

        }
      )
    }
  }
 )
  }
}
