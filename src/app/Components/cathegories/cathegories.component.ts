import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, inject, OnInit} from '@angular/core';
import {MatChipEditedEvent, MatChipInputEvent} from '@angular/material/chips';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { TaskHttpServiceService } from '../../Services/task-http-service.service';
import { Cathegory } from '../../Interfaces/cathegory';


export interface Cath 
{
  name:string
}

@Component({
  selector: 'app-cathegories',
  templateUrl: './cathegories.component.html',
  styleUrl: './cathegories.component.scss'
})

export class CathegoriesComponent implements OnInit {

  constructor
  (
    private http: TaskHttpServiceService
  )
  {}

  ngOnInit(): void {
    this.getCathegories();
  }

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  cathegories!: Cathegory[];
  newId!: number 

  announcer = inject(LiveAnnouncer);

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Add our fruit
    if (value) {

      if (this.cathegories) {
      this.newId = this.cathegories[this.cathegories.length-1].id+1;
      }
      else
      {
        this.newId = 1;
      }
      this.cathegories.push({name: value, id:this.newId});
     this.http.postCathegory(this.cathegories[this.cathegories.length-1]).subscribe
     (
      {
        next: () => console.log(this.cathegories[this.cathegories.length-1]+" posted")
      }
     )
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(cathegory: Cathegory): void {
    const index = this.cathegories.indexOf(cathegory);

    if (index >= 0) {
      this.cathegories.splice(index, 1);
      this.http.deleteCathegory(cathegory.id).subscribe
      (
        {
          error: (e) => console.log(e),
          complete: () => console.log("cathegory deleted " +cathegory.name)
        }
      )
      this.announcer.announce(`Removed ${cathegory}`);
    }
  }

  edit(cathegory: Cathegory, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove fruit if it no longer has a name
    if (!value) {
      this.remove(cathegory);
      return;
    }

    // Edit existing fruit
    const index = this.cathegories.indexOf(cathegory);
    if (index >= 0) {
      this.cathegories[index].name = value;
    }
    this.http.putCathegory(this.cathegories[index]).subscribe
    (
      {
        next:()=> console.log(this.cathegories[index]),
        error: (e) => console.log(e)
      }
    )
  }

  getCathegories()
  {
    this.http.getCathegories().subscribe
    ({
      next: (newCathegories: Cathegory[]) => {
        console.log(newCathegories)
        this.cathegories=newCathegories
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
