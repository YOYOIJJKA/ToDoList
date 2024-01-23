import { Injectable, inject } from '@angular/core';
import { StorageService } from './storage.service';
import { User } from '../Interfaces/user';
import { CanActivateFn } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  users?: User[];

  constructor(private storageService: StorageService) {}

  public setUsers(users: User[] | undefined): void {
    this.users = users;
  }
/// интерсепторы проверяют при каждом запросе юзера
  canActivate(): boolean {
    console.log('USERS ARRAY = ' + this.users);
    let counter = 0;
    if (this.users) {
      this.users.forEach((user) => {
        if (
          user.password == this.storageService.getPassword() &&
          user.login == this.storageService.getLogin()
        ) {
          console.log('authorized');
          counter++;
        }
      });
      if (counter > 0) {
        this.storageService.setAuth();
        return true;
      } else return this.storageService.checkAuth();
    } else return this.storageService.checkAuth();
  }
}

export const AuthGuard: CanActivateFn = (): boolean => {
  return inject(AuthGuardService).canActivate();
};
