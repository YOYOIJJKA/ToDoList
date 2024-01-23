import { FormControl, Validators } from '@angular/forms';

export const CATHEGORIESURL = 'http://localhost:3000/cathegories/';
export const PRIORITIESURL = 'http://localhost:3000/priorities/';
export const USERURL = 'http://localhost:3000/users/';
export const TASKURL = 'http://localhost:3000/tasks/';
export const FILTERFORM = {
  param: new FormControl(''),
  typeSelect: new FormControl(''),
};
export const AUTHCONTROLS = {
  login: [null, [Validators.required, Validators.pattern('[A-Za-zА-Яа-яЁё]*')]],
  password: [
    null,
    [Validators.required, Validators.pattern('[A-Za-zА-Яа-яЁё]*')],
  ],
};
export const TASKCONTROLS = {
  name: [null, [Validators.required, Validators.pattern('[A-Za-zА-Яа-яЁё]*')]],
  priority: [null, []],
  date: [null, [Validators.required]],
  cathegory: [null, []],
};
export const enum TYPES {
  author = 'Автор',
  priority = 'Приоритет',
  cathegory = 'Категория',
  name = 'Имя',
}
export const DEFAULTCATH = 'No Cathegory';
export const DEFAULTPRIOR = 'No priority';
export const enum TASK {
  author = 'author',
  priority = 'priority',
  id = 'id',
  name = 'name',
  cathegory = 'cathegory',
  date = 'date',
}
export const DISPLAYEDCOLUMNS: string[] = [
  'id',
  'name',
  'author',
  'cathegory',
  'priority',
  'date',
  'delete',
];
export const ENTERANIMATIONDURATION: string = '200ms';
export const EXITANIMATIONDURATION: string = '200ms';
export const DIALOGSTYLE = {
  width: 'auto',
  ENTERANIMATIONDURATION,
  EXITANIMATIONDURATION,
};
export const REDACTSTYLE = {
  width: '50%',
  ENTERANIMATIONDURATION,
  EXITANIMATIONDURATION,
};
export enum URLS {
  task = 'tasks',
  priority = 'priorities',
  cathegory = 'cathegories',
  user = 'users',
}
export const INTERCEPTORS: Boolean = true;
