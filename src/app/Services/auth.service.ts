import { Injectable, inject } from '@angular/core';
import { StorageService } from './storage.service';
import { User } from '../Interfaces/user';
import { AutorizationService } from './autorization.service';
import { CanActivateFn } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  users: User[] | undefined; //TODO: никаких non-null assertion, обход предупреждений транспилятора != качественное введение проверок

  constructor(
    private storageService: StorageService,
    private httpAutorizationService: AutorizationService
  ) { }

  canActivate(): boolean {
    console.log('USERS ARRAY = ' + this.users)
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
  
  //   getUsers() {
  //     this.httpAutorizationService.getUsers().subscribe({
  //       next: (users: User[]) => {
  //         this.users = users;
  //       },
  //       error: (e) => {
  //         console.log(e);
  //       },
  //     });
  //   }


}

export const AuthGuard: CanActivateFn = (): boolean => {
  return inject(AuthService).canActivate();
}
