import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../Interfaces/user';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AutorizationService {

  constructor(
    private http:HttpClient
  ) { }
  postUser(user:User):Observable<User>
  {
    return this.http.post<User>(`http://localhost:3000/users/`, user)
  }
  getUsers():Observable<User[]>
  {
    return this.http.get<User[]>(`http://localhost:3000/users/`);
  }
}
