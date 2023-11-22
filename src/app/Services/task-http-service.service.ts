import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task } from '../Interfaces/task';
import {Observable } from "rxjs";
import { Priority } from '../Interfaces/priority';
import { Cathegory } from '../Interfaces/cathegory';

@Injectable({
  providedIn: 'root'
})
export class TaskHttpServiceService {

  constructor(    
    private http:HttpClient
    ) 
    {  }
postTask (task:Task):Observable<Task>
{
  return this.http.post<Task>('http://localhost:3000/tasks/', task)
}
getTasks ():Observable<Task[]>
{
  return this.http.get<Task[]>('http://localhost:3000/tasks/')
}
getTask (id:number):Observable<Task>
{
  return this.http.get<Task>('http://localhost:3000/tasks/'+id)
}
deleteTask (id:number):Observable<Task>
{
  return this.http.delete<Task>('http://localhost:3000/tasks/'+id)
}
putTask (task:Task):Observable<Task>
{
  return this.http.put<Task>('http://localhost:3000/tasks/'+task.id, task)
}
//cathegories
postCathegory (cathegory:Cathegory):Observable<Cathegory>
{
  return this.http.post<Cathegory>('http://localhost:3000/cathegories/',cathegory)
}
getCathegories ():Observable<Cathegory[]>
{
  return this.http.get<Cathegory[]>('http://localhost:3000/cathegories/')
}
deleteCathegory (id:number):Observable<Cathegory>
{
  return this.http.delete<Cathegory>('http://localhost:3000/cathegories/'+id)
}
putCathegory (cathegory:Cathegory):Observable<Cathegory>
{
  return this.http.put<Cathegory>('http://localhost:3000/cathegories/'+cathegory.id, cathegory)
}
//priorities
postPriority (priority:Priority):Observable<Priority>
{
  return this.http.post<Priority>('http://localhost:3000/priority/',priority)
}
getPriorities ():Observable<Priority[]>
{
  return this.http.get<Priority[]>('http://localhost:3000/priority/')
}
deletePriority (id:number):Observable<Priority>
{
  return this.http.delete<Priority>('http://localhost:3000/priority/'+id)
}

}
