import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { TaskHttpServiceService } from '../../Services/task-http-service.service';
import { Cathegory } from '../../Interfaces/cathegory';
import { map, switchMap } from 'rxjs/operators';
import { Task } from '../../Interfaces/task';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';

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

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      if (this.cathegories && this.cathegories.length != 0) {
        this.newId = this.cathegories[this.cathegories.length - 1].id + 1;
      } else {
        this.newId = 1;
      }
      if (this.cathegories && this.cathegories.length != 0)
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
        this.http
          .deleteCathegory(cathegory.id)
          .pipe(
            switchMap(() => this.http.getTasks()),
            map((tasks) =>
              tasks.filter((task) => task.cathegory == cathegory.id.toString())
            ),
            switchMap((filteredTasks) => {
              this.tasks = filteredTasks;
              let updateTasks$ = this.tasks?.map((task) => {
                task.cathegory?.replace(
                  new RegExp(cathegory.id.toString(), 'g'),
                  ''
                );
                return this.http.putTask(task);
              });
              return forkJoin(updateTasks$ || []);
            })
          )
          .subscribe();
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
