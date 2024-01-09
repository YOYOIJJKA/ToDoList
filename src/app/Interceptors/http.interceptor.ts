import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { EMPTY, Observable, of } from 'rxjs';
import { Cathegory } from '../Interfaces/cathegory';
import { Task } from '../Interfaces/task';
import { Priority } from '../Interfaces/priority';

// export const httpInterceptor: HttpInterceptorFn = (req, next) => {
//   return next(req);
// };

export class httpInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let url = req.url.split('/');
    let id = url[url.length - 1];
    let term: Task[] | Cathegory[] | Priority[];
    let item: Task | Cathegory | Priority;
    let newUrl;
    let newBody;

    //// Эта часть кода - бекенд на фронтенде, он проверяет метод запроса, затем проверяет наличие ID в запросе, и после этого возвращает
    //// либо таблицу всех элементов, если ID не было, либо элемент, чей ID = ID запроса
    if (req.method == 'GET') {
      console.log('id = ' + id);
      if (!Number.isNaN(Number(id)) && id != '') {
        /// Если есть ID, то берем всю таблицу и ищем в ней нужный элемент
        console.log('THERE IS ID IN URL');
        newUrl = req.url.toString();
        newUrl.replace(id, '');
        console.log('NEW URL = ' + newUrl);
        if (localStorage.getItem(req.url)) {
          term = JSON.parse(localStorage.getItem(req.url)!);
          term.forEach((element) => {
            if (element.id == Number(id)) item = element;
            return of(new HttpResponse({ status: 200, body: item }));
          });
          //// Нет таблицы - возвращаем пустой Obs
        } else {
          return EMPTY;
        }
      } else {
        console.log('NO ID FOUND');
        console.log(req.url);
        /// Если нет ID, то просто берем всю таблицу и отправляем её. Если таблицы нет, то пустой Obs.
        if (localStorage.getItem(req.url)) {
          console.log('I GOT IT');
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
      newBody = req.body;
      newUrl = req.url;
      if (url.indexOf('tasks') != -1) this.postTaskWithId(newUrl, newBody);
      return of(new HttpResponse({ status: 200 }));
    }
    if (req.method == 'PUT') {
      console.log('TRYINT TO PUT');
      newBody = req.body;
      newUrl = req.url;
      newUrl.replace(id, '');
      if (url.indexOf('tasks') != -1)
        this.putTaskById(newUrl, newBody, Number(id));
      return EMPTY;
    }
    return next.handle(req);
  }

  ////Этот метод запрашивает таблицу и смотрит ID последнего элемента, затем прибавляет к нему 1 и возвращает значение. Если нет таблицы, то возвращает 0

  generateId(url: string) {
    let term: Task[] | Cathegory[] | Priority[];
    let item: Task | Cathegory | Priority;
    if (localStorage.getItem(url)) {
      term = JSON.parse(localStorage.getItem(url)!);
      item = term[term.length - 1];
      if (item.id || item.id == 0) return item.id + 1;
      else return 0;
    } else return 0;
  }

  postTaskWithId(url: string, item: Task) {
    item.id = this.generateId(url);
    let term: Task[];
    if (localStorage.getItem(url)) {
      term = JSON.parse(localStorage.getItem(url)!);
      term.push(item);
      localStorage.setItem(url, JSON.stringify(term));
    } else {
      term = [item];
      localStorage.setItem(url, JSON.stringify(term));
    }
  }

  putTaskById(url: string, item: Task, id: number) {
    let term: Task[] | Cathegory[] | Priority[];
    if (localStorage.getItem(url)) {
      term = JSON.parse(localStorage.getItem(url)!);
      term.forEach((element) => {
        if (element.id == id) element = item;
      });
      localStorage.setItem(url, JSON.stringify(term));
    }
  }
}
