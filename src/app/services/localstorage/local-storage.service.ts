import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
/**
 * @description abstraction over renderer localStorage
**/
export class LocalStorageService {

  constructor() { }

  /**
   * @description Toggle theme between dark and light
  **/
  public setTheme(className: string): void {
    localStorage.setItem('theme', className);
  }

  public get getTheme(): string {
    return localStorage.getItem('theme') || 'dark-theme';
  }

  /**
   * @type getter
   * @description Check weather the app is run first time
   * @returns Boolean
  **/
  get firstRun(): Boolean {
    const firstRun = localStorage.getItem('firstRun');
    if (firstRun && firstRun === 'true') return true;
    localStorage.setItem('firstRun', 'true');
    return false;
  }

}
