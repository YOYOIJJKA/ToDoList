import { Injectable, inject } from '@angular/core';
import { StorageService } from './storage.service';
import { User } from '../Interfaces/user';
import { CanActivateFn } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  users?: User[];

  constructor(private storageService: StorageService) {}

  public getUsers(users: User[] | undefined): void {
    this.users = users;
  }

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

  //     // TODO: использование подписок внутри сервисов - плохая практика, нужно стараться выстраивать как можно более
  //     // длинную трубу, желательно чтобы подписка происходила в шаблоне через async pipe
  //     // https://blog.brecht.io/rxjs-best-practices-in-angular/
  //     // https://angularindepth.com/posts/1279/rxjs-in-angular-when-to-subscribe-rarely
}

export const AuthGuard: CanActivateFn = (): boolean => {
  return inject(AuthService).canActivate();
};
