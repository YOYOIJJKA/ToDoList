import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  savePassword(value:string): void {
    localStorage.setItem('password',JSON.stringify(value));
  }
  getPassword():string {
    return JSON.parse(localStorage.getItem("password")!);
   }
   saveLogin(value:string):void {
    localStorage.setItem('login',JSON.stringify(value));
   }
   getLogin():string {
    return JSON.parse(localStorage.getItem("login")!);
   }
   clearStorage():void 
   {
    localStorage.removeItem("login");
    localStorage.removeItem("password");
   }
   
}
