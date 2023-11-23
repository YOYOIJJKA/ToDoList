import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, inject, OnInit} from '@angular/core';
import {MatChipEditedEvent, MatChipInputEvent, MatChipGrid} from '@angular/material/chips';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { TaskHttpServiceService } from '../../Services/task-http-service.service';
import { Priority } from '../../Interfaces/priority';

@Component({
  selector: 'app-priorities',
  templateUrl: './priorities.component.html',
  styleUrl: './priorities.component.scss'
})
export class PrioritiesComponent implements OnInit {

  constructor
  (
    private http: TaskHttpServiceService
  )
  {}

  ngOnInit(): void {
    this.getPriorities();
  }

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  prioroties!: Priority[];
  newId!: number 

  announcer = inject(LiveAnnouncer);

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Add our fruit
    if (value) {

      if (this.prioroties) {
      this.newId = this.prioroties[this.prioroties.length-1].id+1;
      }
      else
      {
        this.newId = 1;
      }
      this.prioroties.push({name: value, id:this.newId});
     this.http.postCathegory(this.prioroties[this.prioroties.length-1]).subscribe
     (
      {
        next: () => console.log(this.prioroties[this.prioroties.length-1]+" posted")
      }
     )
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(priority: Priority): void {
    const index = this.prioroties.indexOf(priority);

    if (index >= 0) {
      this.prioroties.splice(index, 1);
      this.http.deletePriority(priority.id).subscribe
      (
        {
          error: (e) => console.log(e),
          complete: () => console.log("cathegory deleted " +priority.name)
        }
      )
      this.announcer.announce(`Removed ${priority}`);
    }
  }

  edit(priority: Priority, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove fruit if it no longer has a name
    if (!value) {
      this.remove(priority);
      return;
    }

    // Edit existing fruit
    const index = this.prioroties.indexOf(priority);
    if (index >= 0) {
      this.prioroties[index].name = value;
    }
    this.http.putPriority(this.prioroties[index]).subscribe
    (
      {
        next:()=> console.log(this.prioroties[index]),
        error: (e) => console.log(e)
      }
    )
  }

  getPriorities()
  {
    this.http.getPriorities().subscribe
    ({
      next: (newPriorities: Priority[]) => {
        console.log(newPriorities)
        this.prioroties=newPriorities
      },
      error: (e) => console.error(e),
      // complete: ()=>
      // {
      //   this.arrayCathegories.forEach(cathegoriesEl => {
      //     this.cathegories[cathegoriesEl.id]
      //   });
      // }
    }
    )
  }

}
