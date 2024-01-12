import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, inject, OnInit } from '@angular/core';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { TaskHttpServiceService } from '../../Services/task-http-service.service';
import { Cathegory } from '../../Interfaces/cathegory';
import { map } from 'rxjs/operators';
import { Task } from '../../Interfaces/task';

export interface Cath {
  name: string;
}

@Component({
  selector: 'app-cathegories',
  templateUrl: './cathegories.component.html',
  styleUrl: './cathegories.component.scss',
})
export class CathegoriesComponent implements OnInit {
  tasks?: Task[];

  constructor(private http: TaskHttpServiceService) {}

  ngOnInit(): void {
    this.getCathegories();
  }

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  cathegories?: Cathegory[];
  newId?: number;

  announcer = inject(LiveAnnouncer);

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      if (this.cathegories) {
        this.newId = this.cathegories[this.cathegories.length - 1].id + 1;
      } else {
        this.newId = 1;
      }
      if (this.cathegories)
        this.cathegories.push({ name: value, id: this.newId });
      else this.cathegories = [{ name: value, id: this.newId }];
      if (this.cathegories)
        this.http
          .postCathegory(this.cathegories[this.cathegories.length - 1])
          .subscribe({
            next: () =>
              console.log(
                this.cathegories![this.cathegories!.length - 1] + ' posted'
              ),
          });
    }

    event.chipInput.clear();
  }


  ////////////switchmap
  remove(cathegory: Cathegory): void {
    const index = this.cathegories?.indexOf(cathegory);
    if (index || index == 0)
      if (index >= 0) {
        this.cathegories?.splice(index, 1);
        this.http.deleteCathegory(cathegory.id).subscribe({
          error: (e) => console.log(e),
          complete: () => {
            console.log('cathegory deleted ' + cathegory.name);
            this.http
              .getTasks()
              .pipe(
                map((tasks) =>
                  tasks.filter(
                    (task) => task.cathegory == cathegory.id.toString()
                  )
                )
              )
              .subscribe({
                next: (value) => (this.tasks = value),
                error: (e) => console.log(e),
                complete: () => {
                  this.tasks?.forEach((task) => {
                    task.cathegory = task.cathegory?.replace(
                      new RegExp(cathegory.id.toString(), 'g'),
                      ''
                    );
                    this.http
                      .putTask(task)
                      .subscribe(() => console.log(task + ' put'));
                  });
                },
              });
          },
        });
        this.announcer.announce(`Removed ${cathegory}`);
      }
  }

  edit(cathegory: Cathegory, event: MatChipEditedEvent) {
    const value = event.value.trim();
    if (!value) {
      this.remove(cathegory);
      return;
    }
    const index = this.cathegories?.indexOf(cathegory);
    if (index || index == 0)
      if (index >= 0 && this.cathegories) {
        this.cathegories[index].name = value;
      }
    if (this.cathegories && (index || index == 0))
      this.http.putCathegory(this.cathegories[index]).subscribe({
        next: () => console.log(this.cathegories![index]),
        error: (e) => console.log(e),
      });
  }


  ////pipe
  getCathegories() {
    this.http.getCathegories().subscribe({
      next: (newCathegories: Cathegory[]) => {
        console.log(newCathegories);
        this.cathegories = newCathegories;
      },
      error: (e) => console.error(e),
    });
  }
}
