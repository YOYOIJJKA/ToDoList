import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Cathegory } from '../Interfaces/cathegory';
import { Task } from '../Interfaces/task';
import { Priority } from '../Interfaces/priority';
import { User } from '../Interfaces/user';
import { INTERCEPTORS, URLS } from '../constants';

// export const httpInterceptor: HttpInterceptorFn = (req, next) => {
//   return next(req);
// };

export class httpInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    ////////////В файле с константами есть INTERCEPTORS, если true, то запускает симуляцию бекенда, если false, то не перехватывает запросы
    if (INTERCEPTORS) {
      let url = req.url.split('/');
      let id = url[url.length - 1];
      let term: Task[] | Cathegory[] | Priority[] | User[];
      let item: Task | Cathegory | Priority | User;
      let newUrl = req.url;
      let newBody = req.body;

      //// Эта часть кода - бекенд на фронтенде, он проверяет метод запроса, затем проверяет наличие ID в запросе, и после этого возвращает
      //// либо таблицу всех элементов, если ID не было, либо элемент, чей ID = ID запроса
      if (req.method == 'GET') {
        if (!Number.isNaN(Number(id)) && id != '') {
          /// Если есть ID, то берем всю таблицу и ищем в ней нужный элемент
          console.log('THERE IS ID IN URL');
          newUrl = newUrl.slice(0, -id.length);
          if (localStorage.getItem(req.url)) {
            term = JSON.parse(localStorage.getItem(req.url)!);
            term.forEach((element) => {
              if (element.id == Number(id)) item = element;
              return of(new HttpResponse({ status: 200, body: item }));
            });
            //// Нет таблицы - возвращаем пустой Obs
          } else {
            return of(new HttpResponse({ status: 200 }));
          }
        } else {
          console.log('NO ID FOUND');
          /// Если нет ID, то просто берем всю таблицу и отправляем её. Если таблицы нет, то пустой Obs.
          if (localStorage.getItem(req.url)) {
            item = JSON.parse(localStorage.getItem(req.url)!);
            return of(new HttpResponse({ status: 200, body: item }));
          } else {
            return of(new HttpResponse({ status: 200 }));
          }
        }
      }
      ///Эта часть обрабатывает пост запрос
      if (req.method == 'POST') {
        console.log('TRYING TO POST');
        if (url.indexOf(URLS.task) != -1)
          this.postWithId(newUrl, newBody as Task);
        if (url.indexOf(URLS.user) != -1)
          this.postWithId(newUrl, newBody as User);
        if (url.indexOf(URLS.priority) != -1)
          this.postWithId(newUrl, newBody as Priority);
        if (url.indexOf(URLS.cathegory) != -1)
          this.postWithId(newUrl, newBody as Cathegory);

        return of(new HttpResponse({ status: 200 }));
      }
      //////Эта часть обрабатывает PUT запрос
      if (req.method == 'PUT') {
        newUrl = newUrl.slice(0, -id.length);
        console.log('TRYING TO PUT');
        if (url.indexOf(URLS.task) != -1)
          this.putById(newUrl, newBody as Task, Number(id));

        if (url.indexOf(URLS.cathegory) != -1)
          this.putById(newUrl, newBody as Cathegory, Number(id));

        if (url.indexOf(URLS.priority) != -1)
          this.putById(newUrl, newBody as Priority, Number(id));

        return of(new HttpResponse({ status: 200 }));
      }
      //////////////Эта часть кода обрабатывает метод DELETE
      if (req.method == 'DELETE') {
        console.log('TRY TO DELETE');
        newUrl = newUrl.slice(0, -id.length);
        this.deleteById(newUrl, Number(id));
        return of(new HttpResponse({ status: 200 }));
      }
    }
    return next.handle(req);
  }

  deleteById(url: string, id: number) {
    let term: any[];
    if (localStorage.getItem(url)) {
      term = JSON.parse(localStorage.getItem(url)!);
      term = term.filter((element) => element.id != id);
      localStorage.setItem(url, JSON.stringify(term));
    }
  }

  ////Этот метод запрашивает таблицу и смотрит ID последнего элемента, затем прибавляет к нему 1 и возвращает значение. Если нет таблицы, то возвращает 0

  generateId(url: string) {
    let term: Task[] | Cathegory[] | Priority[] | User[];
    let item: Task | Cathegory | Priority | User;
    if (localStorage.getItem(url)) {
      term = JSON.parse(localStorage.getItem(url)!);
      item = term[term.length - 1];
      if (item.id || item.id == 0) return item.id + 1;
      else return 0;
    } else return 0;
  }

  postWithId(url: string, item: Task | User | Priority | Cathegory) {
    item.id = this.generateId(url);
    let term: any;
    if (localStorage.getItem(url)) {
      term = JSON.parse(localStorage.getItem(url)!);
      term.push(item);
      localStorage.setItem(url, JSON.stringify(term));
    } else {
      term = [item];
      localStorage.setItem(url, JSON.stringify(term));
    }
  }

  ///// PUT МЕТОД
  putById(url: string, item: Task | Cathegory | Priority, id: number) {
    let term: any[];
    if (localStorage.getItem(url)) {
      term = JSON.parse(localStorage.getItem(url)!);
      term.forEach((element) => {
        if (element.id == id) element.name = item.name;
      });
      localStorage.setItem(url, JSON.stringify(term));
    }
  }
}
