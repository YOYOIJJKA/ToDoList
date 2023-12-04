import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
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
    if (this.users) {
      this.users.forEach(user => {
        if ((user.password) == (this.storageService.getPassword()) && (user.login) == (this.storageService.getLogin())) {
          console.log('authorized')
          counter++
        }
      });
      if (counter > 0) {
        this.storageService.setAuth()
        return true;
      }
      else return this.storageService.checkAuth()
    }
    else return this.storageService.checkAuth() 
  }

  getUsers() {
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
    private httpAutorizationService: AutorizationService,
    private router: Router
  ) { }



}
