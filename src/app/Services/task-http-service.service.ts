import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task } from '../Interfaces/task';
import {Observable } from "rxjs"

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
//cathegories
postCathegory (cathegory:string):Observable<string>
{
  return this.http.post<string>('http://localhost:3000/cathegories/',cathegory)
}
getCathegories ():Observable<string[]>
{
  return this.http.get<string[]>('http://localhost:3000/cathegories/')
}
deleteCathegory (id:number):Observable<string>
{
  return this.http.delete<string>('http://localhost:3000/cathegories/'+id)
}
//priorities
postPriority (priority:string):Observable<string>
{
  return this.http.post<string>('http://localhost:3000/priority/',priority)
}
getPriorities ():Observable<string[]>
{
  return this.http.get<string[]>('http://localhost:3000/priority/')
}
deletePriority (id:number):Observable<string>
{
  return this.http.delete<string>('http://localhost:3000/priority/'+id)
}
}
