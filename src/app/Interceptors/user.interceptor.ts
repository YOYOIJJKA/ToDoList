import { HttpInterceptor } from '@angular/common/http';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
} from '@angular/common/http';
import { Observable, switchMap, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { AutorizationService } from '../Services/autorization.service';
import { StorageService } from '../Services/storage.service';
import { USERURL } from '../constants';

@Injectable()
export class userInterceptor implements HttpInterceptor {
  constructor(
    private http: AutorizationService,
    private storage: StorageService
  ) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url != USERURL) {
      let password: string, login: string;
      password = this.storage.getPassword();
      login = this.storage.getLogin();
      return this.http.getUsers().pipe(
        switchMap((users) => {
          if (users) {
            let filteredUsers = users.filter(
              (user) => user.login == login && user.password == password
            );
            if (filteredUsers.length > 0) {
              return next.handle(req);
            } else return of(new HttpResponse({ status: 401 }));
          } else return of(new HttpResponse({ status: 401 }));
        })
      );
    } else return next.handle(req);
  }
}

// private http: AutorizationService,
// private storage: StorageService
