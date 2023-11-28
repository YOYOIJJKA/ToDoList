import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { User } from '../Interfaces/user';
import { AutorizationService } from './autorization.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {
  users!: User[];
  
  canActivate(): boolean {
    var counter = 0;
    this.users.forEach(user => {
      if ((user.password) == (this.storageService.getPassword()) && (user.login) == (this.storageService.getLogin())) {
        console.log('authorized')
        counter++
      }
    });
    console.log('final ' + counter)
    if (counter > 0) {
      console.log(counter)
      return true;
    }
    else {
      console.log(counter)
      return false;
    }
  }

  async getUsers() {
   var subs = this.httpAutorizationService.getUsers().subscribe({
       next: (users: User[]) => {
        this.users = users;
      },
      error: (e) => {
        console.log(e);
      }
    })
  }


  constructor(
    private storageService: StorageService,
    private httpAutorizationService: AutorizationService
  ) { }



}
