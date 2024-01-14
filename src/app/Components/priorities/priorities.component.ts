import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, inject, OnInit } from '@angular/core';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { TaskHttpServiceService } from '../../Services/task-http-service.service';
import { Priority } from '../../Interfaces/priority';
import { Task } from '../../Interfaces/task';
import { map, switchMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';

@Component({
  selector: 'app-priorities',
  templateUrl: './priorities.component.html',
  styleUrl: './priorities.component.scss',
})
export class PrioritiesComponent implements OnInit {
  tasks?: Task[];

  constructor(private http: TaskHttpServiceService) {}

  ngOnInit(): void {
    this.getPriorities();
  }

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  prioroties?: Priority[];
  newId?: number;

  announcer = inject(LiveAnnouncer);

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      if (this.prioroties && this.prioroties.length != 0) {
        this.newId = this.prioroties[this.prioroties.length - 1].id + 1;
      } else {
        this.newId = 1;
      }
      if (this.prioroties && this.prioroties.length != 0)
        this.prioroties.push({ name: value, id: this.newId });
      else this.prioroties = [{ name: value, id: this.newId }];
      if (this.prioroties)
        this.http
          .postPriority(this.prioroties[this.prioroties.length - 1])
          .subscribe({
            next: () =>
              console.log(
                this.prioroties![this.prioroties!.length - 1] + ' posted'
              ),
          });
    }

    event.chipInput?.clear();
  }

  remove(priority: Priority): void {
    const index = this.prioroties?.indexOf(priority);
    if (index || index == 0)
      if (index >= 0) {
        this.prioroties?.splice(index, 1);
        this.http
          .deletePriority(priority.id)
          .pipe(
            switchMap(() => this.http.getTasks()),
            map((tasks) =>
              tasks.filter((task) => task.priority == priority.id.toString())
            ),
            switchMap((filteredTasks) => {
              this.tasks = filteredTasks;
              let updateTasks$ = this.tasks?.map((task) => {
                task.priority?.replace(
                  new RegExp(priority.id.toString(), 'g'),
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

  edit(priority: Priority, event: MatChipEditedEvent) {
    const value = event.value.trim();

    if (!value) {
      this.remove(priority);
      return;
    }

    const index = this.prioroties?.indexOf(priority);
    if ((index || index == 0) && this.prioroties)
      if (index >= 0) {
        this.prioroties[index].name = value;
      }
    if (this.prioroties && (index || index == 0))
      this.http.putPriority(this.prioroties[index]).subscribe({});
  }

  getPriorities() {
    this.http.getPriorities().subscribe({
      next: (newPriorities: Priority[]) => {
        console.log(newPriorities);
        this.prioroties = newPriorities;
      },
      error: (e) => console.error(e),
    });
  }
}
