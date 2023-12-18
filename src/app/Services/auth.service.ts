import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { User } from '../Interfaces/user';
import { AutorizationService } from './autorization.service';

@Injectable({
  providedIn: 'root',
})
//TODO: переделать на новый стандарт использования CanActivate
export class AuthService implements CanActivate {
  users!: User[]; //TODO: никаких non-null assertion, обход предупреждений транспилятора != качественное введение проверок

  canActivate(): boolean {
    var counter = 0; //TODO: почему выбран var? Уместнее использовать переменные с временной мёртвой зоной let/const
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

  getUsers() {
    // TODO: использование подписок внутри сервисов - плохая практика, нужно стараться выстраивать как можно более длинную трубу, желательно чтобы подписка происходила в шаблоне через async pipe
    // https://blog.brecht.io/rxjs-best-practices-in-angular/
    // https://angularindepth.com/posts/1279/rxjs-in-angular-when-to-subscribe-rarely
    // Также инициализирована неиспользуемая переменная
    var subs = this.httpAutorizationService.getUsers().subscribe({
      next: (users: User[]) => {
        this.users = users;
      },
      error: (e) => {
        console.log(e);
      },
    });
  }

  constructor(
    private storageService: StorageService,
    private httpAutorizationService: AutorizationService,
    private router: Router //TODO: пустой инжект
  ) {}
}
