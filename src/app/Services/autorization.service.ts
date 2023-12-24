import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../Interfaces/user';
import { Observable } from 'rxjs';
import { USERURL } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class AutorizationService {

  constructor(
    private http:HttpClient
  ) { }
  postUser(user:User):Observable<User>
  {
    return this.http.post<User>(USERURL, user)
  }
  getUsers():Observable<User[]>
  {
    return this.http.get<User[]>(USERURL);
  }
}
