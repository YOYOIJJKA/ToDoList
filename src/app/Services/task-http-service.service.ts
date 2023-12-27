import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task } from '../Interfaces/task';
import { Observable } from 'rxjs';
import { Priority } from '../Interfaces/priority';
import { Cathegory } from '../Interfaces/cathegory';
import { PRIORITIESURL, TASKURL, CATHEGORIESURL } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class TaskHttpServiceService {
  constructor(private http: HttpClient) {}

  postTask(task: Task): Observable<Task> {
    return this.http.post<Task>(TASKURL, task);
  }
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(TASKURL);
  }
  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(TASKURL + id);
  }
  deleteTask(id: number): Observable<Task> {
    return this.http.delete<Task>(TASKURL + id);
  }
  putTask(task: Task): Observable<Task> {
    return this.http.put<Task>(TASKURL + task.id, task);
  }
  //cathegories
  postCathegory(cathegory: Cathegory): Observable<Cathegory> {
    return this.http.post<Cathegory>(CATHEGORIESURL, cathegory);
  }
  getCathegories(): Observable<Cathegory[]> {
    return this.http.get<Cathegory[]>(CATHEGORIESURL);
  }
  deleteCathegory(id: number): Observable<Cathegory> {
    return this.http.delete<Cathegory>(CATHEGORIESURL + id);
  }
  putCathegory(cathegory: Cathegory): Observable<Cathegory> {
    return this.http.put<Cathegory>(CATHEGORIESURL + cathegory.id, cathegory);
  }
  //priorities
  postPriority(priority: Priority): Observable<Priority> {
    return this.http.post<Priority>(PRIORITIESURL, priority);
  }
  getPriorities(): Observable<Priority[]> {
    return this.http.get<Priority[]>(PRIORITIESURL);
  }
  deletePriority(id: number): Observable<Priority> {
    return this.http.delete<Priority>(PRIORITIESURL + id);
  }
  putPriority(priority: Priority): Observable<Priority> {
    return this.http.put<Priority>(PRIORITIESURL + priority.id, priority);
  }
}
