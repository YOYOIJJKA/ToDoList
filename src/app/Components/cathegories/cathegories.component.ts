import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, inject} from '@angular/core';
import {MatChipEditedEvent, MatChipInputEvent, MatChipGrid} from '@angular/material/chips';
import {LiveAnnouncer} from '@angular/cdk/a11y';


export interface Cath 
{
  name:string
}

@Component({
  selector: 'app-cathegories',
  templateUrl: './cathegories.component.html',
  styleUrl: './cathegories.component.scss'
})

export class CathegoriesComponent {
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  cathegories: Cath[] = [{name: 'Lemon'}, {name: 'Lime'}, {name: 'Apple'}];

  announcer = inject(LiveAnnouncer);

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Add our fruit
    if (value) {
      this.cathegories.push({name: value});
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(cathegory: Cath): void {
    const index = this.cathegories.indexOf(cathegory);

    if (index >= 0) {
      this.cathegories.splice(index, 1);

      this.announcer.announce(`Removed ${cathegory}`);
    }
  }

  edit(cathegory: Cath, event: MatChipEditedEvent) {
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
  }
  
}
