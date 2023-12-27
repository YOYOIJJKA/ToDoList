import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  savePassword(value: string): void {
    localStorage.setItem('password', JSON.stringify(value));
  }
  getPassword(): string {
    return JSON.parse(localStorage.getItem('password')!);
  }
  saveLogin(value: string): void {
    localStorage.setItem('login', JSON.stringify(value));
  }
  getLogin(): string {
    return JSON.parse(localStorage.getItem('login')!);
  }
  setAuth(): void {
    localStorage.setItem('authorized', JSON.stringify(true));
  }
  checkAuth(): boolean {
    if (localStorage.getItem('authorized')) return true;
    else return false;
  }
  clearStorage(): void {
    localStorage.removeItem('login');
    localStorage.removeItem('password');
    localStorage.removeItem('authorized');
  }
}
