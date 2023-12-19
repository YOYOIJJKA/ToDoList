import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task } from '../Interfaces/task';
import { Observable } from 'rxjs';
import { Priority } from '../Interfaces/priority';
import { Cathegory } from '../Interfaces/cathegory';
import { PrioritiesURL, TasksURL, CathegoriesURL } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class TaskHttpServiceService {
  constructor(private http: HttpClient) { }

  postTask(task: Task): Observable<Task> {
    return this.http.post<Task>(TasksURL, task);
  }
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(TasksURL);
  }
  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(TasksURL + id);
  }
  deleteTask(id: number): Observable<Task> {
    return this.http.delete<Task>(TasksURL + id);
  }
  putTask(task: Task): Observable<Task> {
    return this.http.put<Task>(TasksURL + task.id, task);
  }
  //cathegories
  postCathegory(cathegory: Cathegory): Observable<Cathegory> {
    return this.http.post<Cathegory>(
      CathegoriesURL,
      cathegory
    );
  }
  getCathegories(): Observable<Cathegory[]> {
    return this.http.get<Cathegory[]>(CathegoriesURL);
  }
  deleteCathegory(id: number): Observable<Cathegory> {
    return this.http.delete<Cathegory>(
      CathegoriesURL + id
    );
  }
  putCathegory(cathegory: Cathegory): Observable<Cathegory> {
    return this.http.put<Cathegory>(
      CathegoriesURL + cathegory.id,
      cathegory
    );
  }
  //priorities
  postPriority(priority: Priority): Observable<Priority> {
    return this.http.post<Priority>(
      PrioritiesURL,
      priority
    );
  }
  getPriorities(): Observable<Priority[]> {
    return this.http.get<Priority[]>(PrioritiesURL);
  }
  deletePriority(id: number): Observable<Priority> {
    return this.http.delete<Priority>(PrioritiesURL + id);
  }
  putPriority(priority: Priority): Observable<Priority> {
    return this.http.put<Priority>(
      PrioritiesURL + priority.id,
      priority
    );
  }
}
