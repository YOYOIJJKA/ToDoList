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
deleteTask (id:number)
{
  this.http.delete<Task>('http://localhost:3000/tasks/'+id)
}
}
